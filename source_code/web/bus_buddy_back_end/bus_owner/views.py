from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializer import SeatDetailSerializer as SDS
# Create your views here.
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