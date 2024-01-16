from django.test import TestCase
from unittest.mock import MagicMock, patch
from django.urls import reverse
from decouple import config
from rest_framework.test import APIClient
from .models import User


# Create your tests here
password = "Devk@506#"
class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.email = "tester@gmail.com"
        # creating a test user
        
        self.user = User.objects.create_user(
            email=self.email, password=password, account_provider=0
        )
        self.client.force_authenticate(self.user)
        # urls
        self.local_login_url = reverse("local_login")
        self.google_login_url = reverse("google_login")
        self.account_delete_url = reverse("delete_account")
        self.account_change_password = reverse("change_password")
        # data
        self.local_login_valid_credentials = {
            "email": self.email,
            "password": password,
        }
        self.local_login_incorrect_password = {
            "email": self.email,
            "password": "1234567",
        }
        self.local_login_invalid_credentials = {
            "email": "testor@gmail.com",
            "password": "Devk@5067#dsf",
        }
        self.local_login_invalid_email = {"email": "tester", "password": "Devk@5rete$"}
        self.local_login_invalid_password = {
            "email": self.email,
            "password": "",
        }
        self.local_login_blank_email = {"email": "", "password": "1234578"}
        self.local_login_no_email = {"password": "1234578"}
        self.local_login_no_password = {"email": ""}
        self.change_password_valid_data = {
            "old_password": password,
            "new_password": "Aa1#0000",
        }
        self.change_password_invalid_new_password = {
            "old_password": "Devk#25fgd",
            "new_password": "000000",
        }
        self.change_password_invalid_old_password = {
            "old_password": "0000000",
            "new_password": "Aa1#0000",
        }
        self.expired_cred_token = {
            "cred_token": config("CRED_TOKEN_EXPIRED")
        }
        self.valid_token = {
            "cred_token":  config("CRED_TOKEN_VALID")
        }
        self.invalid_token = {"cred_token": "dasdasdfsdfdsfbadf4w8rtbsg7tyg7wg"}
        self.empty_token = {"cred_token": ""}


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

    def test_cannot_login_with_incorrect_password(self):
        response = self.client.post(
            self.local_login_url,
            data=self.local_login_incorrect_password,
            format="json",
        )
        self.assertEqual(response.status_code, 401)


class GoogleLoginTestCase(BaseTest):
    @patch('account_manage.views.Google.validate')
    def test_01_can_login_with_valid_token(self,mock_validate):
        mock_validate.return_value ={"email": "dex@gmail.com","given_name":"dev"}
        response = self.client.post(
            self.google_login_url,
            data=self.valid_token,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_02_cannot_login_with_expired_token(self):
        response = self.client.post(
            self.google_login_url,
            data=self.expired_cred_token,
            format="json",
        )
        self.assertEqual(response.status_code, 401)

    def test_03_cannot_login_with_invalid_token(self):
        response = self.client.post(
            self.google_login_url,
            data=self.invalid_token,
            format="json",
        )
        self.assertEqual(response.status_code, 401)

    def test_04_cannot_login_with_empty_token(self):
        response = self.client.post(
            self.google_login_url,
            data=self.empty_token,
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class AccountDeleteTestCase(BaseTest):
    def test_can_delete_account(self):
        response = self.client.put(self.account_delete_url, format="json")
        self.assertEqual(response.status_code, 200)


class ChangePasswordTestCase(BaseTest):
    def test_03_can_change_password(self):
        response = self.client.put(
            self.account_change_password,
            data=self.change_password_valid_data,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_02_cannot_change_password_with_invalid_new_password(self):
        response = self.client.put(
            self.account_change_password,
            data=self.change_password_invalid_new_password,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_01_cannot_change_password_with_invalid_old_password(self):
        response = self.client.put(
            self.account_change_password,
            data=self.change_password_invalid_old_password,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_04_cannot_change_password_for_google_user(self):
        self.user = User.objects.create_google_user(
            email="googleuser@gmail.com", account_provider=1
        )
        self.client.force_authenticate(self.user)
        response = self.client.put(
            self.account_change_password,
            data=self.change_password_valid_data,
            format="json",
        )

        self.assertEqual(response.status_code, 403)
