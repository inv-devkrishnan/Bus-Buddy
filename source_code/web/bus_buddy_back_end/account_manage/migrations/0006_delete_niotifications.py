# Generated by Django 4.2.4 on 2024-01-12 09:33

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("account_manage", "0005_merge_0004_niotifications_0004_notifications"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Niotifications",
        ),
    ]
