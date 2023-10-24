import re
from rest_framework import serializers
from .models import Bus,Routes,Amenities,PickAndDrop,StartStopLocations



class BusSerializer(serializers.ModelSerializer):
    # user= serializers.CharField(required=False)

    def validate_name(self, value):
        if not re.match(r"^[A-Za-z]+$", value):
            raise serializers.ValidationError(
                "Invalid Name format. Only letters are allowed."
            )
        return value

    def validate_plate_no(self, value):
        plate_no_pattern = r'^(?=.*[A-Za-z])(?=.*\d).+$'

        if not re.match(plate_no_pattern, value):
            raise serializers.ValidationError("Invalid Plate Number format. It should contain at least one letter and one number.")
    class Meta:
        model = Bus
        fields = "__all__"


class AmenitiesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Amenities
        fields = "__all__"


class UpdateamenitiesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Amenities
        fields = "__all__"


class ViewBusSerializer(serializers.ModelSerializer):
    user = serializers.CharField(required=False)

    class Meta:
        model = Bus
        fields = "__all__"




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