from datetime import datetime, timedelta, timezone
from collections import OrderedDict
import json, ast
import requests

from garmin.models import UserGarminDataEpoch,\
		  UserGarminDataSleep,\
		  UserGarminDataBodyComposition,\
		  UserGarminDataDaily,\
		  UserGarminDataActivity,\
		  UserGarminDataManuallyUpdated,\
		  UserGarminDataStressDetails,\
          UserGarminDataMetrics,\
          UserGarminDataMoveIQ

from user_input.models import DailyUserInputStrong,\
					DailyUserInputEncouraged,\
					DailyUserInputOptional

from quicklook.models import UserQuickLook,\
					Grades,\
					Sleep,\
					Steps,\
					ExerciseAndReporting,\
					SwimStats,\
					BikeStats,\
					Food,\
					Alcohol

def fetch_weather_data(latitude,longitude,date):
	'''
		Fetch Weather daily data for certain date
		from www.darksky.net api  

		Expect date in UNIX timestamp format 

		Latitude of NYC =  40.730610
		Longitude of NYC = -73.935242 
	'''
	KEY = '52871e89c8acb84e7c8b8bc8ac5ba307'
	EXCLUDE = ['currently','minutely','hourly','alerts','flags']
	URL =  'https://api.darksky.net/forecast/{}/{},{},{}?exclude={}'.format(
				KEY, latitude, longitude, date,",".join(EXCLUDE))

	try:
		r = requests.get(URL)
		return r.json()
	except:
		return {}

def cal_movement_consistency_summary(epochs_json):
	
	'''
		Calculate the movement consistency summary
	'''
	movement_consistency = OrderedDict()

	if epochs_json:
		epochs_json = sorted(epochs_json, key=lambda x: int(x.get('startTimeInSeconds')))
		for data in epochs_json:
			if data.get('activityType') == 'WALKING': 
				start_time = data.get('startTimeInSeconds')+ data.get('startTimeOffsetInSeconds')

				td = timedelta(hours=1)
				hour_start = datetime.utcfromtimestamp(start_time).strftime("%I %p")
				hour_end = (datetime.utcfromtimestamp(start_time)+td).strftime("%I %p")
				time_interval = hour_start+" to "+hour_end

				if not movement_consistency.get(time_interval,None):
				  movement_consistency[time_interval] = {
					"steps":0,
					"status":"inactive"
				  }

				steps_in_interval = movement_consistency[time_interval].get('steps')
				is_active = True if data.get('steps') + steps_in_interval > 300 else False

				movement_consistency[time_interval]['steps']\
					= steps_in_interval + data.get('steps')

				movement_consistency[time_interval]['status']\
					= 'active' if is_active else 'inactive'

		active_hours = 0
		inactive_hours = 0
		for interval,values in list(movement_consistency.items()):
			if values['status'] == 'active': 
				active_hours += 1 
			else:
				inactive_hours += 1
			movement_consistency['active_hours'] = active_hours
			movement_consistency['inactive_hours'] = inactive_hours

		return movement_consistency

def cal_non_exercise_steps_total_steps(dailies_json, epochs_json):
	'''
		Calculate non exercise steps
	'''	

	NON_EXERCISE_ACTIVITIES = ['WALKING','CASUAL_WALKING','SPEED_WALKING',
							   'MOTORCYCLING','FLYING','HORSEBACK_RIDING'
							   'SNOWMOBILING']
	total_steps = 0
	non_exercise_steps = 0

	if epochs_json:
		for dobj in epochs_json:
			if dobj['activityType'] not in NON_EXERCISE_ACTIVITIES:
				non_exercise_steps += dobj['steps']

	if dailies_json:
		total_steps = dailies_json[0]['steps']

	return (non_exercise_steps, total_steps)

def cal_average_sleep_grade(sleep_duration,sleep_aid_taken):
	
	_to_sec = lambda x : int(x.split(":")[0]) * 3600 + int(x.split(":")[1]) * 60

	_tobj = {
		"6:00":_to_sec("6:00"),
		"6:29":_to_sec("6:29"),
		"6:30":_to_sec("6:30"),
		"7:00":_to_sec("7:00"),
		"7:29":_to_sec("7:29"),
		"7:30":_to_sec("7:30"),
		"10:00":_to_sec("10:00"),
		"10:01":_to_sec("10:01"),
		"10:30":_to_sec("10:30"),
		"10:31":_to_sec("10:31"),
		"11:00":_to_sec("11:00"),
		"11:30":_to_sec("11:30"),
		"12:00":_to_sec("12:00"),
	}

	GRADES = {0:"F",1:"D",2:"C",3:"B",4:"A"}

	sleep_duration = _to_sec(sleep_duration)
	points = 0

	if sleep_duration < _tobj["6:00"] or sleep_duration > _tobj["12:00"]:
		points = 0

	elif sleep_duration >= _tobj["7:30"] and sleep_duration <= _tobj["10:00"]:
	   points = 4

	elif ((sleep_duration >= _tobj["7:00"] and sleep_duration <= _tobj["7:29"]) or \
		(sleep_duration >= _tobj["10:01"] and sleep_duration <= _tobj["10:30"])) :
		points = 3

	elif ((sleep_duration >= _tobj["6:30"] and sleep_duration <= _tobj["7:29"]) or \
		(sleep_duration >= _tobj["10:31"] and sleep_duration <= _tobj["11:00"])) :
	   	points = 2

	elif ((sleep_duration >= _tobj["6:00"] and sleep_duration <= _tobj["6:29"]) or \
		(sleep_duration >= _tobj["11:30"] and sleep_duration <= _tobj["12:00"])) :
	   	points = 1
	
	if sleep_aid_taken == "yes":
		if points >= 2:
			points -= 2
		else:
			points = 0

	return GRADES[points]
 
def cal_unprocessed_food_grade(prcnt_food):

 	prcnt_food = int(prcnt_food)
 	
 	if (prcnt_food >= 80 and prcnt_food <= 100):
 		return 'A'
 	elif (prcnt_food >= 70 and prcnt_food <= 79):
 		return 'B'
 	elif (prcnt_food >= 60 and prcnt_food <= 69):
 		return 'C'
 	elif (prcnt_food >= 50 and prcnt_food <= 59):
 		return 'D'
 	elif (prcnt_food < 50):
 		return 'F'

def cal_alcohol_drink_grade(alcohol_drank_past_week, gender):
	alcohol_drank_past_week = ['21' if x == '20+' else x
								for x in alcohol_drank_past_week]

	drink_avg = sum(map(float,alcohol_drank_past_week))\
				/len(alcohol_drank_past_week)

	if gender == 'M':
		if (drink_avg >= 0 and drink_avg <= 4):
			return 'A'
		elif (drink_avg >= 4.01 and drink_avg <= 7):
			return 'B'
		elif (drink_avg >= 7.01 and drink_avg <= 10):
			return 'C'
		elif (drink_avg >= 10.01 and drink_avg <= 13.99):
			return 'D'
		elif (drink_avg >= 14):
			return 'F'

	else:
		if (drink_avg >= 0 and drink_avg <= 2):
			return 'A'
		elif (drink_avg >= 2.01 and drink_avg <= 4):
			return 'B'
		elif (drink_avg >= 4.01 and drink_avg <= 5):
			return 'C'
		elif (drink_avg >= 5.01 and drink_avg <= 6.99):
			return 'D'
		elif (drink_avg >= 7):
			return 'F'

def cal_non_exercise_step_grade(steps):
	if steps >= 10000:
		return 'A'
	elif (steps <= 9999 and steps >= 7500):
		return 'B'
	elif (steps <= 7499 and steps >= 5000):
		return 'C'
	elif (steps <= 4999 and steps >= 3500):
		return 'D'
	elif steps < 3500:
		return 'F'

def cal_movement_consistency_grade(hours_inactive):
	if hours_inactive <= 4.5:
		return 'A'
	elif hours_inactive > 4.5 and hours_inactive <= 6:
		return 'B'
	elif hours_inactive > 6 and hours_inactive <= 7:
		return 'C'
	elif hours_inactive > 7 and hours_inactive <= 10:
		return 'D'
	elif hours_inactive > 10 :
		return 'F'

def create_quick_look(user, dt):

	def _safe_get(lst,attr,default_val):
		try:
			item = lst[0]
			val = item.__dict__.get(attr)
			if type(default_val) is int:
				if(val == ''):
					return default_val
				return int(val)
			return val
		except:
			return default_val 

	def _safe_get_dict(lst,attr,default_val):
		try:
			item = lst[0]
			val = item.get(attr)
			if type(default_val) is int:
				if(val == ''):
					return default_val
				return int(val)
			return val
		except:
			return default_val 

	def _update_helper(instance,data_dict):
		'''
			Helper function to update the instance
			with provided key,value pair

			Warning: This will not trigger any signals
					 like post or pre save
		'''
		for attr, value in data_dict.items():
			setattr(instance,attr,value)
		instance.save()

	def _extract_weather_data(data):
		'''
			Extract weather information like - Temperature, Dew point
			Humidity, Apparent Temperature, Wind
		'''
		DATA = {
			"temperature":0,
			"dewPoint":0,
			"humidity":0,
			"apparentTemperature":0,
			"windSpeed":0
		}

		if data:
			data = data['daily']['data'][0]
			DATA['temperature'] = round((data['temperatureMin'] + data['temperatureMax'])/2, 2)
			DATA['dewPoint'] = data['dewPoint']
			DATA['humidity'] = data['humidity'] 
			DATA['apparentTemperature'] = round((data['apparentTemperatureMin']+
										  data['apparentTemperatureMax'])/2, 2)
			DATA['windSpeed'] = data['windSpeed']

		return DATA


	y,m,d = map(int,dt.split('-'))
	start_date_dt = datetime(y,m,d,0,0,0)
	last_seven_days_date = start_date_dt - timedelta(days=6)
	start_dt = int(start_date_dt.replace(tzinfo=timezone.utc).timestamp())
	end_dt = start_dt + 86400

	weather_data = _extract_weather_data(
		fetch_weather_data(40.730610,-73.935242,start_dt))

	epochs = [q.data for q in UserGarminDataEpoch.objects.filter(
		user = user,
		start_time_in_seconds__gte = start_dt,
		start_time_in_seconds__lte = end_dt
		)]

	sleeps = [q.data for q in UserGarminDataSleep.objects.filter(
		user = user,
		start_time_in_seconds__gte = start_dt,
		start_time_in_seconds__lte = end_dt)]

	dailies = [q.data for q in UserGarminDataDaily.objects.filter(
		user = user,
		start_time_in_seconds__gte = start_dt,
		start_time_in_seconds__lte = end_dt).order_by(
		'-start_time_duration_in_seconds'
		)]

	user_metrics = [q.data for q in UserGarminDataMetrics.objects.filter(
			user = user,
			calendar_date = start_date_dt.date()
		)]

	stress = [q.data for q in UserGarminDataStressDetails.objects.filter(
			user = user,
			start_time_in_seconds__gte = start_dt,
			start_time_in_seconds__lte = end_dt
		)]

	activities =[q.data for q in UserGarminDataActivity.objects.filter(
		user = user,
		start_time_in_seconds__gte = start_dt,
		start_time_in_seconds__lte = end_dt)]


	# pull data for past 7 days (incuding today)
	daily_strong = DailyUserInputStrong.objects.filter(
		user_input__user = user,
		user_input__created_at__gte = last_seven_days_date,
		user_input__created_at__lte = start_date_dt)

	daily_encouraged = DailyUserInputEncouraged.objects.filter(
		user_input__user = user,
		user_input__created_at = start_date_dt)

	daily_optional = DailyUserInputOptional.objects.filter(
		user_input__user = user,
		user_input__created_at = start_date_dt)

	dailies_json = [ast.literal_eval(dic) for dic in dailies]
	activities_json = [ast.literal_eval(dic) for dic in activities]
	epochs_json = [ast.literal_eval(dic) for dic in epochs]
	sleeps_json = [ast.literal_eval(dic) for dic in sleeps]
	user_metrics_json = [ast.literal_eval(dic) for dic in user_metrics]
	stress_json = [ast.literal_eval(dic) for dic in stress]

	def my_sum(d, key):
		if(d!=[]):
			return sum([i.get(key,0) for i in d ])
		else:
			return(0)

	def max_values(d,key):
		if(d!=[]):
			seq = [x[key] for x in d]
			return(max(seq))
		else:
			return(0)

	grades_calculated_data = {
		'overall_truth_grade':'',
		'overall_truth_health_gpa':0,
		'movement_non_exercise_steps_grade':'' ,
		'movement_consistency_grade': '' ,
		'avg_sleep_per_night_grade':'',
		'exercise_consistency_grade':'' ,
		'overall_workout_grade':'',
		'prcnt_unprocessed_food_consumed_grade':'',
		'alcoholic_drink_per_week_grade':'' ,
		'penalty':''
	}

	exercise_calculated_data = {
		'workout_easy_hard':_safe_get(daily_strong, "work_out_easy_or_hard",''),
		'workout_type': '',
		'workout_time': '',
		'workout_location': '',
		'workout_duration': '',
		'maximum_elevation_workout': 0,
		'minutes_walked_before_workout': '',
		'distance': 0,
		'pace': '',
		'avg_heartrate':0,
		'elevation_gain':my_sum(activities_json,'totalElevationGainInMeters'),
		'elevation_loss':my_sum(activities_json,'totalElevationLossInMeters'),
		'effort_level':_safe_get(daily_strong, "workout_effort_level", 0),

		'dew_point': weather_data['dewPoint'],
		'temperature': weather_data['temperature'],
		'humidity': weather_data['humidity'],
		'temperature_feels_like': weather_data['apparentTemperature'],
		'wind': weather_data['windSpeed'],
		'hrr': '',
		'hrr_start_point': 0,
		'hrr_beats_lowered': 0,
		'sleep_resting_hr_last_night': _safe_get_dict(dailies_json,'restingHeartRateInBeatsPerMinute',0),
		'vo2_max': _safe_get_dict(user_metrics_json,"vo2Max",0),
		'running_cadence':my_sum(activities_json,'averageRunCadenceInStepsPerMinute'),
		'nose_breath_prcnt_workout': 0,
		'water_consumed_workout':_safe_get(daily_encouraged,
								"water_consumed_during_workout",0),

		'chia_seeds_consumed_workout':_safe_get(daily_optional,
									 "chia_seeds_consumed_during_workout",0),

		'fast_before_workout': _safe_get(daily_optional,
							  "fasted_during_workout",''),

		'pain': _safe_get(daily_encouraged,
				"pains_twings_during_or_after_your_workout",''),

		'pain_area': _safe_get(daily_encouraged,"pain_area", ""),
		'stress_level':_safe_get(daily_encouraged, "stress_level_yesterday", ""),
		'sick': _safe_get(daily_optional, "sick", ""),
		'drug_consumed': '',
		'drug': '',
		'medication':_safe_get(daily_strong,
						 "medications_or_controlled_substances_yesterday", ""),

		'smoke_substance':_safe_get(daily_strong,
						 "smoke_any_substances_whatsoever", ""),

		'exercise_fifteen_more': '',
		'workout_elapsed_time': '',
		'timewatch_paused_workout': '',
		'exercise_consistency':0,
		'workout_duration_grade': '',
		'workout_effortlvl_grade': '',
		'avg_heartrate_grade': '',
		'overall_workout_grade': '',
		'heartrate_variability_grade': '',
		'workout_comment':_safe_get(daily_optional, "general_Workout_Comments", "")
	}
	swim_calculated_data = {

		'pace_per_100_yard': 0,
		'total_strokes': 0,
	}

	bike_calculated_data = {
		'avg_speed': 0,
		'avg_power': 0,
		'avg_speed_per_mile': 0,
		'avg_cadence': 0,
	}

	steps_calculated_data = {
		 'non_exercise_steps':0,
		 'exercise_steps': 0,
		 'total_steps': 0,
		 'floor_climed': my_sum(dailies_json,'floorsClimbed'),
		 'floor_decended':0,
		 'movement_consistency': '',
	}

	sleeps_calculated_data = {
		'sleep_per_wearable': '',
		'sleep_per_user_input':'',
		'sleep_aid': _safe_get(daily_strong,
					 "prescription_or_non_prescription_sleep_aids_last_night", ""),
		'sleep_bed_time': '',
		'sleep_awake_time': '',
		'deep_sleep': my_sum(sleeps_json,'deepSleepDurationInSeconds'),
		'light_sleep': my_sum(sleeps_json,'lightSleepDurationInSeconds'),
		'awake_time': my_sum(sleeps_json,'awakeDurationInSeconds'),

	}

	food_calculated_data = {
		'prcnt_non_processed_food':0,
		'prcnt_non_processed_food_grade': '',
		'non_processed_food': _safe_get(daily_strong,
							 "list_of_unprocessed_food_consumed_yesterday", ""),
		'diet_type':'',
	}

	alcohol_calculated_data = {
		'alcohol_day': _safe_get(daily_strong,"number_of_alcohol_consumed_yesterday",""),
		'alcohol_week': 0
	}

	# Calculation of grades

	# Average sleep per night grade calculation
	for q in daily_strong:
		if (q.user_input.created_at == start_date_dt.date() and 
			q.sleep_time_excluding_awake_time != '' and 
			q.prescription_or_non_prescription_sleep_aids_last_night != ''):

			grade = cal_average_sleep_grade(
								  q.sleep_time_excluding_awake_time,
								  q.prescription_or_non_prescription_sleep_aids_last_night)
			grades_calculated_data['avg_sleep_per_night_grade'] = grade

	# Unprocessed food grade calculation 
	for q in daily_strong:
		if (q.user_input.created_at == start_date_dt.date() and
			q.prcnt_unprocessed_food_consumed_yesterday != ''):
			grade = cal_unprocessed_food_grade(
									 q.prcnt_unprocessed_food_consumed_yesterday)

			grades_calculated_data['prcnt_unprocessed_food_consumed_grade'] = grade

	# Alcohol drink consumed grade
	alcohol_grade = cal_alcohol_drink_grade(
		[q.number_of_alcohol_consumed_yesterday
		if not q.number_of_alcohol_consumed_yesterday in [None,''] else 0
		for q in daily_strong],
		user.profile.gender)

	grades_calculated_data['alcoholic_drink_per_week_grade'] = alcohol_grade

	# Movement consistency and movement consistency grade calculation
	movement_consistency_summary = cal_movement_consistency_summary(epochs_json)
	if movement_consistency_summary:
		steps_calculated_data['movement_consistency'] = json.dumps(movement_consistency_summary)
		inactive_hours = movement_consistency_summary.get("inactive_hours")
		grade = cal_movement_consistency_grade(inactive_hours)
		grades_calculated_data['movement_consistency_grade'] = grade

	# Exercise step calculation, Non exercise step calculation and
	# Non-Exercise steps grade calculation
	non_exercise_steps, total_steps = cal_non_exercise_steps_total_steps(
									  dailies_json,epochs_json)	
	steps_calculated_data['non_exercise_steps'] = non_exercise_steps
	steps_calculated_data['exercise_steps'] = total_steps - non_exercise_steps
	steps_calculated_data['total_steps'] = total_steps

	grades_calculated_data['movement_non_exercise_steps_grade'] = \
	cal_non_exercise_step_grade(non_exercise_steps)


	# If quick look for provided date exist then update it otherwise
	# create new quicklook instance 
	try:
		user_ql = UserQuickLook.objects.get(created_at = start_date_dt.date())
		_update_helper(user_ql.grades_ql,grades_calculated_data)
		_update_helper(user_ql.exercise_reporting_ql, exercise_calculated_data)
		_update_helper(user_ql.swim_stats_ql, swim_calculated_data)
		_update_helper(user_ql.bike_stats_ql, bike_calculated_data)
		_update_helper(user_ql.steps_ql, steps_calculated_data)
		_update_helper(user_ql.sleep_ql, sleeps_calculated_data)
		_update_helper(user_ql.food_ql, food_calculated_data)
		_update_helper(user_ql.alcohol_ql, alcohol_calculated_data)

	except UserQuickLook.DoesNotExist:
		user_ql = UserQuickLook.objects.create(user = user)
		Grades.objects.create(user_ql=user_ql, **grades_calculated_data)
		ExerciseAndReporting.objects.create(user_ql = user_ql,**exercise_calculated_data)
		SwimStats.objects.create(user_ql=user_ql, **swim_calculated_data)
		BikeStats.objects.create(user_ql = user_ql,**bike_calculated_data)
		Steps.objects.create(user_ql = user_ql,**steps_calculated_data)
		Sleep.objects.create(user_ql = user_ql,**sleeps_calculated_data)
		Food.objects.create(user_ql = user_ql,**food_calculated_data)
		Alcohol.objects.create(user_ql = user_ql,**alcohol_calculated_data)