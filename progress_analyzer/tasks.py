import pytz
from datetime import datetime, timedelta

from celery.decorators import task
from celery.utils.log import get_task_logger

from django.contrib.auth import get_user_model

from progress_analyzer.helpers.cumulative_helper import (
	create_cumulative_instance,
	set_pa_bulk_update_start_date
)
from progress_analyzer.models import ProgressReportUpdateMeta
from progress_analyzer.log_reports.log_negative_figures import generate_incorrect_pa_report

logger = get_task_logger(__name__)

@task(name="progress_analyzer.generate_cumulative_instances")
def generate_cumulative_instances():
	'''
		- Celery task to generate cumulative instances for pervious day all user
		- This job will automatically run at 1:00 AM America/New_York Timezone
		  and create cumulative sum for previous day. 

		  For example - If it is Feb 02, 2018 01:00 AM then it will create
		  cumulative sum instance for Feb 01, 2018. 
	'''
	today_utc = datetime.now()
	NY_TZ = pytz.timezone('America/New_York')
	today_local = pytz.utc.localize(today_utc).astimezone(NY_TZ)
	yesterday = (today_local - timedelta(days=1))
	yesterday_str = yesterday.strftime("%Y-%m-%d") 
	for user in get_user_model().objects.all():
		try:
			create_cumulative_instance(user,from_dt=yesterday_str,to_dt=yesterday_str)
			logger.info("Cumulative sum for user {} is generated successfully".format(user.username))
		except Exception as e:
			logger.error(str(e),exc_info=True)


@task(name="progress_analyzer.update_obsolete_pa_reports")
def update_obsolete_pa_reports():
	'''
		- Celery task to update obsolete Progress Analyzer reports cause by 
		  update of raw report of older date
		- This job will automatically run at 2:00 AM America/New_York timezone 

		  For example - If reports have to be updated from Feb 11,2018 then all the
		  reports from Feb 11, 2018 to current day will be updated
	'''
	today_utc = datetime.now()
	NY_TZ = pytz.timezone('America/New_York')
	# IN_TZ = pytz.timezone('Asia/Calcutta')
	today_local = pytz.utc.localize(today_utc).astimezone(NY_TZ)
	yesterday = (today_local - timedelta(days=1))
	yesterday_str = yesterday.strftime("%Y-%m-%d") 
	for dates in ProgressReportUpdateMeta.objects.all():
		try:
			from_dt = dates.requires_update_from
			if from_dt:
				user = dates.user
				from_dt = from_dt.strftime("%Y-%m-%d")
				create_cumulative_instance(user,from_dt = from_dt,to_dt=yesterday_str)
				dates.requires_update_from = None
				dates.save()
				logger.info("Progress Analyzer reports for user {} from {} is updated"+
					"successfully".format(user.username,from_dt))
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


@task(name="progress_analyzer.set_pa_report_update_date")
def set_pa_report_update_date(user_id,from_date):
	'''
		Celery task to set the oldest date from which PA update is required for
		certain user 
	'''
	try:
		user = get_user_model().objects.get(id=user_id)
		set_pa_bulk_update_start_date(user,from_date)
		logger.info("Updated Progress Analyzer report update date for user {}".format(
				user.username
			)
		)
	except Exception as e:
		logger.error(str(e),exc_info=True)

@task(name="progress_analyzer.generate_log_incorrect_pa")
def generate_log_incorrect_pa():
	'''
		Celery task to routinely check for incorrect PA reports 
		(having negative numbers etc.)for every user and generate a log

		This job will be executed in every one hour 
	'''
	try:
		recipients = ['atulk@s7works.io','saumyag@s7works.io','jim@jvbwellness.com']
		generate_incorrect_pa_report(recipients)
		logger.info("Successfully generated log for incorrect Progress Analyzer reports")
	except Exception as e:
		logger.error(str(e),exc_info=True)