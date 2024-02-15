from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator, Page
from datetime import datetime, timedelta

from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView, ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from .models import Bus, SeatDetails
from .models import Routes, PickAndDrop, StartStopLocations
from .models import Amenities
from .models import Trip
from account_manage.models import User, Notifications
from normal_user.models import UserReview, BookedSeats, Bookings
from bus_owner.serializers import OwnerModelSerializer as OMS
from bus_owner.serializers import OwnerDataSerializer as ODS
from rest_framework.filters import OrderingFilter, SearchFilter

from .serializers import (
    BusSerializer,
    ViewBusSerializer,
    AmenitiesSerializer,
    TripSerializer,
    ViewTripSerializer,
    RoutesSerializer,
    ViewRoutesSerializer,
    AmenitiesSerializer,
    BusSerializer,
    ViewBusSerializer,
    SeatDetailSerializer,
    GetSeatSerializer,
    ReviewSerializer,
    ViewNotificationsSerializer,
    PassengerListSerializer,
)
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
entry = "Invalid entry"
dentry = "Deleted the record"
missing = "missing"
date_format = "%Y-%m-%d"


def get_status(bus_instance):
    if bus_instance.bus_details_status == 1:
        return 2
    elif bus_instance.bus_details_status == 0:
        return 1
    else:
        logger.info(f"seat detail status :{bus_instance.bus_details_status}")
        return 0


class AddSeatDetails(APIView):
    """
    API for adding seat details

    Returns:
        json: success message
    """

    permission_classes = (IsAuthenticated,)

    def get_message(self, count, bus_instance):
        if count == 30:
            bus_instance.bus_details_status = (
                2  # to mark the finish of bus detail entry
            )
            bus_instance.save()
            logger.info("seat detail complete")
            return "All seat details have been added successfully", 200
        else:
            logger.info("seat data saved successfully")
            return "Details added successfully", 201

    def post(self, request):
        user_id = request.user.id
        bus_id = request.data.get("bus")
        ui_order = request.data.get("seat_ui_order")
        seat_number = request.data.get("seat_number")
        serialized_data = SeatDetailSerializer(data=request.data)

        try:
            bus_instance = get_object_or_404(
                Bus, id=bus_id, user=user_id
            )  # get the object or raise 404 error
            logger.info(bus_instance, "current bus")
            count = SeatDetails.objects.filter(bus=bus_id).count()
            if count == 30:
                bus_instance.bus_details_status = get_status(bus_instance)
                bus_instance.save()
                logger.info("seat detail complete")
                return Response({"data": "All seats have been registered"}, status=400)
            else:
                if SeatDetails.objects.filter(
                    seat_ui_order=ui_order, bus=bus_id
                ) or SeatDetails.objects.filter(seat_number=seat_number, bus=bus_id):
                    logger.info("seat already registered")
                    return Response(
                        {"data": "Seat number already registered"}, status=400
                    )
                else:
                    if serialized_data.is_valid():
                        serialized_data.save()
                        count = SeatDetails.objects.filter(bus=bus_id).count()
                        message, status = self.get_message(count, bus_instance)
                        return Response({"message": message}, status=status)
                    else:
                        logger.warning(serialized_data.errors)
                        return Response(serialized_data.errors, status=400)
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
                logger.warning("No Seat data")
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
            request_data["status"] = 3  # waiting for approval
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
            request_data = request.data.copy()
            request_data["user"] = request.user.id
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
            data = Bus.objects.get(id=id)  # to retrive bus object that matches the id
            if data.status == 99:
                return Response({"message": "bus already deleted"})
            else:
                data.status = 99  # soft delete
                data.save()
                logger.info("Deleted bus")
            try:
                logger.info("fetching the amenities obj associated with the bus obj")
                data = Amenities.objects.get(
                    bus=id
                )  # to get the amenities obj associated with bus obj
                if data.status == 99:
                    logger.info("Amenities already deleted")
                else:
                    data.status = 99  # soft delete
                    data.save()
                    logger.info("Deleted amenities")
            except ObjectDoesNotExist:
                logger.info(entry)
            try:
                print(" inside trip delete")
                logger.info("fetching the trip associated with the bus")
                data = Trip.objects.filter(
                    bus_id=id
                )  # to get the trip obj associated with bus obj
                for trip in data:
                    print(trip)
                    if trip.status == 0:
                        trip.status = 99
                        trip.save()
                return Response({"message": "Deleted Bus & Amenities & trip"})
            except ObjectDoesNotExist:
                logger.info(entry)
            return Response(
                {"message": "There are not trips or bus object for this particular bus"}
            )
        except ObjectDoesNotExist:
            logger.info("there is no bus obj matching the id")
            logger.info(entry)
            return Response(status=404)


class Updatebus(UpdateAPIView):
    """
    function to update bus details by bus owner
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = BusSerializer

    def get(self, request, id):  # checking for bus object that matches the id
        try:
            logger.info("checking for the bus obj matching the requested id")
            bus = Bus.objects.get(id=id, status=0)
        except Bus.DoesNotExist:
            logger.info("bus obj does not exist")
            return Response(status=404)
        serialized_data = BusSerializer(bus)
        return Response(serialized_data.data)

    def put(self, request, id):  # update function
        try:
            instance = Bus.objects.get(id=id, status=0)
            bookings = Bookings.objects.filter(status=0)
            booked_bus = [booking.trip.bus.id for booking in bookings]

            if instance:
                request_data = request.data.copy()
                request_data["user"] = request.user.id
                serializer = BusSerializer(instance, data=request_data, partial=True)
                if id in booked_bus:
                    logger.info("bus didn't update as it has bookings")
                    return Response("Bus has Bookings", status=400)
                elif serializer.is_valid(raise_exception=True):
                    self.perform_update(
                        serializer
                    )  # perform_update is a updateAPI function
                    logger.info("updated")
                    print("i")
                    return Response(
                        {"message": "Updated", "data": serializer.data}, status=200
                    )
                else:
                    logger.info("bus didn't update")
                    return Response(serializer.errors, status=400)
            else:
                return Response({"message": "missing"}, status=404)
        except ObjectDoesNotExist:
            return Response("Invalid Bus id", status=404)


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
    filter_backends = [SearchFilter]
    search_fields = ["bus_details_status"]

    def list(self, request):
        try:
            logger.info("gettin the user is from user model")
            user_id = request.user.id
            print(user_id)
            logger.info("fetching all  data from Bus model matching the condition")
            queryset = Bus.objects.filter(status=0, user=user_id).order_by(
                "-id"
            )  # to filter out bus objects which has been soft deleted
            print(queryset)
            serializer = ViewBusSerializer(queryset)
            queryset = self.filter_queryset(queryset)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response(serializer._errors)


class Viewreviews(ListAPIView):
    """
    function to list all bus of the bus owner
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = ReviewSerializer
    pagination_class = CustomPagination

    def list(self, request):
        try:
            logger.info("getting the user is from user model")
            user_id = request.user.id
            print(user_id)
            logger.info("fetching all the data from Bus model matching the condition")
            queryset = UserReview.objects.filter(review_for=user_id)
            print(queryset)
            serializer = ReviewSerializer(queryset)
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

    def post(self, request):
        bus = request.data.get("bus")
        print(bus)
        try:
            if not Bus.objects.filter(id=bus, status=0).exists():
                return Response({"message": "missing"}, status=404)
            serializer = AmenitiesSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                logger.info("Fetching the bus id from amenities model")
                bus_id = serializer.data.get(
                    "bus"
                )  # to get bus id related to added amenities
                logger.info("Fetching the bus by foreign key ")
                current_bus = Bus.objects.get(
                    id=bus_id
                )  # to get the bus object to change the status of adding bus to 1

                current_bus.bus_details_status = get_status(current_bus)
                current_bus.save()

                logger.info("Inserted")
                return Response({"message": "Inserted"})
            else:
                return Response(serializer.errors, status=400)
        except ValidationError:
            logger.info(entry)
            return Response({"message": "missing"}, status=404)


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
            return Response("missing", status=404)


class Addroutes(APIView):
    """
    Function to add new route from a bus owner
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            request_data = request.data.copy()
            logger.info("fetching user obj ")
            request_data["user"] = request.user.id
            print(request_data)
            serializer = RoutesSerializer(data=request_data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Route inserted "}, status=200)
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
            data = Routes.objects.get(id=id)  # to get route object matching the id
            print(data)
            if data.status == 99:
                return Response("route already deleted")
            else:
                data.status = 99
                data.save()
                logger.info("Deleted")
            try:
                logger.info("fetching the trip obj associated with route ")
                data = Trip.objects.filter(
                    route=id
                )  # to get trips object matching the id
                for trip in data:
                    print(trip)
                    if trip.status == 0:
                        trip.status = 99
                        trip.save()
                logger.info("Deleted")
            except ObjectDoesNotExist:
                logger.info("no trip obj associated with route")
                logger.info(entry)
                return Response({"message": entry}, status=400)
            try:
                logger.info("fetching the startstoplocations associated with routes")
                data = StartStopLocations.objects.filter(
                    route=id
                )  # to get start stop object matching the id
                for ssl in data:
                    print(ssl)
                    if ssl.status == 0:
                        ssl.status = 99
                        ssl.save()
                logger.info("Deleted")
            except ObjectDoesNotExist:
                logger.info("there are no start stop locations associated with routes")
                logger.info(entry)
                return Response({"message": entry}, status=404)

            try:
                logger.info("fetching pickdroppoints associated with routes")
                data = PickAndDrop.objects.filter(
                    route=id
                )  # to get pick&drop object matching the id
                for pad in data:
                    print(pad)
                    if pad.status == 0:
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
            return Response({"message": "route not found"}, status=404)


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
            queryset = Routes.objects.filter(status=0, user=user_id).order_by("-id")
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

    permission_classes = (IsAuthenticated,)
    serializer = None

    def post(self, request):
        try:
            request_data = request.data.copy()
            route = request_data["route"]
            locations = StartStopLocations.objects.filter(route_id=route).order_by(
                "seq_id"
            )
            stop_date_str = request_data["start_date"]
            stop_date = datetime.strptime(stop_date_str, date_format)
            print("stop :", stop_date)
            request_data["user"] = request.user.id
            seq_first = locations.first()
            seq_last = locations.last()
            offset = seq_last.departure_date_offset
            stop_date_offset = stop_date + timedelta(days=offset)
            print("stop offset :", stop_date_offset)
            stop_date_offset_str = stop_date_offset.strftime(date_format)
            request_data["end_date"] = stop_date_offset_str
            print("end_ date :", stop_date_offset_str)
            request_data["start_time"] = seq_first.arrival_time
            request_data["end_time"] = seq_last.departure_time
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

    permission_classes = (IsAuthenticated,)
    serializer_class = TripSerializer

    def get(self, request, id):
        try:
            logger.info("checking for trip obj matching the requested id")
            trip = Trip.objects.get(id=id, status=0)
        except Trip.DoesNotExist:
            logger.info("no trip obj matching the requested id")
            return Response(status=404)
        serialized_data = TripSerializer(trip)
        return Response(serialized_data.data)

    def put(self, request, id):
        try:
            booking = Bookings.objects.filter(trip=id, status=0)
            request_data = request.data.copy()
            logger.info("fetching the trip obj matching the id")
            instance = Trip.objects.get(id=id, status=0)
            # saving the present values to instance variable
            buses = instance.bus_id
            routes = instance.route_id
            print(instance)
            locations = StartStopLocations.objects.filter(route=routes).order_by(
                "seq_id"
            )
            first_seq = locations.first()
            last_seq = locations.last()
            print(locations)
            stop_date_str = request_data["start_date"]
            stop_date = datetime.strptime(stop_date_str, date_format)
            offset = last_seq.departure_date_offset
            stop_date_offset = stop_date + timedelta(days=offset)
            stop_date_offset_str = stop_date_offset.strftime(date_format)
            request_data["end_date"] = stop_date_offset_str
            if not Bus.objects.filter(id=buses, status=0).exists():
                return Response({"message": "bus missing"}, status=404)
            if not Routes.objects.filter(id=routes, status=0).exists():
                return Response({"message": "route missing"}, status=404)
            request_data = request.data.copy()
            request_data["user"] = request.user.id
            request_data["start_time"] = first_seq.arrival_time
            request_data["end_time"] = last_seq.departure_time
            present_date = datetime.now().date()
            start_date = datetime.strptime(
                request_data["start_date"], date_format
            ).date()
            print(start_date)
            print(present_date)
            if (start_date - present_date) < timedelta(days=2):
                print("condition ok ")
                raise ValueError(
                    "Start date must be at least 2 days from the present date."
                )
            serializer = TripSerializer(instance, data=request_data, partial=True)
            if booking.count() != 0:
                return Response("The trip has bookings", status=400)

            elif serializer.is_valid(raise_exception=True):
                self.perform_update(serializer)
                logger.info("updated")
                print("i")
                return Response({"message": "Updated"}, 200, serializer.data)
            else:
                logger.info("serializer validation failed")
                return Response(serializer.errors, status=400)
        except ValueError as e:
            return Response({"message": str(e)}, status=400)
        except ObjectDoesNotExist:
            logger.info("no trip obj for the given id")
            return Response("Invalid trip id", status=400)


class Deletetrip(APIView):
    """
    function to change status of the trip to 99 to perform logical deletion

    """

    permission_classes = (IsAuthenticated,)
    permission_classes = (AllowAny,)

    def put(self, request, id):
        try:
            logger.info("fetching the trip obj for the obj")
            data = Trip.objects.get(id=id)  # to get trip object matching the id
            present_date = datetime.now().date()
            start_date = data.start_date
            diff = start_date - present_date
            print(diff)
            if (diff) < timedelta(days=2) and diff > timedelta(days=0):
                print("condition ok ")
                raise ValueError(
                    "Start date must be at least 2 days from the present date."
                )
            data.status = 99
            data.save()
            logger.info("Deleted")
            return Response({"message": dentry})
        except ValueError as e:
            return Response({"message": str(e)}, status=400)
        except ObjectDoesNotExist:
            logger.info(entry)
            return Response(status=404)


class Viewtrip(ListAPIView):
    """
    function to list all Trips added by the bus owner
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = ViewTripSerializer
    pagination_class = CustomPagination

    def list(self, request):
        try:
            user_id = request.user.id
            queryset = Trip.objects.filter(status=0, user=user_id).order_by("-id")
            serializer = ViewRoutesSerializer(queryset)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            print(serializer.data)

            return Response(serializer.data)

        except Exception as e:
            return Response(e)


class Viewavailablebus(ListAPIView):
    """
    function to list all bus of the bus owner
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = ViewBusSerializer

    def list(
        self,
        request,
    ):
        try:
            logger.info("gettin the user is from user model")
            user_id = request.user.id
            print(user_id)
            start = request.GET.get("start")
            end = request.GET.get("end")
            startdate = datetime.strptime(start, date_format).date()
            enddate = datetime.strptime(end, date_format).date()
            trips = Trip.objects.filter(
                status=0, user=user_id, start_date__lte=enddate, end_date__gte=startdate
            )
            buses = trips.values_list("bus", flat=True)
            print(buses)
            # Filter Buses Based on Usage
            queryset = Bus.objects.filter(
                status=0, user=user_id, bus_details_status=2
            ).exclude(id__in=buses)
            if not queryset.exists():
                return Response(
                    {"message": "There are no available buses for the given dates"},
                    status=404,
                )
            logger.info("fetching all the data from Bus model matching the condition")
            print(queryset)
            serializer = ViewBusSerializer(queryset)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response(
                {"error": "Invalid date format for 'start' or 'end'"}, status=400
            )


class Addreccuringrip(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            request_data = request.data.copy()
            request_data["user"] = request.user.id

            start_date_str = request_data["start_date"]
            end_date_str = request_data["end_date"]
            routes = request_data["route"]

            loc = StartStopLocations.objects.filter(route=routes).order_by("seq_id")
            seq_first = loc.first()
            seq_last = loc.last()
            stop_date_str = request_data["start_date"]
            stop_date = datetime.strptime(stop_date_str, date_format)
            offset = seq_last.departure_date_offset
            stop_date_offset = stop_date + timedelta(days=offset)
            stop_date_offset_str = stop_date_offset.strftime(date_format)
            request_data["end_date"] = stop_date_offset_str

            recurrence_type = request_data["recurrence"]

            start_date, end_date = datetime.strptime(
                start_date_str, date_format
            ), datetime.strptime(end_date_str, date_format)
            start_time, end_time = seq_first.arrival_time, seq_last.departure_time
            start_datetime, end_datetime = datetime.combine(
                start_date, start_time
            ), datetime.combine(end_date, end_time)

            psd_str, ped_str = request.GET.get("start"), request.GET.get("end")
            psd, ped = datetime.strptime(psd_str, date_format), datetime.strptime(
                ped_str, date_format
            ) + timedelta(days=1)

            if self.is_in_date_range(start_datetime, end_datetime, psd, ped):
                trip_objects = self.generate_recurring_trips(
                    request_data,
                    start_datetime,
                    end_datetime,
                    psd,
                    ped,
                    recurrence_type,
                )
                return Response({"message": "Trips inserted", "trips": trip_objects})
            else:
                return Response({"message": "Failed to add recurring trip"}, status=400)

        except ValidationError:
            logger.info(entry)
            return Response(entry, status=400)

    def is_in_date_range(self, start_datetime, end_datetime, psd, ped):
        return psd <= start_datetime <= ped and psd <= end_datetime <= ped

    def generate_recurring_trips(
        self, request_data, start_datetime, end_datetime, psd, ped, recurrence_type
    ):
        trip_objects = []
        iterations = self.calculate_iterations(psd, ped, recurrence_type)

        if not self.is_valid_recurrence_type(recurrence_type) or iterations is None:
            return Response({"error": "Invalid recurrence type"}, status=400)

        period = self.calculate_period(recurrence_type)

        for i in range(iterations):
            current_start_date = start_datetime + i * period
            current_end_date = end_datetime + i * period

            if not self.is_within_date_range(current_end_date, ped):
                break

            current_request_data = self.update_request_data_dates(
                request_data,
                current_start_date,
                current_end_date,
                start_datetime.time(),
                end_datetime.time(),
            )

            current_serializer = TripSerializer(data=current_request_data)

            if current_serializer.is_valid():
                current_serializer.save()
                trip_objects.append(current_serializer.data)
            else:
                return Response({"message": current_serializer.errors}, status=400)

        return trip_objects

    def calculate_iterations(self, psd, ped, recurrence_type):
        if recurrence_type == 1:
            return (ped - psd).days + 1  # Daily recurrence
        elif recurrence_type == 2:
            return (ped - psd).days // 7 + 1  # Weekly recurrence
        else:
            return None

    def is_valid_recurrence_type(self, recurrence_type):
        return recurrence_type in [1, 2]

    def calculate_period(self, recurrence_type):
        return timedelta(days=1) if recurrence_type == 1 else timedelta(weeks=1)

    def is_within_date_range(self, current_end_date, ped):
        return current_end_date <= ped

    def update_request_data_dates(
        self, request_data, current_start_date, current_end_date, start_time, end_time
    ):
        current_request_data = request_data.copy()
        current_request_data["start_date"] = current_start_date.strftime(date_format)
        current_request_data["end_date"] = current_end_date.strftime(date_format)
        current_request_data["start_time"] = start_time
        current_request_data["end_time"] = end_time
        return current_request_data


class Viewnotifications(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ViewNotificationsSerializer

    def list(self, request):
        try:

            logger.info("getting the user is from user model")
            user_id = request.user.id
            queryset = Notifications.objects.filter(user=user_id, status=0)
            print(len(queryset))
            print(queryset)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except ValidationError:
            return Response(serializer._errors, status=400)


class Changenotificationstatus(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        try:
            user_id = request.user.id
            notifications = Notifications.objects.filter(user=user_id, status=0)
            for notification in notifications:
                notification.status = 1
                notification.save()
            return Response({"message": "Notification Status updated"}, status=200)
        except ValidationError:
            return Response({"message": "error"}, status=400)


class Getpassengerlist(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PassengerListSerializer
    pagination_class = CustomPagination

    def get(self, request, id):
        try:
            if id is None:
                return Response(status=400)
            passengers = BookedSeats.objects.filter(trip=id)
            if passengers.exists():
                listlen = len(passengers)
                page = self.paginate_queryset(passengers)
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(
                    {"listlen": listlen, "data": serializer.data}
                )
            else:
                return Response(status=404)
        except Exception as e:
            return Response({"error": f"{e}"}, status=400)


class Getvalidbus(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = BusSerializer
    pagination_class = CustomPagination

    def get(self, request):
        try:
            user_id = request.user.id
            valid_bus = Bus.objects.filter(status=0, user=user_id, bus_details_status=2)
            page = self.paginate_queryset(valid_bus)
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"error": f"{e}"}, status=400)
