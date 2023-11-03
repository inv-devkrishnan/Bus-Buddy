from rest_framework import serializers
from bus_owner.models import SeatDetails
from .models import BookedSeats


class BookedSeatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookedSeats
        fields = ["traveller_gender"]


class SeatDetailsViewSerialzer(serializers.ModelSerializer):
    booked = BookedSeatsSerializer(many=True, read_only=True, source="bookedseats_set")

    class Meta:
        model = SeatDetails
        fields = ["id","seat_number","seat_type","deck","seat_cost","bus","seat_ui_order" , "booked"]
