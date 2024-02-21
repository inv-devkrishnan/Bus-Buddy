import jwt
import os
from django.test import TestCase
from unittest.mock import MagicMock, patch
from django.urls import reverse
from decouple import config
from rest_framework.test import APIClient
from .models import User, EmailAndOTP, WhiteListedTokens
from .models import User
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv("busbuddy_api.env")


# Create your tests here
password = "Devk@506#"


class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.email = "tester@gmail.com"
        # creating a test user

        self.instance = EmailAndOTP.objects.create(
            email="Anyone@gmail.com",
            otp=845698,
            counter=5,
        )
        self.user = User.objects.create_user(
            email=self.email, password=password, account_provider=0
        )
        self.client.force_authenticate(self.user)
        # urls
        self.local_login_url = reverse("local_login")
        self.google_login_url = reverse("google_login")
        self.account_delete_url = reverse("delete_account")
        self.account_change_password = reverse("change_password")
        self.generate_otp = reverse("generate_otp")
        self.verify_otp = reverse("verify_email")
        self.forgot_password_mail = reverse("forgotpasswordsendmail")
        self.forgot_password_verify = reverse("forgotpasswordverify")
        self.forgot_password_change_password = reverse("forgotpasswordchange")
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
        self.expired_cred_token = {"cred_token": config("CRED_TOKEN_EXPIRED")}
        self.valid_token = {"cred_token": config("CRED_TOKEN_VALID")}
        self.invalid_token = {"cred_token": "dasdasdfsdfdsfbadf4w8rtbsg7tyg7wg"}
        self.empty_token = {"cred_token": ""}


class LocalLoginTestCase(BaseTest):
    def test_can_login_with_valid_data(self):
        response = self.client.post(
            self.local_login_url, data=self.local_login_valid_credentials, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_login_with_banned_user(self):
        self.user.status = 2
        self.user.save()
        response = self.client.post(
            self.local_login_url, data=self.local_login_valid_credentials, format="json"
        )
        self.assertEqual(response.status_code, 401)

    def test_cant_login_with_unapproved_user(self):
        self.user.status = 3
        self.user.save()
        response = self.client.post(
            self.local_login_url, data=self.local_login_valid_credentials, format="json"
        )
        self.assertEqual(response.status_code, 401)

    def test_cant_login_with_removed_user(self):
        self.user.status = 98
        self.user.save()
        response = self.client.post(
            self.local_login_url, data=self.local_login_valid_credentials, format="json"
        )
        self.assertEqual(response.status_code, 401)

    def test_cant_login_with_deleted_user(self):
        self.user.status = 99
        self.user.save()
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
    @patch("account_manage.views.Google.validate")
    def test_01_can_login_with_valid_token(self, mock_validate):
        mock_validate.return_value = {"email": "dex@gmail.com", "given_name": "dev"}
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


class OTPGenerationTest(BaseTest):
    @patch("bus_buddy_back_end.email.send_email_with_template")
    def test_01_generate_otp_success(self, mock_validate):
        mock_validate.return_value = True
        response = self.client.post(
            self.generate_otp, {"email": "thisguy@gmail.com"}, format="json"
        )
        self.assertEqual(response.status_code, 201)

    def test_02_email_already_exist(self):
        response = self.client.post(
            self.generate_otp, {"email": "tester@gmail.com"}, format="json"
        )
        self.assertEqual(response.status_code, 204)

    def test_03_serializer_error(self):
        response = self.client.post(
            self.generate_otp, {"email": "tester"}, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_04_existing_otp_no_more_chances(self):
        self.instance = EmailAndOTP.objects.create(
            email="someone@gmail.com",
            otp=2569,
            counter=5,
        )
        response = self.client.post(
            self.generate_otp, {"email": "someone@gmail.com"}, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_05_existing_otp(self):
        self.instance = EmailAndOTP.objects.create(
            email="some@gmail.com",
            otp=2569,
            counter=0,
        )
        response = self.client.post(
            self.generate_otp, {"email": "some@gmail.com"}, format="json"
        )
        self.assertEqual(response.status_code, 201)


class VerifyOTP(BaseTest):
    def test_01_verify_otp_success(self):
        response = self.client.get(
            f"{self.verify_otp}?email=Anyone@gmail.com&otp=845698", format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 201)

    def test_02_validation_error_verify(self):
        response = self.client.get(
            f"{self.verify_otp}?email=Anyone.com&otp=2569", format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_03_wrong_otp(self):
        response = self.client.get(
            f"{self.verify_otp}?email=Anyone@gmail.com&otp=27869", format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 205)

    @patch("bus_buddy_back_end.email.send_email_with_template")
    def test_04_exception_verify(self, mock_validate):
        mock_validate.side_effect = EmailAndOTP.DoesNotExist
        response = self.client.get(
            f"{self.verify_otp}?email=Anyone.com&otp=2569", format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    @patch("bus_buddy_back_end.email.send_email_with_template")
    def test_05_exception_verify(self, mock_validate):
        mock_validate.side_effect = Exception("DB error")
        response = self.client.get(
            f"{self.verify_otp}?email=Anyone.com&otp=2569", format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)


class ForgetPasswordTest(BaseTest):
    expired_response = b'{"error_code":"D1032","error_message":"Provided forgot passsword token is invalid or expired"}'

    def test_00_can_send_change_password_email_once(self):
        request_data = {"email": self.email}
        response = self.client.post(
            self.forgot_password_mail,
            data=request_data,
            format="json",
        )
        self.assertEquals(response.content, b'{"message":"email sent"}')

    def test_01_can_send_change_password_email(self):
        request_data = {"email": self.email}
        self.client.post(
            self.forgot_password_mail,
            data=request_data,
            format="json",
        )
        response = self.client.post(
            self.forgot_password_mail,
            data=request_data,
            format="json",
        )
        self.assertEquals(response.content, b'{"message":"email sent"}')

    def test_02_can_send_change_password_invalid_email_id(self):
        request_data = {"email": "test@test"}
        response = self.client.post(
            self.forgot_password_mail,
            data=request_data,
            format="json",
        )
        self.assertEquals(response.status_code, 200)

    def test_03_can_send_change_password_non_exisiting_account(self):
        request_data = {"email": "dream@gmail.com"}
        response = self.client.post(
            self.forgot_password_mail,
            data=request_data,
            format="json",
        )
        self.assertEquals(response.status_code, 200)

    def test_04_can_send_change_password_banned_account(self):
        User.objects.create_user(
            email="dragon@gmail.com", password=password, account_provider=0, status=2
        )
        request_data = {"email": "dragon@gmail.com"}
        response = self.client.post(
            self.forgot_password_mail,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content,
            b'{"error_code":"D1037","error_message":"not applicable for banned or unapproved accounts"}',
        )

    def test_05_can_send_change_password_3rd_party_sign_in_account(self):
        User.objects.create_user(
            email="dragon3rd@gmail.com", password=password, account_provider=1, status=0
        )
        request_data = {"email": "dragon3rd@gmail.com"}
        response = self.client.post(
            self.forgot_password_mail,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content,
            b'{"error_code":"D1030","error_message":"not applicable for google sign in or other 3rd party sign in users"}',
        )

    def test_06_can_verify_valid_token(self):

        valid_token = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.utcnow() + timedelta(minutes=30),
                "iat": datetime.utcnow(),
            },
            os.getenv("SECRET_KEY"),
            algorithm="HS256",
        )
        WhiteListedTokens.objects.create(token=valid_token, user=self.user)
        request_data = {"token": valid_token}
        response = self.client.post(
            self.forgot_password_verify,
            data=request_data,
            format="json",
        )
        self.assertEquals(response.content, b'{"is_token_valid":true}')

    def test_07_cant_verify_empty_token(self):
        request_data = {"token": ""}
        response = self.client.post(
            self.forgot_password_verify,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content, b'{"error_code":"D1002","error_message":"token required"}'
        )

    def test_08_cant_verify_invalid_token(self):
        request_data = {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX21haWwiOiJkZXZhbmFzd2luaWt1bWFyOEBnbWFpbC5jb20iLCJleHAiOjE3MDY1MDQ5NDQsImlhdCI6MTcwNjUwMzE0NH0.8yp58pTwQFVmSIgSU3od4ZNrdTWXgVoAjl1rAFN"
        }
        response = self.client.post(
            self.forgot_password_verify,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.status_code,
            200,
        )

    def test_09_can_change_forgotten_password(self):
        valid_token = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.utcnow() + timedelta(minutes=30),
                "iat": datetime.utcnow(),
            },
            os.getenv("SECRET_KEY"),
            algorithm="HS256",
        )
        WhiteListedTokens.objects.create(token=valid_token, user=self.user)
        request_data = {"token": valid_token, "new_password": "Devk@106"}
        response = self.client.put(
            self.forgot_password_change_password,
            data=request_data,
            format="json",
        )
        self.assertEquals(response.content, b'{"message":"password changed"}')

    def test_10_cant_change_forgotten_password_with_invalid_token(self):
        valid_token = "gffjdhgjdhshretui"
        request_data = {"token": valid_token, "new_password": "Devk@706"}
        response = self.client.put(
            self.forgot_password_change_password,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content,
            b'{"error_code":"D1032","error_message":"provided forgot passsword token is invalid or expired"}',
        )

    def test_11_cant_change_forgotten_password_with_empty_token(self):
        valid_token = ""
        request_data = {"token": valid_token, "new_password": "Devk@806"}
        response = self.client.put(
            self.forgot_password_change_password,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content,
            b'{"error_code":"D1002","error_message":"token field must not be blank"}',
        )

    def test_12_cant_use_same_link_twice(self):
        valid_token = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.utcnow() + timedelta(minutes=30),
                "iat": datetime.utcnow(),
            },
            os.getenv("SECRET_KEY"),
            algorithm="HS256",
        )
        WhiteListedTokens.objects.create(token=valid_token, user=self.user, status=1)
        request_data = {"token": valid_token, "new_password": "Devk@107"}
        response = self.client.put(
            self.forgot_password_change_password,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content,
            b'{"error_code":"D1034","error_message":"Link Already used"}',
        )

    def test_13_cant_use_old_link_when_new_link_created(self):

        old_token = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.utcnow() + timedelta(minutes=15),
                "iat": datetime.utcnow(),
            },
            os.getenv("SECRET_KEY"),
            algorithm="HS256",
        )
        valid_token = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.utcnow() + timedelta(minutes=30),
                "iat": datetime.utcnow(),
            },
            os.getenv("SECRET_KEY"),
            algorithm="HS256",
        )
        WhiteListedTokens.objects.create(token=valid_token, user=self.user, status=0)
        request_data = {"token": old_token, "new_password": "Devk@106"}
        response = self.client.put(
            self.forgot_password_change_password,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content,
            self.expired_response,
        )

    def test_14_cant_verify_used_token(self):
        valid_token = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.utcnow() + timedelta(minutes=30),
                "iat": datetime.utcnow(),
            },
            os.getenv("SECRET_KEY"),
            algorithm="HS256",
        )
        WhiteListedTokens.objects.create(token=valid_token, user=self.user, status=1)
        request_data = {"token": valid_token}
        response = self.client.post(
            self.forgot_password_verify,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content,
            b'{"error_code":"D1034","error_message":"Link Already used"}',
        )

    def test_15_cant_previous_token(self):

        old_token_15 = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.utcnow() + timedelta(minutes=10),
                "iat": datetime.utcnow(),
            },
            os.getenv("SECRET_KEY"),
            algorithm="HS256",
        )
        valid_token_15 = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.utcnow() + timedelta(minutes=35),
                "iat": datetime.utcnow(),
            },
            os.getenv("SECRET_KEY"),
            algorithm="HS256",
        )
        WhiteListedTokens.objects.create(token=valid_token_15, user=self.user, status=0)
        request_data = {"token": old_token_15}
        response = self.client.post(
            self.forgot_password_verify,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content,
            self.expired_response,
        )

    def test_16_cant_verify_not_existing_token(self):

        valid_token = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.utcnow() + timedelta(minutes=30),
                "iat": datetime.utcnow(),
            },
            os.getenv("SECRET_KEY"),
            algorithm="HS256",
        )
        request_data = {"token": valid_token}
        response = self.client.post(
            self.forgot_password_verify,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content,
            self.expired_response,
        )

    def test_17_cant__change_password_admin_removed_account(self):
        User.objects.create_user(
            email="dragoon@gmail.com", password=password, account_provider=0, status=98
        )
        request_data = {"email": "dragoon@gmail.com"}
        response = self.client.post(
            self.forgot_password_mail,
            data=request_data,
            format="json",
        )
        self.assertEquals(
            response.content,
            b'{"error_code":"D1033","error_message":"Operation not applicable for disabled accounts by admin"}',
        )
