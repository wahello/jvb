from datetime import datetime
import logging

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

from hrr.views import hrr_calculations

logger = logging.getLogger(__name__)

def _str_to_datetime(str_date):
	y,m,d = map(int,str_date.split('-'))
	return datetime(y,m,d,0,0,0)

def populate_userinput_hrr(user,from_date, to_date):
	user_inputs_in_duration = user.user_input.filter(
		created_at__range = (from_date,to_date)
	)
	for user_input in user_inputs_in_duration:
		try:
			hrr_data = hrr_calculations(user,user_input.created_at)
			# TODO : update the user input HRR fields with HRR data 
		except Exception as e:
			logger.exception("Cannot update user input for user {} on {}".format(
					user.username,
					user_input.created_at.strftime("%Y-%m-%d")
				)
			)

class Commands(BaseCommand):
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
			self.email_or_all_flag= 'all'	

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
		if self._validate_options():
			from_date = options['duration'][0]
			to_date = options['duration'][1]

			if self.email_or_all_flag == 'email':
				emails = [e for e in options['email']]
				user_qs = get_user_model().objects.filter(email__in = emails)
				self._populate_hrr(user_qs,from_date,to_date)
			else:
				user_qs = get_user_model().objects.all()
				self._populate_hrr(user_qs,from_date,to_date)
