from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from bus_owner.serializer import UserModelSerializer as UMS


# Create your views here.
class RegisterBusOwner(APIView):
    permission_classes = (AllowAny,)
    
    def post(self,request):
        request_data = request.data
        request_data["role"]=3
        serialized_data = UMS(data=request_data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response({"message":"registration successfull"},status=201)
        else:
            return Response(serialized_data._errors,status=400)