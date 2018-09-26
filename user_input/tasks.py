from celery.decorators import task
from celery.utils.log import get_task_logger

from .email import (send_userinput_update_email,
		remind_sync_user_watch_shift1,remind_sync_user_watch_shift2,
		remind_selected_users_submit_user_input)#user_inputs_remind_emails,)



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


@task(name="remind_selected_users.submit_user__daily_input")
def remind_selected_users_submit_input():
	'''
		Celery task to send email to Synchronize watch for before 9:00 PM
	'''
	try:
		remind_selected_users_submit_user_input()
		logger.info("Sent email successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)


# @task(name="userinputs.remind_email")
# def remind_user_inputs_email():
# 	'''
# 		Celery task to send email to submits/updates user inputs
# 	'''
# 	try:
# 		user_inputs_remind_emails()
# 		logger.info("Sent email successfully")
# 	except Exception as e:
# 		logger.error(str(e),exc_info=True)



@task(name="remind_users_sync_watch_shift1")
def remind_users_sync_watch_day():
	'''
		Celery task to send email to Synchronize watch for before 9:00 AM
	'''
	try:
		remind_sync_user_watch_shift1()
		logger.info("Sent email successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)

@task(name="remind_users_sync_watch_shift2")
def remind_users_sync_watch_night():
	'''
		Celery task to send email to Synchronize watch for before 9:00 PM
	'''
	try:
		remind_sync_user_watch_shift2()
		logger.info("Sent email successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)



