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
import pytz
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
					FitbitNotifications,\
					UserFitbitDatabody,\
					UserFitbitDatafoods,\
					UserFitbitLastSynced

from quicklook.tasks import generate_quicklook
from garmin.garmin_push import _get_data_start_end_time
from progress_analyzer.tasks import (
	generate_cumulative_instances_custom_range,
	set_pa_report_update_date
)
from django.conf import settings
from quicklook.calculations.converter.fitbit_to_garmin_converter import get_epoch_offset_from_timestamp

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

def refresh_token_for_notification(user):
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
	except:
		logging.exception("message")
	if token_object:
		return (request_data_json['refresh_token'],request_data_json['access_token'])

def session_fitbit(user):
	'''
	return the session 
	'''
	client_id,client_secret = get_client_id_secret(user)
	service = OAuth2Service(
					 client_id=client_id,
					 client_secret=client_secret,
					 access_token_url='https://api.fitbit.com/oauth2/token',
					 authorize_url='https://www.fitbit.com/oauth2/authorize',
					 base_url='https://fitbit.com/api')
	return service
def convert_str_date_obj(date):
	date_obj = datetime.strptime(date, '%Y-%m-%d').date()
	return date_obj

def diff_two_dates(date1,date2):
	diff_dates = date1-date2
	return diff_dates.days

def call_push_api(data):
	'''
		This function take the latest created_at from FitbitNotifications and get the data 
	'''
	print("Startes for checking notifications in database")
	if data:
		for i,k in enumerate(data):
			# k = ast.literal_eval(k)
			
			notification = k
			date = k['date']
			user_id = k['ownerId']
			data_type = k['collectionType']
			try:
				user = FitbitConnectToken.objects.get(user_id_fitbit=user_id).user
			except FitbitConnectToken.DoesNotExist as e:
				user = None
			last_notfy = FitbitNotifications.objects.filter(
				user=user,collection_type=data_type).last()
			if last_notfy:
				last_notfy_date = last_notfy.notification_date
			else:
				last_notfy_date = None
			date_obj = convert_str_date_obj(date)
			if last_notfy_date:
				no_days_diff = diff_two_dates(date_obj,last_notfy_date)
			else:
				no_days_diff = 0
			if user:
				create_notification = FitbitNotifications.objects.create(
					user=user,collection_type=data_type,
					notification_date=date,state="unprocessed",notification= notification)
			service = session_fitbit(user)
			tokens = FitbitConnectToken.objects.get(user = user)
			access_token = tokens.access_token
			'''
				--The updated_at will check the time when the access_token is 
				(created or updated)
				--As the access_token expires at every 8Hours. When celery job runs first 
				we will check
				--the access_token is not expries. If it expries we will update 
				the access_token first then
				--run the push notification job.
			'''
			token_updated_time = tokens.updated_at
			present_time = datetime.utcnow()
			datetime_obj_utc = present_time.replace(tzinfo=timezone('UTC'))
			check_token_expire = (datetime_obj_utc - token_updated_time).total_seconds()
			session = service.get_session(access_token)
			if check_token_expire < 28800:
				while no_days_diff >= 0:
					print(date_obj,"date_obj")
					call_api_data =call_api(date_obj,user_id,data_type,user,session,create_notification)
					create_notification = None
					date_obj = date_obj - timedelta(days=1)
					no_days_diff = no_days_diff - 1
			else:
				session = get_session_and_access_token(user)
				while no_days_diff >= 0:
					call_api_data =call_api(date_obj,user_id,data_type,user,session,create_notification)
					create_notification = None
					date_obj = date_obj - timedelta(days=1)
					no_days_diff = no_days_diff - 1

			if call_api_data:
				activities_data = call_api_data.get('activities')	
			else:
				activities_data = None
			if activities_data:
				activity_fitbit = activities_data.get('activity_summary')
			else:
				activity_fitbit = None
			if (user and data_type == 'activities'
				and activity_fitbit
				and activity_fitbit['activities']):
				activity_data = activity_fitbit['activities'][0] 
				start_time = activity_data['originalStartTime']
				offset_conversion = get_epoch_offset_from_timestamp(start_time)
				return fitbit_create_update_sync_time(
					user, present_time, offset_conversion[1])
			else:
				return fitbit_create_update_sync_time(user, present_time, 0)

def fitbit_create_update_sync_time(user, fitbit_sync_time, offset):
	try:
	# If last sync info is already present, update it
		last_sync_obj = UserFitbitLastSynced.objects.get(user=user)
		last_sync_timestamp = last_sync_obj.last_synced_fitbit
		fitbit_sync_time = pytz.utc.localize(fitbit_sync_time)
		if last_sync_timestamp < fitbit_sync_time:
			last_sync_obj.last_synced_fitbit = pytz.utc.localize(
				datetime.utcfromtimestamp(fitbit_sync_time.timestamp()))
			last_sync_obj.offset = offset if offset!=last_sync_obj.offset and offset!=0 else last_sync_obj.offset

			last_sync_obj.save()
	except UserFitbitLastSynced.DoesNotExist as e:
		UserFitbitLastSynced.objects.create(
			user = user,
			last_synced_fitbit = fitbit_sync_time,
			offset = offset if offset else 0)

def get_session_and_access_token(user):
	refresh_token,access_token = refresh_token_for_notification(user)
	service = session_fitbit(user)
	access_token = access_token
	session = service.get_session(access_token)	
	return session

def call_api(date,user_id,data_type,user,session,create_notification=None):
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
	fitbit_pull_data = {}
	if data_type == 'body':
		body_fat_fitbit = session.get(
			"https://api.fitbit.com/1.2/user/{}/{}/log/fat/date/{}.json".format(
			user_id,data_type,date))
		body_fat_fitbit = body_fat_fitbit.json()
		store_data(body_fat_fitbit,user,date,create_notification,data_type='body_fat_fitbit')
		fitbit_pull_data['body_fat'] = body_fat_fitbit
		return fitbit_pull_data
		#print(body_fat_fitbit, "testttttttttttt1")
		# body_weight_fitbit = session.get(
		# 	"https://api.fitbit.com/1/user/{}/body/log/weight/date/{}.json ".format(
		# 	user_id,date))
		# print(body_weight_fitbit, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
		# body_weight_fitbit = body_weight_fitbit.json()
		# print(body_weight_fitbit, "testttttttttttt")

	if data_type == 'foods':
		foods_goal_logs = session.get(
			"https://api.fitbit.com/1/user/{}/{}/log/date/{}.json".format(
			user_id,data_type,date))
		foods_water_logs = session.get(
			"https://api.fitbit.com/1/user/{}/{}/log/water/date/{}.json ".format(
			user_id,data_type,date))
		foods_goal_logs = foods_goal_logs.json()
		store_data(foods_goal_logs,user,date,create_notification,data_type='foods_goal_logs')
		fitbit_pull_data['foods'] = {}
		fitbit_pull_data['foods']['goals'] = foods_goal_logs

		return fitbit_pull_data
		# foods_goal_logs = foods_goal_logs.json()
		# print(foods_goal_logs, "foodssssssssssssss")
		# foods_water_logs = session.get(
		# 	"https://api.fitbit.com/1/user/{}/{}/log/water/date/{}.json ".format(
		# 	user_id,data_type,date))
		# print(foods_water_logs, "waterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
		# foods_water_logs = foods_water_logs.json()
		# print(foods_water_logs, "water11111111111111111111")

	if data_type == 'sleep':
		if create_notification:
			create_notification.state = "processing"
			create_notification.save()
		sleep_fitbit = session.get(
			"https://api.fitbit.com/1.2/user/{}/{}/date/{}.json".format(
			user_id,data_type,date))
		sleep_fitbit = sleep_fitbit.json()
		store_data(sleep_fitbit,user,date,create_notification,data_type='sleep_fitbit')
		fitbit_pull_data['sleep'] = sleep_fitbit
		return fitbit_pull_data
	elif data_type == 'activities':
		if create_notification:
			create_notification.state = "processing"
			create_notification.save()
		fitbit_pull_data['activities'] = {}
		activity_fitbit = session.get(
		"https://api.fitbit.com/1/user/{}/activities/list.json?afterDate={}&sort=asc&limit=10&offset=0".format(
			user_id,date)) 
		# heartrate_fitbit = session.get(
		# "https://api.fitbit.com/1/user/{}/activities/heart/date/{}/1d.json".format(
		# 	user_id,date))
		# steps_fitbit = session.get(
		# "https://api.fitbit.com/1/user/{}/activities/steps/date/{}/1d.json".format(
		# 	user_id,date))
		try:
			heartrate_fitbit_intraday = session.get(
		"https://api.fitbit.com/1/user/{}/activities/heart/date/{}/1d/1sec/time/00:00/23:59.json".format(user_id,date))
		except:
			pass
		heartrate_fitbit_normal = session.get(
			"https://api.fitbit.com/1/user/{}/activities/heart/date/{}/1d.json".format(user_id,date))
		heartrate_fitbit = include_resting_hr(heartrate_fitbit_intraday,heartrate_fitbit_normal)
		try:
			steps_fitbit = session.get(
			"https://api.fitbit.com/1/user/{}/activities/steps/date/{}/1d/15min/time/00:00/23:59.json".format(user_id,date))
		except:
			steps_fitbit = session.get(
			"https://api.fitbit.com/1/user/{}/activities/steps/date/{}/1d.json".format(user_id,date))
		if activity_fitbit:
			activity_fitbit = activity_fitbit.json()
			store_data(activity_fitbit,user,date,create_notification,data_type="activity_fitbit")
			fitbit_pull_data['activities']['activity_summary'] = activity_fitbit
		if heartrate_fitbit:
			# heartrate_fitbit = heartrate_fitbit.json()
			store_data(heartrate_fitbit,user,date,create_notification,data_type="heartrate_fitbit")
			fitbit_pull_data['activities']['heartrate'] = heartrate_fitbit
		if steps_fitbit:
			steps_fitbit = steps_fitbit.json()
			store_data(steps_fitbit,user,date,create_notification,data_type="steps_fitbit")
			fitbit_pull_data['activities']['steps'] = steps_fitbit
		return fitbit_pull_data
		
	return fitbit_pull_data

def update_fitbit_data(user,date,create_notification,data,collection_type):
	'''
	This function updated the fitbit models 
	'''
	if collection_type == "activity_fitbit":
		UserFitbitDataActivities.objects.filter(user=user,
			date_of_activities=date).update(activities_data=data)
	elif collection_type == "sleep_fitbit":
		sleep_instance = UserFitbitDataSleep.objects.filter(user=user,
			date_of_sleep=date)
		sleep_instance.sleep_data = data
		# UserFitbitDataSleep.objects.filter(user=user,
		# 	date_of_sleep=date).update(sleep_data=data)
	elif collection_type == "heartrate_fitbit":
		UserFitbitDataHeartRate.objects.filter(user=user,
			date_of_heartrate=date).update(heartrate_data=data)
	elif collection_type == "steps_fitbit":
		UserFitbitDataSteps.objects.filter(user=user,
			date_of_steps=date).update(steps_data=data)
	elif collection_type == "body_fat_fitbit":
		UserFitbitDatabody.objects.filter(user=user,
			date_of_body=date).update(body_data=data,date_of_body=date)
	elif collection_type == "foods_goal_logs":
		UserFitbitDatafoods.objects.filter(user=user,
			date_of_foods=date).update(foods_data=data,date_of_foods=date.today())
	return None

def get_activities_data(activities, date):
	activities_list = []
	for activity in activities:

		fitbit_date = activity.get("originalStartTime",0)
		fitbit_date = fitbit_date[:10]
		fitbit_date_obj = datetime.strptime(fitbit_date, '%Y-%m-%d').date()
	
		if fitbit_date_obj == date:
			activities_list.append(activity)
	return activities_list

def store_data(fitbit_all_data,user,start_date,create_notification,data_type=None):
	'''
	this function takes json data as parameter and store in database
	Args: fitbit_all_data should be in dict. If bulk data want to store, all data should be
		  inside dict 
		  user name,start data
	Return: None
	'''
	try:
		start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
	except:
		pass
	if data_type:
		fitbit_all_data[data_type] = fitbit_all_data
	for key,value in fitbit_all_data.items():
		try:
			if "sleep_fitbit" == key:
				date_of_sleep = value['sleep'][0]['dateOfSleep']
				sleep_obj = UserFitbitDataSleep.objects.filter(user=user,
					created_at=start_date)
				if sleep_obj:
					# sleep_obj = UserFitbitDataSleep.objects.filter(user=user,
					# created_at=start_date)
					update_fitbit_data(user,date_of_sleep,create_notification,value,key)
					print("Updated sleep-Fitbit successfully")
					if create_notification != None:
						create_notification.state = "processed"
						create_notification.save()
				else:
					UserFitbitDataSleep.objects.create(user=user,
					date_of_sleep=date_of_sleep,
					sleep_data=value,created_at=start_date)
					print("Created sleep-Fitbit successfully")
					if create_notification != None:
						create_notification.state = "processed"
						create_notification.save()
		except (KeyError, IndexError):
			logging.exception("message")
			if create_notification != None:
				create_notification.state = "failed"
				create_notification.save()

		try:
			if "activity_fitbit" == key:
				date_of_activity = value['pagination']['afterDate']
				activities_list = get_activities_data(value["activities"], start_date)
				value = dict({'activities':activities_list})
				
				# if value["activities"]:
				# 	fitbit_date = value['activities'][0].get("originalStartTime",0)
				# 	fitbit_date = fitbit_date[:10]
				# 	fitbit_date_obj = datetime.strptime(
				# 		fitbit_date, '%Y-%m-%d').date()
				# else:
				# 	fitbit_date_obj = 0
				# if fitbit_date_obj == start_date:
				activity_obj = UserFitbitDataActivities.objects.filter(user=user,created_at=start_date)
				if activity_obj:
					update_fitbit_data(user,date_of_activity,create_notification,value,key)
					print("Updated Activity-Fitbit successfully")
					if create_notification != None:
						create_notification.state = "processed"
						create_notification.save()
				else:
					UserFitbitDataActivities.objects.create(user=user,
					date_of_activities=date_of_activity,
					activities_data=value,created_at=start_date)
					print("Created Activity-Fitbit successfully")
					if create_notification != None:
						create_notification.state = "processed"
						create_notification.save()

		except (KeyError, IndexError):
			logging.exception("message")
			if create_notification != None:
				create_notification.state = "failed"
				create_notification.save()

		try:
			if "heartrate_fitbit" == key:
				date_of_heartrate = value['activities-heart'][0]['dateTime']
				heartrate_obj = UserFitbitDataHeartRate.objects.filter(user=user,
					created_at=start_date)
				if heartrate_obj:
					update_fitbit_data(user,date_of_heartrate,create_notification,value,key)
					print("Updated Heartrate-Fitbit successfully")
				else:
					UserFitbitDataHeartRate.objects.create(user=user,
					date_of_heartrate=date_of_heartrate,
					heartrate_data=value,created_at=start_date)
					print("Created heartrate-Fitbit successfully")
		except (KeyError, IndexError):
			logging.exception("message")


		try:
			if "steps_fitbit" == key:
				date_of_steps = value['activities-steps'][0]['dateTime']
				steps_obj = UserFitbitDataSteps.objects.filter(user=user,
					created_at=start_date)
				if steps_obj:
					update_fitbit_data(user,date_of_steps,create_notification,value,key)
					print("Updated steps-Fitbit successfully")
				else:
					UserFitbitDataSteps.objects.create(user=user,
					date_of_steps=date_of_steps,
					steps_data=value,created_at=start_date)
					print("Created steps-Fitbit successfully")
		except (KeyError, IndexError):
			logging.exception("message")

		try:
			if "body_fat_fitbit" == key:
				date_of_body = value['fat'][0]['date']
				body_obj = UserFitbitDatabody.objects.filter(user=user,
					created_at=date_of_body)
				if body_obj:
					update_fitbit_data(user,date_of_body,create_notification,value,key)
					if create_notification != None:
						create_notification.state = "processed"
						create_notification.save()
					print("Updated body_fat_fitbit successfully")
				else:
					UserFitbitDatabody.objects.create(user=user,
					date_of_body=date_of_body,
					body_data=value,created_at=date_of_body)
					print("Created steps-body_fat_fitbit successfully")
					if create_notification != None:
						create_notification.state = "processed"
						create_notification.save()
		except (KeyError, IndexError):
			logging.exception("message")
			if create_notification != None:
				create_notification.state = "failed"
				create_notification.save()	

		try:
			if "foods_goal_logs" == key:
				# date_of_foods = value['activities-steps'][0]['dateTime']
				foods_obj = UserFitbitDatafoods.objects.filter(user=user,
					created_at=datetime.now())
				if foods_obj:
					update_fitbit_data(user,date.today(),create_notification,value,key)
					print("Updated foods_goal_logs successfully")
					if create_notification != None:
						create_notification.state = "processed"
						create_notification.save()
				else:
					UserFitbitDatafoods.objects.create(user=user,
					date_of_foods=date.today(),
					foods_data=value,created_at=datetime.now())
					print("Created  foods_goal_logs successfully")
					if create_notification != None:
						create_notification.state = "processed"
						create_notification.save()
		except (KeyError, IndexError):
			logging.exception("message")
			if create_notification != None:
				create_notification.state = "failed"
				create_notification.save()	
# Call celery task to calculate/recalculate quick look for date to
					# which received data belongs for the target user
	job_to_update_fitbit_raw_data(user, start_date, start_date)
	return None


def job_to_update_fitbit_raw_data(user, start_date, end_date):
	'''
	This function is to run the job to automatically updating the raw data calculation when new fitbit data arrives.
	'''
	str_start_date = start_date.strftime('%Y-%m-%d')
	str_end_date = end_date.strftime('%Y-%m-%d')
	yesterday = datetime.now() - timedelta(days=1)

	if start_date == yesterday.date():
		# if receive yesterday data then update the cumulative sums for yesterday
		# as well.  
		chain = (
			generate_quicklook.si(user.id,str_start_date,str_end_date)|
		 	generate_cumulative_instances_custom_range.si(
		 		user.id,str_start_date,str_start_date
		 	)
		)
		chain.delay()
	elif start_date != datetime.now().date():
		# if received data is not for today (some historical data) then
		# we have to update all the PA report from that date. So we need to record
		# this date in database and update PA later as a celery task
		generate_quicklook.delay(user.id,str_start_date,str_end_date)
		set_pa_report_update_date.delay(
			user.id, 
			str_start_date
		)
	else:
		generate_quicklook.delay(user.id,str_start_date,str_end_date)

