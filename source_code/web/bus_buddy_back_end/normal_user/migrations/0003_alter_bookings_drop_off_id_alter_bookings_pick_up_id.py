# Generated by Django 4.2.4 on 2023-10-17 11:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("bus_owner", "0003_locationdata_pickanddrop_startstoplocations_and_more"),
        ("normal_user", "0002_alter_bookings_table_alter_payment_table_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="bookings",
            name="drop_off_id",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="drop_off_id",
                to="bus_owner.pickanddrop",
            ),
        ),
        migrations.AlterField(
            model_name="bookings",
            name="pick_up_id",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="pick_up_id",
                to="bus_owner.pickanddrop",
            ),
        ),
    ]
