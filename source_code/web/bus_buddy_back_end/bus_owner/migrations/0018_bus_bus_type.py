# Generated by Django 4.2.4 on 2023-10-18 05:44

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("bus_owner", "0017_rename_bus_type_bus_bus_seat_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="bus",
            name="bus_type",
            field=models.SmallIntegerField(default=0),
        ),
    ]