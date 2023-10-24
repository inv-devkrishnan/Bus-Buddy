from rest_framework import serializers
from .models import SeatDetails

class SeatDetailSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = SeatDetails
        fields = "__all__"
    
    seat_number = serializers.CharField(max_length=50)
    seat_type = serializers.IntegerField(default=0)
    deck = serializers.IntegerField(default=0)
    seat_cost = serializers.DecimalField(max_digits=7, decimal_places=5)
