from django.urls import path
from . import views

urlpatterns = [
    path("registration/", views.RegisterUser.as_view(), name="register-user"),
    path("update-profile", views.UpdateProfile.as_view(), name="update-profile"),
    path(
        "booking-history",
        views.BookingHistory.as_view(),
        name="booking-history",
    ),
]
