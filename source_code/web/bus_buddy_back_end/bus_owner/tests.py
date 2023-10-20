from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from rest_framework.test import APIClient

valid_first_name = "Sakki"
valid_last_name = "Sayya"
valid_email = "SakkiSayya999@gmail.com"
valid_password = "Aa!1qwerty"
valid_phone = "9961006248"
valid_company_name = "ABC Travels"
valid_aadhaar = "147258369014"
valid_msme = "UDYAN-654-745896"
valid_extra_charges = 150.25


class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register_bus_owner = reverse("register-bus-owner")

        self.valid_all_values = {
            "first_name": "Priya",
            "last_name": "Menoth",
            "email": "priyaMenoth@gmail.com",
            "password": "Az@9uhts",
            "phone": "9495130217",
            "company_name": "Priya Travels",
            "aadhaar_no": "748159263578",
            "msme_no": "UDYAN-451-784512",
            "extra_charges": 455.50,
        }

        self.invalid_names = {
            "first_name": "56",
            "last_name": "789",
            "email": valid_email,
            "password": valid_password,
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_email = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": "SakkiSayya",
            "password": valid_password,
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_phone_length = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": valid_password,
            "phone": "9876",
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_phone_alphabet = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": valid_password,
            "phone": "987654321o",
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_length_less_than_eight = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!Aa1",
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_length_more_than_twenty = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!Aa1bhfyrtdkaw23dyulfr09ww",
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_no_capital_letter = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!ndsfhdhsa1",
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_no_small_letter = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_no_number = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_no_special_character = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "AJghjDFHGUSH1",
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_aadhaar_length_less_than_twelve = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": valid_password,
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": "741",
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }        
        
        self.update_valid_data = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.update_invalid_names = {
            "first_name": "56",
            "last_name": "789",
            "email": valid_email,
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.update_invalid_email = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": "SakkiSayya",
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.update_invalid_phone_length = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": "9876",
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.update_invalid_phone_alphabet = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": "987654321o",
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        return super().setUp()


class RegisterUserTest(BaseTest):
    def test_can_register_user(self):
        response = self.client.post(self.register_bus_owner, self.valid_all_values, format="json")
        self.assertEqual(response.status_code, 201)

    def test_cant_register_user_with_invalid_names(self):
        self.client.post(self.register_bus_owner, self.invalid_names, format="json")
        response = self.client.post(self.register_bus_owner, self.invalid_names, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_email(self):
        response = self.client.post(self.register_bus_owner, self.invalid_email, format="json")
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_length(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_phone_length, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_alphabet(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_phone_alphabet, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_length_less_than_eight(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_password_length_less_than_eight, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_length_more_than_twenty(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_password_length_more_than_twenty, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_capital_letter(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_password_no_capital_letter, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_small_letter(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_password_no_small_letter, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_number(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_password_no_number, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_special_character(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_password_no_special_character, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_aadhaar_length_less_than_twelve(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_aadhaar_length_less_than_twelve, format="json"
        )
        self.assertEqual(response.status_code, 400)
        

class RegisterUserTest(BaseTest):
    def test_can_register_user(self):
        self.client.post(
            self.register_bus_owner, self.valid_all_values, format="json"
        )
        response = self.client.put(
            reverse("update-profile-owner", kwargs={"id":1}), self.valid_data, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_names(self):
        self.client.post(
            self.register_bus_owner, self.register_data_owner, format="json"
        )
        response = self.client.put(
            reverse("update-profile-owner", kwargs={"id":4}),
            self.invalid_names,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_email(self):
        self.client.post(
            self.register_bus_owner, self.register_data_owner, format="json"
        )
        response = self.client.put(
            reverse("update-profile-owner", kwargs={"id":3}),
            self.invalid_email,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_length(self):
        self.client.post(
            self.register_bus_owner, self.register_data_owner, format="json"
        )
        response = self.client.put(
            reverse("update-profile-owner", kwargs={"id":6}),
            self.invalid_phone_alphabet,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_alphabet(self):
        self.client.post(
            self.register_bus_owner, self.register_data_owner, format="json"
        )
        response = self.client.put(
            reverse("update-profile-owner", kwargs={"id":5}),
            self.invalid_phone_length,
            format="json",
        )
        self.assertEqual(response.status_code, 400)
