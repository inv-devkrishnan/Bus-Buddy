from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

valid_first_name = "Sakki"
valid_last_name = "Sayya"
valid_email = "SakkiSayya01@gmail.com"
valid_password = "Aa!1qwerty"
valid_phone = "1234567899"


class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register = reverse("register-user")

        self.valid_all_values = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": valid_password,
            "phone": valid_phone,
        }

        self.invalid_names = {
            "first_name": "56",
            "last_name": "789",
            "email": valid_email,
            "password": valid_password,
            "phone": valid_phone,
        }

        self.invalid_email = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": "SakkiSayya",
            "password": valid_password,
            "phone": valid_phone,
        }

        self.invalid_phone_length = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": valid_password,
            "phone": "9876",
        }

        self.invalid_phone_alphabet = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": valid_password,
            "phone": "987654321o",
        }

        self.invalid_password_length_less_than_eight = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!Aa1",
            "phone": valid_phone,
        }

        self.invalid_password_length_more_than_twenty = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!Aa1bhfyrtdkaw23dyulfr09ww",
            "phone": valid_phone,
        }

        self.invalid_password_no_capital_letter = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!ndsfhdhsa1",
            "phone": valid_phone,
        }

        self.invalid_password_no_small_letter = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!AJJHUHDFHGUSH1",
            "phone": valid_phone,
        }

        self.invalid_password_no_number = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!AJJHUHDFHGUSHas",
            "phone": valid_phone,
        }

        self.invalid_password_no_special_character = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "AJghjDFHGUSH1",
            "phone": valid_phone,
        }

        return super().setUp()


class RegisterUserTest(BaseTest):
    def test_can_register_user(self):
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.post(self.register, self.valid_all_values, format="json")
        self.assertEqual(response.status_code, 201)

    def test_cant_register_user_with_invalid_names(self):
        self.client.post(self.register, self.invalid_names, format="json")
        response = self.client.post(self.register, self.invalid_names, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_email(self):
        self.client.post(self.register, self.invalid_email, format="json")
        response = self.client.post(self.register, self.invalid_email, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_length(self):
        self.client.post(self.register, self.invalid_phone_length, format="json")
        response = self.client.post(self.register, self.invalid_phone_length, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_alphabet(self):
        self.client.post(self.register, self.invalid_phone_alphabet, format="json")
        response = self.client.post(self.register, self.invalid_phone_alphabet, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_length_less_than_eight(self):
        self.client.post(self.register, self.invalid_password_length_less_than_eight, format="json")
        response = self.client.post(self.register, self.invalid_password_length_less_than_eight, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_length_more_than_twenty(self):
        self.client.post(self.register, self.invalid_password_length_more_than_twenty, format="json")
        response = self.client.post(self.register, self.invalid_password_length_more_than_twenty, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_capital_letter(self):
        self.client.post(self.register, self.invalid_password_no_capital_letter, format="json")
        response = self.client.post(self.register, self.invalid_password_no_capital_letter, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_small_letter(self):
        self.client.post(self.register, self.invalid_password_no_small_letter, format="json")
        response = self.client.post(self.register, self.invalid_password_no_small_letter, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_number(self):
        self.client.post(self.register, self.invalid_password_no_number, format="json")
        response = self.client.post(self.register, self.invalid_password_no_number, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_special_character(self):
        self.client.post(self.register, self.invalid_password_no_special_character, format="json")
        response = self.client.post(self.register, self.invalid_password_no_special_character, format="json")
        self.assertEqual(response.status_code, 400)
        
        