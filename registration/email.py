from django.core.mail import send_mail
def user_email_confirmation(user_mail):
	contact_message = (
		"Registration Successfully Completed"
		)
	if user_mail:
		send_mail(
				subject="test",
				message=contact_message,
				from_email="info@jvbwellness.com",
				recipient_list=[user_mail],
				fail_silently=True
			)

