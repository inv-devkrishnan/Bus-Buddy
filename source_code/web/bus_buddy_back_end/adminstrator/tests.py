from django.test import TestCase
from django.urls import reverse
from decouple import config
from rest_framework.test import APIClient
from account_manage.models import User


# Create your tests here.
# Create your tests here
class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.email = "tester@gmail.com"
        # creating a test user
        self.user = User.objects.create_user(
            email=self.email, password="12345678", account_provider=0, role=1
        )
        self.user = User.objects.create_user(
            email="dev@gmail.com", password="12345678", account_provider=0, role=1
        )
        self.client.force_authenticate(self.user)

        # url
        self.admin_profile_update_url = reverse("update_profile")

        # data
        self.valid_update_data = {
            "first_name": "Devkrishnan",
            "last_name": "V D",
            "email": "desk@gmail.com",
            "phone": "9037760634",
        }
        self.valid_update_data_existing_email = {
            "first_name": "Devkrishnan",
            "last_name": "V D",
            "email": "dev@gmail.com",
            "phone": "9037760634",
        }
        self.update_data_invalid_first_name = {
            "first_name": "Devkrish3an",
            "last_name": "V D",
            "email": "derk@gmail.com",
            "phone": "9037760634",
        }
        self.update_data_invalid_last_name = {
            "first_name": "Devkrishnan",
            "last_name": "V3$",
            "email": "desdk@gmail.com",
            "phone": "9037760634",
        }
        self.update_data_invalid_phone_number = {
            "first_name": "Devkrishnan",
            "last_name": "V D",
            "email": "desdk@gmail.com",
            "phone": "903fsd7760634",
        }
        self.update_data_invalid_email = {
            "first_name": "Devkrishnan",
            "last_name": "V3$",
            "email": "ddsdl",
            "phone": "903fsd7760634",
        }


class UpdateAdminProfile(BaseTest):
    def test_01_can_update_with_valid_data(self):
        response = self.client.put(
            self.admin_profile_update_url,
            data=self.valid_update_data,
            format="json",
        )
        self.assertEqual(response.status_code, 200)   
    
    def test_02_cannot_update_with_existing_email(self):
        response = self.client.put(
            self.admin_profile_update_url,
            data=self.valid_update_data_existing_email,
            format="json",
        )
        self.assertEqual(response.status_code, 400)  
        
             
