from django.core.mail import send_mail



def notify_user_movement_consistency_steps(user_email,user_firstname,activity_steps,current_hour,offset_localtime):
	subject = 'Steps Consistency | {} to {}'.format(current_hour,offset_localtime)
	FEEDBACK_EMAIL = "info@jvbwellness.com"
	message = '''
Hi {},
You have only {} steps from {} to {} which is not good for improve of health please make more moment of steps for better health.

Sincerely,
JVB Health & Wellness 
'''			
	message = message.format(user_firstname,activity_steps,current_hour,offset_localtime)
	send_mail(
					subject = subject,
					message = message,
					from_email = FEEDBACK_EMAIL,
					recipient_list = [user_email],
					fail_silently = True  
				)