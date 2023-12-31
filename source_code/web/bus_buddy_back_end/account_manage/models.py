from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, password, **extra_fields):
        user = self.model(**extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_google_user(self, **extra_fields):
        user = self.model(**extra_fields)
        user.set_unusable_password()
        user.save()
        return user


class User(AbstractBaseUser):
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=True, blank=False)
    email = models.EmailField(max_length=254, unique=True, null=False)
    password = models.CharField(max_length=100, null=False)
    phone = models.CharField(max_length=100, null=True, blank=False)
    company_name = models.CharField(max_length=100, null=True, blank=False)
    aadhaar_no = models.CharField(max_length=100, null=True, blank=False)
    msme_no = models.CharField(max_length=100, null=True, blank=False)
    extra_charges = models.FloatField(null=True, blank=False)
    role = models.SmallIntegerField(default=2)
    status = models.SmallIntegerField(default=0)
    account_provider = models.SmallIntegerField(default=0)
    user_details_status = models.SmallIntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    class Meta:
        db_table = "user"
