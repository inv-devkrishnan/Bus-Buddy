# Generated by Django 4.2.4 on 2024-01-23 06:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

bus_owner_trip = "bus_owner.trip"
normal_user_bookings = "normal_user.bookings"
class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("bus_owner", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Bookings",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("status", models.SmallIntegerField(default=0)),
                ("total_amount", models.DecimalField(decimal_places=3, max_digits=10)),
                ("booking_id", models.CharField(max_length=255, unique=True)),
                ("created_date", models.DateTimeField(auto_now_add=True)),
                ("updated_date", models.DateTimeField(auto_now=True)),
                (
                    "drop_off",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="drop_off_id",
                        to="bus_owner.pickanddrop",
                    ),
                ),
                (
                    "pick_up",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="pick_up_id",
                        to="bus_owner.pickanddrop",
                    ),
                ),
                (
                    "trip",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to=bus_owner_trip
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "bookings",
            },
        ),
        migrations.CreateModel(
            name="UserReview",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("review_title", models.CharField(max_length=255)),
                ("review_body", models.TextField()),
                ("rating", models.SmallIntegerField(default=0)),
                ("created_date", models.DateTimeField(auto_now_add=True)),
                ("updated_time", models.DateTimeField(auto_now=True)),
                (
                    "booking_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=normal_user_bookings,
                    ),
                ),
                (
                    "review_for",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="viewer",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "trip_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to=bus_owner_trip
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="writer",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "user_review",
            },
        ),
        migrations.CreateModel(
            name="UserComplaints",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("complaint_title", models.CharField(max_length=100)),
                ("complaint_body", models.TextField()),
                (
                    "complaint_image",
                    models.ImageField(blank=True, null=True, upload_to="images/"),
                ),
                ("response", models.TextField(blank=True)),
                ("status", models.SmallIntegerField(default=0)),
                ("created_date", models.DateField(auto_now_add=True)),
                ("updated_date", models.DateField(auto_now=True)),
                (
                    "complaint_for",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reciever",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="author",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "user_complaints",
            },
        ),
        migrations.CreateModel(
            name="Payment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("payment_intend", models.CharField(max_length=255)),
                ("status", models.SmallIntegerField(default=0)),
                ("created_date", models.DateTimeField(auto_now_add=True)),
                ("updated_time", models.DateTimeField(auto_now=True)),
                (
                    "booking",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=normal_user_bookings,
                    ),
                ),
            ],
            options={
                "db_table": "payment",
            },
        ),
        migrations.CreateModel(
            name="BookedSeats",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("traveller_name", models.CharField(max_length=255)),
                ("traveller_gender", models.SmallIntegerField(default=0)),
                ("traveller_dob", models.DateField()),
                ("status", models.SmallIntegerField(default=2)),
                ("created_date", models.DateTimeField(auto_now_add=True)),
                ("updated_date", models.DateTimeField(auto_now=True)),
                (
                    "booking",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=normal_user_bookings,
                    ),
                ),
                (
                    "seat",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="bus_owner.seatdetails",
                    ),
                ),
                (
                    "trip",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to=bus_owner_trip
                    ),
                ),
            ],
            options={
                "db_table": "booked_seats",
            },
        ),
    ]
