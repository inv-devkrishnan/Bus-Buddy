from django.shortcuts import render,get_object_or_404
from django.core.paginator import Paginator, Page
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime, timedelta

from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView, ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.paginator import Paginator, Page
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from .models import Bus, SeatDetails
from .models import Routes, PickAndDrop, StartStopLocations
from .models import Amenities
from .models import Trip
from account_manage.models import User
from bus_owner.serializers import OwnerModelSerializer as OMS
from bus_owner.serializers import OwnerDataSerializer as ODS

from .serializers import (
    BusSerializer,
    ViewBusSerializer,
    AmenitiesSerializer,
    TripSerializer,
    ViewTripSerializer,
    RoutesSerializer,
    StartStopLocationsSerializer,
    PickAndDropSerializer,
    ViewRoutesSerializer,
    AmenitiesSerializer,
    BusSerializer,
    ViewBusSerializer,
    SeatDetailSerializer,
    GetSeatSerializer,
)
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
entry = "Invalid entry"
dentry = "Deleted the record"


class AddSeatDetails(APIView):
    """
    API for adding seat details

    Returns:
        json: success message
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user_id = request.user.id
        bus_id = request.data.get("bus")
        ui_order = request.data.get("seat_ui_order")
        serialized_data = SeatDetailSerializer(data=request.data)

        try:
            bus_instance = get_object_or_404(Bus, id=bus_id, user=user_id) # get the object or raise 404 error
            logger.info(bus_instance, "current bus")
            count = SeatDetails.objects.filter(bus=bus_id).count()
            if count == 30:
                bus_instance.bus_details_status = 2 # to mark the finish of bus detail entry
                bus_instance.save()
                logger.info("seat detail complete")
                return Response({"data": "All seats have been registered"}, status=200)
            else:
                if SeatDetails.objects.filter(seat_ui_order=ui_order, bus=bus_id):
                    logger.info("seat already registered")
                    return Response(
                        {"data": "seat detail already registered"}, status=200
                    )
                else:
                    if serialized_data.is_valid():
                        serialized_data.save()
                        logger.info("seat data saved successfully")
                        return Response(
                            {"message": "details added successfully"}, status=201
                        )
                    else:
                        logger.warning(serialized_data.errors)
                        return Response(serialized_data.errors, status=200)
        except Exception as e:
            logger.error(e)
            return Response({"error": f"{e}"}, status=400)


class GetSeatDetails(APIView):
    """
    API for fetching seat details

    Args:
        bus_id (integer): id of the bus that the seat data belong to

    Returns:
        json: whole seat data for the corresponding bus id
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        bus_id = request.GET.get("bus_id")
        try:
            if SeatDetails.objects.filter(bus=bus_id):
                request_data = SeatDetails.objects.filter(bus=bus_id)
                serialized_data = GetSeatSerializer(request_data, many=True)
                logger.info(serialized_data)
                return Response(serialized_data.data)
            else:
                logger.warning(serialized_data.errors)
                return Response({"data": "no data"}, status=200)
        except Exception as e:
            logger.error(e)
            return Response({"error": f"{e}"}, status=400)


class RegisterBusOwner(APIView):
    """
    API for registering bus owner

    Returns:
        json: success message
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            request_data = request.data.copy()
            request_data["status"] = 3 # waiting for approval
            request_data["role"] = 3
            logger.info(request_data)
            serialized_data = OMS(data=request_data)
            if serialized_data.is_valid():
                serialized_data.save()
                logger.info(serialized_data.data)
                return Response({"message": "registration successfull"}, status=201)
            else:
                logger.warning(serialized_data.errors)
                return Response(serialized_data._errors, status=400)

        except Exception as e:
            logger.error(e)
            return Response("error:" f"{e}", status=400)


class UpdateBusOwner(UpdateAPIView):
    """
    API for updating bus owner details

    Returns:
        json: success message
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            user_id = request.user.id  # get id using token
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            logger.error("User does not exist")
            return Response(status=404)

        serialized_data = ODS(user)
        logger.info(serialized_data.data)
        return Response(serialized_data.data)

    def update(self, request):
        try:
            user_id = request.user.id  # get id using token
            instance = User.objects.get(id=user_id)
            current_data = request.data
            serializer = OMS(instance, data=current_data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            logger.info(serializer.data)
            return Response({"message": "updated succesffully"}, status=200)
        except ValueError:
            logger.error(serializer.errors)
            return Response(serializer.errors, status=400)

    def put(self, request):
        return self.update(request)


class Addbus(APIView):
    """
    Function to add new bus from bus owner
    """

    permission_classes = (IsAuthenticated,)
    serializer = None

    def post(self, request):
        try:
            request_data = (request.data.copy())
            request_data['user'] = request.user.id
            serializer = BusSerializer(data=request_data)
            if serializer.is_valid():
                serializer.save()
                logger.info("Inserted")
                return Response({"message": "Inserted", "bus": serializer.data["id"]})
            else:
                logger.info("data failed validation")
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info(entry)
            return Response(entry, status=400)


class Deletebus(APIView):
    """
    function to change the status to 99 to perform logical error
    """

    permission_classes = (IsAuthenticated,)
    
    def put(self, request, id):
        try:
            logger.info("fetching bus obj matching the requested id")
            data = Bus.objects.get(id=id)  #to retrive bus object that matches the id
            if(data.status == 99): 
                return Response({"message":"bus already deleted"})
            else:
                data.status = 99        #soft delete    
                data.save()
                logger.info("Deleted bus")
            try:
                logger.info("fetching the amenities obj associated with the bus obj")
                data = Amenities.objects.get(bus=id)   #to get the amenities obj associated with bus obj 
                if(data.status == 99):
                    return Response({"message":"already deleted"})
                else:
                    data.status = 99        #soft delete    
                    data.save()
                    logger.info("Deleted amenities")
                    return Response({"message": "Deleted Bus & Amenities"})
            except ObjectDoesNotExist:
                logger.info(entry)
            try:
                print(" inside trip delete")
                logger.info("fetching the trip associated with the bus")
                data = Trip.objects.filter(bus_id=id)    #to get the trip obj associated with bus obj
                for trip in data:
                    print(trip)
                    if (trip.status == 0):
                        trip.status = 99
                        trip.save()
                return Response({"message": "Deleted Bus & Amenities & trip"})
            except ObjectDoesNotExist:
                logger.info(entry)
            return Response({"message":"There are not trips or bus object for this particular bus"})
        except ObjectDoesNotExist:
            logger.info("there is no bus obj matching the id")
            logger.info(entry)
            return Response(status=404)


class Updatebus(UpdateAPIView):
    """
    function to update bus details by bus owner
    """

    # permission_classes = (IsAuthenticated,)
    serializer_class = BusSerializer

    def get(self, request, id):  # checking for bus object that matches the id
        try:
            logger.info("checking for the bus obj matching the requested id")
            bus = Bus.objects.get(id=id,status=0)
        except Bus.DoesNotExist:
            logger.info("bus obj does not exist")
            return Response(status=404)
        serialized_data = BusSerializer(bus)
        return Response(serialized_data.data)

    def put(self, request, id):  # update function
        try:
            instance = Bus.objects.get(id=id,status=0)
            if instance:
                request_data = (request.data.copy())
                request_data['user'] = request.user.id
                serializer = BusSerializer(instance, data=request_data, partial=True)
                if serializer.is_valid(raise_exception=True):
                    self.perform_update(serializer)     #perform_update is a updateAPI function 
                    logger.info("updated")
                    print("i")
                    return Response({"message": "Updated","data":serializer.data},status=200)
                else:
                    logger.info("bus didn't update")
                    return Response(serializer.errors, status=400)
            else:
                return Response({"message":"bus not found"},status=404)
        except ObjectDoesNotExist:
            return Response("Invalid Bus id", status=400)


class CustomPagination(PageNumberPagination):
    """
    For paginating the query set
    """
    page_size = 15
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
    permission_classes = (IsAuthenticated,)
    serializer_class = ViewBusSerializer
    pagination_class = CustomPagination

    def list(self, request):
        try:
            logger.info("gettin the user is from user model")
            user_id = request.user.id
            print(user_id)
            logger.info("fetching all the data from Bus model matching the condition")
            queryset = Bus.objects.filter(status=0,user=user_id)     #to filter out bus objects which has been soft deleted 
            print(queryset)
            serializer = ViewBusSerializer(queryset)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response(serializer._errors)


class Addamenities(APIView):
    """
    funuction to add amenities of a bus
    """
    permission_classes = (IsAuthenticated,)
    serializer = None
    def get(self, request, id):
        try:
            logger.info("checking if amenities obj present for the bus obj ")
            amenities = Amenities.objects.get(bus=id)
        except Amenities.DoesNotExist:
            logger.info("amenities obj is not present ")
            return Response(status=404)
        serialized_data = AmenitiesSerializer(amenities)
        return Response(serialized_data.data)
    def post(self, request):
        bus = request.data.get("bus")
        print(bus)
        try:
            if not Bus.objects.filter(id=bus, status=0).exists():
                return Response({"message": "Bus not found"}, status=404)
            serializer = AmenitiesSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()

                logger.info("Fetching the bus id from amenities model")
                bus_id = serializer.data.get("bus")  # to get bus id related to added amenities
                logger.info("Fetching the bus by foreign key ")
                current_bus = Bus.objects.get(id=bus_id)  # to get the bus object to change the status of adding bus to 1
                current_bus.bus_details_status = 1
                current_bus.save()

                logger.info("Inserted")
                return Response({"message": "Inserted"})
            else:
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info(entry)
            return Response({"message":"bus not found"}, status=400)


class Updateamenities(UpdateAPIView):
    """
    function to update the amenities of a bus
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = AmenitiesSerializer

    def get(self, request, id):
        try:
            logger.info("checking if amenities obj present for the bus obj ")
            amenities = Amenities.objects.get(bus=id)
        except Amenities.DoesNotExist:
            logger.info("amenities obj is not present ")
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
                print("updated")
                return Response(
                    {"message": "Updated", "data": serializer.data}, status=200
                )
            else:
                return Response(serializer.errors, status=400)
        except ObjectDoesNotExist:
            return Response("bus not found", status=400)
         

class Addroutes(APIView):
    """
    Function to add new route from a bus owner
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            request_data=request.data.copy()
            logger.info("fetching user obj ")
            request_data["user"] = request.user.id
            serializer = RoutesSerializer(data=request_data)
            if serializer.is_valid():
                serializer.save()
                id = serializer.data['id']
                return Response({"message": f"Route inserted : {id}"}, status=200)
            else:
                return Response(serializer.errors, status=400)
        except ValidationError as e:
            return Response({"message": entry, "errors": str(e)}, status=400)


class Deleteroutes(APIView):
    """
    function to change status of the route to 99 to perform logical deletion
    """
    permission_classes = (IsAuthenticated,)

    def put(self, request, id):
        try:
            logger.info("fetching the route obj")
            data = Routes.objects.get(id=id)    #to get route object matching the id 
            print(data)
            if(data.status == 99):
                return Response("route already deleted")
            else:
                data.status = 99
                data.save()
                logger.info("Deleted")
            try:
                
                logger.info("fetching the trip obj associated with route ")
                data = Trip.objects.filter(route=id)    #to get trips object matching the id
                for trip in data:
                    print(trip)
                    if (trip.status == 0):
                        trip.status = 99
                        trip.save()
                logger.info("Deleted")
            except ObjectDoesNotExist:
                logger.info("no trip obj associated with route")
                logger.info(entry)
                return Response({"message": entry},status=400)
            try:                
                logger.info("fetching the startstoplocations associated with routes")
                data = StartStopLocations.objects.filter(route=id)    #to get start stop object matching the id
                for ssl in data:
                    print(ssl)
                    if (ssl.status == 0):
                        ssl.status = 99
                        ssl.save()
                logger.info("Deleted")
            except ObjectDoesNotExist:
                logger.info("there are no start stop locations associated with routes")
                logger.info(entry)
                return Response({"message": entry},status=400)

            try:
                logger.info("fetching pickdroppoints associated with routes")
                data = PickAndDrop.objects.filter(route=id)    #to get pick&drop object matching the id
                for pad in data:
                    print(pad)
                    if (pad.status == 0):
                        pad.status = 99
                        pad.save()
                logger.info("Deleted")
            except ObjectDoesNotExist:
                logger.info("there are no pickupdropoff points associated with routes")
                logger.info(entry)

            return Response({"message": "Deletion successful"}, status=200)
        except ObjectDoesNotExist:
            logger.info("no route obj present")
            logger.info(entry)
    

class Viewroutes(ListAPIView):
    """
    function to list all routes added by the bus owner
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = ViewRoutesSerializer
    pagination_class = CustomPagination

    def list(self, request):
        try:
            logger.info("fetching user id ")
            user_id = request.user.id
            logger.info("fetching all data from routes model matching the conditions")
            queryset = Routes.objects.filter(status=0,user=user_id)
            serializer = ViewRoutesSerializer(queryset)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)

            return Response(serializer.data)

        except ValueError:
            return Response(serializer._errors)


class Addtrip(APIView):
    """
    Function to add new trip from bus owner
    """

    # permission_classes = (IsAuthenticated,)
    serializer = None

    def post(self, request):
        try:
            request_data=request.data.copy()
            request_data["user"] = request.user.id
            serializer = TripSerializer(data=request_data)
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
            logger.info("checking for trip obj matching the requested id")
            trip = Trip.objects.get(id=id,status=0)
        except Trip.DoesNotExist:
            logger.info("no trip obj matching the requested id")
            return Response(status=404)
        serialized_data = TripSerializer(trip)
        return Response(serialized_data.data)

    def put(self, request, id):
        try:
            logger.info("fetching the trip obj matching the id")
            instance = Trip.objects.get(id=id,status=0)
            #saving the present values to instance variable
            buses=instance.bus_id
            routes=instance.route_id
            # rouptes=instance.route
            if not Bus.objects.filter(id=buses, status=0).exists():
                return Response({"message": "Bus not found"}, status=404)
            if not Routes.objects.filter(id=routes, status=0).exists():
                return Response({"message": "Bus not found"}, status=404)
            request_data=(request.data.copy())
            request_data['user']=request.user.id
            serializer = TripSerializer(instance, data=request_data, partial=True)
            if serializer.is_valid(raise_exception=True):
                self.perform_update(serializer)
                logger.info("updated")
                print("i")
                return Response({"message": "Updated"}, 200, serializer.data)
            else:
                logger.info("serializer validation failed")
                return Response(serializer.errors, status=400)
        except ObjectDoesNotExist:
            logger.info("no trip obj for the given id")
            return Response("Invalid trip id", status=400)


class Deletetrip(APIView):
    """
    function to change status of the trip to 99 to perform logical deletion

    """

    # permission_classes = (IsAuthenticated,)
    permission_classes = (AllowAny,)

    def put(self, request, id):
        try:
            logger.info("fetching the trip obj for the obj")
            data = Trip.objects.get(id=id)  # to get trip object matching the id
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

    permission_classes = (IsAuthenticated,)
    serializer_class = ViewTripSerializer
    # pagination_class = CustomPagination

    def list(self, request):
        try:
            # user_id = request.user.id
            user_id=request.user.id
            queryset = Trip.objects.filter(status=0,user=user_id)
            # serializer = ViewRoutesSerializer(queryset)
            # page = self.paginate_queryset(queryset)

            # if page is not None:
            #     serializer = self.get_serializer(page, many=True)
            #     return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            print(serializer.data)

            return Response(serializer.data)

        except ValueError:
            return Response(serializer._errors)


class Viewavailablebus(ListAPIView):
    """
    function to list all bus of the bus owner
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = ViewBusSerializer

    def list(self, request,start,end):
        try:
            # import pdb;pdb.set_trace()
            logger.info("gettin the user is from user model")
            user_id = request.user.id
            print(user_id)
            # start = self.request.query_params.get('start_date')
            # end = self.request.query_params.get('end_date')
            startdate = datetime.strptime(start, '%Y-%m-%d').date()
            enddate = datetime.strptime(end, '%Y-%m-%d').date()
            trips = Trip.objects.filter(
                user=user_id, start_date__lte=enddate, end_date__gte=startdate
            )
            buses = trips.values_list('bus', flat=True)
            print(buses)
           # Filter Buses Based on Usage
            queryset = Bus.objects.filter(status=0, user=user_id).exclude(id__in=buses)
            if not queryset.exists():
                return Response({"message":"There are no available buses for the given dates"},status=404) 
            logger.info("fetching all the data from Bus model matching the condition")
            print(queryset)
            serializer = ViewBusSerializer(queryset)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response({"error": "Invalid date format for 'start' or 'end'"}, status=400)
        
class Addtreccuringrip(APIView):
    """
    Function to add new trip from bus owner
    """

    permission_classes = (IsAuthenticated,)
    serializer = None

    def post(self, request,):
        try:
            import pdb;pdb.set_trace()
            recurrence_type = 1
            request_data=request.data.copy()
            print(request_data)
            request_data["user"] = request.user.id
            serializer = TripSerializer(data=request_data)
            if serializer.is_valid():
                serializer.save()
                logger.info("Inserted")
            start_date_str = request_data["start_date"]
            end_date_str = request_data["end_date"]
            start_time_str = request_data["start_time"]
            end_time_str = request_data["end_time"]
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
            start_time = datetime.strptime(start_time_str, '%H:%M').time()
            end_time = datetime.strptime(end_time_str, '%H:%M').time()
            start_datetime = datetime.combine(start_date, start_time)
            end_datetime = datetime.combine(end_date, end_time)
            duration = end_datetime - start_datetime
            print(duration)
            no_of_days = (duration.days) 
            print(no_of_days)
            psd_str = request.GET.get('period_start_date')
            ped_str = request.GET.get('period_end_date')
            psd = datetime.strptime(psd_str, '%Y-%m-%d')
            ped = datetime.strptime(ped_str, '%Y-%m-%d')
            period = ped - psd
            
            if psd <= start_datetime <= ped and psd <= end_datetime <= ped:
                trip_objects = []
                print("it is in the range ")
                if recurrence_type == 0:
                    iterations = (ped - psd).days + 1  # Daily recurrence
                elif recurrence_type == 1:
                    iterations = (ped - psd).days // 7 + 1  # Weekly recurrence
                else:
                    return Response({"error": "Invalid recurrence type"}, status=400)
                if recurrence_type == 0:
                    period = timedelta(days=1)
                elif recurrence_type == 1:
                    period = timedelta(weeks=1)
                else:
                    return Response({"error": "Invalid recurrence type"}, status=400)
                for i in range (iterations):
                    current_start_date = start_datetime + i * period
                    current_end_date = end_datetime + i * period
                    if (current_end_date > ped or current_start_date > ped):
                        break
                    else:
                        current_request_data = request_data.copy()
                        current_request_data["start_date"] = current_start_date.strftime('%Y-%m-%d')
                        current_request_data["end_date"] = current_end_date.strftime('%Y-%m-%d')
                        current_serializer = TripSerializer(data=current_request_data)
                        if current_serializer.is_valid():
                            current_serializer.save()
                            trip_objects.append(current_serializer.data)
                        else:
                            return Response({"message":current_serializer.errors}, status=400)
                return Response({"message": "Trips inserted", "trips": trip_objects})
            else:
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info(entry)
            return Response(entry, status=400)