from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from bus_owner.models import SeatDetails, Trip, PickAndDrop, Routes
from .models import User, Bookings, BookedSeats, Payment

regex_alphabet_only = r"^[A-Za-z\s]*$"
regex_number_only = r"^[0-9\s]*$"
error_message_only_letter = "This field can only contain letters"
error_message_email_exist = "Email is already registered"
error_message_only_number = "This field can only contain numbers."
error_message_phone_exist = "Phone number is already registered"


class UserModelSerializer(serializers.ModelSerializer):
    """
    For viewing the user details
    """

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password", "phone")

    first_name = serializers.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=regex_alphabet_only,
                message=error_message_only_letter,
            ),
        ],
    )
    last_name = serializers.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=regex_alphabet_only,
                message=error_message_only_letter,
            ),
        ],
    )
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message=error_message_email_exist
            ),
        ]
    )
    password = serializers.CharField(
        min_length=8,
        max_length=20,
        validators=[
            RegexValidator(
                regex=r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#\$%^&*()_+]{8,20}$",
                message="Password failed",
            ),
            UniqueValidator(
                queryset=User.objects.all(), message=error_message_phone_exist
            ),
        ],
    )
    phone = serializers.CharField(
        min_length=10,
        max_length=10,
        validators=[
            RegexValidator(regex=regex_number_only, message=error_message_only_number),
            UniqueValidator(
                queryset=User.objects.all(), message=error_message_phone_exist
            ),
        ],
    )

    # password encryption
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserDataSerializer(serializers.ModelSerializer):
    """
    For viewing the user details
    """

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "phone")


class PickAndDropSerializer(serializers.ModelSerializer):
    """
    For viewing pick and drop data for view seat details
    """

    class Meta:
        model = PickAndDrop
        fields = ["id", "bus_stop", "arrival_time"]


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
        booked_seats = obj.bookedseats_set.filter(trip_id=trip_id, status=2)
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


class TravellerDataSerializer(serializers.ModelSerializer):
    """
    For inserting traveller data
    """

    class Meta:
        model = BookedSeats
        fields = ["trip", "traveller_name", "traveller_dob", "traveller_gender", "seat"]

    traveller_name = serializers.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=regex_alphabet_only,
                message=error_message_only_letter,
            ),
        ],
    )
    traveller_dob = serializers.DateField()
    traveller_gender = serializers.CharField(
        max_length=1,
        validators=[
            RegexValidator(
                regex=r"^(1|2)*$",
                message="traveller gender has to be either 1(male) or 2(female)",
            ),
        ],
    )


class TravellerHistorySerializer(serializers.ModelSerializer):
    """
    For inserting traveller data
    """

    class Meta:
        model = BookedSeats
        fields = [
            "id",
            "trip",
            "traveller_name",
            "traveller_dob",
            "traveller_gender",
            "seat",
        ]


class BookingHistoryDataSerializer(serializers.ModelSerializer):
    """
    For viewing user's booking history
    """

    booked_seats = TravellerHistorySerializer(many=True, source="bookedseats_set")

    class Meta:
        model = Bookings
        fields = [
            "user",
            "trip",
            "pick_up",
            "drop_off",
            "status",
            "total_amount",
            "booking_id",
            "created_date",
            "booked_seats",
        ]
        depth = 3


class PaymentDataSerializer(serializers.ModelSerializer):
    """
    For inserting payment data
    """

    class Meta:
        model = Payment
        fields = ["payment_intend", "status"]


class BookSeatSerializer(serializers.ModelSerializer):
    """
    For booking seats
    """

    booked_seats = TravellerDataSerializer(many=True, source="bookedseats_set")
    payment = PaymentDataSerializer()

    class Meta:
        model = Bookings
        fields = [
            "user",
            "trip",
            "pick_up",
            "drop_off",
            "booking_id",
            "total_amount",
            "booked_seats",
            "payment",
        ]

    def create(self, validated_data):
        traveller_data = validated_data.pop("bookedseats_set")
        payment_data = validated_data.pop("payment")
        booking_id = Bookings.objects.create(**validated_data)
        for data in traveller_data:
            BookedSeats.objects.create(booking=booking_id, **data)
        # storing payment intent and status to payment table
        Payment.objects.create(booking=booking_id, **payment_data)
        return booking_id


class CancelTravellerDataSerializer(serializers.ModelSerializer):
    """
    For cancelling traveller data
    """

    class Meta:
        model = BookedSeats
        fields = ["status"]


class CancelBookingSerializer(serializers.ModelSerializer):
    """
    For cancelling bookings
    """

    class Meta:
        model = Bookings
        fields = ["status"]


class NonNegativeFloatField(serializers.FloatField):
    def to_internal_value(self, data):
        value = super().to_internal_value(data)
        if value < 0:
            raise serializers.ValidationError("total cost must be non-negative.")
        return value


class CostSerializer(serializers.Serializer):
    total_cost = NonNegativeFloatField()
