from django.urls import path
from . import views

urlpatterns = [
    path('registration/', views.RegisterUser.as_view(), name="register-user"),
]