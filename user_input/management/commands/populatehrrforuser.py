from datetime import datetime
import logging

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

from hrr.views import hrr_data

logger = logging.getLogger(__name__)

def _str_to_datetime(str_date):
	y,m,d = map(int,str_date.split('-'))
	return datetime(y,m,d,0,0,0)

def _sec_to_min_sec_str(seconds):
	'''
	Convert seconds to minute seconds string
	
	Args:
		seconds (int): seconds

	Examples:
		>>> _str_to_datetime(140)
		"2:20"
	'''
	if seconds:
		mins,secs = divmod(seconds,60)
		if secs < 10:
			secs = "0{}".format(secs)
		return "{}:{}".format(mins,secs)
	return "0:00"

def populate_userinput_hrr(user,from_date, to_date):
	'''
	Populate older user inputs with calculated HRR data if not 
	already submitted by the user

	Args:
		user (:obj: `User`): A User object
		from_date (str): Date string representing start date from which update have to be done.
			Expected format is YYYY-MM-DD. For example - "2018-06-01"
		to_date (str): Date string representing end date upto which update have to be done.
			Expected format is YYYY-MM-DD. For example - "2018-06-04"
	'''
	user_inputs_in_duration = user.userdailyinput_set.select_related().filter(
		created_at__range = (from_date,to_date)
	)
	for user_input in user_inputs_in_duration:
		try:
			data = hrr_data(user,user_input.created_at)
			measured_hrr = user_input.encouraged_input.measured_hrr
			if (data['Did_you_measure_HRR'] == 'yes' and (not measured_hrr or measured_hrr == "no")):
				if data['Did_you_measure_HRR']:
					user_input.encouraged_input.measured_hr = data['Did_you_measure_HRR']
				if data['Did_heartrate_reach_99']:
					user_input.encouraged_input.hr_down_99 = data['Did_heartrate_reach_99']
				if data['HRR_start_beat']:
					user_input.encouraged_input.hr_level = str(data['HRR_start_beat'])
				if data['lowest_hrr_1min']:
					user_input.encouraged_input.lowest_hr_first_minute = str(data['lowest_hrr_1min'])
				if data['time_99']:
					user_input.encouraged_input.time_to_99 = _sec_to_min_sec_str(int(data['time_99']))
				user_input.encouraged_input.save()
		except Exception as e:
			logger.exception("Cannot update user input for user {} on {}".format(
					user.username,
					user_input.created_at.strftime("%Y-%m-%d")
				)
			)

class Command(BaseCommand):
	help = "Populate existing user inputs with HRR data"

	def __init__(self,*args, **kwargs):
		super().__init__(*args, **kwargs)
		self.email_or_all_flag = 'email'

	def add_arguments(self, parser):
		parser.add_argument(
			'-e',
			'--email',
			nargs = '+',
			type = str,
			dest = 'email',
			help = "Email(s)"
		)

		parser.add_argument(
			'-a',
			'--all',
			action = 'store_true',
			dest = 'all',
			help = 'Populate HRR data for all user'
		)

		parser.add_argument(
			'-d',
			'--duration',
			type = str,
			nargs = 2,
			dest = 'duration',
			help = 'Range of date [from, to] eg "-d 2018-01-01 2018-01-10"'
		)

	def _validate_options(self,options):

		if not options['email'] and not options['all']:
			raise CommandError("Provide either --email or --all")

		# give "all" flag more preference over "email" 
		if options['all']:
			self.email_or_all_flag = 'all'	

		return True

	def _populate_hrr(self,user_qs,from_date,to_date):
		for user in user_qs:
			self.stdout.write(
				self.style.WARNING(
					'\nPopulating HRR data for user "{}" from {} to {}'.format(
						user.username,
						from_date,
						to_date
					)
				)
			)
			populate_userinput_hrr(user,from_date,to_date)

	def handle (self,*args,**options):
		if self._validate_options(options):
			from_date = options['duration'][0]
			to_date = options['duration'][1]

			if self.email_or_all_flag == 'email':
				emails = [e for e in options['email']]
				user_qs = get_user_model().objects.filter(email__in = emails)
				self._populate_hrr(user_qs,from_date,to_date)
			else:
				user_qs = get_user_model().objects.all()
				self._populate_hrr(user_qs,from_date,to_date)