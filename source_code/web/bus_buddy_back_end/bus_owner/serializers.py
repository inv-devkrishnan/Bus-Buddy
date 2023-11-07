import re
from rest_framework import serializers
from .models import Bus, Routes, Amenities, PickAndDrop, StartStopLocations,LocationData
from .models import User
from .models import Trip
from .models import Bus  
from .models import Routes  
from .models import User
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator


regex_alphabet_only = r"^[A-Za-z\s]*$"
regex_number_only = r"^[0-9\s]*$"
error_message_only_letter = "This field can only contain letters"
error_message_email_exist = "Email is already registered"
error_message_only_number = "This field can only contain numbers."
error_message_phone_exist = "Phone number is already registered"

class BusSerializer(serializers.ModelSerializer):
    def validate_name(self, value):
        if not re.match(r"^[A-Za-z():,\.]+$", value):
            raise serializers.ValidationError(
                "Invalid Name format. Only letters are allowed."
            )
        return value

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
    # user = serializers.CharField(required=False)
    amenities_data=AmenitiesSerializer(many=True, read_only=True,source="amenities_set")
    class Meta:
        model = Bus
        fields = ("id","bus_name","plate_no","bus_type","bus_ac","amenities_data")
        # depth=1
        
class Locationdata(serializers.ModelSerializer):
    
    class Meta:
        model = LocationData;
        fields = "__all__"
    


class ViewRoutesSerializer(serializers.ModelSerializer):
    # user_id=serializers.CharField(source='bu')
    start_point_name = serializers.CharField(source='start_point.location_name', read_only=True)        #to get name matchin the id from location
    end_point_name = serializers.CharField(source='end_point.location_name', read_only=True)         #to get name matchin the id from location
    class Meta:
        model = Routes
        fields = '__all__'
        
        fields = ('start_point_name','end_point_name','via','distance','travel_fare','duration','id')
        depth=1


class PickAndDropSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickAndDrop
        fields = '__all__'

class StartStopLocationsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = StartStopLocations
        fields = '__all__' 
        
class RoutesSerializer(serializers.ModelSerializer):
    location = StartStopLocationsSerializer(many=True)
    pick_and_drop = PickAndDropSerializer(many=True)
    user = serializers.CharField(required=False)

    
    
    class Meta:
        model = Routes
        fields = ("user","start_point","end_point","via","distance","duration","travel_fare","status","created_date","updated_date","location","pick_and_drop")
        
    def create(self, validated_data):
        startstoplocations_data = validated_data.pop('location')
        pickanddrop_data = validated_data.pop('pick_and_drop')


        routes = Routes.objects.create(**validated_data)
        for startstoplocation_data in startstoplocations_data:
            startstoplocation_data['routes'] = routes
            StartStopLocations.objects.create(routes=routes, **startstoplocation_data)

        # Create related PickAndDrop
        for pickanddrop_data_item in pickanddrop_data:
            pickanddrop_data_item['routes'] = routes
            PickAndDrop.objects.create(routes=routes, **pickanddrop_data_item)
        
        # StartStopLocations.objects.create(routes=routes, **startstoplocations_data)
        return routes


        

class TripSerializer(serializers.ModelSerializer):
    bus = serializers.PrimaryKeyRelatedField(queryset=Bus.objects.all())
    route = serializers.PrimaryKeyRelatedField(queryset=Routes.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Trip
        fields = "__all__"


class OwnerModelSerializer(serializers.ModelSerializer):
    # For registering a bus owner
    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "password",
            "phone",
            "company_name",
        )

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
                queryset=User.objects.all(),
                message="Phone number is already registered",
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
    
    # password encryption
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class OwnerDataSerializer(serializers.ModelSerializer):
    #For viewing the bus owner details
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "phone", "company_name")
        


