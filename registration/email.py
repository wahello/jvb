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

	if user_mail:
		email_object = EmailMessage(
			"Welcome to JVB Health & Wellness!",
			contact_message,
			"info@jvbwellness.com",
			[user_mail],
			cc = ["ramya@s7works.io"],
			bcc = ["swapna2495@gmail.com"]
		)
		email_object.send()