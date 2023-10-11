import re
from rest_framework import serializers
from .models import Bus

class buddyserializer(serializers.ModelSerializer):
    Status = serializers.CharField(required=False)

    def validate_name(self, value):
        if not re.match(r'^[A-Za-z]+$', value):
            raise serializers.ValidationError("Invalid Name format. Only letters are allowed.")
        return value

    class Meta:
        model = Bus  # Replace with your actual model name
        fields = '__all__'