import json
import datetime
import base64
import requests
import webbrowser
import pprint
from datetime import datetime, timedelta , date
import ast
import logging
import time

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
					FitbitNotifications

from .fitbit_push import store_data,session_fitbit


# Create your views here.

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
		verification_code = request.query_params
		verify_code = verification_code.get('verify','')
		if verify_code == '4d48c7d06f18f34bb9479af97d4dd82732885d3adbeda22c1ce79c559189900c':
			return Response(status = status.HTTP_204_NO_CONTENT)
		else:
			return Response(status = status.HTTP_404_NOT_FOUND)


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
	service = session_fitbit()
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

def api_fitbit(session,date_fitbit):
	'''
	Takes session and start date then call the fitbit api,return the fitbit api
	'''
	sleep_fitbit = session.get("https://api.fitbit.com/1.2/user/-/sleep/date/{}.json".format(date_fitbit))
	activity_fitbit = session.get(
	"https://api.fitbit.com/1/user/-/activities/list.json?afterDate={}&sort=asc&limit=1&offset=0".format(
	date_fitbit))
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
			FitbitConnectToken.objects.create(
				user=request.user,refresh_token=a['refresh_token'],
				access_token=a['access_token'],user_id_fitbit=a['user_id'])
			fitbit_user_subscriptions(request.user)
		return redirect('/service_connect_fitbit')

def fetching_data_fitbit(request):
	start_date_str = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
	
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
	activity_fitbit = activity_fitbit.json()
	heartrate_fitbit = heartrate_fitbit.json()
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

class HaveFitbitTokens(APIView):
	'''
	Check availability of fitbit tokens for current user
	'''
	permission_classes = (IsAuthenticated,)
	def get(self,request,format="json"):
		have_tokens = {
			"have_fitbit_tokens":False
		}

		if FitbitConnectToken.objects.filter(user=request.user).exists():
			have_tokens['have_fitbit_tokens'] = True

		return Response(have_tokens,status=status.HTTP_200_OK)