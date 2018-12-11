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
					FitbitNotifications

from .fitbit_push import store_data,session_fitbit
import quicklook.calculations.converter
from quicklook.calculations.converter.fitbit_to_garmin_converter import fitbit_to_garmin_activities

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
	"https://api.fitbit.com/1/user/-/activities/list.json?afterDate={}&sort=asc&limit=10&offset=0".format(
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


def get_time_from_timestamp(time_stamp):
	'''
		This function will accept the timestamp and returns the hours minutes seconds
	Args: Timestamp
	Return: hours:minutes:seconds(string)
	'''
	duration = timedelta(seconds=time_stamp)
	seconds = duration.seconds 
	hours = seconds // 3600                        
	minutes = (seconds % 3600) // 60           
	seconds = (seconds % 60)

	return "{}:{}:{}".format(hours,minutes,seconds)

def convert_timestr_time(start_date):
	hour,minute,sec = start_date.split(':')
	time_obj = time(int(hour),int(minute),int(sec))	
	return time_obj

def get_diff_time(start,end):
	dummydate = date(2000,1,1)
	diff_start_date = datetime.combine(
			dummydate,start) - datetime.combine(
			dummydate,end)
	return diff_start_date

def get_hr_timediff(hr_dataset,start_date,end_date,log_id):
	'''
		Return dict which containes hr values as list and hr time difference as list
		example {logid:{hr_vlaues:[],hr_diff:[]}}
	'''
	start_date_time_obj = convert_timestr_time(start_date)
	end_date_time_obj = convert_timestr_time(end_date)
	dummydate = date(2000,1,1)
	diff_index = 0
	end_activty_time = 1
	start_activty_time = 1
	hr_time_diff = []
	heartrate_time_diff = []
	hr = []
	for index,single_time in enumerate(hr_dataset):
		dataset_time = single_time["time"]
		dateset_time_obj = convert_timestr_time(dataset_time)
		diff_start_date = get_diff_time(start_date_time_obj,dateset_time_obj)
		diff_start_date = diff_start_date.seconds
		if diff_start_date <= 30:
			diff_index = index
			while start_activty_time:
				diff_index = diff_index + 1
				time_near_start = hr_dataset[diff_index]["time"]
				dateset_time_obj = convert_timestr_time(time_near_start)
				diff_start_date = get_diff_time(start_date_time_obj,dateset_time_obj)
				if diff_start_date.seconds == 0 or diff_start_date.days == -1:
					start_activty_time = 0
		if diff_index and diff_index >= index:
			diff_index_end_act = index
			while end_activty_time:
				act_interval_time = hr_dataset[diff_index_end_act]["time"]
				act_interval_hr = hr_dataset[diff_index_end_act]["value"]
				act_pre_interval_time = hr_dataset[diff_index_end_act+1]["time"]
				diff_index_end_act = diff_index_end_act + 1
				act_interval_time_obj = convert_timestr_time(act_interval_time)
				act_pre_interval_time_obj = convert_timestr_time(act_pre_interval_time)
				diff_times = get_diff_time(act_pre_interval_time_obj,act_interval_time_obj)
				hr_time_diff.append(diff_times.seconds)
				hr.append(act_interval_hr)
				diff_times_end_act = get_diff_time(end_date_time_obj,act_interval_time_obj)
				if diff_times_end_act.seconds == 0 or diff_times_end_act.days == -1:
					end_activty_time = 0
					diff_index = 0

	single_activity_dic = {}
	single_activity_dic[log_id] = {}
	single_activity_dic[log_id]["time_diff"] = hr_time_diff
	single_activity_dic[log_id]["hr_values"] = hr
	return single_activity_dic


def fitbit_aa_chart_one(user_get,start_date):
	'''
	Calculate the A/A Aeroboc and Anarobic zones data
	'''

	activity_qs = UserFitbitDataActivities.objects.filter(created_at=start_date,
									user=user_get).values()
	activities_start_end_time = []
	if activity_qs:
		for i in range(0,len(activity_qs)):
			activity_data = ast.literal_eval(activity_qs[i]['activities_data'].replace(
				"'activity_fitbit': {...}","'activity_fitbit': {}"))
			#duration_in_milli_seconds = activity_queryset_data['activities'][0]['originalDuration']
			#duration_in_hr_min_sec = convertMillis(duration_in_milli_seconds)
			for key,activity_list in activity_data.items():
				for index,single_activity in enumerate(activity_list): 
				# print(single_activity,"single_activity")
				# print(index,"index")
					act_duration = activity_data['activities'][index]['originalDuration']
					act_start = activity_data['activities'][index]['originalStartTime']
					act_id = activity_data['activities'][index]['logId']
					activity_start_data,offset = quicklook.calculations.converter.fitbit_to_garmin_converter.get_epoch_offset_from_timestamp(
													act_start)
					act_start_timestamp = activity_start_data + offset
					act_end_timestamp = act_start_timestamp + (act_duration/1000)

					act_start_srt = get_time_from_timestamp(act_start_timestamp)
					act_end_srt = get_time_from_timestamp(act_end_timestamp)
					act_start_end_dict = {}
					act_start_end_dict[act_id] = {}
					act_start_end_dict[act_id]["act_start"] = act_start_srt
					act_start_end_dict[act_id]["act_end"] = act_end_srt
					act_start_end_dict[act_id]["log_id"] = act_id
					activities_start_end_time.append(act_start_end_dict)
			
		# print(activities_start_end_time,"activities_start_end_time")
		return activities_start_end_time

def fitbit_hr_diff_calculation(user_get,start_date):
	'''
		Return list of activities, each activity is dict
	'''
	hr_qs = UserFitbitDataHeartRate.objects.filter(created_at=start_date,
									user=user_get).values_list(
									'heartrate_data',flat=True)
	activity_hr_time = []
	for i,qs in enumerate(hr_qs):
		heartrate_data = ast.literal_eval(qs)
		hr_dataset = heartrate_data.get('activities-heart-intraday').get('dataset')
	activities_start_end_time_list = fitbit_aa_chart_one(user_get,start_date)
	for index,single_activity in enumerate(activities_start_end_time_list):
		single_activity_id = list(single_activity.keys())
		start_date = single_activity[single_activity_id[0]]["act_start"]
		end_date = single_activity[single_activity_id[0]]["act_end"]
		log_id = single_activity[single_activity_id[0]]["log_id"]
		single_activity_hr_time = get_hr_timediff(hr_dataset,start_date,end_date,log_id)
		activity_hr_time.append(single_activity_hr_time)

	#print(activity_hr_time)
	return activity_hr_time

def all_activities_hr_and_time_diff(hr_time_diff):

	all_activities_heartrate_list = []
	all_activities_timestamp_list = []
	for index,single_activity in enumerate(hr_time_diff):
		single_activity_id = list(single_activity.keys())
		all_activities_timestamp_list.extend(single_activity[single_activity_id[0]]["time_diff"])
		all_activities_heartrate_list.extend(single_activity[single_activity_id[0]]["hr_values"])
	return all_activities_heartrate_list,all_activities_timestamp_list

def fitbit_aa_chart_one_new(user_get,start_date):

	hr_time_diff = fitbit_hr_diff_calculation(user_get,start_date)
	all_activities_heartrate_list,all_activities_timestamp_list = all_activities_hr_and_time_diff(hr_time_diff)

	user_age = user_get.profile.age()
	below_aerobic_value = 180-user_age-30
	anaerobic_value = 180-user_age+5
	aerobic_range = '{}-{}'.format(below_aerobic_value,anaerobic_value)
	anaerobic_range = '{} or above'.format(anaerobic_value+1)
	below_aerobic_range = 'below {}'.format(below_aerobic_value	)

	anaerobic_range_list = []
	below_aerobic_list = []
	aerobic_list = []
	for a, b in zip(all_activities_heartrate_list,all_activities_timestamp_list):
		# print(a,"aaaaaaaaa")
		if a > anaerobic_value:
			anaerobic_range_list.extend([b])
		elif a < below_aerobic_value:
			below_aerobic_list.extend([b])
		else:
			aerobic_list.extend([b])

	time_in_aerobic = sum(aerobic_list)
	time_in_below_aerobic = sum(below_aerobic_list)
	time_in_anaerobic = sum(anaerobic_range_list)

	# if hrr_not_recorded_list:
	# 	total_time =  hrr_not_recorded_seconds+time_in_aerobic+time_in_below_aerobic+time_in_anaerobic 
	# else:
	total_time = time_in_aerobic+time_in_below_aerobic+time_in_anaerobic
	try:
		percent_anaerobic = (time_in_anaerobic/total_time)*100
		percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))

		percent_below_aerobic = (time_in_below_aerobic/total_time)*100
		percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))

		percent_aerobic = (time_in_aerobic/total_time)*100
		percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))
		
		# if hrr_not_recorded_list:
		# 	percent_hrr_not_recorded = (hrr_not_recorded_seconds/total_time)*100
		# 	percent_hrr_not_recorded = (int(Decimal(percent_hrr_not_recorded).quantize(0,ROUND_HALF_UP)))
		
		total_percent = 100
	except ZeroDivisionError:
		percent_anaerobic=''
		percent_below_aerobic=''
		percent_aerobic=''
		percent_hrr_not_recorded=''
		total_percent=''
	# if hrr_not_recorded_list and workout:
	# 		data = {"total_time":total_time,
	# 				"aerobic_zone":time_in_aerobic,
	# 				"anaerobic_zone":time_in_anaerobic,
	# 				"below_aerobic_zone":time_in_below_aerobic,
	# 				"aerobic_range":aerobic_range,
	# 				"anaerobic_range":anaerobic_range,
	# 				"below_aerobic_range":below_aerobic_range,
	# 				"hrr_not_recorded":hrr_not_recorded_seconds,
	# 				"percent_hrr_not_recorded":percent_hrr_not_recorded,
	# 				"percent_aerobic":percent_aerobic,
	# 				"percent_below_aerobic":percent_below_aerobic,
	# 				"percent_anaerobic":percent_anaerobic,
	# 				"total_percent":total_percent}
	if all_activities_heartrate_list:
		data = {"total_time":total_time,
				"aerobic_zone":time_in_aerobic,
				"anaerobic_zone":time_in_anaerobic,
				"below_aerobic_zone":time_in_below_aerobic,
				"aerobic_range":aerobic_range,
				"anaerobic_range":anaerobic_range,
				"below_aerobic_range":below_aerobic_range,
				"hrr_not_recorded":None,
				"percent_hrr_not_recorded":None,
				"percent_aerobic":percent_aerobic,
				"percent_below_aerobic":percent_below_aerobic,
				"percent_anaerobic":percent_anaerobic,
				"total_percent":total_percent}
	else:
		data = {"total_time":None,
				"aerobic_zone":None,
				"anaerobic_zone":None,
				"below_aerobic_zone":None,
				"aerobic_range":'',
				"anaerobic_range":'',
				"below_aerobic_range":'',
				"hrr_not_recorded":None,
				"percent_hrr_not_recorded":None,
				"percent_aerobic":None,
				"percent_below_aerobic":None,
				"percent_anaerobic":None,
				"total_percent":None}

	# if user_created_activity_list:
	# 	added_data = add_created_activity1(
	# 		user_created_activity_list,data,below_aerobic_value,anaerobic_value,aerobic_range,anaerobic_range,below_aerobic_range)
	# else:
	# 	added_data = {}
	# # print(added_data,"added_data")
	# if added_data:
	# 	final_data = add_total_percent(added_data)
	# 	return final_data
	# 	print(final_data , "fffffffffffffffffffffffffffffffffffffffffffffffffffffff")
	# print(data)
	return data

def calculate_AA2_workout(user,start_date):
	fibit_activities_qs = UserFitbitDataActivities.objects.filter(
		user=user,created_at=start_date)
	trans_activity_data = []
	if fibit_activities_qs:
		for i in range(0,len(fibit_activities_qs)):
			todays_activity_data = ast.literal_eval(
				fibit_activities_qs[i].activities_data.replace(
				"'activity_fitbit': {...}","'activity_fitbit': {}"))
			todays_activity_data = todays_activity_data.get('activities')
			if todays_activity_data:
				trans_activity_data.append(list(map(
					fitbit_to_garmin_activities,todays_activity_data)))
	# print(trans_activity_data,"trans_activity_data")
	time_duration = []
	heart_rate = []
	max_hrr = []
	data1={}
	steps = []
	hrr_not_recorded_list = []
	if trans_activity_data[0]:
		start_date_timestamp = trans_activity_data[0][0]['startTimeInSeconds']
		start_date_timestamp = start_date_timestamp +  trans_activity_data[0][0].get("startTimeOffsetInSeconds",0)
		start_date = datetime.utcfromtimestamp(start_date_timestamp)
		date = start_date.strftime('%d-%b-%y')
		for workout in trans_activity_data[0]:
			act_date = date
			summaryId = workout['summaryId']
			workout_type = workout['activityType']
			duration = workout['durationInSeconds']
			time_duration.append(duration)
			avg_heart_rate = workout.get('averageHeartRateInBeatsPerMinute')
			heart_rate.append(avg_heart_rate)
			max_heart_rate = workout.get('maxHeartRateInBeatsPerMinute',0)
			max_hrr.append(max_heart_rate)
			exercise_steps = workout.get("steps",0)
			steps.append(exercise_steps)
			distance_meters = workout.get("distanceInMeters",0)			
			data = {"date":act_date,
				  "workout_type":workout_type,
				  "duration":duration,
				  "average_heart_rate":avg_heart_rate,
				  "max_heart_rate":max_heart_rate,
				  "steps":exercise_steps,
				  "hrr_not_recorded":"",
				  "prcnt_hrr_not_recorded":"",
				  "distance_meters":distance_meters
					}
			data1[summaryId] = data 
			if "averageHeartRateInBeatsPerMinute" in workout.keys():
				if workout['averageHeartRateInBeatsPerMinute'] == 0 or "":
					hrr_not_recorded = workout['durationInSeconds']
					hrr_not_recorded_list.append(hrr_not_recorded)
					data['hrr_not_recorded'] = hrr_not_recorded
			else:
				hrr_not_recorded = workout.get('durationInSeconds',0)
				hrr_not_recorded_list.append(hrr_not_recorded)
				data['hrr_not_recorded'] = hrr_not_recorded
		for tm in hrr_not_recorded_list:
			try:
				prcnt_hrr_not_recorded = (tm/sum(time_duration))*100
				prcnt_hrr_not_recorded = int(Decimal(prcnt_hrr_not_recorded).quantize(0,ROUND_HALF_UP))
				data['prcnt_hrr_not_recorded']=prcnt_hrr_not_recorded
			except ZeroDivisionError:
				prcnt_hrr_not_recorded = ""
				data['prcnt_hrr_not_recorded'] = prcnt_hrr_not_recorded

		try:
			heart_rate = [x for x in heart_rate if x != '']
			heart_rate = [x for x in heart_rate if x != 0]
			avg_hrr = sum(filter(lambda i: isinstance(i, int),heart_rate))/len(heart_rate)
			avg_hrr = int(Decimal(avg_hrr).quantize(0,ROUND_HALF_UP))
		except ZeroDivisionError:
			avg_hrr = ""
		try:
			maxi_hrr = max(max_hrr)
		except ValueError:
			maxi_hrr = ''
		time_total = sum(time_duration)
		try:
			total_prcnt_hrr_not_recorded = (sum(hrr_not_recorded_list)/sum(time_duration))*100
			total_prcnt_hrr_not_recorded = int(Decimal(total_prcnt_hrr_not_recorded).quantize(0,ROUND_HALF_UP))
		except ZeroDivisionError:
			total_prcnt_hrr_not_recorded = ""
		total = {"date":date,
				 "workout_type":"Totals",
				 "duration":time_total,
				 "average_heart_rate":avg_hrr,
				 "max_heart_rate":maxi_hrr,
				 "steps":sum(steps),
				 "hrr_not_recorded":sum(hrr_not_recorded_list),
				 "prcnt_hrr_not_recorded":total_prcnt_hrr_not_recorded
				 }
		if total:	
			data1['Totals'] = total
		else:
			data1['Totals'] = {}
	# print(data1,'ddddddddddddddddddd')
	if data1:
		return data1
	else:
		return ({})
	return ({})

def calculate_AA2_daily(user,start_date):
	pass
	# hr_time_diff = fitbit_hr_diff_calculation(user,start_date)
	# # all_activities_heartrate_list,all_activities_timestamp_list = all_activities_hr_and_time_diff(user_get,start_date)

	# all_activities_heartrate = []
	# all_activities_timestamp = []
	# activies_timestamp = []
	# daily_aa_data={}
	# make_dict_to_list = []
	# if hr_time_diff:
	# 	for single_activity in hr_time_diff:
	# 		make_dict_to_list.append(single_activity)
	# 		all_activities_heartrate_list,all_activities_timestamp_list = all_activities_hr_and_time_diff(single_activity)
	# 		make_dict_to_list.pop(0)
	# 		all_activities_heartrate.append(all_activities_heartrate_list)
	# 		all_activities_timestamp.append(all_activities_timestamp_list)
		
	# 	all_activities_heartrate = [single_list for single_list in all_activities_heartrate if single_list]
	# 	all_activities_timestamp = [single_list for single_list in all_activities_timestamp if single_list]
		
	# 	below_aerobic_value = 180-user_age-30
	# 	anaerobic_value = 180-user_age+5
	# 	aerobic_range = '{}-{}'.format(below_aerobic_value,anaerobic_value)
	# 	anaerobic_range = '{} or above'.format(anaerobic_value+1)
	# 	below_aerobic_range = 'below {}'.format(below_aerobic_value)
		
	# 	def individual_activity(heart,time):
	# 		anaerobic_range_list = []
	# 		below_aerobic_list = []
	# 		aerobic_list = []
	# 		for hrt,tm in zip(heart,time):
	# 			if hrt > anaerobic_value:
	# 				anaerobic_range_list.append(tm)
	# 			elif hrt < below_aerobic_value:
	# 				below_aerobic_list.append(tm)
	# 			else:
	# 				aerobic_list.append(tm)
	# 		return aerobic_list,below_aerobic_list,anaerobic_range_list
	# 	aerobic_duration = []
	# 	anaerobic_duration = []
	# 	below_aerobic_duration = []
	# 	total_duration = []
	# 	for i in range(len(all_activities_heartrate)):
	# 		single_activity_file = individual_activity(all_activities_heartrate[i],all_activities_timestamp[i])
	# 		single_activity_list =list(single_activity_file)
	# 		time_in_aerobic = sum(single_activity_list[0])
	# 		aerobic_duration.append(time_in_aerobic)
	# 		time_in_below_aerobic = sum(single_activity_list[1])
	# 		below_aerobic_duration.append(time_in_below_aerobic)
	# 		time_in_anaerobic = sum(single_activity_list[2])
	# 		anaerobic_duration.append(time_in_anaerobic)
	# 		total_time = time_in_aerobic+time_in_below_aerobic+time_in_anaerobic
	# 		total_duration.append(total_time)
			
	# 		try:
	# 			percent_anaerobic = (time_in_anaerobic/total_time)*100
	# 			percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))
			
	# 			percent_below_aerobic = (time_in_below_aerobic/total_time)*100
	# 			percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))
				
	# 			percent_aerobic = (time_in_aerobic/total_time)*100
	# 			percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))
			
	# 			total_percent = 100
	# 		except (ZeroDivisionError):
	# 			percent_anaerobic=''
	# 			percent_below_aerobic=''
	# 			percent_aerobic=''
	# 			total_percent=''
	# 		single_data = {"avg_heart_rate":avg_hrr_list[i],
	# 				"max_heart_rate":max_hrr_list[i],
	# 				"total_duration":total_time,
	# 				"duration_in_aerobic_range":time_in_aerobic,
	# 				"percent_aerobic":percent_aerobic,
	# 				"duration_in_anaerobic_range":time_in_anaerobic,
	# 				"percent_anaerobic":percent_anaerobic,
	# 				"duration_below_aerobic_range":time_in_below_aerobic,
	# 				"percent_below_aerobic":percent_below_aerobic,
	# 				"duration_hrr_not_recorded":hrr_not_recorded_list[i],
	# 				"percent_hrr_not_recorded":prcnt_hrr_not_recorded_list[i]
	# 				}
	# 		# print(single_data,"single_data")
	# 		daily_aa_data[str(data_summaryid[i])] = single_data
	# 		# print(daily_aa_data,"daily_aa_data")
	# 	try:
	# 		total_prcnt_anaerobic = (sum(anaerobic_duration)/sum(total_duration)*100)
	# 		total_prcnt_anaerobic = int(Decimal(total_prcnt_anaerobic).quantize(0,ROUND_HALF_UP))
	# 		total_prcnt_below_aerobic = (sum(below_aerobic_duration)/sum(total_duration)*100)
	# 		total_prcnt_below_aerobic = int(Decimal(total_prcnt_below_aerobic).quantize(0,ROUND_HALF_UP))
	# 		total_prcnt_aerobic = (sum(aerobic_duration)/sum(total_duration)*100)
	# 		total_prcnt_aerobic = int(Decimal(total_prcnt_aerobic).quantize(0,ROUND_HALF_UP))
	# 	except (ZeroDivisionError,IndexError):
	# 		total_prcnt_anaerobic = ''
	# 		total_prcnt_below_aerobic = ''
	# 		total_prcnt_aerobic = ''

	# 	total =  {"avg_heart_rate":avg_hrr,
	# 			  "max_heart_rate":max_hrr,
	# 			  "total_duration":sum(total_duration),
	# 			  "duration_in_aerobic_range":sum(aerobic_duration),
	# 			  "duration_in_anaerobic_range":sum(anaerobic_duration),
	# 			  "duration_below_aerobic_range":sum(below_aerobic_duration),
	# 			  "percent_aerobic":total_prcnt_aerobic,
	# 			  "percent_below_aerobic":total_prcnt_below_aerobic,
	# 			  "percent_anaerobic":total_prcnt_anaerobic,
	# 			  "duration_hrr_not_recorded":sum(hrr_not_recorded_list),
	# 			  "percent_hrr_not_recorded":sum(prcnt_hrr_not_recorded_list)
	# 				}
	# 	if total:
	# 		daily_aa_data['Totals'] = total
	# 	else:
	# 		daily_aa_data['Totals'] = {}
	# 	return daily_aa_data
	# else:
	# 	return {}