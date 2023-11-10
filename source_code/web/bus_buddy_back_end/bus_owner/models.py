from django.db import models
from account_manage.models import User


class Bus(models.Model):
    bus_name = models.CharField(max_length=100, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    plate_no = models.CharField(max_length=100, null=False)
    status = models.SmallIntegerField(default=0)
    bus_seat_type = models.SmallIntegerField(default=2)
    bus_type = models.SmallIntegerField(default=0)
    bus_ac = models.SmallIntegerField(default=0)
    bus_details_status = models.SmallIntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bus"


class Amenities(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    emergency_no = models.SmallIntegerField(default=0)
    water_bottle = models.SmallIntegerField(default=0)
    charging_point = models.SmallIntegerField(default=0)
    usb_port = models.SmallIntegerField(default=0)
    blankets = models.SmallIntegerField(default=0)
    pillows = models.SmallIntegerField(default=0)
    reading_light = models.SmallIntegerField(default=0)
    toilet = models.SmallIntegerField(default=0)
    snacks = models.SmallIntegerField(default=0)
    tour_guide = models.SmallIntegerField(default=0)
    cctv = models.SmallIntegerField(default=0)
    status = models.SmallIntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "amenities"


class SeatDetails(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    seat_number = models.CharField(max_length=50, null=False)
    seat_ui_order = models.IntegerField()
    seat_type = models.SmallIntegerField(default=0)
    deck = models.SmallIntegerField(default=0)
    seat_cost = models.DecimalField(max_digits=10, decimal_places=3)
    status = models.SmallIntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "seat_details"


class LocationData(models.Model):
    location_name = models.CharField(max_length=255, null=False)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "location_data"


class Routes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_point = models.ForeignKey(
        LocationData, on_delete=models.CASCADE, related_name="start_point"
    )
    end_point = models.ForeignKey(
        LocationData, on_delete=models.CASCADE, related_name="end_point"
    )
    via = models.CharField(max_length=255, null=False)
    distance = models.DecimalField(max_digits=10, decimal_places=3)
    duration = models.DecimalField(max_digits=10, decimal_places=3)
    travel_fare = models.DecimalField(max_digits=10, decimal_places=3)
    status = models.SmallIntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "routes"


class StartStopLocations(models.Model):
    seq_id = models.IntegerField(null=False)
    location = models.ForeignKey(LocationData, on_delete=models.CASCADE)
    arrival_time = models.TimeField(null=False)
    arrival_date_offset = models.IntegerField(default=0)
    departure_time = models.TimeField(null=False)
    departure_date_offset = models.IntegerField(default=0)
    status = models.SmallIntegerField(default=0)
    route = models.ForeignKey(Routes, on_delete=models.CASCADE, related_name='location', null=True)

    class Meta:
        db_table = "start_stop_locations"


class PickAndDrop(models.Model):
    # location = models.ForeignKey(LocationData, on_delete=models.CASCADE)
    route = models.ForeignKey(Routes, on_delete=models.CASCADE, null=True)
    bus_stop = models.CharField(max_length=255, null=False)
    arrival_time = models.TimeField()
    landmark = models.CharField(max_length=255, null=False)
    status = models.SmallIntegerField(default=0)
    start_stop_location=models.ForeignKey(StartStopLocations,on_delete=models.CASCADE,null=True, related_name='stops')

    class Meta:
        db_table = "pick_and_drop"


class Trip(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, null=False)
    route = models.ForeignKey(Routes, on_delete=models.CASCADE, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)
    start_time = models.TimeField(null=False)
    end_time = models.TimeField(null=False)
    status = models.SmallIntegerField(default=0, null=False)
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)

    class Meta:
        db_table = "trip"


class BusLayout(models.Model):
    name = models.CharField(max_length=100, null=False)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    type = models.SmallIntegerField(null=False)
    status = models.SmallIntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)

    class Meta:
        db_table = "bus_layout"
