import ast
import urllib
import logging
from datetime import datetime,timezone

from rauth import OAuth1Service

from django.shortcuts import redirect

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import GarminTokenSerializer
from .models import GarminToken
# In state=1 the next request should include an oauth_token.
#If it doesn't go back to 0


from garmin.models import UserGarminDataEpoch,\
          UserGarminDataSleep,\
          UserGarminDataBodyComposition,\
          UserGarminDataDaily,\
          UserGarminDataActivity,\
          UserGarminDataManuallyUpdated,\
          UserGarminDataStressDetails,\
          UserGarminDataMetrics,\
          UserGarminDataMoveIQ

try:
    import http.client as http_client
except ImportError:
    # Python 2
    import httplib as http_client
http_client.HTTPConnection.debuglevel = 1

logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
requests_log = logging.getLogger("requests.packages.urllib3")
requests_log.setLevel(logging.DEBUG)
requests_log.propagate = True

def request_token(request):
    req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
    authurl = 'http://connect.garmin.com/oauthConfirm'
    acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
    conskey = '6c1a770b-60b9-4d7e-83a2-3726080f5556';
    conssec = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9';
    session = request.session
    if not 'auth_token' in session and ('state' in session and session['state'])==1:
      session['state'] = 0;

    service = OAuth1Service(
          # name = 'etrade',
          consumer_key = conskey,
          consumer_secret = conssec,
          request_token_url = req_url,
          access_token_url = acc_url,
          authorize_url = authurl,
          # base_url = 'http://etws.etrade.com'
          )

    # Get request token and secret
    # $oauth = new OAuth($conskey,$conssec,OAUTH_SIG_METHOD_HMACSHA1,OAUTH_AUTH_TYPE_URI)
    # $oauth->enableDebug()

    session = request.session
    request_token, request_token_secret = service.get_request_token()

    session['request_token'] = request_token
    session['request_token_secret'] = request_token_secret
    session['state'] = 1
    callback_string = urllib.parse.quote('http://app.jvbwellness.com/callbacks/garmin')
    return redirect(authurl + '?oauth_token={0}&oauth_callback={1}'.format(request_token,callback_string))

def receive_token(request):
    req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
    authurl = 'http://connect.garmin.com/oauthConfirm'
    acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
    conskey = '6c1a770b-60b9-4d7e-83a2-3726080f5556';
    conssec = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9';
    session = request.session

    # oauth_token = request.GET['oauth_token']
    oauth_verifier = request.GET['oauth_verifier']

    service = OAuth1Service(
          # name = 'etrade',
          consumer_key = conskey,
          consumer_secret = conssec,
          request_token_url = req_url,
          access_token_url = acc_url,
          authorize_url = authurl,
          # base_url = 'http://etws.etrade.com'
          )

    access_token, access_token_secret = service.get_access_token(session['request_token'],
    session['request_token_secret'],method='POST',data={'oauth_verifier': oauth_verifier},
    header_auth=True)

    # Check if token and token secret exist. If exist then update otherwise
    # create new entry in the database
    try:
      token = GarminToken.objects.get(user = request.user)
      if token:
        setattr(token, "token", access_token)
        setattr(token, "token_secret", access_token_secret)
        token.save()
    except GarminToken.DoesNotExist:
      GarminToken.objects.create(user=request.user,token=access_token,
                                 token_secret=access_token_secret)

    return redirect('/service_connect')

class GetGarminToken(APIView):
  permission_classes = (permissions.IsAuthenticated,)

  def dispatch(self, *args, **kwargs):
    try:
      if GarminToken.objects.get(user=self.request.user):
        return super(GetGarminToken,self).dispatch(*args,**kwargs)
    except GarminToken.DoesNotExist:
      return redirect('/users/request_token')

  def get_object(self,user):
    return GarminToken.objects.get(user=user)

  def get(self, request, format="json"):
      token = self.get_object(user=request.user)
      serializers = GarminTokenSerializer(token)
      return Response(serializers.data)

  def post(self, request, format="json"):
    serializer = GarminTokenSerializer(data=request.data,context={'request': request})
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class fetchGarminData(APIView):

  '''
  fetch data from db for specified date, otherwise
  pull directly from api and display raw data
  '''

  permission_classes = (IsAuthenticated,)

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

  # just for demo storing data in db. Pulling data from api and storing
  # in db is functionality of other view
  def _createObjectList(self,json_data,dtype,record_dt):
    '''
      Helper method to create instance of model
    '''
    if len(json_data):
      model = self.MODEL_TYPES[dtype]
      user = self.request.user
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


  def get(self, request, format="json"):
    req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
    authurl = 'http://connect.garmin.com/oauthConfirm'
    acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
    conskey = '6c1a770b-60b9-4d7e-83a2-3726080f5556';
    conssec = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9';

    # start_date = '2017-09-13'
    y,m,d = map(int,request.GET.get('start_date').split('-'))

    start_date_dt = datetime(y,m,d,0,0,0)

    startDateTimeInSeconds = int(start_date_dt.replace(tzinfo=timezone.utc).timestamp())
    user = request.user

    access_token = request.user.garmin_token.token
    access_token_secret = request.user.garmin_token.token_secret

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
        'uploadStartTimeInSeconds': startDateTimeInSeconds,
        'uploadEndTimeInSeconds':startDateTimeInSeconds+86400
      }

      output_dict = {}

      ROOT_URL = 'https://healthapi.garmin.com/wellness-api/rest/{}'

      # True if data is pulled fro garmin api
      # False if pulled from our database
      PULL_HISTORY = {
        "dailies":False,
        "activities":False,
        "manuallyUpdatedActivities":False,
        "epochs":False,
        "sleeps":False,
        "bodyComps":False,
        "stressDetails":False,
        "moveiq":False,
        "userMetrics":False
      }

      for dtype in self.DATA_TYPES.values():

        URL = ROOT_URL.format(dtype)
        model = self.MODEL_TYPES[dtype]
        pull = False
        # start_time_in_seconds

        if dtype == 'userMetrics':
          output_dict[dtype] = [q.data for q in model.objects.filter(
                      user=user,
                      record_date_in_seconds=data['uploadStartTimeInSeconds'])]
        else:
          output_dict[dtype] = [q.data for q in model.objects.filter(
                      user=user,
                      start_time_in_seconds__gte=data['uploadStartTimeInSeconds'],
                      start_time_in_seconds__lt=data['uploadEndTimeInSeconds'])]

        if not output_dict[dtype]:
          # no record in db
          pull=True

        PULL_HISTORY[dtype]=pull

        if pull:
          # pull from api and store in db
          r = sess.get(URL, header_auth=True, params=data)
          print("\n\n",r.json())
          output_dict[dtype] = r.json()

          model.objects.bulk_create(
            self._createObjectList(r.json(),dtype,startDateTimeInSeconds)
          )

      dailies_json = output_dict['dailies']
      if not PULL_HISTORY['dailies']:
        dailies_json = [ast.literal_eval(dic) for dic in dailies_json]

      activities_json = output_dict['activities']
      if not PULL_HISTORY['activities']:
        activities_json = [ast.literal_eval(dic) for dic in activities_json]

      manuallyUpdatedActivities_json = output_dict['manuallyUpdatedActivities']
      if not PULL_HISTORY['manuallyUpdatedActivities']:
        manuallyUpdatedActivities_json = [ast.literal_eval(dic) for dic in manuallyUpdatedActivities_json]

      epochs_json = output_dict['epochs']
      if not PULL_HISTORY['epochs']:
        epochs_json = [ast.literal_eval(dic) for dic in epochs_json]

      sleeps_json = output_dict['sleeps']
      if not PULL_HISTORY['sleeps']:
        sleeps_json = [ast.literal_eval(dic) for dic in sleeps_json]

      bodyComps_json = output_dict['bodyComps']
      if not PULL_HISTORY['bodyComps']:
        bodyComps_json = [ast.literal_eval(dic) for dic in bodyComps_json]

      #sleeps_decoded = sleeps_json.strip('"')

           #caluculates the sum of all the values related to the key and returns the result to dict

      def my_sum(d, key):
          if(d!=[]):
              return sum([i.get(key,0) for i in d ])
          else:
              return(0)

      def max_values(d,key):
          if(d!=[]):
              seq = [x.get(key,0) for x in d]
              return(max(seq))
          else:
              return(0)

      output_dict['garmin_health_api'] = {

        "Activity Name": "",
        "Activity Type": dailies_json[0]['activityType'] if dailies_json else '',
        "Event Type":"",
        "Course":"",
        "Location":"",
        "start": dailies_json[0]['startTimeInSeconds'] if dailies_json else '',
        "Time":my_sum(dailies_json,'activeTimeInSeconds'),
        "Distance":my_sum(dailies_json,'distanceInMeters'),
        "Lap Information":"",
        "Elevation Gain":my_sum(activities_json,'totalElevationGainInMeters'),
        "Elevation Loss":my_sum(activities_json,'totalElevationLossInMeters'),
        "Average Speed":my_sum(activities_json,'averageSpeedInMetersPerSecond'),
        "Maximum Speed":my_sum(activities_json,'maxSpeedInMetersPerSecond'),
        "Average Hr":my_sum(activities_json,'averageHeartRateInBeatsPerMinute'),
        "Maximum Hr":my_sum(activities_json,'maxHeartRateInBeatsPerMinute'),
        "Average Run Cadence":my_sum(activities_json,'averageRunCadenceInStepsPerMinute'),
        "Maximu Run Cadence":my_sum(activities_json,'maxRunCadenceInStepsPerMinute'),
        "Steps from Activity":my_sum(activities_json,'steps')+my_sum(dailies_json,'steps'),
        "Calories":my_sum(epochs_json,'activeKilocalories'),
        "Training Effect":"",
        "Minimum Elevation":"",
        "Maximum Elevation":"",
        "Moving Time":"",
        "Elapsed Time":"",
        "Average Moving Pace":my_sum(activities_json,'averagePaceInMinutesPerKilometer'),
        "Average Stride Length":"",
        "Average Vertical Ratio":"",
        "Average Vertical Oscillation":"",
        "Average Gct Balance":"",
        "Avergae Ground Contact Time":"",
        "Total Steps":my_sum(epochs_json,'steps'),
        "Activity Steps":my_sum(activities_json,'activitySteps'),
        "Floors Climbed":my_sum(dailies_json,'floorsClimbed'),
        "Floors Descended":"",
        "Calories In/Out":my_sum(dailies_json,'activeKilocalories'),
        "Golf Stats":"",
        "Weight In grams":bodyComps_json[0]['weightInGrams'] if bodyComps_json else '',
        "Body Mass":"",
        "BMI":"",
        "Body Composition Summary (from Garmin Index scale)":"",
        "Resting heart rate":my_sum(dailies_json,'restingHeartRateInBeatsPerMinute'),
        "Average resting heart rate":my_sum(dailies_json,'restingHeartRateInBeatsPerMinute')/len(dailies_json)\
                                     if dailies_json else '',
        "Maximum Resting Heart Rate":max_values(dailies_json,'restingHeartRateInBeatsPerMinute'),
        "Resting Heart Rate Trends Over Time ":"",
        "VO2 Max grab data and populate database":"",
        "VO2 max category":"",
        "Intensity minutes":my_sum(dailies_json,'moderateIntensityDurationInSeconds')+my_sum(dailies_json,'vigorousIntensityDurationInSeconds'),
        "Heart rate variability stress":"",
        "Training status":"",
        "Data from my fitness pal":"",
        "Data from withings":"",
        "Data from other third party sources":"",
        "Total Sleep":my_sum(sleeps_json,'lightSleepDurationInSeconds')+my_sum(sleeps_json,'deepSleepDurationInSeconds'),
        "light sleep":my_sum(sleeps_json,'lightSleepDurationInSeconds'),
        "deep sleep":my_sum(sleeps_json,'deepSleepDurationInSeconds'),
        "Bed Time":my_sum(sleeps_json,'lightSleepDurationInSeconds')+my_sum(sleeps_json,'deepSleepDurationInSeconds')+my_sum(sleeps_json,'awakeDurationInSeconds'),
        "Sleep Awake time":my_sum(sleeps_json,'awakeDurationInSeconds'),
        "Stress Field (HRV throughout the day)":""
      }

      return Response(output_dict)

    else:
      return Response(status.HTTP_401_UNAUTHORIZED)
