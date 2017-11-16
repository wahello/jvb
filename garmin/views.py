import re
import urllib

from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.core.mail import EmailMessage

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from rauth import OAuth1Service

from .serializers import UserGarminDataEpochSerializer,\
                    UserGarminDataSleepSerializer,\
                    UserGarminDataBodyCompositionSerializer,\
                    UserGarminDataDailySerializer,\
                    UserGarminDataActivitySerializer,\
                    UserGarminDataManuallyUpdatedSerializer,\
                    UserGarminDataStressDetailSerializer,\
                    UserGarminDataMetricsSerializer,\
                    UserGarminDataMoveIQSerializer

from .models import UserGarminDataEpoch,\
                    UserGarminDataSleep,\
                    UserGarminDataBodyComposition,\
                    UserGarminDataDaily,\
                    UserGarminDataActivity,\
                    UserGarminDataManuallyUpdated,\
                    UserGarminDataStressDetails,\
                    UserGarminDataMetrics,\
                    UserGarminDataMoveIQ,\
                    GarminConnectToken


class UserGarminDataEpochView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserGarminDataEpoch.objects.all()
    serializer_class = UserGarminDataEpochSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserGarminDataSleepView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserGarminDataSleep.objects.all()
    serializer_class = UserGarminDataSleepSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserGarminDataBodyCompositionView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserGarminDataBodyComposition.objects.all()
    serializer_class = UserGarminDataBodyCompositionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserGarminDataDailyView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserGarminDataDaily.objects.all()
    serializer_class = UserGarminDataDailySerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserGarminDataActivityView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserGarminDataActivity.objects.all()
    serializer_class = UserGarminDataActivitySerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        

class UserGarminDataManuallyUpdatedView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserGarminDataManuallyUpdated.objects.all()
    serializer_class = UserGarminDataManuallyUpdatedSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserGarminDataStressDetailsView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserGarminDataStressDetails.objects.all()
    serializer_class = UserGarminDataStressDetailSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserGarminDataMetricsView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserGarminDataMetrics.objects.all()
    serializer_class = UserGarminDataMetricsSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserGarminDataMoveIQView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserGarminDataMoveIQ.objects.all()
    serializer_class = UserGarminDataMoveIQSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GarminPing(APIView):
    '''
        This view will receive Health PING API data and 
        store in database 
    '''

    DATA_TYPES = {
                "DAILY_SUMMARIES":"dailies",
                "ACTIVITY_SUMMARIES":"activities",
                "MANUALLY_UPDATED_ACTIVITY_SUMMARIES":"manuallyUpdatedActivities",
                "EPOCH_SUMMARIES":"epochs",
                "SLEEP_SUMMARIES":"sleeps",
                "BODY_COMPOSITION":"bodyComps",
                "STRESS_DETAILS":"stressDetails",
                "MOVEMENT_IQ":"moveIQActivities",
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
        "moveIQActivities":UserGarminDataMoveIQ,
        "userMetrics":UserGarminDataMetrics
    }

    def _createObjectList(self,user,json_data,dtype,record_dt):
        '''
            Helper method to create instance of model
        '''
        if len(json_data):
            model = self.MODEL_TYPES[dtype]
            record_date = record_dt
            if not dtype in ["bodyComps","userMetrics"]:
                objects = [
                    model(user=user,
                          summary_id=obj.get("summaryId"),
                          record_date_in_seconds=record_date,
                          start_time_in_seconds=obj.get("startTimeInSeconds")+\
                                                obj.get("startTimeOffsetInSeconds"),
                          start_time_duration_in_seconds=obj.get("durationInSeconds"),
                          data = obj)
                    for obj in json_data
                ]
            if dtype == "bodyComps":
                objects = [
                    model(  user=user,
                            summary_id=obj.get("summaryId"),
                            record_date_in_seconds=record_date,
                            start_time_in_seconds=obj.get("measurementTimeInSeconds")+\
                                                  obj.get("measurementTimeOffsetInSeconds"),
                            start_time_duration_in_seconds=obj.get("durationInSeconds"),
                            data = obj)
                    for obj in json_data
                ]
            if dtype == "userMetrics":
                objects = [
                    model(  user=user,
                            summary_id=obj.get("summaryId"),
                            record_date_in_seconds=record_date,
                            calendar_date=obj.get("calendarDate"),
                            data=obj)
                    for obj in json_data
                ]

            return objects

    def post(self, request, format=None):

        data = request.data

        req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
        authurl = 'http://connect.garmin.com/oauthConfirm'
        acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
        conskey = '6c1a770b-60b9-4d7e-83a2-3726080f5556';
        conssec = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9';

        dtype = list(data.keys())[0]

        for obj in data.get(dtype):

            user_key = obj.get('userAccessToken')
            try:
                user = User.objects.get(garmin_token__token = user_key)
            except User.DoesNotExist:
                user = None
                return Response(status = status.HTTP_404_NOT_FOUND)

            if user:
                callback_url = obj.get('callbackURL')

                access_token = user.garmin_token.token
                access_token_secret = user.garmin_token.token_secret

                service = OAuth1Service(
                    consumer_key = conskey,
                    consumer_secret = conssec,
                    request_token_url = req_url,
                    access_token_url = acc_url,
                    authorize_url = authurl, 
                )
                
                upload_start_time = int(re.search('uploadStartTimeInSeconds=(\d+)*',
                                    callback_url).group(1))

                upload_end_time = int(re.search('uploadEndTimeInSeconds=(\d+)*',
                                    callback_url).group(1))

                callback_url = callback_url.split('?')[0]+"/"

                data = {
                    'uploadStartTimeInSeconds': upload_start_time,
                    'uploadEndTimeInSeconds':upload_end_time
                }

                sess = service.get_session((access_token, access_token_secret))
                
                r = sess.get(callback_url, header_auth=True, params=data)
                
                obj_list = self._createObjectList(user, r.json(), dtype,upload_start_time)

                self.MODEL_TYPES[dtype].objects.bulk_create(obj_list)

        return Response(status = status.HTTP_200_OK)

class GarminConnectPing(APIView):

    def _handle_received_file(self,f):
        with open(f.name()+'.fit', 'wb+') as destination:
            for chunk in f.chunks():
                destination.write(chunk)

    def post(self, request, format=None):
        '''
            This view will receive Health PING API data and 
            store in database 
        '''
        file = request.FILES['file']

        mail = EmailMessage()
        mail.subject = "Garmin connect Push | Files"
        mail.body = request.data['uploadMetaData']
        mail.to = ['atulk@s7inc.co']
        mail.attach(file.name, file.read(), file.content_type)
        mail.send()
        headers={"Location":"/"}
        return Response(status = status.HTTP_201_CREATED,headers=headers)

    def get(self, request, format=None):
        print("\n\nGARMIN CONNECT PUSH GET METHOD CALL\n\n",request.data,"\n\n")
        return Response(status = status.HTTP_200_OK) 

def connect_request_token(request):
    '''
        Request for unauthorized request token and request token secret 
    '''
    req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
    authurl = 'http://connect.garmin.com/oauthConfirm'
    acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
    conskey = 'fc281870-3111-47fd-8576-fc90efef0fb1';
    conssec = 'hZPITG4SuEIXiFdInYs9or8TI9psvroqdGZ';
    session = request.session
    if not 'auth_token' in session and ('state' in session and session['state'])==1:
      session['state'] = 0;

    service = OAuth1Service(
          consumer_key = conskey,
          consumer_secret = conssec,
          request_token_url = req_url,
          access_token_url = acc_url,
          authorize_url = authurl,
          )

    session = request.session
    request_token, request_token_secret = service.get_request_token()

    session['connect_request_token'] = request_token
    session['connect_request_token_secret'] = request_token_secret
    session['state'] = 1
    callback_string = urllib.parse.quote('https://app.jvbwellness.com/callbacks/garminconnect')
    return redirect(authurl + '?oauth_token={0}&oauth_callback={1}'.format(request_token,callback_string))

def connect_receive_token(request):
    '''
        Request for auth token and token secret. Save them in database for associated user
    '''
    req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
    authurl = 'http://connect.garmin.com/oauthConfirm'
    acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
    conskey = 'fc281870-3111-47fd-8576-fc90efef0fb1';
    conssec = 'hZPITG4SuEIXiFdInYs9or8TI9psvroqdGZ';
    session = request.session

    # oauth_token = request.GET['oauth_token']
    oauth_verifier = request.GET['oauth_verifier']

    service = OAuth1Service(
          consumer_key = conskey,
          consumer_secret = conssec,
          request_token_url = req_url,
          access_token_url = acc_url,
          authorize_url = authurl,
          )

    access_token, access_token_secret = service.get_access_token(session['connect_request_token'],
    session['connect_request_token_secret'],method='POST',data={'oauth_verifier': oauth_verifier},
    header_auth=True)

    # sess = service.get_session((access_token, access_token_secret))

    # Check if token and token secret exist. If exist then update otherwise
    # create new entry in the database
    try:
        token = GarminConnectToken.objects.get(user = request.user)
        if token:    
            token.save(token=access_token,token_secret=access_token_secret)

    except GarminConnectToken.DoesNotExist:
        GarminConnectToken.objects.create(user=request.user,token=access_token,
                                       token_secret=access_token_secret)

    return redirect('/service_connect')