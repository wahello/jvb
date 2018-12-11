from datetime import datetime
from django.contrib.auth.models import User

from celery.decorators import task
from celery.utils.log import get_task_logger

from hrr.views import hrr_calculations,\
						store_hhr,\
						store_daily_aa_calculations,\
						store_aa_low_high_end_calculations,\
						store_aa_workout_calculations,\
						store_aa_calculations,\
						add_date_to_fitfile

logger = get_task_logger(__name__)

@task(name="hrr.save_hrr_data")
def create_hrrdata(user_id,from_date,to_date):
		user = User.objects.get(id = user_id)
		#start_date = datetime(2018,8,5,0,0,0)
		#from_date = start_date.strftime("%Y-%m-%d")
		#to_date = from_date
		try:
			store_hhr(user,from_date,to_date)
		except Exception as e:	
			logger.error(e,exc_info=True)
		try:
			store_daily_aa_calculations(user,from_date,to_date)
		except Exception as e:	
			logger.error(e,exc_info=True)
		try:
			store_aa_low_high_end_calculations(user,from_date,to_date)
		except Exception as e:	
			logger.error(e,exc_info=True)
		try:
			store_aa_workout_calculations(user,from_date,to_date)
		except Exception as e:	
			logger.error(e,exc_info=True)
		try:
			store_aa_calculations(user,from_date,to_date)
		except Exception as e:	
			logger.error(e,exc_info=True)

@task(name="hrr.save_only_hrr_data")
def create_only_hrrdata(user_id,from_date,to_date):
	try:
		user = User.objects.get(id = user_id)
		# start_date = datetime(2018,7,10,0,0,0)
		# from_date = start_date.strftime("%Y-%m-%d")
		# to_date = from_date
		store_hhr(user,from_date,to_date)
	except Exception as e:
		logger.error(e,exc_info=True)

@task(name="hrr.add_date_to_fitfile")
def add_date_to_fitfile_celery():
	print("Entered into the Fitfile celery perodic task")
	try:
		add_date_to_fitfile()
	except Exception as e:
		logger.error(e,exc_info=True)

