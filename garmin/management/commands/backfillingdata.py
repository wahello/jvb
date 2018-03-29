from datetime import datetime,timezone,time
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from users.models import GarminToken
from rauth import OAuth1Service
import time
import datetime

class Command(BaseCommand):

	def __init__(self,*args, **kwargs):
		super().__init__(*args, **kwargs)
		self.email_or_all_flag = 'email'
		self.date_range_flag = 'today'

	DATA_TYPES = {
		"DAILY_SUMMARIES":"dailies",
		"ACTIVITY_SUMMARIES":"activities",
		"MANUALLY_UPDATED_ACTIVITY_SUMMARIES":"manuallyUpdatedActivities",
		"EPOCH_SUMMARIES":"epochs",
		"SLEEP_SUMMARIES":"sleeps",
		"BODY_COMPOSITION":"bodyComps",
		"STRESS_DETAILS":"stressDetails",
		"MOVEMENT_IQ":"moveiq",
		"USER_METRICS":"userMetrics"
	}

	help = 'Backfilling the data from the Garmin for particular period of range'

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
			# 'timestamp':('timestamp','-t','--timestamp'),
		}
		return flags

	def _is_valid(self,session,from_date=None,to_date=None):
		# if to_date and from_date:
			# print(to_date)
			# print(from_date)
			# if type(from_date_timestamp) == int:
			# uploadStartTimeInSeconds = from_date_timestamp
			# uploadEndTimeInSeconds = to_date_timestamp
			# else:
			uploadStartTimeInSeconds = int(datetime.datetime.strptime(from_date, '%Y-%m-%d').replace(tzinfo=timezone.utc).timestamp())
			uploadEndTimeInSeconds = int(datetime.datetime.strptime(to_date, '%Y-%m-%d').replace(tzinfo=timezone.utc).timestamp())
			data = {
		        'summaryStartTimeInSeconds': uploadStartTimeInSeconds,
		        'summaryEndTimeInSeconds':uploadEndTimeInSeconds
	      	}
			ROOT_URL = 'https://healthapi.garmin.com/wellness-api/rest/backfill/{}'
			for dtype in self.DATA_TYPES.values():
				time.sleep(60)
				URL = ROOT_URL.format(dtype)
				r = sess.get(URL, header_auth=True, params=data)
			# return Response(status = status.HTTP_202_ACCEPTED)
			# return Response(status = status.HTTP_403_FORBIDDEN)
		# else:
		# 	self.stdout.write(self.style.ERROR('Please enter Date range'))
		# 	return True
			print("Data Backfilled")
			return True

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

	def _validate_token(self,email,options):
		REQ_URL = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
		AUTH_URL = 'http://connect.garmin.com/oauthConfirm'
		ACC_URL = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
		HEALTH_CONSKEY = '6c1a770b-60b9-4d7e-83a2-3726080f5556'
		HEALTH_CONSSEC = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9'
		try:
			global sess
			# if options['api'] == 'health':
			token = GarminToken.objects.get(user__email= email)
			access_token = token.token
			access_token_secret = token.token_secret
			service = OAuth1Service(
				consumer_key = HEALTH_CONSKEY,
				consumer_secret = HEALTH_CONSSEC,
				request_token_url = REQ_URL,
				access_token_url = ACC_URL,
				authorize_url = AUTH_URL, 
			)
			sess = service.get_session((access_token, access_token_secret))
			# if self._is_valid(sess):
			# 	self.stdout.write(self.style.SUCCESS('\nEmail "%s" has valid Garmin Health Token' % email))
			# else:
			# 	self.stdout.write(self.style.ERROR('\nEmail "%s" has invalid Garmin Health Token' % email))

		except (GarminToken.DoesNotExist):
			self.stdout.write(self.style.ERROR('Token for email "%s" does not exist' % email))
		self.stdout.write(self.style.SUCCESS('\nEmail "%s" has valid Garmin Health Token' % email))
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
			flags.get('duration')[1],
			flags.get('duration')[2],
			type = str,
			nargs = 2,
			dest = flags.get('duration')[0],
			help = 'Range of date [from, to] eg "-d 2017-11-01 2017-11-10"'
		)

		# parser.add_argument(
		# 	flags.get('timestamp')[1],
		# 	flags.get('timestamp')[2],
		# 	type = int,
		# 	nargs = 2,
		# 	dest = flags.get('timestamp')[0],
		# 	help = 'Range of date [from, to] eg "-d 13154824646 16857229289"'
		# )

	def handle(self, *args, **options):
		# if options['duration'][0]:
		# 	from_date = options['duration'][0]
		# 	to_date = options['duration'][1]
		# else:
		# 	from_date = None
		# 	to_date = None
		from_date = options['duration'][0]
		to_date = options['duration'][1]
		# from_date_timestamp = options['timestamp'][0]
		# to_date_timestamp = options['timestamp'][1]
		if self._validate_options(options):

			if self.date_range_flag == 'duration':
				pass

			if not options['all'] and options['email']:
				for email in options['email']:
					print(options)
					if self._validate_token(email,options):
						# print(sess,from_date,to_date)
						self._is_valid(sess,from_date,to_date)

			elif options['all'] and not options['email']:
				for token in GarminToken.objects.all():
					if self._validate_token(token.user.email,options):
						self._is_valid(sess,to_date,from_date)
			else:
				raise CommandError('Provide either --all or --email, not both')






