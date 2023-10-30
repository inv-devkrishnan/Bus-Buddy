from django.db.models import Q
from rest_framework.generics import UpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from account_manage.models import User
from .permissions import AllowAdminsOnly
from .serializer import AdminUpdateSerializer as AUS
from .serializer import ListUserSerializer as LUS
from .serializer import BanUserSerializer as BUS
from .pagination import CustomPagination


def update_status(self, user_id, status):
    try:
        instance = User.objects.get(id=user_id)
        new_data = {"status": status}
        serializer = BUS(instance, data=new_data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response({"success_code": "D2005"})

    except User.DoesNotExist:
        return Response({"error_code": "D1001"})


class AdminProfileUpdation(UpdateAPIView):
    permission_classes = (AllowAdminsOnly,)

    def get(self, request):
        #  gets the current user profile information
        try:
            user = User.objects.get(id=request.user.id)
            serialized_data = AUS(user)
            return Response(serialized_data.data)
        except User.DoesNotExist:
            return Response({"error_code": "D1001"}, 400)

    def update(self, request):
        instance = User.objects.get(id=request.user.id)
        current_data = request.data
        serializer = AUS(instance, data=current_data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)

            return Response({"success_code": "D2002"})
        else:
            # error handling
            email_error = serializer._errors.get("email")  # gets email error
            phone_error = serializer._errors.get("phone")  # gets phone error

            if (
                phone_error
            ):  # if phone error is number already exists send different error code
                if phone_error[0] == "D1008":
                    return Response({"error_code": phone_error[0]}, 400)
                else:
                    return Response({"error_code": "D1002"}, 400)
            if (
                email_error
            ):  # if email error is email already exists send different error code
                if email_error[0] == "D1007":
                    return Response({"error_code": email_error[0]}, 400)
                else:
                    return Response({"error_code": "D1002"}, 400)
            else:
                return Response({"error_code": "D1002"}, 400)

    def put(self, request):
        return self.update(request)


class ListUsers(APIView, CustomPagination):
    permission_classes = (AllowAdminsOnly,)

    def search_user(self, keyword):
        # function to search user by their first_name
        users = User.objects.filter(
            ~Q(role=1),
            first_name__icontains=keyword,
        ).order_by("created_date")
        return users

    def getUsersbyStatus(self, status, order):
        # function to get user's based on thier status
        current_ordering = "created_date"
        if order == "1":
            current_ordering = "-first_name"
        elif order == "0":
            current_ordering = "first_name"
        if status == "0":
            users = User.objects.filter(~Q(role=1), ~Q(status=99), status=0).order_by(
                current_ordering
            )
        elif status == "2":
            users = User.objects.filter(~Q(role=1), ~Q(status=99), status=2).order_by(
                current_ordering
            )
        return users

    def get(self, request):
        keyword = request.GET.get("keyword")
        order = request.GET.get("order")
        status = request.GET.get("status")
        if keyword:
            users = self.search_user(keyword)
        elif status:
            if status == "0" or status == "2":
                users = self.getUsersbyStatus(status, order)
            else:
                return Response({"error_code": "D1006"})

        else:
            if order == "0":
                users = User.objects.filter(~Q(role=1), ~Q(status=99)).order_by(
                    "first_name"
                )
            elif order == "1":
                users = User.objects.filter(~Q(role=1), ~Q(status=99)).order_by(
                    "-first_name"
                )
            else:
                users = User.objects.filter(~Q(role=1), ~Q(status=99)).order_by(
                    "created_date"
                )

        serialized_data = LUS(
            CustomPagination.paginate_queryset(self, queryset=users, request=request),
            many=True,
        )
        return Response(
            {
                "users": serialized_data.data,
                "pages": self.page.paginator.num_pages,
            }
        )


class BanUser(UpdateAPIView):
    permission_classes = (AllowAdminsOnly,)

    def update(self, request, user_id):
        return update_status(self, user_id, 2)

    def put(self, request, user_id):
        return self.update(request, user_id)


class UnBanUser(UpdateAPIView):
    permission_classes = (AllowAdminsOnly,)

    def update(self, request, user_id):
        return update_status(self, user_id, 0)

    def put(self, request, user_id):
        return self.update(request, user_id)


class RemoveUser(UpdateAPIView):
    permission_classes = (AllowAdminsOnly,)

    def update(self, request, user_id):
        return update_status(self, user_id, 99)

    def put(self, request, user_id):
        return self.update(request, user_id)
