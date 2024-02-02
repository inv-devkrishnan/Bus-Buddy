import os
from apscheduler.schedulers.background import BackgroundScheduler
from django.apps import apps
from .tasks import batch_operations
from batch_tasks.tasks import updatetasksstatus
import pytz
def start():
    print("inside scheduler task")
    scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Kolkata'))
    scheduler.add_job(batch_operations,'interval', seconds=30)
    scheduler.add_job(updatetasksstatus, 'interval', seconds=30)  # Adjust the time as needed
    scheduler.start()

# Run the scheduler when the Django app is ready
def ready():
      if os.environ.get('RUN_MAIN'): # scheduler only starts in main process
        start()
