from datetime import datetime,timedelta
import ast
import json
import time
import pdb
import pytz

from user_input.models import UserDailyInput

from quicklook.serializers import UserQuickLookSerializer

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
from fitbit.models import (                        
	UserFitbitDataSleep,
	UserFitbitDataHeartRate,
	UserFitbitDataActivities,                                                  
	UserFitbitDataSteps,
	UserFitbitDatabody,
	UserFitbitDatafoods
)

from .converter.fitbit_to_garmin_converter import fitbit_to_garmin_sleep
from .converter.fitbit_to_garmin_converter import fitbit_to_garmin_activities

def get_fitbit_model_data(model,user,start_date, end_date, order_by = None):

	date_field = None
	data_field = None
	if model == UserFitbitDataSleep:
		date_field = "date_of_sleep"
		data_field = "sleep_data"
	elif model == UserFitbitDataHeartRate:
		date_field = "date_of_heartrate"
		data_field = "heartrate_data"
	elif model == UserFitbitDataActivities:
		date_field = "date_of_activities"
		data_field = "activities_data"
	elif model == UserFitbitDataSteps:
		date_field = "date_of_steps" 
		data_field = "steps_data"
	elif model == UserFitbitDatabody:
		date_field = "date_of_body"
		data_field = "body_data"
	elif model == UserFitbitDatafoods:
		date_field = "date_of_foods"
		data_field = "foods_data"

	if date_field and data_field:
		lookup_kwargs = {'{}__{}'.format(date_field,"range"):(
			start_date,end_date)}
		if order_by:
			summaries = model.objects.filter(
					**lookup_kwargs,
					user = user).order_by(order_by)
			return [q.data for q in summaries]
		else:
			summaries = model.objects.filter(
				**lookup_kwargs,
				user = user)
			return [q.__dict__.get(data_field) for q in summaries]
	else:
		return None

def get_sleep_stats(sleep_data, ui_bedtime = None,
 	ui_awaketime = None, ui_sleep_duration = None,
 	ui_timezone = None,str_date=True):		
	sleep_stats = {
		"deep_sleep": '',
		"light_sleep": '',
		"awake_time": '',
		"rem_sleep":'',
		"restless":'',
		"sleep_bed_time": '',
		"sleep_awake_time": '',
		"sleep_per_wearable":'',
		"sleep_per_userinput":''
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
		main_sleep_data = list(filter(lambda x:x.get('isMainSleep'),sleep_data['sleep']))
		if not main_sleep_data:
			main_sleep_data = sleep_data['sleep']
		main_sleep_data = main_sleep_data[0]
		trans_sleep_data = fitbit_to_garmin_sleep(main_sleep_data)

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
		# sleep_stats["restless"] = quicklook.calculations.garmin_calculation.sec_to_hours_min_sec(
		# 	trans_sleep_data['restlessDurationInSeconds'],
		# 	include_sec = False
		# )
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


def fitbit_steps_data(user,current_date):

	''' This function is refer for fitbit_steps_data using this function
 we have to displaying the fitbit_stepsdata in Raw data.
 '''
	todays_steps_data = get_fitbit_model_data(
			UserFitbitDataSteps,user,current_date.date(),current_date.date())
	if todays_steps_data:
		todays_steps_data = ast.literal_eval(todays_steps_data[0].replace(
				"'steps_fitbit': {...}","'steps_fitbit': {}"))
		total_steps = todays_steps_data['activities-steps'][0]['value']
	else:
		total_steps = 0	
	return total_steps

def fitbit_heartrate_data(user,current_date):
	todays_heartrate_data = get_fitbit_model_data(
		UserFitbitDataHeartRate,user,current_date.date(),current_date.date())
	if todays_heartrate_data:
		todays_heartrate_data = ast.literal_eval(todays_heartrate_data[0].replace(
				"'heartrate_fitbit': {...}","'heartrate_fitbit': {}"))
		todays_heartrate_data = todays_heartrate_data['activities-heart']
		if todays_heartrate_data:
			heartrate_value = todays_heartrate_data[0].get("value")
			if heartrate_value:
				resting_heartrate = heartrate_value.get("restingHeartRate",0)
			else:
				resting_heartrate = 0
		else:
			resting_heartrate = 0
	else:
		resting_heartrate = 0	
	return resting_heartrate
	
def get_exercise_steps(trans_activity_data):
	total_execrcise_steps = 0
	for i,single_activity in enumerate(trans_activity_data):
		total_execrcise_steps = total_execrcise_steps + int(single_activity.get("steps",0))
	return total_execrcise_steps

def create_fitbit_quick_look(user,from_date=None,to_date=None):
	'''
		calculate and create quicklook instance for given date range

		Arguments -
			1) user is a "User" instance representing currently logged in user 
			2) from_date expect date string in format YYYY-MM-DD
			3) to_date expect date string in format YYYY-MM-DD   

	'''
	# date range for which quicklook is calculated
	from_dt = quicklook.calculations.garmin_calculation.str_to_datetime(from_date)
	to_dt = quicklook.calculations.garmin_calculation.str_to_datetime(to_date)
	current_date = from_dt
	SERIALIZED_DATA = []
	while current_date <= to_dt:
		
		grades_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('grade')
		exercise_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('exercise')
		swim_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('swim')
		bike_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('bike')
		steps_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('step')
		sleeps_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields('sleep')
		food_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields("food")
		alcohol_calculated_data = quicklook.calculations.garmin_calculation.get_blank_model_fields("alcohol")

		todays_sleep_data = get_fitbit_model_data(
				UserFitbitDataSleep,user,current_date.date(),current_date.date())
		try:
			todays_user_input = UserDailyInput.objects.select_related(
				'strong_input','encouraged_input','optional_input').filter(
				created_at = current_date.date(), user=user)
		except UserDailyInput.DoesNotExist:
			todays_user_input = None

		# calling the resting hearate from fitbit models
		resting_heartrate = fitbit_heartrate_data(user,current_date)
		#passing resting heart rate value to exercise dictionary
		exercise_calculated_data['resting_hr_last_night'] = resting_heartrate

		ui_bedtime = None
		ui_awaketime = None
		ui_timezone = None
		ui_sleep_duration = None
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

		if todays_user_input:
			todays_user_input = todays_user_input[0]
			ui_bedtime = todays_user_input.strong_input.sleep_bedtime
			ui_awaketime = todays_user_input.strong_input.sleep_awake_time
			ui_timezone = todays_user_input.timezone
			ui_sleep_duration = todays_user_input.strong_input.sleep_time_excluding_awake_time
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

		if todays_sleep_data:
			todays_sleep_data = ast.literal_eval(todays_sleep_data[0].replace(
				"'sleep_fitbit': {...}","'sleep_fitbit': {}"))
		else:
			todays_sleep_data = None
		sleep_stats = get_sleep_stats(todays_sleep_data,
			ui_bedtime = ui_bedtime,ui_awaketime = ui_awaketime, 
			ui_sleep_duration = ui_sleep_duration,ui_timezone = ui_timezone)

		sleeps_calculated_data['deep_sleep'] = sleep_stats['deep_sleep']
		sleeps_calculated_data['light_sleep'] = sleep_stats['light_sleep']
		sleeps_calculated_data['rem_sleep'] = sleep_stats['rem_sleep']
		sleeps_calculated_data['awake_time'] = sleep_stats['awake_time']
		sleeps_calculated_data['sleep_bed_time'] = sleep_stats['sleep_bed_time']
		sleeps_calculated_data['sleep_awake_time'] = sleep_stats['sleep_awake_time']
		sleeps_calculated_data['sleep_per_wearable'] = sleep_stats['sleep_per_wearable']
		sleeps_calculated_data['sleep_per_user_input'] = sleep_stats['sleep_per_userinput']
		#sleeps_calculated_data['restless'] = sleep_stats['restless']

		todays_activity_data = get_fitbit_model_data(
			UserFitbitDataActivities,user,current_date.date(),current_date.date())
		if todays_activity_data:
			todays_activity_data = ast.literal_eval(todays_activity_data[0].replace(
				"'activity_fitbit': {...}","'activity_fitbit': {}"))
			todays_activity_data = todays_activity_data['activities']
		else:
			todays_activity_data = None

		if todays_activity_data:
			trans_activity_data = list(map(fitbit_to_garmin_activities,
				todays_activity_data))
			activity_stats = quicklook.calculations.garmin_calculation.get_activity_stats(trans_activity_data)
			exercise_calculated_data['did_workout'] = activity_stats['have_activity']
			exercise_calculated_data['workout_easy_hard'] = ui_workout_easy_hard
			exercise_calculated_data['distance_run'] = activity_stats['distance_run_miles']
			exercise_calculated_data['distance_bike'] = activity_stats['distance_bike_miles']
			exercise_calculated_data['distance_swim'] = activity_stats['distance_swim_yards']
			exercise_calculated_data['distance_other'] = activity_stats['distance_other_miles']
			exercise_calculated_data['workout_duration'] = quicklook.calculations.garmin_calculation.sec_to_hours_min_sec(
				activity_stats['total_duration'])
			exercise_calculated_data['pace'] = activity_stats['pace']
			exercise_calculated_data['avg_heartrate'] = activity_stats['avg_heartrate']
			exercise_calculated_data['activities_duration'] = activity_stats['activities_duration']
		
		fitbit_steps = fitbit_steps_data(user,current_date)
		if todays_activity_data:
			trans_activity_data = list(map(fitbit_to_garmin_activities,
				todays_activity_data))
			exercise_steps = get_exercise_steps(trans_activity_data)
			non_exercise_steps = int(fitbit_steps) - int(exercise_steps)
			steps_calculated_data["total_steps"] = fitbit_steps
			steps_calculated_data["non_exercise_steps"] = non_exercise_steps if non_exercise_steps >= 0 else 0
			steps_calculated_data["exercise_steps"] = exercise_steps
		else:
			steps_calculated_data["total_steps"] = fitbit_steps
			steps_calculated_data["non_exercise_steps"] = fitbit_steps
			steps_calculated_data["exercise_steps"] = 0

		# If quick look for provided date exist then update it otherwise
		# create new quicklook instance 
		try:
			user_ql = UserQuickLook.objects.get(user=user,created_at = current_date.date())
			quicklook.calculations.garmin_calculation.update_helper(user_ql.grades_ql,grades_calculated_data)
			quicklook.calculations.garmin_calculation.update_helper(user_ql.exercise_reporting_ql, exercise_calculated_data)
			quicklook.calculations.garmin_calculation.update_helper(user_ql.swim_stats_ql, swim_calculated_data)
			quicklook.calculations.garmin_calculation.update_helper(user_ql.bike_stats_ql, bike_calculated_data)
			quicklook.calculations.garmin_calculation.update_helper(user_ql.steps_ql, steps_calculated_data)
			quicklook.calculations.garmin_calculation.update_helper(user_ql.sleep_ql, sleeps_calculated_data)
			quicklook.calculations.garmin_calculation.update_helper(user_ql.food_ql, food_calculated_data)
			quicklook.calculations.garmin_calculation.update_helper(user_ql.alcohol_ql, alcohol_calculated_data)

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