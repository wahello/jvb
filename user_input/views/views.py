from datetime import datetime,timezone,timedelta

from django.db.models import Q
from django.db import IntegrityError

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication 
from rest_framework import status

from user_input.serializers import UserDailyInputSerializer, DailyActivitySerializer
from user_input.models import UserDailyInput, DailyActivity
from garmin.models import UserGarminDataEpoch,\
    UserGarminDataDaily
from quicklook.calculations.calculation_driver import which_device
from quicklook.calculations.garmin_calculation import get_garmin_model_data

# https://stackoverflow.com/questions/30871033/django-rest-framework-remove-csrf
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return

class UserDailyInputView(generics.ListCreateAPIView):

    '''
        - Create the userDailyInput instance
        - List all the userDailyInput instance
        - If query parameters "to" and "from" are provided
          then filter the userDailyInput data for provided date interval
          and return the list
    '''
    #authentication_classes = (CsrfExemptSessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserDailyInputSerializer

    def get_queryset(self):
        user = self.request.user
        start_dt = self.request.query_params.get('from',None)
        end_dt = self.request.query_params.get('to',None)

        if start_dt and end_dt:
            return UserDailyInput.objects.filter(Q(created_at__gte=start_dt)&
                                                 Q(created_at__lte=end_dt),
                                                 user = user)
        else:
            return UserDailyInput.objects.all()

    def create(self, request,*args,**kwargs):
        try:
            return super(UserDailyInputView,self).create(request,*args,**kwargs)
        except IntegrityError as e:
            # if user inputs is already present on date of submission
            response_data = {
                'status':'error',
                'message':'User input already present on {}'.format(
                    request.data.get('created_at')
                )
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

class UserDailyInputItemView(generics.RetrieveUpdateDestroyAPIView):
    '''
        GET for getting particular model instance
        PUT for updating particular model instance
        DELETE for deleting particular model instance
        
        -displays only current user data not others (for now)
        -search item based on provided date
    '''
    permission_classes = (IsAuthenticated,)
    serializer_class = UserDailyInputSerializer

    def get_queryset(self):
        user = self.request.user
        qs = UserDailyInput.objects.filter(user=user)
        return qs

    def get_object(self):
        qs = self.get_queryset()
        if self.request.method == 'GET':
            dt = self.request.GET.get('created_at')
        if self.request.method == 'PUT':
            dt = self.request.data.get('created_at')
        try:
            obj = qs.get(created_at=dt)
            return obj
        except UserDailyInput.DoesNotExist:
            return None

    def get(self,request, format=None):
        user_input = self.get_object()
        if user_input:
            serializers = UserDailyInputSerializer(user_input)
            return Response(serializers.data)
        else:
            return Response({})

class UserDailyInputLatestItemView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        date = self.request.query_params.get('date',None)
        if date:
            qs = UserDailyInput.objects.filter(
                created_at__lt = date 
            ).order_by('-created_at')
        else:
            qs = UserDailyInput.objects.filter(
            ).order_by('-created_at')
        return qs 

    def get_object(self):
        qs = self.get_queryset()
        try:
            obj = qs.filter(user = self.request.user)
            if obj:
                return obj[0]
            else:
                None
        except UserDailyInput.DoesNotExist:
            return None

    def get(self, request, format="json"):
        latest_userinput = self.get_object()
        if latest_userinput:
            serializer = UserDailyInputSerializer(latest_userinput)
            return Response(serializer.data)
        else:
            return Response({})

class DailyActivityView(generics.ListCreateAPIView):

    '''
        - Create the DailyActivity instance
        - List all the DailyActivity instance
        - If query parameters "to" and "from" are provided
          then filter the DailyActivity data for provided date interval
          and return the list
    '''
    permission_classes = (IsAuthenticated,)
    serializer_class = DailyActivitySerializer

    def get_queryset(self, format='json'):
        user = self.request.user
        start_dt = self.request.query_params.get('start_date', None)
        end_dt = self.request.query_params.get('end_date', None)

        if start_dt and end_dt:
            return DailyActivity.objects.filter(
                created_at__range=(start_dt,end_dt), user=user)
        elif start_dt:
            return DailyActivity.objects.filter(
                created_at=start_dt, user=user)
        else:
            return DailyActivity.objects.all()

class GetManualActivityInfo(APIView):
    permission_classes = (IsAuthenticated, )

    def __get_nearest_sec(self,sec):
        '''get nearest sec which is multiple of 15'''
        diff = sec % 15
        if(diff > 7):
            return sec + (15-diff)
        else:
            return sec - diff

    def get_heartrate(self,act_date,act_start_epoch,act_end_epoch,utc_offset=0):
        avg_heartrate = None
        if which_device(self.request.user) == 'garmin':
            act_dt = datetime.strptime(act_date,"%Y-%m-%d")
            act_date_epoch = int(act_dt.replace(tzinfo=timezone.utc).timestamp())
            dailies_data = get_garmin_model_data(
                UserGarminDataDaily,self.request.user,
                act_date_epoch,act_date_epoch+86400,
                order_by = '-start_time_duration_in_seconds'
            )
            if(dailies_data):
                dailies_data = dailies_data[0]
                act_start_dt = datetime.utcfromtimestamp(act_start_epoch+utc_offset)
                act_end_dt = datetime.utcfromtimestamp(act_end_epoch+utc_offset)
                act_start_sec_from_midnight = self.__get_nearest_sec(
                    (act_start_dt - act_dt).seconds)
                act_end_sec_from_midnight = self.__get_nearest_sec(
                    (act_end_dt - act_dt).seconds)
                if dailies_data.get('timeOffsetHeartRateSamples',None):
                    hr = []
                    hr_samples = dailies_data.get('timeOffsetHeartRateSamples')
                    for sec in range(act_start_sec_from_midnight,act_end_sec_from_midnight+1):
                        hr.append(hr_samples.get(sec))
                    hr = filter(lambda x:x is not None, hr)
                    try:
                        avg_heartrate = sum(hr)/len(hr)
                    except ZeroDivisionError:
                        avg_heartrate = None
            print("Average HR:",avg_heartrate)
            return avg_heartrate

        elif which_device == 'fitbit':
            pass

        return None

    def get_steps(self):
        pass

    def get_exercise_type(self):
        pass

    def get_req_params(self):
        act_date = self.request.query_params.get('date')
        act_start_epoch = self.request.query_params.get('act_start_epoch')
        if(act_start_epoch):
            act_start_epoch = int(act_start_epoch)
        act_end_epoch = self.request.query_params.get('act_end_epoch')
        if(act_end_epoch):
            act_end_epoch = int(act_end_epoch)
        act_type = self.request.query_params.get('act_type')
        utc_offset = self.request.query_params.get('utc_offset')
        if(utc_offset):
            utc_offset = int(utc_offset)
        return (act_date,act_start_epoch,act_end_epoch,act_type,utc_offset)

    def get(self, request, format="json"):
        user = request.user
        act_date,act_start_epoch,act_end_epoch,act_type,utc_offset = self.get_req_params()
        if(act_date,act_start_epoch,act_end_epoch,act_type):
            self.get_heartrate(act_date,act_start_epoch,act_end_epoch,utc_offset)
            return Response({},status=status.HTTP_200_OK)
        else:
            response = {}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)