from rest_framework.views import exception_handler
from rest_framework.exceptions import Throttled


def custom_throttle_exception_handler(exc, context):
    # to get the standard error response.
    response = exception_handler(exc, context)

    if isinstance(exc, Throttled):  # check that a Throttled exception is raised
        custom_response_data = {"error_code": "T0001"}  # prepare custom response data
        response.data = (
            custom_response_data  # set the custom response data on response object
        )

    return response
