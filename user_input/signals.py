from datetime import datetime

from django.contrib.auth.models import User
from django.dispatch import receiver
from django.core.urlresolvers import reverse

from .serializers import UserDailyInputSerializer
from quicklook.tasks import generate_quicklook
from .custom_signals import user_input_post_save,user_input_notify
from .tasks import notify_admins_task
from progress_analyzer.tasks import set_pa_report_update_date
from hrr.tasks import create_only_hrrdata
from .models import DailyUserInputStrong

@receiver(user_input_post_save, sender=UserDailyInputSerializer)
def create_or_update_quicklook(sender, **kwargs):
	request = kwargs.get('request')
	from_date = kwargs.get('from_date')
	from_date_str = kwargs.get('from_date').strftime("%Y-%m-%d")
	to_date_str = kwargs.get('to_date').strftime("%Y-%m-%d")
	generate_quicklook.delay(request.user.id,from_date_str,to_date_str)
	if from_date != datetime.now().date():
		# if updated user input is not for today (some historical date) then
		# we have to update all the PA report from that date. So we need to record
		# this date in database and update PA later as a celery task
		set_pa_report_update_date.delay(
			request.user.id, 
			from_date_str
		)


@receiver(user_input_notify, sender=UserDailyInputSerializer)
def notify_admins(sender,instance=None, created=False,**kwargs):
	'''
		Send email to all the admin users with the admin link to 
		newly created instance or updated instance
	'''
	if instance:
		request = kwargs.get('request')
		admin_users_email = [u.email for u in User.objects.filter(is_staff=True)]
		info = (instance._meta.app_label, instance._meta.model_name)
		instance_admin_url = request.build_absolute_uri('/').strip("/")+\
						 reverse('admin:%s_%s_change' % info, args=(instance.pk,))

		instance_meta = {
			'first_name':instance.user.first_name,
			'last_name':instance.user.last_name,
			'username':instance.user.username,
			'created_at':instance.created_at.strftime("%b %d, %Y"),
			'instance_url':instance_admin_url,
			'created':created
		}

		notify_admins_task.delay(admin_users_email,instance_meta)

@receiver(user_input_post_save, sender=UserDailyInputSerializer)
def create_or_update_hrr(sender, **kwargs):
	request = kwargs.get('request')
	# obj = DailyUserInputStrong.objects.filter(
	# 	user_input__user=request.user,user_input__created_at=kwargs.get('to_date'))
	# print(obj,"user input object created or not")
	# from_date = kwargs.get('from_date')
	# from_date_str = kwargs.get('from_date').strftime("%Y-%m-%d")
	to_date_str = kwargs.get('to_date').strftime("%Y-%m-%d")
	# print(from_date_str,"from date")
	# print(to_date_str,"to date str")
	create_only_hrrdata.delay(request.user.id,to_date_str,to_date_str)
	