from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Bus,User
from .serializers import BusSerializer
from django.urls import reverse



class BusApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            password="12345678",
            account_provider=0
        )
        print(self.user.id)
class CreateTest(BusApiTests):

    def test_add_bus(self):
        url=reverse("Add-Bus")
        data = {
            'bus_name': 'Bus1',
            'plate_no': 'AB123CD',
            'user': self.user.id,
            'bus_type': 2,
            'bus_ac': 0,
            'status': 0,
        }
        print(self.user.id)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code,200)
        if(response.status_code == 200):
            print("ok")

    def test_update_bus(self):
        bus = Bus.objects.create(bus_name='Bus3', plate_no='EF789GH', user=self.user)
        data = {
            'bus_name': 'UpdatedBus',
            'plate_no': 'FG123HI',
            'user': bus.user,
            'bus_type': 2,
            'bus_ac': 0,
            'status': 0,
        }
        response = self.client.put( '/api/Update-Bus/{bus.id}/' , data, format='json')
        print(bus.id)
        self.assertEqual(response.status_code,200)
        updated_bus = Bus.objects.get(id=bus.id)
        print(updated_bus)
        self.assertEqual(updated_bus.bus_name, 'UpdatedBus')
        self.assertEqual(updated_bus.plate_no, 'FG123HI')
    
    def test_delete_bus(self):
        bus = Bus.objects.create(bus_name='Bus2', plate_no='CD456EF', user=self.user)
        response = self.client.put('/api/Delete-Bus/{bus.id}/')
        print(bus.id)
        delete_bus=Bus.objects.filter(id=bus.id)
        print(delete_bus)
        self.assertEqual(response.status_code,200)
        self.assertEqual(Bus.objects.get(id=bus.id).status, 99)

    

   

