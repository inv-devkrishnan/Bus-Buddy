from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .serializer import SeatDetailSerializer as SDS
from .serializer import GetSeatSerializer as GSS
from .models import SeatDetails


class AddSeatDetails(APIView):
    """
    For adding individual seat details
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        request_data = request.data
        serialized_data = SDS(data=request_data)
        try:
            if serialized_data.is_valid():
                serialized_data.save()
                return Response({"message": "details added successfully"}, status=201)
        except ValidationError:
            return Response(serialized_data._errors, status=400)


class GetSeatDetails(APIView):
    """
    For viewing seat details
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        ui_order = request.GET["seat_ui_order"]
        bus_id = request.GET["bus_id"]
        if SeatDetails.objects.filter(seat_ui_order=ui_order, bus=bus_id):
            request_data = SeatDetails.objects.get(seat_ui_order=ui_order, bus=bus_id)
            serialized_data = SDS(request_data)
            return Response(serialized_data.data)
        else:
            return Response({"message": "Seat detail not registered"})
