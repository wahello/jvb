from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserDataBackfillRequest
from registration.tasks import notify_users_task

@receiver(post_save,sender=UserDataBackfillRequest)
def user_data_backfill_request_notify(sender,instance=None, created=False,**kwargs):
	if instance:
		admin_users_email = [u.email for u in User.objects.filter(is_staff=True)]
		user = instance.user
		device_type = instance.device_type
		start_date = instance.start_date
		end_date = instance.end_date
		email_subject = "User Backfill Data Request Notification"
		email_body = '''
Hi there,

User {} has requested to backfill {} historical data from {} to {}

Sincerely,
JVB Health & Wellness'''  
				
		email_body = email_body.format(
			user,device_type.upper(),start_date.strftime('%b %d, %Y'),end_date.strftime('%b %d, %Y')
		)

		notify_users_task.delay(admin_users_email,email_subject,email_body,notify_admins=False)