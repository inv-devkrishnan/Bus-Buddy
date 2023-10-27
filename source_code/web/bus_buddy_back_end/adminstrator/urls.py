from django.urls import path
from . import views

urlpatterns = [
    path(
        "update-profile/", views.AdminProfileUpdation.as_view(), name="update_profile"
    ),
]
