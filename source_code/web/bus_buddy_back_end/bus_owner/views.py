from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
import logging
from .models import Bus
from .serializers import buddyserializer
logger = logging.getLogger(__name__)
from django.core.exceptions import ObjectDoesNotExist 
from rest_framework.exceptions import ValidationError


# Create your views here.

class Addbus(APIView):
    permission_classes=(AllowAny,)
    serializer = None
    
    def post(self, request):
        try:
            serializer = buddyserializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                logger.info("Inserted")
                return Response("Inserted")
        except ValidationError:
            logger.info ("Invalid entry")
            # raise ValidationError(serializer.errors)
            return Response("invalid Entry",status=400)
            
        
class Deletebus(APIView):
    permission_classes=(AllowAny,)
    def put(self, request,bus_name):
        try:
            data=Bus.objects.get(bus_name=bus_name)
            data.status=99
            logger.info ("Deleted")
            return Response("Deleted the record")
        except ObjectDoesNotExist:
            logger.info ("Inavlid")
            return Response(status=404)
        
class Updatebus(APIView):
    permission_classes=(AllowAny,)
    def put(self, request,bus_name):
        try:
            serializer = buddyserializer(data=request.data)
            if serializer.is_valid:   
                data=Bus.objects.get(bus_name=bus_name)
                data.bus_name=serializer.validated_data['bus_name']
                data.plate_no=serializer.validated_data['plate_no']
                data.status=serializer.validated_data['status']
                data.bus_type=serializer.validated_data['bus_type']
                data.bus_ac=serializer.validated_data['bus_ac']
                data.save()
                logger.info("updated")
                return Response("Updated",status=200)
        except ObjectDoesNotExist:
            return Response("Invalid Bus name",status=400)
        
# class Viewallbus(APIView):
#     permission_classes=(AllowAny,)
#     def get (self,request):