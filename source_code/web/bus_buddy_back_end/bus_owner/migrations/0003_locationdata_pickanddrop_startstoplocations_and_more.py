# Generated by Django 4.2.4 on 2023-10-17 11:58

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("bus_owner", "0002_alter_routes_distance_alter_routes_travel_fare_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="LocationData",
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
                ("location_name", models.CharField(max_length=255)),
                ("created_time", models.DateTimeField(auto_now_add=True)),
                ("updated_time", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "location_data",
            },
        ),
        migrations.CreateModel(
            name="PickAndDrop",
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
                ("bus_stop", models.CharField(max_length=255)),
                ("arrival_time_offset", models.TimeField()),
                ("landmark", models.CharField(max_length=255)),
                ("status", models.SmallIntegerField(default=0)),
            ],
            options={
                "db_table": "pick_and_drop",
            },
        ),
        migrations.CreateModel(
            name="StartStopLocations",
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
                ("seq_id", models.IntegerField()),
                ("arival_time", models.TimeField()),
                ("arival_date_offset", models.IntegerField(default=0)),
            ],
            options={
                "db_table": "start_stop_locations",
            },
        ),
        migrations.RemoveField(
            model_name="dropoff",
            name="location",
        ),
        migrations.RemoveField(
            model_name="locations",
            name="routes",
        ),
        migrations.RemoveField(
            model_name="pickup",
            name="location",
        ),
    ]
