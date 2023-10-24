from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.core.paginator import Paginator, Page
from .models import Routes
from .serializers import RoutesSerializer,StartStopLocationsSerializer,PickAndDropSerializer,ViewRoutesSerializer
import logging
logger = logging.getLogger(__name__)
from django.core.exceptions import ObjectDoesNotExist 
from rest_framework.exceptions import ValidationError
from account_manage.models import User


class Addroutes(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            serializer =  RoutesSerializer(data=request.data)
            if serializer.is_valid():
                # print(serializer.data)
                serializer.save()
                routes_id = serializer.data.get('id') 
                return Response({"message": "Route inserted", "routes_id": routes_id})
            else:
                return Response(serializer.errors, status=400)
        except ValidationError as e:
            return Response({"message": "Invalid entry", "errors": str(e)}, status=400)
        
        
class Viewroutes(APIView):
    permission_classes=(AllowAny,)
    def get(self,request,pageNo):
        queryset = Routes.objects.filter(status=0).values()
        paginator = Paginator(queryset,15)
        try:
            Paginator.validate_number(paginator, pageNo)
            page = paginator.get_page(pageNo)
            serializer = ViewRoutesSerializer(page, many=True)
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