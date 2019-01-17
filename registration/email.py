from django.contrib.auth.models import User
from django.core.mail import EmailMessage

def user_email_confirmation(user_mail,email_subject,email_body,notify_admins=False):
	
	admin_users_email = []
	if(notify_admins):
		admin_users_email = [u.email for u in User.objects.filter(is_staff=True)]

	if user_mail:
		email_object = EmailMessage()
		email_object.subject = email_subject
		email_object.body = email_body
		email_object.from_email = "info@jvbwellness.com"
		email_object.to = [user_mail]
		email_object.bcc = admin_users_email
		email_object.send()