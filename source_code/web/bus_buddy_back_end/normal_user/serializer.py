from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from .models import User
from .models import Bookings

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
                regex=r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%^&*()_+])[A-Za-z\d!@#\$%^&*()_+]{8,20}$",
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


class BookingHistoryDataSerializer(serializers.ModelSerializer):
    """
    For viewing user's booking history
    """

    class Meta:
        model = Bookings
        fields = "__all__"
        depth = 2
