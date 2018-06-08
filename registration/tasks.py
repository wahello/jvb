from celery.decorators import task
from celery.utils.log import get_task_logger

from .email import user_email_confirmation

logger = get_task_logger(__name__)

@task(name="registration.email")
def notify_users_task(user_mail):
	'''
		Celery task to send email when user successfully 
		submits/updates user inputs
	'''
	try:
		user_email_confirmation(user_mail)
		logger.info("Sent email successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)