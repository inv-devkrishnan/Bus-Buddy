from django.db import models


class RefundPolicy(models.Model):
    refund_percentage = models.FloatField(null=False)
    refund_timeframe = models.IntegerField(null=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "refund_policy"


class CouponDetails(models.Model):
    coupon_code = models.CharField(max_length=20)
    coupon_name = models.CharField(max_length=100)
    coupon_description = models.TextField(null=False)
    coupon_eligibility = models.SmallIntegerField(default=0)
    coupon_dob = models.DateField(null=False)
    valid_till = models.DateTimeField(null=False)
    discount = models.IntegerField(null=False)
    status = models.SmallIntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "coupon_details"


class CouponAvailability(models.Model):
    coupon = models.ForeignKey(CouponDetails, on_delete=models.CASCADE,null=False)
    status = models.SmallIntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "coupon_availability"


class Email(models.Model):
    from_email = models.CharField(max_length=254,null=False)
    to_email = models.CharField(max_length=254,null=False)
    status = models.SmallIntegerField(null=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "email"
