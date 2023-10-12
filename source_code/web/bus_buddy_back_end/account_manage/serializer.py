from django.core.validators import RegexValidator
from rest_framework import serializers
from .models import User


class GoogleAuthSerializer(serializers.Serializer):
    cred_token = serializers.CharField()


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=100)
    password = serializers.CharField(max_length=50)

    class Meta:
        model = User
        fields = ["email", "password"]
        ordering = ["id"]


class PasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=100)
    new_password = serializers.CharField(
        max_length=12,
        validators=[
            RegexValidator(
                regex=r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%^&*()_+])[A-Za-z\d!@#\$%^&*()_+]{8,20}$",
                message="Name can only contain letters",
            ),
        ],
    )
