from django.urls import path
from . import views

urlpatterns = [
    path('add-seat-details/', views.AddSeatDetails.as_view(), name="register-bus-owner"),
]