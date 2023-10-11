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
