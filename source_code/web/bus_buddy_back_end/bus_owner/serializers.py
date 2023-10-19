import re
from rest_framework import serializers
from .models import Bus
from .models import Routes
from .models import Amenities


class busserializer(serializers.ModelSerializer):
    # user= serializers.CharField(required=False)

    def validate_name(self, value):
        if not re.match(r"^[A-Za-z]+$", value):
            raise serializers.ValidationError(
                "Invalid Name format. Only letters are allowed."
            )
        return value

    class Meta:
        model = Bus
        fields = "__all__"


class amenitiesserializer(serializers.ModelSerializer):
    def validate_name(self, value):
        if not re.match(r"^[A-Za-z]+$", value):
            raise serializers.ValidationError(
                "Invalid Name format. Only letters are allowed."
            )
        return value

    class Meta:
        model = Amenities
        fields = "__all__"


class updateamenitiesserializer(serializers.ModelSerializer):
    def validate_name(self, value):
        if not re.match(r"^[A-Za-z]+$", value):
            raise serializers.ValidationError(
                "Invalid Name format. Only letters are allowed."
            )
        return value

    class Meta:
        model = Amenities
        fields = (
            "bus",
            "emergency_no",
            "water_bottle",
            "charging_point",
            "usb_port",
            "blankets",
            "pillows",
            "reading_light",
            "toilet",
            "snacks",
            "tour_guide",
            "cctv",
        )


class buddyserializer(serializers.ModelSerializer):
    user = serializers.CharField(required=False)

    def validate_name(self, value):
        if not re.match(r"^[A-Za-z]+$", value):
            raise serializers.ValidationError(
                "Invalid Name format. Only letters are allowed."
            )
        return value

    class Meta:
        model = Bus
        fields = "__all__"


class routesserializer(serializers.ModelSerializer):
    # user= serializers.CharField(required=False)

    def validate_name(self, value):
        if not re.match(r"^[A-Za-z]+$", value):
            raise serializers.ValidationError(
                "Invalid Name format. Only letters are allowed."
            )
        return value

    class Meta:
        model = Routes
        fields = "__all__"


class routeserializer(serializers.ModelSerializer):
    user = serializers.CharField(required=False)

    def validate_name(self, value):
        if not re.match(r"^[A-Za-z]+$", value):
            raise serializers.ValidationError(
                "Invalid Name format. Only letters are allowed."
            )
        return value

    class Meta:
        model = Routes
        fields = "__all__"
