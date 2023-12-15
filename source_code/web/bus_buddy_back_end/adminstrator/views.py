import re
import logging
import stripe
from datetime import datetime
from decouple import config
from django.db.models import Q
from rest_framework.generics import UpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from account_manage.models import User
from normal_user.models import Bookings, BookedSeats, Payment, UserComplaints
from bus_owner.models import (
    Trip,
    Bus,
    Routes,
    StartStopLocations,
    PickAndDrop,
    Amenities,
    SeatDetails,
)
from bus_buddy_back_end.email import send_email_with_template
from bus_buddy_back_end.permissions import AllowAdminsOnly, AllowBusOwnerAndAdminsOnly
from .serializer import AdminUpdateSerializer as AUS
from .serializer import ListUserSerializer as LUS
from .serializer import ListUserComplaints as LUC
from .serializer import ComplaintResponseSerializer as CRS
from .serializer import BanUserSerializer as BUS
from .pagination import CustomPagination, ComplaintPagination


logger = logging.getLogger("django")


def mail_sent_response(mailfunction):
    # function which returns response based on bus owner approval along with mail confirmation
    logger.info("mail sent")
    if mailfunction:
        return Response({"success_code": "D2005"})
    else:
        return Response({"error_code": "D1014"}, status=400)


def bus_owner_approval(old_status, new_status, instance):
    """function to perform the bus owner approval

    Args:
        old_status (_type_): previous status
        new_status (_type_):  new status
        instance (_type_): current user instance

    Returns:
        _type_: _description_
    """
    if (
        old_status == 3 and new_status == 0
    ):  # if status change was from 3 to 0 then send mail to bus owner about approval
        subject = "You are Approved"
        context = {
            "recipient_name": instance.first_name,
        }
        recipient_list = [instance.email]
        mail_sent_response(
            send_email_with_template(
                subject=subject,
                context=context,
                recipient_list=recipient_list,
                template="bus_approval_template.html",
                status=2,
            )
        )


def ban_mail_forward(new_status, instance):
    recipient_list = [instance.email]
    if new_status == 2:
        mail_sent_response(
            send_email_with_template(
                subject="Account Banned",
                context={
                    "recipient_name": instance.first_name,
                },
                recipient_list=recipient_list,
                template="normal_user_account_ban_template.html",
                status=4,
            )
        )
    else:
        mail_sent_response(
            send_email_with_template(
                subject="Account Terminated",
                context={
                    "recipient_name": instance.first_name,
                },
                recipient_list=recipient_list,
                template="normal_user_account_delete_template.html",
                status=6,
            )
        )


def ban_normal_user(old_status, new_status, instance):
    """function to peform after operations after a normal user ban or user remove operation

    Args:
        old_status (_type_): previous status
        new_status (_type_): new status
        instance (_type_): user instance
    """
    stripe.api_key = config("STRIPE_API_KEY")
    if (
        (old_status == 0 and new_status == 2)
        or (old_status == 0 and new_status == 99)
        or (old_status == 2 and new_status == 99)
    ) and instance.role == 2:
        logger.info("Normal User ban/Delete After Process initiated")
        try:
            user_active_bookings = Bookings.objects.filter(
                user_id=instance.id, status=0
            )
            for active_booking in user_active_bookings:
                booked_seats = BookedSeats.objects.filter(booking=active_booking)
                payment_instance = Payment.objects.get(booking=active_booking)
                stripe.Refund.create(payment_intent=payment_instance.payment_intend)
                for seat in booked_seats:
                    seat.status = 1
                    seat.save()
                active_booking.status = 99
                active_booking.save()
                payment_instance.status = 3
                payment_instance.save()

            ban_mail_forward(new_status, instance)
            logger.info("Normal User Ban/Delete After Process Finished Sucessfully")
        except Exception as e:
            logger.warn(
                "Normal User Ban/Delete After Process failed Reason : " + str(e)
            )


def unban_user(old_status, new_status, instance):
    if old_status == 2 and new_status == 0:
        logger.info("User unban process initated")
        try:
            recipient_list = [instance.email]
            mail_sent_response(
                send_email_with_template(
                    subject="Account Reinstatement Notification",
                    context={
                        "recipient_name": instance.first_name,
                    },
                    recipient_list=recipient_list,
                    template="account_unban_template.html",
                    status=5,
                )
            )
            logger.info("User Unban Process Completed!")
        except Exception as e:
            logger.warn("User Unban Process Failed Reason :" + str(e))


def remove_bus_owner_trips(instance):
    logger.info("Removing trips")
    trip_instances = Trip.objects.filter(user_id=instance.id, status=0)
    for trip in trip_instances:
        active_bookings = Bookings.objects.filter(trip=trip, status=0)
        for active_booking in active_bookings:
            booked_seats = BookedSeats.objects.filter(booking=active_booking)
            payment_instance = Payment.objects.get(booking=active_booking)
            stripe.Refund.create(payment_intent=payment_instance.payment_intend)
            for seat in booked_seats:
                seat.status = 1
                seat.save()
            active_booking.status = 99
            active_booking.save()
            payment_instance.status = 3
            payment_instance.save()
        trip.status = 99
        trip.save()


def ban_bus_owner(old_status, new_status, instance):
    """function to peform after operations after a bus owner user ban

    Args:
       old_status (_type_): previous status
       new_status (_type_): new status
       instance (_type_): user instance
    """
    stripe.api_key = config("STRIPE_API_KEY")
    if old_status == 0 and new_status == 2 and instance.role == 3:
        logger.info("Bus owner ban initated")
        try:
            remove_bus_owner_trips(instance)
            recipient_list = [instance.email]
            mail_sent_response(
                send_email_with_template(
                    subject="Account Banned",
                    context={
                        "recipient_name": instance.first_name,
                    },
                    recipient_list=recipient_list,
                    template="bus_owner_account_ban_template.html",
                    status=4,
                )
            )
            logger.info("Bus Owner Ban After Process Finished Sucessfully")
        except Exception as e:
            logger.warn("Bus Owner Ban After Process failed Reason : " + str(e))


def remove_bus_owner_routes(instance):
    logger.info("Removing routes")
    route_instances = Routes.objects.filter(user_id=instance.id, status=0)
    for route in route_instances:
        start_stop_instances = StartStopLocations.objects.filter(route=route)
        for start_stop in start_stop_instances:
            pick_drop_instances = PickAndDrop.objects.filter(
                start_stop_location=start_stop
            )
            for pick_drop in pick_drop_instances:
                pick_drop.status = 99
                pick_drop.save()
            start_stop.status = 99
            start_stop.save()
        route.status = 99
        route.save()


def remove_bus_owner_buses(instance):
    logger.info("Removing buses")
    bus_instances = Bus.objects.filter(user_id=instance.id, status=0)
    for bus in bus_instances:
        amenities_instance = Amenities.objects.get(bus=bus)
        amenities_instance.status = 99
        amenities_instance.save()
        seat_details_instances = SeatDetails.objects.filter(bus=bus)
        for seat in seat_details_instances:
            seat.status = 99
            seat.save()
        bus.status = 99
        bus.save()


def remove_bus_owner(old_status, new_status, instance):
    stripe.api_key = config("STRIPE_API_KEY")
    if (
        (old_status == 0 and new_status == 99) or (old_status == 2 and new_status == 99)
    ) and instance.role == 3:
        try:
            logger.info("initiated bus owner removal")
            # deleting all trips of the bus owner with refund
            remove_bus_owner_trips(instance)
            # deleting all routes of the bus owner
            remove_bus_owner_routes(instance)
            # deleting all buses of the bus owner
            remove_bus_owner_buses(instance)
            recipient_list = [instance.email]
            mail_sent_response(
                send_email_with_template(
                    subject="Account Terminated",
                    context={
                        "recipient_name": instance.first_name,
                    },
                    recipient_list=recipient_list,
                    template="normal_user_account_delete_template.html",
                    status=6,
                )
            )
            logger.info("Bus Owner Removal After Process Finished Sucessfully")
        except Exception as e:
            logger.warn("Bus Owner Removal After Process failed Reason : " + str(e))


def update_status(self, user_id, status):
    # updates the status of the given user with the given status
    logger.info(
        "changing the status of user with id "
        + str(user_id)
        + " to status "
        + str(status)
    )
    try:
        instance = User.objects.get(id=user_id)
        if instance.role != 1:  # to prevent status change on admin accounts
            new_data = {"status": status}
            serializer = BUS(instance, data=new_data, partial=True)
            if serializer.is_valid():
                if status != instance.status:  # checks if status is already same
                    old_status = instance.status
                    self.perform_update(serializer)
                    logger.info("user status changed to " + str(status))
                    bus_owner_approval(old_status, status, instance)
                    ban_normal_user(old_status, status, instance)
                    ban_bus_owner(old_status, status, instance)
                    unban_user(old_status, status, instance)
                    remove_bus_owner(old_status, status, instance)
                    return Response({"success_code": "D2005"})
                else:
                    logger.info(
                        "user status is already " + str(status) + " no change needed"
                    )
                    return Response({"success_code": "D2006"})
            else:
                logger.warn(serializer.error_messages)
                return Response({"error_code": "D1002"})

        else:
            logger.warn("Operation can't be performed on admin account")
            return Response({"error_code": "D1013"}, status=400)

    except User.DoesNotExist:
        logger.warning("user with id " + str(user_id) + " Doesn't exist !")
        return Response({"error_code": "D1001"}, status=400)


class AdminProfileUpdation(UpdateAPIView):
    permission_classes = (AllowAdminsOnly,)

    def error_handling(self, email_error, phone_error):
        if (
            phone_error
        ):  # if phone error is number already exists send different error code
            if phone_error[0] == "D1008":
                logger.warn(phone_error[0])
                return Response({"error_code": phone_error[0]}, 400)
            else:
                logger.warn("phone number validation error")
                return Response({"error_code": "D1002"}, 400)
        if (
            email_error
        ):  # if email error is email already exists send different error code
            if email_error[0] == "D1007":
                logger.warn(email_error[0])
                return Response({"error_code": email_error[0]}, 400)
            else:
                logger.warn("email validation error")
                return Response({"error_code": "D1002"}, 400)
        else:
            logger.warn("validation error")
            return Response({"error_code": "D1002"}, 400)

    def get(self, request):
        #  gets the current user profile information
        try:
            user = User.objects.get(id=request.user.id)
            serialized_data = AUS(user)
            logger.info("displaying current admin profile information")
            return Response(serialized_data.data)
        except User.DoesNotExist:
            logger.warn("admin doesn't exist !")
            return Response({"error_code": "D1001"}, 400)

    def update(self, request):
        try:
            logger.info("trying to update admin profile id " + str(request.user.id))
            instance = User.objects.get(id=request.user.id)
            logger.info("accquired user instance for id " + str(request.user.id))
            current_data = request.data
            serializer = AUS(instance, data=current_data, partial=True)
            if serializer.is_valid():
                logger.info("validated incoming data")
                self.perform_update(serializer)
                logger.info("update performed successfully")
                return Response({"success_code": "D2002"})
            else:
                # error handling
                email_error = serializer._errors.get("email")  # gets email error
                phone_error = serializer._errors.get("phone")  # gets phone error
                return self.error_handling(
                    email_error=email_error, phone_error=phone_error
                )
        except User.DoesNotExist:
            return Response({"error_code": "D1001"}, status=400)

    def put(self, request):
        return self.update(request)


class ListUsers(APIView, CustomPagination):
    permission_classes = (AllowAdminsOnly,)

    def search_user(self, keyword, search_type):
        # function to search user by their first_name
        if search_type == "0":
            logger.info("Searching user with keyword '" + str(keyword) + "'")
            users = User.objects.filter(
                ~Q(role=1),
                ~Q(status=99),
                first_name__icontains=keyword,
            ).order_by("created_date")
            return users
        else:
            logger.info("Searching bus owner with keyword '" + str(keyword) + "'")
            users = User.objects.filter(
                ~Q(status=99),
                ~Q(status=0),
                role=3,
                first_name__icontains=keyword,
            ).order_by("created_date")
            return users

    def ordering(self, order):
        current_ordering = "created_date"
        if order:
            if order == "1":
                current_ordering = "-first_name"
                logger.info("ordering list by descending order")

            elif order == "0":
                current_ordering = "first_name"
                logger.info("ordering list by ascending order")

            elif order == "-1":
                current_ordering = "created_date"
                logger.info("default ordering")
            else:
                current_ordering = "created_date"
                logger.warn("invalid order given reverting to default ordering")

        return current_ordering

    def getUsersbyStatus(self, status, order):
        # function to get user's based on thier status
        current_ordering = self.ordering(order)
        if status == "0":
            users = User.objects.filter(~Q(role=1), ~Q(status=99), status=0).order_by(
                current_ordering
            )
            logger.info("sort by unbanned users")
        elif status == "2":
            users = User.objects.filter(~Q(role=1), ~Q(status=99), status=2).order_by(
                current_ordering
            )
            logger.info("sort by banned users")
        elif status == "3":
            users = User.objects.filter(~Q(role=1), ~Q(status=99), status=3).order_by(
                current_ordering
            )
            logger.info("sort by unapproved bus owners users")
        return users

    def get(self, request):
        # extract query parameters
        keyword = request.GET.get("keyword")
        order = request.GET.get("order")
        status = request.GET.get("status")
        search_type = request.GET.get("type")
        # validate and handle query parameters
        if keyword and search_type in {"0", "1"}:
            users = self.search_user(keyword, search_type)
        elif status in {"0", "2", "3"}:
            users = self.getUsersbyStatus(status, order)
        else:
            users = User.objects.filter(~Q(role=1), ~Q(status=99)).order_by(
                self.ordering(order)
            )

        # Serialize and return response
        serialized_data = LUS(
            CustomPagination.paginate_queryset(self, queryset=users, request=request),
            many=True,
        )

        # Logging
        logger.info(f"Returned user list with {self.page.paginator.count} entries")

        return Response(
            {
                "users": serialized_data.data,
                "pages": self.page.paginator.num_pages,
                "current_page": self.page.number,
                "has_previous": self.page.has_previous(),
                "has_next": self.page.has_next(),
                "total_count": self.page.paginator.count,
            }
        )


class BanUser(UpdateAPIView):
    # function to ban user
    permission_classes = (AllowAdminsOnly,)

    def update(self, request, user_id):
        return update_status(self, user_id, 2)

    def put(self, request, user_id):
        logger.info("Baning User with id " + str(user_id))
        return self.update(request, user_id)


class UnBanUser(UpdateAPIView):
    # function to unban user
    permission_classes = (AllowAdminsOnly,)

    def update(self, request, user_id):
        return update_status(self, user_id, 0)

    def put(self, request, user_id):
        logger.info("Unbaning User with id " + str(user_id))
        return self.update(request, user_id)


class RemoveUser(UpdateAPIView):
    # function to remove user
    permission_classes = (AllowAdminsOnly,)

    def update(self, request, user_id):
        return update_status(self, user_id, 99)

    def put(self, request, user_id):
        logger.info("Removing Bus Owner with id " + str(user_id))
        return self.update(request, user_id)


class ApproveBusOwner(UpdateAPIView):
    permission_classes = (AllowAdminsOnly,)

    def update(self, request, user_id):
        # only perform update if the given user is a bus owner
        try:
            user = User.objects.get(id=user_id)
            if user.role == 3:
                return update_status(self, user_id, 0)
            else:
                return Response({"error_code": "D1012"}, status=400)
        except User.DoesNotExist:
            return Response({"error_code": "D1001"}, status=400)

    def put(self, request, user_id):
        logger.info("Approving Bus Owner with id " + str(user_id))
        return self.update(request, user_id)


class ViewUserComplaints(APIView, ComplaintPagination):
    permission_classes = (AllowBusOwnerAndAdminsOnly,)

    def validate_date(self, from_date, to_date):
        """function to validate date given as query param

        Args:
            from_date (string): from date
            to_date (string): to date
        Returns:
            _type_: _description_
        """
        if from_date and to_date:
            logger.info("Date argument provided")
            pattern = re.compile(r"^\d{4}-\d{2}-\d{2}$")
            if bool(pattern.match(from_date)) and bool(pattern.match(to_date)):
                from_val = datetime.strptime(from_date, "%Y-%m-%d")
                to_val = datetime.strptime(to_date, "%Y-%m-%d")
                if from_val <= to_val:
                    logger.info("Date validated Successfully")
                    return {"status": True, "code": "00000"}
                else:
                    logger.warn("Start date cant be after end date")
                    return {"status": False, "code": "D1018"}
            else:
                logger.warn("Date validated Failed")
                return {"status": False, "code": "D1006"}
        else:
            logger.info("Date argument not provided")
            return {"status": False, "code": "00000"}

    def validate_responded(self, responded):
        """function to validate responded argument given as query param

        Args:
            responded (string): responded argument

        Returns:
            _type_: _description_
        """
        if responded:
            logger.info("Responded argument provided")
            if responded == "0" or responded == "1":
                logger.info("Responded argument validated Successfully")
                return {"status": True, "code": "00000"}
            else:
                logger.warn("Responded argument validated Failed")
                return {"status": False, "code": "D1006"}
        else:
            logger.info("Responded argument not provided")
            return {"status": False, "code": "00000"}

    def get(self, request):
        """function to return complaints based on users

        Args:
            request (_type_): _description_

        Returns:
            _type_: _description_
        """
        from_date = request.GET.get("from_date")  # to filter by a date
        to_date = request.GET.get("to_date")
        responded = request.GET.get(
            "responded"
        )  # to filter by responded complaints and not responded complaints

        # validate query params
        validated_date = self.validate_date(from_date, to_date)
        validated_responded = self.validate_responded(responded)

        if validated_date["status"]:
            if validated_responded["status"]:
                complaint_instances = UserComplaints.objects.filter(
                    created_date__range=(from_date, to_date),
                    complaint_for_id=request.user.id,
                    status=responded,
                ).order_by("-id")
            else:
                complaint_instances = UserComplaints.objects.filter(
                    created_date__range=(from_date, to_date),
                    complaint_for_id=request.user.id,
                ).order_by("-id")
        elif validated_responded["status"]:
            complaint_instances = UserComplaints.objects.filter(
                complaint_for_id=request.user.id, status=responded
            ).order_by("-id")
        else:
            complaint_instances = UserComplaints.objects.filter(
                complaint_for_id=request.user.id
            ).order_by("-id")

        # error handling
        if validated_date["code"] == "D1006" or validated_responded["code"] == "D1006":
            return Response({"error_code": "D1006"}, status=400)
        elif validated_date["code"] == "D1018":
            return Response({"error_code": "D1018"})
        # Serialize and return response
        serialized_data = LUC(
            ComplaintPagination.paginate_queryset(
                self, queryset=complaint_instances, request=request
            ),
            many=True,
        )
        return Response(
            {
                "complaints": serialized_data.data,
                "pages": self.page.paginator.num_pages,
                "current_page": self.page.number,
                "has_previous": self.page.has_previous(),
                "has_next": self.page.has_next(),
                "total_count": self.page.paginator.count,
            }
        )
class SendComplaintResponse(UpdateAPIView):
    permission_classes = (AllowBusOwnerAndAdminsOnly,)
    def update(self, request, complaint_id):
        """function to send complaint response

        Args:
            request (_type_): _description_
            complaint_id (_type_): _description_

        Returns:
            _type_: _description_
        """
        try:
            # gets the existing complaint instance
            complaint_instance = UserComplaints.objects.get(id=complaint_id)
            # updated status along with response statement
            new_data = {"status": 1,"response":request.data.get("response")}
            serialized_data = CRS(complaint_instance,data=new_data, partial=True)
            if serialized_data.is_valid():
                # only perform response if responded user is the intended user
                if complaint_instance.complaint_for_id == request.user.id:
                    # only perform response if not responded earlier 
                    if complaint_instance.status ==0: 
                        self.perform_update(serialized_data)
                        logger.info("Responsed to Complaint successfully")
                        return Response({"success_code": "D2010"})
                    else:
                        logger.warn("Cannot Respond to the complaint that is already responded")
                        return Response({"error_code": "D1020"})    
                else:
                    logger.info("Cannot Respond to the comment for the current user")
                    return Response({"error_code": "D2022"})    
            else:
                logger.warn("Validation Failed Reason "+str(serialized_data.errors))
                return Response({"error_code":"D1002"})
        except UserComplaints.DoesNotExist:
            logger.warn("Complaint with given id doesn't exising")
            return Response({"error_code":"D1021"})         
        except Exception as e:
            logger.warn("Responding to Complaint Failed Reason : "+str(e))
            return Response({"error_code":"D1019"},status=400)     
                
            
            
    def put(self,request,complaint_id):
         return self.update(request,complaint_id)
        
        
        