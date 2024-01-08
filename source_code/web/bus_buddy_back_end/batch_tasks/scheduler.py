import os
from apscheduler.schedulers.background import BackgroundScheduler
from django.apps import apps
from batch_tasks.tasks import UpdateTasksStatus
from batch_tasks.tasks import update_booking_status
import pytz
def start():
    print("inside scheduler task")
    scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Kolkata'))
    scheduler.add_job(update_booking_status,'interval', seconds=30)
    scheduler.add_job(UpdateTasksStatus, 'interval', seconds=40)  # Adjust the time as needed
    scheduler.start()

# Run the scheduler when the Django app is ready
def ready():
      if os.environ.get('RUN_MAIN'): # scheduler only starts in main process
        start()
