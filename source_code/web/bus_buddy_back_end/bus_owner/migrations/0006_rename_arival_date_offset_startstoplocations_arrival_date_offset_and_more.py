# Generated by Django 4.2.4 on 2023-10-17 12:27

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("bus_owner", "0005_seatdetails_seat_ui_order"),
    ]

    operations = [
        migrations.RenameField(
            model_name="startstoplocations",
            old_name="arival_date_offset",
            new_name="arrival_date_offset",
        ),
        migrations.RenameField(
            model_name="startstoplocations",
            old_name="arival_time",
            new_name="arrival_time",
        ),
    ]
