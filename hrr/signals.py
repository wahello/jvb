from datetime import datetime

from django.dispatch import receiver
from django.db.models.signals import post_save

from .models import Hrr
from progress_analyzer.tasks import set_pa_report_update_date

@receiver(post_save, sender=Hrr)
def set_pa_update_date(sender,instance,created,**kwargs):
	if(not created):
		# if HRR is updated
		user_id = instance.user_hrr.id
		from_date = instance.created_at
		from_date_str = str(from_date)
		if from_date != datetime.now().date():
			# if updated user input is not for today (some historical date) then
			# we have to update all the PA report from that date. So we need to record
			# this date in database and update PA later as a celery task
			set_pa_report_update_date.delay(
				user_id,
				from_date_str
			)