from celery.decorators import task
from celery.utils.log import get_task_logger
from .steps import determine_user_steps

logger = get_task_logger(__name__)

@task(name="mcsteps.email")
def notify_users_mcs():
	'''
		Celery task to send email to users for movement consistency 
		steps for  every hour at 30 mins 
	'''
	try:
		determine_user_steps()
		logger.info("Sent email to notify user for movement consisency steps successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)