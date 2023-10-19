# Generated by Django 4.2.4 on 2023-10-18 03:44

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("bus_owner", "0008_alter_trip_table"),
    ]

    operations = [
        migrations.AddField(
            model_name="trip",
            name="end_time",
            field=models.TimeField(default="12:00:00"),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="trip",
            name="start_time",
            field=models.TimeField(default="12:00:00"),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="trip",
            name="end_date",
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name="trip",
            name="start_date",
            field=models.DateField(),
        ),
    ]
