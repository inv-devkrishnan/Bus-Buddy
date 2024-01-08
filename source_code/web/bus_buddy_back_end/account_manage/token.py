from rest_framework_simplejwt.tokens import RefreshToken

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