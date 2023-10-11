from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authentication import authenticate
from decouple import config
from rest_framework.exceptions import AuthenticationFailed
from .serializer import GoogleAuthSerializer as GAS
from .serializer import LoginSerializer as LS
from .models import User
from .token import generate_token
from .google_auth import Google


class LoginWithGoogle(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serialzer = GAS(data=request.data)
        if serialzer.is_valid():
            #  gets user info from credential token
            user_data = Google.validate(serialzer.validated_data["cred_token"])
            if user_data.get("error_code"):
                return Response(user_data, status=401)
            # if client id from frontend != backend
            if user_data["aud"] != config("CLIENT_ID"):
                return Response(
                    {"error_code": "G1003"},
                    status=401,
                )
            else:
                # generate jwt token google users
                try:
                    email = user_data["email"]
                    user = User.objects.get(email=email, account_provider=1)
                    token = generate_token(user)
                    return Response(token, status=200)
                # if user doesn't exist in our db we create one
                except User.DoesNotExist:
                    name = user_data["given_name"]
                    User.objects.create_user(
                        email=email,
                        password=config("SECRET_KEY"),
                        first_name=name,
                        account_provider=1,  # sets account provider as google
                        user_details_status=1,  # sets profile as incomplete
                    )
                    user = User.objects.get(email=email, account_provider=1)
                    token = generate_token(user)
                    return Response(token, status=200)
        else:
            return Response(
                {"error_code": "D1002"},
                status=400,
            )


class LoginLocal(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        user_credentials = LS(data=request.data)

        if user_credentials.is_valid():
            try:
                user = User.objects.get(
                    email=user_credentials.validated_data["email"], account_provider=0
                )
                is_user_authenticated = authenticate(
                    email=user_credentials.validated_data["email"],
                    password=user_credentials.validated_data["password"],
                )
                if is_user_authenticated:
                    token = generate_token(user)
                    return Response(token, status=200)
                else:
                    return Response({"error_code": "D1000"}, status=401)
            except User.DoesNotExist:
                return Response(
                    {"error_code": "D1001"},
                    status=401,
                )
        else:
            return Response(
                {"error_code": "D1002"},
                status=400,
            )
