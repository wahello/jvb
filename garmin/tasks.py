from datetime import datetime
import json

from celery.decorators import task
from celery.utils.log import get_task_logger

from .garmin_push import store_garmin_health_push
from .models import GarminPingNotification

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
		in every 10 min for current day (UTC)
	'''
	today_utc = datetime.now()
	failed_ping_notification_today = GarminPingNotification.objects.filter(
		state = "failed",
		created_at__date = today_utc.date()
	)
	for notif in failed_ping_notification_today:
		try:
			notif_data = {notif.summary_type:[json.loads(notif.notification)]}
			store_garmin_health_push(notif_data)
			logger.info("Stored health data successfully")
		except Exception as e:
			message = "Retry failed for {}'s ping notification of type {} whose upload start time is {}"
			message.format(notif.user.username,notif.summary_type,notif.upload_start_time_seconds)
			logger.error(message,str(e),exc_info=True)