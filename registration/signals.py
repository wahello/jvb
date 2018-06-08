from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from .views import UserCreate
from .custom_signals import post_registration_notify
from .email import user_email_confirmation
from .tasks import notify_users_task
# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()

@receiver(post_save, sender=User)
def init_new_user(sender, instance=None, created=False, **kwargs):
	if created:
		Token.objects.create(user=instance)

@receiver(post_registration_notify,sender=UserCreate)
def notify_users(sender, **kwargs):
	email_address = kwargs.get('email_address')
	notify_users_task.delay(email_address)
