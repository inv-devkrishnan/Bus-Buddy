from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError
from datetime import datetime

from account_manage.models import User
from normal_user.models import Bookings
from bus_owner.models import StartStopLocations
from bus_owner.models import SeatDetails, Trip, PickAndDrop

from .serializer import UserModelSerializer as UMS
from .serializer import UserDataSerializer as UDS
from .serializer import BookingHistoryDataSerializer as BHDS
from .serializer import (
    SeatDetailsViewSerialzer,
    PickAndDropSerializer,
    BookSeatSerializer,
    CancelBookingSerializer,
)
import random
import logging

logger = logging.getLogger(__name__)


class ViewSeats(ListAPIView):
    """
    For viewing seat details in a trip

    Args:
        trip_id (integer): id of the trip

    Returns:
        json: pick and drop and complete seat details corresponding to the trip id
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        trip_id = request.GET.get("trip_id")

        try:
            trip = Trip.objects.get(id=trip_id)
            serializer = SeatDetailsViewSerialzer(
                SeatDetails.objects.filter(
                    bus_id=trip.bus_id
                ),  # data from seat details with bus id from trip table
                context={"trip_id": trip_id},
                many=True,
            )
            # print(trip.route)
            pick_and_drop = PickAndDrop.objects.filter(route=trip.route)
            pick_and_drop_serializer = PickAndDropSerializer(
                pick_and_drop, many=True
            )  # data from pick and drop with the route id from trip table
            print(pick_and_drop_serializer.data)
            pick_and_drop_array = [pick_and_drop_serializer.data]
            total_data = (
                pick_and_drop_array + serializer.data
            )  # both seat data and pick and drop data
            logger.info(total_data)
            return Response(total_data, status=200)
        except Exception as e:
            return Response("errors:" f"{e}", status=400)


class RegisterUser(APIView):
    """
    For registering a user locally
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            serialized_data = UMS(data=request.data)
            if serialized_data.is_valid():
                serialized_data.save()
                logger.info("user registered")
                return Response({"message": "registration successfull"}, status=201)
            else:
                logger.info(serialized_data.errors)
                return Response(serialized_data.errors, status=200)
        except Exception as e:
            logger.info(e)
            return Response("errors:" f"{e}", status=400)


class UpdateProfile(UpdateAPIView):
    """
    For displaying and updating user details
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            user_id = request.user.id  # get id using token
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(status=404)

        serialized_data = UDS(user)
        logger.info(serialized_data.data)
        return Response(serialized_data.data)

    def update(self, request):
        try:
            if request.user.id:
                user_id = request.user.id  # get id using token
                instance = User.objects.get(id=user_id)
                current_data = request.data
                serializer = UMS(instance, data=current_data, partial=True)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
                logger.info(serializer.data)
                return Response({"message": "updated succesffully"}, status=200)
            else:
                logger.info(serializer.errors)
                return Response(serializer.errors, status=400)
        except Exception as e:
            logger.info(e)
            return Response("errors:" f"{e}", status=400)

    def put(self, request):
        return self.update(request)


class CustomPagination(PageNumberPagination):
    """
    For paginating the query set
    """

    page_size = 5
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


class BookingHistory(ListAPIView):
    """
    For viewing the user's booking history
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = BHDS
    pagination_class = CustomPagination

    def list(self, request):
        user_id = request.user.id
        status = request.GET.get("status")
        try:
            if status in {"0", "1", "99"}:
                queryset = Bookings.objects.filter(user=user_id, status=status)
            else:
                queryset = Bookings.objects.filter(user=user_id)

            serializer = BHDS(queryset)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            logger.info(serializer.data, "bookimg history")
            return Response(serializer.data)

        except ValueError:
            logger.info(serializer.errors)
            return Response(serializer._errors)


class ViewTrip(APIView):
    def filter_query(self, seat_type, bus_type, bus_ac):
        """function to add where clause
        according to params passed in the
        url"""
        condition = " where"
        count = 0
        if seat_type != "-1":
            condition = condition + " b.bus_seat_type = " + str(seat_type)
            count = count + 1
        if bus_type != "-1":
            if count > 0:
                condition = condition + " and  b.bus_type = " + str(bus_type)
                count = count + 1
            else:
                condition = condition + " b.bus_type = " + str(bus_type)
                count = count + 1
        if bus_ac != "-1":
            if count > 0:
                condition = condition + " and  b.bus_ac = " + str(bus_ac)
                count = count + 1
            else:
                condition = condition + " b.bus_ac = " + str(bus_ac)
                count = count + 1

        return condition

    def validate_params(
        self,
        start_location,
        end_location,
        date,
        seat_type,
        bus_type,
        bus_ac,
        page_number,
    ):
        """function to validate the query params to ensure sanity"""
        date_format = "%Y-%m-%d"
        try:
            if (
                start_location.isdigit()
                and end_location.isdigit()
                and page_number.isdigit()
                and seat_type.strip("-").isdigit()
                and bus_type.strip("-").isdigit()
                and bus_ac.strip("-").isdigit()
                and bool(datetime.strptime(date, date_format))
                and start_location != end_location
            ):
                return True
            else:
                return False
        except ValueError:
            return False
        except AttributeError:
            return False
        except TypeError:
            return False

    def get(self, request):
        """Function to display trips to user based on search"""
        ITEMS_PER_PAGE = 10  # no of items to be display in page

        # storing query params
        start_location = request.GET.get("start")
        end_location = request.GET.get("end")
        date = request.GET.get("date")
        seat_type = request.GET.get("seat-type", "-1")
        bus_type = request.GET.get("bus-type", "-1")
        bus_ac = request.GET.get("bus-ac", "-1")
        page_number = request.GET.get("page", 1)

        if self.validate_params(
            start_location,
            end_location,
            date,
            seat_type,
            bus_type,
            bus_ac,
            page_number,
        ):
            query = """
            SELECT s.id, s.route_id, s.arrival_time as start_arrival_time,
                e.arrival_time as end_arrival_time,
                s.arrival_date_offset as start_offset,
                e.arrival_date_offset as end_offset,
                r.via, (r.travel_fare+seat_details.cost) as starting_cost,
                DATE_ADD(t.start_date,INTERVAL s.arrival_date_offset DAY) as start_date,
                DATE_ADD(t.start_date,INTERVAL e.arrival_date_offset DAY) as end_date,
                t.id as trip_id, b.bus_name, b.id as bus_id, u.company_name,
                am.emergency_no,am.water_bottle,am.charging_point,am.usb_port,am.blankets,
                am.reading_light,am.toilet,am.snacks,am.tour_guide,am.cctv,am.pillows
            FROM start_stop_locations s
            INNER JOIN start_stop_locations e
            ON s.route_id = e.route_id and s.location_id=%s and e.location_id=%s and s.seq_id < e.seq_id 
            LEFT JOIN routes r
            ON r.id = s.route_id and r.status = 0
            INNER JOIN trip t
            ON t.route_id = s.route_id and
            t.start_date = (SELECT DATE_ADD(%s, INTERVAL -s.arrival_date_offset DAY)) and
            t.status = 0
            INNER JOIN bus b
            ON b.id = t.bus_id and b.status = 0 and b.bus_details_status = 2
            INNER JOIN user u
            ON b.user_id = u.id
            INNER JOIN amenities am
            ON am.bus_id = b.id
            INNER JOIN (select bus_id, min(seat_cost) as cost from seat_details group by bus_id) as seat_details
            ON seat_details.bus_id = b.id
        """
            if seat_type != "-1" or bus_type != "-1" or bus_ac != "-1":
                # if any query params provided filter the query
                query = query + self.filter_query(seat_type, bus_type, bus_ac)

            result = StartStopLocations.objects.raw(
                query, [start_location, end_location, date]
            )
            trip_list = []
            for data in result:
                trip_data = {
                    # stores each trip information
                    "route": data.route_id,
                    "start_location_arrival_time": data.start_arrival_time,
                    "end_location_arrival_time": data.end_arrival_time,
                    "start_location_arrival_date": data.start_date,
                    "end_location_arrival_date": data.end_date,
                    "via": data.via,
                    "travel_fare": data.starting_cost,
                    "trip": data.trip_id,
                    "bus_name": data.bus_name,
                    "bus": data.bus_id,
                    "company_name": data.company_name,
                    "amenities": {
                        "emergency_no": data.emergency_no,
                        "water_bottle": data.water_bottle,
                        "charging_point": data.charging_point,
                        "usb_port": data.usb_port,
                        "blankets": data.blankets,
                        "pillows": data.pillows,
                        "reading_light": data.reading_light,
                        "toilet": data.toilet,
                        "snacks": data.snacks,
                        "tour_guide": data.tour_guide,
                        "cctv": data.cctv,
                    },
                }
                # adds each trip data to a trip list
                trip_list.append(trip_data)

            paginator = Paginator(trip_list, ITEMS_PER_PAGE)  # pagination for trips

            try:
                current_page = paginator.page(page_number)
            except EmptyPage:  # if page doesn't exist status is set to no content
                return Response({}, status=204)
            paginated_data = {
                "total_pages": paginator.num_pages,
                "total_items": paginator.count,
                "items_per_page": ITEMS_PER_PAGE,
                "current_page": current_page.number,
                "has_previous": current_page.has_previous(),
                "has_next": current_page.has_next(),
                "data": list(current_page),
            }

            return Response(paginated_data)
        else:
            return Response({"error_code": "D1006"}, status=400)


class BookSeat(APIView):
    """
    For booking seats

    Returns:
        json : success message
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user_id = request.user.id
        role = request.user.role
        now = datetime.now()
        year_string = now.strftime("%Y")
        random_number = random.randrange(0, 99999)

        try:
            if role == 2:
                request_data = request.data.copy()
                request_data["user"] = user_id
                request_data["booking_id"] = (
                    "BK" + str(user_id) + "YR" + year_string + str(random_number)
                )  # for generating unique booking id
                serializer = BookSeatSerializer(data=request_data)
                if serializer.is_valid():
                    serializer.save()
                    logger.info("seat booked")
                    return Response({"message": "Seat booked successfully"}, status=201)
                else:
                    logger.info(serializer.errors)
                    return Response(serializer.errors, status=200)
            else:
                return Response(
                    {"authorization failed": "Unauthorized user"}, status=401
                )
        except Exception as e:
            logger.info(e)
            return Response("errors:" f"{e}", status=400)


class CancelBooking(UpdateAPIView):
    """
    For cancelling booking

    Args:
        booking_id (int): query param for identifying booking

    Returns:
        json : success message
    """

    permission_classes = (IsAuthenticated,)

    def update(self, request):
        booking_id = request.GET.get("booking_id")

        try:
            instance = Bookings.objects.get(id=booking_id)
            current_data = {"status": 99}  # status 99 denotes the cancelled bookings
            serializer = CancelBookingSerializer(
                instance, data=current_data, partial=True
            )
            if serializer.is_valid(raise_exception=True):
                self.perform_update(serializer)
                logger.info("booking cancelled")
                return Response({"message": "cancelled succesffully"}, status=200)
            else:
                logger.info(serializer.errors)
                return Response(serializer.errors, status=400)
        except Exception as e:
            logger.info(e)
            return Response("errors:" f"{e}", status=400)
