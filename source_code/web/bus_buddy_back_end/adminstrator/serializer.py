from rest_framework import serializers
from account_manage.models import User
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator


regex_alphabet_only = r"^[A-Za-z\s]*$"
regex_number_only = r"^[0-9\s]*$"
error_message_only_letter = "This field can only contain letters"
error_message_email_exist = "D1007"
error_message_only_number = "This field can only contain numbers."
error_message_phone_exist = "D1008"


class AdminUpdateSerializer(serializers.ModelSerializer):
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

    phone = serializers.CharField(
        min_length=10,
        max_length=10,
        validators=[
            RegexValidator(regex=regex_number_only, message=error_message_only_number),
            UniqueValidator(
                queryset=User.objects.all(), message=error_message_phone_exist
            ),
        ],
    )

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "phone")
        
class ListUserSerializer(serializers.ModelSerializer):
    class Meta:
          model = User
          fields = ("id","first_name", "last_name", "email", "phone","company_name","aadhaar_no","msme_no")
          
class BanUserSerializer(serializers.ModelSerializer):
    class Meta:
        model =User
        fields =("status","id")          
         
                
