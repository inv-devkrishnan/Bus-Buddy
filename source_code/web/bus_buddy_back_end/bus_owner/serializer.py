from rest_framework import serializers
from .models import User
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator

regex_alphabet_only = r"^[A-Za-z\s]*$"
regex_number_only = r"^[0-9\s]*$"
error_message_only_letter = "This field can only contain letters"
error_message_email_exist = "Email is already registered"
error_message_only_number = "This field can only contain numbers."
error_message_phone_exist = "Phone number is already registered"


class OwnerModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

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
                queryset=User.objects.all(), message="Phone number is already registered"
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



class OwnerDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "phone", "company_name")

  


