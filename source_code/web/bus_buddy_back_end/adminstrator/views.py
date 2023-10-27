from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from account_manage.models import User
from .permissions import AllowAdminsOnly
from .serializer import AdminUpdateSerializer as AUS


class AdminProfileUpdation(UpdateAPIView):
    permission_classes = (AllowAdminsOnly,)

    def get(self, request):
        #  gets the current user profile information
        try:
            user = User.objects.get(id=request.user.id)
            serialized_data = AUS(user)
            return Response(serialized_data.data)
        except User.DoesNotExist:
            return Response({"error_code": "D1001"}, 400)

    def update(self, request):
        instance = User.objects.get(id=request.user.id)
        current_data = request.data
        serializer = AUS(instance, data=current_data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)

            return Response({"success_code": "D2002"})
        else:
            # error handling
            email_error = serializer._errors.get("email")  # gets email error
            phone_error = serializer._errors.get("phone")  # gets phone error

            if (
                phone_error
            ):  # if phone error is number already exists send different error code
                if phone_error[0] == "D1008":
                    return Response({"error_code": phone_error[0]}, 400)
                else:
                    return Response({"error_code": "D1002"}, 400)
            if (
                email_error
            ):  # if email error is email already exists send different error code
                if email_error[0] == "D1007":
                    return Response({"error_code": email_error[0]}, 400)
                else:
                    return Response({"error_code": "D1002"}, 400)
            else:
                return Response({"error_code": "D1002"}, 400)

    def put(self, request):
        return self.update(request)
