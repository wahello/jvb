from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .views import UserBackfillRequestView
from .models import UserDataBackfillRequest
from django.core.mail import send_mail

@receiver(post_save,sender=UserDataBackfillRequest)
def user_data_backfill_request_notify(sender,instance=None, created=False,**kwargs):
	#print(kwargs)
	if instance:
		#print("Singal 2 triggered")
		
		#print(request)	
		admin_users_email = [u.email for u in User.objects.filter(is_staff=True)]
		user = instance.user
		device_type = instance.device_type
		start_date = instance.start_date
		end_date = instance.end_date
		status = instance.status
		email_subject = "User Backfill Data Request Notification"
		email_body = '''
Hi there,

User {} has requested to backfill {} historical data from {} to {}

Sincerely,
JVB Health & Wellness'''  
				
		email_body = email_body.format(
			user,device_type.upper(),start_date.strftime('%b %d, %Y'),end_date.strftime('%b %d, %Y')
		)

		send_mail(
		 	subject=email_subject,
			message = email_body,
			from_email = "info@jvbwellness.com",
			recipient_list = admin_users_email,
			fail_silently = True  
		 	)