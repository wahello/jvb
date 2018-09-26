from celery.decorators import task
from celery.utils.log import get_task_logger

from .email import (send_userinput_update_email,
	notify_user_to_submit_userinputs)



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


@task(name="userinputs.submit_userinput_reminder")
def remind_selected_users_submit_input():
	'''
		Celery task to send email to users to submit user
		input form at 10:00 pm NY time
	'''
	try:
		notify_user_to_submit_userinputs()
		logger.info("Sent email to notify user to submit user inputs successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)