import stripe
import pytz
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter

from datetime import datetime
from decouple import config

from account_manage.models import User
from normal_user.models import Bookings, Payment, BookedSeats, UserReview
from bus_owner.models import (
    SeatDetails,
    Trip,
    PickAndDrop,
    StartStopLocations,
)
from bus_buddy_back_end.permissions import AllowNormalUsersOnly
from .serializer import UserModelSerializer as UMS
from .serializer import UserDataSerializer as UDS
from .serializer import BookingHistoryDataSerializer as BHDS
from .serializer import (
    SeatDetailsViewSerialzer,
    PickAndDropSerializer,
    BookSeatSerializer,
    CancelBookingSerializer,
    CostSerializer,
    CancelTravellerDataSerializer,
    ReviewTripSerializer,
    ViewReviewTripSerializer,
    UpdateReviewTripSerializer,
)
from bus_buddy_back_end.email import (
    send_email_with_attachment,
    send_email_with_template,
)
from bus_buddy_back_end.utils import render_template, convert_template_to_pdf
import random
import os
import logging

logger = logging.getLogger("django")

date_format = "%Y-%m-%d"


def mail_sent_response(mailfunction):
    if mailfunction:
        logger.info("booking cancelled mail sent")
        return "mail send successfully"
    else:
        logger.info("booking cancelled mail failed")
        return "mail send failed"


class ViewSeats(ListAPIView):
    """
    For viewing seat details in a trip

    Args:
        trip_id (integer): id of the trip

    Returns:
        json: pick and drop and complete seat details corresponding to the trip id
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        trip_id = request.GET.get("trip_id")
        start_location = request.GET.get("start_location")
        end_location = request.GET.get("end_location")

        try:
            trip = Trip.objects.get(id=trip_id)
            serializer = SeatDetailsViewSerialzer(
                SeatDetails.objects.filter(
                    bus_id=trip.bus_id
                ),  # data from seat details with bus id from trip table
                context={"trip_id": trip_id},
                many=True,
            )

            # finding pick up points
            start = StartStopLocations.objects.get(
                location__in=[start_location], route_id=trip.route
            )
            pick = PickAndDrop.objects.filter(start_stop_location=start)
            pick_serializer = PickAndDropSerializer(pick, many=True)

            # finding drop off points
            stop = StartStopLocations.objects.get(
                location__in=[end_location], route_id=trip.route
            )
            drop = PickAndDrop.objects.filter(start_stop_location=stop)
            drop_serializer = PickAndDropSerializer(drop, many=True)

            pick_and_drop_array = []
            pick_and_drop_array.append(pick_serializer.data)
            pick_and_drop_array.append(drop_serializer.data)
            total_data = (
                pick_and_drop_array + serializer.data
            )  # both seat data and pick and drop data
            logger.info(total_data)
            return Response(total_data, status=200)
        except Exception as e:
            return Response("errors:" f"{e}", status=400)


class RegisterUser(APIView):
    """
    For registering a user locally
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            serialized_data = UMS(data=request.data)
            if serialized_data.is_valid():
                serialized_data.save()
                logger.info("user registered")
                return Response({"message": "registration successfull"}, status=201)
            else:
                logger.info(serialized_data.errors)
                return Response(serialized_data.errors, status=200)
        except Exception as e:
            logger.info(e)
            return Response("errors:" f"{e}", status=400)


class UpdateProfile(UpdateAPIView):
    """
    For displaying and updating user details
    """

    permission_classes = (AllowNormalUsersOnly,)

    def get(self, request):
        try:
            user_id = request.user.id  # get id using token
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(status=404)

        serialized_data = UDS(user)
        logger.info(serialized_data.data)
        return Response(serialized_data.data)

    def update(self, request):
        try:
            if request.user.id:
                user_id = request.user.id  # get id using token
                instance = User.objects.get(id=user_id)
                current_data = request.data
                serializer = UMS(instance, data=current_data, partial=True)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
                logger.info(serializer.data)
                return Response({"message": "profile updated succesfully"}, status=200)
            else:
                logger.info(serializer.errors)
                return Response(serializer.errors, status=400)
        except Exception as e:
            logger.info(e)
            return Response("errors:" f"{e}", status=400)

    def put(self, request):
        return self.update(request)


class CustomPagination(PageNumberPagination):
    """
    For paginating the query set
    """

    page_size = 5
    page_size_query_param = "page_size"

    def get_paginated_response(self, data):
        return Response(
            {
                "page_size": self.page_size,
                "total_objects": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "current_page_number": self.page.number,
                "has_next": self.page.has_next(),
                "next": self.get_next_link(),
                "has_previous": self.page.has_previous(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        )


class BookingHistory(ListAPIView):
    """
    For viewing the user's booking history
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = BHDS
    pagination_class = CustomPagination

    def list(self, request):
        user_id = request.user.id
        status = request.GET.get("status")
        try:
            if status in {"0", "1", "99"}:
                queryset = Bookings.objects.filter(user=user_id, status=status)
            else:
                queryset = Bookings.objects.filter(user=user_id)

            serializer = BHDS(queryset)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            logger.info(serializer.data, "bookimg history")
            return Response(serializer.data)

        except ValueError:
            logger.info(serializer.errors)
            return Response(serializer._errors)


class ViewTrip(APIView):
    def filter_query(self, seat_type, bus_type, bus_ac):
        """function to add where clause
        according to params passed in the
        url"""
        condition = " where"
        count = 0
        if seat_type != "-1":
            condition = condition + " b.bus_seat_type = " + str(seat_type)
            count = count + 1
        if bus_type != "-1":
            if count > 0:
                condition = condition + " and  b.bus_type = " + str(bus_type)
                count = count + 1
            else:
                condition = condition + " b.bus_type = " + str(bus_type)
                count = count + 1
        if bus_ac != "-1":
            if count > 0:
                condition = condition + " and  b.bus_ac = " + str(bus_ac)
                count = count + 1
            else:
                condition = condition + " b.bus_ac = " + str(bus_ac)
                count = count + 1

        return condition

    def validate_params(
        self,
        start_location,
        end_location,
        date,
        seat_type,
        bus_type,
        bus_ac,
        page_number,
    ):
        """function to validate the query params to ensure sanity"""
        try:
            if (
                start_location.isdigit()
                and end_location.isdigit()
                and page_number.isdigit()
                and seat_type.strip("-").isdigit()
                and bus_type.strip("-").isdigit()
                and bus_ac.strip("-").isdigit()
                and bool(datetime.strptime(date, date_format))
                and start_location != end_location
            ):
                logger.info("query param validation suceeded")
                return True
            else:
                return False
        except ValueError:
            return False
        except AttributeError:
            return False
        except TypeError:
            return False

    def get(self, request):
        """Function to display trips to user based on search"""
        ITEMS_PER_PAGE = 10  # no of items to be display in page

        # storing query params
        start_location = request.GET.get("start")
        end_location = request.GET.get("end")
        date = request.GET.get("date")
        seat_type = request.GET.get("seat-type", "-1")
        bus_type = request.GET.get("bus-type", "-1")
        bus_ac = request.GET.get("bus-ac", "-1")
        page_number = request.GET.get("page", 1)

        if self.validate_params(
            start_location,
            end_location,
            date,
            seat_type,
            bus_type,
            bus_ac,
            page_number,
        ):
            query = """
            SELECT s.id, s.route_id, s.arrival_time as start_arrival_time,
                e.arrival_time as end_arrival_time,
                s.arrival_date_offset as start_offset,
                e.arrival_date_offset as end_offset,
                r.via, (r.travel_fare+seat_details.cost) as starting_cost,
                DATE_ADD(t.start_date,INTERVAL s.arrival_date_offset DAY) as start_date,
                DATE_ADD(t.start_date,INTERVAL e.arrival_date_offset DAY) as end_date,
                t.id as trip_id, b.bus_name, b.id as bus_id, u.company_name,
                am.emergency_no,am.water_bottle,am.charging_point,am.usb_port,am.blankets,
                am.reading_light,am.toilet,am.snacks,am.tour_guide,am.cctv,am.pillows,r.travel_fare as route_cost, u.extra_charges as gst
            FROM start_stop_locations s
            INNER JOIN start_stop_locations e
            ON s.route_id = e.route_id and s.location_id=%s and e.location_id=%s and s.seq_id < e.seq_id 
            LEFT JOIN routes r
            ON r.id = s.route_id and r.status = 0
            INNER JOIN trip t
            ON t.route_id = s.route_id and
            t.start_date = (SELECT DATE_ADD(%s, INTERVAL -s.arrival_date_offset DAY)) and
            t.status = 0
            INNER JOIN bus b
            ON b.id = t.bus_id and b.status = 0 and b.bus_details_status = 2
            INNER JOIN user u
            ON b.user_id = u.id
            INNER JOIN amenities am
            ON am.bus_id = b.id
            INNER JOIN (select bus_id, min(seat_cost) as cost from seat_details group by bus_id) as seat_details
            ON seat_details.bus_id = b.id
        """
            if seat_type != "-1" or bus_type != "-1" or bus_ac != "-1":
                # if any query params provided filter the query
                query = query + self.filter_query(seat_type, bus_type, bus_ac)

            result = StartStopLocations.objects.raw(
                query, [start_location, end_location, date]
            )
            trip_list = []
            desired_timezone = pytz.timezone("Asia/Kolkata")
            # Get the current time in the specified timezone
            current_time = datetime.now(desired_timezone).time()
            current_date = datetime.now(desired_timezone).date()
            for data in result:
                if (
                    current_date == data.start_date
                    and current_time > data.start_arrival_time
                ):
                    logger.info(
                        "Trip with id "
                        + str(data.trip_id)
                        + " skipped since current time passed start time"
                    )
                else:
                    trip_data = {
                        # stores each trip information
                        "route": data.route_id,
                        "start_location_arrival_time": data.start_arrival_time,
                        "end_location_arrival_time": data.end_arrival_time,
                        "start_location_arrival_date": data.start_date,
                        "end_location_arrival_date": data.end_date,
                        "via": data.via,
                        "travel_fare": data.starting_cost,
                        "trip": data.trip_id,
                        "bus_name": data.bus_name,
                        "bus": data.bus_id,
                        "company_name": data.company_name,
                        "route_cost": data.route_cost,
                        "gst": data.gst,
                        "amenities": {
                            "emergency_no": data.emergency_no,
                            "water_bottle": data.water_bottle,
                            "charging_point": data.charging_point,
                            "usb_port": data.usb_port,
                            "blankets": data.blankets,
                            "pillows": data.pillows,
                            "reading_light": data.reading_light,
                            "toilet": data.toilet,
                            "snacks": data.snacks,
                            "tour_guide": data.tour_guide,
                            "cctv": data.cctv,
                        },
                    }
                    # adds each trip data to a trip list
                    trip_list.append(trip_data)

            paginator = Paginator(trip_list, ITEMS_PER_PAGE)  # pagination for trips

            try:
                current_page = paginator.page(page_number)
            except EmptyPage:  # if page doesn't exist status is set to no content
                logger.warn("Page requested is Empty !")
                return Response({}, status=204)
            paginated_data = {
                "total_pages": paginator.num_pages,
                "total_items": paginator.count,
                "items_per_page": ITEMS_PER_PAGE,
                "current_page": current_page.number,
                "has_previous": current_page.has_previous(),
                "has_next": current_page.has_next(),
                "data": list(current_page),
            }
            logger.info("returned trip list total entries :" + str(paginator.count))
            return Response(paginated_data)
        else:
            logger.warn("request failed ! reason : invalid query params")
            return Response({"error_code": "D1006"}, status=400)


class BookSeat(APIView):
    """
    For booking seats

    Returns:
        json : success message
    """

    permission_classes = (IsAuthenticated,)

    def refund_if_booking_fail(self, payment_intent, user):
        """function to refund payment if booking failed

        Args:
            payment_intent (_type_): payment_intent to be refunded
        """
        stripe.api_key = config("STRIPE_API_KEY")
        if payment_intent:
            logger.info("payment Intent to be Refunded :" + payment_intent)
            try:
                stripe.Refund.create(payment_intent=payment_intent)
                logger.info("Refund Initiated for Failed Booking")
                subject = "Booking Failed"
                context = {
                    "recipient_name": user.first_name,
                }
                recipient_list = [user.email]
                send_email_with_template(  # sends a mail to customer about failed booking
                    subject=subject,
                    context=context,
                    recipient_list=recipient_list,
                    template="booking_fail.html",
                    status=3,
                )
                return True
            except Exception as e:
                logger.error("Refund Initiation Failed Reason :" + str(e))
                return False
        else:
            logger.error(" Refund Failed payment Intent is empty ")
            return False

    def get_context_for_ticket_template(self, request, request_data):
        # getting objects
        trip = Trip.objects.get(id=request_data["trip"])
        bus = trip.bus
        owner = bus.user
        route = trip.route
        route_start = route.start_point
        route_end = route.end_point
        pick_up = PickAndDrop.objects.get(id=request_data["pick_up"])
        drop_off = PickAndDrop.objects.get(id=request_data["drop_off"])

        # getting seat ids and objects
        seats = []
        for data in request_data["booked_seats"]:
            seats.append(data["seat"])
        seat_objects = []
        for seat in seats:
            seat_objects.append(SeatDetails.objects.get(id=seat))

        # total seat cost
        seat_cost = 0
        for data in seat_objects:
            seat_cost = seat_cost + data.seat_cost

        # getting required data
        context = {
            "booking_id": request_data["booking_id"],
            "recipient": request.user.first_name,
            "pick_up": {"point": pick_up.bus_stop, "time": pick_up.arrival_time},
            "drop_off": {"point": drop_off.bus_stop, "time": drop_off.arrival_time},
            "trip_start": trip.start_date,
            "bus": bus.bus_name,
            "route": {"from": route_start.location_name, "to": route_end.location_name},
            "travellers": request_data["booked_seats"],
            "seat_cost": float(seat_cost),
            "route_cost": float(route.travel_fare),
            "gst": owner.extra_charges,
            "total": (
                float(seat_cost) + float(route.travel_fare) + owner.extra_charges
            ),
        }
        return context

    def post(self, request):
        user_id = request.user.id
        role = request.user.role
        now = datetime.now()
        today = now.strftime(date_format)
        year_string = now.strftime("%Y")
        random_number = random.randrange(0, 9999)
        request_data = request.data.copy()

        try:
            if role == 2:
                request_data["user"] = user_id
                request_data["booking_id"] = (
                    "BK" + str(user_id) + "YR" + year_string + str(random_number)
                )  # for generating unique booking id
                serializer = BookSeatSerializer(data=request_data)
                if serializer.is_valid():
                    serializer.save()
                    # path of the folder
                    current_dir = os.path.dirname(os.path.abspath(__file__))
                    parent_dir = os.path.dirname(current_dir)
                    templates_folder = os.path.join(parent_dir, "templates")

                    template_file = "ticket_format.html"
                    context = self.get_context_for_ticket_template(
                        request, request_data
                    )

                    template = render_template(templates_folder, template_file, context)

                    subject = "Booking Confirmation - Bus Buddy"
                    message = (
                        message
                    ) = f"Dear {request.user.first_name},\n\nThank you for choosing Bus Buddy for your travel needs! We're excited to confirm your booking with booking ID: {request_data['booking_id']} has been successful.\n\nYour ticket is attached to this email. Please ensure you have it with you during your journey. If you have any questions or need further assistance, feel free to reach out to us.\n\nSafe travels, and thank you for using Bus Buddy!\n\nBest regards,\nBus Buddy Team"

                    recipient_list = [request.user.email]
                    pdf_content = convert_template_to_pdf(template)
                    pdf_filename = f"{request.user.first_name}_ticket_{today}.pdf"
                    content_type = "application/pdf"
                    email_send = send_email_with_attachment(
                        subject,
                        message,
                        recipient_list,
                        pdf_content,
                        pdf_filename,
                        content_type,
                        status=0,
                    )

                    if email_send:
                        logger.info("seat booked and email send")
                        return Response(
                            {"message": "Seat booked successfully"}, status=201
                        )
                    else:
                        logger.error("seat booked and email send failled")
                        return Response(
                            {
                                "message": "Seat booked successfully",
                                "email": "Failed to send email",
                            },
                            status=201,
                        )
                else:
                    logger.info(serializer.errors)
                    return Response(
                        {
                            "error": str(serializer.errors),
                            "refund_performed": self.refund_if_booking_fail(
                                request_data.get("payment").get("payment_intend"),
                                request.user,
                            ),
                        },
                        status=400,
                    )
            else:
                return Response(
                    {
                        "error": "Unauthorized",
                        "refund_performed": self.refund_if_booking_fail(
                            request_data.get("payment").get("payment_intend"),
                            request.user,
                        ),
                    },
                    status=401,
                )
        except Exception as e:
            logger.info(e)
            return Response(
                {
                    "error:": str(e),
                    "refund_performed": self.refund_if_booking_fail(
                        request_data.get("payment").get("payment_intend"), request.user
                    ),
                },
                status=400,
            )


class CancelBooking(UpdateAPIView):
    """
    For cancelling booking

    Args:
        booking_id (int): query param for identifying booking

    Returns:
        json : success message
    """

    permission_classes = (IsAuthenticated,)

    def refund(self, booking_id):
        """function to provide refund once booking is cancelled

        Args:
            booking_id (_type_): the id of the booking to be cancelled

        Returns:
        Boolean: True =>refund sucessful False => refund faild
        """
        stripe.api_key = config("STRIPE_API_KEY")
        desired_timezone = pytz.timezone("Asia/Kolkata")
        current_time = datetime.now(desired_timezone)
        try:
            payment_instance = Payment.objects.get(booking_id=booking_id, status=0)
            payment_intent = payment_instance.payment_intend
            try:
                booking_instance = Bookings.objects.get(id=booking_id)
                total_amount = booking_instance.total_amount
                trip = booking_instance.trip
                trip_time = datetime.combine(
                    trip.start_date,
                    trip.start_time,
                    tzinfo=pytz.timezone("Asia/kolkata"),
                )
                hour_difference = abs(current_time - trip_time)
                logger.info("time difference " + str(hour_difference))
                if trip_time.date() <= current_time.date():
                    logger.info(
                        "No refund initiated for booking id : " + str(booking_id)
                    )
                    return {"status": True, "code": "D2008"}
                elif hour_difference > timedelta(hours=48):
                    stripe.Refund.create(payment_intent=payment_intent)
                    logger.info("refund initiated for booking id : " + str(booking_id))
                    payment_instance.status = (
                        3  # updating status of payment from paid to refund
                    )
                    payment_instance.save()
                    return {"status": True, "code": "D2007"}
                else:
                    refund_amount = int((total_amount / 2) * 100)
                    logger.info("Amount refundable in paisa :" + str(refund_amount))
                    stripe.Refund.create(
                        payment_intent=payment_intent, amount=refund_amount
                    )
                    logger.info(
                        "partial refund initiated for booking id : " + str(booking_id)
                    )
                    payment_instance.status = (
                        3  # updating status of payment from paid to refund
                    )
                    payment_instance.save()
                    return {"status": True, "code": "D2009"}
            except Exception as e:
                logger.warn("Stripe Refund Creation Failed ! Reason :" + str(e))
                return {"status": False, "code": "ERROR"}
        except Payment.DoesNotExist:
            logger.warn(
                "Cancel booking failed ! Reason : No entry for booking_id : "
                + str(booking_id)
                + "in payment table"
            )
            return {"status": False, "code": "ERROR"}

    def send_mail(self, first_name, booking_id, email, code, now):
        today = now.strftime(date_format)
        subject = "Booking Cancellation Confirmation - Bus Buddy"
        template = "cancel_booking_confirmation.html"
        no_refund_template = "cancel_booking_confirmation_no_refund.html"
        partial_refund_template = "cancel_booking_confirmation_partial_refund.html"
        context = {
            "recipient_name": first_name,
            "booking_id": booking_id,
            "cancellation_date": today,
        }
        recipient_list = [email]
        if code == "D2008":
            email_send = send_email_with_template(
                subject, no_refund_template, context, recipient_list, status=1
            )
        elif code == "D2009":
            email_send = send_email_with_template(
                subject, partial_refund_template, context, recipient_list, status=1
            )
        else:
            email_send = send_email_with_template(
                subject, template, context, recipient_list, status=1
            )

        email = mail_sent_response(email_send)
        return email

    def cancelBooking(self, request, now, booking_id, instance):
        # for cancelling already booked id
        booked_seats = BookedSeats.objects.filter(booking=booking_id)
        status_data = {"status": 99}  # status 99 denotes the cancelled bookings
        booked_status = {"status": 1}  # status 1 denotes the seat is available
        serializer = CancelBookingSerializer(instance, data=status_data, partial=True)
        if serializer.is_valid(raise_exception=True):
            refund_result = self.refund(booking_id=booking_id)
            if refund_result["status"]:
                for object in booked_seats:
                    sub_serializer = CancelTravellerDataSerializer(
                        object, data=booked_status, partial=True
                    )
                    if sub_serializer.is_valid():
                        self.perform_update(sub_serializer)
                self.perform_update(serializer)
                code = refund_result["code"]
                message = "Booking cancelled successfully"
                logger.info("Booking cancelled successfully")
                email = self.send_mail(
                    first_name=request.user.first_name,
                    booking_id=booking_id,
                    email=request.user.email,
                    code=code,
                    now=now,
                )
                return (message, email, code)
            else:
                logger.warn("Cancelation Failed")
                code = "D1017"
                email = mail_sent_response(
                    False
                )  # mail will not be send for failed cancellation
                message = "Booking Cancelling Failed"
                return (message, email, code)

        else:
            logger.info(serializer.errors)
            return serializer.errors

    def update(self, request):
        booking_id = int(request.GET.get("booking_id"))
        now = datetime.now()
        try:
            if booking_id <= 0:
                return Response({"error": "Invalid booking id"})
            else:
                instance = Bookings.objects.get(id=booking_id)
                if instance.user != request.user:
                    logger.info("another user")
                    return Response({"error": "Unauthorized user"})
                elif instance.status == 99:
                    logger.info("already cancelled booking")
                    return Response({"message": "Booking is already cancelled"})
                elif request.user.role != 2:
                    logger.info("not a user")
                    return Response({"error": "Unauthorized user"})
                else:
                    message, email, code = self.cancelBooking(
                        request, now, booking_id, instance
                    )
                    return Response(
                        {"message": message, "email": email, "code": code}, status=200
                    )
        except Exception as e:
            logger.info(e)
            return Response("errors:" f"{e}", status=400)


class CreatePaymentIntent(APIView):
    """
    api to create payment Intent for stripe
    """

    permission_classes = (AllowNormalUsersOnly,)
    stripe.api_key = config("STRIPE_API_KEY")

    def post(self, request):
        serialized_data = CostSerializer(data=request.data)
        if serialized_data.is_valid():
            total_cost = serialized_data._validated_data["total_cost"]
            try:
                # creates the payment Intent
                intent = stripe.PaymentIntent.create(
                    amount=int(total_cost * 100),  # to convert rupee to paise
                    currency="inr",
                    receipt_email=request.user.email,
                    payment_method_types=["card"],
                    description="Bus ticket Booking",
                )
                logger.info("PaymentIntent Created !")
                return Response({"client_secret": intent.client_secret}, status=200)
            except Exception as e:
                logger.warn("Payment Intent Creation Failed ! Reason :" + str(e))
                return Response({"error_code": "D1016"}, status=400)
        else:
            logger.warn("Serializer validation Failed")
            logger.warn(serialized_data.errors)
            return Response({"error_code": "D1002"}, status=400)


class ReviewTrip(APIView):
    """
    API for reviewing a completed trip

    Args:
        booking_id (int): query param for identifying booking

    """

    permission_classes = (AllowNormalUsersOnly,)

    def post(self, request):
        booking_id = request.GET.get("booking_id")
        request_data = request.data.copy()
        request_data["user_id"] = request.user.id
        request_data["booking_id"] = booking_id
        try:
            booking = Bookings.objects.get(user=request_data["user_id"], id=booking_id)
            request_data["trip_id"] = booking.trip.id
            if booking.trip.status == 1 and booking.status == 1:
                serialized_data = ReviewTripSerializer(data=request_data)
                if serialized_data.is_valid():
                    serialized_data.save()
                    logger.info("Review added")
                    return Response({"message": "Review successfull"}, status=201)
                else:
                    logger.error(f"Review serializer error: {serialized_data.errors}")
                    return Response({"error": serialized_data.errors}, status=400)
            else:
                if booking.trip.status != 1:
                    return Response(
                        {"message": "Trip is pending or cancelled "},
                        status=400,
                    )
                else:
                    return Response(
                        {"message": "Booking is pending or cancelled"},
                        status=400,
                    )
        except Bookings.DoesNotExist:
            logger.error("Review trip id exception")
            return Response({"error": "Booking doesn't belong to user"}, status=400)

        except Exception as e:
            logger.error(f"Review exception {e}")
            return Response({"error": e}, status=400)


class HistoryReviewTrip(ListAPIView):
    permission_classes = (AllowNormalUsersOnly,)
    serializer_class = ViewReviewTripSerializer
    pagination_class = CustomPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ["review_title"]

    def list(self, request):
        user_id = request.user.id
        try:
            queryset = UserReview.objects.filter(user_id=user_id)

            serializer = ViewReviewTripSerializer(queryset)
            queryset = self.filter_queryset(queryset)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            logger.info(serializer.data, "review history")
            return Response(serializer.data)

        except Exception as e:
            logger.error(str(e))
            return Response({"error": "An error occurred"}, status=400)


class UpdateReviewTrip(UpdateAPIView):
    """
    API for updating a review

    Args:
        review_id (int): query param for identifying review

    """

    permission_classes = (AllowNormalUsersOnly,)

    def get(self, request):
        review_id = request.GET.get("review_id")
        user = request.user.id

        try:
            if review_id and review_id.isdigit():
                review = UserReview.objects.get(id=review_id, user_id=user)
                serialized_data = ViewReviewTripSerializer(review)
            else:
                return Response({"error": "Invalid review_id"}, status=400)
        except UserReview.DoesNotExist:
            return Response({"error": "Review not found"}, status=404)

        logger.info(serialized_data.data)
        return Response(serialized_data.data)

    def update(self, request):
        review_id = request.GET.get("review_id")
        user = request.user.id

        try:
            instance = UserReview.objects.get(id=review_id, user_id=user)
            current_data = request.data.copy()
            serializer = UpdateReviewTripSerializer(
                instance, data=current_data, partial=True
            )
            if serializer.is_valid(raise_exception=True):
                self.perform_update(serializer)
                logger.info(serializer.data)
                return Response({"message": "review updated succesfully"}, status=200)
            else:
                logger.info(serializer.errors)
                return Response(serializer.errors, status=400)
        except UserReview.DoesNotExist as e:
            logger.info(e)
            return Response({"errors": "Review not found"}, status=404)

        except Exception as e:
            logger.info(e)
            return Response("errors:" f"{e}", status=400)
