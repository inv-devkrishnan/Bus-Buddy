from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("local-login/", views.LoginLocal.as_view(), name="local_login"),  # comment
    path("google-login/", views.LoginWithGoogle.as_view(), name="google_login"),
    path("delete-account/",views.DeleteAccount.as_view(),name="delete_account"),
    path("change-password/",views.ChangePassword.as_view(),name="change_password"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("platformcharges/", views.UpdatePlatformCharges.as_view(), name="platformcharges"),
    path("forgot-password-send-mail/", views.ForgetPasswordSendMail.as_view(), name="forgotpasswordsendmail"),
    path("forgot-password-verify/", views.ForgetPasswordTokenVerify.as_view(), name="forgotpasswordverify"),
   
]
