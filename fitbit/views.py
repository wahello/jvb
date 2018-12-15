import json
import base64
import requests
import webbrowser
import pprint
from datetime import datetime, timedelta , date, time
from decimal import Decimal, ROUND_HALF_UP
import ast
import logging

from django.db.models import Q
from django.shortcuts import render
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .tasks import store_fitbit_data


from rauth import OAuth2Service, OAuth2Session

from .models import FitbitConnectToken,\
					UserFitbitDataSleep,\
					UserFitbitDataHeartRate,\
					UserFitbitDataActivities,\
					UserFitbitDataSteps,\
					FitbitNotifications,\
					UserAppTokens

from hrr.models import (AaCalculations,
					TimeHeartZones,
					AaWorkoutCalculations,
					AA)

from .fitbit_push import store_data,session_fitbit
import quicklook.calculations.converter
from quicklook.calculations.converter.fitbit_to_garmin_converter import fitbit_to_garmin_activities
from django.conf import settings

# Create your views here.
redirect_uri = settings.FITBIT_REDIRECT_URL

def get_client_id_secret(user):
	'''
		This function get the client id and client secret from databse for respective use
		if not then provide jvb app client id,secret
	'''
	try:
		user_app_tokens = UserAppTokens.objects.get(user=user)
		client_id = user_app_tokens.user_client_id
		client_secret = user_app_tokens.user_client_secret
	except:
		client_id = settings.FITBIT_CONSUMER_ID
		client_secret = settings.FITBIT_CONSUMER_SECRET
	return client_id,client_secret

class FitbitPush(APIView):
	'''
		This view will receive fitbit push notification data and 
		call the signal to store that data in database
	'''
	def post(self, request, format="json"):
		data = request.data
		store_fitbit_data.delay(data)
		return Response(status=status.HTTP_204_NO_CONTENT)

	def get(self, request, format="json"):
		verify_codes = ['116ac5efa95d30cb8f4d4118a3a6845e4b16220c8b3839bac4002db982804c3a',
						'4d48c7d06f18f34bb9479af97d4dd82732885d3adbeda22c1ce79c559189900c',
						'5ab5902e4e30d983e32f0927b2e087824b923759f482798a5cb242b59c122afa',
						'c48e07b496216e1016bf5029a6e6089e238d1dcf135a5296607c3a8377308a53',
						'fde3ef2d376adfaa762560aa942fa9e07a96a1a1e5e8e3c711eb1b26df4dc919']
		verification_code = request.query_params
		verify_code = verification_code.get('verify','')
		if verify_code in verify_codes:
			return Response(status = status.HTTP_204_NO_CONTENT)
		else:
			return Response(status = status.HTTP_404_NOT_FOUND)


def refresh_token(user):
	'''
	This function updates the expired tokens in database
	Return: refresh token and access token
	'''
	client_id,client_secret = get_client_id_secret(user)
	# client_id='22CN2D'
	# client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b'
	access_token_url='https://api.fitbit.com/oauth2/token'
	token = FitbitConnectToken.objects.get(user = user)
	refresh_token_acc = token.refresh_token
	client_id_secret = '{}:{}'.format(client_id,client_secret).encode()
	headers = {
		'Authorization':'Basic'+' '+base64.b64encode(client_id_secret).decode('utf-8'),
		'Content-Type':'application/x-www-form-urlencoded'
	}
	data = {
		'grant_type' : 'refresh_token',
		'refresh_token': refresh_token_acc,
	}
	request_data = requests.post(access_token_url,headers=headers,data=data)
	request_data_json = request_data.json()
	print(pprint.pprint(request_data_json))
	token_object = ''
	try:
		token_object = FitbitConnectToken.objects.get(user=user)
		token_object.refresh_token=request_data_json['refresh_token']
		token_object.access_token=request_data_json['access_token']
		token_object.save()
		fetching_data_fitbit(request)
	except:
		logging.exception("message")
	if token_object:
		return (request_data_json['refresh_token'],request_data_json['access_token'])


def fitbit_user_subscriptions(user):
	service = session_fitbit(user)
	tokens = FitbitConnectToken.objects.get(user = user)
	fibtbit_user_id = tokens.user_id_fitbit
	access_token = tokens.access_token
	session = service.get_session(access_token)
	session.post("https://api.fitbit.com/1/user/-/apiSubscriptions/{}.json".format(
		fibtbit_user_id))
	session.post(
	"https://api.fitbit.com/1/user/-/activities/apiSubscriptions/{}-activities.json".format(
		fibtbit_user_id))
	session.post(
	"https://api.fitbit.com/1/user/-/foods/apiSubscriptions/{}-foods.json".format(
		fibtbit_user_id))
	session.post(
	"https://api.fitbit.com/1/user/-/sleep/apiSubscriptions/{}-sleep.json".format(
		fibtbit_user_id))
	session.post(
	"https://api.fitbit.com/1/user/-/body/apiSubscriptions/{}-body.json".format(
		fibtbit_user_id))
	return None

def include_resting_hr(heartrate_fitbit_intraday,heartrate_fitbit):
	try:
		heartrate_fitbit_intraday_json = ''
		heartrate_fitbit_json = ''
		if heartrate_fitbit_intraday:
			heartrate_fitbit_intraday_json = heartrate_fitbit_intraday.json()
		if heartrate_fitbit:
			heartrate_fitbit_json = heartrate_fitbit.json()
		if heartrate_fitbit_intraday_json and heartrate_fitbit_json:
			if heartrate_fitbit_json['activities-heart'][0]["value"].get("restingHeartRate"):
				heartrate_fitbit_intraday_json['activities-heart'][0]["restingHeartRate"] = heartrate_fitbit_json['activities-heart'][0]["value"].get("restingHeartRate")
			return heartrate_fitbit_intraday_json
		elif heartrate_fitbit_json:
			return heartrate_fitbit_json
		else:
			return {}
	except:
		return {}

def api_fitbit(session,date_fitbit):
	'''
	Takes session and start date then call the fitbit api,return the fitbit api
	'''
	heartrate_fitbit_intraday = ''
	heartrate_fitbit = ''
	sleep_fitbit = session.get("https://api.fitbit.com/1.2/user/-/sleep/date/{}.json".format(date_fitbit))
	activity_fitbit = session.get(
	"https://api.fitbit.com/1/user/-/activities/list.json?afterDate={}&sort=asc&limit=10&offset=0".format(
	date_fitbit))
	try:
		heartrate_fitbit_intraday = session.get(
		"https://api.fitbit.com/1/user/-/activities/heart/date/{}/1d/1sec/time/00:00/23:59.json".format(date_fitbit))
	except:
		pass
	heartrate_fitbit_normal = session.get(
		"https://api.fitbit.com/1/user/-/activities/heart/date/{}/1d.json".format(date_fitbit))
	heartrate_fitbit = include_resting_hr(heartrate_fitbit_intraday,heartrate_fitbit_normal)
	try:
		steps_fitbit = session.get(
		"https://api.fitbit.com/1/user/-/activities/steps/date/{}/1d/15min/time/00:00/23:59.json".format(date_fitbit))
	except:
		steps_fitbit = session.get(
		"https://api.fitbit.com/1/user/-/activities/steps/date/{}/1d.json".format(date_fitbit))

	return(sleep_fitbit,activity_fitbit,heartrate_fitbit,steps_fitbit)

def request_token_fitbit(request):
	client_id,client_secret = get_client_id_secret(request.user)
	service = OAuth2Service(
					 client_id=client_id,
					 client_secret=client_secret,
					 access_token_url='https://api.fitbit.com/oauth2/token',
					 authorize_url='https://www.fitbit.com/oauth2/authorize',
					 base_url='https://fitbit.com/api')  

	params = {
		'redirect_uri':redirect_uri,
		'response_type':'code',
		'scope':' '.join(['activity','nutrition','heartrate','location',
						 'profile','settings','sleep','social','weight'])
	}
	url = service.get_authorize_url(**params) 


	return redirect(url)


def receive_token_fitbit(request):
	client_id,client_secret = get_client_id_secret(request.user)
	# client_id='22CN2D'
	# client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b'
	access_token_url='https://api.fitbit.com/oauth2/token'
	authorize_url='https://www.fitbit.com/oauth2/authorize'
	base_url='https://fitbit.com/api'

	authorization_code = request.GET.get('code',None)
	if authorization_code:
		client_id_secret = '{}:{}'.format(client_id,client_secret).encode()
		headers = {
			'Authorization':'Basic'+' '+base64.b64encode(client_id_secret).decode('utf-8'),
			'Content-Type':'application/x-www-form-urlencoded'
		}
		data = {
			'clientId':client_id,
			'grant_type':'authorization_code',
			'redirect_uri':redirect_uri,
			'code':authorization_code
		}
		r = requests.post(access_token_url,headers=headers,data=data)
		
		a = r.json()
		# print(print(a))

		try:
			token = FitbitConnectToken.objects.get(user = request.user)
			#print(token)
			if token:
				setattr(token, "refresh_token", a['refresh_token'])
				setattr(token, "access_token", a['access_token'])
				setattr(token, "user_id_fitbit", a['user_id'])
				token.save()
		except FitbitConnectToken.DoesNotExist:
			FitbitConnectToken.objects.create(
				user=request.user,refresh_token=a['refresh_token'],
				access_token=a['access_token'],user_id_fitbit=a['user_id'])
			fitbit_user_subscriptions(request.user)
		return redirect('/service_connect_fitbit')

def fetching_data_fitbit(request):
	start_date_str = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
	
	service = session_fitbit(request.user)
	tokens = FitbitConnectToken.objects.get(user = request.user)
	access_token = tokens.access_token
	session = service.get_session(access_token)

	date_fitbit = start_date
	sleep_fitbit,activity_fitbit,heartrate_fitbit,steps_fitbit = api_fitbit(session,date_fitbit)

	# checking status
	statuscode = sleep_fitbit.status_code
	#converting str to dict
	sleep_fitbit = sleep_fitbit.json()
	activity_fitbit = activity_fitbit.json()
	heartrate_fitbit = heartrate_fitbit
	steps_fitbit = steps_fitbit.json()
	if statuscode == 401: # if status 401 means fitbit tokens are expired below does generate tokens
		if sleep_fitbit['errors'][0]['errorType'] == 'expired_token': 
			user = request.user
			refresh_token(user)
	fitbit_all_data = {}
	fitbit_all_data['sleep_fitbit'] = sleep_fitbit
	fitbit_all_data['activity_fitbit'] = activity_fitbit
	fitbit_all_data['heartrate_fitbit'] = heartrate_fitbit
	fitbit_all_data['steps_fitbit'] = steps_fitbit

	store_data(fitbit_all_data,request.user,start_date_str,create_notification=None)

	fitbit_data = {"sleep_fitbit":sleep_fitbit,
					"activity_fitbit":activity_fitbit,
					"heartrate_fitbit":heartrate_fitbit,
					"steps_fitbit":steps_fitbit}
	data = json.dumps(fitbit_data)
	return HttpResponse(data,content_type='application/json')

# def refresh_token_fitbit(request):
# 	client_id='22CN2D'
# 	client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b'
# 	access_token_url='https://api.fitbit.com/oauth2/token'
# 	token = FitbitConnectToken.objects.get(user = request.user)
# 	refresh_token_acc = token.refresh_token
# 	client_id_secret = '{}:{}'.format(client_id,client_secret).encode()
# 	headers = {
# 		'Authorization':'Basic'+' '+base64.b64encode(client_id_secret).decode('utf-8'),
# 		'Content-Type':'application/x-www-form-urlencoded'
# 	}
# 	data = {
# 		'grant_type' : 'refresh_token',
# 		'refresh_token': refresh_token_acc,
# 	}
# 	r = requests.post(access_token_url,headers=headers,data=data)
# 	a = r.json()
	#print(type(a))


'''
	jvb 
		client id 		---- 22CN2D
		client secret   ---- e83ed7f9b5c3d49c89d6bdd0b4671b2b
		redirect url    ---- https://app.jvbwellness.com/callbacks/fitbit
	test
		client id 		---- 22CN2D
		client secret   ---- 94d717c6ec36c270ed59cc8b5564166f
		redirect url    ---- http://127.0.0.1:8000/callbacks/fitbit
'''		 

# def call_push_api():
# 	'''
# 		This function takes the notificatin messages which are stored in last 10 min
# 		creates a session
# 	'''
# 	print("Startes for checking notifications in database")
# 	time = datetime.now() - timedelta(minutes=15) 
# 	updated_data = FitbitNotifications.objects.filter(Q(created_at__gte=time))
# 	if updated_data:
# 		service = session_fitbit()
# 		tokens = FitbitConnectToken.objects.get(user = request.user)
# 		access_token = tokens.access_token
# 		session = service.get_session(access_token)
# 		for i,k in enumerate(updated_data):
# 			k = ast.literal_eval(k.data_notification)
# 			date = k[i]['date']
# 			user_id = k[i]['ownerId']
# 			data_type = k[i]['collectionType']
# 			try:
# 				user = FitbitConnectToken.objects.get(user_id_fitbit=user_id).user
# 			except FitbitConnectToken.DoesNotExist as e:
# 				user = None
# 			call_api(date,user_id,data_type,user,session)
# 	return HttpResponse('Final return')
# 	return None

# def call_api(date,user_id,data_type,user,session):
# 	'''
# 		This function call push notification messages and then store in to the 
# 		database

# 	Args: date(date which comes in push message)
# 		  user_id
# 		  data_type(type of data)
# 		  user(user instance)
# 		  session(created sesssion)
# 	Return: returns nothing
# 	'''
# 	if data_type == 'sleep':
# 		sleep_fitbit = session.get(
# 			"https://api.fitbit.com/1.2/user/{}/{}/date/{}.json".format(
# 			user_id,data_type,date))
# 		sleep_fitbit = sleep_fitbit.json()
# 		store_data(sleep_fitbit,user,date,data_type='sleep_fitbit')
# 	elif data_type == 'activities':
# 		activity_fitbit = session.get(
# 		"https://api.fitbit.com/1/user/{}/activities/list.json?afterDate={}&sort=asc&limit=10&offset=0".format(
# 			user_id,date))
# 		heartrate_fitbit = session.get(
# 		"https://api.fitbit.com/1/user/{}/activities/heart/date/{}/1d.json".format(
# 			user_id,date_fitbit))
# 		steps_fitbit = session.get(
# 		"https://api.fitbit.com/1/user/{}/activities/steps/date/{}/1d.json".format(
# 			user_id,date_fitbit))
# 		if activity_fitbit:
# 			activity_fitbit = activity_fitbit.json()
# 			store_data(activity_fitbit,user,date,data_type)
# 		if heartrate_fitbit:
# 			heartrate_fitbit = heartrate_fitbit.json()
# 			store_data(heartrate_fitbit,user,date,data_type="heartrate_fitbit")
# 		if steps_fitbit:
# 			steps_fitbit = steps_fitbit.json()
# 			store_data(steps_fitbit,user,date,data_type="steps_fitbit")
# 	return None
