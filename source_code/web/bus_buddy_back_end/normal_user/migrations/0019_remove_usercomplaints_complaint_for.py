# Generated by Django 4.2.4 on 2023-12-13 03:40

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("normal_user", "0018_usercomplaints_complaint_for"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="usercomplaints",
            name="complaint_for",
        ),
    ]
