# Generated by Django 4.2.4 on 2023-10-18 03:51

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("bus_owner", "0010_rename_updated_time_trip_updated_date"),
    ]

    operations = [
        migrations.RenameField(
            model_name="trip",
            old_name="bus_id",
            new_name="bus",
        ),
        migrations.RenameField(
            model_name="trip",
            old_name="route_id",
            new_name="route",
        ),
        migrations.RenameField(
            model_name="trip",
            old_name="user_id",
            new_name="user",
        ),
    ]