from celery.decorators import task
from celery.utils.log import get_task_logger

from .garmin_push import store_garmin_health_push
from .custom_signals import garmin_post_save

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