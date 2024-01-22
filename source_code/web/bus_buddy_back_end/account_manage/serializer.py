from django.core.validators import RegexValidator
from django.forms import ValidationError
from rest_framework import serializers
from .models import User


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
    old_password = serializers.CharField(max_length=20,validators=[
            RegexValidator(
                regex=r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%^&*()_+])[A-Za-z\d!@#\$%^&*()_+]{8,20}$",
                message="password not valid",
            ),
        ],)
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
