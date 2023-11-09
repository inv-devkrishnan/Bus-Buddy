"""
URL configuration for bus_buddy_back_end project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from .views import GetLocationData

urlpatterns = [
    path("admin/", admin.site.urls),
    path("get-location-data/",GetLocationData.as_view()),
    path("account/", include("account_manage.urls")),
    path("bus-owner/", include("bus_owner.urls")),
    path("user/", include("normal_user.urls")),
    path("adminstrator/",include("adminstrator.urls")),
    path("__debug__/", include("debug_toolbar.urls")),
]
