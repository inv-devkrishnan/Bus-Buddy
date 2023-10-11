from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("local-login/", views.LoginLocal.as_view(), name="local_login"),
    path("google-login/", views.LoginWithGoogle.as_view(), name="local_login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh")
]
