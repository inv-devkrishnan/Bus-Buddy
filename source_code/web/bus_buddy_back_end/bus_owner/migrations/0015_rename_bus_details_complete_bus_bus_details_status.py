# Generated by Django 4.2.4 on 2023-10-18 05:36

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("bus_owner", "0014_startstoplocations_departure_time"),
    ]

    operations = [
        migrations.RenameField(
            model_name="bus",
            old_name="bus_details_complete",
            new_name="bus_details_status",
        ),
    ]
