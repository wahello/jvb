import json 
import re

from django.contrib.auth.models import User

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
					UserGarminDataStressDetailSerializer

from .models import UserGarminDataEpoch,\
					UserGarminDataSleep,\
					UserGarminDataBodyComposition,\
					UserGarminDataDaily,\
					UserGarminDataActivity,\
					UserGarminDataManuallyUpdated,\
					UserGarminDataStressDetails


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

class UserGarminDataStressDetails(generics.ListCreateAPIView):
	permission_classes = (IsAuthenticated,)
	queryset = UserGarminDataStressDetails.objects.all()
	serializer_class = UserGarminDataStressDetailSerializer

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)

class PullGarminData(APIView):
	'''
		this view will pull data from API and store
		it into the database

		TODO: 
		1) Making it generic, currently it pulls data of 
		   19 Aug 2017 
	'''
	permission_classes = (IsAuthenticated,)
	DATA_TYPES = {
				"DAILY_SUMMARIES":"dailies",
				"ACTIVITY_SUMMARIES":"activities",
				"MANUALLY_UPDATED_ACTIVITY_SUMMARIES":"manuallyUpdatedActivities",
				"EPOCH_SUMMARIES":"epochs",
				"SLEEP_SUMMARIES":"sleeps",
				"BODY_COMPOSITION":"bodyComps",
			}

	MODEL_TYPES = {
		"dailies":UserGarminDataDaily,
		"activities":UserGarminDataActivity,
		"manuallyUpdatedActivities":UserGarminDataManuallyUpdated,
		"epochs":UserGarminDataEpoch,
		"sleeps":UserGarminDataSleep,
		"bodyComps":UserGarminDataBodyComposition
	}

	def _createObjectList(self, json_data, dtype):
		'''
			Helper method of bulk_create method to create model
			objects for each data dictionary in json data received
		'''
		if len(json_data):
			model = self.MODEL_TYPES[dtype]
			record_date = int(self.request.GET.get('start_date'))
			objects = [
				model(user=self.request.user,
					  summary_id=obj.get("summaryId"),
					  record_date_in_seconds=record_date,
					  start_time_in_seconds=obj.get("startTimeInSeconds"),
					  start_time_duration_in_seconds=obj.get("durationInSeconds"),
					  data = obj)
				for obj in json_data
			]

			return objects


	def get(self, request, format="json"):
		req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
		authurl = 'http://connect.garmin.com/oauthConfirm'
		acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
		conskey = '6c1a770b-60b9-4d7e-83a2-3726080f5556';
		conssec = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9';

		startDateTimeInSeconds = int(request.GET.get('start_date'))
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
			'uploadEndTimeInSeconds': startDateTimeInSeconds+86300,
			}

			ROOT_URL = 'https://healthapi.garmin.com/wellness-api/rest/{}'

			# For local testing only! 
			# json_data = None
			# with open('test_data.json') as data:
			# 	json_data = json.load(data)

			for dtype in self.DATA_TYPES.values():

				URL = ROOT_URL.format(dtype)
				r = sess.get(URL, header_auth=True, params=data)

				self.MODEL_TYPES[dtype].objects.bulk_create(
					self._createObjectList(r.json(),dtype)
				)

				# For local testing only! 
				# self.MODEL_TYPES[dtype].objects.bulk_create(
				# 	self._createObjectList(json_data,dtype)
				# )
			return Response(status=status.HTTP_201_CREATED)
		else:
			return Response(status.HTTP_401_UNAUTHORIZED)

class GarminPing(APIView):
	'''
		This view will receive PING API data and 
		send that data to email address : atulk@s7inc.cm
	'''

	DATA_TYPES = {
				"DAILY_SUMMARIES":"dailies",
				"ACTIVITY_SUMMARIES":"activities",
				"MANUALLY_UPDATED_ACTIVITY_SUMMARIES":"manuallyUpdatedActivities",
				"EPOCH_SUMMARIES":"epochs",
				"SLEEP_SUMMARIES":"sleeps",
				"BODY_COMPOSITION":"bodyComps",
				"STRESS_DETAILS":"stressDetails"
			}

	MODEL_TYPES = {
		"dailies":UserGarminDataDaily,
		"activities":UserGarminDataActivity,
		"manuallyUpdatedActivities":UserGarminDataManuallyUpdated,
		"epochs":UserGarminDataEpoch,
		"sleeps":UserGarminDataSleep,
		"bodyComps":UserGarminDataBodyComposition,
		"stressDetails":UserGarminDataStressDetails
	}

	def _createObjectList(self,user,json_data,dtype,record_dt):
		'''
			Helper method to create instance of model
		'''
		if len(json_data):
			model = self.MODEL_TYPES[dtype]
			record_date = record_dt
			objects = [
				model(user=user,
					  summary_id=obj.get("summaryId"),
					  record_date_in_seconds=record_date,
					  start_time_in_seconds=obj.get("startTimeInSeconds"),
					  start_time_duration_in_seconds=obj.get("durationInSeconds"),
					  data = obj)
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
				
				sess = service.get_session((access_token, access_token_secret))

				r = sess.get(callback_url, header_auth=True)
				upload_start_time = int(re.search('uploadStartTimeInSeconds=(\d+)*',
									callback_url).group(1))
				obj_list = self._createObjectList(user, r.json(), dtype,upload_start_time)

				self.MODEL_TYPES[dtype].objects.bulk_create(obj_list)

		return Response(status = status.HTTP_200_OK)