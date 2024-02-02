from django.test import TestCase
from datetime import date, time, datetime, timedelta
from .tasks import (
    update_booking_status,
    send_mail_to_bookings_under_the_trip,
    update_counter_for_otp_generation,
    batch_operations,
)
from unittest.mock import patch, MagicMock, call
from bus_owner.models import Trip, StartStopLocations
from normal_user.models import Bookings, PickAndDrop
from account_manage.models import User, EmailAndOTP

trip_object_filter = "bus_owner.models.Trip.objects.filter"
email_and_otp = "account_manage.models.EmailAndOTP.objects.filter"


class UpdateBookingStatusTestCase(TestCase):
    def test_01_batch_update_booking_status(self):
        with patch(trip_object_filter) as mock_filter:
            trip_instance = Trip(end_date=date(2024, 1, 8), end_time=time(12, 0, 0))
            mock_filter.return_value = [trip_instance]
            res = update_booking_status()
        self.assertEqual(res, 0)

    def test_02_batch_update_booking_status_fail(self):
        with patch(trip_object_filter) as mock_filter:
            mock_filter.side_effect = Exception("Simulated database error")
            res = update_booking_status()
        self.assertEqual(res, -1)

    def test_03_whole_batch_test(self):
        batch_operations()


class BookingReminderEmailTestCase(TestCase):
    def test_01_batch_email_send_status(self):
        with patch(trip_object_filter) as mock_filter:
            current_date = datetime.now().date()
            day_after_tomorrow = current_date + timedelta(days=2)
            trip_instance = Trip(start_date=day_after_tomorrow)
            mock_filter.return_value = [trip_instance]
            res = send_mail_to_bookings_under_the_trip()
        self.assertEqual(res, 1)

    def test_02_batch_email_send_else_status(self):
        with patch(trip_object_filter) as mock_filter:
            current_date = datetime.now().date()
            day_after_tomorrow = current_date + timedelta(days=5)
            trip_instance = Trip(start_date=day_after_tomorrow)
            mock_filter.return_value = [trip_instance]
            res = send_mail_to_bookings_under_the_trip()
        self.assertEqual(res, 0)

    def test_03_batch_email_send_status_fail(self):
        with patch(trip_object_filter) as mock_filter:
            mock_filter.side_effect = Trip.DoesNotExist("DoesNotExist")
            res = send_mail_to_bookings_under_the_trip()
        self.assertEqual(res, -1)

    def test_04_batch_email_send_fail(self):
        with patch(trip_object_filter) as mock_filter:
            mock_filter.side_effect = Exception("DB error")
            res = send_mail_to_bookings_under_the_trip()
        self.assertEqual(res, -1)


class EmailVerificationCounterResetTestCase(TestCase):
    def test_01_reset_counter(self):
        with patch(email_and_otp) as mock_filter:
            email_instance = EmailAndOTP(counter=5, status=0)
            mock_filter.return_value = [email_instance]
            res = update_counter_for_otp_generation()
        self.assertEqual(res, 1)

    def test_02_reset_counter_exception(self):
        with patch(email_and_otp) as mock_filter:
            mock_filter.side_effect = Exception("DB error")
            res = update_counter_for_otp_generation()
        self.assertEqual(res, -1)

    def test_03_reset_counter_exception_no_data(self):
        with patch(email_and_otp) as mock_filter:
            mock_filter.side_effect = EmailAndOTP.DoesNotExist("DoesNotExist")
            res = update_counter_for_otp_generation()
        self.assertEqual(res, -1)
