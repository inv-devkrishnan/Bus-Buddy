from django.shortcuts import render
from django.db.models import Q  # to check not equal in filter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import AllowAny
from account_manage.models import User
from bus_owner.serializer import OwnerModelSerializer as OMS


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


class UpdateBusOwner(UpdateAPIView):
    permission_classes = (AllowAny,)
    
    def update(self, request, id):
        try:
            instance = User.objects.get(id=id)
            current_data = request.data
            serializer = OMS(instance, data=current_data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({"message": "updated succesffully"}, status=200)
        except TypeError:
            return Response(serializer.errors,status=400)

    def put(self, request, id):
        return self.update(request, id)

 