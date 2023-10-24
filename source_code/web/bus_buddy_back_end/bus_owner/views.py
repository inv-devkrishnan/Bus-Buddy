from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializer import SeatDetailSerializer as SDS
from .serializer import GetSeatSerializer as GSS
from .models import SeatDetails


class AddSeatDetails(APIView):
    permission_classes=(AllowAny,)
    
    def post(self,request):
        request_data = request.data
        serialized_data = SDS(data=request_data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response({"message":"details added successfully"},status=201)
        else:
            return Response(serialized_data._errors,status=400)

class GetSeatDetails(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        ui_order = request.GET["seat_ui_order"]
        request_data=SeatDetails.objects.get(seat_ui_order=ui_order)
        serialized_data=SDS(request_data)
        return Response(serialized_data.data)