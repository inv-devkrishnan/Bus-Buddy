from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.core.paginator import Paginator, Page
import logging
from .models import Bus
from .models import Routes
from .serializers import busserializer
from .serializers import amenitiesserializer
from .serializers import buddyserializer
from .serializers import routeserializer
from .serializers import routesserializer
logger = logging.getLogger(__name__)
from django.core.exceptions import ObjectDoesNotExist 
from rest_framework.exceptions import ValidationError
from account_manage.models import User

# Create your views here.

class Addbus(APIView):
    permission_classes=(AllowAny,)
    serializer = None
    
    def post(self, request):
        try:
            serializer = busserializer(data=request.data)
            if serializer.is_valid():
                # serializer.user=User.objects.get(id=1)
                serializer.save()
                logger.info("Inserted")
                return Response({"message":"Inserted",
                                 "bus":serializer.data["id"]})
            else:
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info ("Invalid entry")
            # raise ValidationError(serializer.errors)
            return Response("invalid Entry",status=400)
            
        
class Deletebus(APIView):
    permission_classes=(AllowAny,)
    def put(self, request,id):
        try:
            data=Bus.objects.get(id=id)
            data.status=99
            data.save()
            logger.info ("Deleted")
            return Response("Deleted the record")
        except ObjectDoesNotExist:
            logger.info ("Inavlid")
            return Response(status=404)
        
class Updatebus(APIView):
    # permission_classes=(AllowAny,)
    def put(self, request,id):
        try:
            print("g")
            serializer = buddyserializer(data=request.data)
            data=Bus.objects.get(id=id)
            print("h")
            if serializer.is_valid(): 
                data.user = User.objects.get(id=1)
                data.bus_name=serializer.validated_data['bus_name']
                data.plate_no=serializer.validated_data['plate_no']
                data.bus_type=serializer.validated_data['bus_type']
                data.bus_ac=serializer.validated_data['bus_ac']
                data.save()
                logger.info("updated")
                print("i")
                return Response("Updated",status=200)
            else:
                return Response(serializer.errors, status=400)
        except ObjectDoesNotExist:
            return Response("Invalid Bus name",status=400)
        
class Viewbus(APIView):
    permission_classes=(AllowAny,)
    def get(self,request,pageNo):
        queryset = Bus.objects.filter(status=0).values()
        paginator = Paginator(queryset,15)
        try:
            Paginator.validate_number(paginator, pageNo)
            page = paginator.get_page(pageNo)
            serializer = buddyserializer(page, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(status=404)
        
class Addamenities(APIView):
    permission_classes=(AllowAny,)
    serializer = None
    
    def post(self, request):
        try:
            serializer = amenitiesserializer(data=request.data)
            if serializer.is_valid():
                # serializer.user=User.objects.get(id=1)
                serializer.save()
                logger.info("Inserted")
                return Response("Inserted")
            else:
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info ("Invalid entry")
            # raise ValidationError(serializer.errors)
            return Response("invalid Entry",status=400)
        
class Addroutes(APIView):
    permission_classes=(AllowAny,)
    serializer = None
    
    def post(self, request):
        try:
            serializer = routesserializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                logger.info("Inserted")
                return Response("Inserted")
            else:
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info ("Invalid entry")
            # raise ValidationError(serializer.errors)
            return Response("invalid Entry",status=400)
        
        
class Viewroutes(APIView):
    permission_classes=(AllowAny,)
    def get(self,request,pageNo):
        queryset = Routes.objects.filter(status=0).values()
        paginator = Paginator(queryset,15)
        try:
            Paginator.validate_number(paginator, pageNo)
            page = paginator.get_page(pageNo)
            serializer = routeserializer(page, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(status=404)
                    


class Deleteroutes(APIView):
    permission_classes=(AllowAny,)
    def put(self, request,id):
        try:
            data=Routes.objects.get(id=id)
            data.status=99
            data.save()
            logger.info ("Deleted")
            return Response("Deleted the record")
        except ObjectDoesNotExist:
            logger.info ("Inavlid")
            return Response(status=404)
        
class Updateroutes(APIView):
    # permission_classes=(AllowAny,)
    def put(self, request,id):
        try:
            print("g")
            serializer = routesserializer(data=request.data)
            data=Routes.objects.get(id=id)
            print("h")
            if serializer.is_valid(): 
                data.user = User.objects.get(id=1)
                data.start_point=serializer.validated_data['start_point']
                data.end_point=serializer.validated_data['end_point']
                data.via=serializer.validated_data['via']
                data.distance=serializer.validated_data['distance']
                data.duration=serializer.validated_data['duration']
                data.travel_fare=serializer.validated_data['travel_fare']
                data.save()
                logger.info("updated")
                print("i")
                return Response("Updated",status=200)
            else:
                return Response(serializer.errors, status=400)
        except ObjectDoesNotExist:
            return Response("Invalid Bus name",status=400)
        