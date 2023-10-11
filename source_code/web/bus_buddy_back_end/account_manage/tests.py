from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import User


# Create your tests here
class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # creating a test user
        self.user = User.objects.create_user(
            email="tester@gmail.com", password="12345678"
        )
        self.client.force_authenticate(self.user)
        # urls
        self.local_login_url = reverse("local_login")
        # data
        self.local_login_valid_credentials = {
            "email": "tester@gmail.com",
            "password": "12345678",
        }
        self.local_login_invalid_credentials = {
            "email": "testor@gmail.com",
            "password": "12345678",
        }
        self.local_login_invalid_email = {"email": "tester", "password": "12345678"}
        self.local_login_invalid_password = {
            "email": "tester@gmail.com",
            "password": "",
        }
        self.local_login_blank_email = {"email": "", "password": "1234578"}
        self.local_login_no_email = {"password": "1234578"}
        self.local_login_no_password = {"email": ""}


class LocalLoginTestCase(BaseTest):
    def test_can_login_with_valid_data(self):
        response = self.client.post(
            self.local_login_url, data=self.local_login_valid_credentials, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cannot_login_with_invalid_email(self):
        response = self.client.post(
            self.local_login_url, data=self.local_login_invalid_email, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cannot_login_with_invalid_password(self):
        response = self.client.post(
            self.local_login_url, data=self.local_login_invalid_password, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cannot_login_with_blank_email(self):
        response = self.client.post(
            self.local_login_url, data=self.local_login_blank_email, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cannot_login_with_no_email(self):
        response = self.client.post(
            self.local_login_url, data=self.local_login_no_email, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cannot_login_with_no_password(self):
        response = self.client.post(
            self.local_login_url, data=self.local_login_no_password, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cannot_login_with_invalid_data(self):
        response = self.client.post(
            self.local_login_url,
            data=self.local_login_invalid_credentials,
            format="json",
        )
        self.assertEqual(response.status_code, 401)
