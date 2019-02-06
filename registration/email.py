from django.contrib.auth.models import User
from django.core.mail import EmailMessage

def user_email_confirmation(recipient_email,email_subject,email_body,notify_admins=False):
	
	admin_users_email = []
	if(notify_admins):
		admin_users_email = [u.email for u in User.objects.filter(is_staff=True)]

	if recipient_email:
		email_object = EmailMessage()
		email_object.subject = email_subject
		email_object.body = email_body
		email_object.from_email = "info@jvbwellness.com"
		email_object.to = recipient_email
		email_object.bcc = admin_users_email
		email_object.send()