from datetime import datetime

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

from quicklook.models import UserQuickLook
from progress_analyzer.helpers.cumulative_helper import create_cumulative_instance

class Command(BaseCommand):

	def __init__(self,*args, **kwargs):
		super().__init__(*args, **kwargs)
		self.email_or_all_flag = 'email'
		self.duration_or_origin_flag = 'duration'
	
	help = 'Generate Cumulative Sum instances '

	
	def _get_origin_date(self, user):
		last_record = UserQuickLook.objects.filter(user = user).order_by('id')
		if last_record.exists():
			start_time = last_record[0].created_at
			return start_time
		else:
			return None

	def _validate_options(self,options):

		if not options['email'] and not options['all']:
			raise CommandError("Provide either --email or --all")

		if not options['duration'] and not options['origin']:
			raise CommandError("Provide either --duration or --origin")

		# give "all" flag more preference over "email" 
		if options['all']:
			self.email_or_all_flag= 'all'	

		# give "origin" flag more preference over "duration" 
		if options['origin']:
			self.duration_or_origin_flag= 'origin'

		return True

	def _create_cumulative_sum(self,user_qs,from_date,to_date):
		for user in user_qs:
			self.stdout.write(self.style.WARNING('\nCreating Cumulative Sum instance for user "%s"' % user.username))
			if self.duration_or_origin_flag == 'origin':
				date_of_oldest_ql_record = self._get_origin_date(user)
				if date_of_oldest_ql_record:
					from_date = date_of_oldest_ql_record.strftime("%Y-%m-%d")
					to_date = datetime.now().strftime("%Y-%m-%d")
					create_cumulative_instance(user,from_date,to_date)
				else:
					self.stdout.write(self.style.ERROR('\nNo Quicklook record found for user "%s", cannot create Cumulative Sum insance' % user.username))
				continue
			create_cumulative_instance(user,from_date,to_date)

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
			help = 'Generate cumulative sum instances for all user'
		)

		parser.add_argument(
			'-d',
			'--duration',
			type = str,
			nargs = 2,
			dest = 'duration',
			help = 'Range of date [from, to] eg "-d 2018-01-01 2018-01-10"'
		)

		parser.add_argument(
			'-o',
			'--origin',
			action ='store_true',
			dest = 'origin',
			help = 'Create cumulative sum instances from date of first quicklook (including today)'
		)

	def handle(self, *args, **options):
		if self._validate_options(options):
			from_date = None
			to_date = None

			if self.duration_or_origin_flag == 'duration':
				from_date = options['duration'][0]
				to_date = options['duration'][1]

			if self.email_or_all_flag == 'email':
				emails = [e for e in options['email']]
				user_qs = get_user_model().objects.filter(email__in = emails)
				self._create_cumulative_sum(user_qs,from_date,to_date)
			else:
				user_qs = get_user_model().objects.all()
				self._create_cumulative_sum(user_qs,from_date,to_date)