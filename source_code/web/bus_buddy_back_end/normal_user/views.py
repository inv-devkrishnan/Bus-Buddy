from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError

from account_manage.models import User
from normal_user.models import Bookings
from .serializer import UserModelSerializer as UMS
from .serializer import UserDataSerializer as UDS
from .serializer import BookingHistoryDataSerializer as BHDS


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
                return Response({"message": "registration successfull"}, status=201)
        except ValidationError:
            return Response(serialized_data._errors, status=400)


class UpdateProfile(UpdateAPIView):
    """
    For displaying and updating user details
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            user_id = request.user.id  # get id using token
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(status=404)

        serialized_data = UDS(user)
        return Response(serialized_data.data)

    def update(self, request):
        try:
            user_id = request.user.id  # get id using token
            instance = User.objects.get(id=user_id)
            current_data = request.data
            serializer = UMS(instance, data=current_data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({"message": "updated succesffully"}, status=200)
        except ValueError:
            return Response(serializer.errors, status=400)

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
        try:
            user_id = request.user.id
            queryset = Bookings.objects.filter(user=user_id)
            serializer = BHDS(queryset)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response(serializer._errors)
