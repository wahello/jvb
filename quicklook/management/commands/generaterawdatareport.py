from datetime import datetime,timedelta

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User

from garmin.models import UserGarminDataSleep
from quicklook.tasks import generate_quicklook

class Command(BaseCommand):

	def __init__(self,*args, **kwargs):
		super().__init__(*args, **kwargs)
		self.email_or_all_flag = 'email'
		self.date_range_flag = 'today'

	help = 'Generate Raw data report'

	def _get_flags(self):
		'''
		Flags and their priority among group.
		Each tuple have following meta data- (dest, short flag name, verbose flag name, priority) 
		Group 1 = [email, all]
		Group 2 = [duration, yesterday, week, month, year]
		Lower priority value is given more preference
		'''
		flags = {
			'email':('email','-e','--email',2),
			'all':('all','-a','--all',1),
			'duration':('duration','-d','--duration',6),
			'yesterday':('yesterday','-y','--yesterday',5),
			'week':('week','-w','--week',4),
			'month':('month','-m','--month',3),
			'year':('year','-Y','--year',2),
			'origin':('origin','-o','--origin',1)
		}
		return flags

	def _get_origin_date(self, user):
		last_record = UserGarminDataSleep.objects.filter(user = user).order_by('id')
		if last_record.exists():
			start_time = datetime.utcfromtimestamp(last_record[0].start_time_in_seconds)
			return start_time
		else:
			return None

	def _validate_options(self,options):
		no_flags = True
		flags = self._get_flags()

		for f in flags.values():
			if options[f[0]]:
				no_flags = False
				break

		if no_flags:
			raise CommandError("No arguments are provided. Type -h or --help for more information")

		if not options['email'] and not options['all']:
			raise CommandError("Provide either --email or --all")

		# give "all" flag more preference over "email" 
		if options['all']:
			self.email_or_all_flag = 'all'	


		# if more than one flag  from Group 2 is provided then
		# use flags with most priority (lowest value) 
		flags.pop('email')
		flags.pop('all')
		common_flags = set([f for f in flags.keys()]).intersection(
					   set(list(filter(lambda x:options[x],[o for o in options.keys()]))))
		
		for f in common_flags:
			if self.date_range_flag and self.date_range_flag != 'today':
				if flags.get(f)[3] < flags.get(self.date_range_flag)[3]:
					self.date_range_flag = f
			else:
				self.date_range_flag = f

		return True

	def add_arguments(self, parser):
		flags = self._get_flags()
		parser.add_argument(
			flags.get('email')[2],
			flags.get('email')[1],
			nargs = '+',
			type = str,
			dest = flags.get('email')[0],
			help = "Email(s)"
		)

		parser.add_argument(
			flags.get('all')[2],
			flags.get('all')[1],
			action = 'store_true',
			dest = flags.get('all')[0],
			help = 'Generate Raw Data Report for all user'
		)

		parser.add_argument(
			flags.get('duration')[2],
			flags.get('duration')[1],
			type = str,
			nargs = 2,
			dest = flags.get('duration')[0],
			help = 'Range of date [from, to] eg "-d 2017-11-01 2017-11-10"'
		)

		parser.add_argument(
			flags.get('yesterday')[2],
			flags.get('yesterday')[1],
			action = 'store_true',
			dest = flags.get('yesterday')[0],
			help = 'Create report for yesterday'
		)

		parser.add_argument(
			flags.get('week')[2],
			flags.get('week')[1],
			action = 'store_true',
			dest = flags.get('week')[0],
			help = 'Create report for last 7 days (not including today)'
		)

		parser.add_argument(
			flags.get('month')[2],
			flags.get('month')[1],
			action = 'store_true',
			dest = flags.get('month')[0],
			help = 'Create report for last 30 days (not including today)'
		)

		parser.add_argument(
			flags.get('year')[2],
			flags.get('year')[1],
			action ='store_true',
			dest = flags.get('year')[0],
			help = 'Create report for last 365 days (not including today)'
		)

		parser.add_argument(
			flags.get('origin')[2],
			flags.get('origin')[1],
			action ='store_true',
			dest = flags.get('origin')[0],
			help = 'Create report from date of first health data received (including today)'
		)

		parser.add_argument(
			'--ignore',
			'-i',
			nargs = '+',
			type = str,
			dest = 'ignore',
			help = 'Email(s) to ignore'
		)

	def handle(self, *args, **options):
		if self._validate_options(options):
			today = datetime.now().date()
			yesterday = today-timedelta(days=1)
			from_date = datetime.now().strftime("%Y-%m-%d")
			to_date = datetime.now().strftime("%Y-%m-%d")

			if self.date_range_flag == 'duration':
				to_date = options['duration'][1]
				from_date = options['duration'][0]

			elif self.date_range_flag == 'yesterday':
				to_date = yesterday.strftime("%Y-%m-%d")
				from_date = yesterday.strftime("%Y-%m-%d")

			elif self.date_range_flag == 'week':
				td = timedelta(days=7)
				to_date = yesterday.strftime("%Y-%m-%d")
				from_date = (today-td).strftime("%Y-%m-%d")

			elif self.date_range_flag == 'month':
				td = timedelta(days=30)
				to_date =yesterday.strftime("%Y-%m-%d")
				from_date = (today-td).strftime("%Y-%m-%d")

			elif self.date_range_flag == 'year':
				td = timedelta(days=365)
				to_date = yesterday.strftime("%Y-%m-%d")
				from_date = (today-td).strftime("%Y-%m-%d")

			if self.email_or_all_flag == 'email':
				emails = [e for e in options['email']]
				user_qs = User.objects.filter(email__in = emails)
				for user in user_qs:
					if not options['ignore'] or (options['ignore'] and user.email not in options['ignore']): 
						self.stdout.write(self.style.WARNING('\nCreating Raw data report for user "%s"' % user.username))
						if self.date_range_flag == 'origin':
							date_of_oldest_record = self._get_origin_date(user)
							if date_of_oldest_record:
								from_date = date_of_oldest_record.strftime("%Y-%m-%d")
								to_date = datetime.now().strftime("%Y-%m-%d")
								generate_quicklook(user.id,from_date,to_date)
							else:
								self.stdout.write(self.style.ERROR('\nNo health record found for user "%s"' % user.username))
							continue
						generate_quicklook(user.id,from_date,to_date)
			else:
				user_qs = User.objects.all()
				for user in user_qs:
					if not options['ignore'] or (options['ignore'] and user.email not in options['ignore']): 
						self.stdout.write(self.style.WARNING('\nCreating Raw data report for user "%s"' % user.username))
						if self.date_range_flag == 'origin':
							date_of_oldest_record = self._get_origin_date(user)
							if date_of_oldest_record:
								from_date = date_of_oldest_record.strftime("%Y-%m-%d")
								to_date = datetime.now().strftime("%Y-%m-%d")
								generate_quicklook(user.id,from_date,to_date)
							else:
								self.stdout.write(self.style.ERROR('\nNo health record found for user "%s"' % user.username))
							continue
						generate_quicklook(user.id,from_date,to_date)
