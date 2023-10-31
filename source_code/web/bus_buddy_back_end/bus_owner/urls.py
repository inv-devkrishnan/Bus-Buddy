from django.urls import path
from bus_owner import views
urlpatterns = [
    path('registration/', views.RegisterBusOwner.as_view(), name="register-bus-owner"),
    path('update-profile',views.UpdateBusOwner.as_view(), name="update-profile-owner"),
    path('Add-Bus/',views.Addbus.as_view(),name="Add-Bus"),
    path('Update-Bus/<int:id>/',views.Updatebus.as_view(),name="Update-Bus"),
    path('Delete-Bus/<int:id>/',views.Deletebus.as_view(),name="Delete-Bus"),
    path('View-Bus/<int:pageno>/',views.Viewbus.as_view(),name="View-Bus"),
    path('Add-Amenities/',views.Addamenities.as_view(),name="Add-Amenities"),
    path('Update-Amenities/<int:id>/',views.Updateamenities.as_view(),name="Update-Amenities"),
    path('Add-Routes/',views.Addroutes.as_view(),name="Add-Routes"),
    path('View-Routes/<int:pageno>/',views.Viewroutes.as_view(),name="View-Routes"),
    path('Delete-Routes/<int:id>/',views.Deleteroutes.as_view(),name="Delete-Routes"),
    path('Add-trip/',views.Addtrip.as_view(),name="Add-trip"),
    path('Update-trip/<int:id>/',views.Updatetrip.as_view(),name="Update-trip"),
    path('Delete-trip/<int:id>/',views.Deletetrip.as_view(),name="Delete-trip"),
    path('View-trip/<int:pageno>/',views.Viewtrip.as_view(),name="View-trip"),
]