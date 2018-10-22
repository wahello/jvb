from datetime import timezone,timedelta
import ast
import json

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

import quicklook.calculations.garmin_calculation
import quicklook.calculations.fitbit_calculation
import quicklook.calculations.calculation_driver

from garmin.models import (UserGarminDataSleep,
	UserGarminDataActivity,
	UserGarminDataBodyComposition,
	UserGarminDataManuallyUpdated)

from fitbit.models import UserFitbitDataSleep,UserFitbitDataActivities

from garmin.models import GarminFitFiles
from hrr.calculation_helper import fitfile_parse


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
	
	below_aerobic_value = 180-user_age-30
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
				avg_hr = int(activity_keys.get("averageHeartRateInBeatsPerMinute",0))
				# If there is no average HR information, then consider
				# steps as "exercise steps"
				if ((avg_hr and avg_hr < below_aerobic_value) or
					activity_keys.get("activityType","") == "HEART_RATE_RECOVERY"):
					activity_keys["steps_type"] = "non_exercise"
				else:
					activity_keys["steps_type"] = "exercise"
				if int(activity_keys.get("averageHeartRateInBeatsPerMinute",0)) > anaerobic_value:
					activity_keys["can_update_steps_type"] = False

		return {activity_obj['summaryId']:activity_keys}

def _get_activities(user,target_date):
	current_date = quicklook.calculations.garmin_calculation.str_to_datetime(target_date)
	# hrr_data = Hrr.objects.filter(user_hrr = self.request.user, created_at = current_date)
	# if hrr_data:
	# 	measure_hrr = [tmp.Did_you_measure_HRR for tmp in hrr_data]
	act_data = _get_activities_data(user,target_date)
	activity_data = act_data[0]
	manually_updated_act_data = act_data[1]

	final_act_data = {}
	comments = {}
	manually_updated_act_data = {dic['summaryId']:dic for dic in manually_updated_act_data}
	act_obj = {}
	start = current_date
	end = current_date + timedelta(days=3)
	fitfiles=GarminFitFiles.objects.filter(user=user,created_at__range=[start,end])

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
	
	# heart_rate = [x for x in all_activities_heartrate if x != []]
	# time_stamp = [x for x in all_activities_timestamp if x != []]
	sum_timestamp = []
	for single_timestamp in all_activities_timestamp:
		if single_timestamp:
			total_time = [sum(single_timestamp[:i+1]) for i in range(len(single_timestamp))]
		else:
 			total_time = []
		sum_timestamp.append(total_time)
	final_heart_rate=[]
	index = ''

	for single_heartrate,single_time in zip(all_activities_heartrate,sum_timestamp):
		if single_time:
			for i,value in enumerate(single_time):
				if value <= 120:
					index = single_time.index(value)
			if index:
				final_heart_rate.append(single_heartrate[:index])
		else:
			final_heart_rate.append([])

	combined_activities = quicklook.calculations.garmin_calculation\
	.get_filtered_activity_stats(
		activity_data, manually_updated_act_data,
		include_duplicate=True,include_deleted=True
	)
	for single_activity in combined_activities:
		if fitfiles:
			for single_fitfiles,single_heartrate in zip(fitfiles,final_heart_rate):
				meta = single_fitfiles.meta_data_fitfile
				meta = ast.literal_eval(meta)
				data_id = meta['activityIds'][0]
				if (((single_activity.get("summaryId",None) == str(data_id)) and 
					(single_activity.get("durationInSeconds",0) <= 1200) and 
					(single_activity.get("distanceInMeters",0) <= 1287.48)) and single_heartrate):
					least_hr = min(single_heartrate)
					hrr_difference = single_heartrate[0] - least_hr
					if hrr_difference > 10:
						single_activity["activityType"] = "HEART_RATE_RECOVERY"
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
	current_date = quicklook.calculations.garmin_calculation.str_to_datetime(target_date)
	activity_data = quicklook.calculations.fitbit_calculation.get_fitbit_model_data(
		UserFitbitDataActivities,user,current_date.date(),current_date.date())
	if activity_data:
		activity_data = ast.literal_eval(activity_data[0].replace(
			"'activity_fitbit': {...}","'activity_fitbit': {}"))
		activity_data = activity_data['activities']

	if activity_data:
		activity_data = [
				quicklook.calculations.converter.\
				fitbit_to_garmin_converter.fitbit_to_garmin_activities(act)
			for act in activity_data]

		activity_data = [
			_create_activity_stat(user,act,current_date)[act['summaryId']]
			for act in activity_data
		]

	activity_data = {act.get('summaryId'):act for act in activity_data}
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
			return _get_fitbit_activities_data(user,target_date)

	def get(self, request, format = "json"):
		target_date = request.query_params.get('date',None)
		if target_date:
			sleep_stats = self._get_sleep_stats(target_date)
			activites = self.get_all_activities_data(target_date)
			have_activities = True if activites else False
			weight = self._get_weight(target_date)
			data = {
				"sleep_stats":sleep_stats,
				"have_activities":have_activities,
				"weight":weight,
				"activites":activites,
			}
			return Response(data)
		return Response({})