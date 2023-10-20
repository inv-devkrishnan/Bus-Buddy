from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('bus-owner/',include("bus_owner.urls")),
    path("user/",include("normal_user.urls")),
]