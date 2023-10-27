from django.shortcuts import render
from django.db.models import Q  # to check not equal in filter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from account_manage.models import User
from normal_user.serializer import UserModelSerializer as UMS
from normal_user.serializer import UserDataSerializer as UDS


class RegisterUser(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serialized_data = UMS(data=request.data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response({"message": "registration successfull"}, status=201)
        else:
            return Response(serialized_data._errors, status=400)


class UpdateProfile(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        try:
            user_id=request.user.id # get id using token
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(status=404)

        serialized_data=UDS(user)
        return Response(serialized_data.data)

    def update(self, request):
        try:
            user_id=request.user.id # get id using token
            instance = User.objects.get(id=user_id)
            current_data = request.data
            serializer = UMS(instance, data=current_data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({"message": "updated succesffully"}, status=200)
        except TypeError:
            return Response(serializer.errors,status=400)

    def put(self, request):
        return self.update(request)