from rest_framework import serializers
from bus_owner.models import SeatDetails, Trip, PickAndDrop,Routes
from .models import BookedSeats


class PickAndDropSerializer(serializers.ModelSerializer):
    """
    For viewing pick and drop data for view seat details
    """
    class Meta:
        model = PickAndDrop
        fields = ["id","bus_stop"]


class BookedSeatsSerializer(serializers.ModelSerializer):
    """
    For viewing booked seat data for view seat details
    """
    class Meta:
        model = BookedSeats
        fields = ["traveller_gender", "trip"]


class SeatDetailsViewSerialzer(serializers.ModelSerializer):
    """
    For viewing seat details
    """
    def get_booked(self, obj):
        # Filter the BookedSeats to include only those with 'trp_id'
        trip_id = self.context.get("trip_id")
        booked_seats = obj.bookedseats_set.filter(trip_id=trip_id)
        return BookedSeatsSerializer(booked_seats, many=True).data

    booked = serializers.SerializerMethodField(method_name="get_booked")
    
    class Meta:
        model = SeatDetails
        fields = [
            "id",
            "seat_number",
            "seat_type",
            "deck",
            "seat_cost",
            "bus",
            "seat_ui_order",
            "booked",
        ]

