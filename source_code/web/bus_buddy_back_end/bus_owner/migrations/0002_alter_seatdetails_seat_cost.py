# Generated by Django 4.2.4 on 2024-01-31 11:21

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("bus_owner", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="seatdetails",
            name="seat_cost",
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
    ]