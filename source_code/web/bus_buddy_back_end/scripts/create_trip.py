from bus_owner.models import Trip


def run():
    for i in range(10):
        Trip.objects.create(
            bus_id=3,
            route_id=2,
            user_id=1,
            start_date="2023-11-11",
            end_date="2023-11-11",
            start_time="12:00",
            end_time="14:00",
            status=0,
        )
        print("query Executed"+str(i))
