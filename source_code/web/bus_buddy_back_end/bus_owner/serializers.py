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


class BuddySerializer(serializers.ModelSerializer):
    user = serializers.CharField(required=False)

    class Meta:
        model = Bus
        fields = "__all__"


# class routesserializer(serializers.ModelSerializer):
#     # user= serializers.CharField(required=False)

#     def validate_name(self, value):
#         if not re.match(r"^[A-Za-z]+$", value):
#             raise serializers.ValidationError(
#                 "Invalid Name format. Only letters are allowed."
#             )
#         return value

#     class Meta:
#         model = Routes
#         fields = "__all__"


# class routeserializer(serializers.ModelSerializer):
#     user = serializers.CharField(required=False)

#     def validate_name(self, value):
#         if not re.match(r"^[A-Za-z]+$", value):
#             raise serializers.ValidationError(
#                 "Invalid Name format. Only letters are allowed."
#             )
#         return value

#     class Meta:
#         model = Routes
#         fields = "__all__"

class PickAndDropSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickAndDrop
        fields = ['location','bus_stop','arrival_time','landmark','status']

class StartStopLocationsSerializer(serializers.ModelSerializer):
    
    pick_and_drop = PickAndDropSerializer(many=True)

    class Meta:
        model = StartStopLocations
        fields = ['seq_id' ,'location','arrival_time','arrival_date_offset','departure_time','departure_date_offset','pick_and_drop']
        

class RoutesSerializer(serializers.ModelSerializer):
    location = StartStopLocationsSerializer(many=True)

    class Meta:
        model = Routes
        fields = '__all__'
