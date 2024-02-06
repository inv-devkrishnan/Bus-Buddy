import os
from apscheduler.schedulers.background import BackgroundScheduler
from django.apps import apps
from .tasks import batch_operations, update_counter_for_otp_generation
from batch_tasks.tasks import updatetasksstatus
import pytz
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("django")

def start():
    logger.info("inside scheduler task")
    scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Kolkata'))
    scheduler.add_job(batch_operations,'interval', seconds=30)
    scheduler.add_job(updatetasksstatus, 'interval', seconds=30)  # Adjust the time as needed
    scheduler.start()


# Run the scheduler when the Django app is ready
def ready():
    logger.info("Batch Ready")
    logger.info("Batch Started")
    start()
