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
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


from rauth import OAuth2Service, OAuth2Session

from .models import FitbitConnectToken,\
					UserFitbitDataSleep,\
					UserFitbitDataHeartRate,\
					UserFitbitDataActivities,\
					UserFitbitDataSteps,\
					FitbitNotifications

def call_push_api(data):
	'''
		This function take the latest created_at from FitbitNotifications and get the data 
	'''
	print("Startes for checking notifications in database")
	updated_data = FitbitNotifications.objects.create(data_notification=data)
	#updated_data = FitbitNotifications.objects.latest('created_at')
	if updated_data:
		service = session_fitbit()
		tokens = FitbitConnectToken.objects.get(user = request.user)
		access_token = tokens.access_token
		session = service.get_session(access_token)
		for i,k in enumerate(updated_data):
			k = ast.literal_eval(k.data_notification)
			date = k[i]['date']
			user_id = k[i]['ownerId']
			data_type = k[i]['collectionType']
			try:
				user = FitbitConnectToken.objects.get(user_id_fitbit=user_id).user
			except FitbitConnectToken.DoesNotExist as e:
				user = None
			call_api(date,user_id,data_type,user,session)
	return HttpResponse('Final return')
	return None

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
			user_id,date_fitbit))
		steps_fitbit = session.get(
		"https://api.fitbit.com/1/user/{}/activities/steps/date/{}/1d.json".format(
			user_id,date_fitbit))
		if activity_fitbit:
			activity_fitbit = activity_fitbit.json()
			store_data(activity_fitbit,user,date,data_type)
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