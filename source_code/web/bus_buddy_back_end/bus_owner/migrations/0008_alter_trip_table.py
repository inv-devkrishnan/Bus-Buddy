# Generated by Django 4.2.4 on 2023-10-18 03:35

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("bus_owner", "0007_bus_bus_details_complete"),
    ]

    operations = [
        migrations.AlterModelTable(
            name="trip",
            table="trip",
        ),
    ]