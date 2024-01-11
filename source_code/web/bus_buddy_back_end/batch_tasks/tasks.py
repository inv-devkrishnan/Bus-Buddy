from django.db.models import Q
from datetime import datetime
from bus_owner.models import Trip
from normal_user.models import Bookings
import logging, pytz

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("django")
indian_timezone = pytz.timezone("Asia/Kolkata")


def get_completed_trips():
    """function to return completed trip objects

    Returns:
        Trip object Array: completed trip objects
    """
    completed_trips = []  # array to store completed trips
    current_time = datetime.now(tz=indian_timezone)  # setting timezone to asia kolkata
    trips = Trip.objects.filter(status=0)
    for trip in trips:
        trip_end_time = datetime.combine(
            date=trip.end_date,
            time=trip.end_time,
            tzinfo=indian_timezone,
        )
        if trip_end_time < current_time:
            completed_trips.append(trip)  # gets trips that are done

    return completed_trips


def UpdateTasksStatus():
    trips = Trip.objects.filter(status=0)
    print(trips)
    timezone = indian_timezone
    today = datetime.now()
    today = timezone.localize(today)
    print("new : ", today, " timezone : ", today.tzinfo)
    date = today.date()
    time = today.time()

    for trip in trips:
        print(trip.end_date, "end_date")
        print(trip.end_time, "end_time")
        print("today")

        print(time, "time")
        print(date, "date")
        if trip.end_date < date:
            trip.status = 1
            trip.save()
            logger.info("Trip status updated to 1")
        if trip.end_date == date and trip.end_time < time:
            trip.status = 1
            trip.save()
            logger.info("Trip status updated to 1")


def update_booking_status():
    """Function to update Booking status from booked to invalid for completed trips"""
    try:
        completed_trips = get_completed_trips()
        bookings = Bookings.objects.filter(
            trip__in=completed_trips, status=0
        )  # gets bookings of thoose trips
        count = bookings.count()
        bookings.update(status=1)  # updates booking status of thoose trips
        logger.info("booking status changed to invalid for " + str(count) + " bookings")
        return 0
    except Exception as e:
        logger.warn("Update Booking status Failed Reason : " + str(e))
        return -1


def batch_operations():
    update_booking_status()
    UpdateTasksStatus()
