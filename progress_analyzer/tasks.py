import pytz
from datetime import datetime, timedelta

from celery.decorators import task
from celery.utils.log import get_task_logger

from django.contrib.auth import get_user_model

from progress_analyzer.helpers.cumulative_helper import create_cumulative_instance

logger = get_task_logger(__name__)

@task(name="progress_analyzer.generate_cumulative_instances")
def generate_cumulative_instances():
	'''
		- Celery task to generate cumulative instances for pervious day all user
		- This job will automatically run at 1:00 AM America/New_York Timezone
		  and create cumulative sum for previous day. 

		  For example - If it is Feb 02, 2018 12:01 AM then it will create
		  cumulative sum instance for Feb 01, 2018. 
	'''
	today_utc = datetime.now()
	NY_TZ = pytz.timezone('America/New_York')
	today_local = pytz.utc.localize(today_utc).astimezone(NY_TZ)
	yesterday = (today_local - timedelta(days=1))
	yesterday_str = yesterday.strftime("%Y-%m-%d") 
	try:
		for user in get_user_model().objects.all():
			create_cumulative_instance(user,from_dt=yesterday_str,to_dt=yesterday_str)
			logger.info("Cumulative sum for user {} is generated successfully".format(user.username))
	except Exception as e:
		logger.error(str(e),exc_info=True)

@task(name="progress_analyzer.generate_cumulative_instances_custom_range")
def generate_cumulative_instances_custom_range(user_id,from_date, to_date):
	'''
		Celery task to generate cumulative instances for any custom date
	'''
	try:
		user = get_user_model().objects.get(id=user_id)
		create_cumulative_instance(user,from_dt=from_date,to_dt=to_date)
		logger.info("Cumulative sum for user {} is generated successfully".format(user.username))
	except Exception as e:
		logger.error(str(e),exc_info=True)