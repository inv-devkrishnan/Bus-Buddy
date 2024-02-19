from datetime import datetime, date, timedelta
import re
from rest_framework import serializers
from rest_framework.fields import empty
from .models import (
    Bus,
    Routes,
    Amenities,
    PickAndDrop,
    StartStopLocations,
    LocationData,
    SeatDetails,
)
from django.db import models
from .models import User
from .models import Trip
from account_manage.models import Notifications
from normal_user.models import UserReview, BookedSeats, Bookings
from django.core.validators import (
    MaxLengthValidator,
    MinLengthValidator,
    RegexValidator,
)
from rest_framework.validators import UniqueValidator


regex_alphabet_only = r"^[A-Za-z\s]*$"
regex_number_only = r"^[0-9\s]*$"
regex_decimal_entry = r"^\d+(\.\d+)?$"
regex_options_entry = r"^[0-2]$"
error_message_only_letter = "This field can only contain letters"
error_message_email_exist = "Email is already registered"
error_message_only_number = "This field can only contain numbers."
error_message_phone_exist = "Phone number is already registered"
date_format = "%Y-%m-%d"


class ReviewSerializer(serializers.ModelSerializer):
    """
    serializer for model Userreviews. For listing
    """

    class Meta:
        model = UserReview
        fields = "__all__"
        depth = 1


class BusSerializer(serializers.ModelSerializer):
    """
    serializer for model Bus.For post and update
    """

    bus_name = serializers.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                r"^[A-Za-z0-9():',. ]+$",
                message="Invalid Name format. Only letters, numbers or (),: are allowed.",
            )
        ],
    )
    plate_no = serializers.CharField(
        max_length=10,
        validators=[
            MinLengthValidator(
                limit_value=9, message="Plate number must be at least 9 characters."
            ),
            MaxLengthValidator(
                limit_value=10, message="Plate number can be at most 10 characters."
            ),
            RegexValidator(
                regex=r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$",
                message="Invalid Plate Number format. It should contain only letters and numbers.",
            ),
            UniqueValidator(
                queryset=Bus.objects.all(), message="Plate no already exist"
            ),
        ],
    )
    bus_seat_type = serializers.IntegerField(
        validators=[
            RegexValidator(
                regex=regex_options_entry, message="Seat type must be 0, 1, or 2."
            ),
        ]
    )
    status = serializers.IntegerField(
        required=False,
        validators=[
            RegexValidator(
                regex=r"^(0|1|99)$", message="Bus status must be 0, 1, or 99."
            ),
        ],
    )
    bus_type = serializers.IntegerField(
        validators=[
            RegexValidator(
                regex=regex_options_entry, message="Bus type must be 0, 1, or 2."
            ),
        ]
    )
    bus_ac = serializers.IntegerField(
        validators=[
            RegexValidator(regex=r"^[0-1]$", message="Bus A/c must be 0 or 1"),
        ]
    )
    bus_details_status = serializers.IntegerField(
        required=False,
        validators=[
            RegexValidator(
                regex=r"^[0-2]$", message="Bus details status must be 0, 1, or 2."
            ),
        ],
    )

    class Meta:
        model = Bus
        fields = "__all__"


def validate_zero_or_one(value):
    if value not in [0, 1]:
        raise serializers.ValidationError("This field must be 0 or 1.")


class AmenitiesSerializer(serializers.ModelSerializer):
    """
    serilizer for Amenities model.For post and update
    """

    emergency_no = serializers.IntegerField(validators=[validate_zero_or_one])
    water_bottle = serializers.IntegerField(validators=[validate_zero_or_one])
    charging_point = serializers.IntegerField(validators=[validate_zero_or_one])
    usb_port = serializers.IntegerField(validators=[validate_zero_or_one])
    blankets = serializers.IntegerField(validators=[validate_zero_or_one])
    pillows = serializers.IntegerField(validators=[validate_zero_or_one])
    reading_light = serializers.IntegerField(validators=[validate_zero_or_one])
    toilet = serializers.IntegerField(validators=[validate_zero_or_one])
    snacks = serializers.IntegerField(validators=[validate_zero_or_one])
    tour_guide = serializers.IntegerField(validators=[validate_zero_or_one])
    cctv = serializers.IntegerField(validators=[validate_zero_or_one])

    class Meta:
        model = Amenities
        fields = "__all__"


class ViewBusSerializer(serializers.ModelSerializer):
    """
    serilizer for bus model.For listing
    """

    amenities_data = AmenitiesSerializer(
        many=True, read_only=True, source="amenities_set"
    )  # to list amenities list associated with the bus

    class Meta:
        model = Bus
        fields = (
            "id",
            "bus_name",
            "plate_no",
            "bus_type",
            "bus_ac",
            "amenities_data",
            "user",
            "bus_seat_type",
            "bus_details_status",
        )


class Locationdata(serializers.ModelSerializer):
    class Meta:
        model = LocationData
        fields = "__all__"


class StartStopLocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartStopLocations
        fields = "__all__"


class ViewRoutesSerializer(serializers.ModelSerializer):
    """
    serilizer for routes model.for listing
    """

    location = StartStopLocationsSerializer(many=True, read_only=True)
    start_point_name = serializers.CharField(
        source="start_point.location_name",
        read_only=True,  # to get the name of startponit from locations_data model
    )  # to get name matchin the id from location
    end_point_name = (
        serializers.CharField(  # to get the name of endpoint from locations_data model
            source="end_point.location_name", read_only=True
        )
    )  # to get name matchin the id from location

    start_time = serializers.SerializerMethodField()
    stop_time = serializers.SerializerMethodField()

    class Meta:
        model = Routes
        fields = (
            "start_point_name",
            "end_point_name",
            "via",
            "distance",
            "travel_fare",
            "duration",
            "id",
            "user",
            "location",
            "start_time",
            "stop_time",
        )
        depth = 1

    def get_start_time(self, obj):
        start_stop_location = obj.location.first()
        return start_stop_location.arrival_time if start_stop_location else None

    def get_stop_time(self, obj):
        start_stop_location = obj.location.last()
        return start_stop_location.departure_time if start_stop_location else None


class PickAndDropSerializer(serializers.ModelSerializer):
    """
    serilizer for Pickanddropserilizer
    """

    arrival_time = serializers.TimeField(
        format="%H:%M",
    )
    bus_stop = serializers.CharField(
        validators=[
            RegexValidator(
                r"^[A-Za-z0-9 \.]+$",
                message="bus stop can only have alphabets and numbers",
            ),
        ]
    )
    landmark = serializers.CharField(
        validators=[
            RegexValidator(
                r"^[A-Za-z0-9 \.]+$",
                message="landmark can only have alphabets and numbers",
            ),
        ]
    )

    class Meta:
        model = PickAndDrop
        fields = (
            "bus_stop",
            "arrival_time",
            "landmark",
            "start_stop_location",
            "route",
        )


class StartStopLocationsSerializer(serializers.ModelSerializer):
    """
    serilizer for startstoplocations model
    """

    pick_and_drop = PickAndDropSerializer(many=True, source="stops")
    arrival_time = serializers.TimeField(
        format="%H:%M",
    )
    departure_time = serializers.TimeField(
        format="%H:%M",
    )
    seq_id = serializers.IntegerField(
        validators=[
            RegexValidator(
                regex_number_only, message="sequence id should be an positive integer"
            ),
        ]
    )
    arrival_date_offset = serializers.IntegerField(
        validators=[
            RegexValidator(
                regex_number_only,
                message="arrival date offset should be an positive integer",
            ),
        ]
    )
    departure_date_offset = serializers.IntegerField(
        validators=[
            RegexValidator(
                regex_number_only,
                message="departure date offset should be an positive integer",
            ),
        ]
    )

    class Meta:
        model = StartStopLocations
        fields = (
            "seq_id",
            "location",
            "arrival_time",
            "arrival_date_offset",
            "departure_time",
            "departure_date_offset",
            "route",
            "pick_and_drop",
        )


class RoutesSerializer(serializers.ModelSerializer):
    """
    serializer for route model.for post and update
    """

    location = StartStopLocationsSerializer(many=True)
    via = serializers.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                r"^[A-Za-z0-9 \.]",
                message="landmark can only have alphabets and numbers",
            )
        ],
    )
    distance = serializers.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex_decimal_entry,
                message="Invalid format , Only numbers, including decimals, are allowed.",
            )
        ],
    )
    duration = serializers.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex_decimal_entry,
                message="Invalid format. Only numbers, including decimals, are allowed.",
            )
        ],
    )
    travel_fare = serializers.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                r"^\d+(\.\d+)?$",
                message="Invalid format. Only numbers, including decimals, are allowed.",
            )
        ],
    )

    class Meta:
        model = Routes
        fields = [
            "id",
            "end_point",
            "via",
            "travel_fare",
            "duration",
            "distance",
            "location",
            "user",
            "start_point",
        ]

    def create(self, validated_data):
        # overwriting create method to handle nested input
        start_stop_locations = validated_data.pop(
            "location"
        )  # storing loction data for startstoplocation model into variable
        routes = Routes.objects.create(**validated_data)  # creating route object
        for data in start_stop_locations:
            pad_obj = data.pop("stops")
            ssl_obj = StartStopLocations.objects.create(
                route=routes, **data
            )  # creating startstoplocations object
            for i in pad_obj:
                PickAndDrop.objects.create(
                    route=routes, start_stop_location=ssl_obj, **i
                )  # creatinig pickanddrop objects

        return routes


class TripSerializer(serializers.ModelSerializer):
    """
    serializer for trip model.for post and update
    """

    bus = serializers.PrimaryKeyRelatedField(queryset=Bus.objects.all())
    route = serializers.PrimaryKeyRelatedField(queryset=Routes.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    start_date = serializers.DateField(format=date_format)
    end_date = serializers.DateField(format=date_format)

    def validate_start_date(self, value):
        today = datetime.now().date()

        if value < today:
            raise serializers.ValidationError(
                "Start date must be today or in the future."
            )

        six_months_from_today = today + timedelta(days=6 * 30)
        if value > six_months_from_today:
            raise serializers.ValidationError(
                "Start date should not be greater than 6 months from today."
            )
        return value

    def validate_end_date(self, value):
        start_date_str = self.initial_data.get("start_date")
        start_date = datetime.strptime(start_date_str, date_format).date()

        if value < start_date:
            raise serializers.ValidationError(
                "End date should be in the future or the same day as start date."
            )
        return value

    start_time = serializers.TimeField(format="%H:%M")
    end_time = serializers.TimeField(format="%H:%M")

    status = serializers.IntegerField(
        required=False,
        validators=[
            RegexValidator(regex=r"^(0|99)$", message="trip status must be 0 or 99."),
        ],
    )

    class Meta:
        model = Trip
        fields = "__all__"


class ViewTripSerializer(serializers.ModelSerializer):
    """
    serializer for trip model.for listing
    """

    start_point_name = serializers.CharField(
        source="route.start_point.location_name", read_only=True
    )  # to get name matchin the id from location
    end_point_name = serializers.CharField(
        source="route.end_point.location_name", read_only=True
    )  # to get name matchin the id from location
    bus_name = serializers.CharField(source="bus.bus_name", read_only=True)

    class Meta:
        model = Trip
        fields = (
            "start_point_name",
            "end_point_name",
            "id",
            "start_date",
            "end_date",
            "bus_name",
            "bus",
            "route",
        )
        depth = 1


class OwnerModelSerializer(serializers.ModelSerializer):
    """
    For registering a bus owner
    """

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "password",
            "phone",
            "company_name",
            "aadhaar_no",
            "msme_no",
            "extra_charges",
            "status",
            "role",
        )

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
        max_length=100,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message=error_message_email_exist
            ),
        ],
    )
    password = serializers.CharField(
        min_length=8,
        max_length=12,
        validators=[
            RegexValidator(
                regex=r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#\$%^&*()_+]{8,20}$",
                message="Password failed",
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
            UniqueValidator(
                queryset=User.objects.all(),
                message="Phone number is already registered",
            ),
        ],
    )
    company_name = serializers.CharField(max_length=100)
    aadhaar_no = serializers.CharField(
        max_length=12,
        min_length=12,
        validators=[
            RegexValidator(
                regex=regex_number_only,
                message="Aadhaar number can only contain numbers.",
            ),
            UniqueValidator(
                queryset=User.objects.all(),
                message="Aadhaar number is already registered",
            ),
        ],
    )
    msme_no = serializers.CharField(
        max_length=25,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="MSME number is already registered",
            ),
        ],
    )
    extra_charges = serializers.IntegerField(min_value=0, max_value=100)

    # password encryption
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class OwnerDataSerializer(serializers.ModelSerializer):
    """
    For viewing the bus owner details
    """

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "phone", "company_name")


class SeatDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatDetails
        fields = (
            "seat_number",
            "seat_ui_order",
            "seat_type",
            "deck",
            "seat_cost",
            "bus",
        )

    seat_number = serializers.CharField(max_length=50)
    seat_type = serializers.IntegerField(
        default=0,
        validators=[
            RegexValidator(
                regex=r"^(0|1)$", message="Seat type must be 0(sleeper) or 1(seater)."
            ),
        ],
    )

    deck = serializers.IntegerField(
        default=0,
        validators=[
            RegexValidator(
                regex=r"^(0|1)$", message="Deck must be 0(lower deck) or 1(upper deck)."
            ),
        ],
    )
    seat_cost = serializers.DecimalField(max_digits=6, decimal_places=2)
    seat_ui_order = serializers.IntegerField()


class GetSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatDetails
        fields = (
            "id",
            "seat_number",
            "seat_ui_order",
            "seat_type",
            "deck",
            "seat_cost",
        )


class ViewNotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = "__all__"
        depth = 1


class PassengerListSerializer(serializers.ModelSerializer):
    """
    For viewing booked seat data for view seat details
    """

    seat_number = serializers.SerializerMethodField(method_name="get_seat_number")

    def get_seat_number(self, obj):
        # Get the corresponding seat number for the booked seat
        return obj.seat.seat_number if obj.seat else None

    class Meta:
        model = BookedSeats
        fields = [
            "traveller_gender",
            "trip",
            "traveller_name",
            "seat_id",
            "seat_number",
        ]
        depth = 1


class SeatDetailsViewSerialzer(serializers.ModelSerializer):
    """
    For viewing seat details
    """

    def get_booked(self, obj):
        # Filter the BookedSeats to include only those with 'trp_id'
        trip_id = self.context.get("trip_id")
        booked_seats = obj.bookedseats_set.filter(trip_id=trip_id, status=2)
        return PassengerListSerializer(
            booked_seats, many=True, context={"seat_info": obj}
        ).data

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
