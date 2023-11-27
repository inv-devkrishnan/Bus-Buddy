from rest_framework import permissions


class AllowAdminsOnly(permissions.BasePermission):
    # permission class to distinguish admins
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user and request.user.role == 1:
            return True
        return False

class AllowNormalUsersOnly(permissions.BasePermission):
    # permission class to distinguish admins
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user and request.user.role == 2:
            return True
        return False    
    
