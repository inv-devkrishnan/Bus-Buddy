from rest_framework import pagination


class CustomPagination(pagination.PageNumberPagination):
    page_size = 5  # default page size
    page_size_query_param = "page_size"
    max_page_size = 50  # max page size
class ComplaintPagination(pagination.PageNumberPagination):
    page_size = 5  # default page size
    page_size_query_param = "page_size"
    max_page_size = 20  # max page size
class CouponPagination(pagination.PageNumberPagination):
    page_size = 5  # default page size
    page_size_query_param = "page_size"
    max_page_size = 20  # max page size
            
