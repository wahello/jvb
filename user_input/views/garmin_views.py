from datetime import timezone,timedelta,date
import ast

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from quicklook.calculation_helper import get_sleep_stats,\
										 str_to_datetime,\
										 get_garmin_model_data,\
										 get_weekly_data

from garmin.models import (UserGarminDataSleep,
	UserGarminDataActivity,
	UserGarminDataBodyComposition,
	UserGarminDataManuallyUpdated)

from hrr.models import Hrr
from garmin.models import GarminFitFiles
from django.contrib.auth.models import User
from registration.models import Profile
from hrr.calculation_helper import fitfile_parse

def _get_activities_data(user,target_date):
	current_date = str_to_datetime(target_date)
	current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

	start_epoch = current_date_epoch
	end_epoch = current_date_epoch + 86400

	activity_data = get_garmin_model_data(UserGarminDataActivity,
		user, start_epoch,end_epoch,order_by = '-id')
	manually_updated_activity_data = get_garmin_model_data(UserGarminDataManuallyUpdated,
		user, start_epoch,end_epoch,order_by = '-id')

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
	profile = Profile.objects.filter(user=user)
	
	for tmp_profile in profile:
		user_dob = tmp_profile.date_of_birth
	user_age = (date.today() - user_dob) // timedelta(days=365.2425)
	
	below_aerobic_value = 180-user_age-30
	anaerobic_value = 180-user_age+5
	aerobic_value_half = 180-user_age-15

	if activity_obj:
		tmp = {
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

			}
		for k, v in activity_obj.items():
			if k in tmp.keys():
				tmp[k] = v
				if (int(tmp.get("averageHeartRateInBeatsPerMinute",0)) < below_aerobic_value or
					tmp.get("activityType","") == "HEART_RATE_RECOVERY"):
					tmp["steps_type"] = "non_exercise"
				else:
					tmp["steps_type"] = "exercise"
				if int(tmp.get("averageHeartRateInBeatsPerMinute",0)) > anaerobic_value:
					tmp["can_update_steps_type"] = False
				elif int(tmp.get("averageHeartRateInBeatsPerMinute",0)) > aerobic_value_half:
					tmp["can_update_steps_type"] = False

		return {activity_obj['summaryId']:tmp}

def _get_activities(user,target_date):
	current_date = str_to_datetime(target_date)
	# hrr_data = Hrr.objects.filter(user_hrr = self.request.user, created_at = current_date)
	# if hrr_data:
	# 	measure_hrr = [tmp.Did_you_measure_HRR for tmp in hrr_data]
	act_data = _get_activities_data(user,target_date)
	activity_data = act_data[0]
	manually_updated_act_data = act_data[1]

	final_act_data = {}
	comments = {}
	manually_updated_act_data = {dic['summaryId']:dic for dic in manually_updated_act_data}
	manually_edited = lambda x: manually_updated_act_data.get(x.get('summaryId'),x)
	act_obj = {}
	start = current_date
	end = current_date + timedelta(days=3)
	a1=GarminFitFiles.objects.filter(user=user,created_at__range=[start,end])

	all_activities_heartrate = []
	all_activities_timestamp = []
	offset = 0
	if activity_data:
		offset = activity_data[0].get("startTimeOffsetInSeconds")
	
	if a1:
		for tmp in a1:
			workout_activities = fitfile_parse([tmp],offset,target_date)
			workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_activities
			print(workout_final_heartrate)
			all_activities_heartrate.append(workout_final_heartrate)
			all_activities_timestamp.append(workout_final_timestamp)
	# print(all_activities_heartrate,"oooooooooooooooooooooooooooo")
	sum_timestamp = []
	for single_timestamp in all_activities_timestamp:
		total_time = [sum(single_timestamp[:i+1]) for i in range(len(single_timestamp))]
		# print(type(total_time))
		sum_timestamp.append(total_time)
	
	for act in activity_data:
		act_obj = manually_edited(act)
		if a1:
			for tmp,i in zip(a1,all_activities_heartrate):
				meta = tmp.meta_data_fitfile
				meta = ast.literal_eval(meta)
				data_id = meta['activityIds'][0]
				if (((act_obj.get("summaryId",None) == str(data_id)) and 
					(act_obj.get("durationInSeconds",0) <= 1200) and 
					(act_obj.get("distanceInMeters",0) <= 200.00)) and i):
					print(i)
					hrr_difference = i[0] - i[-1]
					if hrr_difference > 0:
						act_obj["activityType"] = "HEART_RATE_RECOVERY"
				else:
					pass
		finall = _create_activity_stat(user,act_obj,current_date)
		final_act_data.update(finall)
	# print(final_act_data)
	return final_act_data	
		
class GarminData(APIView):
	permission_classes = (IsAuthenticated,)

	def _get_sleep_stats(self,target_date):
		current_date = str_to_datetime(target_date)
		yesterday_date = current_date - timedelta(days=1)
		current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

		start_epoch = current_date_epoch - 86400
		end_epoch = current_date_epoch + 86400
		sleep_data = get_garmin_model_data(UserGarminDataSleep,
			self.request.user, start_epoch,end_epoch,order_by = '-id')
		sleep_data_parsed = get_weekly_data(sleep_data,current_date,yesterday_date)
		todays_sleep_data = sleep_data_parsed[current_date.strftime('%Y-%m-%d')]
		yesterday_sleep_data = sleep_data_parsed[yesterday_date.strftime('%Y-%m-%d')]
		return get_sleep_stats(current_date,yesterday_sleep_data, todays_sleep_data,str_dt=False)

	def _get_weight(self, target_date):
		weight = {
			"value":None,
			"unit":None
		}
		current_date = str_to_datetime(target_date)
		current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

		start_epoch = current_date_epoch
		end_epoch = current_date_epoch + 86400
		todays_weight_data = get_garmin_model_data(UserGarminDataBodyComposition,
			self.request.user, start_epoch,end_epoch,order_by = '-id')

		if todays_weight_data:
			todays_weight_data = [ast.literal_eval(dic) for dic in todays_weight_data]
			weight_value = todays_weight_data[0].get('weightInGrams')
			weight['value'] = weight_value
			weight['unit'] = 'grams'
			return weight
		else:
			return weight

	def _have_activity_record(self, target_date):
		current_date = str_to_datetime(target_date)
		current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())
		start_epoch = current_date_epoch
		end_epoch = current_date_epoch + 86400
		activity_records = get_garmin_model_data(UserGarminDataActivity,
			self.request.user, start_epoch,end_epoch,order_by = '-id')

		return True if activity_records else False


	# def _get_activities_data(self,target_date):
	# 	current_date = str_to_datetime(target_date)
	# 	current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

	# 	start_epoch = current_date_epoch
	# 	end_epoch = current_date_epoch + 86400

	# 	activity_data = get_garmin_model_data(UserGarminDataActivity,
	# 		self.request.user, start_epoch,end_epoch,order_by = '-id')
	# 	manually_updated_activity_data = get_garmin_model_data(UserGarminDataManuallyUpdated,
	# 		self.request.user, start_epoch,end_epoch,order_by = '-id')

	# 	#converting to python objects
	# 	activity_data = [ast.literal_eval(dic) for dic in activity_data]
	# 	manually_updated_activity_data = [ast.literal_eval(dic) for dic
	# 		in manually_updated_activity_data]

	# 	return (activity_data,manually_updated_activity_data)    

	# def _create_activity_stat(self,activity_obj,current_date):
	# 	'''
	# 		this funtion accepts the single activity object at a time
	# 		and returns only very few key and values which are to be shown in activity grid

	# 	Args:
	# 		param1: single activity object
	# 		param1: current data
	# 	Returms:
	# 		keys as summary id and value as a dictonary, in the dictonary modified key and values
	# 		which are to be shown in activity grid
	# 	'''
	# 	profile = Profile.objects.filter(user=self.request.user)
		
	# 	for tmp_profile in profile:
	# 		user_dob = tmp_profile.date_of_birth
	# 	user_age = (date.today() - user_dob) // timedelta(days=365.2425)
		
	# 	below_aerobic_value = 180-user_age-30
	# 	anaerobic_value = 180-user_age+5
	# 	aerobic_value_half = 180-user_age-15

	# 	if activity_obj:
	# 		tmp = {
	# 				"summaryId":"",
	# 				"activityType":"",
	# 				"comments":"",
	# 				"startTimeInSeconds":"",
	# 				"durationInSeconds":"",
	# 				"startTimeOffsetInSeconds":"",
	# 				"averageHeartRateInBeatsPerMinute":0,
	# 				"steps_type":"",
	# 				"can_update_steps_type":True,
	# 				"steps":0,

	# 			}
	# 		for k, v in activity_obj.items():
	# 			if k in tmp.keys():
	# 				tmp[k] = v
	# 				if (int(tmp.get("averageHeartRateInBeatsPerMinute",0)) < below_aerobic_value or
	# 					tmp.get("activityType","") == "HEART_RATE_RECOVERY"):
	# 					tmp["steps_type"] = "non_exercise"
	# 				else:
	# 					tmp["steps_type"] = "exercise"
	# 				if int(tmp.get("averageHeartRateInBeatsPerMinute",0)) > anaerobic_value:
	# 					tmp["can_update_steps_type"] = False
	# 				elif int(tmp.get("averageHeartRateInBeatsPerMinute",0)) > aerobic_value_half:
	# 					tmp["can_update_steps_type"] = False

	# 		return {activity_obj['summaryId']:tmp}
		
		
	# def _get_activities(self,target_date):
	# 	current_date = str_to_datetime(target_date)
	# 	# hrr_data = Hrr.objects.filter(user_hrr = self.request.user, created_at = current_date)
	# 	# if hrr_data:
	# 	# 	measure_hrr = [tmp.Did_you_measure_HRR for tmp in hrr_data]
	# 	act_data = self._get_activities_data(target_date)
	# 	activity_data = act_data[0]
	# 	manually_updated_act_data = act_data[1]

	# 	final_act_data = {}
	# 	manually_updated_act_data = {dic['summaryId']:dic for dic in manually_updated_act_data}
	# 	manually_edited = lambda x: manually_updated_act_data.get(x.get('summaryId'),x)
	# 	act_obj = {}
	# 	start = current_date
	# 	end = current_date + timedelta(days=3)
	# 	a1=GarminFitFiles.objects.filter(user=self.request.user,created_at__range=[start,end])

	# 	for act in activity_data:
	# 		non_edited_steps = act.get('steps',None)
	# 		act_obj = manually_edited(act)
	# 		manually_edited_steps = act_obj.get('steps',None)
	# 		if (not non_edited_steps is None) and not manually_edited_steps:
	# 			# Manually edited summaries drop steps data, so if steps
	# 			# data in manually edited summary is not present but
	# 			# it was present in normal unedited version of summary, in
	# 			# that case add the previous step data to the current summary
	# 			act_obj['steps'] = non_edited_steps
	# 		if a1:
	# 			for tmp in a1:
	# 				meta = tmp.meta_data_fitfile
	# 				meta = ast.literal_eval(meta)
	# 				data_id = meta['activityIds'][0]
	# 				if (((act_obj.get("summaryId",None) == str(data_id)) and 
	# 					(act_obj.get("durationInSeconds",0) <= 1200) and 
	# 					(act_obj.get("distanceInMeters",0) <= 200.00))):
	# 					act_obj["activityType"] = "HEART_RATE_RECOVERY"
	# 				else:
	# 					pass
	# 		finall = self._create_activity_stat(act_obj,current_date)
	# 		final_act_data.update(finall)
	# 	# print(final_act_data)
	# 	return final_act_data
		

	def get(self, request, format = "json"):
		target_date = request.query_params.get('date',None)
		if target_date:
			sleep_stats = self._get_sleep_stats(target_date)
			have_activities = self._have_activity_record(target_date)
			weight = self._get_weight(target_date)
			activites = _get_activities(self.request.user,target_date)
			data = {
				"sleep_stats":sleep_stats,
				"have_activities":have_activities,
				"weight":weight,
				"activites":activites,
			}
			return Response(data)
		return Response({})

