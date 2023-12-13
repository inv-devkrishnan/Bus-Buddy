from django.db import models
from account_manage.models import User
from bus_owner.models import Trip
from bus_owner.models import PickAndDrop, SeatDetails


class UserReview(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    trip_id = models.ForeignKey(Trip, on_delete=models.CASCADE, null=False)
    review_title = models.CharField(max_length=255, null=False)
    review_body = models.TextField(null=False)
    rating = models.SmallIntegerField(default=0, null=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_review"


class UserComplaints(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, related_name="author"
    )
    complaint_title = models.CharField(max_length=100, null=False)
    complaint_body = models.TextField(null=False)
    complaint_for = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, related_name="reciever"
    )
    response = models.TextField(null=False, blank=True)
    status = models.SmallIntegerField(default=0)
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)

    class Meta:
        db_table = "user_complaints"


class Bookings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, null=False)
    pick_up = models.ForeignKey(
        PickAndDrop, on_delete=models.CASCADE, null=False, related_name="pick_up_id"
    )
    drop_off = models.ForeignKey(
        PickAndDrop, on_delete=models.CASCADE, null=False, related_name="drop_off_id"
    )
    status = models.SmallIntegerField(default=0, null=False)
    total_amount = models.DecimalField(max_digits=10, decimal_places=3)
    booking_id = models.CharField(max_length=255, null=False, unique=True)
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)

    class Meta:
        db_table = "bookings"


class Payment(models.Model):
    booking = models.ForeignKey(Bookings, on_delete=models.CASCADE, null=False)
    payment_intend = models.CharField(max_length=255, null=False)
    status = models.SmallIntegerField(default=0, null=False)
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payment"


class BookedSeats(models.Model):
    booking = models.ForeignKey(Bookings, on_delete=models.CASCADE)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    traveller_name = models.CharField(max_length=255, null=False)
    traveller_gender = models.SmallIntegerField(default=0, null=False)
    traveller_dob = models.DateField(auto_now=False, auto_now_add=False, null=False)
    seat = models.ForeignKey(SeatDetails, on_delete=models.CASCADE)
    status = models.SmallIntegerField(default=2)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "booked_seats"
