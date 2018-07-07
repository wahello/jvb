from datetime import datetime, timedelta
import json
from celery.decorators import task
from celery.utils.log import get_task_logger
from .fitbit_push import call_push_api



logger = get_task_logger(__name__)


@task(name="fitbit.store_health_data")
def store_fitbit_data(data):
	'''
		Celery task to store fitbit health data into db
	'''
	try:
		call_push_api(data)
		logger.info("Stored fitbit data successfully")

	except Exception as e:
		message = """
Storing fitbit data failed
REQUEST DATA :{}
ERROR MESSAGE:{}"""
		logger.error(message.format(data,str(e)), exc_info=True)
