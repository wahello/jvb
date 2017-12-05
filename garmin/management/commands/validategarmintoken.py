from datetime import datetime,timezone,time

from django.core.management.base import BaseCommand, CommandError

from rauth import OAuth1Service

from users.models import GarminToken

class Command(BaseCommand):
	help = 'Validate the existing Garmin Health and Garmin Connect access token'

	def _is_valid(self,session):
		today = datetime.combine(datetime.now().date(),time(0))
		uploadStartTimeInSeconds = int(today.replace(tzinfo=timezone.utc).timestamp())
		uploadEndTimeInSeconds = uploadStartTimeInSeconds + 86400
		data = {
	        'uploadStartTimeInSeconds': uploadStartTimeInSeconds,
	        'uploadEndTimeInSeconds':uploadEndTimeInSeconds
      	}
		URL = 'https://healthapi.garmin.com/wellness-api/rest/activities'
		r = session.get(URL, header_auth=True, params=data)
		if type(r.json()) is dict and r.json().get('errorMessage',None):
			return not(r.json().get('errorMessage') == 'Unknown UserAccessToken')
		return True

	def _validate_options(self,options):
		if options['all'] == False and options['email'] == None:
			raise CommandError("No arguments are provided. Type -h or --help for more information")
		return True

	def _validate_token(self,email,options):
		REQ_URL = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
		AUTH_URL = 'http://connect.garmin.com/oauthConfirm'
		ACC_URL = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
		HEALTH_CONSKEY = '6c1a770b-60b9-4d7e-83a2-3726080f5556'
		HEALTH_CONSSEC = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9'
		try:
			sess = None
			if options['api'] == 'health':
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
				if self._is_valid(sess):
					self.stdout.write(self.style.SUCCESS('\nEmail "%s" has valid Garmin Health Token' % email))
				else:
					self.stdout.write(self.style.ERROR('\nEmail "%s" has invalid Garmin Health Token' % email))

		except (GarminToken.DoesNotExist):
			self.stdout.write(self.style.ERROR('Token for email "%s" does not exist' % email))

	def add_arguments(self, parser):
		parser.add_argument(
			'--email',
			'-e',
			nargs='+',
			type=str,
			dest="email",
			required=False,
			help = "Email(s) for which token to be validated"
		)

		parser.add_argument(
			'--all',
			'-a',
			action='store_true',
			dest='all',
			default=False,
			help = 'Validate all tokens present in database'
		)
		parser.add_argument(
			'--api',
			action='store',
			dest='api',
			default='health',
			type=str,
			choices = ['health'],
			help = 'API for which token have to be validated. Default is "health"'
		)

	def handle(self, *args, **options):
		if self._validate_options(options):
			if not options['all'] and options['email']:
				for email in options['email']:
					self._validate_token(email,options)
			elif options['all'] and not options['email']:
				for token in GarminToken.objects.all():
					self._validate_token(token.user.email,options)
			else:
				raise CommandError('Provide either --all or --email, not both')