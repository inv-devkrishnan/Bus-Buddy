# Generated by Django 4.2.4 on 2023-12-12 11:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("normal_user", "0016_remove_usercomplaints_response"),
    ]

    operations = [
        migrations.AddField(
            model_name="usercomplaints",
            name="response",
            field=models.TextField(blank=True),
        ),
    ]
