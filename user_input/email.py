import pytz
from django.core.mail import send_mail
from datetime import datetime,time,date,timedelta
from user_input.models import UserDailyInput
from garmin.models import UserLastSynced


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
	distinct_offsets = set(q['offset'] for q 
		in UserLastSynced.objects.values('offset'))
	offsets_in_local_time = []
	for offset in distinct_offsets:
		offset_localtime = (datetime.utcnow()+timedelta(seconds=offset))
		if offset_localtime.hour == email_timing.hour:
			offsets_in_local_time.append(offset)
	if filter_username:
		users_with_offset_in_local_time = UserLastSynced.objects.filter(
			offset__in = offsets_in_local_time,
			user__username__in = filter_username).select_related('user')
	else:
		users_with_offset_in_local_time = UserLastSynced.objects.filter(
			offset__in = offsets_in_local_time).select_related('user')

	return users_with_offset_in_local_time

# remind selected users to submit UserDailyInput
def notify_user_to_submit_userinputs():
	RECEPIENTS_USERNAME = ["johnb",'pw',"Michelle","Brenda","BrookPorter",
		"cherylcasone","knitter61","lafmaf123","davelee","Justin","lalancaster",
		"MikeC","missbgymnast","squishyturtle24","yossi.leon@gmail.com",
		"atul","jvbhealth","Jvbtest"]
	# RECEPIENTS_USERNAME = ["dileep",'narendra','venky']

	# Local time at which email notification should be sent to the user
	# 10 PM local time
	EMAIL_TIMING = time(22)

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
Thanks and let us know if you have any questions by emailing mailto:{} 

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