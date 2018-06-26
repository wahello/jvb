import json
import datetime
import base64
import requests
import webbrowser
import pprint
from datetime import datetime, timedelta , date
import ast
import logging

from django.db.models import Q
from django.shortcuts import render
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rauth import OAuth2Service, OAuth2Session

from .models import FitbitConnectToken,\
					UserFitbitDataSleep,\
					UserFitbitDataHeartRate,\
					UserFitbitDataActivities,\
					UserFitbitDataSteps,\
					FitbitNotifications


# Create your views here.

class FitbitPush(APIView):
	'''
		This view will receive fitbit push notification data and 
		call the signal to store that data in database
	'''
	def post(self, request, format="json"):
		data = request.data
		FitbitNotifications.objects.create(data_notification=data)
		return Response(status=status.HTTP_204_NO_CONTENT)

	def get(self, request, format="json"):
		return Response(status = status.HTTP_204_NO_CONTENT)



def store_data(fitbit_all_data,user,start_date,data_type=None):
	'''
	this function takes json data as parameter and store in database
	Args: fitbit_all_data should be in dict. If bulk data want to store, all data should be
		  inside dict 
		  user name,start data
	Return: None
	''' 
	if data_type:
		fitbit_all_data[data_type] = fitbit_all_data
	for key,value in fitbit_all_data.items():

		try:
			if "sleep_fitbit" == key: 
				date_of_sleep = value['sleep'][0]['dateOfSleep']
				UserFitbitDataSleep.objects.update_or_create(user=user,
					date_of_sleep=date_of_sleep,sleep_data=value,
					defaults={'created_at': start_date,})
		except (KeyError, IndexError):
			logging.exception("message")

		try:
			if "heartrate_fitbit" == key:
				date_of_heartrate = value['activities-heart'][0]['dateTime']
				UserFitbitDataHeartRate.objects.update_or_create(user=user,
					date_of_heartrate=date_of_heartrate,heartrate_data=value,
					defaults={'created_at': start_date,})
		except (KeyError, IndexError):
			logging.exception("message")

		try:
			if "steps_fitbit" == key:
				date_of_steps = value['activities-steps'][0]['dateTime']
				instance = UserFitbitDataSteps.objects.update_or_create(user=user,
					date_of_steps=date_of_steps,steps_data=value,
					defaults={'created_at': start_date,})
		except (KeyError, IndexError):
			logging.exception("message")
	return None

def refresh_token(user):
	'''
	This function updates the expired tokens in database
	Return: refresh token and access token
	'''
	client_id='22CN2D'
	client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b'
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
		token_object = FitbitConnectToken.objects.filter(user=user).update(
			refresh_token=request_data_json['refresh_token'],
			access_token=request_data_json['access_token']
		)
		fetching_data_fitbit(request)
	except:
		logging.exception("message")
	if token_object:
		return (request_data_json['refresh_token'],request_data_json['access_token'])

def session_fitbit():
	'''
	return the session 
	'''
	service = OAuth2Service(
					 client_id='22CN2D',
					 client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b',
					 access_token_url='https://api.fitbit.com/oauth2/token',
					 authorize_url='https://www.fitbit.com/oauth2/authorize',
					 base_url='https://fitbit.com/api')
	return service

def api_fitbit(session,date_fitbit):
	'''
	Takes session and start date then call the fitbit api,return the fitbit api
	'''
	sleep_fitbit = session.get("https://api.fitbit.com/1.2/user/-/sleep/date/{}.json".format(date_fitbit))
	activity_fitbit = session.get("https://api.fitbit.com/1/user/-/activities/date/{}.json".format(date_fitbit))
	heartrate_fitbit = session.get("https://api.fitbit.com/1/user/-/activities/heart/date/{}/1d.json".format(date_fitbit))
	steps_fitbit = session.get("https://api.fitbit.com/1/user/-/activities/steps/date/{}/1d.json".format(date_fitbit))

	return(sleep_fitbit,activity_fitbit,heartrate_fitbit,steps_fitbit)

def request_token_fitbit(request):
	service = OAuth2Service(
					 client_id='22CN2D',
					 client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b',
					 access_token_url='https://api.fitbit.com/oauth2/token',
					 authorize_url='https://www.fitbit.com/oauth2/authorize',
					 base_url='https://fitbit.com/api')  

	params = {
		'redirect_uri':'https://app.jvbwellness.com/callbacks/fitbit',
		'response_type':'code',
		'scope':' '.join(['activity','nutrition','heartrate','location',
						 'profile','settings','sleep','social','weight'])
	}
	url = service.get_authorize_url(**params) 


	return redirect(url)


def receive_token_fitbit(request):
	client_id='22CN2D'
	client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b'
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
			'redirect_uri':'https://app.jvbwellness.com/callbacks/fitbit',
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
			FitbitConnectToken.objects.create(user=request.user,refresh_token=a['refresh_token'],access_token=a['access_token'],user_id_fitbit=a['user_id'])
		return redirect('/service_connect_fitbit')

def fetching_data_fitbit(request):
	start_date = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date, "%m-%d-%Y").date()
	
	service = session_fitbit()
	tokens = FitbitConnectToken.objects.get(user = request.user)
	access_token = tokens.access_token
	session = service.get_session(access_token)

	date_fitbit = start_date
	sleep_fitbit,activity_fitbit,heartrate_fitbit,steps_fitbit = api_fitbit(session,date_fitbit)

	# checking status
	statuscode = sleep_fitbit.status_code
	#converting str to dict
	sleep_fitbit = sleep_fitbit.json()
	heartrate_fitbit = heartrate_fitbit.json()
	steps_fitbit = steps_fitbit.json()

	if statuscode == 401: # if status 401 means fitbit tokens are expired below does generate tokens
		if sleep_fitbit['errors'][0]['errorType'] == 'expired_token':
			user = request.user
			refresh_token(user)
	fitbit_all_data = {}
	fitbit_all_data['sleep_fitbit'] = sleep_fitbit
	fitbit_all_data['heartrate_fitbit'] = heartrate_fitbit
	fitbit_all_data['steps_fitbit'] = steps_fitbit

	store_data(fitbit_all_data,request.user,start_date)

	fitbit_data = {"sleep_fitbit":sleep_fitbit,
					"heartrate_fitbit":heartrate_fitbit,
					"steps_fitbit":steps_fitbit}
	data = json.dumps(fitbit_data)
	return HttpResponse(data,content_type='application/json')

def refresh_token_fitbit(request):
	client_id='22CN2D'
	client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b'
	access_token_url='https://api.fitbit.com/oauth2/token'
	token = FitbitConnectToken.objects.get(user = request.user)
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
	r = requests.post(access_token_url,headers=headers,data=data)
	a = r.json()
	#print(type(a))


'''
	jvb 
		client id 		---- 22CN2D
		client secret   ---- e83ed7f9b5c3d49c89d6bdd0b4671b2b
		redirect url    ---- https://app.jvbwellness.com/callbacks/fitbit
	test
		client id 		---- 22CN46
		client secret   ---- 94d717c6ec36c270ed59cc8b5564166f
		redirect url    ---- http://127.0.0.1:8000/callbacks/fitbit
'''		 

def call_push_api():
	
	time = datetime.now() - timedelta(minutes=15)
	updated_data = FitbitNotifications.objects.filter(Q(created_at__gte=time))
	if updated_data:

		for i,k in enumerate(updated_data):
			date = k[i]['date']
			user_id = k[i]['ownerId']
			data_type = k[i]['collectionType']
			user = FitbitConnectToken.objects.get(user_id_fitbit=user_id)
			call_api(date,user_id,data_type,user)


def call_api(date,user_id,data_type,user):

	if data_type == 'sleep':
		sleep_fitbit = session.get(
			"https://api.fitbit.com/1.2/user/{}/{}/date/{}.json".format(
			user_id,data_type,date))
		sleep_fitbit = sleep_fitbit.json()
		store_data(sleep_fitbit,user,date,data_type)
	elif data_type == 'activities':
		activity_fitbit = session.get(
		"https://api.fitbit.com/1/user/{}/activities/list.json?afterDate={}&sort=asc&limit=10&offset=0".format(
			user_id,date))
		heartrate_fitbit = session.get(
		"https://api.fitbit.com/1/user/{}/activities/heart/date/{}/1d.json".format(
			user_id,date_fitbit))
		steps_fitbit = session.get(
		"https://api.fitbit.com/1/user/{}/activities/steps/date/{}/1d.json".format(
			user_id,date_fitbit))
		if activity_fitbit:
			activity_fitbit = activity_fitbit.json()
			store_data(activity_fitbit,user,date,data_type)
		if heartrate_fitbit:
			heartrate_fitbit = heartrate_fitbit.json()
			store_data(heartrate_fitbit,user,date,data_type)
		if steps_fitbit:
			steps_fitbit = steps_fitbit.json()
			store_data(steps_fitbit,user,date,data_type)
	
