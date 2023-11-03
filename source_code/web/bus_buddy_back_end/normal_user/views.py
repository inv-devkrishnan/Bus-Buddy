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
                serializer = SeatDetailsViewSerialzer(
                    SeatDetails.objects.filter(bus_id=bus_id), many=True
                )
                return Response(serializer.data,status=200)
            except ValueError:
                return Response({"error_code": "D1006"}, status=400)

        else:
            return Response({"error_code": "D1005"}, status=400)
