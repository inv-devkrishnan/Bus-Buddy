from django.db import models
from account_manage.models import User
from bus_owner.models import Trip
from bus_owner.models import PickUp, DropOff, SeatDetails


class UserReview(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    trip_id = models.ForeignKey(Trip, on_delete=models.CASCADE, null=False)
    review_tittle = models.CharField(max_length=255, null=False)
    review_body = models.CharField(max_length=50, null=False)
    rating = models.SmallIntegerField(default=0, null=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_review"


class UserComplaints(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    complaint_title = models.CharField(max_length=100, null=False)
    complaint_body = models.TextField(null=False)
    status = models.SmallIntegerField(default=0)
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)

    class Meta:
        db_table = "user_complaints"


class Bookings(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    seat_id = models.ForeignKey(SeatDetails, on_delete=models.CASCADE, null=False)
    trip_id = models.ForeignKey(Trip, on_delete=models.CASCADE, null=False)
    pick_up_id = models.ForeignKey(PickUp, on_delete=models.CASCADE, null=False)
    drop_off_id = models.ForeignKey(DropOff, on_delete=models.CASCADE, null=False)
    status = models.SmallIntegerField(default=0, null=False)
    total_amount = models.IntegerField(null=False)
    booking_id = models.CharField(max_length=255, null=False, unique=True)
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_time = models.DateTimeField(auto_now=True, null=False)

    class meta:
        db_table = "bookings"


class Payment(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    booking_id = models.ForeignKey(Bookings, on_delete=models.CASCADE, null=False)
    payment_intend = models.CharField(max_length=255, null=False)
    status = models.SmallIntegerField(default=0, null=False)
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_time = models.DateTimeField(auto_now=True)

    class meta:
        db_table = "payment"


class Traveler(models.Model):
    booking_id = models.ForeignKey(Bookings, on_delete=models.CASCADE, null=False)
    name = models.CharField(max_length=255, null=False)
    gender = models.SmallIntegerField(default=0, null=False)
    dob = models.DateField(auto_now=False, auto_now_add=False, null=False)
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_time = models.DateTimeField(auto_now=True)

    class meta:
        db_table = "traveler"


class SeatAvailability(models.Model):
    booking = models.ForeignKey(Bookings, on_delete=models.CASCADE)
    seat = models.ForeignKey(SeatDetails, on_delete=models.CASCADE)
    status = models.SmallIntegerField(default=2)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "seat_availability"
