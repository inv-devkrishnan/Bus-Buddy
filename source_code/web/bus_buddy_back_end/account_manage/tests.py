from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import User


# Create your tests here
class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.email = "tester@gmail.com"
        # creating a test user
        self.user = User.objects.create_user(
            email=self.email, password="12345678", account_provider=0
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
            "password": "12345678",
        }
        self.local_login_incorrect_password = {
            "email": self.email,
            "password": "1234567",
        }
        self.local_login_invalid_credentials = {
            "email": "testor@gmail.com",
            "password": "12345678",
        }
        self.local_login_invalid_email = {"email": "tester", "password": "12345678"}
        self.local_login_invalid_password = {
            "email": self.email,
            "password": "",
        }
        self.local_login_blank_email = {"email": "", "password": "1234578"}
        self.local_login_no_email = {"password": "1234578"}
        self.local_login_no_password = {"email": ""}
        self.change_password_valid_data = {
            "old_password": "12345678",
            "new_password": "Aa1#0000",
        }
        self.change_password_invalid_new_password = {
            "old_password": "12345678",
            "new_password": "000000",
        }
        self.change_password_invalid_old_password = {
            "old_password": "0000000",
            "new_password": "Aa1#0000",
        }
        self.expired_cred_token = {
            "cred_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2MjYzZDA5NzQ1YjUwMzJlNTdmYTZlMWQwNDFiNzdhNTQwNjZkYmQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MTAzNTY2NDg4MDctbjNuOTdrY3RmbDk1YmJxNmVsZWUyN3FmZ2NsMTdsMTcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTAzNTY2NDg4MDctbjNuOTdrY3RmbDk1YmJxNmVsZWUyN3FmZ2NsMTdsMTcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk4NDY3MzU5MDM3Njc5MzEwNjIiLCJoZCI6Imlubm92YXR1cmVsYWJzLmNvbSIsImVtYWlsIjoiZGV2a3Jpc2huYW4udmFAaW5ub3ZhdHVyZWxhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTY5NzE2OTU2NSwibmFtZSI6IkRldmtyaXNobmFuIFYgQSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLcnVEZWwxbXRlbEVxdnVUVVpuaVpzcFc2Z0dwRld5T0tPVnJUdm1BS049czk2LWMiLCJnaXZlbl9uYW1lIjoiRGV2a3Jpc2huYW4iLCJmYW1pbHlfbmFtZSI6IlYgQSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjk3MTY5ODY1LCJleHAiOjE2OTcxNzM0NjUsImp0aSI6IjI1OTQzNzc2NTMxOTUxMzFlODc1NjM2NjM4NWMwMzc0NGM1NDZmYzYifQ.aijBfOmkfB260L-G7-ph0XWoqb9YVzEtqbVRSC1vrG5Lpii9fTUAxVWBZbCCIkX3yvqCCSzu4lTyjtjEk8_ttYeHNdGJguuCn_x_aC2u94-LM4xZ62GQY9sY5ceH77OdVBHwgtjAc4Z7MJAQBkyFvXyXi9ctZ1V8QnhBuKUsLtWbp1IpwfPJKiFDgNIdRimujF0sRtKu6YKcsPIETd2TdN_cRNsZiwqXmc56xNzwXe8LQECQbik-IXiywt43ui9TTwKP2RQxyc33W_6SFvlYl5G5mHVGkPKtofo2QY4yv9YdXVkOYWK_UH54trbTcZZ0UE-7MmjqubymFt_l0xAI1w"
        }
        self.valid_token = {
            "cred_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2MjYzZDA5NzQ1YjUwMzJlNTdmYTZlMWQwNDFiNzdhNTQwNjZkYmQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MTAzNTY2NDg4MDctbjNuOTdrY3RmbDk1YmJxNmVsZWUyN3FmZ2NsMTdsMTcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTAzNTY2NDg4MDctbjNuOTdrY3RmbDk1YmJxNmVsZWUyN3FmZ2NsMTdsMTcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk4NDY3MzU5MDM3Njc5MzEwNjIiLCJoZCI6Imlubm92YXR1cmVsYWJzLmNvbSIsImVtYWlsIjoiZGV2a3Jpc2huYW4udmFAaW5ub3ZhdHVyZWxhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTY5NzE4MTc1NSwibmFtZSI6IkRldmtyaXNobmFuIFYgQSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLcnVEZWwxbXRlbEVxdnVUVVpuaVpzcFc2Z0dwRld5T0tPVnJUdm1BS049czk2LWMiLCJnaXZlbl9uYW1lIjoiRGV2a3Jpc2huYW4iLCJmYW1pbHlfbmFtZSI6IlYgQSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjk3MTgyMDU1LCJleHAiOjE2OTcxODU2NTUsImp0aSI6ImU3ZGZmZDQxZDllYTcyMWJkN2RlZmI2YzNlMTYwZmNkMWQ1ZjhiMjAifQ.MhOuMjIDaFzYk-kHeekvO2If0KQz9uKbuZAmVH1fRuf0IYsg-4QzgheM6u9yl8jRtDTPfGM0DezjLdHXro6-qkLfc7xuXUDiRLQZk97jCy8HccsxTrBYSf_piuRdn4TaCa-VsDlxtHVaDrCDoilDZAbhXofmAtzBWI5wip07c4o34qbStCtH5RHWxWucZoQJdhR1fHKJZayIaPG468NVWEui2UQof7r1vcligwopp5QbO9KOC5P3G78kOGcKiW5havIfgY8HYEKpAFMYbNVWyJZRXDeUlQC4ZvhX_c2_44c2uMt5qpKJWiJzdzhB-msXDE9jlO0VdrRM8dpqdjucIQ"
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
    def test_01_can_login_with_valid_token(self):
        # dont forget to add valid cred token otherwise this test may fail
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
