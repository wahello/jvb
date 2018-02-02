import pytz
from datetime import datetime, timezone

from celery.decorators import task
from celery.utils.log import get_task_logger

from django.contrib.auth import get_user_model

from helpers.cumulative_helper import create_cumulative_instance

logger = get_task_logger(__name__)

@task(name="progress_analyzer.generate_cumulative_instances")
def generate_cumulative_instances():
	'''
		- Celery task to generate cumulative instances for pervious day all user
		- This job will automatically run at 12:01 AM America/New_York Timezone
		  and create cumulative sum for previous day. 

		  For example - If it is Feb 02, 2018 12:01 AM then it will create
		  cumulative sum instance for Feb 01, 2018. 
	'''
	today_utc = datetime.utcnow()
	NY_TZ = pytz.timezone('America/New_York')
	today_local = NY_TZ.localize(today_utc).astimezone(NY_TZ)
	yesterday = (today_local - timezone(days=1))
	yesterday_str = yesterday.strftime("%Y-%m-%d") 
	try:
		for user in get_user_model.objects.all():
			create_cumulative_instance(user,from_date=yesterday_str,to_date=yesterday_str)
			logger.info("Cumulative sum for user {} is generated successfully".format(user.username))
	except Exception as e:
		logger.error(str(e),exc_info=True)