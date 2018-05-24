# -*- coding: utf-8 -*-
from datetime import datetime
import pytz

from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage

from progress_analyzer.helpers.helper_classes import ProgressReport

def str_to_dt(dt_str):
	if dt_str:
		return datetime.strptime(dt_str,"%Y-%m-%d")
	else:
		return None

def stringfy_error_objects(username,error_objs):
	error_str = """User '{}' has the following negative values - \n""".format(username)
	for obj in error_objs:
		estr = "Summary Type: {} | Field Name: {} | Duration: {} | Value: {}\n"
		estr = estr.format(
			obj['summary'],obj['field'], obj['duration'], obj['value']
		)
		error_str += estr
	return error_str

def prepare_report(users_having_negative_pa,for_date,check_start_time,check_end_time):
	file_name = "pa-log-{}.txt".format(check_start_time.strftime("%Y-%m-%dT%H:%M"))
	fh = open(file_name,'+a')
	fh.write("Check Start Time: {}\n".format(check_start_time.isoformat()))
	fh.write("Check End Time: {}\n".format(check_end_time.isoformat()))
	fh.write("PA Report is for: {}\n".format(for_date))
	fh.write("\n\n")
	for username,error_objs in users_having_negative_pa.items():
		error_str = stringfy_error_objects(username,error_objs)
		fh.write(error_str)
		fh.write("\n\n")
	fh.close()
	return fh

def check_negative_numbers(pa_data):
	# ignore custom ranges
	fields_with_negative_number = []
	for summary_type,summary_data in pa_data['summary'].items():
		for field_type, field_data in summary_data.items():
			for duration_type, avg_data in field_data.items():
				if (type(avg_data) is int or type(avg_data) is float) and avg_data < 0:
					# negative number detected
					error_obj = {
						"summary":summary_type,
						"field":field_type,
						"duration":duration_type,
						"value":avg_data
					}
					fields_with_negative_number.append(error_obj)
	return fields_with_negative_number

def send_email(report, recipients):
	# recipients is a list of all recipients
	if recipients and report:
		with open(report.name,'r') as fh: 
			mail = EmailMessage()
			mail.subject = "Negative Number Alert | Hourly Logs"
			mail.body = ""
			mail.to = recipients
			mail.attach(fh.name, fh.read(), "text/plain")
			mail.send()
	

def generate_incorrect_pa_report(recipients,for_date=None):
	check_start_time = pytz.utc.localize(datetime.utcnow())
	if not for_date:
		for_date = pytz.utc.localize(datetime.utcnow())
	else:
		for_date = str_to_dt(for_date)
	users_having_negative_pa = {}
	for user in get_user_model().objects.all():
		query_params = {"date":for_date.strftime("%Y-%m-%d")}
		pa_data = ProgressReport(user,query_params).get_progress_report()
		meta = check_negative_numbers(pa_data)
		if meta:
			users_having_negative_pa[user.username] = meta
	check_end_time = pytz.utc.localize(datetime.utcnow())
	if users_having_negative_pa:
		report = prepare_report(users_having_negative_pa,for_date,
			check_start_time, check_end_time)
		
		send_email(report,recipients)