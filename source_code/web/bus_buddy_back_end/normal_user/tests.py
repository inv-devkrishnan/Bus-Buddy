from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import User

valid_first_name = "Sakki"
valid_last_name = "Sayya"
valid_email = "SakkiSayya01@gmail.com"
valid_password = "Aa!1qwerty"
valid_phone = "1234567899"

class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.add = reverse("register-user")
        self.update = reverse("update-profile",kwargs={"id":1})

        self.register_data={
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": valid_phone,
            "password": valid_password
        }
        
        self.valid_all_values = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": valid_phone,
        }

        self.invalid_names = {
            "first_name": "56",
            "last_name": "789",
            "email": valid_email,
            "phone": valid_phone,
        }

        self.invalid_phone_length = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": "9876",
        }

        self.invalid_phone_alphabet = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": "987654321o",
        }
        
        return super().setUp()
    
    
class UpdateUserTest(BaseTest):
    def test_can_update_user(self):
        self.client.post(self.add, self.register_data, format="json")
        response = self.client.put(self.update, self.valid_all_values, format="json")
        self.assertEqual(response.status_code, 200)

    def test_cant_update_user_with_invalid_names(self):
        print("1")
        response=self.client.post(self.add, self.register_data, format="json")
        print(response.content)
        response = self.client.put(reverse("update-profile",kwargs={"id":2}), self.invalid_names, format="json")
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_phone_length(self):
        print("3")
        response=self.client.post(self.add, self.register_data, format="json")
        print(response.content)
        response = self.client.put(reverse("update-profile",kwargs={"id":4}), self.invalid_phone_length, format="json")
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_phone_alphabet(self):
        print("4")
        response=self.client.post(self.add, self.register_data, format="json")
        print(response.content)
        response = self.client.put(reverse("update-profile",kwargs={"id":3}), self.invalid_phone_alphabet, format="json")
        print(response.content)
        self.assertEqual(response.status_code, 400)

