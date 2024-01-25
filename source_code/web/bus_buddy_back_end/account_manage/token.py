import jwt
import os
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta

from dotenv import load_dotenv
load_dotenv('busbuddy_api.env')

def generate_token(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'refresh_token_expire_time': str(refresh.lifetime.total_seconds()*1000),
        'user_role': user.role,
        'account_provider': user.account_provider,
        'user_name': user.first_name,
    }
    
def generate_jwt_token(user_mail, expiration_minutes=30):
    # Define the payload (data to be included in the token)
    payload = {
        'user_mail': user_mail,
        'exp': datetime.utcnow() + timedelta(minutes=expiration_minutes),
        'iat': datetime.utcnow(),
    }

    # Generate the token
    token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm='HS256')

    return token    
    