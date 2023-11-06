from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializer import SeatDetailsViewSerialzer, PickAndDropSerializer
from bus_owner.models import SeatDetails, Trip, PickAndDrop


class ViewSeats(ListAPIView):
    """
    For viewing seat by user perspective and to view pick and drop points
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        trip_id = request.GET.get("trip_id")

        try:
            trip = Trip.objects.get(id=trip_id)
            serializer = SeatDetailsViewSerialzer(
                SeatDetails.objects.filter(bus_id=trip.bus_id), # data from seat details with bus id from trip table
                context={"trip_id": trip_id},
                many=True,
            )

            pick_and_drop = PickAndDrop.objects.filter(route=trip.route)
            pick_and_drop_serializer = PickAndDropSerializer(pick_and_drop, many=True) # data from pick and drop with the route id from trip table
            pick_and_drop_array =[pick_and_drop_serializer.data]
            total_data =  pick_and_drop_array + serializer.data # both seat data and pick and drop data
            return Response(total_data, status=200)
        except ValueError:
            return Response({"error_code": "D1006"}, status=400)
