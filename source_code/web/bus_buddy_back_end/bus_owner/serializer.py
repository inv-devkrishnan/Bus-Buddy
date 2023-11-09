from rest_framework import serializers
from .models import SeatDetails,User
from rest_framework.validators import UniqueValidator
from django.core.validators import RegexValidator


regex_alphabet_only = r"^[A-Za-z\s]*$"
regex_number_only = r"^[0-9\s]*$"
error_message_only_letter = "This field can only contain letters"
error_message_email_exist = "Email is already registered"
error_message_only_number = "This field can only contain numbers."
error_message_phone_exist = "Phone number is already registered"


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
            "extra_charges"
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
    """
    Serializer for adding seat detail
    """

    class Meta:
        model = SeatDetails
        fields = "__all__"

    seat_number = serializers.CharField(max_length=50)
    seat_ui_order = serializers.IntegerField()
    seat_type = serializers.IntegerField(default=0)
    deck = serializers.IntegerField(default=0)
    seat_cost = serializers.DecimalField(max_digits=10, decimal_places=3)


class GetSeatSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing seat data
    """

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