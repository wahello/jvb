from django.shortcuts import get_object_or_404

from celery.decorators import task
from celery.utils.log import get_task_logger
from leaderboard.helpers.leaderboard_helper import create_update_score
from django.contrib.auth import get_user_model

logger = get_task_logger(__name__)

@task(name="leaderboard.create_update_score")
def generate_score(user_id,from_date,to_date):
	'''
		Celery task to generate quick look for give 
		date range 
	'''
	try:
		user = get_object_or_404(get_user_model(), pk=user_id)
		create_update_score(user,from_date,to_date)
		logger.info("Score created/updated successfully")
	except Exception as e:
		logger.error(str(e),exc_info=True)