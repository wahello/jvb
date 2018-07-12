from django.contrib.auth.models import User
from django.core.mail import EmailMessage

def user_email_confirmation(user_mail,username,first_name):
	
	contact_message = '''
Hi {},

Thank you for registering on JVB Health and Wellness. Your account details are following - 
Username - {}

Please click the following link to login your account -
https://app.jvbwellness.com

If clicking the link above doesn't work, please copy and paste the URL in a new browser window instead.

Sincerely,
JVB Health & Wellness'''  
		
	contact_message = contact_message.format(
		first_name.title(),
		username
	)
	admin_users_email = [u.email for u in User.objects.filter(is_staff=True)]

	if user_mail:
		email_object = EmailMessage()
		email_object.subject = "Welcome to JVB Health & Wellness!"
		email_object.body = contact_message
		email_object.from_email = "info@jvbwellness.com"
		email_object.to = [user_mail]
		email_object.bcc = admin_users_email
		email_object.send()