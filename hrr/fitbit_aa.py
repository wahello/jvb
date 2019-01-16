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
from rauth import OAuth2Service, OAuth2Session

from fitbit.models import FitbitConnectToken,\
					UserFitbitDataSleep,\
					UserFitbitDataHeartRate,\
					UserFitbitDataActivities,\
					UserFitbitDataSteps,\
					FitbitNotifications,\
					UserAppTokens

from hrr.models import (AaCalculations,
					TimeHeartZones,
					AaWorkoutCalculations,
					AA, TwentyfourHourAA, 
					TwentyfourHourTimeHeartZones)

import quicklook.calculations.converter
from quicklook.calculations.converter.fitbit_to_garmin_converter import fitbit_to_garmin_activities


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
					# print(dateset_time_obj,"Start date")
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
					# print(act_interval_time_obj,"End date")
					end_activty_time = 0
					diff_index = 0
					hr_time_diff = hr_time_diff[1:-4]
					hr = hr[1:-4]

	single_activity_dic = {}
	single_activity_dic[log_id] = {}
	single_activity_dic[log_id]["time_diff"] = hr_time_diff
	single_activity_dic[log_id]["hr_values"] = hr
	
	return single_activity_dic

def get_hrr_timediff(hr_dataset,start_date,end_date):
	hr = []
	hr_time_diff = []
	start_date_time_obj = convert_timestr_time(start_date)
	end_date_time_obj = convert_timestr_time(end_date)
	for index, single_time in enumerate(hr_dataset):
		act_interval_time = hr_dataset[index]["time"]
		act_interval_hr = hr_dataset[index]["value"]
		act_interval_time_obj = convert_timestr_time(act_interval_time)

		# if index == 0:
		# 	# diff_times = get_diff_time(act_interval_time_obj, start_date_time_obj)
		# 	diff_times = 10
		# 	hr_time_diff.append(diff_times)

		if index == len(hr_dataset)-1:
			diff_times = get_diff_time(end_date_time_obj, act_interval_time_obj)
			hr_time_diff.append(diff_times.seconds)

		else:
			act_pre_interval_time = hr_dataset[index+1]["time"]
			act_pre_interval_time_obj = convert_timestr_time(act_pre_interval_time)
			diff_times = get_diff_time(act_pre_interval_time_obj, act_interval_time_obj)
			hr_time_diff.append(diff_times.seconds)
		hr.append(act_interval_hr)
		index += 1
	return {'time_diff': hr_time_diff, 'hr_values': hr}

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
		
def get_fitbit_hr_data(user_get,start_date):
	hr_dataset = []
	hr_qs = UserFitbitDataHeartRate.objects.filter(created_at=start_date,
									user=user_get).values_list(
									'heartrate_data',flat=True)
	for i,qs in enumerate(hr_qs):
		try:
			heartrate_data = ast.literal_eval(qs)
		except:
			# print(type(qs),"vvvv")
			qs = ast.literal_eval(qs.replace(
				"'heartrate_fitbit': {...}","'heartrate_fitbit': {}"))
			heartrate_data = qs
		# print(heartrate_data,"heartrate_data")
		hr_dataset = heartrate_data.get('activities-heart-intraday').get('dataset')
	return hr_dataset

def fitbit_hr_diff_calculation(user_get,start_date):
	'''
		Return list of activities, each activity is dict
	'''
	# hr_qs = UserFitbitDataHeartRate.objects.filter(created_at=start_date,
	# 								user=user_get).values_list(
	# 								'heartrate_data',flat=True)
	activity_hr_time = []
	# for i,qs in enumerate(hr_qs):
	# 	heartrate_data = ast.literal_eval(qs)
	# 	hr_dataset = heartrate_data.get('activities-heart-intraday').get('dataset')
	hr_dataset = get_fitbit_hr_data(user_get,start_date)
	activities_start_end_time_list = fitbit_aa_chart_one(user_get,start_date)
	for index,single_activity in enumerate(activities_start_end_time_list):
		single_activity_id = list(single_activity.keys())
		start_date = single_activity[single_activity_id[0]]["act_start"]
		end_date = single_activity[single_activity_id[0]]["act_end"]
		log_id = single_activity[single_activity_id[0]]["log_id"]
		single_activity_hr_time = get_hr_timediff(hr_dataset,start_date,end_date,log_id)
		activity_hr_time.append(single_activity_hr_time)

	return activity_hr_time

def fitbit_hrr_diff_calculation(user_get,start_date):
	'''
		Return list of activities, each activity is dict
	'''
	hr_dataset = get_fitbit_hr_data(user_get,start_date)
	start_date = '00:00:00'
	end_date = '23:58:59'
	day_hr_time = get_hrr_timediff(hr_dataset, start_date, end_date)

	return day_hr_time

def all_activities_hr_and_time_diff(hr_time_diff):

	all_activities_heartrate_list = []
	all_activities_timestamp_list = []
	for index,single_activity in enumerate(hr_time_diff):
		single_activity_id = list(single_activity.keys())
		all_activities_timestamp_list.extend(single_activity[single_activity_id[0]]["time_diff"])
		all_activities_heartrate_list.extend(single_activity[single_activity_id[0]]["hr_values"])
	return all_activities_heartrate_list,all_activities_timestamp_list

def cal_aa1_data(user_get,all_activities_heartrate_list,all_activities_timestamp_list):
	user_age = user_get.profile.age()
	below_aerobic_value = 180-user_age-30
	anaerobic_value = 180-user_age+5
	aerobic_range = '{}-{}'.format(below_aerobic_value,anaerobic_value)
	anaerobic_range = '{} or above'.format(anaerobic_value+1)
	below_aerobic_range = 'below {}'.format(below_aerobic_value)

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

def delete_activity(user_input_activities):
	user_input_activities_copy = user_input_activities.copy()
	for key,single_activity in user_input_activities_copy.items():
		if single_activity.get("duplicate") or single_activity.get("deleted"):
			user_input_activities.pop(key,None)
	return user_input_activities

def fitbit_aa_chart_one_new(user_get,start_date,user_input_activities=None):
	hr_time_diff = fitbit_hr_diff_calculation(user_get,start_date)
	all_activities_heartrate_list,all_activities_timestamp_list = all_activities_hr_and_time_diff(hr_time_diff)
	# print(sum(all_activities_timestamp_list),"all_activities_timestamp_list")
	
	if user_input_activities:
		user_input_activities = delete_activity(user_input_activities)
	data = cal_aa1_data(
		user_get,all_activities_heartrate_list,all_activities_timestamp_list)
	AA_data = AA.objects.filter(user=user_get,created_at=start_date)
	cal_aa1_data(
		user_get,all_activities_heartrate_list,all_activities_timestamp_list)
	if not user_input_activities and not AA_data:
		data = cal_aa1_data(
		user_get,all_activities_heartrate_list,all_activities_timestamp_list)
		return data
	elif  not user_input_activities and AA_data:
		data = cal_aa1_data(
		user_get,all_activities_heartrate_list,all_activities_timestamp_list)
		return data
	elif ((user_input_activities and not AA_data) or
			(user_input_activities and AA_data)):
		ui_act_ids = list(user_input_activities.keys())
		fibit_act = fitbit_aa_chart_one(user_get,start_date)
		if len(ui_act_ids) == len(fibit_act):
			data = cal_aa1_data(
		user_get,all_activities_heartrate_list,all_activities_timestamp_list)
			return data
		else:
			activity_hr_time = get_user_created_activity(user_get,start_date,user_input_activities,fibit_act)
			# user_added_data = get_aa2_daily_data(user,activity_hr_time)
			# data = get_aa2_daily_data(user,hr_time_diff)
			act_hr_list,act_time_list = all_activities_hr_and_time_diff(activity_hr_time)
			all_activities_heartrate_list.extend(act_hr_list)
			all_activities_timestamp_list.extend(act_time_list)
			final_data = cal_aa1_data(
				user_get,all_activities_heartrate_list,all_activities_timestamp_list)
			return final_data
	else:
		return {}

def fitbit_aa_twentyfour_hour_chart_one_new(user_get,start_date,user_input_activities=None):
	hr_time_diff = fitbit_hrr_diff_calculation(user_get,start_date)
	response = fitbit_aa_twentyfour_hour_chart_one(user_get,start_date, hr_time_diff)
	total_time = 86400
	response['hrr_not_recorded'] = total_time-response['total_time']

	percent_anaerobic = (response['anaerobic_zone']/total_time)*100
	percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))

	percent_below_aerobic = (response['below_aerobic_zone']/total_time)*100
	percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))

	percent_aerobic = (response['aerobic_zone']/total_time)*100
	percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))

	percent_hrr_not_recorded = (response['hrr_not_recorded']/total_time)*100
	percent_hrr_not_recorded = int(Decimal(percent_hrr_not_recorded).quantize(0,ROUND_HALF_UP))
	
	response['percent_anaerobic'] = percent_anaerobic
	response['percent_below_aerobic'] = percent_below_aerobic
	response['percent_aerobic'] = percent_aerobic
	response['percent_hrr_not_recorded'] = percent_hrr_not_recorded
	response['total_time'] = total_time
	
	return response

def fitbit_aa_twentyfour_hour_chart_one(user_get,start_date,hr_time_diff, user_input_activities=None):
	all_activities_heartrate_list = hr_time_diff['hr_values']
	all_activities_timestamp_list = hr_time_diff['time_diff']
	# print(sum(all_activities_timestamp_list),"all_activities_timestamp_list")
	if user_input_activities:
		user_input_activities = delete_activity(user_input_activities)
	data = cal_aa1_data(
		user_get,all_activities_heartrate_list,all_activities_timestamp_list)
	AA_data = TwentyfourHourAA.objects.filter(user=user_get,created_at=start_date)
	cal_aa1_data(
		user_get,all_activities_heartrate_list,all_activities_timestamp_list)
	if not user_input_activities and not AA_data:
		data = cal_aa1_data(
		user_get,all_activities_heartrate_list,all_activities_timestamp_list)
		return data
	elif  not user_input_activities and AA_data:
		data = cal_aa1_data(
		user_get,all_activities_heartrate_list,all_activities_timestamp_list)
		return data
	elif ((user_input_activities and not AA_data) or
			(user_input_activities and AA_data)):
		ui_act_ids = list(user_input_activities.keys())
		fibit_act = fitbit_aa_chart_one(user_get,start_date)
		if len(ui_act_ids) == len(fibit_act):
			data = cal_aa1_data(
		user_get,all_activities_heartrate_list,all_activities_timestamp_list)
			return data
		else:
			activity_hr_time = get_user_created_activity(user_get,start_date,user_input_activities,fibit_act)
			# user_added_data = get_aa2_daily_data(user,activity_hr_time)
			# data = get_aa2_daily_data(user,hr_time_diff)
			act_hr_list,act_time_list = all_activities_hr_and_time_diff(activity_hr_time)
			all_activities_heartrate_list.extend(act_hr_list)
			all_activities_timestamp_list.extend(act_time_list)
			final_data = cal_aa1_data(
				user_get,all_activities_heartrate_list,all_activities_timestamp_list)
			return final_data
	else:
		return {}

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
	if trans_activity_data and trans_activity_data[0]:
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

def list_single_activity_hr(data):
	single_activity_id = list(data.keys())
	time_diff = data[single_activity_id[0]]['time_diff']
	hr_values = data[single_activity_id[0]]['hr_values']
	return time_diff,hr_values

def get_aa2_daily_data(user,hr_time_diff):
	all_activities_hr = []
	all_activities_time = []
	daily_aa_data={}
	log_ids = []
	avg_hr = []
	max_hr = []
	user_age = user.profile.age()
	if hr_time_diff:
		for single_activity in hr_time_diff:
			log_ids.extend(list(single_activity.keys()))
			# all_activities_heartrate_list,all_activities_timestamp_list = list_single_activity_hr(single_activity)
			# print(all_activities_heartrate_list,"all_activities_heartrate_list")
			# print(type(all_activities_heartrate_list))
			single_activity_id = list(single_activity.keys())
			# print(single_activity[single_activity_id[0]]['time_diff'],"single_activity[single_activity_id[0]]['time_diff']")
			time_diff = single_activity[single_activity_id[0]]['time_diff']
			hr_values = single_activity[single_activity_id[0]]['hr_values']
			try:
				avg_hr.append(sum(hr_values)/len(hr_values))
			except:
				pass
			try:
				max_hr.append(max(hr_values))
			except:
				pass
			all_activities_hr.append(hr_values)
			all_activities_time.append(time_diff)
		# print(all_activities_heartrate_list,"activities_heartrate_list")
		# print(all_activities_timestamp_list,"all_activities_timestamp_list")
		all_activities_heartrate = [single_list for single_list in all_activities_hr if single_list]
		all_activities_timestamp = [single_list for single_list in all_activities_time if single_list]
		
		below_aerobic_value = 180-user_age-30
		anaerobic_value = 180-user_age+5
		aerobic_range = '{}-{}'.format(below_aerobic_value,anaerobic_value)
		anaerobic_range = '{} or above'.format(anaerobic_value+1)
		below_aerobic_range = 'below {}'.format(below_aerobic_value)
		
		def individual_activity(heart,time):
			anaerobic_range_list = []
			below_aerobic_list = []
			aerobic_list = []
			for hrt,tm in zip(heart,time):
				if hrt > anaerobic_value:
					anaerobic_range_list.append(tm)
				elif hrt < below_aerobic_value:
					below_aerobic_list.append(tm)
				else:
					aerobic_list.append(tm)
			return aerobic_list,below_aerobic_list,anaerobic_range_list
		aerobic_duration = []
		anaerobic_duration = []
		below_aerobic_duration = []
		total_duration = []
		for i in range(len(all_activities_heartrate)):
			single_activity_file = individual_activity(all_activities_heartrate[i],all_activities_timestamp[i])
			single_activity_list =list(single_activity_file)
			time_in_aerobic = sum(single_activity_list[0])
			aerobic_duration.append(time_in_aerobic)
			time_in_below_aerobic = sum(single_activity_list[1])
			below_aerobic_duration.append(time_in_below_aerobic)
			time_in_anaerobic = sum(single_activity_list[2])
			anaerobic_duration.append(time_in_anaerobic)
			total_time = time_in_aerobic+time_in_below_aerobic+time_in_anaerobic
			total_duration.append(total_time)
			
			try:
				percent_anaerobic = (time_in_anaerobic/total_time)*100
				percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))
			
				percent_below_aerobic = (time_in_below_aerobic/total_time)*100
				percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))
				
				percent_aerobic = (time_in_aerobic/total_time)*100
				percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))
			
				total_percent = 100
			except (ZeroDivisionError):
				percent_anaerobic=''
				percent_below_aerobic=''
				percent_aerobic=''
				total_percent=''
			single_data = {"avg_heart_rate":avg_hr[i],
					"max_heart_rate":max_hr[i],
					"total_duration":total_time,
					"duration_in_aerobic_range":time_in_aerobic,
					"percent_aerobic":percent_aerobic,
					"duration_in_anaerobic_range":time_in_anaerobic,
					"percent_anaerobic":percent_anaerobic,
					"duration_below_aerobic_range":time_in_below_aerobic,
					"percent_below_aerobic":percent_below_aerobic,
					"duration_hrr_not_recorded":0,
					"percent_hrr_not_recorded":0
					}
			# print(single_data,"single_data")
			log_id = log_ids[i]
			daily_aa_data[log_id] = single_data
			# print(daily_aa_data,"daily_aa_data")
		try:
			total_prcnt_anaerobic = (sum(anaerobic_duration)/sum(total_duration)*100)
			total_prcnt_anaerobic = int(Decimal(total_prcnt_anaerobic).quantize(0,ROUND_HALF_UP))
			total_prcnt_below_aerobic = (sum(below_aerobic_duration)/sum(total_duration)*100)
			total_prcnt_below_aerobic = int(Decimal(total_prcnt_below_aerobic).quantize(0,ROUND_HALF_UP))
			total_prcnt_aerobic = (sum(aerobic_duration)/sum(total_duration)*100)
			total_prcnt_aerobic = int(Decimal(total_prcnt_aerobic).quantize(0,ROUND_HALF_UP))
		except (ZeroDivisionError,IndexError):
			total_prcnt_anaerobic = ''
			total_prcnt_below_aerobic = ''
			total_prcnt_aerobic = ''
		try:
			total_avg = sum(avg_hr)/len(avg_hr)
		except:
			total_avg = ''
		try:
			total_max = max(max_hr)
		except:
			total_max = ''
		total =  {"avg_heart_rate":total_avg,
				  "max_heart_rate":total_max,
				  "total_duration":sum(total_duration),
				  "duration_in_aerobic_range":sum(aerobic_duration),
				  "duration_in_anaerobic_range":sum(anaerobic_duration),
				  "duration_below_aerobic_range":sum(below_aerobic_duration),
				  "percent_aerobic":total_prcnt_aerobic,
				  "percent_below_aerobic":total_prcnt_below_aerobic,
				  "percent_anaerobic":total_prcnt_anaerobic,
				  "duration_hrr_not_recorded":0,
				  "percent_hrr_not_recorded":0,
					}
		if total:
			daily_aa_data['Totals'] = total
		else:
			daily_aa_data['Totals'] = {}
		return daily_aa_data
	else:
		return {}

def get_start_end_time_act(start_time_seconds,offset,duration):
	start_time = datetime.utcfromtimestamp(start_time_seconds+offset)
	end_tine = datetime.utcfromtimestamp(start_time_seconds+offset+duration)
	start_time_str = "{}:{}:{}".format(start_time.hour,start_time.minute,start_time.second)
	end_tine_str = "{}:{}:{}".format(end_tine.hour,end_tine.minute,end_tine.second)
	return start_time_str,end_tine_str

def get_fitbit_act_ids(fibit_act):
	fitbit_ids = []
	for single_activity in fibit_act:
		log_id = list(single_activity.keys())
		fitbit_ids.append(str(log_id[0]))
	return fitbit_ids

def get_user_created_activity(user,start_date,user_input_activities,fibit_act):
	# print(user_input_activities,"user_input_activities")
	fitbit_ids = get_fitbit_act_ids(fibit_act)
	ui_act_ids = list(user_input_activities.keys())
	manually_added_act_ids = list(set(ui_act_ids)-set(fitbit_ids))
	activity_hr_time = []
	for single_id in manually_added_act_ids:
		start_time_seconds=user_input_activities[single_id].get("startTimeInSeconds")
		offset = user_input_activities[single_id].get("startTimeInSeconds")
		duration = user_input_activities[single_id].get("durationInSeconds")
		summaryid = user_input_activities[single_id].get("summaryId")
		if start_time_seconds:
			start_time_str,end_tine_str = get_start_end_time_act(start_time_seconds,offset,duration)
			hr_dataset = get_fitbit_hr_data(user,start_date)
			single_activity_hr_time = get_hr_timediff(
				hr_dataset,start_time_str,end_tine_str,summaryid)
			activity_hr_time.append(single_activity_hr_time)

	return activity_hr_time

def total_percent(modified_data_total):
	'''
		Add percent to all the fields in Totals
	'''
	try:
		modified_data_total['Totals']['percent_aerobic'] = (
		(modified_data_total["Totals"].get("duration_in_aerobic_range",0.0)/modified_data_total['Totals']['total_duration'])*100)
	except ZeroDivisionError:
		modified_data_total['Totals']['percent_aerobic'] = 0
	try:
		modified_data_total['Totals']['percent_below_aerobic'] = (
		(modified_data_total["Totals"].get("duration_below_aerobic_range",0.0)/modified_data_total['Totals']['total_duration'])*100)
	except ZeroDivisionError:
		modified_data_total['Totals']['percent_below_aerobic'] = 0
	try:
		modified_data_total['Totals']['percent_anaerobic'] = (
		(modified_data_total["Totals"].get("duration_in_anaerobic_range",0.0)/modified_data_total['Totals']['total_duration'])*100)
	except ZeroDivisionError:
		modified_data_total['Totals']['percent_anaerobic'] = 0
	try:
		modified_data_total['Totals']['percent_hrr_not_recorded'] = (
		(modified_data_total["Totals"].get("duration_hrr_not_recorded",0.0)/modified_data_total['Totals']['total_duration'])*100)
	except ZeroDivisionError:
		modified_data_total['Totals']['percent_hrr_not_recorded'] = 0
	return(modified_data_total)

def add_totals(modified_data):
	'''
		Add totals field to user created activity
	'''
	modified_data_total = modified_data.copy()
	for key,value in modified_data.items():
		if not modified_data_total.get('Totals'):
			modified_data_total['Totals'] = {}
		modified_data_total['Totals']['total_duration'] = (
		value.get('total_duration',0.0) + modified_data_total['Totals'].get('total_duration',0.0))
		modified_data_total['Totals']['duration_in_anaerobic_range'] = (
		value.get('duration_in_anaerobic_range',0.0) + modified_data_total['Totals'].get(
		'duration_in_anaerobic_range',0.0))
		modified_data_total['Totals']['duration_in_aerobic_range'] = (
		value.get('duration_in_aerobic_range',0.0) + modified_data_total['Totals'].get(
		'duration_in_aerobic_range',0.0))
		modified_data_total['Totals']['duration_below_aerobic_range'] = (
		value.get('duration_below_aerobic_range',0.0) + modified_data_total['Totals'].get(
		'duration_below_aerobic_range',0.0))
		modified_data_total['Totals']['duration_hrr_not_recorded'] = (
		value.get('duration_hrr_not_recorded',0.0) + modified_data_total['Totals'].get(
		'duration_hrr_not_recorded',0.0))
	percent_added = total_percent(modified_data_total)
	return(percent_added)

def generate_totals(user_added_data,data):
	# print(user_added_data,"user_added_data")
	# print(data,"data")
	user_added_data.pop('Totals')
	data.update(user_added_data)
	data.pop('Totals')
	final_data = add_totals(data)
	return final_data

def calculate_AA2_daily(user,start_date,user_input_activities=None):
	hr_time_diff = fitbit_hr_diff_calculation(user,start_date)
	# all_activities_heartrate_list,all_activities_timestamp_list = all_activities_hr_and_time_diff(user_get,start_date)
	AA_data = AaCalculations.objects.filter(user_aa=user,created_at=start_date)
	if user_input_activities:
		user_input_activities = delete_activity(user_input_activities)
	if not user_input_activities and not AA_data:
		data = get_aa2_daily_data(user,hr_time_diff)
		return data
	elif  not user_input_activities and AA_data:
		data = get_aa2_daily_data(user,hr_time_diff)
		return data
	elif ((user_input_activities and not AA_data) or
			(user_input_activities and AA_data)):
		ui_act_ids = list(user_input_activities.keys())
		fibit_act = fitbit_aa_chart_one(user,start_date)
		if len(ui_act_ids) == len(fibit_act):
			data = get_aa2_daily_data(user,hr_time_diff)
			return data
		else:
			activity_hr_time = get_user_created_activity(user,start_date,user_input_activities,fibit_act)
			user_added_data = get_aa2_daily_data(user,activity_hr_time)
			data = get_aa2_daily_data(user,hr_time_diff)
			final_data = generate_totals(user_added_data,data)
			return final_data

	else:
		return {}

def get_aa3_data(user,hr_list,timediff_list):

	user_age = user.profile.age()
	data = {"heart_rate_zone_low_end":"",
				"heart_rate_zone_high_end":"",
				"classification":"",
				"time_in_zone":"",
				"prcnt_total_duration_in_zone":"",
				}

	below_aerobic_value = 180-user_age-30
	anaerobic_value = 180-user_age+5
	above_220 = 220
	data2 = {}
	classification_dic = {}
	low_end_values = [-131,-120,-110,-100,-90,-80,-70,-60,-55,-50,-45,
						-40,-35,-30,-25,-20,-15,-10,+1,6,11,14,19,24,
						29,34,39,44,49,54,59,64,69,79]
	high_end_values = [-121,-111,-101,-91,-81,-71,-61,-56,-51,-46,-41,
						-36,-31,-26,-21,-16,-11,0,5,10,13,18,23,28,33,
						38,43,48,53,58,63,68,78,88]

	low_end_heart = [180-user_age+tmp for tmp in low_end_values]
	high_end_heart = [180-user_age+tmp for tmp in high_end_values]

	for a,b in zip(low_end_heart,high_end_heart):					
		if a and b > anaerobic_value:
			classification_dic[a] = 'anaerobic_zone'
		elif a and b < below_aerobic_value:
			classification_dic[a] = 'below_aerobic_zone'
		elif a > above_220:
			classification_dic[a] = 'above_220'
		else:
			classification_dic[a] = 'aerobic_zone'

		data={"heart_rate_zone_low_end":a,
			  "heart_rate_zone_high_end":b,
			  "classificaton":classification_dic[a],
			  "time_in_zone":0,
			  "prcnt_total_duration_in_zone":0,
			 }

		data2[str(a)]=data
	total = {"total_duration":0,
				"total_percent":0}
	data2['total'] = total
	if hr_list and timediff_list:
		low_end_dict = dict.fromkeys(low_end_heart,0)
		# high_end_dict = dict.fromkeys(high_end_heart,0)
		for a,b in zip(low_end_heart,high_end_heart):
			for c,d in zip(hr_list,timediff_list):
				if c>=a and c<=b:
					low_end_dict[a] = low_end_dict[a] + d
		# print(low_end_dict,"low_end_dict")
		total_time_duration = sum(low_end_dict.values())		
		for a,b in zip(low_end_heart,high_end_heart):					
			if a and b > anaerobic_value:
				classification_dic[a] = 'anaerobic_zone'
			elif a and b < below_aerobic_value:
				classification_dic[a] = 'below_aerobic_zone'
			elif a > above_220:
				classification_dic[a] = 'above_220'
			else:
				classification_dic[a] = 'aerobic_zone'
			try:
				prcnt_in_zone = (low_end_dict[a]/total_time_duration)*100
			except ZeroDivisionError:
				prcnt_in_zone = 0
			prcnt_in_zone = int(Decimal(prcnt_in_zone).quantize(0,ROUND_HALF_UP))
			data={"heart_rate_zone_low_end":a,
			  "heart_rate_zone_high_end":b,
			  "classificaton":classification_dic[a],
			  "time_in_zone":low_end_dict[a],
			  "prcnt_total_duration_in_zone":prcnt_in_zone,
			 }
			data2[str(a)]=data

		total = {"total_duration":total_time_duration,
				"total_percent":"100%"}
		if total:
			data2['total'] = total
		else:
			data2['total'] = ""
	if data2:
		data2["heartrate_not_recorded"] = {}
		data2["heartrate_not_recorded"]["prcnt_total_duration_in_zone"] = 0
		data2["heartrate_not_recorded"]["time_in_zone"] = 0
		data2["heartrate_not_recorded"]["classificaton"] = "heart_rate_not_recorded"

		data2["above_220"] = {}
		data2["above_220"]["prcnt_total_duration_in_zone"] = 0
		data2["above_220"]["time_in_zone"] = 0
		data2["above_220"]["classificaton"] = "above_220"

	return data2

def calculate_AA_chart3(user,start_date,user_input_activities,AA_data, all_activities_heartrate_list,all_activities_timestamp_list):
	if user_input_activities:
		user_input_activities = delete_activity(user_input_activities)
	if not user_input_activities and not AA_data:
		data = get_aa3_data(
		user,all_activities_heartrate_list,all_activities_timestamp_list)
		return data
	elif  not user_input_activities and AA_data:
		data = get_aa3_data(
		user,all_activities_heartrate_list,all_activities_timestamp_list)
		return data
	elif ((user_input_activities and not AA_data) or
			(user_input_activities and AA_data)):
		ui_act_ids = list(user_input_activities.keys())
		fibit_act = fitbit_aa_chart_one(user,start_date)
		if len(ui_act_ids) == len(fibit_act):
			data = get_aa3_data(
		user,all_activities_heartrate_list,all_activities_timestamp_list)
			return data
		else:
			activity_hr_time = get_user_created_activity(user,start_date,user_input_activities,fibit_act)
			act_hr_list,act_time_list = all_activities_hr_and_time_diff(activity_hr_time)
			all_activities_heartrate_list.extend(act_hr_list)
			all_activities_timestamp_list.extend(act_time_list)
			final_data = get_aa3_data(
				user,all_activities_heartrate_list,all_activities_timestamp_list)
			return final_data
	return {}

def calculate_AA3(user,start_date,user_input_activities, ):
	hr_time_diff = fitbit_hr_diff_calculation(user,start_date)
	all_activities_heartrate_list,all_activities_timestamp_list = all_activities_hr_and_time_diff(hr_time_diff)
	AA_data = TimeHeartZones.objects.filter(user=user,created_at=start_date)
	
	response = calculate_AA_chart3(user,start_date,user_input_activities,AA_data,\
						all_activities_heartrate_list,
						all_activities_timestamp_list)
	
	return response
	# if user_input_activities:
	# 	user_input_activities = delete_activity(user_input_activities)
	# if not user_input_activities and not AA_data:
	# 	data = get_aa3_data(
	# 	user,all_activities_heartrate_list,all_activities_timestamp_list)
	# 	return data
	# elif  not user_input_activities and AA_data:
	# 	data = get_aa3_data(
	# 	user,all_activities_heartrate_list,all_activities_timestamp_list)
	# 	return data
	# elif ((user_input_activities and not AA_data) or
	# 		(user_input_activities and AA_data)):
	# 	ui_act_ids = list(user_input_activities.keys())
	# 	fibit_act = fitbit_aa_chart_one(user,start_date)
	# 	if len(ui_act_ids) == len(fibit_act):
	# 		data = get_aa3_data(
	# 	user,all_activities_heartrate_list,all_activities_timestamp_list)
	# 		return data
	# 	else:
	# 		activity_hr_time = get_user_created_activity(user,start_date,user_input_activities,fibit_act)
	# 		act_hr_list,act_time_list = all_activities_hr_and_time_diff(activity_hr_time)
	# 		all_activities_heartrate_list.extend(act_hr_list)
	# 		all_activities_timestamp_list.extend(act_time_list)
	# 		final_data = get_aa3_data(
	# 			user,all_activities_heartrate_list,all_activities_timestamp_list)
	# 		return final_data
	# return {}
	
def calculate_twentyfour_hour_AA3(user,start_date,user_input_activities):
	hr_time_diff = fitbit_hrr_diff_calculation(user,start_date)
	all_activities_heartrate_list = hr_time_diff['hr_values']
	all_activities_timestamp_list = hr_time_diff['time_diff']

	AA_data = TwentyfourHourTimeHeartZones.objects.filter(user=user,created_at=start_date)
	response = calculate_AA_chart3(user,start_date,user_input_activities,AA_data,\
									all_activities_heartrate_list,
									all_activities_timestamp_list)


	total_time = 86400
	for key,value in response.items():
		if key != 'total':
			prcnt_total_duration_in_zone = (response[key]['time_in_zone']/total_time)*100
			response[key]['prcnt_total_duration_in_zone'] = int(Decimal(prcnt_total_duration_in_zone).quantize(0,ROUND_HALF_UP))

	heartrate_not_recorded = response['heartrate_not_recorded']
	
	heartrate_not_recorded['time_in_zone'] = total_time-response['total']['total_duration']
	
	percent_hrr_not_recorded = (heartrate_not_recorded['time_in_zone']/total_time)*100
	percent_hrr_not_recorded = int(Decimal(percent_hrr_not_recorded).quantize(0,ROUND_HALF_UP))

	heartrate_not_recorded['prcnt_total_duration_in_zone'] = percent_hrr_not_recorded
	response['total']['total_duration'] = total_time
	
	return response