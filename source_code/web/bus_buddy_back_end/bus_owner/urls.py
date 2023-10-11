from django.urls import path
from bus_owner import views
urlpatterns = [
    path('addbus/',views.Addbus.as_view(),name="addbus"),
]