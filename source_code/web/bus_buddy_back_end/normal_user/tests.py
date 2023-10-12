from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .serializer import UserModelSerializer as UMS


valid_first_name = "Sakki"
valid_last_name = "Sayya"
valid_email = "SakkiSayya01@gmail.com"
valid_phone = "1234567899"

class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.update = reverse("update-profile")

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

        self.invalid_email = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": "SakkiSayya",
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
    
    
class UpdateOwnerTest(BaseTest):
    def test_can_update_user(self):
        self.client.post(self.update, self.valid_all_values, format="json")
        response = self.client.post(self.update, self.valid_all_values, format="json")
        self.assertEqual(response.status_code, 201)

    def test_cant_update_user_with_invalid_names(self):
        self.client.post(self.update, self.invalid_names, format="json")
        response = self.client.post(self.update, self.invalid_names, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_email(self):
        self.client.post(self.update, self.invalid_email, format="json")
        response = self.client.post(self.update, self.invalid_email, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_phone_length(self):
        self.client.post(self.update, self.invalid_phone_length, format="json")
        response = self.client.post(self.update, self.invalid_phone_length, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_phone_alphabet(self):
        self.client.post(self.update, self.invalid_phone_alphabet, format="json")
        response = self.client.post(self.update, self.invalid_phone_alphabet, format="json")
        self.assertEqual(response.status_code, 400)

