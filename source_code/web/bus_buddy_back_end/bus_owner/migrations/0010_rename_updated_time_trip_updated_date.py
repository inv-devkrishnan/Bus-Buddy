# Generated by Django 4.2.4 on 2023-10-18 03:50

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        (
            "bus_owner",
            "0009_trip_end_time_trip_start_time_alter_trip_end_date_and_more",
        ),
    ]

    operations = [
        migrations.RenameField(
            model_name="trip",
            old_name="updated_time",
            new_name="updated_date",
        ),
    ]