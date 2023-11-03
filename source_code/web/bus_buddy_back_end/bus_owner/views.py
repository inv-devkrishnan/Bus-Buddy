from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from account_manage.models import User
from bus_owner.serializer import OwnerModelSerializer as OMS
from bus_owner.serializer import OwnerDataSerializer as ODS

from django.core.paginator import Paginator, Page
from .models import Bus
from .models import Routes
from .models import Amenities
from .serializers import BusSerializer, ViewBusSerializer
from .serializers import AmenitiesSerializer
from .serializers import (
    RoutesSerializer,
    StartStopLocationsSerializer,
    PickAndDropSerializer,
    ViewRoutesSerializer,
)
import logging

logger = logging.getLogger(__name__)
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ValidationError
from account_manage.models import User
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import IsAuthenticated

entry = "Invalid entry"

class RegisterBusOwner(APIView):
    """
    For registering bus owner locally
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            request_data = request.data.copy()
            request_data["role"] = 3
            serialized_data = OMS(data=request_data)
            if serialized_data.is_valid():
                serialized_data.save()
                return Response({"message": "registration successfull"}, status=201)
            else:
                return Response(serialized_data._errors, status=400)

        except ValidationError:
            return Response(serialized_data._errors, status=400)


class UpdateBusOwner(UpdateAPIView):
    """
    For displaying and updating bus owner details
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            user_id = request.user.id  # get id using token
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(status=404)

        serialized_data = ODS(user)
        return Response(serialized_data.data)

    def update(self, request):
        try:
            user_id = request.user.id  # get id using token
            instance = User.objects.get(id=user_id)
            current_data = request.data
            serializer = OMS(instance, data=current_data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({"message": "updated succesffully"}, status=200)
        except ValueError:
            return Response(serializer.errors, status=400)

    def put(self, request):
        return self.update(request)

class Addbus(APIView):  # Function to add new bus from bus owner
    # permission_classes = (IsAuthenticated,)
    serializer = None

    def post(self, request):
        try:
            serializer = BusSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                logger.info("Inserted")
                return Response({"message": "Inserted", "bus": serializer.data["id"]})
            else:
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info(entry)
            return Response(entry, status=400)


class Deletebus(APIView):  # function to change the status to 99 to perform logical error
    # permission_classes = (IsAuthenticated,)

    def put(self, request, id):
        try:
            data = Bus.objects.get(id=id)
            data.status = 99
            data.save()
            logger.info("Deleted")
            return Response("Deleted the record")
        except ObjectDoesNotExist:
            logger.info(entry)
            return Response(status=404)


class Updatebus(UpdateAPIView):  # function to update bus details by bus owner
    # permission_classes = (IsAuthenticated,)

    def get(self, request, id):
        try:
            bus = Bus.objects.get(id=id)
        except Bus.DoesNotExist:
            return Response(status=404)
        serialized_data = BusSerializer(bus)
        return Response(serialized_data.data)

    def put(self, request, id):
        try:
            instance = Bus.objects.get(id=id)
            serializer = BusSerializer(instance, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                self.perform_update(serializer)
                logger.info("updated")
                print("i")
                return Response("Updated", 200, serializer.data)
            else:
                return Response(serializer.errors, status=400)
        except ObjectDoesNotExist:
            return Response("Invalid Bus id", status=400)


class Viewbus(APIView):  # function to list all bus of the bus owner
    # permission_classes = (IsAuthenticated,)

    def get(self, request, pageNo):
        queryset = Bus.objects.filter(status=0).values()
        paginator = Paginator(queryset, 2)
        try:
            Paginator.validate_number(paginator, pageNo)
            page = paginator.get_page(pageNo)
            serializer = ViewBusSerializer(page, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(status=404)


class Addamenities(APIView):  # funuction to add amenities of a bus
    # permission_classes = (IsAuthenticated,)
    serializer = None

    def post(self, request):
        try:
            serializer = AmenitiesSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                bus_id = serializer.data.get("bus")
                current_bus = Bus.objects.get(id=bus_id)
                current_bus.bus_details_status = 1
                current_bus.save()
                logger.info("Inserted")
                return Response("Inserted")
            else:
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info(entry)
            return Response(entry, status=400)


class Updateamenities(APIView):  # function to update the amenities of a bus
    # permission_classes = (IsAuthenticated,)

    def put(self, request, id):
        try:
            amenities_id = Amenities.objects.get(bus=id)
            print(amenities_id.id)
            serializer = AmenitiesSerializer(data=request.data)
            data = Amenities.objects.get(bus=id)
            if serializer.is_valid():
                data.emergency_no = serializer.validated_data["emergency_no"]
                data.water_bottle = serializer.validated_data["water_bottle"]
                data.charging_point = serializer.validated_data["charging_point"]
                data.usb_port = serializer.validated_data["usb_port"]
                data.blankets = serializer.validated_data["blankets"]
                data.pillows = serializer.validated_data["pillows"]
                data.reading_light = serializer.validated_data["reading_light"]
                data.toilet = serializer.validated_data["toilet"]
                data.snacks = serializer.validated_data["snacks"]
                data.tour_guide = serializer.validated_data["tour_guide"]
                data.cctv = serializer.validated_data["cctv"]
                data.save()
                logger.info("Amenities updated")
                return Response(
                    {"message": "Amenities updated", "id": str(amenities_id.id)}
                )
            else:
                return Response(serializer.errors, status=400)
        except ObjectDoesNotExist:
            return Response("Invalid Bus ID", status=400)


class Addroutes(APIView):  # function to add new route from a bus owner
    # permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            serializer = RoutesSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                routes_id = serializer.data.get("id")
                return Response({"message": "Route inserted", "routes_id": routes_id})
            else:
                return Response(serializer.errors, status=400)
        except ValidationError as e:
            return Response({"message": "Invalid entry", "errors": str(e)}, status=400)


class Viewroutes(APIView):  # function to list all routes added by the bus owner
    # permission_classes = (IsAuthenticated,)

    def get(self, request, pageNo):
        queryset = Routes.objects.filter(status=0).values()
        paginator = Paginator(queryset, 15)
        try:
            Paginator.validate_number(paginator, pageNo)
            page = paginator.get_page(pageNo)
            serializer = ViewRoutesSerializer(page, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(status=404)

class Deleteroutes(
    APIView
):  # function to change status of the route to 99 to perform logical deletion
    # permission_classes = (IsAuthenticated,)
    permission_classes = (AllowAny,)

    def put(self, request, id):
        try:
            data = Routes.objects.get(id=id)
            data.status = 99
            data.save()
            logger.info("Deleted")
            return Response("Deleted the record")
        except ObjectDoesNotExist:
            logger.info(entry)
            return Response(status=404)
