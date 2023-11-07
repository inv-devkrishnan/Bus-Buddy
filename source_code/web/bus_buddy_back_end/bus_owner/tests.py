from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.add_seat_detail = reverse("add-seat-detail")

        self.valid_all_values_seat_details = {
            "bus": 1,
            "seat_ui_order": 11,
            "seat_number": "1",
            "seat_type": 0,
            "deck": 0,
            "seat_cost": 200,
        }
