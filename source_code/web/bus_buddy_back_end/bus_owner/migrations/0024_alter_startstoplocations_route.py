# Generated by Django 4.2.5 on 2023-11-08 12:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bus_owner', '0023_amenities_status_buslayout_status_seatdetails_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='startstoplocations',
            name='route',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='location', to='bus_owner.routes'),
        ),
    ]
