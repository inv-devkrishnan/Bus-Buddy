from django.db.models import Q
from datetime import datetime, date, timedelta
from bus_owner.models import Trip
from normal_user.models import Bookings
from adminstrator.models import Email
from account_manage.models import EmailAndOTP
from account_manage.serializer import EmailOtpUpdateSerializer
from bus_buddy_back_end.email import send_email_with_template
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


def updatetasksstatus():
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


def send_email_for(bookings_under_trip, trip):
    """Send emails for bookings in the argument"""
    for booking in bookings_under_trip:
        send_email_with_template(
            subject="Trip reminder",
            context={
                "booking_id": booking.booking_id,
                "recipient_name": booking.user.first_name,
                "trip_date": booking.trip.start_date
                + timedelta(
                    days=booking.pick_up.start_stop_location.arrival_date_offset
                ),
                "pick": booking.pick_up.bus_stop,
                "arrival_time": booking.pick_up.arrival_time,
            },
            recipient_list=[booking.user.email],
            template="booking_reminder.html",
            status=7,
            trip=trip,
        )
        logger.info("Reminder mail has been send")


def send_mail_to_bookings_under_the_trip():
    """Function to send mail to all the bookings in a trip 2 days prior"""
    try:
        active_trips = Trip.objects.filter(status=0)
        current_date = date.today()
        for trip in active_trips:
            booking_reminder = Email.objects.filter(trip=trip, status=7)
            if (booking_reminder.count() == 0) and (
                trip.start_date - current_date
            ).days == 2:
                bookings_under_trip = Bookings.objects.filter(trip=trip.id, status=0)
                send_email_for(bookings_under_trip, trip)
                return 1
            else:
                logger.info(
                    f"Date is not before 2 days for this trip: {trip} or mail has already been send for: {booking_reminder}"
                )
    except Trip.DoesNotExist:
        return -1

    except Exception:
        return -1


def update_counter_for_otp_generation():
    """For changing the counter back to 0 for otp generation for the next day"""
    try:
        entries = EmailAndOTP.objects.filter(counter=5, status=0)
        for entry in entries:
            data = {"counter": 0}
            serialized_data = EmailOtpUpdateSerializer(
                entry, data=data, partial=True
            )  # updates existing data
            if serialized_data.is_valid():
                serialized_data.save()
                logger.info(f"{entry} has been updated for otp")
                return 1
            else:
                logger.info("No otp updation")

    except EmailAndOTP.DoesNotExist:
        logger.info("No entry in otp table with counter 5")
        return -1

    except Exception as e:
        logger.info(f"{e}")
        return -1


def batch_operations():
    update_booking_status()
    updatetasksstatus()
    send_mail_to_bookings_under_the_trip()
