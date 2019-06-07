from datetime import datetime,timedelta,timezone
import ast
import pytz
import json
from user_input.models import UserDailyInput
import logging

from quicklook.serializers import UserQuickLookSerializer
from django.db.models import Q
from collections import OrderedDict

import quicklook.calculations.garmin_calculation
from quicklook.models import (
	UserQuickLook,
	Grades,
	Sleep,
	Steps,
	ExerciseAndReporting,     
	SwimStats,
	BikeStats,
	Food,                                                                 
	Alcohol
)
from apple.models import(
						UserAppleDataSteps,
						UserAppleDataActivities)


from user_input.models import DailyUserInputStrong
from user_input.models import DailyUserInputOptional
from apple.views import merge_user_data

from .converter.apple_to_garmin_converter import apple_steps_minutly_to_quartly,apple_to_garmin_activities

from .converter.fitbit_to_garmin_converter import fitbit_to_garmin_epoch

from user_input.utils.daily_activity import get_daily_activities_in_base_format


def get_apple_model_data(model,user,start_date, end_date,
		order_by = None, group_by_date=False):

	date_field = None
	data_field = None
	# if model == UserFitbitDataSleep:
	# 	date_field = "date_of_sleep"
	# 	data_field = "sleep_data"
	# elif model == UserFitbitDataHeartRate:
	# 	date_field = "date_of_heartrate"
	# 	data_field = "heartrate_data"
	if model == UserAppleDataActivities:
	 	date_field = "belong_to"
	 	data_field = "data"
	elif model == UserAppleDataSteps:
		date_field = "belong_to" 
		data_field = "data"
	# elif model == UserFitbitDatabody:
	# 	date_field = "date_of_body"
	# 	data_field = "body_data"
	# elif model == UserFitbitDatafoods:
	# 	date_field = "date_of_foods"
	# 	data_field = "foods_data"

	if date_field and data_field:
		lookup_kwargs = {'{}__{}'.format(date_field,"range"):(
			start_date,end_date+timedelta(days=1))}
		if order_by:
			summaries = model.objects.filter(
					**lookup_kwargs,
					user = user).order_by(order_by)
		else:
			summaries = model.objects.filter(
				**lookup_kwargs,
				user = user)

		if group_by_date:
			return {q.__dict__.get(date_field)
			: q.__dict__.get(data_field) for q in summaries}
		else:
			return [q.__dict__.get(data_field) for q in summaries]
	else:
		return None

def get_epoch_time_from_timestamp(timestamp):
	if timestamp:
		if timestamp[-3:-2] == ':':
			timestamp = timestamp[:-3]+timestamp[-2:]

		dobj = datetime.strptime(timestamp,"%Y-%m-%dT%H:%M:%S.%f")
		time_in_utc_seconds = int(dobj.timestamp())
		return (time_in_utc_seconds)

def get_combined_sleep_data(sleep_data, sleep_start_time, awaketime_between_naps):

	remSleepInSeconds = sleep_data[0]['remSleepInSeconds']+sleep_data[1]['remSleepInSeconds']
	restlessDurationInSeconds = sleep_data[0]['restlessDurationInSeconds']+sleep_data[1]['restlessDurationInSeconds']
	validation = sleep_data[0]['validation']+sleep_data[1]['validation']
	deepSleepDurationInSeconds = sleep_data[0]['deepSleepDurationInSeconds']+sleep_data[1]['deepSleepDurationInSeconds']
	lightSleepDurationInSeconds = sleep_data[0]['lightSleepDurationInSeconds']+sleep_data[1]['lightSleepDurationInSeconds']
	unmeasurableSleepInSeconds = sleep_data[0]['unmeasurableSleepInSeconds']
	startTimeOffsetInSeconds = sleep_data[0]['startTimeOffsetInSeconds']
	durationInSeconds = sleep_data[0]['durationInSeconds']+sleep_data[1]['durationInSeconds']
	awakeDurationInSeconds = sleep_data[0]['awakeDurationInSeconds']+sleep_data[1]['awakeDurationInSeconds']

	light = sleep_data[0]['sleepLevelsMap']['light'] + sleep_data[1]['sleepLevelsMap']['light']
	rem = sleep_data[0]['sleepLevelsMap']['rem'] + sleep_data[1]['sleepLevelsMap']['rem']
	deep = sleep_data[0]['sleepLevelsMap']['deep'] + sleep_data[1]['sleepLevelsMap']['deep']
	awake = sleep_data[0]['sleepLevelsMap']['awake'] + sleep_data[1]['sleepLevelsMap']['awake']
	restless = sleep_data[0]['sleepLevelsMap']['restless'] + sleep_data[1]['sleepLevelsMap']['restless']
	sleepLevelsMap = dict({'light':light, 'rem':rem, 'awake':awake, 'deep':deep, 'restless':restless})			

	trans_sleep_data = dict({'remSleepInSeconds': remSleepInSeconds,
		'restlessDurationInSeconds':restlessDurationInSeconds,
		'validation':validation, 
		'deepSleepDurationInSeconds': deepSleepDurationInSeconds,
		'summaryId':sleep_data[0]['summaryId'], 
		'lightSleepDurationInSeconds': lightSleepDurationInSeconds,
		'unmeasurableSleepInSeconds':unmeasurableSleepInSeconds,
		'startTimeOffsetInSeconds':startTimeOffsetInSeconds, 
		'startTimeInSeconds':sleep_start_time, 
		'durationInSeconds':durationInSeconds + awaketime_between_naps,
		'sleepLevelsMap':sleepLevelsMap, 
		'awakeDurationInSeconds':awakeDurationInSeconds + awaketime_between_naps,
		'calendarDate':sleep_data[0]['calendarDate']})
	return trans_sleep_data

def get_sleep_stats(sleep_data, ui_bedtime = None,
	ui_awaketime = None, ui_sleep_duration = None,
	ui_timezone = None,str_date=True):
	sleep_stats = {
		"deep_sleep": '',
		"light_sleep": '',
		"awake_time": '',
		"rem_sleep":'',
		"restless_sleep":'',
		"sleep_bed_time": '',
		"sleep_awake_time": '',
		"sleep_per_wearable":'',
		"sleep_per_userinput":'',
	}
	
	have_userinput_sleep = False
	trans_sleep_data = None
	if ui_bedtime and ui_awaketime and ui_sleep_duration and ui_timezone:
		# If manual sleep bedtime last night and awake time is submitted then we'll
		# user this sleep bedtime time and awake time. We'll convert these time in
		# timezone from where user input was submitted by user
		have_userinput_sleep = True
		target_tz = pytz.timezone(ui_timezone)
		ui_bedtime = ui_bedtime.astimezone(target_tz)
		ui_awaketime = ui_awaketime.astimezone(target_tz)


	if sleep_data:

		if len(sleep_data['sleep']) > 1:
			trans_sleep_data_list = []
			for single_sleep_record in sleep_data['sleep']:
				trans_sleep_data_list.append(fitbit_to_garmin_sleep(single_sleep_record))

				if single_sleep_record['isMainSleep'] == False:
					second_sleep_start_time = single_sleep_record['startTime']
					second_sleep_end_time = single_sleep_record['endTime']
					
				else:
					first_sleep_start_time = single_sleep_record['startTime']
					first_sleep_end_time = single_sleep_record['endTime']
					
			first_sleep_end_time_utc_seconds = get_epoch_time_from_timestamp(first_sleep_end_time)
			second_sleep_start_time_utc_seconds = get_epoch_time_from_timestamp(second_sleep_start_time)
			awaketime_between_naps = second_sleep_start_time_utc_seconds - first_sleep_end_time_utc_seconds
			
			if  awaketime_between_naps <= 9000:
				trans_sleep_data = get_combined_sleep_data(trans_sleep_data_list, 
					first_sleep_start_time,
					awaketime_between_naps)
			else:
				for single_sleep_record in sleep_data['sleep']:
					if single_sleep_record['isMainSleep'] == True:
						trans_sleep_data = fitbit_to_garmin_sleep(single_sleep_record)
		else:
			main_sleep_data = list(filter(lambda x:x.get('isMainSleep'),sleep_data['sleep']))
			if not main_sleep_data:
				main_sleep_data = sleep_data['sleep']
			main_sleep_data = main_sleep_data[0]
			trans_sleep_data = fitbit_to_garmin_sleep(main_sleep_data)
		

		# main_sleep_data = list(filter(lambda x:x.get('isMainSleep'),sleep_data['sleep']))
		# if not main_sleep_data:
		# 	main_sleep_data = sleep_data['sleep']
		# main_sleep_data = main_sleep_data[0]
		# trans_sleep_data = fitbit_to_garmin_sleep(main_sleep_data)


	if trans_sleep_data:
		sleep_stats["deep_sleep"] = quicklook.calculations.garmin_calculation.sec_to_hours_min_sec(
			trans_sleep_data['deepSleepDurationInSeconds'],
			include_sec = False
		)
		sleep_stats["light_sleep"] = quicklook.calculations.garmin_calculation.sec_to_hours_min_sec(
			trans_sleep_data['lightSleepDurationInSeconds'],
			include_sec = False
		)
		sleep_stats["awake_time"] = quicklook.calculations.garmin_calculation.sec_to_hours_min_sec(
			trans_sleep_data['awakeDurationInSeconds'],
			include_sec = False
		)
		sleep_stats["rem_sleep"] = quicklook.calculations.garmin_calculation.sec_to_hours_min_sec(
			trans_sleep_data['remSleepInSeconds'],include_sec = False
		)
		sleep_stats["restless_sleep"] = quicklook.calculations.garmin_calculation.sec_to_hours_min_sec(
			trans_sleep_data['restlessDurationInSeconds'],
		 	include_sec = False
		 )
		sleep_stats["sleep_per_wearable"] = quicklook.calculations.garmin_calculation.sec_to_hours_min_sec(
			(trans_sleep_data['durationInSeconds'] 
			- trans_sleep_data['awakeDurationInSeconds']
			- trans_sleep_data['restlessDurationInSeconds']),
			include_sec = False
		)
	if ui_sleep_duration:
		sleep_stats['sleep_per_userinput'] = ui_sleep_duration

	if have_userinput_sleep:
		bed_time = ui_bedtime.replace(tzinfo = None)
		awake_time = ui_awaketime.replace(tzinfo = None)
		if str_date:
			sleep_stats['sleep_bed_time'] = bed_time.strftime("%I:%M %p")
			sleep_stats['sleep_awake_time'] = awake_time.strftime("%I:%M %p")
		else:
			sleep_stats['sleep_bed_time'] = bed_time
			sleep_stats['sleep_awake_time'] = awake_time

	elif trans_sleep_data:
		bed_time = datetime.strptime(
			trans_sleep_data['startTimeInSeconds'],
			"%Y-%m-%dT%H:%M:%S.%f")
		wake_time = bed_time + timedelta(
			seconds = trans_sleep_data['durationInSeconds'])
		if str_date:
			sleep_stats["sleep_bed_time"] = bed_time.strftime("%I:%M %p")
			sleep_stats["sleep_awake_time"] = wake_time.strftime("%I:%M %p")
		else:
			sleep_stats['sleep_bed_time'] = bed_time
			sleep_stats['sleep_awake_time'] = wake_time
	else:
		if not str_date:
			sleep_stats['sleep_bed_time'] = None
			sleep_stats['sleep_awake_time'] = None
	return sleep_stats


def apple_steps_data(todays_steps_data):

	''' This function is refer for apple_steps_data using this function
 we have to displaying the apple_steps_data in Raw data.
 '''
	apple_total_steps = 0
	for i,total_steps in enumerate(todays_steps_data):
		apple_total_steps = apple_total_steps + int(total_steps.get("steps",0))
	return apple_total_steps

	
def fitbit_heartrate_data(user,current_date):
	todays_heartrate_data = get_fitbit_model_data(
		UserFitbitDataHeartRate,user,current_date.date(),current_date.date())
	if todays_heartrate_data:
		todays_heartrate_data = ast.literal_eval(todays_heartrate_data[0].replace(
				"'heartrate_fitbit': {...}","'heartrate_fitbit': {}"))
		todays_heartrate_data = todays_heartrate_data['activities-heart']
		if todays_heartrate_data:
			heartrate_value = todays_heartrate_data[0].get("value")
			if heartrate_value and isinstance(heartrate_value,dict):
				# for the case when user have no intraday access
				resting_heartrate = heartrate_value.get("restingHeartRate",0)
			else:
				# If user have intraday access
				resting_heartrate = todays_heartrate_data[0].get("restingHeartRate",0)
		else:
			resting_heartrate = 0
	else:
		resting_heartrate = 0	
	return resting_heartrate


def get_avg_sleep_grade(ui_sleep_duration,sleep_per_wearable,age,sleep_aid):
	if ui_sleep_duration and ui_sleep_duration != ":":
		grade_point = quicklook.calculations.garmin_calculation\
			.cal_average_sleep_grade(ui_sleep_duration,age,sleep_aid)
		return grade_point
	elif sleep_per_wearable:
		grade_point = quicklook.calculations.garmin_calculation\
			.cal_average_sleep_grade(sleep_per_wearable,age,sleep_aid)
		return grade_point
	return (None,None)


def get_unprocessed_food_grade(daily_strong_input,current_date):
	'''
		This funtion works as get the unprocessed food grade and GPA from garmin calculations file

		Args: daily_strong_input(DailyStrongInput object)
		      current_date(type:string,format:YYYY-MM-DD)
		Return: tuple of unprocessed food grade and unprocessed food GPA
	'''
	unprocessed_food_grade_pt = quicklook.calculations.garmin_calculation.get_unprocessed_food_grade(
		daily_strong_input,current_date)
	return unprocessed_food_grade_pt

def get_penality_grades(ui_smoking_penalty,ui_controlled_substance_penalty,ui_sleep_aid_penalty):
	'''
		This funtion works as get the penalities from garmin calculations file

		Args: smoke,sleep_aid,controlled_substance data from User inputs
		Return: dictonary of smoking,sleep,controlled_substance penalities 
	'''
	penalties = quicklook.calculations.garmin_calculation.cal_penalty(
		ui_smoking_penalty,ui_controlled_substance_penalty,ui_sleep_aid_penalty)
	return penalties

def get_overall_grades(grades_calculated_data):
	'''
		This funtion works as get the Overal all grade and GPA from garmin calculations file

		Args: All grades
		Return: tuple of Overall grade Overall GPA
	'''
	overall_grade_pt = quicklook.calculations.garmin_calculation.get_overall_grade(
		grades_calculated_data)
	return overall_grade_pt

def calculate_apple_steps(user,start_date):
	""" This function will calculate the total apple steps
	Args:
		apple_data: user instance, start_date object
	Return:
		total apple steps
	"""
	apple_data = merge_user_data(user,start_date)
	total_apple_steps = 0
	if apple_data:
		for index,single_activity in enumerate(apple_data[0]):
			total_apple_steps = total_apple_steps + float(single_activity.get("steps",0))

	return total_apple_steps

def inactive_hours(movement_consistency):
	active_hours = 0
	inactive_hours = 0
	total_steps = 0
	sleeping_hours = 0
	strength_hours = 0
	exercise_hours = 0
	no_data_hours = 0
	nap_hours = 0
	timezone_change_hours = 0
	for interval,values in list(movement_consistency.items()):
		try:
			if movement_consistency[interval]['status'] == 'active': 
					active_hours += 1 
			elif movement_consistency[interval]['status'] == 'inactive':
				inactive_hours += 1
			elif movement_consistency[interval]['status'] == 'sleeping':
				sleeping_hours += 1
			elif movement_consistency[interval]['status'] == 'strength':
				strength_hours += 1
			elif movement_consistency[interval]['status'] == 'exercise':
				exercise_hours += 1
			elif movement_consistency[interval]['status'] == 'no data yet':
				no_data_hours += 1
			elif movement_consistency[interval]['status'] == 'time zone change':
				timezone_change_hours += 1
			elif movement_consistency[interval]['status'] == 'nap':
				nap_hours += 1
			total_steps += values['steps']
		except:
			pass
			
	
	movement_consistency['active_hours'] = active_hours
	movement_consistency['inactive_hours'] = inactive_hours
	movement_consistency['sleeping_hours'] = sleeping_hours
	movement_consistency['strength_hours'] = strength_hours
	movement_consistency['exercise_hours'] = exercise_hours
	movement_consistency['nap_hours'] = nap_hours
	movement_consistency['no_data_hours'] = no_data_hours
	movement_consistency['timezone_change_hours'] = timezone_change_hours
	movement_consistency['total_steps'] = total_steps

	return movement_consistency

def modify_mc(movement_consistency,todays_steps_data):
	'''This function will make mc accurate '''
	if todays_steps_data and movement_consistency:
		date_24hr = todays_steps_data[-1]["End date"]
		date_12hr = datetime.strptime(date_24hr, "%Y-%m-%d %H:%M:%S").strftime(
																"%Y-%m-%d %I:%M:%S %p")
		date_12hr_date_obj = datetime.strptime(date_24hr, "%Y-%m-%d %H:%M:%S")

		date_12hr_obj = date_12hr_date_obj.hour-12
		# movement_consistency = ast.literal_eval(movement_consistency)
		for key,value in movement_consistency.items():
			# print(key[-2:],"key")
			# print(date_12hr[-2:],"12 hr")
			# print(key[0:2],"key hour")
			if (key[-2:] == date_12hr[-2:] and 
				int(date_12hr_obj) < int(key[0:2]) and 
				value['steps'] == 0 and 
				value['status'] == 'inactive'):
				# print(int(date_12hr[12:13]),"mmm")
				# print(int(key[0:2]),"ccc")
				value['status'] = 'no data yet'
			if ((date_12hr[-2:] == 'AM' and key[-2:] == 'PM') and 
				(value['status'] == 'inactive')):
				value['status'] = 'no data yet'
		movement_consistency = inactive_hours(movement_consistency)
	return movement_consistency
			

def create_apple_quick_look(user,from_date=None,to_date=None):
	'''
		calculate and create quicklook instance for given date range

		Arguments -
			1) user is a "User" instance representing currently logged in user 
			2) from_date expect date string in format YYYY-MM-DD
			3) to_date expect date string in format YYYY-MM-DD   

	'''
	# date range for which quicklook is calculated
	print("Started Apple quicklook")
	from_dt = quicklook.calculations.garmin_calculation.str_to_datetime(from_date)
	to_dt = quicklook.calculations.garmin_calculation.str_to_datetime(to_date)
	current_date = from_dt
	SERIALIZED_DATA = []
	user_age = user.profile.age()

	while current_date <= to_dt:
		tomorrow_date = current_date + timedelta(days=1)
		last_seven_days_date = current_date - timedelta(days=6)
		start_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())
		end_epoch = start_epoch + 86400

		grades_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('grade')
		exercise_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('exercise')
		swim_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('swim')
		bike_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('bike')
		steps_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('step')
		sleeps_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('sleep')
		food_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields("food")
		alcohol_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields("alcohol")

		todays_sleep_data = None
		tomorrow_sleep_data = None
		# sleep_data = get_fitbit_model_data(
		# 		UserFitbitDataSleep,user,current_date.date(),
		# 		tomorrow_date.date(),group_by_date=True)
		# if sleep_data:
		# 	todays_sleep_data = sleep_data.get(current_date.strftime('%Y-%m-%d'))
		# 	tomorrow_sleep_data = sleep_data.get(tomorrow_date.strftime('%Y-%m-%d'))
		# 	if todays_sleep_data:
		# 		todays_sleep_data = ast.literal_eval(todays_sleep_data.replace(
		# 			"'sleep_fitbit': {...}","'sleep_fitbit': {}"))
		# 	if tomorrow_sleep_data:
		# 		tomorrow_sleep_data = ast.literal_eval(tomorrow_sleep_data.replace(
		# 			"'sleep_fitbit': {...}","'sleep_fitbit': {}"))

		todays_epoch_data = []
		total_steps_apple = calculate_apple_steps(user,current_date)
		# print(type(total_steps))
		todays_steps_data = get_apple_model_data(
			UserAppleDataSteps,user,current_date.date(),current_date.date())
		if todays_steps_data:
			todays_steps_data = ast.literal_eval(todays_steps_data[0])
			if todays_steps_data:
				intraday_steps = todays_steps_data
				interval_duration = 60
				quarterly_dataset = apple_steps_minutly_to_quartly(
					current_date.date(),
					intraday_steps)
				for step in quarterly_dataset:
					todays_epoch_data.append(fitbit_to_garmin_epoch(
						step,current_date.date(),interval_duration))
		try:
			user_inputs_qs = UserDailyInput.objects.select_related(
				'strong_input','encouraged_input','optional_input').filter(
				created_at__range = (current_date,tomorrow_date),user=user)
			user_inputs = {q.created_at.strftime("%Y-%m-%d"):q for q in user_inputs_qs}
			todays_user_input = user_inputs.get(current_date.strftime("%Y-%m-%d"))
			tomorrows_user_input = user_inputs.get(tomorrow_date.strftime("%Y-%m-%d"))
		except UserDailyInput.DoesNotExist:
			todays_user_input = None
			tomorrows_user_input = None


		# pull data for past 7 days (incuding today)
		daily_strong = list(DailyUserInputStrong.objects.filter(
			Q(user_input__created_at__gte = last_seven_days_date)&
			Q(user_input__created_at__lte = current_date),
			user_input__user = user).order_by('user_input__created_at'))

		daily_optional = list(DailyUserInputOptional.objects.filter(
			Q(user_input__created_at__gte = last_seven_days_date)&
			Q(user_input__created_at__lte = current_date),
			user_input__user = user).order_by('user_input__created_at'))

		todays_daily_optional = []
		for i,q in enumerate(daily_optional):
			if q.user_input.created_at == current_date.date():
				todays_daily_optional.append(daily_optional[i])
				break

		todays_daily_strong = []
		for i,q in enumerate(daily_strong):
			if q.user_input.created_at == current_date.date():
				todays_daily_strong.append(daily_strong[i])
				break

		weekly_user_input_activities = get_daily_activities_in_base_format(
			user,last_seven_days_date.date(),
			to_date = current_date.date(),
			include_all = True)
		userinput_activities = weekly_user_input_activities[current_date.strftime('%Y-%m-%d')]

		todays_activity_data = get_apple_model_data(
			UserAppleDataActivities,user,current_date.date(),current_date.date())
		
		if todays_activity_data and todays_activity_data[0]:
			try:
				todays_activity_data = [ast.literal_eval(todays_activity_data[0])]
				todays_activity_data = list(map(apple_to_garmin_activities,
					todays_activity_data))

				combined_user_exercise_activities,combined_user_exec_non_exec_activities =\
					quicklook.calculations.garmin_calculation.\
						get_filtered_activity_stats(
							todays_activity_data[0],user_age,
							userinput_activities = userinput_activities,
							epoch_summaries = todays_epoch_data,
							provide_all=True)
			except:
				logging.exception("message")
				combined_user_exercise_activities = []
				combined_user_exec_non_exec_activities = []
		else:
			combined_user_exercise_activities = []
			combined_user_exec_non_exec_activities = []

		ui_bedtime = None
		ui_awaketime = None
		ui_timezone = None
		ui_sleep_duration = ""	
		ui_sleep_comment = ""
		ui_sleep_aid = ""
		ui_workout_easy_hard = ""
		ui_medication = ""
		ui_smoke_substance = ""
		ui_water_consumed_workout = 0
		ui_pain = ""
		ui_pain_area = ""
		ui_stress_level = ""
		ui_chia_seeds_consumed_workout = 0
		ui_fast_before_workout = ""
		ui_sick = ''
		ui_workout_comment = ""
		ui_workout_effort_level = 0
		ui_prcnt_unprocessed_food_consumed_yesterday = 0
		ui_non_processed_food = ""
		ui_processed_food = ""
		ui_diet_type = ""
		ui_alcohol_day = ""
		ui_sleep_aid_penalty = ""
		ui_controlled_substance_penalty = ""
		ui_smoking_penalty = ""
		ui_did_workout = ""
		ui_prcnt_breath_through_nose = 0

		# calling the resting hearate from fitbit models
		# resting_heartrate = fitbit_heartrate_data(user,current_date)
		# passing resting heart rate value to exercise dictionary
		# exercise_calculated_data['resting_hr_last_night'] = resting_heartrate

		if todays_user_input:
			ui_bedtime = todays_user_input.strong_input.sleep_bedtime
			ui_awaketime = todays_user_input.strong_input.sleep_awake_time
			ui_timezone = todays_user_input.timezone
			ui_sleep_comment = todays_user_input.strong_input.sleep_comment
			ui_sleep_aid = todays_user_input.strong_input.prescription_or_non_prescription_sleep_aids_last_night
			ui_workout_easy_hard = todays_user_input.strong_input.work_out_easy_or_hard
			ui_medication = todays_user_input.strong_input.prescription_or_non_prescription_medication_yesterday
			ui_smoke_substance = todays_user_input.strong_input.smoke_any_substances_whatsoever
			water_consumed = todays_user_input.encouraged_input.water_consumed_during_workout
			if water_consumed:
				ui_water_consumed_workout = int(water_consumed)
			ui_pain = todays_user_input.encouraged_input.pains_twings_during_or_after_your_workout
			ui_pain_area = todays_user_input.encouraged_input.pain_area
			ui_stress_level = todays_user_input.encouraged_input.stress_level_yesterday
			chia_seeds_consumed = todays_user_input.optional_input.chia_seeds_consumed_during_workout
			if ui_chia_seeds_consumed_workout:
				ui_chia_seeds_consumed_workout = int(chia_seeds_consumed)
			ui_fast_before_workout = todays_user_input.optional_input.fasted_during_workout
			ui_sick = todays_user_input.optional_input.sick
			ui_workout_comment = todays_user_input.optional_input.general_Workout_Comments
			effort_level = todays_user_input.strong_input.workout_effort_level
			if effort_level:
				ui_workout_effort_level = int(effort_level)
			prcnt_non_processed_food = todays_user_input.strong_input.prcnt_unprocessed_food_consumed_yesterday
			if prcnt_non_processed_food:
				ui_prcnt_unprocessed_food_consumed_yesterday = int(prcnt_non_processed_food)
			ui_non_processed_food = todays_user_input.strong_input.list_of_unprocessed_food_consumed_yesterday
			ui_processed_food = todays_user_input.strong_input.list_of_processed_food_consumed_yesterday
			ui_diet_type = todays_user_input.optional_input.type_of_diet_eaten
			ui_alcohol_day = todays_user_input.strong_input.number_of_alcohol_consumed_yesterday
			ui_sleep_aid_penalty = todays_user_input.strong_input.prescription_or_non_prescription_sleep_aids_last_night
			ui_controlled_substance_penalty = todays_user_input.strong_input.controlled_uncontrolled_substance
			ui_smoking_penalty = todays_user_input.strong_input.smoke_any_substances_whatsoever
			ui_did_workout = todays_user_input.strong_input.workout
			prcnt_breath_through_nose = todays_user_input.encouraged_input.workout_that_user_breathed_through_nose
			if prcnt_breath_through_nose:
				ui_prcnt_breath_through_nose = int(prcnt_breath_through_nose)
			
		
			'''user inputs of activites for displaying exercise reporting'''

			exercise_calculated_data['workout_easy_hard'] = ui_workout_easy_hard
			exercise_calculated_data['water_consumed_workout'] = ui_water_consumed_workout
			exercise_calculated_data['chia_seeds_consumed_workout'] = ui_chia_seeds_consumed_workout
			exercise_calculated_data['fast_before_workout'] = ui_fast_before_workout
			exercise_calculated_data['pain'] = ui_pain
			exercise_calculated_data['pain_area'] = ui_pain_area
			exercise_calculated_data['stress_level'] = ui_stress_level
			exercise_calculated_data['sick'] = ui_sick
			exercise_calculated_data['medication'] = ui_medication
			exercise_calculated_data['smoke_substance'] = ui_smoke_substance
			exercise_calculated_data['workout_comment'] = ui_workout_comment
			exercise_calculated_data['effort_level'] = ui_workout_effort_level
			exercise_calculated_data['nose_breath_prcnt_workout'] = ui_prcnt_breath_through_nose

		#Food 
		# food_calculated_data['prcnt_non_processed_food'] = ui_prcnt_unprocessed_food_consumed_yesterday
		# food_calculated_data['non_processed_food'] = ui_non_processed_food
		# food_calculated_data['processed_food'] = ui_processed_food
		# food_calculated_data['diet_type'] =  ui_diet_type

		# Grades
		# todays_daily_strong = []
		# for i,q in enumerate(daily_strong):
		# 	if q.user_input.created_at == current_date.date():
		# 		todays_daily_strong.append(daily_strong[i])
		# 		break
		# if todays_daily_strong:
		# 	unprocessed_food_grade_pt = get_unprocessed_food_grade(todays_daily_strong,current_date)
		# 	grades_calculated_data['prcnt_unprocessed_food_consumed_grade'] = unprocessed_food_grade_pt[0] \
		# 	if unprocessed_food_grade_pt[0] else ''
		# 	grades_calculated_data['prcnt_unprocessed_food_consumed_gpa'] = unprocessed_food_grade_pt[1] \
		# 	if unprocessed_food_grade_pt[1] else 0

		#Alcohol
		# grade,avg_alcohol,avg_alcohol_gpa = quicklook.calculations\
		# 	.garmin_calculation\
		# 	.get_alcohol_grade_avg_alcohol_week(daily_strong,user)
		# alcohol_calculated_data['alcohol_day'] = ui_alcohol_day
		# grades_calculated_data['alcoholic_drink_per_week_grade'] = grade
		# alcohol_calculated_data['alcohol_week'] = avg_alcohol
		# grades_calculated_data['alcoholic_drink_per_week_gpa'] = avg_alcohol_gpa


		# Penalties
		# if todays_daily_strong:
		# 	penalties = get_penality_grades(
		# 		ui_smoking_penalty,
		# 		ui_controlled_substance_penalty,
		# 		ui_sleep_aid_penalty)
		# 	grades_calculated_data["sleep_aid_penalty"] = penalties['sleep_aid_penalty']
		# 	grades_calculated_data['ctrl_subs_penalty'] = penalties['ctrl_subs_penalty']
		# 	grades_calculated_data['smoke_penalty'] = penalties['smoke_penalty']

	
		#Sleep Calculations
		
		# adding nap hours for sleep per user input felid
		# ui_sleep_duration = quicklook.calculations.garmin_calculation.\
		# 	get_user_input_total_sleep(
		# 		todays_daily_strong,todays_daily_optional)

		# sleep_stats = get_sleep_stats(todays_sleep_data,
		# 	ui_bedtime = ui_bedtime,ui_awaketime = ui_awaketime, 
		# 	ui_sleep_duration = ui_sleep_duration,
		# 	ui_timezone = ui_timezone,str_date=False)

		# sleep_bed_time = sleep_stats['sleep_bed_time']
		# sleep_awake_time = sleep_stats['sleep_awake_time']
		# if sleep_bed_time:
		# 	sleep_bed_time = sleep_bed_time.strftime("%I:%M %p")
		# else:
		# 	sleep_bed_time = ''

		# if sleep_awake_time:
		# 	sleep_awake_time = sleep_awake_time.strftime("%I:%M %p")
		# else:
		# 	sleep_awake_time = ''

		# sleeps_calculated_data['deep_sleep'] = sleep_stats['deep_sleep']
		# sleeps_calculated_data['light_sleep'] = sleep_stats['light_sleep']
		# sleeps_calculated_data['rem_sleep'] = sleep_stats['rem_sleep']
		# sleeps_calculated_data['awake_time'] = sleep_stats['awake_time']
		# sleeps_calculated_data['sleep_bed_time'] = sleep_bed_time
		# sleeps_calculated_data['sleep_awake_time'] = sleep_awake_time
		# sleeps_calculated_data['sleep_per_wearable'] = sleep_stats['sleep_per_wearable']
		# sleeps_calculated_data['sleep_per_user_input'] = (ui_sleep_duration 
		# 	if ui_sleep_duration else "")
		# sleeps_calculated_data['sleep_comments'] = ui_sleep_comment
		# sleeps_calculated_data['sleep_aid'] = ui_sleep_aid
		# sleeps_calculated_data['restless_sleep'] = sleep_stats['restless_sleep']

		# Sleep grade point calculation
		# sleep_grade_point = get_avg_sleep_grade(
		# 	sleep_stats['sleep_per_userinput'],
		# 	sleep_stats['sleep_per_wearable'],
		# 	user_age,ui_sleep_aid
		# 	)
		# grades_calculated_data['avg_sleep_per_night_grade'] = \
		# 	sleep_grade_point[0] if sleep_grade_point[0] else ''
		# grades_calculated_data['avg_sleep_per_night_gpa'] = \
		# 	sleep_grade_point[1] if sleep_grade_point[1] else 0

		# Exercise/Activity Calculations
		activity_stats = quicklook.calculations.garmin_calculation.get_activity_stats(
			combined_user_exercise_activities,user_age)
		exercise_calculated_data['did_workout'] = activity_stats['have_activity']
		exercise_calculated_data['distance_run'] = activity_stats['distance_run_miles']
		exercise_calculated_data['distance_bike'] = activity_stats['distance_bike_miles']
		exercise_calculated_data['distance_swim'] = activity_stats['distance_swim_yards']
		exercise_calculated_data['distance_other'] = activity_stats['distance_other_miles']
		exercise_calculated_data['workout_duration'] = quicklook.calculations.garmin_calculation.\
			sec_to_hours_min_sec(
			activity_stats['total_duration'])
		exercise_calculated_data['pace'] = activity_stats['pace']
		exercise_calculated_data['avg_heartrate'] = activity_stats['avg_heartrate']
		exercise_calculated_data['activities_duration'] = activity_stats['activities_duration']
		exercise_calculated_data['did_workout'] = quicklook.calculations.garmin_calculation.\
			did_workout_today(have_activities=activity_stats['have_activity']
				,user_did_workout=ui_did_workout)
		
		# Steps calculation
		daily_total_steps = apple_steps_data(todays_steps_data)
		exercise_steps,non_exercise_steps,total_steps = quicklook.calculations.\
			garmin_calculation.cal_exercise_steps_total_steps(
				int(daily_total_steps),
				combined_user_exec_non_exec_activities,
				user_age
			)
		steps_calculated_data['non_exercise_steps'] = non_exercise_steps
		steps_calculated_data['exercise_steps'] = exercise_steps
		steps_calculated_data['total_steps'] = total_steps


		# Non exercise steps grade and gpa calculation
		moment_non_exercise_steps_grade_point = quicklook.calculations\
			.garmin_calculation.cal_non_exercise_step_grade(non_exercise_steps)
		grades_calculated_data['movement_non_exercise_steps_grade'] = \
			moment_non_exercise_steps_grade_point[0]
		grades_calculated_data['movement_non_exercise_steps_gpa'] = \
			moment_non_exercise_steps_grade_point[1]
			
		# Exercise Grade and point calculation
		# exe_consistency_grade = quicklook.calculations\
		# 	.garmin_calculation.get_exercise_consistency_grade(
		# 	user,current_date,user_age,weekly_user_input_activities)
		# grades_calculated_data['exercise_consistency_grade'] = \
		# 	exe_consistency_grade[0]
		# grades_calculated_data['exercise_consistency_score'] = \
		# 	exe_consistency_grade[1]

		# Movement consistency and movement consistency grade calculation
		# Time user go to bed last night
		# yesterday_bedtime = sleep_stats['sleep_bed_time']
		# Time user wake up today
		# today_awake_time = sleep_stats['sleep_awake_time']
		# Time user went to bed again today
		# today_bedtime = None
		# strength_start_time = None
		# strength_end_time = None
		# nap_start_time = None
		# nap_end_time = None
		# tomorrows_user_input_tz = None

		# if tomorrows_user_input and tomorrows_user_input.strong_input:
		# 	today_bedtime = tomorrows_user_input.strong_input.sleep_bedtime
		# 	tomorrows_user_input_tz = tomorrows_user_input.timezone

		# if (today_bedtime and tomorrows_user_input_tz):
		# 	target_tz = pytz.timezone(tomorrows_user_input_tz)
		# 	today_bedtime = today_bedtime.astimezone(target_tz).replace(tzinfo=None)
		# else:
		# 	tomorrow_sleep_stats = get_sleep_stats(tomorrow_sleep_data,str_date=False)
		# 	today_bedtime = tomorrow_sleep_stats['sleep_bed_time']

		# if todays_user_input:
		# 	ui_strength_start_time = todays_user_input.strong_input.strength_workout_start
		# 	ui_strength_end_time = todays_user_input.strong_input.strength_workout_end
		# 	if ui_strength_start_time and ui_strength_end_time:
		# 		strength_start_time = quicklook.calculations.garmin_calculation\
		# 			._str_duration_to_dt(current_date,ui_strength_start_time)
		# 		strength_end_time = quicklook.calculations.garmin_calculation\
		# 			._str_duration_to_dt(current_date,ui_strength_end_time)

		# 	ui_nap_start_time = todays_user_input.optional_input.nap_start_time
		# 	ui_nap_end_time = todays_user_input.optional_input.nap_end_time
		# 	if ui_nap_start_time and ui_nap_end_time:
		# 		nap_start_time = quicklook.calculations.garmin_calculation\
		# 			._str_duration_to_dt(current_date,ui_nap_start_time)
		# 		nap_end_time = quicklook.calculations.garmin_calculation\
		# 			._str_duration_to_dt(current_date,ui_nap_end_time)

		movement_consistency = quicklook.calculations.garmin_calculation\
			.cal_movement_consistency_summary(
				user,
				current_date,
				todays_epoch_data,
				yesterday_bedtime = None,#yesterday_bedtime,
				today_awake_time = None,#today_awake_time,
				combined_user_activities = combined_user_exercise_activities,#combined_user_exercise_activities,
				today_bedtime = None,#today_bedtime,
				user_input_strength_start_time = None,#strength_start_time,
		  		user_input_strength_end_time = None,#strength_end_time,
		  		nap_start_time = None,#nap_start_time,
		  		nap_end_time = None,#nap_end_time
			)
		if movement_consistency:
			movement_consistency = modify_mc(movement_consistency,todays_steps_data)
			# movement_consistency = ast.literal_eval(movement_consistency)
			steps_calculated_data['movement_consistency'] = json.dumps(movement_consistency)
			inactive_hours = movement_consistency.get("inactive_hours")
			grade = quicklook.calculations.garmin_calculation\
				.cal_movement_consistency_grade(inactive_hours)
			grades_calculated_data['movement_consistency_grade'] = grade
		# overal grades gpa and grade
		overall_grade_pt = get_overall_grades(grades_calculated_data)
		grades_calculated_data['overall_health_grade'] = overall_grade_pt[0]
		grades_calculated_data['overall_health_gpa'] = overall_grade_pt[1]

		# If quick look for provided date exist then update it otherwise
		# create new quicklook instance 
		try:
			user_ql = UserQuickLook.objects.get(user=user,created_at = current_date.date())
			quicklook.calculations.garmin_calculation\
				.update_helper(user_ql.grades_ql,grades_calculated_data)
			quicklook.calculations.garmin_calculation\
				.update_helper(user_ql.exercise_reporting_ql, exercise_calculated_data)
			quicklook.calculations.garmin_calculation\
				.update_helper(user_ql.swim_stats_ql, swim_calculated_data)
			quicklook.calculations.garmin_calculation\
				.update_helper(user_ql.bike_stats_ql, bike_calculated_data)
			quicklook.calculations.garmin_calculation\
				.update_helper(user_ql.steps_ql, steps_calculated_data)
			quicklook.calculations.garmin_calculation\
				.update_helper(user_ql.sleep_ql, sleeps_calculated_data)
			quicklook.calculations.garmin_calculation\
				.update_helper(user_ql.food_ql, food_calculated_data)
			quicklook.calculations.garmin_calculation\
				.update_helper(user_ql.alcohol_ql, alcohol_calculated_data)

		except UserQuickLook.DoesNotExist:
			user_ql = UserQuickLook.objects.create(user = user,created_at=current_date.date())
			Grades.objects.create(user_ql=user_ql, **grades_calculated_data)
			ExerciseAndReporting.objects.create(user_ql = user_ql,**exercise_calculated_data)
			SwimStats.objects.create(user_ql=user_ql, **swim_calculated_data)
			BikeStats.objects.create(user_ql = user_ql,**bike_calculated_data)
			Steps.objects.create(user_ql = user_ql,**steps_calculated_data)
			Sleep.objects.create(user_ql = user_ql,**sleeps_calculated_data)
			Food.objects.create(user_ql = user_ql,**food_calculated_data)
			Alcohol.objects.create(user_ql = user_ql,**alcohol_calculated_data)

		SERIALIZED_DATA.append(UserQuickLookSerializer(user_ql).data)
		#Add one day to current date
		current_date += timedelta(days=1)

	return SERIALIZED_DATA
