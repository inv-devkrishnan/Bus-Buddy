from apscheduler.schedulers.background import BackgroundScheduler
from django.apps import apps
from batch_tasks.tasks import UpdateTasksStatus
import pytz
def start():
    print("inside scheduler task")
    scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Kolkata'))
    scheduler.add_job(UpdateTasksStatus, 'interval', seconds=30)  # Adjust the time as needed
    scheduler.start()

# Run the scheduler when the Django app is ready
def ready():
    start()
