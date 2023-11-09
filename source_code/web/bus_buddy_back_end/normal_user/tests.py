from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

valid_first_name = "Sakki"
valid_last_name = "Sayya"
valid_email = "SakkiSayya999@gmail.com"
valid_password = "Aa!1qwerty"
valid_phone = "9961006248"


class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register = reverse("register-user")

        self.valid_all_values = {
            "first_name": "Priya",
            "last_name": "Menoth",
            "email": "priyaMenoth@gmail.com",
            "password": "Az@9uhts",
            "phone": "9495130217",
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
        
        self.update_valid_all_values = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": valid_phone,
        }
        
        self.update_invalid_names = { 
            "first_name": "56",
            "last_name": "789",
            "email": valid_email,
            "phone": valid_phone,
        }

        self.update_invalid_email = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": "SakkiSayya",
            "phone": valid_phone,
        }

        self.update_invalid_phone_length = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": "9876",
        }

        self.update_invalid_phone_alphabet = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": "987654321o",
        }

        return super().setUp()


class RegisterUserTest(BaseTest):
    def test_can_register_user(self):
        print("1")
        response = self.client.post(self.register, self.valid_all_values, format="json")
        self.assertEqual(response.status_code, 201)

    def test_cant_register_user_with_invalid_names(self):
        print("2")
        self.client.post(self.register, self.invalid_names, format="json")
        response = self.client.post(self.register, self.invalid_names, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_email(self):
        print("3")
        response = self.client.post(self.register, self.invalid_email, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_length(self):
        print("4")
        response = self.client.post(self.register, self.invalid_phone_length, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_alphabet(self):
        print("5")
        response = self.client.post(self.register, self.invalid_phone_alphabet, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_length_less_than_eight(self):
        print("6")
        response = self.client.post(self.register, self.invalid_password_length_less_than_eight, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_length_more_than_twenty(self):
        print("7")
        response = self.client.post(self.register, self.invalid_password_length_more_than_twenty, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_capital_letter(self):
        print("8")
        response = self.client.post(self.register, self.invalid_password_no_capital_letter, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_small_letter(self):
        print("9")
        response = self.client.post(self.register, self.invalid_password_no_small_letter, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_number(self):
        print("10")
        response = self.client.post(self.register, self.invalid_password_no_number, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_special_character(self):
        print("11")
        response = self.client.post(self.register, self.invalid_password_no_special_character, format="json")
        self.assertEqual(response.status_code, 400)
        
        
class UpdateUserTest(BaseTest):
    def test_can_update_user(self):
        print("12")
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(reverse("update-profile",kwargs={"id":2}), self.update_valid_all_values, format="json")
        self.assertEqual(response.status_code, 200)

    def test_cant_update_user_with_invalid_names(self):
        print("13")
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(reverse("update-profile",kwargs={"id":3}), self.invalid_names, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_phone_length(self):
        print("14")
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(reverse("update-profile",kwargs={"id":5}), self.invalid_phone_length, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_phone_alphabet(self):
        print("15")
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(reverse("update-profile",kwargs={"id":4}), self.invalid_phone_alphabet, format="json")
        self.assertEqual(response.status_code, 400)

class ViewTripsTest(BaseTest):
    def test_01_can_view_trips(self):
        view_trips_url = f"{reverse('view-trip')}?start=6&end=7&date=2023-11-11&page=1"
        response = self.client.get(view_trips_url,format="json")
        self.assertEqual(response.status_code,200)
    
    def test_02_cant_view_trips_with_missing_params(self):
        view_trips_url = f"{reverse('view-trip')}"
        response = self.client.get(view_trips_url,format="json")
        self.assertEqual(response.status_code,400)
        
    def test_03_cant_view_trips_with_invalid_page(self):
        view_trips_url = f"{reverse('view-trip')}?start=6&end=7&date=2023-11-11&page=-1"
        response = self.client.get(view_trips_url,format="json")
        self.assertEqual(response.status_code,204)         
    
        