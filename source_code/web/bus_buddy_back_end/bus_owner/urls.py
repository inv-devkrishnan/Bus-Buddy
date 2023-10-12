from django.urls import path
from . import views

urlpatterns = [
    path('registration/', views.RegisterBusOwner.as_view(), name="register-bus-owner"),
    path('update-profile/<int:id>',views.UpdateBusOwner.as_view(), name="update-profile"),
]

