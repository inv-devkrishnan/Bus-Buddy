from rest_framework import serializers
from .models import User
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator


class OwnerModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    first_name = serializers.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=r"^[A-Za-z\s]*$",
                message="Name can only contain letters",
            ),
        ],
    )
    last_name = serializers.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=r"^[A-Za-z\s]*$",
                message="Name can only contain letters",
            ),
        ],
    )
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message="Email is already registered"
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
            RegexValidator(
                regex=r"^[0-9\s]*$",
                message="Phone number can only contain numbers.",
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


class OwnerUpdateSerializer(serializers.ModelSerializer):
    container = OwnerModelSerializer

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "phone", "company_name")


class OwnerUpdateExceptEmailSerializer(serializers.ModelSerializer):
    container = OwnerModelSerializer

    class Meta:
        model = User
        fields = ("first_name", "last_name", "phone", "company_name")


class OwnerUpdateExceptPhoneSerializer(serializers.ModelSerializer):
    container = OwnerModelSerializer

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "company_name")


class OwnerUpdateOnlyNamesSerializer(serializers.ModelSerializer):
    container = OwnerModelSerializer

    class Meta:
        model = User
        fields = ("first_name", "last_name", "company_name")
