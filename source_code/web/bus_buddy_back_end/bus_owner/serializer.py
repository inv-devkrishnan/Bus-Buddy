from rest_framework import serializers
from .models import SeatDetails
from rest_framework.validators import UniqueValidator


class SeatDetailSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = SeatDetails
        fields = "__all__"
    
    seat_number = serializers.CharField(max_length=50)
    seat_ui_order = serializers.IntegerField(
        validators=[
            UniqueValidator(
                queryset=SeatDetails.objects.all(), message="This seat data is already saved!!"
            ),
        ])
    seat_type = serializers.IntegerField(default=0)
    deck = serializers.IntegerField(default=0)
    seat_cost = serializers.DecimalField(max_digits=10, decimal_places=3)
    
class GetSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatDetails
        fields=('id', 'seat_number', 'seat_ui_order', 'seat_type', 'deck', 'seat_cost')
