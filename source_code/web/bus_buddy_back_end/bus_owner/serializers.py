import re
from rest_framework import serializers
from .models import Routes,PickAndDrop,StartStopLocations

class ViewRoutesSerializer(serializers.ModelSerializer):
    user = serializers.CharField(required=False)
    start_point = serializers.CharField(required=False)
    end_point = serializers.CharField(required=False)
    class Meta:
        model = Routes
        fields = '__all__'
        
class PickAndDropSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickAndDrop
        fields = '__all__'

class StartStopLocationsSerializer(serializers.ModelSerializer):
    # pick_and_drop = PickAndDropSerializerTest(many=True)
    
    class Meta:
        model = StartStopLocations
        fields = '__all__' 
        
class RoutesSerializer(serializers.ModelSerializer):
    # location = StartStopLocationsSerializerTest(many=True)

    class Meta:
        model = Routes
        fields = '__all__'