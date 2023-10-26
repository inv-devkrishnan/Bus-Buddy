from django.urls import path
from . import views

urlpatterns = [
    path("view-seats/", views.ViewSeats.as_view()),
]
