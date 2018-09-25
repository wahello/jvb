from django.core.mail import send_mail
from django.contrib.auth.models import User
from datetime import datetime,time,date,timezone,timedelta
from garmin.models import UserLastSynced
from django.db.models import Q
from user_input.models import UserDailyInput


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

#Reminding Users to Submit DailyInputForm
def user_inputs_remind_emails():
	feed_back_email="info@jvbwellness.com"
	static_url="https://app.jvbwellness.com/"
	all_users=User.objects.all()
	input_users_data=UserDailyInput.objects.filter(created_at=date.today())
	input_users_name=[input_users_data[index].user for index in range(
		len(input_users_data)) ]
	for user in range(len(all_users)):
		input_users_data_created=UserDailyInput.objects.filter(user=all_users[user]).last()
		if not all_users[user] in input_users_name:
			if input_users_data_created:
				message= """
Hi {},

We noticed that you have not submitted your user inputs today {}, your last submission on {}. Click on the link below to submit them.

{}userinputs

If clicking the link above doesn't work, please copy and paste the URL into a new browser window instead.
Thanks and let us know if you have any questions by emailing mailto:{} 

Sincerely,
JVB Health & Wellness   
					"""
				remind_users_email=[all_users[user].email]
				input_users_data_last_created_on=input_users_data_created.created_at 
				if input_users_data_last_created_on == date.today()-timedelta(days = 1):
					input_users_data_last_created="Yesterday"
				else:
					input_users_data_last_created=input_users_data_last_created_on
				message=message.format(all_users[user].username,date.today(),input_users_data_last_created,static_url,feed_back_email)
				if remind_users_email:
					send_mail(
					subject="Reminder To Submit UserInput" ,
					message = message,
					from_email = feed_back_email,
					recipient_list = remind_users_email,
					fail_silently = True  
					)
			else:
				message= """
Hi {},
We noticed that you have not started to submit your user inputs. Click on the link below to submit them.

{}userinputs

Thanks and let us know if you have any questions by emailing mailto:{} 

Sincerely,
JVB Health and Wellness
				"""
				remind_users_email=[all_users[user].email]
				message=message.format(all_users[user].username,static_url,feed_back_email)
				if remind_users_email:
					send_mail(
						subject="Reminder To Submit UserInput" ,
						message = message,
						from_email = feed_back_email,
						recipient_list = remind_users_email,
						fail_silently = True
						)


# Reminding Users to Synchronize watch
def remind_sync_user_watch_shift1():

	feed_back_email="info@jvbwellness.com"
	date_today=date.today()
	all_users=User.objects.all()
	users_sync_data=UserLastSynced.objects.filter(Q(last_synced__gte=datetime(
		date_today.year,date_today.month,date_today.day,0,0,0))&
		Q(last_synced__lte=datetime.now()))
	
	users_sync_name=[users_sync_data[name].user for name in range(len(users_sync_data))]
	
	for user in range(len(all_users)):
		users_sync_data_last=UserLastSynced.objects.filter(user=all_users[user]).last()
		
		if not all_users[user] in users_sync_name:
			if users_sync_data_last:
				remind_users_sync_emails=[all_users[user].email]
				message="""
Hi {},

We noticed that you have not synchronized your watch today {}, your last synchronisation on {} at {}.

Thanks and let us know if you have any questions by emailing mailto:{} 

Sincerely,
JVB Health and Wellness
				"""
				message=message.format(all_users[user].username,datetime.today(),users_sync_data_last.last_synced.date(),users_sync_data_last.last_synced.time(),feed_back_email)
				if remind_users_sync_emails:
					send_mail(
					subject="Reminder To Synchronize Watch" ,
					message = message,
					from_email = "info@jvbwellness.com",
					recipient_list = remind_users_sync_emails,
					fail_silently = True  
					)
			else:
				message= """
Hi {},

We noticed that you have not started to synchronize your watch.

Thanks and let us know if you have any questions by emailing mailto:{} 

Sincerely,
JVB Health and Wellness
				"""
				remind_users_email=[all_users[user].email]
				message=message.format(all_users[user].username,feed_back_email)
				if remind_users_email:
					send_mail(
						subject="Reminder To Synchronize Watch" ,
						message = message,
						from_email = "info@jvbwellness.com",
						recipient_list = remind_users_email,
						fail_silently = True
						)

def remind_sync_user_watch_shift2():

	feed_back_email="info@jvbwellness.com"
	date_today=date.today()
	all_users=User.objects.all()
	users_sync_data=UserLastSynced.objects.filter(Q(last_synced__gte=datetime(
		date_today.year,date_today.month,date_today.day,9,0,0))&
		Q(last_synced__lte=datetime.now()))
	
	users_sync_name=[users_sync_data[name].user for name in range(len(users_sync_data))]
	
	for user in range(len(all_users)):
		users_sync_data_last=UserLastSynced.objects.filter(user=all_users[user]).last()
		if not all_users[user] in users_sync_name:
			if users_sync_data_last:
				remind_users_sync_emails=[all_users[user].email]
				message="""
Hi {},

We noticed that you have not synchronized your watch today {}, your last synchronisation on {} at {}.

Thanks and let us know if you have any questions by emailing mailto:{} 

Sincerely,
JVB Health and Wellness
				"""
				message=message.format(all_users[user].username,date.today(),users_sync_data_last.last_synced.date(),users_sync_data_last.last_synced.time(),feed_back_email)
				if remind_users_sync_emails:
					send_mail(
					subject="Reminder To Synchronize Watch" ,
					message = message,
					from_email = "info@jvbwellness.com",
					recipient_list = remind_users_sync_emails,
					fail_silently = True  
					)
			else:
				message= """
Hi {},

We noticed that you have not started to synchronize your watch.

Thanks and let us know if you have any questions by emailing mailto:{} 

Sincerely,
JVB Health and Wellness
				"""
				remind_users_sync_email=[all_users[user].email]
				message=message.format(all_users[user].username,feed_back_email)
				if remind_users_sync_email:
					send_mail(
						subject="Reminder To Synchronize Watch" ,
						message = message,
						from_email = "info@jvbwellness.com",
						recipient_list = remind_users_email,
						fail_silently = True
						)