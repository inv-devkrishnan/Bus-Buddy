from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from unittest.mock import patch

# Create your tests here.
from django.urls import reverse
from rest_framework import status
from .models import Bus, User,Amenities,Trip,Routes,LocationData,StartStopLocations
from .serializers import BusSerializer

valid_first_name = "Sakki"
valid_last_name = "Sayya"
valid_email = "SakkiSayya999@gmail.com"
valid_password = "Aa!1qwerty"
valid_phone = "9961006248"
valid_company_name = "ABC Travels"
valid_aadhaar = "147258369014"
valid_msme = "UDYAN-654-745896"
valid_extra_charges = 150.25


class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register_bus_owner = reverse("register-bus-owner")
        self.add_seat = reverse("add-seat-details")
        self.create_bus = reverse("add-bus")

        self.user = User.objects.create_user(
            email=valid_email,
            password=valid_password,
            phone=valid_phone,
            company_name=valid_company_name,
            aadhaar_no=valid_aadhaar,
            msme_no=valid_msme,
            account_provider=0,
            role=3,
        )

        self.client.force_authenticate(self.user)
        self.bus = Bus.objects.create(
            bus_name="Bus2", plate_no="CD456EF", user=self.user
        )
        
        self.valid_all_values_seat_details = {
            "bus": self.bus.id,
            "seat_ui_order": 11,
            "seat_number": "1",
            "seat_type": 0,
            "deck": 0,
            "seat_cost": 200,
        }

        self.invalid_seat_ui_order_seat_details = {
            "bus": self.bus.id,
            "seat_ui_order": "abc",
            "seat_number": "1",
            "seat_type": 0,
            "deck": 0,
            "seat_cost": 200,
        }

        self.invalid_seat_type_seat_details = {
            "bus": self.bus.id,
            "seat_ui_order": 11,
            "seat_number": "1",
            "seat_type": 8,
            "deck": 0,
            "seat_cost": 200,
        }

        self.invalid_deck_seat_details = {
            "bus": self.bus.id,
            "seat_ui_order": 11,
            "seat_number": "1",
            "seat_type": 1,
            "deck": 4,
            "seat_cost": 200,
        }

        self.valid_all_values = {
            "first_name": "Priya",
            "last_name": "Menoth",
            "email": "priyaMenoth@gmail.com",
            "password": "Az@9uhts",
            "phone": "9495130217",
            "company_name": "Priya Travels",
            "aadhaar_no": "748159263578",
            "msme_no": "UDYAN-451-784512",
            "extra_charges": 455.50,
        }

        self.invalid_names = {
            "first_name": "56",
            "last_name": "789",
            "email": valid_email,
            "password": valid_password,
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_email = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": "SakkiSayya",
            "password": valid_password,
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_phone_length = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": valid_password,
            "phone": "9876",
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_phone_alphabet = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": valid_password,
            "phone": "987654321o",
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_length_less_than_eight = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!Aa1",
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_length_more_than_twenty = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!Aa1bhfyrtdkaw23dyulfr09ww",
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_no_capital_letter = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "!ndsfhdhsa1",
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_no_small_letter = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_no_number = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_password_no_special_character = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": "AJghjDFHGUSH1",
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.invalid_aadhaar_length_less_than_twelve = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "password": valid_password,
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": "741",
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.update_valid_data = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.update_invalid_names = {
            "first_name": "56",
            "last_name": "789",
            "email": valid_email,
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.update_invalid_email = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": "SakkiSayya",
            "phone": valid_phone,
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.update_invalid_phone_length = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": "9876",
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        self.update_invalid_phone_alphabet = {
            "first_name": valid_first_name,
            "last_name": valid_last_name,
            "email": valid_email,
            "phone": "987654321o",
            "company_name": valid_company_name,
            "aadhaar_no": valid_aadhaar,
            "msme_no": valid_msme,
            "extra_charges": valid_extra_charges,
        }

        
        return super().setUp()
    
class BaseTest2(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register_bus_owner = reverse("register-bus-owner")
        self.create_bus = reverse("add-bus")
        
        self.user = User.objects.create_user(
            email=valid_email,
            password=valid_password,
            phone=valid_phone,
            company_name=valid_company_name,
            aadhaar_no=valid_aadhaar,
            msme_no=valid_msme,
            account_provider=0,
            role=3,
        )

        self.client.force_authenticate(self.user)
        self.bus = Bus.objects.create(
            bus_name="Bus2", plate_no="CD456EF", user=self.user
        )
        self.loc_1=LocationData.objects.create(
            location_name = "Alapuzhya"
        )
        self.loc_2=LocationData.objects.create(
            location_name = "Thrivanthapuram"
        )
        
        loc_1_id = self.loc_1.id
        loc_2_id = self.loc_2.id
        
        self.route = Routes.objects.create(
            user= self.user,start_point= self.loc_1,end_point = self.loc_2,via = "Kollam",distance = 120, duration = 2,travel_fare = 399
        )
        route_id = self.route.id
        bus_id=self.bus.id
        self.amenities = Amenities.objects.create(
            bus=self.bus
        )
        amenities_id = self.amenities.id
        self.start_stop_1 =StartStopLocations.objects.create(
            seq_id=1,
            location=self.loc_1,
            arrival_time="10:00",  
            departure_time="11:00",
            arrival_date_offset=0,
            departure_date_offset=0,
            status=0,
            route=self.route,
        )
        self.start_stop_2 =StartStopLocations.objects.create(
            seq_id=2,
            location=self.loc_2,
            arrival_time="13:00",  
            departure_time="14:00",
            arrival_date_offset=0,
            departure_date_offset=0,
            status=0,
            route=self.route,
        )
        
        self.create_bus_data = {
            "bus_name": "boss",
            "plate_no": "Kl08A7099",
            "bus_type": 0,
            "bus_ac": 0,
            "bus_seat_type": 2,
        }
        self.cant_create_bus_invalid_data = {
            "bus_name": "boss",
            "plate_no": "Kl08A7099",
            "bus_type": 0,
            "bus_ac": 0,
            "bus_seat_type": 8,
        }
        self.update_bus_data = {
            "bus_name": "boss",
            "plate_no": "Kl08A7099",
            "bus_type": 0,
            "bus_ac": 0,
            "bus_seat_type": 2,
        }
        self.update_bus_invalid_data = {
            "bus_name": "boss",
            "plate_no": "KL 32 A 7099",
            "bus_type": 0,
            "bus_ac": 0,
            "bus_seat_type": 2,
        }

        self.add_amenities_data = {
            "bus": bus_id,
            "emergency_no": 0,
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
        self.add_amenities_invalid_bus = {
            "bus": 18,
            "emergency_no": 0,
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
        self.add_amenities_invalid_data = {
            "bus": bus_id,
            "emergency_no": 0,
            "water_bottle": 0,
            "charging_point": "ada",
            "usb_port": 0,
            "blankets": 0,
            "pillows": 0,
            "reading_light": 0,
            "toilet": 0,
            "snacks": 0,
            "tour_guide": 0,
            "cctv": 0,
        }
        self.update_amenities_data = {
            "bus": bus_id,
            "emergency_no": 0,
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
        self.create_route = {
            "start_point" : loc_1_id,
            "end_point" : loc_2_id,
            "via" : "kollam",
            "distance" : 120,
            "duration" : 2,
            "travel_fare" : 299,
            "location": [
                            {
                            "seq_id": 1,
                            "location": loc_1_id,
                            "arrival_time": "13:00",
                            "arrival_date_offset": "1",
                            "departure_time": "2:00",
                            "departure_date_offset": 1,
                            "pick_and_drop": [
                                {
                                "bus_stop": "location 1 stop",
                                "arrival_time": "10:00",
                                "landmark": "fds",
                                "status": 0
                                }
                            ]
                            },
                            {
                            "seq_id": 2,
                            "location": loc_2_id,
                            "arrival_time": "10:00",
                            "arrival_date_offset": "0",
                            "departure_time": "11:00",
                            "departure_date_offset": 0,
                            "pick_and_drop": [
                                {
                                "bus_stop": "location stop",
                                "arrival_time": "10:00",
                                "landmark": "fdsf",
                                "status": 0
                                }
                            ]
                            }
                        ]
        }
        self.cant_create_route = {
            "start_point" : loc_1_id,
            "end_point" : loc_2_id,
            "via" : "kollam",
            "distance" : "jahbdj",
            "duartion" : 2,
            "travel_fare" : 299,
        }
        self.create_trip = {
            "bus" : bus_id,
            "route" : route_id,
            "start_date" : "2024-06-09",
            "end_date" : "2024-06-09",
            "start_time": "13:00:00",
            "end_time": "17:00:00",
            
        }
        self.cant_create_trip = {
            "bus" : bus_id,
            "route" : route_id,
            "start_date" : "2024-12-9",
            "end_date" : "2024-12-09",
            "start_time": "13:00:00",
            "end_time": "17:00:00",
            
        }
        
        self.add_trip = reverse("add-trip")
        self.update_bus = reverse("update-bus", args=[bus_id])
        self.delete_bus = reverse("delete-bus", args=[bus_id])
        self.add_amenities = reverse("add-amenities")
        self.add_route = reverse("add-routes")
        self.update_amenities = reverse("update-amenities",args=[amenities_id])
        self.can_delete_route = reverse("delete-routes",args = [route_id])
        
        return super().setUp()


class BusActions(BaseTest2):
    def test_can_create_bus(self):
        print("1")
        response = self.client.post(
            self.create_bus, self.create_bus_data, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_create_bus_invalid_data(self):
        print("2")
        response = self.client.post(
            self.create_bus, self.cant_create_bus_invalid_data, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_can_update_bus(self):
        print("3")
        response = self.client.put(self.update_bus, self.update_bus_data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_cant_update_bus(self):
        print("4")
        self.update_invalid_bus = reverse("update-bus", args=[1])
        response = self.client.put(
            self.update_invalid_bus, self.update_bus_invalid_data, format="json"
        )
        self.assertEqual(response.status_code, 404)

    def test_cant_update_bus_invalid_data(self):
        print("5")
        response = self.client.put(
            
            self.update_bus, self.update_bus_invalid_data, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_can_delete_bus(self):
        print("6")
        response = self.client.put(self.delete_bus, format="json")
        self.assertEqual(response.status_code, 200)

    def test_cant_delete_bus(self):
        print("7")

        self.delete_invalid_bus = reverse("delete-bus", args=[1])
        response = self.client.put(self.delete_invalid_bus, format="json")
        self.assertEqual(response.status_code, 404)

    def test_can_add_amenities(self):
        print("8")
        response = self.client.post(
            self.add_amenities, self.add_amenities_data, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_add_invalid_bus_amenities(self):
        print("9")
        response = self.client.post(
            self.add_amenities, self.add_amenities_invalid_bus, format="json"
        )
        self.assertEqual(response.status_code, 404)

    def test_cant_add_invalid_data(self):
        print("10")
        response = self.client.post(
            self.add_amenities, self.add_amenities_invalid_data, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_can_update_amenities(self):
        print("11")
        response = self.client.put(
            self.update_amenities, self.update_amenities_data, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_update_amenities_invalid_id(self):
        print("12")
        self.cant_update_amenities = reverse("update-amenities", args=[800])
        response = self.client.put(
            self.cant_update_amenities, self.update_amenities_data, format="json"
        )
        
        self.assertEqual(response.status_code,404)
    
    def test_can_delete_route(self):
        print("13")
        response = self.client.put(
            self.can_delete_route
        )
        self.assertEqual(response.status_code,200)

    def test_cant_delete_route(self):
        print("14")
        self.cant_delete_route = reverse("delete-routes", args = [990])
        response = self.client.put(
            self.cant_delete_route
        )
        self.assertEqual(response.status_code,404)
        
    def test_can_create_route(self):
        print("15")
        response = self.client.post(
            self.add_route,self.create_route,format = "json"
        )
        self.assertEqual(response.status_code,200)
        
    def test_cant_create_route_invalid_data(self):
        print("16")
        response = self.client.post(
            self.add_route,self.cant_create_route,format = "json"
        )
        self.assertEqual(response.status_code,400)
        
    def test_can_create_trip(self):
        print("17")
        response = self.client.post(
            self.add_trip,self.create_trip,format = "json"
        )
        print("Status Code:", response.status_code)
        print("Response Content:", response.content)
        self.assertEqual(response.status_code,200)
        
    def test_cant_create_trip(self):
        print("18")
        response = self.client.post(
            self.add_trip,self.cant_create_trip,format = "json"
        )
        print("Status Code:", response.status_code)
        print("Response Content:", response.content)
        self.assertEqual(response.status_code,400)

    
class RegisterOwnerTest(BaseTest):
    def test_can_register_user(self):
        response = self.client.post(
            self.register_bus_owner, self.valid_all_values, format="json"
        )
        self.assertEqual(response.status_code, 201)

    def test_cant_register_user_with_invalid_names(self):
        self.client.post(self.register_bus_owner, self.invalid_names, format="json")
        response = self.client.post(
            self.register_bus_owner, self.invalid_names, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_email(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_email, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_length(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_phone_length, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_alphabet(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_phone_alphabet, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_length_less_than_eight(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_password_length_less_than_eight,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_length_more_than_twenty(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_password_length_more_than_twenty,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_capital_letter(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_password_no_capital_letter,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_small_letter(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_password_no_small_letter,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_number(self):
        response = self.client.post(
            self.register_bus_owner, self.invalid_password_no_number, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_password_no_special_character(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_password_no_special_character,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_aadhaar_length_less_than_twelve(self):
        response = self.client.post(
            self.register_bus_owner,
            self.invalid_aadhaar_length_less_than_twelve,
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class UpdateOwnerTest(BaseTest):
    def test_can_register_user(self):
        self.client.post(self.register_bus_owner, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile-owner"),
            self.update_valid_data,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_register_user_with_invalid_names(self):
        self.client.post(self.register_bus_owner, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile-owner"),
            self.update_invalid_names,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_email(self):
        self.client.post(self.register_bus_owner, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile-owner"),
            self.update_invalid_email,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_length(self):
        self.client.post(self.register_bus_owner, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile-owner"),
            self.update_invalid_phone_alphabet,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cant_register_user_with_invalid_phone_alphabet(self):
        self.client.post(self.register_bus_owner, self.valid_all_values, format="json")
        response = self.client.put(
            reverse("update-profile-owner"),
            self.update_invalid_phone_length,
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class BusApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            password="12345678",
            account_provider=0,
        )
        print(self.user.id)


class SeatDetailTest(BaseTest):
    def test_01_can_add_seat_detail(self):
        response = self.client.post(
            self.add_seat, self.valid_all_values_seat_details, format="json"
        )
        self.assertEqual(response.status_code, 201)

    def test_02_cannot_add_seat_detail_with_invalid_seat_ui_order(self):
        response = self.client.post(
            self.add_seat, self.invalid_seat_ui_order_seat_details, format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_03_cannot_add_seat_detail_with_invalid_seat_type(self):
        response = self.client.post(
            self.add_seat, self.invalid_seat_type_seat_details, format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)

    def test_04_cannot_add_seat_detail_with_invalid_deck(self):
        response = self.client.post(
            self.add_seat, self.invalid_deck_seat_details, format="json"
        )
        print(response.content)
        self.assertEqual(response.status_code, 400)
