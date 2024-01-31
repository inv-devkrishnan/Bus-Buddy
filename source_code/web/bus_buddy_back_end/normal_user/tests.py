import json
from datetime import datetime
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from unittest.mock import patch, MagicMock, Mock
from adminstrator.models import CouponDetails, CouponHistory
from .models import User, Bookings, UserReview, UserComplaints
from bus_owner.models import (
    Bus,
    SeatDetails,
    LocationData,
    Routes,
    Trip,
    StartStopLocations,
    PickAndDrop,
)
from normal_user.views import CancelBooking

valid_first_name = "Sakki"
valid_last_name = "Sayya"
valid_email = "devanaswinikumar8@gmail.com"
valid_password = "Aa!1qwerty"
valid_phone = "9961006248"


class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create_user(
            email="admin@gmail.com", password="Admin@7777", account_provider=0, role=1
        )
        self.client.force_authenticate(self.admin)

        self.owner = User.objects.create_user(
            email="someone@gmail.com",
            password="S0meone@7777",
            account_provider=0,
            role=3,
            company_name="Someone Travels",
            aadhaar_no=123456789123,
            msme_no="udyan-123-1234",
            extra_charges=500.25,
        )
        self.client.force_authenticate(self.owner)

        self.user = User.objects.create_user(
            email=valid_email, password=valid_password, account_provider=0
        )
        self.client.force_authenticate(self.user)

        self.bus = Bus.objects.create(
            bus_name="Some Bus", plate_no="CD456EF", user=self.owner
        )

        self.seat = SeatDetails.objects.create(
            bus=self.bus,
            seat_number="a1",
            seat_ui_order=11,
            seat_type=0,
            deck=0,
            seat_cost=250.50,
        )

        self.location_1 = LocationData.objects.create(location_name="Ernakulam")
        self.location_2 = LocationData.objects.create(location_name="Trivandrum")

        self.route = Routes.objects.create(
            user=self.owner,
            start_point=self.location_1,
            end_point=self.location_2,
            via="Alappuzha",
            distance=216.6,
            duration=5.44,
            travel_fare=500,
        )

        self.trip = Trip.objects.create(
            bus=self.bus,
            route=self.route,
            user=self.owner,
            start_date="2023-12-01",
            end_date="2023-12-02",
            start_time="10:00:00",
            end_time="04:00:00",
        )

        self.trip_completed = Trip.objects.create(
            bus=self.bus,
            route=self.route,
            user=self.owner,
            status=1,
            start_date="2023-12-01",
            end_date="2023-12-02",
            start_time="10:00:00",
            end_time="04:00:00",
        )

        self.start_stop_location_1 = StartStopLocations.objects.create(
            seq_id=1,
            location=self.location_1,
            arrival_time="10:00:00",
            arrival_date_offset=1,
            departure_time="10:05:00",
            departure_date_offset=1,
            route=self.route,
        )

        self.start_stop_location_2 = StartStopLocations.objects.create(
            seq_id=2,
            location=self.location_2,
            arrival_time="04:00:00",
            arrival_date_offset=1,
            departure_time="04:05:00",
            departure_date_offset=1,
            route=self.route,
        )

        self.pick_up = PickAndDrop.objects.create(
            route=self.route,
            bus_stop="kochi",
            landmark="kochi",
            start_stop_location=self.start_stop_location_1,
            arrival_time="10:00:00",
        )

        self.drop_off = PickAndDrop.objects.create(
            route=self.route,
            bus_stop="trivandrum",
            landmark="trivandrum",
            start_stop_location=self.start_stop_location_2,
            arrival_time="04:00:00",
        )

        self.booking = Bookings.objects.create(
            user=self.user,
            trip=self.trip,
            pick_up=self.pick_up,
            drop_off=self.drop_off,
            status=0,
            total_amount=4250,
            booking_id="BY111",
        )

        self.booking_completed = Bookings.objects.create(
            user=self.user,
            trip=self.trip_completed,
            pick_up=self.pick_up,
            drop_off=self.drop_off,
            status=1,
            total_amount=4250,
            booking_id="BY222",
        )

        self.booking_cancelled = Bookings.objects.create(
            user=self.user,
            trip=self.trip_completed,
            pick_up=self.pick_up,
            drop_off=self.drop_off,
            status=99,
            total_amount=4250,
            booking_id="BY333",
        )

        self.review = UserReview.objects.create(
            user_id=self.user,
            trip_id=self.trip_completed,
            booking_id=self.booking_completed,
            review_title="New Title",
            review_body="New Body",
            review_for=self.booking_completed.trip.user,
            rating=3,
        )

        self.complaint = UserComplaints.objects.create(
            user=self.user,
            complaint_title="Very Bad experience",
            complaint_body="So and so",
            complaint_for=self.owner,
            response="Will fix",
            status=1,
        )

        # coupon list
        self.coupon1 = CouponDetails.objects.create(
            coupon_code="TRF44541",
            coupon_name="Coupon 1",
            coupon_description="Coupon detail 1",
            valid_till="2050-12-31",
            discount=30,
        )
        self.coupon1_1 = CouponDetails.objects.create(
            coupon_code="TRF44541",
            coupon_name="Coupon 1_1",
            coupon_description="Coupon detail 1_1",
            valid_till="2050-12-31",
            coupon_eligibility=1,
            discount=30,
        )
        self.coupon1_2 = CouponDetails.objects.create(
            coupon_code="TRF44541",
            coupon_name="Coupon 1_2",
            coupon_description="Coupon detail 1_2",
            valid_till="2023-12-31",
            coupon_eligibility=0,
            discount=30,
        )
        self.coupon1_3 = CouponDetails.objects.create(
            coupon_code="TRF44541",
            coupon_name="Coupon 1_3",
            coupon_description="Coupon detail 1_3",
            valid_till="2025-12-31",
            coupon_eligibility=0,
            discount=30,
            status=99,
        )
        self.coupon2 = CouponDetails.objects.create(
            coupon_code="TRF44542",
            coupon_name="Coupon 2",
            coupon_description="Coupon detail 2",
            valid_till="2050-12-31",
            coupon_availability=2,
            trip=self.trip,
            discount=30,
        )
        self.coupon2_1 = CouponDetails.objects.create(
            coupon_code="TRF44542",
            coupon_name="Coupon 2_1",
            coupon_description="Coupon detail 2_1",
            valid_till="2050-12-31",
            coupon_availability=2,
            trip=self.trip_completed,
            discount=30,
        )
        self.coupon3 = CouponDetails.objects.create(
            coupon_code="TRF44543",
            coupon_name="Coupon 3",
            coupon_description="Coupon detail 3",
            valid_till="2050-12-31",
            coupon_availability=1,
            user=self.owner,
            discount=30,
        )
        self.coupon3_1 = CouponDetails.objects.create(
            coupon_code="TRF44543",
            coupon_name="Coupon 3_1",
            coupon_description="Coupon detail 3_1",
            valid_till="2050-12-31",
            coupon_availability=1,
            user=self.admin,
            discount=30,
        )
        self.coupon4 = CouponDetails.objects.create(
            coupon_code="TRF44544",
            coupon_name="Coupon 4",
            coupon_description="Coupon detail 4",
            valid_till="2050-12-31",
            one_time_use=1,
            discount=30,
        )
        self.coupon4_1 = CouponDetails.objects.create(
            coupon_code="TRF44545",
            coupon_name="Coupon 4_1",
            coupon_description="Coupon detail 4_1",
            valid_till="2050-12-31",
            one_time_use=0,
            discount=30,
        )
        self.coupon_history1 = CouponHistory.objects.create(
            coupon=self.coupon4_1,
            user=self.user,
        )

        self.register = reverse("register-user")
        self.create_payment_intent = reverse("create-payment-intent")
        self.mock_create_payment_intent = (
            "normal_user.views.stripe.PaymentIntent.create"
        )
        self.book = reverse("book-seat")
        self.booking_history = reverse("booking-history")
        self.complaint = reverse("register-complaint")
        self.view_seat = reverse("view-seat-detail")
        self.list_complaints = reverse("list-complaints")
        self.list_coupons = reverse("available-coupons")
        self.redeem_coupon = reverse("redeem-coupon")

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

        self.valid_booking_values = {
            "total_amount": 175.35,
            "trip": self.trip.id,
            "pick_up": self.pick_up.id,
            "drop_off": self.drop_off.id,
            "booked_seats": [
                {
                    "traveller_name": "lia",
                    "traveller_dob": "1987-11-12",
                    "traveller_gender": 2,
                    "trip": self.trip.id,
                    "seat": self.seat.id,
                },
            ],
            "payment": {"payment_intend": "cbdkscndski", "status": 0},
            "coupon": {},
        }

        self.invalid_traveller_name_booking_values = {
            "total_amount": 175.35,
            "trip": self.trip.id,
            "pick_up": self.pick_up.id,
            "drop_off": self.drop_off.id,
            "booked_seats": [
                {
                    "traveller_name": 123,
                    "traveller_dob": "1987-11-12",
                    "traveller_gender": 2,
                    "trip": self.trip.id,
                    "seat": self.seat.id,
                },
            ],
            "payment": {"payment_intend": "cbdkscndski", "status": 0},
            "coupon": {},
        }

        self.valid_review_values = {
            "review_title": "Some Title",
            "review_body": "Some Body",
            "rating": 5,
        }

        self.invalid_rating_review_values = {
            "review_title": "Some Title",
            "review_body": "Some Body",
            "rating": 11,
        }

        self.valid_complaint_values = {
            "complaint_title": "Good Service",
            "complaint_body": "The service was good",
            "complaint_for": self.owner.id,
        }

        self.invalid_complaint_values = {
            "complaint_title": "Bad Service",
            "complaint_body": "The service was bad",
            "complaint_for": self.user.id,
        }

        self.invalid_complaint_serializer_error_values = {
            "complaint_title": "",
            "complaint_body": "",
            "complaint_for": self.owner.id,
        }

        self.invalid_complaint_not_a_valid_owner_values = {
            "complaint_title": "Ok Service",
            "complaint_body": "The service was ok",
            "complaint_for": 10000,
        }

        return super().setUp()


class RegisterUserTest(BaseTest):
    def test_can_register_user(self):
        response = self.client.post(self.register, self.valid_all_values, format="json")
        print(response)
        self.assertEqual(response.status_code, 201)

    def test_cant_register_user_with_invalid_names(self):
        self.client.post(self.register, self.invalid_names, format="json")
        response = self.client.post(self.register, self.invalid_names, format="json")
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_email(self):
        response = self.client.post(self.register, self.invalid_email, format="json")
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_phone_length(self):
        response = self.client.post(
            self.register, self.invalid_phone_length, format="json"
        )
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_phone_alphabet(self):
        response = self.client.post(
            self.register, self.invalid_phone_alphabet, format="json"
        )
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_length_less_than_eight(self):
        response = self.client.post(
            self.register, self.invalid_password_length_less_than_eight, format="json"
        )
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_length_more_than_twenty(self):
        response = self.client.post(
            self.register, self.invalid_password_length_more_than_twenty, format="json"
        )
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_no_capital_letter(self):
        response = self.client.post(
            self.register, self.invalid_password_no_capital_letter, format="json"
        )
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_no_small_letter(self):
        response = self.client.post(
            self.register, self.invalid_password_no_small_letter, format="json"
        )
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_no_number(self):
        response = self.client.post(
            self.register, self.invalid_password_no_number, format="json"
        )
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_password_no_special_character(self):
        response = self.client.post(
            self.register, self.invalid_password_no_special_character, format="json"
        )
        print(response)
        self.assertEqual(response.status_code, 200)


class UpdateUserTest(BaseTest):
    def test_can_update_user(self):
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile"),
            self.update_valid_all_values,
            format="json",
        )
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_update_user_with_invalid_names(self):
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile"),
            self.invalid_names,
            format="json",
        )
        print(response)
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_phone_length(self):
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile"),
            self.invalid_phone_length,
            format="json",
        )
        print(response)
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_phone_alphabet(self):
        self.client.post(self.register, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile"),
            self.invalid_phone_alphabet,
            format="json",
        )
        print(response)
        self.assertEqual(response.status_code, 400)

    def test_get_for_update(self):
        response = self.client.get(
            reverse("update-profile"),
            format="json",
        )
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_cant_update_user_with_invalid_email(self):
        response = self.client.put(
            reverse("update-profile"), self.invalid_email, format="json"
        )
        print(response)
        self.assertEqual(response.status_code, 400)

    def test_cant_update_user_with_invalid_email(self):
        response = self.client.put(
            reverse("update-profile"),
            {
                "first_name": "ab123",
                "last_name": valid_last_name,
                "email": "abcd@gmail.com",
                "password": valid_password,
                "phone": 9988774455,
            },
            format="json",
        )
        print(response)
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
            "busowner": 2,
            "usb_port": 0,
            "blankets": 0,
            "pillows": 0,
            "reading_light": 0,
            "toilet": 0,
            "snacks": 0,
            "tour_guide": 0,
            "cctv": 0,
            "route_cost": 100,
            "gst": 10,
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

    def test_05_can_view_trips_with_bus_type_params(self):
        view_trips_url = f"{reverse('view-trip')}?start=6&end=7&page=1&seat-type=-1&bus-type=1&bus-ac=-1&date=2023-11-25"
        response = self.client.get(view_trips_url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_06_can_view_trips_with_bus_ac_params(self):
        view_trips_url = f"{reverse('view-trip')}?start=6&end=7&page=1&seat-type=-1&bus-type=-1&bus-ac=1&date=2023-11-25"
        response = self.client.get(view_trips_url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_07_can_view_trips_with_invalid_query_params(self):
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
    def setUp(self):
        self.mock_mail_sent_response = patch(
            "normal_user.views.mail_sent_response"
        ).start()
        self.mock_send_email = patch(
            "normal_user.views.send_email_with_template"
        ).start()
        self.mock_perform_update = patch(
            "normal_user.views.CancelBooking.perform_update"
        ).start()
        self.mock_refund = patch("normal_user.views.CancelBooking.refund").start()
        self.mock_get = patch("normal_user.views.Bookings.objects.get").start()
        self.mock_CancelBookingSerializer = patch(
            "normal_user.views.CancelBookingSerializer.is_valid"
        ).start()
        self.user = User.objects.create_user(
            email="dummty2@gmail.com", password="12345678", account_provider=0, role=2
        )
        self.cancel_booking = f"{reverse('cancel-booking')}?booking_id=2"
        self.mock_cancel_booking_request = "normal_user.views.CancelBooking.request"

    def tearDown(self):
        patch.stopall()

    def _setup_mocks(self, refund_value=True, is_valid=True):
        booking_instance = MagicMock()
        booking_instance.user = self.user
        booking_instance.status = 0
        self.mock_get.return_value = booking_instance

        self.mock_refund.return_value = {"status": refund_value, "code": "D2008"}
        self.mock_perform_update.return_value = None
        self.mock_CancelBookingSerializer.return_value = True
        self.mock_send_email.return_value = {"success": True}
        self.mock_mail_sent_response.return_value = {"email_sent": True}

    def test_01_cancel_booking_with_valid_booking_id(self):
        self._setup_mocks()
        request = MagicMock(user=self.user)

        view = CancelBooking()
        response = view.update(request)
        self.assertEqual(response.status_code, 200)

    def test_02_cancel_booking_with_invalid_booking_id(self):
        self._setup_mocks()
        request = MagicMock(user=self.user, GET={"booking_id": -1})

        view = CancelBooking()
        response = view.update(request)

        self.assertEqual(response.status_code, 200)

    def test_03_cannot_cancel_booking_with_refund_fail(self):
        self._setup_mocks(refund_value=False)
        request = MagicMock(user=self.user)

        view = CancelBooking()
        response = view.update(request)
        self.assertEqual(response.status_code, 200)

    def test_04_cant_booking_with_exception(self):
        self._setup_mocks()
        self.user.role = 1
        self.mock_get.side_effect = Exception
        request = MagicMock()
        view = CancelBooking()
        response = view.update(request)

        self.assertEqual(response.status_code, 400)

    def test_05_cant_booking_with_invalid_user_role(self):
        self._setup_mocks()
        self.user.role = 1
        request = MagicMock(user=self.user)

        view = CancelBooking()
        response = view.update(request)

        self.assertEqual(response.status_code, 200)

    def test_06_cant_booking_with_different_user(self):
        self._setup_mocks()
        user = User.objects.create_user(
            email="dummy@gmail.com", password=valid_password, account_provider=0, role=2
        )
        request = MagicMock(user=user)

        view = CancelBooking()
        response = view.update(request)

        self.assertEqual(response.status_code, 200)

    def test_07_cancel_booking_which_is_already_canceled(self):
        self._setup_mocks()
        booking_instance = MagicMock()
        booking_instance.user = self.user
        booking_instance.status = 99
        self.mock_get.return_value = booking_instance

        request = MagicMock(user=self.user)

        view = CancelBooking()
        response = view.update(request)

        self.assertEqual(response.status_code, 200)

    def test_08_cant_cancel_booking_with_serializer_error(self):
        self._setup_mocks()
        booking_instance = MagicMock()
        booking_instance.user = self.user
        booking_instance.status = 0
        self.mock_CancelBookingSerializer.return_value = False
        self.mock_get.return_value = booking_instance

        request = MagicMock(user=self.user)

        view = CancelBooking()
        response = view.update(request)

        self.assertEqual(response.status_code, 400)


class BookingTest(BaseTest):
    def test_01_can_book(self):
        response = self.client.post(self.book, self.valid_booking_values, format="json")
        print(response.content)
        self.assertEqual(response.status_code, 201)

    def test_02_cannot_book(self):
        response = self.client.post(
            self.book, self.invalid_traveller_name_booking_values, format="json"
        )
        self.assertEqual(response.status_code, 400)


class BookingHistoryTest(BaseTest):
    def test_01_booking_history(self):
        response = self.client.get(
            self.booking_history, {"page": 1, "status": ""}, format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 200)

    def test_02_cancelled_status(self):
        response = self.client.get(
            self.booking_history, {"page": 1, "status": 99}, format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 200)


class ReviewTripTest(BaseTest):
    def test_01_can_review(self):
        response = self.client.post(
            f"{reverse('review-trip')}?booking_id={ self.booking_completed.id}",
            self.valid_review_values,
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 201)

    def test_02_cannot_review_on_pending_trip(self):
        response = self.client.post(
            f"{reverse('review-trip')}?booking_id={ self.booking.id}",
            self.valid_review_values,
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_03_cannot_review_on_cancelled_booking(self):
        response = self.client.post(
            f"{reverse('review-trip')}?booking_id={ self.booking_cancelled.id}",
            self.valid_review_values,
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_04_cannot_review_with_invalid_rating(self):
        response = self.client.post(
            f"{reverse('review-trip')}?booking_id={ self.booking_completed.id}",
            self.invalid_rating_review_values,
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)


class UpdateReviewTrip(BaseTest):
    def test_01_can_update_review(self):
        response = self.client.put(
            f"{reverse('review-update')}?review_id={ self.review.id}",
            self.valid_review_values,
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 200)

    def test_02_cannot_update_review_with_invalid_id(self):
        response = self.client.put(
            f"{reverse('review-update')}?review_id={100}",
            self.valid_review_values,
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 404)

    def test_03_cannot_update_review_with_invalid_rating(self):
        response = self.client.put(
            f"{reverse('review-update')}?review_id={self.review.id}",
            self.invalid_rating_review_values,
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_04_can_update_get_review(self):
        response = self.client.get(
            f"{reverse('review-update')}?review_id={ self.review.id}",
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 200)

    def test_05_cannot_update_get_review(self):
        response = self.client.get(
            f"{reverse('review-update')}?review_id=id",
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_06_cannot_update_get_review(self):
        response = self.client.get(
            f"{reverse('review-update')}?review_id={500}",
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 404)


class RegisterComplaintTest(BaseTest):
    def test_01_can_register_complaint(self):
        response = self.client.post(
            self.complaint, self.valid_complaint_values, format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 201)

    def test_02_cannot_register_complaint(self):
        response = self.client.post(
            self.complaint, self.invalid_complaint_values, format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_03_cannot_register_complaint_seriolizer_error(self):
        response = self.client.post(
            self.complaint,
            self.invalid_complaint_serializer_error_values,
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_04_cannot_register_complaint_not_user(self):
        response = self.client.post(
            self.complaint,
            self.invalid_complaint_not_a_valid_owner_values,
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_05_get_of_register_complaint(self):
        response = self.client.get(
            self.complaint,
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 200)


class ViewSeatDetailsTest(BaseTest):
    def test_01_get_seat_details(self):
        response = self.client.get(
            self.view_seat,
            {
                "trip_id": self.trip.id,
                "start_location": self.location_1.id,
                "end_location": self.location_2.id,
            },
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 200)

    def test_02_get_seat_details_inavlid_trip(self):
        response = self.client.get(
            self.view_seat,
            {
                "trip_id": 5000,
                "start_location": self.location_1.id,
                "end_location": self.location_2.id,
            },
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)


class ViewComplaintsTest(BaseTest):
    def test_01_get_complaint_details(self):
        response = self.client.get(
            self.list_complaints,
            {"ordering": "", "search": ""},
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 200)


class ViewCouponsTest(BaseTest):
    def test_01_get_coupons(self):
        response = self.client.get(
            self.list_coupons,
            {"trip_id": self.trip.id},
            format="json",
        )
        parsed_data = json.loads(response.content)
        print(len(parsed_data))  # json data count
        print(response.content)
        self.assertEqual(response.status_code, 200)

    def test_02_invalid_trip(self):
        response = self.client.get(
            self.list_coupons,
            {"trip_id": 100},
            format="json",
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_03_coupon_list_check(self):
        response = self.client.get(
            self.list_coupons,
            {"trip_id": self.trip.id},
            format="json",
        )
        print("total number of coupons: 10")
        print("coupons that should be available: 3")
        print(response.content)
        parsed_data = json.loads(response.content)
        self.assertEqual(4, len(parsed_data))  # available data count check
        self.assertEqual(response.status_code, 200)

    def test_04_coupon_list_another_user_with_no_previous_booking(self):
        self.user2 = User.objects.create_user(
            email="another@gmail.com", password=valid_password, account_provider=1
        )
        self.client.force_authenticate(self.user2)
        response = self.client.get(
            self.list_coupons,
            {"trip_id": self.trip.id},
            format="json",
        )
        print("total number of coupons: 10")
        print("coupons that should be available: 6")
        print(response.content)
        parsed_data = json.loads(response.content)
        self.assertEqual(6, len(parsed_data))  # available data count check
        self.assertEqual(response.status_code, 200)


class RedeemCouponTest(BaseTest):
    def test_01_valid_coupon(self):
        response = self.client.get(
            self.redeem_coupon,
            {"trip_id": self.trip.id, "coupon_id": self.coupon1.id},
            format="json",
        )
        self.assertEqual(
            response.content,
            b'{"valid":"Valid Coupon","coupon_status":"200"}',
        )
        self.assertEqual(response.status_code, 200)

    def test_02_invalid_coupon_validity_date(self):
        response = self.client.get(
            self.redeem_coupon,
            {"trip_id": self.trip.id, "coupon_id": self.coupon1_2.id},
            format="json",
        )
        self.assertEqual(
            response.content, b'{"invalid":"Invalid coupon","coupon_status":"400"}'
        )
        self.assertEqual(response.status_code, 200)

    def test_03_invalid_coupon_status(self):
        response = self.client.get(
            self.redeem_coupon,
            {"trip_id": self.trip.id, "coupon_id": self.coupon1_3.id},
            format="json",
        )
        self.assertEqual(
            response.content, b'{"invalid":"Invalid coupon","coupon_status":"400"}'
        )
        self.assertEqual(response.status_code, 200)

    def test_04_invalid_coupon_eligibility(self):
        response = self.client.get(
            self.redeem_coupon,
            {"trip_id": self.trip.id, "coupon_id": self.coupon1_1.id},
            format="json",
        )
        self.assertEqual(
            response.content,
            b'{"invalid":"User is not eligible for first time booking coupon","coupon_status":"400"}',
        )
        self.assertEqual(response.status_code, 200)

    def test_05_invalid_coupon_availability_1(self):
        response = self.client.get(
            self.redeem_coupon,
            {"trip_id": self.trip.id, "coupon_id": self.coupon3_1.id},
            format="json",
        )
        self.assertEqual(
            response.content,
            b'{"invalid":"Invalid by bus owner","coupon_status":"400"}',
        )
        self.assertEqual(response.status_code, 200)

    def test_06_invalid_coupon_availability_2(self):
        response = self.client.get(
            self.redeem_coupon,
            {"trip_id": self.trip.id, "coupon_id": self.coupon2_1.id},
            format="json",
        )
        self.assertEqual(
            response.content,
            b'{"invalid":"Invalid by trip","coupon_status":"400"}',
        )
        self.assertEqual(response.status_code, 200)

    def test_07_invalid_coupon_one_time_use(self):
        self.client.force_authenticate(self.user)
        response = self.client.get(
            self.redeem_coupon,
            {"trip_id": self.trip.id, "coupon_id": self.coupon4_1.id},
            format="json",
        )
        self.assertEqual(
            response.content,
            b'{"invalid":"Coupon already used by this user","coupon_status":"400"}',
        )
        self.assertEqual(response.status_code, 200)

    def test_08_invalid_coupon_invalid_trip(self):
        response = self.client.get(
            self.redeem_coupon,
            {"trip_id": 5000, "coupon_id": self.coupon1.id},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_09_invalid_coupon_invalid_coupon(self):
        response = self.client.get(
            self.redeem_coupon,
            {"trip_id": self.trip.id, "coupon_id": 5000},
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class ViewReviewsByTripTest(BaseTest):
    def test_01_can_get_reviews_with_valid_user_id(self):
        user = User.objects.create_user(
            email="dev@gmail.com", password="12345678", account_provider=0, role=3
        )
        review_url = f"{reverse('view-reviews-normal-user')}?user_id=" + str(user.id)
        response = self.client.get(
            review_url,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_02_cant_get_reviews_with_invalid_user_id(self):
        review_url = f"{reverse('view-reviews-normal-user')}?user_id=fsdfe"
        response = self.client.get(
            review_url,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_03_cant_get_reviews_with_no_user_id_(self):
        review_url = f"{reverse('view-reviews-normal-user')}"
        response = self.client.get(
            review_url,
            format="json",
        )
        self.assertEqual(response.status_code, 400)
