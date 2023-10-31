from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from account_manage.models import User


# Create your tests here
class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.email = "tester@gmail.com"
        # creating a test user
        self.user = User.objects.create_user(
            email=self.email, password="12345678", account_provider=0, role=1
        )
        self.client.force_authenticate(self.user)

        # url
        self.admin_profile_update_url = reverse("update_profile")
        self.admin_list_user_url = reverse("list_users")

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
        self.valid_update_data_existing_phone = {
            "first_name": "Dev",
            "last_name": "V A",
            "email": "devk@gmail.com",
            "phone": "1111111111",
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
        self.user = User.objects.create_user(
            email="dev@gmail.com", password="12345678", account_provider=0, role=1
        )
        response = self.client.put(
            self.admin_profile_update_url,
            data=self.valid_update_data_existing_email,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_03_cannot_update_with_existing_phone(self):
        self.user = User.objects.create_user(
            email="devk@gmail.com",
            password="12345678",
            phone="1111111111",
            account_provider=0,
            role=1,
        )
        response = self.client.put(
            self.admin_profile_update_url,
            data=self.valid_update_data_existing_phone,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_04_cannot_update_with_invalid_first_name(self):
        response = self.client.put(
            self.admin_profile_update_url,
            data=self.update_data_invalid_first_name,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_05_cannot_update_with_invalid_last_name(self):
        response = self.client.put(
            self.admin_profile_update_url,
            data=self.update_data_invalid_last_name,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_06_cannot_update_with_invalid_email(self):
        response = self.client.put(
            self.admin_profile_update_url,
            data=self.update_data_invalid_email,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_07_cannot_update_with_invalid_phone(self):
        response = self.client.put(
            self.admin_profile_update_url,
            data=self.update_data_invalid_phone_number,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_08_can_get_user_profile(self):
        response = self.client.get(
            self.admin_profile_update_url,
            format="json",
        )
        self.assertEqual(response.status_code, 200)


class ListUsersTest(BaseTest):
    def test_01_can_list_users(self):
        response = self.client.get(
            self.admin_list_user_url,
            format="json",
        )
        self.assertEqual(response.status_code, 200)


class BanUserTest(BaseTest):
    def test_01_can_ban_user(self):
        self.user = User.objects.create_user(
            email="dummy1@gmail.com", password="12345678", account_provider=0, role=1
        )
        ban_user_url = reverse("ban_user", kwargs={"user_id": 1})

        response = self.client.put(
            ban_user_url,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_02_cant_ban_invalid_user(self):
        self.user = User.objects.create_user(
            email="dummy2@gmail.com", password="12345678", account_provider=0, role=1
        )
        ban_user_url = reverse("ban_user", kwargs={"user_id": 100})

        response = self.client.put(
            ban_user_url,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_03_can_unban_user(self):
        self.user = User.objects.create_user(
            email="dummy3@gmail.com", password="12345678", account_provider=0, role=1
        )
        unban_user_url = reverse("unban_user", kwargs={"user_id": 6})

        response = self.client.put(
            unban_user_url,
            format="json",
        )
        self.assertEqual(response.status_code, 200)
