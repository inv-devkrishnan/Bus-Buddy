from django.shortcuts import render
from django.db.models import Q  # to check not equal in filter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from account_manage.models import User
from bus_owner.serializer import OwnerModelSerializer as OMS
from bus_owner.serializer import OwnerUpdateSerializer as AllField
from bus_owner.serializer import OwnerUpdateExceptEmailSerializer as ExceptEmail
from bus_owner.serializer import OwnerUpdateExceptPhoneSerializer as ExceptPhone
from bus_owner.serializer import OwnerUpdateOnlyNamesSerializer as OnlyName


# commonly used messages
update_message = {"message": "updated succesffully"}


def update_only_name(request, user_id):
    current_data = User.objects.get(id=user_id)
    serialized_data = OnlyName(data=request.data)
    if serialized_data.is_valid():
        current_data.first_name = serialized_data.validated_data["first_name"]
        current_data.last_name = serialized_data.validated_data["last_name"]
        current_data.company_name = serialized_data.validated_data["company_name"]
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
        current_data.company_name = serialized_data.validated_data["company_name"]
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
        current_data.company_name = serialized_data.validated_data["company_name"]
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
        current_data.company_name = serialized_data.validated_data["company_name"]
        current_data.email = serialized_data.validated_data["email"]
        current_data.phone = serialized_data.validated_data["phone"]
        current_data.save()
        return True
    else:
        return serialized_data._errors
    
    
    
class RegisterBusOwner(APIView):
    permission_classes = (AllowAny,)
    
    def post(self,request):
        request_data = request.data
        request_data["role"]=3
        serialized_data = OMS(data=request_data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response({"message":"registration successfull"},status=201)
        else:
            return Response(serialized_data._errors,status=400)


class UpdateBusOwner(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(status=404)
        
        serialized_data=AllField(user)
        return Response(serialized_data.data)

    def put(self, request, id):
        user_id = id
        entered_email = request.data.get("email")
        entered_phone = request.data.get("phone")

        if User.objects.all().filter(
            email__contains=entered_email, phone=entered_phone # old email and phone
        ):
            response=update_only_name(request, user_id)
        elif User.objects.all().filter(
            ~Q(phone=entered_phone), email__contains=entered_email # old email only
        ):
            response=update_except_email(request, user_id)
        elif User.objects.all().filter(
            ~Q(email__contains=entered_email), phone=entered_phone # old phone only
        ):
            response=update_except_phone(request, user_id)
        else: # every data is different from old
            response=update_all(request, user_id)
            
        if response==True:
            return Response(update_message,status=200)
        else:
            return Response(response,status=400) 
