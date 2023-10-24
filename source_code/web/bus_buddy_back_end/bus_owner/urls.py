from django.urls import path
from . import views

urlpatterns = [
    path('add-seat-details', views.AddSeatDetails.as_view(), name="add-seat-details"),
    path('get-seat-details',views.GetSeatDetails.as_view(), name="get-seat-details"),
]