from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from unittest.mock import patch, MagicMock, Mock
from .models import User, Bookings

valid_first_name = "Sakki"
valid_last_name = "Sayya"
valid_email = "SakkiSayya999@gmail.com"
valid_password = "Aa!1qwerty"
valid_phone = "9961006248"


class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email=valid_email, password=valid_password, account_provider=0, role=2
        )
        self.client.force_authenticate(self.user)

        self.register = reverse("register-user")
        self.create_payment_intent = reverse("create-payment-intent")
        self.cancel_booking = f"{reverse('cancel-booking')}?booking_id=2"
        self.mock_cancel_booking_request = "normal_user.views.CancelBooking.request"
        self.mock_create_payment_intent = (
            "normal_user.views.stripe.PaymentIntent.create"
        )

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
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_email(self):
        print("3")
        response = self.client.post(self.register, self.invalid_email, format="json")
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_phone_length(self):
        print("4")
        response = self.client.post(
            self.register, self.invalid_phone_length, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_phone_alphabet(self):
        print("5")
        response = self.client.post(
            self.register, self.invalid_phone_alphabet, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_length_less_than_eight(self):
        print("6")
        response = self.client.post(
            self.register, self.invalid_password_length_less_than_eight, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_length_more_than_twenty(self):
        print("7")
        response = self.client.post(
            self.register, self.invalid_password_length_more_than_twenty, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_no_capital_letter(self):
        print("8")
        response = self.client.post(
            self.register, self.invalid_password_no_capital_letter, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_no_small_letter(self):
        print("9")
        response = self.client.post(
            self.register, self.invalid_password_no_small_letter, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_no_number(self):
        print("10")
        response = self.client.post(
            self.register, self.invalid_password_no_number, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_no_special_character(self):
        print("11")
        response = self.client.post(
            self.register, self.invalid_password_no_special_character, format="json"
        )
        self.assertEqual(response.status_code, 200)


class UpdateUserTest(BaseTest):
    def test_can_update_user(self):
        print("12")
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile"),
            self.update_valid_all_values,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_update_user_with_invalid_names(self):
        print("13")
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile"),
            self.invalid_names,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_phone_length(self):
        print("14")
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile"),
            self.invalid_phone_length,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_phone_alphabet(self):
        print("15")
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile"),
            self.invalid_phone_alphabet,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

class DictToObject:
    def __init__(self, dictionary):
        for key, value in dictionary.items():
            setattr(self, key, value)

class ViewTripsTest(BaseTest):
    def test_01_can_view_trips(self):
        dict_data = {
                    # stores each trip information
                    "route_id": 1,
                    "start_arrival_time": "4:50:00",
                    "end_arrival_time": "5:50:00",
                    "start_date": "2023-11-11",
                    "end_date": "2023-11-11",
                    "via": "thrissur",
                    "starting_cost": 400,
                    "trip_id": 1,
                    "bus_name": "bus",
                    "bus_id": 1,
                    "company_name": "decool",
                    "emergency_no": "7575952387",
                    "water_bottle": 0,
                    "charging_point": 0,
                    "usb_port": 0,
                    "blankets": 0,
                    "pillows": 0,
                    "reading_light": 0,
                    "toilet": 0,
                    "snacks": 0,
                    "tour_guide": 0,
                    "cctv": 0,
            }
        obj = DictToObject(dict_data)
        mock_trip_data = [
            obj,
        ]
        view_trips_url = f"{reverse('view-trip')}?start=6&end=7&date=2023-11-11&page=1"
        with patch(
            "normal_user.views.StartStopLocations.objects.raw",
            return_value=mock_trip_data,
        ):
            response = self.client.get(view_trips_url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_02_cant_view_trips_with_missing_params(self):
        view_trips_url = f"{reverse('view-trip')}"
        response = self.client.get(view_trips_url, format="json")
        self.assertEqual(response.status_code, 400)

    def test_03_cant_view_trips_with_invalid_page(self):
        view_trips_url = (
            f"{reverse('view-trip')}?start=6&end=7&date=2023-11-11&page=100"
        )
        response = self.client.get(view_trips_url, format="json")
        self.assertEqual(response.status_code, 204)

    def test_04_can_view_trips_with_query_params(self):
        view_trips_url = f"{reverse('view-trip')}?start=6&end=7&page=1&seat-type=1&bus-type=1&bus-ac=1&date=2023-11-25"
        response = self.client.get(view_trips_url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_05_can_view_trips_with_invalid_query_params(self):
        view_trips_url = f"{reverse('view-trip')}?start=6&end=7&page=1&seat-type=def&bus-type=t45&bus-ac=-1&date=2023-11-25"
        response = self.client.get(view_trips_url, format="json")
        self.assertEqual(response.status_code, 400)


class CreatePaymentIntentTest(BaseTest):
    def test_02_cant_create_paymentIntent_with_invalid_cost(self):
        mock_payment_intent = MagicMock()
        mock_payment_intent.client_secret = "mocked_client_secret"

        with patch(
            self.mock_create_payment_intent,
            return_value=mock_payment_intent,
        ):
            data = {"total_cost": "dfsf34"}
            response = self.client.post(self.create_payment_intent, data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error_code": "D1002"})

    def test_01_mock_create_payment_intent_with_valid_cost(self):
        mock_payment_intent = MagicMock()
        mock_payment_intent.client_secret = "mocked_client_secret"

        with patch(
            self.mock_create_payment_intent,
            return_value=mock_payment_intent,
        ):
            data = {"total_cost": 10}
            response = self.client.post(self.create_payment_intent, data, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"client_secret": "mocked_client_secret"})

    def test_03_mock_create_payment_intent_with_payment_intent_creation_fail(self):
        with patch(
            self.mock_create_payment_intent,
            side_effect=Exception("Mocked exception"),
        ):
            data = {"total_cost": 10}
            response = self.client.post(self.create_payment_intent, data, format="json")

        self.assertEqual(response.status_code, 400)


class CancelBookingTestCase(BaseTest):
    @patch("normal_user.views.Bookings.objects.get")
    @patch("normal_user.views.CancelBooking.refund")
    @patch("normal_user.views.CancelBooking.perform_update")
    def test_01_cancel_booking_with_valid_booking_id(
        self, mock_get, mock_refund, mock_perform_update
    ):
        # Mock the Bookings.objects.get method
        booking_instance = MagicMock()
        mock_get.return_value = booking_instance

        # Mock the refund method
        mock_refund.return_value = True

        # Mock the perform_update method
        mock_perform_update.return_value = None

        # Mock the request
        request_data = {"status": 99}
        request_url = self.cancel_booking
        with patch(self.mock_cancel_booking_request, create=True) as mock_request:
            mock_request.GET = {"booking_id": 2}
            mock_request.data = request_data

            # Call the API using client.put
            response = self.client.put(request_url, data=request_data, format="json")

        self.assertEqual(response.status_code, 200)

        # Clean up the mocks
        mock_get.reset_mock()
        mock_refund.reset_mock()
        mock_perform_update.reset_mock()

    @patch("normal_user.views.Bookings.objects.get")
    @patch("normal_user.views.CancelBooking.refund")
    @patch("normal_user.views.CancelBooking.perform_update")
    def test_02_cancel_booking_with_invalid_booking_id(
        self, mock_get, mock_refund, mock_perform_update
    ):
        # Mock the Bookings.objects.get method
        mock_get.side_effect = Bookings.DoesNotExist("Booking not found")
        # Mock the refund method
        mock_refund.return_value = True

        # Mock the perform_update method
        mock_perform_update.return_value = None

        # Mock the request
        request_data = {"status": 99}
        request_url = self.cancel_booking
        with patch(self.mock_cancel_booking_request, create=True) as mock_request:
            mock_request.GET = {"booking_id": 2}
            mock_request.data = request_data

            # Call the API using client.put
            response = self.client.put(request_url, data=request_data, format="json")

        self.assertEqual(response.status_code, 400)

        # Clean up the mocks
        mock_get.reset_mock()
        mock_refund.reset_mock()
        mock_perform_update.reset_mock()

    @patch("normal_user.views.Bookings.objects.get")
    @patch("normal_user.views.CancelBooking.refund")
    @patch("normal_user.views.CancelBooking.perform_update")
    def test_03_cancel_booking_with_refund_fail(
        self, mock_get, mock_refund, mock_perform_update
    ):
        # Mock the Bookings.objects.get method
        booking_instance = MagicMock()
        mock_get.return_value = booking_instance.side_effect = Bookings.DoesNotExist

        # Mock the refund method
        mock_refund.return_value = False

        # Mock the perform_update method
        mock_perform_update.return_value = None

        # Mock the request
        request_data = {"status": 99}
        request_url = self.cancel_booking
        with patch(self.mock_cancel_booking_request, create=True) as mock_request:
            mock_request.GET = {"booking_id": 2}
            mock_request.data = request_data

            # Call the API using client.put
            response = self.client.put(request_url, data=request_data, format="json")

        self.assertEqual(response.status_code, 400)

        # Clean up the mocks
        mock_get.reset_mock()
        mock_refund.reset_mock()
        mock_perform_update.reset_mock()

    @patch("normal_user.views.Bookings.objects.get")
    @patch("normal_user.views.CancelBooking.refund")
    @patch("normal_user.views.CancelBooking.perform_update")
    @patch("normal_user.views.CancelBookingSerializer.is_valid")
    def test_03_cancel_booking_with_validation_fail(
        self, mock_get, mock_refund, mock_perform_update, mock_is_valid
    ):
        # Mock the Bookings.objects.get method
        booking_instance = MagicMock()
        mock_get.return_value = booking_instance.side_effect = Bookings.DoesNotExist

        # Mock the refund method
        mock_refund.return_value = False

        # Mock the perform_update method
        mock_perform_update.return_value = None
        mock_is_valid.return_value = False
        # Mock the request
        request_url = self.cancel_booking
        with patch(self.mock_cancel_booking_request, create=True) as mock_request:
            mock_request.GET = {"booking_id": 2}

            # Call the API using client.put
            response = self.client.put(request_url, format="json")

        self.assertEqual(response.status_code, 400)

        # Clean up the mocks
        mock_get.reset_mock()
        mock_refund.reset_mock()
        mock_perform_update.reset_mock()
