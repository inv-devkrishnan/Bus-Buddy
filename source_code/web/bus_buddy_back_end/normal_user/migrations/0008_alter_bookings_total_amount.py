# Generated by Django 4.2.4 on 2023-10-24 06:58

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("normal_user", "0007_bookedseats_traveller_dob_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="bookings",
            name="total_amount",
            field=models.DecimalField(decimal_places=3, max_digits=10),
        ),
    ]
