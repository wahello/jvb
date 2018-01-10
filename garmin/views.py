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

from .tasks import store_health_data

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
        call the celery taks to store that data in database
    '''
    def post(self, request, format="json"):
        store_health_data.delay(request.data)
        return Response(status=status.HTTP_200_OK)
        
    def get(self, request, format="json"):
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

class fetchGarminBackFillData(APIView):

  '''
  fetch data from db for specified date, otherwise
  pull directly from api and display raw data
  '''
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
    # data_of_joined = User.objects.filter('date_joined')
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
        'uploadEndTimeInSeconds':startDateTimeInSeconds-7776000
      }
      print(data)
    
