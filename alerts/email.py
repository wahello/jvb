from django.core.mail import send_mail



def notify_user_movement_consistency_steps(user_email,user_firstname,activity_steps,current_hour,offset_localtime):
	subject = '{} Steps | {} to {} today'.format(activity_steps,current_hour,offset_localtime)
	FEEDBACK_EMAIL = "info@jvbwellness.com"
	message = '''
Hi {},

You have only {} steps from {} to {}. Get up and move! We encourage you to get 300 steps an hour, which only takes between 3 and 5 minutes of walking around.  
Make it happen!  Those  that move 300 steps an hour or more feel much less stiff, have more energy, improve bloodwork results, reduce injury risk, and live longer (to name a few things)!

Move, Move, Move!!!

Sincerely,
JVB Health & Wellness Team 
'''			
	message = message.format(user_firstname,activity_steps,current_hour,offset_localtime)
	send_mail(
					subject = subject,
					message = message,
					from_email = FEEDBACK_EMAIL,
					recipient_list = [user_email],
					fail_silently = True  
				)