from datetime import datetime

import pytz

from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage

from garmin.management.commands.validategarmintoken import _validate_token

def send_email(report, recipients):
	# recipients is a list of all recipients
	if recipients and report:
		with open(report.name,'r') as fh: 
			mail = EmailMessage()
			mail.subject = "Invalid Garmin Token | Daily Log"
			mail.body = "List of users who have invalid/no Garmin Health token."
			mail.to = recipients
			mail.attach(fh.name, fh.read(), "text/plain")
			mail.send()

def validate_garmin_tokens(recipients):
	invalid_token_users = []
	no_token_user = []
	for user in get_user_model().objects.all():
		token_status = _validate_token(user.email,{'api':'health'})
		if token_status['status'] == "error" and token_status['have_token']:
			invalid_token_users.append(user.username)
		if token_status['status'] == "error" and not token_status['have_token']:
			no_token_user.append(user.username)
	if invalid_token_users or no_token_user:
		today = pytz.utc.localize(datetime.utcnow())
		filename = "invalid_garmin_health_token_%s.txt"%today.strftime("%Y-%m-%dT%H:%M")
		fh = open(filename,'a+')
		fh.write("Log Date: {}\n\n".format(today.isoformat()))
		if invalid_token_users:
			fh.write("Following users have invalid Garmin Health token - \n")
			fh.write(",".join(invalid_token_users))
			fh.write("\n\n")
		if no_token_user:
			fh.write("Following users have no Garmin Health token -\n")
			fh.write(",".join(no_token_user))
			fh.write("\n")
		fh.close()
		send_email(fh,recipients)