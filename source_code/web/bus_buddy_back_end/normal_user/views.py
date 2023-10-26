from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializer import SeatDetailsViewSerialzer
from bus_owner.models import SeatDetails


class ViewSeats(APIView):
    permission_classes = (AllowAny,)
    def get(self, request):
        bus_id = request.GET.get("bus_id")
        if bus_id:
            try:
                lower_deck_seats = SeatDetailsViewSerialzer(
                    SeatDetails.objects.filter(bus_id=bus_id, deck=0), many=True
                )
                upper_deck_seats = SeatDetailsViewSerialzer(
                    SeatDetails.objects.filter(bus_id=bus_id, deck=1), many=True
                )
                return Response({
                    "lower_deck" : lower_deck_seats.data,
                    "upper_deck" : upper_deck_seats.data
                })
            except ValueError:
                return Response({"error_code": "D1006"},status=400)
                    
        else:
            return Response({"error_code": "D1005"}, status=400)
