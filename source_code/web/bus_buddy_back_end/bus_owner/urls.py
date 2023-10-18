from django.urls import path
from bus_owner import views
urlpatterns = [
    path('addbus/',views.Addbus.as_view(),name="addbus"),
    path('updatebus/<int:id>/',views.Updatebus.as_view(),name="updatebus"),
    path('deletebus/<int:id>/',views.Deletebus.as_view(),name="deletebus"),
    path('viewbus/<int:pageNo>/',views.Viewbus.as_view(),name="viewbus"),
    path('addamenities/',views.Addamenities.as_view(),name="addamenities"),
    path('addroutes/',views.Addroutes.as_view(),name="addroutes"),
    path('viewroutes/<int:pageNo>/',views.Viewroutes.as_view(),name="viewroutes"),
    path('deleteroutes/<int:id>/',views.Deleteroutes.as_view(),name="deleteroutes"),
    path('updateroutes/<int:id>/',views.Updateroutes.as_view(),name="updateroutes"),
    
]