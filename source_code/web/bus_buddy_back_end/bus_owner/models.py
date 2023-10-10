from django.db import models
from account_manage.models import User


class Bus(models.Model):
    bus_name = models.CharField(max_length=100, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    plate_no = models.CharField(max_length=100, null=False)
    status = models.SmallIntegerField(default=0)
    bus_type = models.SmallIntegerField(default=2)
    bus_ac = models.SmallIntegerField(default=0)
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
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "amenities"


class SeatDetails(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    seat_number = models.CharField(max_length=50, null=False)
    seat_type = models.SmallIntegerField(default=0)
    deck = models.SmallIntegerField(default=0)
    seat_cost = models.DecimalField(max_digits=7, decimal_places=5)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "seat_details"


class Routes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_point = models.CharField(max_length=255, null=False)
    end_point = models.CharField(max_length=255, null=False)
    via = models.CharField(max_length=255, null=False)
    distance = models.DecimalField(max_digits=7, decimal_places=5)
    duration = models.TimeField()
    travel_fare = models.DecimalField(max_digits=7, decimal_places=5)
    status = models.SmallIntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "routes"


class Locations(models.Model):
    routes = models.ForeignKey(Routes, on_delete=models.CASCADE)
    location_name = models.CharField(max_length=255, null=False)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "locations"


class PickUp(models.Model):
    location = models.ForeignKey(Locations, on_delete=models.CASCADE)
    bus_stop = models.CharField(max_length=255, null=False)
    arrival_time = models.TimeField()
    landmark = models.CharField(max_length=255, null=False)
    status = models.SmallIntegerField(default=0)

    class Meta:
        db_table = "pick_up"


class DropOff(models.Model):
    location = models.ForeignKey(Locations, on_delete=models.CASCADE)
    bus_stop = models.CharField(max_length=255, null=False)
    arrival_time = models.TimeField()
    landmark = models.CharField(max_length=255, null=False)
    status = models.SmallIntegerField(default=0)

    class Meta:
        db_table = "drop_off"


class Trip(models.Model):
    bus_id = models.ForeignKey(Bus, on_delete=models.CASCADE, null=False)
    route_id = models.ForeignKey(Routes, on_delete=models.CASCADE, null=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    start_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=False)
    status = models.SmallIntegerField(default=0, null=False)
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_time = models.DateTimeField(auto_now=True, null=False)

    class meta:
        db_table = "trip"
