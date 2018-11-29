import ast
from datetime import datetime,date,time,timedelta
from django.contrib.auth.models import User
from garmin.models import UserLastSynced
from quicklook.models import Steps
from alerts.email import notify_user_movement_consistency_steps

# elif activity_hour == offset_localtime.hour and key[6:8] == 'PM'

def determine_user_steps():
	selected_users = ['jvbhealth','dileep','atul']
	# selected_users = ['venky','norm','pavan','dileep']
	RECEPIENT_USERS = User.objects.filter(username__in=selected_users)
	notify_time = []
	for times in range(7,23):
		notify_time.append(time(times,30).strftime('%I:%M %p'))
	for user in RECEPIENT_USERS:
		user_firstname = user.first_name
		user_email = user.email
		user_offset = [q['offset'] for q in UserLastSynced.objects.filter(
			user__username=user.username).values('offset')]
		offset_localtime = (datetime.utcnow()+timedelta(seconds=user_offset[0]))
		steps_obj = Steps.objects.filter(
			user_ql__user=user,user_ql__created_at=date.today()).values('movement_consistency')
		if steps_obj:
			steps_dict = ast.literal_eval(steps_obj[0]['movement_consistency'])
			activity_hour=None
			for key,value in steps_dict.items():				
				present_time = offset_localtime.strftime('%I:%M %p')
				if key[6:8] == 'AM':
					morning_hour=int(key[:2])
					if morning_hour == 12:
						morning_hour -= 12
					if (morning_hour == offset_localtime.hour and value['status']!='no data yet'
					 and value['steps']<=300): 
						activity_hour = time(morning_hour).strftime('%I:%M %p')
						activity_steps = value['steps']
				elif key[6:8] == 'PM':
					noon_hour=int(key[:2]) + 12
					if noon_hour ==  24 :
						noon_hour -= 12
					if (noon_hour == offset_localtime.hour and value['status']!='no data yet'
					and value['steps']<=300): 
						activity_hour = time(noon_hour).strftime('%I:%M %p')
						activity_steps = value['steps']
			if activity_hour and (present_time in notify_time):
				notify_user_movement_consistency_steps(user_email,user_firstname,activity_steps,\
					activity_hour,present_time)	
				
