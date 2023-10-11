from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from account_manage.models import User
from normal_user.serializer import UserModelSerializer as UMS


class RegisterUser(APIView):
    permission_classes = (AllowAny,)
    
    def post(self,request):
        serialized_data = UMS(data=request.data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response({"message":"registration successfull"},status=201)
        else:
            return Response(serialized_data._errors,status=400)