from datetime import datetime,timezone,timedelta,time
import ast

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
from fitbit.models import UserFitbitDataHeartRate,\
    UserFitbitDataSteps
from quicklook.calculations.calculation_driver import which_device
from quicklook.calculations.garmin_calculation import get_garmin_model_data,\
    activity_step_from_epoch,\
    get_activity_exercise_non_exercise_category
from quicklook.calculations.fitbit_calculation import get_fitbit_model_data

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

    def __convert_timestamp_to_dt(self, dateObj, timestamp):
        h,m,s = map(int, timestamp.strip(' ').split(":"))
        return datetime.combine(dateObj.date(),time(h,m,s))

    def __cal_garmin_heartrate(self,act_date,act_start_epoch,act_end_epoch,utc_offset=0):
        avg_heartrate = None
        act_dt = datetime.strptime(act_date,"%Y-%m-%d")
        act_date_epoch = int(act_dt.replace(tzinfo=timezone.utc).timestamp())
        dailies_data = get_garmin_model_data(
            UserGarminDataDaily,self.request.user,
            act_date_epoch,act_date_epoch+86400,
            order_by = '-start_time_duration_in_seconds'
        )
        if dailies_data:
            dailies_data = ast.literal_eval(dailies_data[0])
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
                    hr.append(hr_samples.get(str(sec)))
                hr = list(filter(lambda x:x is not None, hr))
                try:
                    avg_heartrate = round(sum(hr)/len(hr))
                except ZeroDivisionError:
                    avg_heartrate = None
        return avg_heartrate

    def __get_fitbit_hr_between_timeframe(self,act_date,act_start,act_end,heartrate_data):
        hr_in_timeframe = []
        act_start_time_in_sec_from_midnight = (act_start - act_date).seconds
        act_end_time_in_sec_from_midnight = (act_end - act_date).seconds
        for hr_sample in heartrate_data:
            sample_time_in_sec_from_midnight = (self.__convert_timestamp_to_dt(
                act_date,hr_sample['time']) - act_date).seconds
            if(sample_time_in_sec_from_midnight >= act_start_time_in_sec_from_midnight
                and sample_time_in_sec_from_midnight <= act_end_time_in_sec_from_midnight):
                hr_in_timeframe.append(hr_sample)
        return hr_in_timeframe

    def __cal_fitbit_heartrate(self,act_date,act_start_epoch,act_end_epoch,utc_offset=0):
        avg_heartrate = None
        act_dt = datetime.strptime(act_date,"%Y-%m-%d")
        act_start_dt = datetime.utcfromtimestamp(act_start_epoch+utc_offset)
        act_end_dt = datetime.utcfromtimestamp(act_end_epoch+utc_offset)
        heartrate_data = get_fitbit_model_data(
        UserFitbitDataHeartRate,self.request.user,act_dt.date(),act_dt.date())
        if heartrate_data:
            heartrate_data = ast.literal_eval(heartrate_data[0].replace(
                    "'heartrate_fitbit': {...}","'heartrate_fitbit': {}"))
            intraday_heartrate_data = heartrate_data.get('activities-heart-intraday',None)
            if(intraday_heartrate_data):
                hr = []
                intraday_heartrate_data = intraday_heartrate_data.get('dataset',[])
                hr_in_timeframe = self.__get_fitbit_hr_between_timeframe(
                    act_dt,act_start_dt,act_end_dt,intraday_heartrate_data)
                for hr_sample in hr_in_timeframe:
                    hr.append(hr_sample.get('value'))
                hr = list(filter(lambda x:x is not None, hr))
                try:
                    avg_heartrate = round(sum(hr)/len(hr))
                except ZeroDivisionError:
                    avg_heartrate = None
        return avg_heartrate


    def get_heartrate(self,act_date,act_start_epoch,act_end_epoch,utc_offset=0):
        if which_device(self.request.user) == 'garmin':
            return self.__cal_garmin_heartrate(
                act_date,act_start_epoch,act_end_epoch,utc_offset)
        elif which_device(self.request.user) == 'fitbit':
            return self.__cal_fitbit_heartrate(
                act_date,act_start_epoch,act_end_epoch,utc_offset)

        return None

    def __cal_garmin_steps(self,act_date,act_start_epoch,act_end_epoch,utc_offset=0):
        steps = None
        act_dt = datetime.strptime(act_date,"%Y-%m-%d")
        act_date_epoch = int(act_dt.replace(tzinfo=timezone.utc).timestamp())
        epoch_data = get_garmin_model_data(
            UserGarminDataEpoch,self.request.user,
            act_date_epoch,act_date_epoch+86400,
            order_by ='-id',filter_dup = True
        )
        if epoch_data:
            act_start_dt = datetime.utcfromtimestamp(act_start_epoch+utc_offset)
            act_end_dt = datetime.utcfromtimestamp(act_end_epoch+utc_offset)
            epoch_data = [ast.literal_eval(x) for x in epoch_data]
            steps = activity_step_from_epoch(act_start_dt,act_end_dt,epoch_data)
        return steps

    def get_steps(self,act_date,act_start_epoch,act_end_epoch,utc_offset=0):
        if which_device(self.request.user) == 'garmin':
            return self.__cal_garmin_steps(
                act_date,act_start_epoch,act_end_epoch,utc_offset)
        elif which_device == 'fitbit':
            pass

        return None

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
            avg_heartrate = self.get_heartrate(act_date,
                act_start_epoch,act_end_epoch,utc_offset)
            steps = self.get_steps(act_date,
                act_start_epoch,act_end_epoch,utc_offset)
            activity_category = get_activity_exercise_non_exercise_category(
                act_type, avg_heartrate,user.profile.age())
            response = {
                "avg_heartrate":avg_heartrate,
                "activity_category":activity_category,
                "steps":steps
            }
            return Response(response,status=status.HTTP_200_OK)
        else:
            response = {}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)