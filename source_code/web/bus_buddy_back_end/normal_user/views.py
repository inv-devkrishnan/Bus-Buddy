from django.shortcuts import render
from django.db.models import Q  # to check not equal in filter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from account_manage.models import User
from normal_user.serializer import UserModelSerializer as UMS
from normal_user.serializer import UserUpdateSerializer as AllField
from normal_user.serializer import UserUpdateOnlyNameSerializer as OnlyName
from normal_user.serializer import UserUpdateExceptEmailSerializer as ExceptEmail
from normal_user.serializer import UserUpdateExceptPhoneSerializer as ExceptPhone

# commonly used messages
update_message = {"message": "updated succesffully"}


def update_only_name(request, user_id):
    current_data = User.objects.get(id=user_id)
    serialized_data = OnlyName(data=request.data)
    if serialized_data.is_valid():
        current_data.first_name = serialized_data.validated_data["first_name"]
        current_data.last_name = serialized_data.validated_data["last_name"]
        current_data.save()
        return True
    else:
        return serialized_data._errors


def update_except_email(request, user_id):
    current_data = User.objects.get(id=user_id)
    serialized_data = ExceptEmail(data=request.data)
    if serialized_data.is_valid():
        current_data.first_name = serialized_data.validated_data["first_name"]
        current_data.last_name = serialized_data.validated_data["last_name"]
        current_data.phone = serialized_data.validated_data["phone"]
        current_data.save()
        return True
    else:
        return serialized_data._errors


def update_except_phone(request, user_id):
    current_data = User.objects.get(id=user_id)
    serialized_data = ExceptPhone(data=request.data)
    if serialized_data.is_valid():
        current_data.first_name = serialized_data.validated_data["first_name"]
        current_data.last_name = serialized_data.validated_data["last_name"]
        current_data.email = serialized_data.validated_data["email"]
        current_data.save()
        return True
    else:
        return serialized_data._errors
    
def update_all(request, user_id):
    current_data = User.objects.get(id=user_id)
    serialized_data = AllField(data=request.data)
    if serialized_data.is_valid():
        current_data.first_name = serialized_data.validated_data["first_name"]
        current_data.last_name = serialized_data.validated_data["last_name"]
        current_data.email = serialized_data.validated_data["email"]
        current_data.phone = serialized_data.validated_data["phone"]
        current_data.save()
        return True
    else:
        return serialized_data._errors
    


class RegisterUser(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serialized_data = UMS(data=request.data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response({"message": "registration successfull"}, status=201)
        else:
            return Response(serialized_data._errors, status=400)


class UpdateProfile(APIView):
    permission_classes = (AllowAny,)
    
    def get(self, request,id):
        user_id=id
        user= User.objects.filter(id=user_id).values()
        return Response(user.values())

    def put(self, request, id):
        entered_email = request.data.get("email")
        entered_phone = request.data.get("phone")
        if User.objects.all().filter(
            email__contains=entered_email, phone=entered_phone # old email and phone
        ):
            flag=update_only_name(request, id)
            if flag==True:
                return Response(update_message)
            else:
                return Response(flag,status=400) 
        elif User.objects.all().filter(
            ~Q(phone=entered_phone), email__contains=entered_email # old email only
        ):
            flag=update_except_email(request, id)
            if flag==True:
                return Response(update_message)
            else:
                return Response(flag,status=400) 
        elif User.objects.all().filter(
            ~Q(email__contains=entered_email), phone=entered_phone # old phone only
        ):
            flag=update_except_phone(request, id)
            if flag==True:
                return Response(update_message)
            else:
                return Response(flag,status=400) 
        else: # every data is different from old
            flag=update_all(request, id)
            if flag==True:
                return Response(update_message)
            else:
                return Response(flag,status=400) 
