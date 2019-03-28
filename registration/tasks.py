from celery.decorators import task
from celery.utils.log import get_task_logger

from .email import user_email_confirmation

logger = get_task_logger(__name__)

@task(name="registration.email")
def notify_users_task(recipient_email,email_subject,email_body,notify_admins=False):
	'''
		Celery task to send email when user successfully 
		registered on the app
	'''
	try:
		user_email_confirmation(
			recipient_email,email_subject,email_body,notify_admins)
		logger.info("Sent email successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)