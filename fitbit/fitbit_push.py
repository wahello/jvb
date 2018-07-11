import json
import datetime
import base64
import requests
import webbrowser
import pprint
from datetime import datetime, timedelta , date, timezone
import ast
import logging
import time
from pytz import timezone

from django.db.models import Q
from django.shortcuts import render
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


from rauth import OAuth2Service, OAuth2Session

from .models import FitbitConnectToken,\
					UserFitbitDataSleep,\
					UserFitbitDataHeartRate,\
					UserFitbitDataActivities,\
					UserFitbitDataSteps,\
					FitbitNotifications


def refresh_token_for_notification(user):
	'''
	This function updates the expired tokens in database
	Return: refresh token and access token
	'''
	client_id='22CN46'
	client_secret='94d717c6ec36c270ed59cc8b5564166f'
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
		token_object.refresh_token=request_data_json['refresh_token'],
		token_object.access_token=request_data_json['access_token']
		token_object.save()
	except:
		logging.exception("message")
	if token_object:
		return (request_data_json['refresh_token'],request_data_json['access_token'])

def session_fitbit():
	'''
	return the session 
	'''
	service = OAuth2Service(
					 client_id='22CN46',
					 client_secret='94d717c6ec36c270ed59cc8b5564166f',
					 access_token_url='https://api.fitbit.com/oauth2/token',
					 authorize_url='https://www.fitbit.com/oauth2/authorize',
					 base_url='https://fitbit.com/api')
	return service


def call_push_api(data):
	'''
		This function take the latest created_at from FitbitNotifications and get the data 
	'''
	print("Startes for checking notifications in database")
	create_data = FitbitNotifications.objects.create(data_notification=data)
	# print(FitbitNotifications._meta.get_fields(),"fields")
	updated_data = create_data.data_notification
	# updated_data = FitbitNotifications.objects.latest('created_at')
	if updated_data:
		for i,k in enumerate(updated_data):
			# k = ast.literal_eval(k)
			date = k['date']
			user_id = k['ownerId']
			data_type = k['collectionType']
			try:
				user = FitbitConnectToken.objects.get(user_id_fitbit=user_id).user
			except FitbitConnectToken.DoesNotExist as e:
				user = None
			service = session_fitbit()
			tokens = FitbitConnectToken.objects.get(user = user)
			access_token = tokens.access_token
			token_updated_time = tokens.updated_at
			present_time = datetime.utcnow()
			datetime_obj_utc = present_time.replace(tzinfo=timezone('UTC'))
			check_token_expire = (datetime_obj_utc - token_updated_time).total_seconds()
			session = service.get_session(access_token)
			if check_token_expire < 28800:
				call_api(date,user_id,data_type,user,session)
			else:
				session = get_session_and_access_token(user)
				call_api(date,user_id,data_type,user,session)
	return None

def get_session_and_access_token(user):
	refresh_token,access_token = refresh_token_for_notification(user)
	service = session_fitbit()
	access_token = access_token
	session = service.get_session(access_token)	
	return session

def call_api(date,user_id,data_type,user,session):
	'''
		This function call push notification messages and then store in to the 
		database

	Args: date(date which comes in push message)
		  user_id
		  data_type(type of data)
		  user(user instance)
		  session(created sesssion)
	Return: returns nothing
	'''
	if data_type == 'sleep':
		sleep_fitbit = session.get(
			"https://api.fitbit.com/1.2/user/{}/{}/date/{}.json".format(
			user_id,data_type,date))
		sleep_fitbit = sleep_fitbit.json()
		store_data(sleep_fitbit,user,date,data_type='sleep_fitbit')
	elif data_type == 'activities':
		activity_fitbit = session.get(
		"https://api.fitbit.com/1/user/{}/activities/list.json?afterDate={}&sort=asc&limit=10&offset=0".format(
			user_id,date))
		heartrate_fitbit = session.get(
		"https://api.fitbit.com/1/user/{}/activities/heart/date/{}/1d.json".format(
			user_id,date))
		steps_fitbit = session.get(
		"https://api.fitbit.com/1/user/{}/activities/steps/date/{}/1d.json".format(
			user_id,date))
		if activity_fitbit:
			activity_fitbit = activity_fitbit.json()
			store_data(activity_fitbit,user,date,data_type="activity_fitbit")
		if heartrate_fitbit:
			heartrate_fitbit = heartrate_fitbit.json()
			store_data(heartrate_fitbit,user,date,data_type="heartrate_fitbit")
		if steps_fitbit:
			steps_fitbit = steps_fitbit.json()
			store_data(steps_fitbit,user,date,data_type="steps_fitbit")
	return None

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
				UserFitbitDataSleep.objects.update_or_create(user = user,
					date_of_sleep=date_of_sleep,sleep_data=value,
					defaults={'created_at': start_date})
				print("sleep_fitbit fitbit data successfully")
		except (KeyError, IndexError):
			logging.exception("message")

		try:
			if "activity_fitbit" == key:
				date_of_activity = value['pagination']['afterDate']
				UserFitbitDataActivities.objects.update_or_create(user=user,
					date_of_activities=date_of_activity,activities_data=value,
					defaults={'created_at': start_date,})
				print("activity_fitbit fitbit data successfully")
		except (KeyError, IndexError):
			logging.exception("message")

		try:
			if "heartrate_fitbit" == key:
				date_of_heartrate = value['activities-heart'][0]['dateTime']
				UserFitbitDataHeartRate.objects.update_or_create(user=user,
					date_of_heartrate=date_of_heartrate,heartrate_data=value,
					defaults={'created_at': start_date,})
				print("heartrate_fitbit fitbit data successfully")
		except (KeyError, IndexError):
			logging.exception("message")

		try:
			if "steps_fitbit" == key:
				date_of_steps = value['activities-steps'][0]['dateTime']
				instance = UserFitbitDataSteps.objects.update_or_create(user=user,
					date_of_steps=date_of_steps,steps_data=value,
					defaults={'created_at': start_date,})
				print("activities-steps fitbit data successfully")
		except (KeyError, IndexError):
			logging.exception("message")
	return None