from django.urls import path
from bus_owner import views
urlpatterns = [
    path('addbus/',views.Addbus.as_view(),name="addbus"),
    path('updatebus/<int:id>/',views.Updatebus.as_view(),name="updatebus"),
    path('deletebus/<int:id>/',views.Deletebus.as_view(),name="deletebus"),
    path('viewbus/<int:pageNo>/',views.Viewbus.as_view(),name="viewbus"),
]