from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializer import SeatDetailSerializer as SDS
from .serializer import GetSeatSerializer as GSS
from .models import SeatDetails


class AddSeatDetails(APIView):
    """
    API for adding seat details

    Returns:
        json: success message
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        request_data = request.data
        bus_id = request.data.get("bus")
        ui_order = request.data.get("seat_ui_order")
        serialized_data = SDS(data=request_data)
        try:
            if SeatDetails.objects.filter(seat_ui_order=ui_order, bus=bus_id):
                return Response({"data": "seat detail already registered"}, status=200)
            else:
                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response(
                        {"message": "details added successfully"}, status=201
                    )

                else:
                    return Response(serialized_data.errors, status=200)
        except Exception as e:
            return Response({"error": f"{e}"}, status=400)


class GetSeatDetails(APIView):
    """
    API for fetching seat details

    Args:
        bus_id (integer): id of the bus that the seat data belong to

    Returns:
        json: whole seat data for the corresponding bus id
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        bus_id = request.GET["bus_id"]
        try:
            if SeatDetails.objects.filter(bus=bus_id):
                request_data = SeatDetails.objects.filter(bus=bus_id)
                serialized_data = GSS(request_data, many=True)
                return Response(serialized_data.data)
            else:
                return Response({"data": "no data"}, status=200)
        except Exception as e:
            return Response({"error": f"{e}"}, status=400)
