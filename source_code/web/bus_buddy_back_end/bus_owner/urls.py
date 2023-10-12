from django.urls import path
from bus_owner import views
urlpatterns = [
    path('addbus/',views.Addbus.as_view(),name="addbus"),
    path('updatebus/<str:bus_name>/',views.Updatebus.as_view(),name="updatebus"),
    path('deletebus/<str:bus_name>/',views.Deletebus.as_view(),name="deletebus"),
    path('viewbus/<int:pageNo>/',views.Viewbus.as_view(),name="viewbus"),
]