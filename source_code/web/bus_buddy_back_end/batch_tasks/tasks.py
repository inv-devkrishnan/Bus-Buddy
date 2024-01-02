from datetime import datetime
from bus_owner.models import Trip
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def UpdateTasksStatus():
    trips= Trip.objects.filter(status=0)
    print(trips)
    today =datetime.now()
    date = today.date()
    time = today.time()
   
    for trip in trips:

        print("inside update task status")
        print(trip.end_date)
        print(trip.end_time)
        print("today")
        print(time)
        print(date)
        print(trip.end_time <= time)
        print (trip.bus)
        if (trip.end_date <= date ):
            print("inside if")
            trip.status = 1
            trip.save()
            logger.info("Task updated to 1")
        elif trip.end_date == date and trip.end_time <time :
            print("inside elif")
            trip.status = 1
            trip.save()
            logger.info("Task updated to 1")
        else:
            print("in else")
            
        print("outside if")