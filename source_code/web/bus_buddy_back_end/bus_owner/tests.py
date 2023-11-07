from django.test import TestCase

# Create your tests here.
from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.test import APIClient
from rest_framework import status
from .models import Bus, User
from .serializers import BusSerializer

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

        self.user = User.objects.create_user(
            first_name=valid_first_name,
            last_name=valid_last_name,
            email=valid_email,
            password=valid_password,
            phone=valid_phone,
            company_name=valid_company_name,
            aadhaar_no=valid_aadhaar,
            msme_no=valid_msme,
            extra_charges=valid_extra_charges,
        )

        self.client.force_authenticate(self.user)

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


class RegisterOwnerTest(BaseTest):
    def test_can_register_user(self):
        response = self.client.post(
            self.register_bus_owner, self.valid_all_values, format="json"
        )
        self.assertEqual(response.status_code, 201)

    def test_cant_register_user_with_invalid_names(self):
        self.client.post(self.register_bus_owner, self.invalid_names, format="json")
        response = self.client.post(
            self.register_bus_owner, self.invalid_names, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_email(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_email, format="json"
        )
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
            self.register_bus_owner,
            self.invalid_password_length_less_than_eight,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_length_more_than_twenty(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_password_length_more_than_twenty,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_capital_letter(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_password_no_capital_letter,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_small_letter(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_password_no_small_letter,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_number(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_password_no_number, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_special_character(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_password_no_special_character,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_aadhaar_length_less_than_twelve(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_aadhaar_length_less_than_twelve,
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class UpdateOwnerTest(BaseTest):
    def test_can_register_user(self):
        response = self.client.put(
            reverse("update-profile-owner"),
            self.update_valid_data,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_names(self):
        response = self.client.put(
            reverse("update-profile-owner"),
            self.update_invalid_names,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_email(self):
        response = self.client.put(
            reverse("update-profile-owner"),
            self.update_invalid_email,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_length(self):
        response = self.client.put(
            reverse("update-profile-owner"),
            self.update_invalid_phone_alphabet,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_alphabet(self):
        response = self.client.put(
            reverse("update-profile-owner"),
            self.update_invalid_phone_length,
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class BusApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            password="12345678",
            account_provider=0,
        )
        print(self.user.id)


class CreateTest(BusApiTests):
    def test_add_bus(self):
        url = reverse("Add-Bus")
        data = {
            "bus_name": "Bus1",
            "plate_no": "AB123CD",
            "user": self.user.id,
            "bus_type": 2,
            "bus_ac": 0,
            "status": 0,
        }
        print(self.user.id)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        if response.status_code == 200:
            print("ok")

    def test_update_bus(self):
        bus = Bus.objects.create(bus_name="Bus3", plate_no="EF789GH", user=self.user)
        data = {
            "bus_name": "UpdatedBus",
            "plate_no": "FG123HI",
            "user": bus.user,
            "bus_type": 2,
            "bus_ac": 0,
            "status": 0,
        }
        response = self.client.put("/api/Update-Bus/{bus.id}/", data, format="json")
        print(bus.id)
        self.assertEqual(response.status_code, 200)
        updated_bus = Bus.objects.get(id=bus.id)
        print(updated_bus)
        self.assertEqual(updated_bus.bus_name, "UpdatedBus")
        self.assertEqual(updated_bus.plate_no, "FG123HI")

    def test_delete_bus(self):
        bus = Bus.objects.create(bus_name="Bus2", plate_no="CD456EF", user=self.user)
        response = self.client.put("/api/Delete-Bus/{bus.id}/")
        print(bus.id)
        delete_bus = Bus.objects.filter(id=bus.id)
        print(delete_bus)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Bus.objects.get(id=bus.id).status, 99)
