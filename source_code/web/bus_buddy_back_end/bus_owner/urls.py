from django.urls import path
from . import views

urlpatterns = [
    path('registration/', views.RegisterBusOwner.as_view(), name="register-bus-owner"),
]

