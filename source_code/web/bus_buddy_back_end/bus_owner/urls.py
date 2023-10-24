from django.urls import path
from bus_owner import views
urlpatterns = [
    path('Add-Routes/',views.Addroutes.as_view(),name="Add-Routes"),
    path('View-Routes/<int:pageNo>/',views.Viewroutes.as_view(),name="View-Routes"),
    path('Delete-Routes/<int:id>/',views.Deleteroutes.as_view(),name="Delete-Routes"),
]