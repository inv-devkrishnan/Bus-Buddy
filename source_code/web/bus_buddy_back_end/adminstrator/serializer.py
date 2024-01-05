from rest_framework import serializers
from datetime import date
from account_manage.models import User
from normal_user.models import UserComplaints
from bus_owner.models import Trip, Routes, LocationData
from .models import CouponDetails
from django.core.validators import RegexValidator, MinValueValidator
from rest_framework.validators import UniqueValidator


regex_alphabet_only = r"^[A-Za-z\s]*$"
regex_number_only = r"^[0-9\s]*$"
error_message_only_letter = "This field can only contain letters"
error_message_email_exist = "D1007"
error_message_only_number = "This field can only contain numbers."
error_message_phone_exist = "D1008"


class AdminUpdateSerializer(serializers.ModelSerializer):
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

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "phone")


class ListUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "phone",
            "company_name",
            "aadhaar_no",
            "msme_no",
            "status",
        )


class UserNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "email"]


class ListUserComplaints(serializers.ModelSerializer):
    user = UserNameSerializer()

    class Meta:
        model = UserComplaints
        fields = (
            "id",
            "complaint_title",
            "complaint_body",
            "status",
            "created_date",
            "response",
            "user",
        )
        depth = 1


class BanUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("status", "id")


class ComplaintResponseSerializer(serializers.ModelSerializer):
    response = serializers.CharField(max_length=5000)

    class Meta:
        model = UserComplaints
        fields = ("response", "status")


class BusOwnerListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "company_name")


class LocationDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationData
        fields = ("location_name",)


class StartPointAndEndPointSerializer(serializers.ModelSerializer):
    start_point = LocationDataSerializer()
    end_point = LocationDataSerializer()

    class Meta:
        model = Routes
        fields = ("start_point", "end_point")
        depth = 1


class TripListSerializer(serializers.ModelSerializer):
    route = StartPointAndEndPointSerializer()
    user = BusOwnerListSerializer()

    class Meta:
        model = Trip
        fields = ("id", "route", "start_date", "user")


class CouponCreationSerializer(serializers.ModelSerializer):
    coupon_description = serializers.CharField(max_length=500)
    coupon_code = serializers.CharField(
        validators=[UniqueValidator(queryset=CouponDetails.objects.all())]
    )
    coupon_name = serializers.CharField(max_length=80)
    coupon_eligibility = serializers.IntegerField(min_value=0, max_value=1)
    coupon_availability = serializers.IntegerField(min_value=0, max_value=2)
    discount = serializers.IntegerField(min_value=2, max_value=98)
    one_time_use = serializers.IntegerField(min_value=0, max_value=1)
    valid_till = serializers.DateField(
        validators=[MinValueValidator(limit_value=date.today())]
    )

    def validate(self, attrs):
        coupon_availability = attrs.get("coupon_availability")
        user = attrs.get("user")
        trip = attrs.get("trip")
        if coupon_availability == 1 and not user:
            raise serializers.ValidationError(
                "Should specify user id if coupon_availability is based on bus owners"
            )
        if coupon_availability == 1 and trip:
            raise serializers.ValidationError(
                "trip is not a valid field for this operation"
            )
        if coupon_availability == 2 and not trip:
            raise serializers.ValidationError(
                "Should specify trip id if coupon_availability is based on trip"
            )
        if coupon_availability == 2 and user:
            raise serializers.ValidationError(
                "user is not a valid field for this operation"
            )
        if (coupon_availability == 0 and user) or (coupon_availability == 0 and trip):
            raise serializers.ValidationError(
                "user or trip field is invalid field for this operation"
            )
        return super().validate(attrs)

    class Meta:
        model = CouponDetails
        fields = "__all__"


class CouponViewSerializer(serializers.ModelSerializer):
    user = BusOwnerListSerializer()
    trip = TripListSerializer()

    class Meta:
        model = CouponDetails
        exclude = ("created_date", "updated_date")
