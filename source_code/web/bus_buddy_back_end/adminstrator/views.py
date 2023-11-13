import logging
from django.db.models import Q
from rest_framework.generics import UpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from account_manage.models import User
from .permissions import AllowAdminsOnly
from .serializer import AdminUpdateSerializer as AUS
from .serializer import ListUserSerializer as LUS
from .serializer import BanUserSerializer as BUS
from .pagination import CustomPagination
from bus_buddy_back_end.email import send_email_with_template


logger = logging.getLogger("django")


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
        new_data = {"status": status}
        serializer = BUS(instance, data=new_data, partial=True)
        if serializer.is_valid():
            if status != instance.status:  # checks if status is already same
                old_status = instance.status
                self.perform_update(serializer)
                logger.info("user status changed to " + str(status))
                if (
                    old_status == 3 and status == 0
                ):  # if status change was from 3 to 0 then send mail to bus owner about approval
                    subject = "You are Approved"
                    context = {
                        "recipient_name": instance.first_name,
                    }
                    recipient_list = [instance.email]
                    send_email_with_template(
                        subject=subject,
                        context=context,
                        recipient_list=recipient_list,
                        template="bus_approval_template.html",
                    )
                return Response({"success_code": "D2005"})
            else:
                logger.info(
                    "user status is already " + str(status) + " no change needed"
                )
                return Response({"success_code": "D2006"})

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
                role=3,
                first_name__icontains=keyword,
            ).order_by("created_date")
            return users

    def getUsersbyStatus(self, status, order):
        # function to get user's based on thier status
        current_ordering = "created_date"
        if order == "1":
            current_ordering = "-first_name"
            logger.info("ordering list by descending order")
        elif order == "0":
            current_ordering = "first_name"
            logger.info("ordering list by ascending order")
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
        # function to get user list
        keyword = request.GET.get("keyword")  # keyword for search
        order = request.GET.get("order")  # order for sorting
        status = request.GET.get("status")  # user status
        search_type = request.GET.get(
            "type"
        )  # 0 means search all user 1 means search only bus owner
        if keyword and (search_type == "0" or search_type == "1"):
            users = self.search_user(keyword, search_type)
        elif status:
            if status == "0" or status == "2" or status == "3":
                users = self.getUsersbyStatus(status, order)
            else:
                logger.warn("Invalid query param")
                return Response({"error_code": "D1006"},status=400)

        else:
            if order == "0":
                users = User.objects.filter(~Q(role=1), ~Q(status=99)).order_by(
                    "first_name"
                )
                logger.info("ordering list by ascending order")
            elif order == "1":
                users = User.objects.filter(~Q(role=1), ~Q(status=99)).order_by(
                    "-first_name"
                )
                logger.info("ordering list by descending order")
            else:
                users = User.objects.filter(~Q(role=1), ~Q(status=99)).order_by(
                    "created_date"
                )

        serialized_data = LUS(
            CustomPagination.paginate_queryset(self, queryset=users, request=request),
            many=True,
        )
        logger.info(
            "returned user list with " + str(self.page.paginator.count) + " Entries"
        )
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
        return update_status(self, user_id, 0)

    def put(self, request, user_id):
        logger.info("Approving Bus Owner with id " + str(user_id))
        return self.update(request, user_id)
