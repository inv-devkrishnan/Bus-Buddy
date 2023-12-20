from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch, MagicMock, Mock
from rest_framework.test import APIClient
from account_manage.models import User
from normal_user.models import Bookings, BookedSeats, UserComplaints


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
        self.admin_list_user_asc = f"{reverse('list_users')}?order=0"
        self.admin_list_user_desc = f"{reverse('list_users')}?order=1"
        self.admin_list_user_invalid = f"{reverse('list_users')}?order=5"
        self.admin_list_user_def = f"{reverse('list_users')}?order=-1"
        self.admin_list_ban_users = f"{reverse('list_users')}?status=2"
        self.admin_list_unapproved_users = f"{reverse('list_users')}?status=3"
        self.admin_list_unban_users = f"{reverse('list_users')}?status=0"
        self.admin_search_user = f"{reverse('list_users')}?keyword=0&type=0"
        self.admin_search_bus_owner = f"{reverse('list_users')}?keyword=0&type=1"
        self.admin_invalid_search = f"{reverse('list_users')}?keyword=0"
        self.admin_list_invalid_query_param = f"{reverse('list_users')}?status=34"
        self.admin_view_complaints = reverse("view_complaints")
        self.admin_view_complaints_responded_param = (
            f"{reverse('view_complaints')}?responded=1"
        )
        self.admin_view_complaints_date_param = (
            f"{reverse('view_complaints')}?from_date=2023-11-10&to_date=2023-11-12"
        )
        self.admin_view_complaints_all_param = f"{reverse('view_complaints')}?from_date=2023-11-10&to_date=2023-11-12&responded=1"
        self.admin_view_complaints_invalid_date_param = (
            f"{reverse('view_complaints')}?from_date=2023-11-14&to_date=2023-11-12"
        )
        self.admin_view_complaints_invalid_query_params = (
            f"{reverse('view_complaints')}?from_date=2023-11-14&to_date=2023-11-fsd"
        )
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

    def test_02_can_list_users_asc(self):
        response = self.client.get(
            self.admin_list_user_asc,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_03_can_list_users_desc(self):
        response = self.client.get(
            self.admin_list_user_desc,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_04_can_list_ban_users(self):
        response = self.client.get(
            self.admin_list_ban_users,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_05_can_list_unban_users(self):
        response = self.client.get(
            self.admin_list_unban_users,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_06_can_search_all_users(self):
        response = self.client.get(
            self.admin_search_user,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_07_can_search_bus_owners(self):
        response = self.client.get(
            self.admin_search_bus_owner,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_08_list_unapproved_users(self):
        response = self.client.get(
            self.admin_list_unapproved_users,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_09_can_list_users_invalid_order(self):
        response = self.client.get(
            self.admin_list_user_invalid,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_10_can_list_users_default_order(self):
        response = self.client.get(
            self.admin_list_user_def,
            format="json",
        )
        self.assertEqual(response.status_code, 200)


class BanUserTest(BaseTest):
    def test_01_can_ban_normal_user(self):
        self.user = User.objects.create_user(
            email="dummy6@gmail.com", password="12345678", account_provider=0, role=2
        )
        cur_user = User.objects.get(email="dummy6@gmail.com")
        ban_user_url = reverse("ban_user", kwargs={"user_id": cur_user.id})
        with patch("normal_user.models.Bookings.objects.filter") as mock_book_filter:
            mock_book_filter.return_value = [Mock(booking=Bookings())]
            with patch("normal_user.models.BookedSeats.objects.filter") as mock_filter:
                mock_filter.return_value = [
                    Mock(booking=BookedSeats())
                ]  # Mocking the queryset
                # Mock the Payment.objects.get method
                with patch("normal_user.models.Payment.objects.get") as mock_get:
                    mock_get.return_value = MagicMock()  # Mocking the Payment instance

                    # Mock the stripe.Refund.create method
                    with patch("stripe.Refund.create") as mock_refund_create:
                        # Set up the mock response for the stripe.Refund.create method
                        mock_refund_create.return_value = MagicMock()
                        response = self.client.put(
                            ban_user_url,
                            format="json",
                        )
                        self.assertEqual(response.status_code, 200)

    def test_02_can_ban_busowner_user(self):
        self.user = User.objects.create_user(
            email="dummy7@gmail.com", password="12345678", account_provider=0, role=3
        )
        cur_user = User.objects.get(email="dummy7@gmail.com")
        ban_user_url = reverse("ban_user", kwargs={"user_id": cur_user.id})
        with patch("normal_user.models.BookedSeats.objects.filter") as mock_filter:
            mock_filter.return_value = Mock()  # Mocking the queryset
            # Mock the Payment.objects.get method
            with patch("normal_user.models.Payment.objects.get") as mock_get:
                mock_get.return_value = Mock()  # Mocking the Payment instance

                # Mock the stripe.Refund.create method
                with patch("stripe.Refund.create") as mock_refund_create:
                    # Set up the mock response for the stripe.Refund.create method
                    mock_refund_create.return_value = Mock()
                    response = self.client.put(
                        ban_user_url,
                        format="json",
                    )
                    self.assertEqual(response.status_code, 200)

    def test_03_cant_ban_invalid_user(self):
        self.user = User.objects.create_user(
            email="dummy2@gmail.com", password="12345678", account_provider=0, role=2
        )
        ban_user_url = reverse("ban_user", kwargs={"user_id": 100})

        response = self.client.put(
            ban_user_url,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_04_can_unban_user(self):
        self.user = User.objects.create_user(
            email="dummy3@gmail.com",
            password="12345678",
            account_provider=0,
            role=2,
            status=2,
        )
        cur_user = User.objects.get(email="dummy3@gmail.com")
        unban_user_url = reverse("unban_user", kwargs={"user_id": cur_user.id})

        response = self.client.put(
            unban_user_url,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_05_can_remove_user(self):
        self.user = User.objects.create_user(
            email="dummy4@gmail.com", password="12345678", account_provider=0, role=2
        )
        cur_user = User.objects.get(email="dummy4@gmail.com")
        unban_user_url = reverse("remove_user", kwargs={"user_id": cur_user.id})

        response = self.client.put(
            unban_user_url,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_06_can_remove_bus_owner(self):
        self.user = User.objects.create_user(
            email="dummy10@gmail.com", password="12345678", account_provider=0, role=3
        )
        cur_user = User.objects.get(email="dummy10@gmail.com")
        unban_user_url = reverse("remove_user", kwargs={"user_id": cur_user.id})

        response = self.client.put(
            unban_user_url,
            format="json",
        )
        self.assertEqual(response.status_code, 200)


class BusOwnerApprovalTest(BaseTest):
    def test_01_can_approve_bus_owner(self):
        self.user = User.objects.create_user(
            first_name="dev",
            email="devanaswinikumar8@gmail.com",
            password="12345678",
            account_provider=0,
            role=3,
            status=3,
        )
        cur_user = User.objects.get(email="devanaswinikumar8@gmail.com")
        approve_url = reverse("approve_bus_owner", kwargs={"user_id": cur_user.id})
        response = self.client.put(
            approve_url,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_02_cant_approve_bus_owner_with_invalid_role(self):
        self.user = User.objects.create_user(
            first_name="dev",
            email="devan.aswinikumar8@gmail.com",
            password="12345678",
            account_provider=0,
            role=2,
            status=3,
        )
        cur_user = User.objects.get(email="devan.aswinikumar8@gmail.com")
        approve_url = reverse("approve_bus_owner", kwargs={"user_id": cur_user.id})
        response = self.client.put(
            approve_url,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_03_cant_approve_invalid_bus_owner(self):
        approve_url = reverse("approve_bus_owner", kwargs={"user_id": 100})
        response = self.client.put(
            approve_url,
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class ViewComplaintsTest(BaseTest):
    def test_01_can_view_complaints(self):
        response = self.client.get(
            self.admin_view_complaints,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_02_can_view_complaints_with_responded_param(self):
        response = self.client.get(
            self.admin_view_complaints_responded_param,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_03_can_view_complaints_with_date_param(self):
        response = self.client.get(
            self.admin_view_complaints_date_param,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_04_can_view_complaints_with_all_param(self):
        response = self.client.get(
            self.admin_view_complaints_all_param,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_05_cant_view_complaints_with_invalid_date(self):
        response = self.client.get(
            self.admin_view_complaints_invalid_date_param,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_06_cant_view_complaints_with_invalid_query_param(self):
        response = self.client.get(
            self.admin_view_complaints_invalid_query_params,
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class SendComplaintResponseTest(BaseTest):
    def test_01_can_respond_to_valid_complaints(self):
        complaint_instance = UserComplaints.objects.create(
            complaint_title="complaint ",
            complaint_body="complaint body",
            complaint_for=self.user,
            user=self.user,
        )
        url = reverse(
            "respond_complaint", kwargs={"complaint_id": complaint_instance.id}
        )
        data = {"response": "res"}
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_02_cant_respond_to_non_existent_complaints(self):
        url = reverse("respond_complaint", kwargs={"complaint_id": 1000})
        data = {"response": "res"}
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_03_cant_respond_with_failed_validation(self):
        complaint_instance = UserComplaints.objects.create(
            complaint_title="complaint1 ",
            complaint_body="complaint body1",
            complaint_for=self.user,
            user=self.user,
        )
        url = reverse(
            "respond_complaint", kwargs={"complaint_id": complaint_instance.id}
        )
        data = {}
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_04_cant_respond_to_complaint_as_different_user(self):
        dummy_user = User.objects.create_user(
            email="dummy20@gmail.com", password="12345678", account_provider=0, role=3
        )
        complaint_instance = UserComplaints.objects.create(
            complaint_title="complaint2 ",
            complaint_body="complaint body2",
            complaint_for=dummy_user,
            user=self.user,
        )
        url = reverse(
            "respond_complaint", kwargs={"complaint_id": complaint_instance.id}
        )
        data = {"response": "res"}
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_05_cant_respond_to_already_responded_complaint(self):
        complaint_instance = UserComplaints.objects.create(
            complaint_title="complaint ",
            complaint_body="complaint body",
            complaint_for=self.user,
            status=1,
            user=self.user,
        )
        url = reverse(
            "respond_complaint", kwargs={"complaint_id": complaint_instance.id}
        )
        data = {"response": "res"}
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)


class CreateCouponTest(BaseTest):
    def test_01_can_get_list(self):
        url = f"{reverse('create_coupon')}?status=0"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_02_cant_get_lis_invalid_params(self):
        url = f"{reverse('create_coupon')}?status=dfkjsh"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_03_cant_get_list_no_params(self):
        url = reverse("create_coupon")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_04_can_create_coupon(self):
        url = reverse("create_coupon")
        data = {
            "coupon_name": "Flat 50% off",
            "coupon_description": "flat 50% off on first booking",
            "coupon_eligibility": 1,
            "coupon_availability": 0,
            "valid_till": "2024-12-20",
            "one_time_use": 1,
            "discount": 2,
        }
        response = self.client.post(url, data=data, format="json")
        print(response.content)
        self.assertEqual(response.status_code, 201)

    def test_05_cant_create_coupon_invalid_data(self):
        url = reverse("create_coupon")
        data = {
            "coupon_name": "Flat 50% off",
            "coupon_description": "flat 50% off on first booking",
            "coupon_eligibility": 4,
            "coupon_availability": 0,
            "valid_till": "2023-12-19",
            "one_time_use": 1,
            "discount": 2,
        }
        response = self.client.post(url, data=data, format="json")
        self.assertEqual(response.status_code, 200)


class ViewCouponTest(BaseTest):
    def test_01_can_view_coupons(self):
        url = reverse("view_coupon")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_02_cant_view_coupons_invalid_params(self):
        url = f"{reverse('view_coupon')}?status=fdsjfhs"
        response = self.client.get(url, format="json")
        self.assertEqual(response.content, b'{"error_code":"D1006"}')
