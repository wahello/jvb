from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.core.urlresolvers import reverse

from .serializers import UserDailyInputSerializer
from quicklook.calculation_helper import create_quick_look
from .custom_signals import user_input_post_save,user_input_notify

@receiver(user_input_post_save, sender=UserDailyInputSerializer)
def create_or_update_quicklook(sender, **kwargs):
	request = kwargs.get('request')
	dt = kwargs.get('dt').strftime("%Y-%m-%d")
	# create_quick_look(request.user, dt)


@receiver(user_input_notify, sender=UserDailyInputSerializer)
def notify_admins(sender,instance=None, created=False,**kwargs):
	'''
		Send email to all the admin users with the admin link to 
		newly created instance
	'''
	if created:
		request = kwargs.get('request')
		admin_users_email = [u.email for u in User.objects.filter(is_staff=True)]
		info = (instance._meta.app_label, instance._meta.model_name)
		instance_admin_url = request.build_absolute_uri('/').strip("/")+\
							 reverse('admin:%s_%s_change' % info, args=(instance.pk,))
		message = """
Hi there,

User {} ({}) has submitted new user inputs for {}. 
Please click following link to access it - 
{}

If clicking the link above doesn't work, please copy and paste the URL in a new browser
window instead.

Sincerely,

JVB Health & Wellness   
 """
		message = message.format(
			instance.user.first_name+" "+instance.user.last_name,
			instance.user.username,
			instance.created_at.strftime("%b %d, %Y"),
			instance_admin_url
		)

		if admin_users_email:
			send_mail(
				subject="New User Input",
				message = message,
				from_email = "saumyag@s7inc.co",
				recipient_list = admin_users_email,
				fail_silently = True  
			)