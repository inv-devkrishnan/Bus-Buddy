from django.test import TestCase
from datetime import date,time
from .tasks import update_booking_status
from unittest.mock import patch,MagicMock
from bus_owner.models import Trip


# Create your tests here.
class UpdateBookingStatusTestCase(TestCase):
    def test_01_batch_update_booking_status(self):
       with patch("bus_owner.models.Trip.objects.filter") as mock_filter:
          trip_instance =  Trip(end_date=date(2024,1,8),end_time=time(12,0,0))
          mock_filter.return_value = [trip_instance]
          res = update_booking_status()
       self.assertEqual(res, 0)
   
    def test_02_batch_update_booking_status_fail(self):
        with patch("bus_owner.models.Trip.objects.filter") as mock_filter:
          mock_filter.side_effect = Exception("Simulated database error")
          res = update_booking_status()
        self.assertEqual(res, -1)
