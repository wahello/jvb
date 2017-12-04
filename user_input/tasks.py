from celery.decorators import task
from celery.utils.log import get_task_logger

from .email import send_userinput_update_email

logger = get_task_logger(__name__)

@task(name="userinputs.email")
def notify_admins_task(admin_users_email,instance_meta):
	'''
		Celery task to send email when user successfully 
		submits/updates user inputs
	'''
	try:
		send_userinput_update_email(admin_users_email,instance_meta)
		logger.info("Sent email successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)
