# Generated by Django 4.2.4 on 2023-12-12 06:40

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("normal_user", "0012_rename_booking_id_payment_booking"),
    ]

    operations = [
        migrations.RenameField(
            model_name="userreview",
            old_name="review_tittle",
            new_name="review_title",
        ),
    ]
