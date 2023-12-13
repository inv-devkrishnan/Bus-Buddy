from django.urls import path
from . import views

urlpatterns = [
    path("view-seats/", views.ViewSeats.as_view(), name="view-seat-detail"),
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
    path("book-seat/", views.BookSeat.as_view(), name="book-seat"),
    path("cancel-booking/", views.CancelBooking.as_view(), name="cancel-booking"),
    path(
        "create-payment-intent/",
        views.CreatePaymentIntent.as_view(),
        name="create-payment-intent",
    ),
    path("review-trip/", views.ReviewTrip.as_view(), name="review-trip"),
    path("review-history/", views.HistoryReviewTrip.as_view(), name="review-history"),
]
