import pytz
from django.core.mail import send_mail
from datetime import datetime,time,date,timedelta
from user_input.models import UserDailyInput
from quicklook.calculations.calculation_driver import which_device
from garmin.models import UserLastSynced
from fitbit.models import UserFitbitLastSynced


def send_userinput_update_email(admin_users_email,instance_meta):
	'''
		Send email to all the admin users with the admin link to 
		newly created instance
	'''
	
	message = """
Hi there,

User {} ({}) has {} user inputs for {}. Please click following link to access it -

{}

If clicking the link above doesn't work, please copy and paste the URL in a new browser
window instead.

Sincerely,

JVB Health & Wellness   
"""
	message = message.format(
		instance_meta['first_name']+" "+instance_meta['last_name'],
		instance_meta['username'],
		"submitted" if instance_meta['created'] else "updated",
		instance_meta['created_at'],
		instance_meta['instance_url']
	)

	if admin_users_email:
		send_mail(
			subject="New User Input" if instance_meta['created'] else "User Input Updated",
			message = message,
			from_email = "info@jvbwellness.com",
			recipient_list = admin_users_email,
			fail_silently = True  
		)
# returns the users,offsets which relates to user local_time
def get_users_having_local_time(email_timing,filter_username=None):
	'''
	Get the users infromation like local_time with their offsets 
	'''
	garmin_offsets = set(q['offset'] for q in UserLastSynced.objects.values('offset'))
	fitbit_offsets = set(q['offset'] for q in UserFitbitLastSynced.objects.values('offset'))
	garmin_offsets_in_local_time = []
	fitbit_offsets_in_local_time = []
	for offset in garmin_offsets:
		offset_localtime = (datetime.utcnow()+timedelta(seconds=offset))
		for time in email_timing:
			if offset_localtime.hour == time.hour:
				garmin_offsets_in_local_time.append(offset)
	for offset in fitbit_offsets:
		offset_localtime = (datetime.utcnow()+timedelta(seconds=offset))
		for time in email_timing:
			if offset_localtime.hour == time.hour:
				fitbit_offsets_in_local_time.append(offset)
	if filter_username:
		garmin_users = UserLastSynced.objects.filter(
			offset__in = garmin_offsets_in_local_time,
			user__username__in = filter_username).select_related('user')
		fitbit_users = UserFitbitLastSynced.objects.filter(
			offset__in = fitbit_offsets_in_local_time,
			user__username__in = filter_username).select_related('user')
	else:
		garmin_users = UserLastSynced.objects.filter(
			offset__in = garmin_offsets_in_local_time).select_related('user')
		fitbit_users = UserFitbitLastSynced.objects.filter(
			offset__in = fitbit_offsets_in_local_time).select_related('user')
	g_usernames = [g.user.username for g in garmin_users]
	f_usernames = [f.user.username for f in fitbit_users]
	
	users_with_offset_in_local_time = []
	if g_usernames:
		for g_user in garmin_users:
			if f_usernames and g_user.user.username in f_usernames:
				for f_user in fitbit_users:
					if f_user.user.username in g_usernames:
						if (g_user.user.username == f_user.user.username and 
						g_user.last_synced < f_user.last_synced_fitbit):
							users_with_offset_in_local_time.append(f_user)
						elif (g_user.user.username == f_user.user.username and 
						g_user.last_synced > f_user.last_synced_fitbit):
							users_with_offset_in_local_time.append(g_user)
					else:
						users_with_offset_in_local_time.append(f_user)		
			else:
				users_with_offset_in_local_time.append(g_user)
	elif f_usernames:
		users_with_offset_in_local_time.append(fitbit_users)
	users_with_offset_in_local_time = list(set(users_with_offset_in_local_time))
	return users_with_offset_in_local_time

# remind selected users to submit UserDailyInput
def notify_user_to_submit_userinputs():
	# RECEPIENTS_USERNAME = ["johnb",'pw',"Michelle","Brenda","BrookPorter",
	# 	"cherylcasone","knitter61","lafmaf123","davelee","Justin","lalancaster",
	# 	"MikeC","missbgymnast","squishyturtle24","yossi.leon@gmail.com",
	# 	"atul","jvbhealth","Jvbtest","Vickykolovou","samle"]
	RECEPIENTS_USERNAME = ["missbgymnast","squishyturtle24","jvbhealth",
	"Dileep",]
	# RECEPIENTS_USERNAME = ["dileep",'narendra','venky']

	# Local time at which email notification should be sent to the user
	# 10 PM local time
	EMAIL_TIMING = [time(22)]

	RECEPIENTS_WITH_OFFSET = get_users_having_local_time(
		EMAIL_TIMING,RECEPIENTS_USERNAME)
	FEEDBACK_EMAIL = "info@jvbwellness.com"
	ROOT_URL = "https://app.jvbwellness.com/"
	USER_INPUT_URL = ROOT_URL+"userinputs"
	last_userinput_of_users = {}
	for user_lsync in RECEPIENTS_WITH_OFFSET:
		user = user_lsync.user
		last_userinput_of_users[user.username] = {
			"last_ui":None,
			"user_email":user.email,
			"user_first_name":user.first_name,
			"user_offset":user_lsync.offset
		}
		try:
			last_userinput_of_users[user.username]["last_ui"] = (
				UserDailyInput.objects.filter(
				user = user).order_by('-created_at')[0])
		except (IndexError,UserDailyInput.DoesNotExist) as e:
			last_userinput_of_users[user.username]["last_ui"] = None

	for username,user_meta in last_userinput_of_users.items():
		if user_meta['last_ui']:
			today_utc = datetime.now()
			today_local_time = today_utc + timedelta(seconds = user_meta['user_offset'])
			last_ui = user_meta['last_ui']
			user_email = user_meta['user_email']
			user_first_name = user_meta['user_first_name']
			last_ui_date = datetime.combine(last_ui.created_at,time(0))
			message = """
Hi {},

We noticed that you have not submitted your user inputs {}. Click on the link below to submit them.

{}

If clicking the link above doesn't work, please copy and paste the URL into a new browser window instead.
Thanks and let us know if you have any questions by emailing {} 

Sincerely,
JVB Health & Wellness""" 
			submission_from_text = ""
			subject = "Submit User Inputs | {}"
			if last_ui_date.date() == (today_local_time-timedelta(days = 1)).date():
				submission_from_text = "today ({})".format(
					today_local_time.strftime("%b %d, %Y")
				)
				subject = subject.format(today_local_time.strftime("%b %d, %Y"))
			else:
				submission_from_text = "from {}".format(
					(last_ui_date+timedelta(days=1)).strftime("%b %d, %Y")
				)
				subject = subject.format(
					(last_ui_date+timedelta(days=1)).strftime("%b %d, %Y"))
			message = message.format(
				user_first_name.capitalize(),submission_from_text,
				USER_INPUT_URL,FEEDBACK_EMAIL
			)

			if last_ui_date.date() != today_local_time.date():
				send_mail(
					subject = subject,
					message = message,
					from_email = FEEDBACK_EMAIL,
					recipient_list = [user_email],
					fail_silently = True  
				)

# Reminding Users to Synchronize watch
def notify_users_to_sync_watch():

	# RECEPIENTS_USERNAME = ["johnb",'pw',"BrookPorter",
	# 	"Justin","lalancaster","MikeC","jvbhealth","Jvbtest",
	# 	"missbgymnast","squishyturtle24","Vickykolovou","samle"]
	RECEPIENTS_USERNAME = ["missbgymnast","squishyturtle24","jvbhealth",
	"Dileep",]
	# RECEPIENTS_USERNAME = ['venky','pavan','norm','mani','narendra']
	EMAIL_TIMING = [time(9),time(21)]
	RECEPIENTS_WITH_OFFSET = get_users_having_local_time(
		EMAIL_TIMING,RECEPIENTS_USERNAME)
	FEEDBACK_EMAIL = "info@jvbwellness.com"
	last_synced_of_users = {}
	for user_lsync in RECEPIENTS_WITH_OFFSET:
		user = user_lsync.user
		last_synced_of_users[user.username] = {
			"last_sync":None,
			"user_email":user.email,
			"user_first_name":user.first_name,
			"user_offset":user_lsync.offset
		}
		try:
			garmin_last_sync = UserLastSynced.objects.filter(user = user)
			fitbit_last_sync = UserFitbitLastSynced.objects.filter(user = user)
			if garmin_last_sync and fitbit_last_sync and garmin_last_sync[0].last_synced > fitbit_last_sync[0].last_synced_fitbit:
				last_synced_obj = [garmin_last_sync[0],"garmin"] 
			elif garmin_last_sync and fitbit_last_sync and garmin_last_sync[0].last_synced < fitbit_last_sync[0].last_synced_fitbit:
				last_synced_obj = [fitbit_last_sync[0],"fitbit"]
			elif garmin_last_sync:
				last_synced_obj = [garmin_last_sync[0],"garmin"]
			elif fitbit_last_sync:
				last_synced_obj = [fitbit_last_sync[0],"fitbit"]
			if last_synced_obj[1] == "garmin":
				last_sync_local_dtime = last_synced_obj[0].last_synced + timedelta(
					seconds=last_synced_obj[0].offset) 
			else:
				last_sync_local_dtime = last_synced_obj[0].last_synced_fitbit + timedelta(
					seconds=last_synced_obj[0].offset)
			last_synced_of_users[user.username]["last_sync"] = last_sync_local_dtime
		except (IndexError,UserLastSynced.DoesNotExist,UserFitbitLastSynced.DoesNotExist) as e:
			last_synced_of_users[user.username]["last_sync"] = None

	for username,user_meta in last_synced_of_users.items():
		if user_meta['last_sync']:
			today_utc = datetime.now()
			today_local_time = today_utc + timedelta(seconds = user_meta['user_offset'])
			last_sync = user_meta['last_sync']
			user_email = user_meta['user_email']
			user_first_name = user_meta['user_first_name']
			synchronize_from_text = "(since {})".format(
					last_sync.strftime("%b %d, %Y @ %I:%M %p"))
			subject = "Synchronize Watch | {}".format(
				last_sync.strftime("%b %d, %Y @ %I:%M %p"))
			message="""
Hi {},

We just noticed that you have not sync’d your wearable device in a while {}. If you want to see all your cool health and activity stats and rankings, sync your watch now.

Thanks and let us know if you have any questions by emailing {} 

Sincerely,
JVB Health and Wellness
"""
			message = message.format(
				user_first_name.capitalize(),synchronize_from_text,
				FEEDBACK_EMAIL
			)

			synced_in_past_4_hours = False
			notification_shift = 'evening' if today_local_time.hour > 11 else 'morning'
			if (notification_shift == 'evening' 
				and last_sync.hour >= 17 and last_sync.hour <= 21):
				synced_in_past_4_hours = True
			elif (notification_shift == 'morning'
				and (last_sync.hour >= 5 and last_sync.hour <= 9)):
				synced_in_past_4_hours = True

			if not(today_local_time.date() == last_sync.date() and
				synced_in_past_4_hours):
				send_mail(
					subject = subject,
					message = message,
					from_email = FEEDBACK_EMAIL,
					recipient_list = [user_email],
					fail_silently = True  
				)