from django.urls import path
from bus_owner import views
urlpatterns = [
    path('Add-Bus/',views.Addbus.as_view(),name="Add-Bus"),
    path('Update-Bus/<int:id>/',views.Updatebus.as_view(),name="Update-Bus"),
    path('Delete-Bus/<int:id>/',views.Deletebus.as_view(),name="Delete-Bus"),
    path('View-Bus/<int:pageNo>/',views.Viewbus.as_view(),name="View-Bus"),
    path('Add-Amenities/',views.Addamenities.as_view(),name="Add-Amenities"),
    path('Update-Amenities/<int:id>/',views.Updateamenities.as_view(),name="Update-Amenities"),
    path('Add-Routes/',views.Addroutes.as_view(),name="Add-Routes"),
    path('View-Routes/<int:pageNo>/',views.Viewroutes.as_view(),name="View-Routes"),
    path('Delete-Routes/<int:id>/',views.Deleteroutes.as_view(),name="Delete-Routes"),
]