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
from .models import User
from .models import Trip
from .models import Bus
from .models import Routes
from .models import User
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator


regex_alphabet_only = r"^[A-Za-z\s]*$"
regex_number_only = r"^[0-9\s]*$"
error_message_only_letter = "This field can only contain letters"
error_message_email_exist = "Email is already registered"
error_message_only_number = "This field can only contain numbers."
error_message_phone_exist = "Phone number is already registered"


class BusSerializer(serializers.ModelSerializer):
    def validate_name(self, value):
        if not re.match(r"^[A-Za-z():,\.]+$", value):
            raise serializers.ValidationError(
                "Invalid Name format. Only letters are allowed."
            )
        return value

    class Meta:
        model = Bus
        fields = "__all__"


class AmenitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenities
        fields = "__all__"


class UpdateamenitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenities
        fields = "__all__"


class ViewBusSerializer(serializers.ModelSerializer):
    # user = serializers.CharField(required=False)
    amenities_data = AmenitiesSerializer(
        many=True, read_only=True, source="amenities_set"
    )

    class Meta:
        model = Bus
        fields = ("id", "bus_name", "plate_no", "bus_type", "bus_ac", "amenities_data")
        # depth=1


class Locationdata(serializers.ModelSerializer):
    class Meta:
        model = LocationData
        fields = "__all__"


class ViewRoutesSerializer(serializers.ModelSerializer):
    start_point_name = serializers.CharField(
        source="start_point.location_name", read_only=True
    )  # to get name matchin the id from location
    end_point_name = serializers.CharField(
        source="end_point.location_name", read_only=True
    )  # to get name matchin the id from location

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
        )
        # depth=1


class PickAndDropSerializer(serializers.ModelSerializer):
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
    pick_and_drop = PickAndDropSerializer(many=True, source="stops")

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
    location = StartStopLocationsSerializer(many=True)

    class Meta:
        model = Routes
        fields = [
            "id",
            "user",
            "start_point",
            "end_point",
            "via",
            "travel_fare",
            "duration",
            "distance",
            "location",
        ]

    def create(self, validated_data):
        start_stop_locations = validated_data.pop("location")
        routes = Routes.objects.create(**validated_data)
        for data in start_stop_locations:
            pad_obj = data.pop("stops")
            ssl_obj = StartStopLocations.objects.create(route=routes, **data)
            for i in pad_obj:
                PickAndDrop.objects.create(
                    route=routes, start_stop_location=ssl_obj, **i
                )

        return routes


class TripSerializer(serializers.ModelSerializer):
    bus = serializers.PrimaryKeyRelatedField(queryset=Bus.objects.all())
    route = serializers.PrimaryKeyRelatedField(queryset=Routes.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Trip
        fields = "__all__"


class ViewTripSerializer(serializers.ModelSerializer):
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
        )


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
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message=error_message_email_exist
            ),
        ]
    )
    password = serializers.CharField(
        max_length=12,
        validators=[
            RegexValidator(
                regex=r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%^&*()_+])[A-Za-z\d!@#\$%^&*()_+]{8,20}$",
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
                regex=r"^[0-9\s]*$",
                message="Aadhaar number can only contain numbers.",
            ),
            UniqueValidator(
                queryset=User.objects.all(),
                message="Adhaar number is already registered",
            ),
        ],
    )
    msme_no = serializers.CharField(
        max_length=20,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="MSME number is already registered",
            ),
        ],
    )
    extra_charges = serializers.DecimalField(max_digits=12, decimal_places=5)

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
        fields = ("seat_number", "seat_ui_order", "seat_type", "deck", "seat_cost")

    seat_number = serializers.CharField(max_length=50)
    seat_type = serializers.IntegerField(default=0)
    deck = serializers.IntegerField(default=0)
    seat_cost = serializers.DecimalField(max_digits=10, decimal_places=3)
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
