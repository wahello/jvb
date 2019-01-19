from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from .views import UserCreate
from .custom_signals import post_registration_notify
from .tasks import notify_users_task
from .models import Invitation

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()

@receiver(post_save, sender=User)
def init_new_user(sender, instance=None, created=False, **kwargs):
	if created:
		Token.objects.create(user=instance)

@receiver(post_registration_notify,sender=UserCreate)
def notify_users_registration_success(sender, **kwargs):
	recipient_email = kwargs.get('email_address')
	username = kwargs.get('username')
	first_name = kwargs.get('first_name')

	email_body = '''
Hi {},

Thank you for registering on JVB Health and Wellness. Your account details are following - 
Username - {}

Please click the following link to login your account -
https://app.jvbwellness.com

If clicking the link above doesn't work, please copy and paste the URL in a new browser window instead.

Sincerely,
JVB Health & Wellness'''  
		
	email_body = email_body.format(
		first_name.title(),
		username
	)

	email_subject = "Welcome to JVB Health & Wellness!"

	notify_users_task.delay(recipient_email,email_subject,email_body,notify_admins=True)

@receiver(post_save, sender=Invitation)
def notify_user_invitation(sender, instance=None, created=False,**kwargs):
	if created and instance:
		recipient_email = instance.email
		email_subject = "You have been invited to join the JVB Health & Wellness app"
		email_body = '''
Hi,

You have been invited to join the JVB Health & Wellness app. Please click the following link to create an account -

https://app.jvbwellness.com/register

If clicking the link above doesn't work, please copy and paste the URL in a new browser window instead.

Note: This invitation was intended for {}. If you were not expecting this invitation, you can ignore this email. 

Sincerely,
JVB Health & Wellness'''

		email_body = email_body.format(recipient_email)
		notify_users_task.delay(recipient_email,email_subject,email_body,notify_admins=True)