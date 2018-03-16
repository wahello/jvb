from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from users.models import GarminToken
from rauth import OAuth1Service

from garmin.models import UserGarminDataEpoch,\
          UserGarminDataSleep,\
          UserGarminDataBodyComposition,\
          UserGarminDataDaily,\
          UserGarminDataActivity,\
          UserGarminDataManuallyUpdated,\
          UserGarminDataStressDetails,\
          UserGarminDataMetrics,\
          UserGarminDataMoveIQ

class Command(BaseCommand):

  help = 'pulling the data from garmin for particular Update time range'

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

  MODEL_TYPES = {
    "dailies":UserGarminDataDaily,
    "activities":UserGarminDataActivity,
    "manuallyUpdatedActivities":UserGarminDataManuallyUpdated,
    "epochs":UserGarminDataEpoch,
    "sleeps":UserGarminDataSleep,
    "bodyComps":UserGarminDataBodyComposition,
    "stressDetails":UserGarminDataStressDetails,
    "moveiq":UserGarminDataMoveIQ,
    "userMetrics":UserGarminDataMetrics
  }

  def _safe_get(self,data,attr,default):
        data_item = data.get(attr,None)
        if not data_item:
            return default
        return data_item

  def _createObjectList(self,user,json_data,dtype,record_dt):
    '''
      Helper method to create instance of model
    '''
    if len(json_data):
      model = self.MODEL_TYPES[dtype]
      if not dtype in ["bodyComps","userMetrics"]:
        objects = [
          model(user=user,
              summary_id=obj.get("summaryId"),
              record_date_in_seconds=record_dt,
              start_time_in_seconds=obj.get("startTimeInSeconds")+\
                          self._safe_get(obj,"startTimeOffsetInSeconds",0),
              start_time_duration_in_seconds=obj.get("durationInSeconds"),
              data = obj)
          for obj in json_data
        ]
      if dtype == "bodyComps":
        objects = [
          model(  user=user,
              summary_id=obj.get("summaryId"),
              record_date_in_seconds=record_dt,
              start_time_in_seconds=obj.get("measurementTimeInSeconds")+\
                                    self._safe_get(obj,"measurementTimeOffsetInSeconds",0),
              start_time_duration_in_seconds=obj.get("durationInSeconds"),
              data = obj)
          for obj in json_data
            ]
      if dtype == "userMetrics":
        objects = [
          model(  user=user,
              summary_id=obj.get("summaryId"),
              record_date_in_seconds=record_dt,
              calendar_date=obj.get("calendarDate"),
              data=obj)
          for obj in json_data
        ]

      return objects

  def pullGarminHealthData(self,user,start_timestamp, end_timestamp):
    req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
    authurl = 'http://connect.garmin.com/oauthConfirm'
    acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
    conskey = '6c1a770b-60b9-4d7e-83a2-3726080f5556';
    conssec = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9';

    try:
      access_token = user.garmin_token.token
      access_token_secret = user.garmin_token.token_secret
    except:
      access_token = None
      access_token_secret = None

    if access_token and access_token_secret:
      service = OAuth1Service(
            consumer_key = conskey,
            consumer_secret = conssec,
            request_token_url = req_url,
            access_token_url = acc_url,
            authorize_url = authurl,
            )
      sess = service.get_session((access_token, access_token_secret))

      data = {
        'uploadStartTimeInSeconds': start_timestamp,
        'uploadEndTimeInSeconds':end_timestamp
      }

      ROOT_URL = 'https://healthapi.garmin.com/wellness-api/rest/{}'

      for dtype in self.DATA_TYPES.values():
        URL = ROOT_URL.format(dtype)
        model = self.MODEL_TYPES[dtype]
        r = sess.get(URL, header_auth=True, params=data)
        try:
          model.objects.bulk_create(
            self._createObjectList(user,r.json(),dtype,start_timestamp)
          )
        except:
          self.stdout.write(self.style.ERROR('\nSome error occured while pulling data for user "%s"' % user.username))
          self.stdout.write(r)

  def _get_flags(self):
    flags = {
      'email':('email','-e','--email'),
      'all':('all','-a','--all'),
      'duration':('duration','-d','--duration'),
    }
    return flags

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
      help = 'Pull Garmin Health data for all users'
    )

    parser.add_argument(
      flags.get('duration')[1],
      flags.get('duration')[2],
      type = str,
      nargs = 2,
      dest = flags.get('duration')[0],
      help = 'Duration [from, to] eg "-d 1521072000 1521158400"'
    )

  def handle(self, *args, **options):
    if options['duration']:
      start_timestamp = options['duration'][0]
      end_timestamp = options['duration'][1]

      if not options['all'] and options['email']:
        emails = [e for e in options['email']]
        user_qs = get_user_model().objects.filter(email__in = emails)
        for user in user_qs:
          self.stdout.write(self.style.WARNING('\nPulling Health data for user "%s"' % user.username))
          self.pullGarminHealthData(user,start_timestamp,end_timestamp)

      elif options['all'] and not options['email']:
        user_qs = get_user_model().objects.all()
        for user in user_qs:
          self.stdout.write(self.style.WARNING('\nPulling Health data for user "%s"' % user.username))
          self.pullGarminHealthData(user,start_timestamp,end_timestamp)

      else:
        raise CommandError('Provide either --all or --email, not both')