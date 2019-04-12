from datetime import timezone,timedelta
import ast
import json
import time
import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

import quicklook.calculations.garmin_calculation
import quicklook.calculations.fitbit_calculation
import quicklook.calculations.apple_calculation

import quicklook.calculations.calculation_driver

from garmin.models import (UserGarminDataSleep,
	UserGarminDataActivity,
	UserGarminDataBodyComposition,
	UserGarminDataManuallyUpdated,
	UserGarminDataEpoch)

from fitbit.models import UserFitbitDataSleep,UserFitbitDataActivities

from apple.models import UserAppleDataActivities

from garmin.models import GarminFitFiles
from hrr.calculation_helper import fitfile_parse
from hrr.fitbit_aa import determine_hhr_activity

def _get_activities_data(user,target_date):
	current_date = quicklook.calculations.garmin_calculation.str_to_datetime(target_date)
	current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

	start_epoch = current_date_epoch
	end_epoch = current_date_epoch + 86400

	activity_data = quicklook.calculations.garmin_calculation.get_garmin_model_data(UserGarminDataActivity,
		user, start_epoch,end_epoch,order_by = '-id')
	manually_updated_activity_data = quicklook.calculations.garmin_calculation.get_garmin_model_data(
		UserGarminDataManuallyUpdated,user,
		start_epoch,end_epoch,order_by = 'id')

	#converting to python objects
	activity_data = [ast.literal_eval(dic) for dic in activity_data]
	manually_updated_activity_data = [ast.literal_eval(dic) for dic
		in manually_updated_activity_data]

	return (activity_data,manually_updated_activity_data)

def _create_activity_stat(user,activity_obj,current_date):
	'''
		this funtion accepts the single activity object at a time
		and returns only very few key and values which are to be shown in activity grid

	Args:
		param1: single activity object
		param1: current data
	Returms:
		keys as summary id and value as a dictonary, in the dictonary modified key and values
		which are to be shown in activity grid
	'''
	user_age = user.profile.age()
	anaerobic_value = 180-user_age+5
	if activity_obj:
		activity_keys = {
				"summaryId":"",
				"activityType":"",
				"comments":"",
				"startTimeInSeconds":"",
				"durationInSeconds":"",
				"startTimeOffsetInSeconds":"",
				"averageHeartRateInBeatsPerMinute":0,
				"steps_type":"",
				"can_update_steps_type":True,
				"steps":0,
				"duplicate":False,
				"deleted":False
			}
		for k, v in activity_obj.items():
			if k in activity_keys.keys():
				activity_keys[k] = v
				avg_hr = activity_keys.get("averageHeartRateInBeatsPerMinute",0)
				avg_hr = int(avg_hr) if avg_hr else 0
				if avg_hr >= anaerobic_value:
					if activity_keys.get("activityType","") == "HEART_RATE_RECOVERY":
						activity_keys["can_update_steps_type"] = True
					else:
						activity_keys["can_update_steps_type"] = False
		return {activity_obj['summaryId']:activity_keys}

def _get_activities(user,target_date):
	user_age = user.profile.age()
	current_date = quicklook.calculations.garmin_calculation.str_to_datetime(target_date)
	current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

	start_epoch = current_date_epoch
	end_epoch = current_date_epoch + 86399
	act_data = _get_activities_data(user,target_date)
	activity_data = act_data[0]
	manually_updated_act_data = act_data[1]

	final_act_data = {}
	manually_updated_act_data = {dic['summaryId']:dic for dic in manually_updated_act_data}
	start = current_date
	end = current_date + timedelta(days=3)

	activity_files_qs=UserGarminDataActivity.objects.filter(user=user,start_time_in_seconds__range=[start_epoch,end_epoch])
	fitfiles = GarminFitFiles.objects.filter(user=user,fit_file_belong_date=current_date.date())	
	if not fitfiles or len(activity_files_qs) != len(fitfiles):
		fitfiles = GarminFitFiles.objects.filter(user=user,created_at__range=[start,end])

	all_activities_heartrate = []
	all_activities_timestamp = []
	offset = 0
	if activity_data:
		offset = activity_data[0].get("startTimeOffsetInSeconds")
	
	if fitfiles:
		for single_fitfiles in fitfiles:
			workout_activities = fitfile_parse([single_fitfiles],offset,target_date)
			workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_activities
			all_activities_heartrate.append(workout_final_heartrate)
			all_activities_timestamp.append(workout_final_timestamp)
	sum_timestamp = []
	for single_timestamp in all_activities_timestamp:
		if single_timestamp:
			total_time = [sum(single_timestamp[:i+1]) for i in range(len(single_timestamp))]
		else:
 			total_time = []
		sum_timestamp.append(total_time)
	final_heart_rate=[]
	index = ''
	# print(all_activities_heartrate,"all_activities_heartrate")
	for single_heartrate,single_time in zip(all_activities_heartrate,sum_timestamp):
		if single_time:
			for i,value in enumerate(single_time):
				if value <= 120:
					index = single_time.index(value)
			if index:
				final_heart_rate.append(single_heartrate[:index])
		else:
			final_heart_rate.append([])


	current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())
	epoch_summaries = quicklook.calculations.garmin_calculation\
		.get_garmin_model_data(UserGarminDataEpoch,user,
			current_date_epoch,current_date_epoch+86400,
			order_by = '-id', filter_dup = True)
	epoch_summaries = [ast.literal_eval(dic) for dic in epoch_summaries]
	combined_activities = quicklook.calculations.garmin_calculation\
	.get_filtered_activity_stats(
		activity_data,user_age,manually_updated_act_data,
		include_duplicate=True,include_deleted=True,
		include_non_exercise = True,epoch_summaries = epoch_summaries
	)

	for single_activity in combined_activities:
		if fitfiles:
			# print(final_heart_rate,"final_heart_rate")
			for single_fitfiles,single_heartrate in zip(fitfiles,final_heart_rate):
				meta = single_fitfiles.meta_data_fitfile
				meta = ast.literal_eval(meta)
				data_id = meta['activityIds'][0]
				if (((single_activity.get("summaryId",None) == str(data_id)) and 
					(single_activity.get("durationInSeconds",0) <= 1200) and 
					(single_activity.get("distanceInMeters",0) <= 1287.48)) and single_heartrate):
					# print(single_heartrate,"single activity")
					least_hr = min(single_heartrate)
					if least_hr and single_heartrate:
						hrr_difference = single_heartrate[0] - least_hr
					else:
						hrr_difference = 0
					if hrr_difference > 10:
						single_activity["activityType"] = "HEART_RATE_RECOVERY"
						single_activity["steps_type"] = 'non_exercise'
				else:
					pass
			finall = _create_activity_stat(user,single_activity,current_date)
			final_act_data.update(finall)
		else:
			finall = _create_activity_stat(user,single_activity,current_date)
			final_act_data.update(finall)
	return final_act_data	

def _get_fitbit_activities_data(user,target_date):
	activity_data= {}
	try:
		current_date = quicklook.calculations.garmin_calculation.str_to_datetime(target_date)
	except AttributeError:
		current_date = target_date
	try:
		activity_data = quicklook.calculations.fitbit_calculation.get_fitbit_model_data(
			UserFitbitDataActivities,user,current_date.date(),current_date.date())
	except AttributeError:
		activity_data = quicklook.calculations.fitbit_calculation.get_fitbit_model_data(
			UserFitbitDataActivities,user,current_date,current_date)
	if activity_data:
		activity_data = ast.literal_eval(activity_data[0].replace(
			"'activity_fitbit': {...}","'activity_fitbit': {}"))
		activity_data = activity_data['activities']

	if activity_data:
		activity_data = [
				quicklook.calculations.converter.\
				fitbit_to_garmin_converter.fitbit_to_garmin_activities(act)
			for act in activity_data]
		combined_user_activities = quicklook.calculations.garmin_calculation.\
				get_filtered_activity_stats(
					activity_data,user.profile.age(),
					include_duplicate = True,include_deleted=True,
					include_non_exercise = True,user=user)
		activity_data = [
			_create_activity_stat(user,act,current_date)[act['summaryId']]
			for act in combined_user_activities
		]

	activity_data = {act.get('summaryId'):act for act in activity_data}
	return activity_data

def _get_apple_activities_data(user,target_date):
	activity_data= {}
	try:
		current_date = quicklook.calculations.garmin_calculation.str_to_datetime(target_date)
	except AttributeError:
		current_date = target_date
	try:
		activity_data = quicklook.calculations.apple_calculation.get_apple_model_data(
			UserAppleDataActivities,user,current_date.date(),current_date.date())

	except AttributeError:
		activity_data = quicklook.calculations.apple_calculation.get_apple_model_data(
			UserAppleDataActivities,user,current_date,current_date)
	# if activity_data:
	# 	activity_data = ast.literal_eval(activity_data[0].replace(
	# 		"'activity_fitbit': {...}","'activity_fitbit': {}"))
	# 	activity_data = activity_data['activities']

	if activity_data:
		activity_data = [quicklook.calculations.converter.\
				apple_to_garmin_converter.apple_to_garmin_activities(act) for act in activity_data] 
		for act_data in activity_data:
			activity_data = act_data
			combined_user_activities = quicklook.calculations.garmin_calculation.\
					get_filtered_activity_stats(
						activity_data,user.profile.age(),
						include_duplicate = True,include_deleted=True,
						include_non_exercise = True)
			activity_data = [
				_create_activity_stat(user,act_data,current_date)[act_data['summaryId']]
				for act_data in combined_user_activities
			]
	activity_data = {act_data.get('summaryId'):act_data for act_data in activity_data}
	return activity_data

class GarminData(APIView):
	permission_classes = (IsAuthenticated,)

	def _get_garmin_sleep(self,target_date):
		current_date = quicklook.calculations.garmin_calculation.str_to_datetime(target_date)
		yesterday_date = current_date - timedelta(days=1)
		current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

		start_epoch = current_date_epoch - 86400
		end_epoch = current_date_epoch + 86400
		sleep_data = quicklook.calculations.garmin_calculation.get_garmin_model_data(
			UserGarminDataSleep,self.request.user,
			start_epoch,end_epoch,order_by = '-id')
		sleep_data_parsed = quicklook.calculations.garmin_calculation.get_weekly_data(
			sleep_data,current_date,yesterday_date)
		todays_sleep_data = sleep_data_parsed[current_date.strftime('%Y-%m-%d')]
		yesterday_sleep_data = sleep_data_parsed[yesterday_date.strftime('%Y-%m-%d')]
		return quicklook.calculations.garmin_calculation.get_sleep_stats(
			current_date,yesterday_sleep_data, todays_sleep_data,str_dt=False)

	def _get_fitbit_sleep(self,target_date):
		current_date = quicklook.calculations.garmin_calculation.str_to_datetime(target_date)
		user = self.request.user
		todays_sleep_data = quicklook.calculations.fitbit_calculation.get_fitbit_model_data(
			UserFitbitDataSleep,user,current_date.date(),current_date.date())
		if todays_sleep_data:
			todays_sleep_data = ast.literal_eval(todays_sleep_data[0].replace(
				"'sleep_fitbit': {...}","'sleep_fitbit': {}"))
		else:
			todays_sleep_data = None

		sleep_stats = quicklook.calculations.fitbit_calculation.get_sleep_stats(
			todays_sleep_data,str_date=False)
		return sleep_stats

	def _get_sleep_stats(self,target_date):
		user = self.request.user
		device_type = quicklook.calculations.calculation_driver.which_device(user)
		if device_type == 'garmin':
			return self._get_garmin_sleep(target_date)
		elif device_type == 'fitbit':
			return self._get_fitbit_sleep(target_date)
		elif device_type == 'apple':
			return self._get_fitbit_sleep(target_date)

	def _get_weight(self, target_date):
		weight = {
			"value":None,
			"unit":None
		}
		current_date = quicklook.calculations.garmin_calculation.str_to_datetime(target_date)
		current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

		start_epoch = current_date_epoch
		end_epoch = current_date_epoch + 86400
		todays_weight_data = quicklook.calculations.garmin_calculation.get_garmin_model_data(
			UserGarminDataBodyComposition,self.request.user,
			start_epoch,end_epoch,order_by = '-id')

		if todays_weight_data:
			todays_weight_data = [ast.literal_eval(dic) for dic in todays_weight_data]
			weight_value = todays_weight_data[0].get('weightInGrams')
			weight['value'] = weight_value
			weight['unit'] = 'grams'
			return weight
		else:
			return weight

	def get_all_activities_data(self,target_date):
		user = self.request.user
		device_type = quicklook.calculations.calculation_driver.which_device(user)
		if device_type == 'garmin':
			return _get_activities(user,target_date)
		elif device_type == 'fitbit':
			fitbit_activities = _get_fitbit_activities_data(user,target_date)
			try:
				hrr_determined_activities = determine_hhr_activity(
					user,target_date,fitbit_activities)
			except:
				hrr_determined_activities = fitbit_activities
				logging.exception("message")
			return hrr_determined_activities
		elif device_type == 'apple':
			apple_activities = _get_apple_activities_data(user,target_date)
			return apple_activities
			# try:
			# 	hrr_determined_activities = determine_hhr_activity(
			# 		user,target_date,apple_activities)
			# except:
			# 	hrr_determined_activities = apple_activities
			# 	logging.exception("message")
			# return hrr_determined_activities

	def get(self, request, format = "json"):
		target_date = request.query_params.get('date',None)
		if target_date:
			sleep_stats = self._get_sleep_stats(target_date)
			activites = self.get_all_activities_data(target_date)
			have_activities = quicklook.calculations.garmin_calculation.\
				do_user_has_exercise_activity(activites.values(),request.user.profile.age())
			# have_activities = True if activites else False
			weight = self._get_weight(target_date)
			data = {
				"sleep_stats":sleep_stats,
				"have_activities":have_activities,
				"weight":weight,
				"activites":activites,
			}
			return Response(data)
		return Response({})

	