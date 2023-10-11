from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from account_manage.models import User
from normal_user.serializer import UserModelSerializer as UMS
from normal_user.serializer import UserUpdateSerializer as UUS


class RegisterUser(APIView):
    permission_classes = (AllowAny,)
    
    def post(self,request):
        serialized_data = UMS(data=request.data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response({"message":"registration successfull"},status=201)
        else:
            return Response(serialized_data._errors,status=400)
        

class UpdateProfile(APIView):
    permission_classes = (AllowAny,)
    
    def put(self,request,id):
        user_id = id
        password = request.data.get("password")
        if User.objects.filter(password=password):
            if User.objects.filter(id=user_id):
                current_data = User.objects.get(id=user_id)
                serialized_data = UMS(data=request.data)
                current_data.first_name = serialized_data.validated_data["first_name"]
                current_data.last_name = serialized_data.validated_data["last_name"]
                current_data.email = serialized_data.validated_data["email"]
                current_data.phone = serialized_data.validated_data["phone"]
                return Response({"message":"updated successfully"},status=200)
            else:
                return Response({"message":"invalid user"})
        else:
            return Response({"message":"invalid password"})