from celery.decorators import task
from celery.utils.log import get_task_logger
from .calculation_helper import create_quick_look

logger = get_task_logger(__name__)

@task(name="quicklook.create_quicklook")
def generate_quicklook(user,from_date,to_date):
	'''
		Celery task to generate quick look for give 
		date range 
	'''
	try:
		create_quick_look(user,from_date,to_date)
		logger.info("Quick look generated successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)