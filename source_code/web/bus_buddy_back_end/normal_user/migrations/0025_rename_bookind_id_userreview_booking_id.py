# Generated by Django 4.2.4 on 2023-12-14 05:00

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("normal_user", "0024_rename_booking_id_userreview_bookind_id"),
    ]

    operations = [
        migrations.RenameField(
            model_name="userreview",
            old_name="bookind_id",
            new_name="booking_id",
        ),
    ]
