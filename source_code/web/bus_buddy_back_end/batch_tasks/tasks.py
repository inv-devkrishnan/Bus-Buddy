from datetime import datetime
from bus_owner.models import Trip
import logging,pytz
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def UpdateTasksStatus():
    trips= Trip.objects.filter(status=0)
    print(trips)
    timezone =  pytz.timezone('Asia/Kolkata')
    today =datetime.now()
    today =timezone.localize(today)
    print ("new : ",today," timezone : ",today.tzinfo)
    date = today.date()
    time = today.time()
   
    for trip in trips:
        print(trip.end_date, "end_date")
        print(trip.end_time, "end_time")
        print("today")
        
        print(time,"time")
        print(date,"date")
        if (trip.end_date < date ):
            trip.status = 1
            trip.save()
            logger.info("Trip status updated to 1")
        if trip.end_date == date and trip.end_time <time :
            trip.status = 1
            trip.save()
            logger.info("Trip status updated to 1")

            