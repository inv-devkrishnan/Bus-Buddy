from django.urls import path
from . import views

urlpatterns = [
    path('add-seat-details', views.AddSeatDetails.as_view(), name="add-seat-details"),
    path('get-seat-details',views.GetSeatDetails.as_view(), name="get-seat-details"),
    path('registration/', views.RegisterBusOwner.as_view(), name="register-bus-owner"),
    path('update-profile',views.UpdateBusOwner.as_view(), name="update-profile-owner"),
    path('add-bus/',views.Addbus.as_view(),name="add-bus"),
    path('update-bus/<int:id>/',views.Updatebus.as_view(),name="update-bus"),
    path('delete-bus/<int:id>/',views.Deletebus.as_view(),name="delete-bus"),
    path('view-bus/',views.Viewbus.as_view(),name="view-bus"),
    path('add-amenities/',views.Addamenities.as_view(),name="add-amenities"),
    path('update-amenities/<int:id>/',views.Updateamenities.as_view(),name="update-amenities"),
    path('add-routes/',views.Addroutes.as_view(),name="add-routes"),
    path('view-routes/',views.Viewroutes.as_view(),name="view-routes"),
    path('delete-routes/<int:id>/',views.Deleteroutes.as_view(),name="delete-routes"),
    path('add-trip/',views.Addtrip.as_view(),name="add-trip"),
    path('update-trip/<int:id>/',views.Updatetrip.as_view(),name="update-trip"),
    path('delete-trip/<int:id>/',views.Deletetrip.as_view(),name="delete-trip"),
    path('view-trip/',views.Viewtrip.as_view(),name="view-trip"),
    path('view-available-bus/',views.Viewavailablebus.as_view(),name="view-available-bus"),
    path('add-reccuring-trip/',views.Addreccuringrip.as_view(),name="add-reccuring-trip"),
    path('view-reviews/',views.Viewreviews.as_view(),name="view-reviews"),
    path('view-notifications/',views.Viewnotifications.as_view(),name="view-notifications"),
    path('change-notification-status/',views.Changenotificationstatus.as_view(),name="change-notification-status"),
]
