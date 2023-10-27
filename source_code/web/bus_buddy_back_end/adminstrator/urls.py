from django.urls import path
from . import views

urlpatterns = [
    path(
        "update-profile/", views.AdminProfileUpdation.as_view(), name="update_profile"
    ),
    path("list-users/", views.ListUsers.as_view(), name="list_users"),
    path("ban-user/<int:user_id>/", views.BanUser.as_view(), name="ban_user"),
    path("unban-user/<int:user_id>/", views.UnBanUser.as_view(), name="unban_user"),
    path("remove-user/<int:user_id>/", views.RemoveUser.as_view(), name="remove_user"),
]
