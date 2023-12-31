from google.auth.transport import requests
from google.auth.exceptions import InvalidValue, MalformedError
from google.oauth2 import id_token
from decouple import config


class Google:
    """Google class to fetch the user info and return it"""

    @staticmethod
    def validate(auth_token):
        try:
            idinfo = id_token.verify_oauth2_token(auth_token, requests.Request())

            if "accounts.google.com" in idinfo["iss"] and idinfo["aud"] == config(
                "CLIENT_ID"
            ):
                return idinfo
            else:
                return {"error_code": "G1003"}

        except InvalidValue:
            return {"error_code": "G1004"}
        except MalformedError:
            return {"error_code": "G1005"}
