from django.urls import path
from . import views

urlpatterns = [
    path("registration/", views.RegisterUser.as_view(), name="register-user"),
    path(
        "update-profile/<int:id>", views.UpdateProfile.as_view(), name="update-profile"
    ),
    path("view-trips/", views.ViewTrip.as_view(), name="view-trip"),
    path("update-profile", views.UpdateProfile.as_view(), name="update-profile"),
    path(
        "booking-history",
        views.BookingHistory.as_view(),
        name="booking-history",
    ),
]
