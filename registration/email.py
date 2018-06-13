from django.core.mail import send_mail

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

	if user_mail:
		send_mail(
			subject="Welcome to JVB Health & Wellness!",
			message=contact_message,
			from_email="info@jvbwellness.com",
			recipient_list=[user_mail],
			fail_silently=True
		)