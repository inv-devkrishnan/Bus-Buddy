import re
from rest_framework import serializers
from .models import Bus
from .models import Routes


class busserializer(serializers.ModelSerializer):
    # user= serializers.CharField(required=False)

    def validate_name(self, value):
        if not re.match(r'^[A-Za-z]+$', value):
            raise serializers.ValidationError("Invalid Name format. Only letters are allowed.")
        return value

    class Meta:
        model = Bus  
        fields = '__all__'
        
class buddyserializer(serializers.ModelSerializer):
    user= serializers.CharField(required=False)

    def validate_name(self, value):
        if not re.match(r'^[A-Za-z]+$', value):
            raise serializers.ValidationError("Invalid Name format. Only letters are allowed.")
        return value

    class Meta:
        model = Bus  
        fields = '__all__'
        
class routesserializer(serializers.ModelSerializer):
    # user= serializers.CharField(required=False)

    def validate_name(self, value):
        if not re.match(r'^[A-Za-z]+$', value):
            raise serializers.ValidationError("Invalid Name format. Only letters are allowed.")
        return value

    class Meta:
        model = Routes  
        fields = '__all__'
        
class routeserializer(serializers.ModelSerializer):
    user= serializers.CharField(required=False)
    
    def validate_name(self, value):
        if not re.match(r'^[A-Za-z]+$', value):
            raise serializers.ValidationError("Invalid Name format. Only letters are allowed.")
        return value

    class Meta:
        model = Routes 
        fields = '__all__'