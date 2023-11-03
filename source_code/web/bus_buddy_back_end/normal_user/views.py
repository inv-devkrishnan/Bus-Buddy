from django.shortcuts import render
from django.db.models import F
from django.db.models import Q  # to check not equal in filter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView, ListAPIView
from rest_framework.permissions import AllowAny
from account_manage.models import User
from normal_user.serializer import UserModelSerializer as UMS
from normal_user.serializer import UserDataSerializer as UDS
from bus_owner.models import StartStopLocations
from datetime import datetime, timedelta


class RegisterUser(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serialized_data = UMS(data=request.data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response({"message": "registration successfull"}, status=201)
        else:
            return Response(serialized_data._errors, status=400)


class UpdateProfile(UpdateAPIView):
    permission_classes = (AllowAny,)

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(status=404)

        serialized_data = UDS(user)
        return Response(serialized_data.data)

    def update(self, request, id):
        try:
            instance = User.objects.get(id=id)
            current_data = request.data
            serializer = UMS(instance, data=current_data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({"message": "updated succesffully"}, status=200)
        except TypeError:
            return Response(serializer.errors, status=400)

    def put(self, request, id):
        return self.update(request, id)


class ViewTrip(ListAPIView):
    def add_date_offset(self, tripdate, offset):
        """Function to add days to start date of the trip to match the arrival time at the location"""
        return str(tripdate + timedelta(days=offset))

    def list(self, request):
        # route_ids = StartStopLocations.objects.filter(location_id=6).values_list('route_id', flat=True)
        # # Perform self-join using route_id and location_id=8
        # result = StartStopLocations.objects.filter(route_id__in=route_ids, location_id=7)
        # return Response(result.values())
        start_location = request.GET.get("start")
        end_location = request.GET.get("end")
        date = request.GET.get("date")
        if start_location and end_location and date:
            query = """
            SELECT s.id, s.route_id, s.arrival_time as start_arrival_time,
                   e.arrival_time as end_arrival_time,
                   s.arrival_date_offset as start_offset,
                   e.arrival_date_offset as end_offset,
                   r.via, r.travel_fare, t.start_date, t.end_date,
                   t.id as trip_id, b.bus_name, b.id as bus_id
            FROM start_stop_locations s
            INNER JOIN start_stop_locations e
              ON s.route_id = e.route_id and s.location_id=%s and e.location_id=%s
            LEFT JOIN routes r
              ON r.id = s.route_id and r.status = 0
            INNER JOIN trip t
              ON t.route_id = s.route_id and t.start_date = %s and t.status = 0
            INNER JOIN bus b
              ON b.id = t.bus_id and b.status = 0 and b.bus_details_status = 2;
        """
            result = StartStopLocations.objects.raw(
                query, [start_location, end_location, date]
            )
            trip_list = []
            for data in result:
                arrival_date = self.add_date_offset(data.start_date, data.start_offset)
                if date == str(arrival_date):
                    trip_data = {
                        "route": data.route_id,
                        "start_location_arrival_time": data.start_arrival_time,
                        "end_location_arrival_time": data.end_arrival_time,
                        "start_location_arrival_date": arrival_date,
                        "end_location_arrival_date": self.add_date_offset(
                            data.start_date, data.end_offset
                        ),
                        "via": data.via,
                        "travel_fare": data.travel_fare,
                        "trip": data.trip_id,
                        "bus_name": data.bus_name,
                        "bus": data.bus_id,
                    }
                    trip_list.append(trip_data)

            return Response(trip_list)
        else:
            return Response({"error_code:D1005"}, status=400)
