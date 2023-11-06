from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView, ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.paginator import Paginator, Page
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from .models import Bus
from .models import Routes
from .models import Amenities
from .models import Trip
from account_manage.models import User
from bus_owner.serializer import OwnerModelSerializer as OMS
from bus_owner.serializer import OwnerDataSerializer as ODS
from .serializers import (
    BusSerializer,
    ViewBusSerializer,
    AmenitiesSerializer,
    TripSerializer,
)
from .serializers import (
    RoutesSerializer,
    StartStopLocationsSerializer,
    PickAndDropSerializer,
    ViewRoutesSerializer,
)
import logging

logger = logging.getLogger(__name__)
entry = "Invalid entry"
dentry = "Deleted the record"


class RegisterBusOwner(APIView):
    # permission_classes = (IsAuthenticated,)

    def post(self, request):
        request_data = request.data
        request_data["role"] = 3
        serialized_data = OMS(data=request_data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response({"message": "registration successfull"}, status=201)
        else:
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


class Addbus(APIView):
    """
    Function to add new bus from bus owner
    """

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


class Deletebus(APIView):
    """
    function to change the status to 99 to perform logical error
    """

    # permission_classes = (IsAuthenticated,)
    
    def put(self, request, id):
        try:
            data = Bus.objects.get(id=id)  #to retrive bus object that matches the id 
            data.status = 99        #soft delete    
            data.save()
            logger.info("Deleted bus")
        except ObjectDoesNotExist:
            logger.info(entry)
            return Response(status=404)
        
        try:
            data = Amenities.objects.get(bus=id)   #to get the amenities obj associated with bus obj 
            data.status = 99        #soft delete    
            data.save()
            logger.info("Deleted amenities")
            return Response({"message": "Deleted Bus & Amenities"})
        except ObjectDoesNotExist:
            logger.info(entry)
        try:
            data = Trip.objects.get(bus=id)    #to get the trip obj associated with bus obj
            data.status = 99        #soft delete    
            data.save()
            logger.info("Deleted trip")
            return Response({"message": "Deleted Bus & Amenities & trip"})
        except ObjectDoesNotExist:
            logger.info(entry)
        return Response({"message":"There are not trips or bus object for this particular bus"})

class Updatebus(UpdateAPIView): 
    """
    function to update bus details by bus owner
    """
    # permission_classes = (IsAuthenticated,)
    serializer_class = BusSerializer

    def get(self, request, id):     #checking for bus object that matches the id
        try:
            bus = Bus.objects.get(id=id)
        except Bus.DoesNotExist:
            return Response(status=404)
        serialized_data = BusSerializer(bus)
        return Response(serialized_data.data)

    def put(self, request, id):     #update function 
        try:
            instance = Bus.objects.get(id=id)
            serializer = BusSerializer(instance, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                self.perform_update(serializer)     #perform_update is a updateAPI function 
                logger.info("updated")
                print("i")
                return Response({"message": "Updated","data":serializer.data},status=200)
            else:
                return Response(serializer.errors, status=400)
        except ObjectDoesNotExist:
            return Response("Invalid Bus id", status=400)
        
class CustomPagination(PageNumberPagination):
    """
    For paginating the query set
    """
    page_size = 3
    page_size_query_param = "page_size"

    def get_paginated_response(self, data):
        return Response(
            {
                "page_size": self.page_size,
                "total_objects": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "current_page_number": self.page.number,
                "has_next": self.page.has_next(),
                "next": self.get_next_link(),
                "has_previous": self.page.has_previous(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        )


class Viewbus(ListAPIView):  
    """
    function to list all bus of the bus owner
    """
    # permission_classes = (IsAuthenticated,)
    serializer_class = ViewBusSerializer
    # pagination_class = CustomPagination

    
    def get_queryset(self):
        return Bus.objects.all()
    
    def list(self, request):
        try:
            # user_id = request.user.id
            queryset = Bus.objects.filter(status=0)     #to filter out bus objects which has been soft deleted 
            print(queryset)
            # serializer = ViewRoutesSerializer(queryset)
            # page = self.paginate_queryset(queryset)

            # if page is not None:
            #     serializer = self.get_serializer(page, many=True)
            #     return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response(serializer._errors)


class Addamenities(APIView):
    """
    funuction to add amenities of a bus
    """
    # permission_classes = (IsAuthenticated,)
    serializer = None

    def post(self, request):
        try:
            serializer = AmenitiesSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                bus_id = serializer.data.get("bus")     #to get bus id related to added amenities   
                current_bus = Bus.objects.get(id=bus_id) # to get the bus object to change status of adding bus to 1
                current_bus.bus_details_status = 1
                current_bus.save()
                logger.info("Inserted")
                return Response({"message": "Inserted"})
            else:
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info(entry)
            return Response(entry, status=400)


class Updateamenities(UpdateAPIView):
    """
    function to update the amenities of a bus
    """
    # permission_classes = (IsAuthenticated,)
    serializer_class = AmenitiesSerializer
    def get(self, request, id):
        try:
            amenities = Amenities.objects.get(bus=id)
        except Amenities.DoesNotExist:
            return Response(status=404)
        serialized_data = AmenitiesSerializer(amenities)
        return Response(serialized_data.data)

    def put(self, request, id):
        try:
            instance = Amenities.objects.get(bus=id)
            serializer = AmenitiesSerializer(instance, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                self.perform_update(serializer)
                logger.info("updated")
                print("i")
                return Response({"message": "Updated","data":serializer.data},status=200)
            else:
                return Response(serializer.errors, status=400)
        except ObjectDoesNotExist:
            return Response("Invalid  id", status=400)
        
class ViewAmenities(ListAPIView):  
    """
    function to list amenities of a bus
    """
    # permission_classes = (IsAuthenticated,)
    serializer_class = AmenitiesSerializer

    
    def get_queryset(self):
        return Amenities.objects.all()
    
    def list(self, request,id):
        try:
            # user_id = request.user.id
            try:
                queryset = Amenities.objects.filter(bus=id)
                print(queryset)
            except Amenities.DoesNotExist:
                return Response(status=404)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response(serializer._errors)
 


class Addroutes(APIView):
    """
    function to add new route from a bus owner
    """
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



class Viewroutes(ListAPIView):
    """
    function to list all routes added by the bus owner
    """
    # permission_classes = (IsAuthenticated,)
    serializer_class = ViewRoutesSerializer
    # pagination_class = CustomPagination

    def get_queryset(self):
        return Routes.objects.all()

    def list(self, request):
        try:
            # user_id = request.user.id
            queryset = Routes.objects.filter(status=0)
            # serializer = ViewRoutesSerializer(queryset)
            # page = self.paginate_queryset(queryset)

            # if page is not None:
            #     serializer = self.get_serializer(page, many=True)
            #     return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)

            return Response(serializer.data)

        except ValueError:
            return Response(serializer._errors)


class Deleteroutes(APIView):  
    """
    function to change status of the route to 99 to perform logical deletion
    """
    # permission_classes = (IsAuthenticated,)

    def put(self, request, id):
        try:
            data = Routes.objects.get(id=id)    #to get route object matching the id
            data.status = 99
            data.save()
            logger.info("Deleted")
            return Response({"message": dentry})
        except ObjectDoesNotExist:
            logger.info(entry)
            return Response(status=404)


class Addtrip(APIView):
    """
    Function to add new trip from bus owner
    """
    # permission_classes = (IsAuthenticated,)
    serializer = None

    def post(self, request):
        try:
            serializer = TripSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                logger.info("Inserted")
                return Response({"message": "Inserted", "trip": serializer.data["id"]})
            else:
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info(entry)
            return Response(entry, status=400)


class Updatetrip(UpdateAPIView): 
    """
    function to update trip details by bus owner
    """
    # permission_classes = (IsAuthenticated,)
    serializer_class = TripSerializer

    def get(self, request, id):
        try:
            bus = Trip.objects.get(id=id)
        except Trip.DoesNotExist:
            return Response(status=404)
        serialized_data = TripSerializer(bus)
        return Response(serialized_data.data)

    def put(self, request, id):
        try:
            instance = Trip.objects.get(id=id)      #saving the present values to instance variable
            serializer = TripSerializer(instance, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                self.perform_update(serializer)
                logger.info("updated")
                print("i")
                return Response({"message": "Updated"}, 200, serializer.data)
            else:
                return Response(serializer.errors, status=400)
        except ObjectDoesNotExist:
            return Response("Invalid Bus id", status=400)


class Deletetrip(APIView): 
    """
    function to change status of the trip to 99 to perform logical deletion

    """
    # permission_classes = (IsAuthenticated,)

    def put(self, request, id):
        try:
            data = Trip.objects.get(id=id)      #to get trip object matching the id 
            data.status = 99
            data.save()
            logger.info("Deleted")
            return Response({"message": dentry})
        except ObjectDoesNotExist:
            logger.info(entry)
            return Response(status=404)


class Viewtrip(ListAPIView):
    """
    function to list all Trips added by the bus owner
    """
    # permission_classes = (IsAuthenticated,)
    serializer_class = TripSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        return Trip.objects.all()       #to get all details of related child object of trip

    def list(self, request):
        try:
            # user_id = request.user.id
            queryset = Trip.objects.filter(status=0)
            serializer = ViewRoutesSerializer(queryset)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)

            return Response(serializer.data)

        except ValueError:
            return Response(serializer._errors)
