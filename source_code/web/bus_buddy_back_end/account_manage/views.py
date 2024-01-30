import logging
import random
from django.db.utils import IntegrityError
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import authenticate
from .serializer import GoogleAuthSerializer as GAS
from .serializer import LoginSerializer as LS
from .serializer import PasswordSerializer as PS
from .serializer import EmailOtpSerializer, EmailOtpUpdateSerializer
from .models import User, EmailAndOTP
from .token import generate_token
from .google_auth import Google
from bus_buddy_back_end.email import send_email_with_template

logger = logging.getLogger("django")


def check_user_status(user):
    # returns response based on the user account status
    logger.info("checking status of user")
    if user.status == 0:
        token = generate_token(user)
        logger.info("user logged In")
        return Response(token, status=200)
    elif user.status == 2:
        return Response({"error_code": "D1009"}, status=401)
    elif user.status == 1:
        return Response({"error_code": "D1010"}, status=401)
    elif user.status == 3:
        return Response({"error_code": "D1011"}, status=401)
    elif user.status == 99:
        return Response({"error_code": "D1001"}, status=401)


class LoginWithGoogle(APIView):
    # to login google users
    permission_classes = (AllowAny,)

    def post(self, request):
        logger.info("Login with google intiated")
        serialzer = GAS(data=request.data)
        if serialzer.is_valid():
            #  gets user info from credential token
            user_data = Google.validate(serialzer.validated_data["cred_token"])
            if user_data.get("error_code"):
                logger.warn("google login failed Reason : " + str(user_data))
                return Response(user_data, status=401)
            else:
                # generate jwt token google users
                try:
                    email = user_data["email"]
                    user = User.objects.get(email=email, account_provider=1)
                    logger.info("user found")
                    return check_user_status(user)
                # if user doesn't exist in our db we create one
                except User.DoesNotExist:
                    logger.info("user doesnt exist creating a new account")
                    name = user_data["given_name"]
                    try:
                        User.objects.create_google_user(
                            email=email,
                            first_name=name,
                            account_provider=1,  # sets account provider as google
                            user_details_status=1,  # sets profile as incomplete
                        )
                        logger.info("new account created")
                    except IntegrityError:
                        return Response(
                            {"error_code": "D1015"},
                            status=401,
                        )
                    user = User.objects.get(email=email, account_provider=1)
                    token = generate_token(user)
                    logger.info("user logged In")
                    return Response(token, status=200)
        else:
            return Response(
                {"error_code": "D1002"},
                status=400,
            )


class LoginLocal(APIView):
    # to login local users
    permission_classes = (AllowAny,)

    def post(self, request):
        user_credentials = LS(data=request.data)

        if user_credentials.is_valid():  #  validation check
            try:
                user = User.objects.get(
                    email=user_credentials.validated_data["email"], account_provider=0
                )
                # authenticates user
                is_user_authenticated = authenticate(
                    email=user_credentials.validated_data["email"],
                    password=user_credentials.validated_data["password"],
                )
                if is_user_authenticated:
                    return check_user_status(user)
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


class DeleteAccount(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        try:
            logger.info("delete user initiated")
            user_id = request.user.id
            user = User.objects.get(id=user_id)
            logger.info("user instance aquired")
            user.status = 99  # status code of deleted user
            user.save()
            logger.info("user deleted sucessfully")
            return Response({"success_code": "D2000"}, status=200)
        except User.DoesNotExist as e:
            logger.warn("user deletion failed Reason" + str(e))
            return Response({"error_code": "D1004"}, status=403)


class ChangePassword(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        logger.info("password change initiated")
        password_data = PS(data=request.data)
        if password_data.is_valid():
            logger.info("password data validated")
            user_id = request.user.id
            try:
                # limiting change password only to local users
                user = User.objects.get(id=user_id, account_provider=0)
                logger.info("user instance aquired")
                old_password = password_data.validated_data["old_password"]
                if user.check_password(old_password):
                    user.set_password(password_data.validated_data["new_password"])
                    user.save()
                    logger.info("password change sucessful")
                    return Response({"success_code": "D2001"}, status=200)
                else:
                    logger.info(
                        "password change fail Reason : old password doesn't match"
                    )
                    return Response({"error_code": "D1003"}, status=400)
            except User.DoesNotExist as e:
                logger.info("password change fail Reason :" + str(e))
                return Response({"error_code": "D1004"}, status=403)
        else:
            logger.info("password change fail Reason :" + str(password_data.errors))
            return Response({"error_code": "D1002"}, status=400)


class UpdatePlatformCharges(UpdateAPIView):
    """
    function to update bus details by bus owner
    """

    permission_classes = (IsAuthenticated,)

    def put(self, request):  # update function
        try:
            request_data = request.data.copy()
            user_id = request.user.id
            user_role = request.user.role
            if user_role == 1:
                instance = User.objects.get(id=user_id)
                extra_charges = request_data.get("extra_charges")
                if extra_charges >= 0 and extra_charges <= 100:
                    instance.extra_charges = extra_charges
                    instance.save()
                    return Response({"message": "updated succesffully"}, status=200)
                else:
                    return Response(
                        {"message": "extra charges should be in range 0 to 100"},
                        status=400,
                    )
            else:
                return Response(
                    {"message": "The logged in user is not Admin"}, status=400
                )
        except Exception:
            return Response("Invalid data", status=404)


class GenerateEmailOtp(APIView):
    """
    For generating and storing otp for email verification
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        request_body = request.data.copy()
        try:
            random_number = random.randint(0, 999999)
            generated_otp = str(random_number).zfill(6)
            request_body["otp"] = generated_otp
            instance = (
                EmailAndOTP.objects.get(email=request.data.get("email"))
                if EmailAndOTP.objects.filter(email=request.data.get("email")).exists()
                else None
            )

            if instance:
                request_body["counter"] = instance.counter + 1
                serialized_data = EmailOtpUpdateSerializer(
                    instance, data=request_body, partial=True
                )  # updates existing data
            else:
                serialized_data = EmailOtpSerializer(
                    data=request_body
                )  # create new data

            if User.objects.filter(email=request.data.get("email")):
                logger.info("Email already registered")
                return Response(
                    {"message": "The email has been already registered"},
                    status=204,
                )
            elif instance and instance.counter >= 5:
                logger.info("Out of chance in otp generation")
                return Response(
                    {
                        "message": "Regrettably, the allotted chances for today have been exhausted."
                    },
                    status=200,
                )
            elif serialized_data.is_valid():
                serialized_data.save()
                logger.info("otp saved")
                send_email_with_template(
                    subject="Email verification",
                    context={"otp": request_body["otp"]},
                    recipient_list=[request_body["email"]],
                    template="email_verification_otp.html",
                    status=8,
                )
                logger.info("otp email has been send")
                return Response({"message": "otp generated succesffully"}, status=201)
            else:
                logger.info(serialized_data.errors)
                return Response({"error": serialized_data.errors}, status=400)
        except Exception as e:
            logger.error(f"Error: {e}")
            return Response({"error": str(e)}, status=400)


class VerifyOTP(UpdateAPIView):
    """
    For generating and storing otp for email verification
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        try:
            instance = EmailAndOTP.objects.get(email=request.GET.get("email"))
            if str(instance.otp).zfill(6) == str(request.GET.get("otp")):
                data = {"otp": None, "status": 1}
                serialized_data = EmailOtpUpdateSerializer(
                    instance, data=data, partial=True
                )  # updates existing data
                if serialized_data.is_valid():
                    self.perform_update(serialized_data)
                    return Response({"message": "Email has been verified"}, status=201)
                else:
                    return Response({"error": serialized_data.errors}, status=200)
            else:
                return Response({"error": "Wrong otp"}, status=205)

        except EmailAndOTP.DoesNotExist:
            logger.error("Error: No otp")
            return Response({"error": "There is no otp with this email"}, status=400)
        except Exception as e:
            logger.error(f"Error: {e}")
            return Response({"error": str(e)}, status=400)
