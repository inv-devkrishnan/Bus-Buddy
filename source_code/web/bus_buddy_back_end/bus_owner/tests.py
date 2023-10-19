from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Bus
from .serializers import busserializer
class BusApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_add_bus(self):
        data = {
            'bus_name': 'Bus1',
            'plate_no': 'AB123CD',
            'user': 1,
            'bus_type': 2,
            'bus_ac': 0,
            'status': 0,
        }
        response = self.client.post('/api/addbus/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_bus(self):
        bus = Bus.objects.create(bus_name='Bus2', plate_no='CD456EF', user_id=1)
        response = self.client.put(f'/api/deletebus/{bus.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Bus.objects.get(id=bus.id).status, 99)

    def test_update_bus(self):
        bus = Bus.objects.create(bus_name='Bus3', plate_no='EF789GH', user_id=1)
        data = {
            'bus_name': 'UpdatedBus',
            'plate_no': 'FG123HI',
            'user': 1,
            'bus_type': 2,
            'bus_ac': 0,
            'status': 0,
        }
        response = self.client.put(f'/api/updatebus/{bus.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_bus = Bus.objects.get(id=bus.id)
        self.assertEqual(updated_bus.bus_name, 'UpdatedBus')
        self.assertEqual(updated_bus.plate_no, 'FG123HI')

    def test_invalid_plate_no(self):
        data = {
            'bus_name': 'InvalidBus',
            'plate_no': 'InvalidPlate',
            'user': 1,
            'bus_type': 2,
            'bus_ac': 0,
            'status': 0,
        }
        response = self.client.post('/api/addbus/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

