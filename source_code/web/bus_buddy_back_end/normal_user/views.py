from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage
from datetime import timedelta
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError

from account_manage.models import User
from normal_user.models import Bookings
from bus_owner.models import StartStopLocations
from .serializer import UserModelSerializer as UMS
from .serializer import UserDataSerializer as UDS
from .serializer import BookingHistoryDataSerializer as BHDS


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
                return Response({"message": "registration successfull"}, status=201)
        except ValidationError:
            return Response(serialized_data._errors, status=400)


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
        return Response(serialized_data.data)

    def update(self, request):
        try:
            user_id = request.user.id  # get id using token
            instance = User.objects.get(id=user_id)
            current_data = request.data
            serializer = UMS(instance, data=current_data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({"message": "updated succesffully"}, status=200)
        except ValueError:
            return Response(serializer.errors, status=400)

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
        try:
            user_id = request.user.id
            queryset = Bookings.objects.filter(user=user_id)
            serializer = BHDS(queryset)
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response(serializer._errors)


class ViewTrip(APIView):
    def filter_query(self, seat_type, bus_type, bus_ac):
        """function to add where clause 
        according to params passed in the
        url """
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

    def get(self, request):
        """Function to display trips to user based on search"""
        start_location = request.GET.get("start")
        end_location = request.GET.get("end")
        date = request.GET.get("date")
        seat_type = request.GET.get("seat-type", "-1")
        bus_type = request.GET.get("bus-type", "-1")
        bus_ac = request.GET.get("bus-ac", "-1")
        page_number = request.GET.get("page", 1)
        ITEMS_PER_PAGE = 3

        if start_location and end_location and date:  # if all the params are available
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
            return Response(
                {"error_code": "D1005"}, status=400
            )  # returns if any one of query params is missing
