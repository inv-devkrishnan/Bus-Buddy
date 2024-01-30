from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.forms import ValidationError
from rest_framework import serializers
from .models import User, EmailAndOTP
from rest_framework.validators import UniqueValidator

error_message_only_number = "This field can only contain numbers."
error_message_otp_exist = "This OTP already exists."
error_message_email_exist = "Email is already registered"
email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
regex_number_only = r"^\d*$"


class GoogleAuthSerializer(serializers.Serializer):
    cred_token = serializers.CharField()


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=100)
    password = serializers.CharField(max_length=100)

    class Meta:
        model = User
        fields = ["email", "password"]
        ordering = ["id"]


class PasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%^&*()_+])[A-Za-z\d!@#\$%^&*()_+]{8,20}$",
                message="password not valid",
            ),
        ],
    )
    new_password = serializers.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%^&*()_+])[A-Za-z\d!@#\$%^&*()_+]{8,20}$",
                message="password not valid",
            ),
        ],
    )

    def validate(self, attrs):
        if attrs.get("old_password") == attrs.get("new_password"):
            raise serializers.ValidationError(
                "old password can't be same as new password"
            )
        return super().validate(attrs)


class PlatformChargesSerializers(serializers.Serializer):
    extra_charges = serializers.DecimalField(max_digits=5, decimal_places=2)

    def validate_extra_charges(self, value):
        if not (0 <= value <= 100):
            raise ValidationError("Extra charges must be in the range of 0 to 100.")
        return value

    class Meta:
        model = User
        fields = "extra_charges"


class EmailOtpSerializer(serializers.ModelSerializer):
    """
    For storing the otp details
    """

    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=EmailAndOTP.objects.all(), message=error_message_email_exist
            ),
            RegexValidator(
                regex=email_regex,
                message="Invalid email",
            ),
        ]
    )
    otp = serializers.IntegerField(
        validators=[
            RegexValidator(regex=regex_number_only, message=error_message_only_number),
            UniqueValidator(
                queryset=EmailAndOTP.objects.all(), message=error_message_otp_exist
            ),
            MinValueValidator(0, message="OTP must be a non-negative integer."),
            MaxValueValidator(999999, message="OTP must have at most 6 digits."),
        ],
    )

    class Meta:
        model = EmailAndOTP
        fields = ("email", "otp", "status")


class EmailOtpUpdateSerializer(serializers.ModelSerializer):
    """
    For storing the otp details
    """

    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=EmailAndOTP.objects.all(), message=error_message_email_exist
            ),
            RegexValidator(
                regex=email_regex,
                message="Invalid email",
            ),
        ]
    )
    otp = serializers.IntegerField(
        validators=[
            RegexValidator(regex=regex_number_only, message=error_message_only_number),
            UniqueValidator(
                queryset=EmailAndOTP.objects.all(), message=error_message_otp_exist
            ),
            MinValueValidator(0, message="OTP must be a non-negative integer."),
            MaxValueValidator(999999, message="OTP must have at most 6 digits."),
        ],
        allow_null=True,
    )

    class Meta:
        model = EmailAndOTP
        fields = ("email", "otp", "counter", "status")
