from django.test import TestCase
from django.urls import reverse
from decouple import config
from rest_framework.test import APIClient
from account_manage.models import User


# Create your tests here.
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

        # data
        self.valid_update_data = {
            "first_name": "Devkrishnan",
            "last_name": "V D",
            "email": "desk@gmail.com",
            "phone": "9037760634",
        }


class UpdateAdminProfile(BaseTest):
    def test_01_can_update_with_valid_data(self):
        response = self.client.put(
            self.admin_profile_update_url,
            data=self.valid_update_data,
            format="json",
        )
        self.assertEqual(response.status_code, 200)
