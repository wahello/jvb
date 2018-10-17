from datetime import datetime,timedelta,date,timezone
import ast
import pytz
import json
from user_input.models import UserDailyInput

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
from fitbit.models import (                        
	UserFitbitDataSleep,
	UserFitbitDataHeartRate,
	UserFitbitDataActivities,                                                  
	UserFitbitDataSteps,
	UserFitbitDatabody,
	UserFitbitDatafoods
)

from garmin.models import (
	UserGarminDataActivity,
	UserGarminDataManuallyUpdated
	)

from user_input.models import DailyUserInputStrong
from user_input.models import DailyUserInputOptional

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

def get_exercise_steps(trans_activity_data):
	total_execrcise_steps = 0
	for i,single_activity in enumerate(trans_activity_data):
		total_execrcise_steps = total_execrcise_steps + int(single_activity.get("steps",0))
	return total_execrcise_steps

def makeformat(trans_activity_data,current_date,last_seven_days_date):
	formated_data = OrderedDict()
	while(last_seven_days_date <= current_date):
		formated_data[last_seven_days_date.strftime('%Y-%m-%d')]=[]
		last_seven_days_date += timedelta(days=1)
	fitbt_act = None
	if trans_activity_data:
			for i,single_activity in enumerate(trans_activity_data):
				activity_date = trans_activity_data[i][0]["startTimeInSeconds"]
				actvity_date = activity_date[:10]
				if actvity_date:
					# if datetime.strptime(actvity_date,'%Y-%m-%d') <= current_date:
					formated_data[actvity_date] = single_activity	
	return formated_data

def get_exercise_consistency_grade(user,current_date):
	trans_activity_data = []
	last_seven_days_date = current_date - timedelta(days=6)
	week_activity_data = UserFitbitDataActivities.objects.filter(
		Q(created_at__gte = last_seven_days_date)&
		Q(created_at__lte = current_date),
		user=user).order_by('created_at')
	daily_strong = list(DailyUserInputStrong.objects.filter(
			Q(user_input__created_at__gte = last_seven_days_date)&
			Q(user_input__created_at__lte = current_date),
			user_input__user = user).order_by('user_input__created_at'))
	weekly_daily_strong = quicklook.calculations.garmin_calculation.get_weekly_user_input_data(
		daily_strong,current_date,last_seven_days_date)
	if week_activity_data:
		for i in range(0,len(week_activity_data)):
			todays_activity_data = ast.literal_eval(week_activity_data[i].activities_data.replace(
				"'activity_fitbit': {...}","'activity_fitbit': {}"))
			todays_activity_data = todays_activity_data.get('activities')
			if todays_activity_data:
				trans_activity_data.append(list(map(fitbit_to_garmin_activities,todays_activity_data)))
	formated_data = makeformat(trans_activity_data,current_date,last_seven_days_date)
	exe_consistency_grade,exe_consistency_point = quicklook.calculations.\
		garmin_calculation.get_exercise_consistency_grade(
			weekly_daily_strong,formated_data,7)
	return (exe_consistency_grade,exe_consistency_point)

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
		last_seven_days_date = current_date - timedelta(days=6)
		start_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())
		end_epoch = start_epoch + 86400

		sleeps = get_fitbit_model_data(UserFitbitDataSleep,
									   user,start_epoch-86400,end_epoch-86400,
									   order_by = '-id')
		sleeps_today = get_fitbit_model_data(UserFitbitDataSleep,
											user, start_epoch,end_epoch,order_by = '-id')

		sleeps_json = [ast.literal_eval(dic) for dic in sleeps]
		sleeps_today_json = [ast.literal_eval(dic) for dic in sleeps_today]

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
			# user_inputs = {q.created_at.strftime("%Y-%m-%d"):q for q in todays_user_input}
			# todays_user_input = user_inputs.get(current_date.strftime("%Y-%m-%d"))
			# tomorrows_user_input = user_inputs.get(tomorrow_date.strftime("%Y-%m-%d"))
		except UserDailyInput.DoesNotExist:
			todays_user_input = None
			# tomorrows_user_input = None			# tomorrows_user_input = None


		activities = quicklook.calculations.garmin_calculation.get_garmin_model_data(
			UserGarminDataActivity,user,
			last_seven_days_date.replace(tzinfo=timezone.utc).timestamp(),end_epoch,
			order_by = '-id', filter_dup = True)

		weekly_activities = quicklook.calculations.garmin_calculation.get_weekly_data(
			activities,current_date,last_seven_days_date)
		todays_activities = weekly_activities.get(current_date.strftime('%Y-%m-%d'))

		manually_updated = quicklook.calculations.garmin_calculation.get_garmin_model_data(
			UserGarminDataManuallyUpdated,user,
			last_seven_days_date.replace(tzinfo=timezone.utc).timestamp(),end_epoch,
			order_by = '-id', filter_dup = True)

		# Already parsed from json to python objects
		weekly_manual_activities = quicklook.calculations.garmin_calculation.get_weekly_data(
			manually_updated,current_date,last_seven_days_date)
		todays_manually_updated = weekly_manual_activities.get(current_date.strftime('%Y-%m-%d'))


		todays_activities_json = todays_activities

		todays_manually_updated_json = {}
		for dic in todays_manually_updated:
			todays_manually_updated_json[dic.get('summaryId')] = dic

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

		userinput_activities = quicklook.calculations.garmin_calculation.safe_get(
			todays_daily_strong,'activities',None)
		if userinput_activities:
			userinput_activities = json.loads(userinput_activities)

		combined_user_activities = quicklook.calculations.garmin_calculation.get_filtered_activity_stats(
			todays_activities_json,todays_manually_updated_json,
			userinput_activities,user = user, calendar_date = current_date)

		activity_stats = quicklook.calculations.garmin_calculation.get_activity_stats(
			combined_user_activities)

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
		ui_nap_start_time = None
		ui_nap_end_time = None
		
		# adding nap hours for sleep per user input felid
		ui_bedtime = quicklook.calculations.garmin_calculation.safe_get(todays_daily_strong,"sleep_bedtime",None)
		ui_awaketime = quicklook.calculations.garmin_calculation.safe_get(todays_daily_strong,"sleep_awake_time",None)
		ui_sleep_duration = quicklook.calculations.garmin_calculation.get_user_input_total_sleep(
			todays_daily_strong,todays_daily_optional)
	

		# calling the resting hearate from fitbit models
		resting_heartrate = fitbit_heartrate_data(user,current_date)
		#passing resting heart rate value to exercise dictionary
		exercise_calculated_data['resting_hr_last_night'] = resting_heartrate

		todays_user_input_copy = todays_user_input

		if todays_user_input:
			todays_user_input = todays_user_input[0]
			ui_bedtime = todays_user_input.strong_input.sleep_bedtime
			ui_awaketime = todays_user_input.strong_input.sleep_awake_time
			ui_timezone = todays_user_input.timezone
			#ui_sleep_duration = todays_user_input.strong_input.sleep_time_excluding_awake_time
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

		exercise_calculated_data['did_workout'] = quicklook.calculations.garmin_calculation.did_workout_today(
				have_activities=activity_stats['have_activity'],user_did_workout=ui_did_workout)

		#Food 
		food_calculated_data['prcnt_non_processed_food'] = ui_prcnt_unprocessed_food_consumed_yesterday
		food_calculated_data['non_processed_food'] = ui_non_processed_food
		food_calculated_data['processed_food'] = ui_processed_food
		food_calculated_data['diet_type'] =  ui_diet_type

		# Grades
		todays_daily_strong = []
		for i,q in enumerate(daily_strong):
			if q.user_input.created_at == current_date.date():
				todays_daily_strong.append(daily_strong[i])
				break
		if todays_daily_strong:
			unprocessed_food_grade_pt = get_unprocessed_food_grade(todays_daily_strong,current_date)
			grades_calculated_data['prcnt_unprocessed_food_consumed_grade'] = unprocessed_food_grade_pt[0] \
			if unprocessed_food_grade_pt[0] else ''
			grades_calculated_data['prcnt_unprocessed_food_consumed_gpa'] = unprocessed_food_grade_pt[1] \
			if unprocessed_food_grade_pt[1] else 0

		#Alcohol
		grade,avg_alcohol,avg_alcohol_gpa = quicklook.calculations\
			.garmin_calculation\
			.get_alcohol_grade_avg_alcohol_week(daily_strong,user)
		alcohol_calculated_data['alcohol_day'] = ui_alcohol_day
		grades_calculated_data['alcoholic_drink_per_week_grade'] = grade
		alcohol_calculated_data['alcohol_week'] = avg_alcohol
		grades_calculated_data['alcoholic_drink_per_week_gpa'] = avg_alcohol_gpa


		# Penalties
		if todays_daily_strong:
			penalties = get_penality_grades(ui_smoking_penalty,ui_controlled_substance_penalty,ui_sleep_aid_penalty)
			grades_calculated_data["sleep_aid_penalty"] = penalties['sleep_aid_penalty']
			grades_calculated_data['ctrl_subs_penalty'] = penalties['ctrl_subs_penalty']
			grades_calculated_data['smoke_penalty'] = penalties['smoke_penalty']

	
		#Sleep Calculations
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
		sleeps_calculated_data['sleep_per_user_input'] = (ui_sleep_duration 
			if ui_sleep_duration else "")
		sleeps_calculated_data['sleep_comments'] = ui_sleep_comment
		sleeps_calculated_data['sleep_aid'] = ui_sleep_aid
		#sleeps_calculated_data['restless'] = sleep_stats['restless']

		# Sleep grade point calculation
		sleep_grade_point = get_avg_sleep_grade(
			sleep_stats['sleep_per_userinput'],
			sleep_stats['sleep_per_wearable'],
			user.profile.age(),ui_sleep_aid
			)
		grades_calculated_data['avg_sleep_per_night_grade'] = \
			sleep_grade_point[0] if sleep_grade_point[0] else ''
		grades_calculated_data['avg_sleep_per_night_gpa'] = \
			sleep_grade_point[1] if sleep_grade_point[1] else 0

		# Exercise/Activity Calculations
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
			exercise_calculated_data['distance_run'] = activity_stats['distance_run_miles']
			exercise_calculated_data['distance_bike'] = activity_stats['distance_bike_miles']
			exercise_calculated_data['distance_swim'] = activity_stats['distance_swim_yards']
			exercise_calculated_data['distance_other'] = activity_stats['distance_other_miles']
			exercise_calculated_data['workout_duration'] = quicklook.calculations.garmin_calculation.sec_to_hours_min_sec(
				activity_stats['total_duration'])
			exercise_calculated_data['pace'] = activity_stats['pace']
			exercise_calculated_data['avg_heartrate'] = activity_stats['avg_heartrate']
			exercise_calculated_data['activities_duration'] = activity_stats['activities_duration']
		
		# Steps calculation
		total_steps = fitbit_steps_data(user,current_date)
		exercise_steps = 0
		non_exercise_steps = 0
		
		if todays_activity_data:
			trans_activity_data = list(map(fitbit_to_garmin_activities,
				todays_activity_data))
			exercise_steps = get_exercise_steps(trans_activity_data)
			non_exercise_steps = int(total_steps) - int(exercise_steps)
			steps_calculated_data["total_steps"] = int(total_steps)
			steps_calculated_data["non_exercise_steps"] = non_exercise_steps if non_exercise_steps >= 0 else 0
			steps_calculated_data["exercise_steps"] = int(exercise_steps)
		else:
			non_exercise_steps = int(total_steps)
			steps_calculated_data["total_steps"] = int(total_steps)
			steps_calculated_data["non_exercise_steps"] = int(total_steps)
			steps_calculated_data["exercise_steps"] = 0

		# Non exercise steps grade and gpa calculation
		moment_non_exercise_steps_grade_point = quicklook.calculations\
			.garmin_calculation.cal_non_exercise_step_grade(non_exercise_steps)
		grades_calculated_data['movement_non_exercise_steps_grade'] = \
			moment_non_exercise_steps_grade_point[0]
		grades_calculated_data['movement_non_exercise_steps_gpa'] = \
			moment_non_exercise_steps_grade_point[1]
			
		# Exercise Grade and point calculation
		exe_consistency_grade = get_exercise_consistency_grade(user,current_date)
		grades_calculated_data['exercise_consistency_grade'] = \
			exe_consistency_grade[0]
		grades_calculated_data['exercise_consistency_score'] = \
			exe_consistency_grade[1]

		# overal grades gpa and grade
		overall_grade_pt = get_overall_grades(grades_calculated_data)
		grades_calculated_data['overall_health_grade'] = overall_grade_pt[0]
		grades_calculated_data['overall_health_gpa'] = overall_grade_pt[1]

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