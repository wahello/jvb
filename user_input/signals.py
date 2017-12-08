from django.contrib.auth.models import User
from django.dispatch import receiver
from django.core.urlresolvers import reverse

from .serializers import UserDailyInputSerializer
from quicklook.tasks import generate_quicklook
from .custom_signals import user_input_post_save,user_input_notify
from .tasks import notify_admins_task

@receiver(user_input_post_save, sender=UserDailyInputSerializer)
def create_or_update_quicklook(sender, **kwargs):
	request = kwargs.get('request')
	from_date = kwargs.get('from_date').strftime("%Y-%m-%d")
	to_date = kwargs.get('to_date').strftime("%Y-%m-%d")
	generate_quicklook.delay(request.user.id,from_date,to_date)


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