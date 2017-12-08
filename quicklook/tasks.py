from django.shortcuts import get_object_or_404

from celery.decorators import task
from celery.utils.log import get_task_logger
from .calculation_helper import create_quick_look
from django.contrib.auth.models import User

logger = get_task_logger(__name__)

@task(name="quicklook.create_quicklook")
def generate_quicklook(user_id,from_date,to_date):
	'''
		Celery task to generate quick look for give 
		date range 
	'''
	try:
		user = get_object_or_404(User, pk=user_id)
		create_quick_look(user,from_date,to_date)
		logger.info("Quick look generated successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)