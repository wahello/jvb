from datetime import datetime, timedelta
import json

from celery.decorators import task
from celery.utils.log import get_task_logger

from .garmin_push import store_garmin_health_push
from .models import GarminPingNotification
from .routine_jobs.garmin_token_validator import validate_garmin_tokens

logger = get_task_logger(__name__)

@task(name="garmin.store_health_data")
def store_health_data(data):
	'''
		Celery task to store garmin health data into db
	'''
	try:
		store_garmin_health_push(data)
		logger.info("Stored health data successfully")

	except Exception as e:
		message = """
Storing health data failed
REQUEST DATA :{}
ERROR MESSAGE:{}"""
		logger.error(message.format(data,str(e)), exc_info=True)


@task(name="garmin.retry_failed_ping_notification")
def retry_failed_ping_notification():
	'''
		Celery task to retry all the failed ping notification
		for yesterday day (UTC)
	'''
	yesterday_utc = datetime.now()-timedelta(days=1)
	failed_ping_notification_today = GarminPingNotification.objects.filter(
		state = "failed",
		created_at__date = yesterday_utc.date()
	)
	for notif in failed_ping_notification_today:
		try:
			notif_data = {notif.summary_type:[json.loads(notif.notification)]}
			store_garmin_health_push(notif_data,notif)
			logger.info("Stored health data successfully")
		except Exception as e:
			message = "Retry failed for {}'s ping notification of type '{}'' whose upload start time is '{}'"
			message = message.format(notif.user.username,notif.summary_type,notif.upload_start_time_seconds)
			logger.error(message,str(e),exc_info=True)

@task(name="garmin.validate_garmin_health_token")
def validate_garmin_health_token():
	'''
		Celery task to check for invalid garmin health tokens
		Runs everyday at 5 am NY Timezone 
	'''
	try:
		recipients = ['atulk@s7works.io','saumyag@s7works.io','jim@jvbwellness.com']
		validate_garmin_tokens(recipients)
		logger.info("Check for invalid garmin health token succeeded")

	except Exception as e:
		message = "Check for invalid garmin health token failed"
		logger.error(message.format(str(e)), exc_info=True)