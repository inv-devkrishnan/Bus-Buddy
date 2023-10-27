from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from bus_owner.models import LocationData;

class GetLocationData(APIView):
    permission_classes = (AllowAny,)
    def get(self,request):
        location_data = LocationData.objects.all().values("id","location_name")
        return Response(location_data)