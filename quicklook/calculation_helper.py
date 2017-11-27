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

from quicklook.serializers import UserQuickLookSerializer

def str_to_datetime(str_date):
	y,m,d = map(int,str_date.split('-'))
	return datetime(y,m,d,0,0,0)

def sec_to_hours_min(seconds):
	seconds = int(seconds)
	hour_min_str = "{}:{}".format(seconds//3600,(int((seconds/60)%60)))
	return hour_min_str

def safe_sum(d, key):
	if(d!=[]):
		return sum([i.get(key,0) for i in d ])
	else:
		return(0)

def safe_max_values(d,key):
	if(d!=[]):
		seq = [x[key] for x in d]
		return(max(seq))
	else:
		return(0)

def safe_get(lst,attr,default_val):
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

def safe_get_dict(lst,attr,default_val):
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

def update_helper(instance,data_dict):
	'''
		Helper function to update the instance
		with provided key,value pair

		Warning: This will not trigger any signals
				 like post or pre save
	'''
	for attr, value in data_dict.items():
		setattr(instance,attr,value)
	instance.save()

def get_blank_model_fields(model):
	if model == "grade":
		fields = {
			'overall_truth_grade':'',
			'overall_truth_health_gpa':0,
			'movement_non_exercise_steps_grade':'' ,
			'movement_consistency_grade': '' ,
			'avg_sleep_per_night_grade':'',
			'exercise_consistency_grade':'' ,
			'overall_workout_grade':'',
			'prcnt_unprocessed_food_consumed_grade':'',
			'alcoholic_drink_per_week_grade':'' ,
			'penalty':0
		}
		return fields

	elif model == "exercise":
		fields = {
			'workout_easy_hard':'',
			'workout_type': '',
			'workout_time': '',
			'workout_location': '',
			'workout_duration': '',
			'maximum_elevation_workout': 0,
			'minutes_walked_before_workout': '',
			'distance_run': 0,
			'distance_bike':0,
			'distance_swim':0,
			'distance_other':0,
			'pace': '',
			'avg_heartrate':0,
			'elevation_gain':0,
			'elevation_loss':0,
			'effort_level':0,

			'dew_point': 0,
			'temperature': 0,
			'humidity': 0,
			'temperature_feels_like':0,
			'wind': 0,
			'hrr': '',
			'hrr_start_point': 0,
			'hrr_beats_lowered': 0,
			'sleep_resting_hr_last_night': 0,
			'vo2_max': 0,
			'running_cadence':0,
			'nose_breath_prcnt_workout': 0,
			'water_consumed_workout':0,
			'chia_seeds_consumed_workout':0,
			'fast_before_workout': '',
			'pain': '',
			'pain_area': '',
			'stress_level':'',
			'sick': '',
			'drug_consumed': '',
			'drug': '',
			'medication':'',
			'smoke_substance':'',
			'exercise_fifteen_more': '',
			'workout_elapsed_time': '',
			'timewatch_paused_workout': '',
			'exercise_consistency':0,
			'workout_duration_grade': '',
			'workout_effortlvl_grade': '',
			'avg_heartrate_grade': '',
			'overall_workout_grade': '',
			'heartrate_variability_grade': '',
			'workout_comment':''
		}
		return fields

	elif model == "swim":
		fields = {
			'pace_per_100_yard': 0,
			'total_strokes': 0,
		}
		return fields

	elif model == "bike":
		fields = {
			'avg_speed': 0,
			'avg_power': 0,
			'avg_speed_per_mile': 0,
			'avg_cadence': 0,
		}
		return fields

	elif model == "step":
		fields = {
			 'non_exercise_steps':0,
			 'exercise_steps': 0,
			 'total_steps': 0,
			 'floor_climed':0,
			 'floor_decended':0,
			 'movement_consistency':'',
		}
		return fields

	elif model == "sleep":
		fields = {
			'sleep_per_wearable': '',
			'sleep_per_user_input':'',
			'sleep_aid': '',
			'sleep_bed_time': '',
			'sleep_awake_time': '',
			'deep_sleep': 0,
			'light_sleep': 0,
			'awake_time': 0,
		}
		return fields

	elif model == "food":
		fields = {
			'prcnt_non_processed_food':0,
			'prcnt_non_processed_food_grade': '',
			'non_processed_food': '',
			'diet_type':'',
		}
		return fields

	elif model == "alcohol":
		fields = {
			'alcohol_day': '',
			'alcohol_week': 0
		}
		return fields

def get_garmin_model_data(model,user,start_epoch, end_epoch, order_by=None):
	if order_by:
		data = [q.data for q in model.objects.filter(
			user = user,
			start_time_in_seconds__gte = start_epoch,
			start_time_in_seconds__lt = end_epoch).order_by(order_by)]
		return data
	else:
		data = [q.data for q in model.objects.filter(
			user = user,
			start_time_in_seconds__gte = start_epoch,
			start_time_in_seconds__lt = end_epoch)]
		return data


def extract_weather_data(data):
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
		DATA['humidity'] = data['humidity'] * 100
		DATA['apparentTemperature'] = round((data['apparentTemperatureMin']+
									  data['apparentTemperatureMax'])/2, 2)
		DATA['windSpeed'] = data['windSpeed']

	return DATA

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

def cal_exercise_steps_total_steps(dailies_json, epochs_json):
	'''
		Calculate non exercise steps
	'''	

	NON_EXERCISE_ACTIVITIES = ['WALKING','CASUAL_WALKING','SPEED_WALKING',
							   'MOTORCYCLING','FLYING','HORSEBACK_RIDING'
							   'SNOWMOBILING']
	total_steps = 0
	exercise_steps = 0

	if epochs_json:
		for dobj in epochs_json:
			if dobj['activityType'] not in NON_EXERCISE_ACTIVITIES:
				exercise_steps += dobj['steps']

	if dailies_json:
		total_steps = dailies_json[0]['steps']

	return (exercise_steps, total_steps)

def cal_average_sleep_grade(sleep_duration,sleep_aid_taken):
	def _to_sec(duration):
		hours,mins = map(int,[0 if x == '' else x 
					for x in duration.split(':')])
		return hours * 3600 + mins * 60

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

	drink_avg = sum(map(float,alcohol_drank_past_week))/7

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

def cal_exercise_consistency_grade(workout_for_period, period):
	# TODO : incomplete, currently based on only user inputs but  
	# it also should be based on activity file and avg heartbeat 
	
	workout_points_over_period = [1 if w == 'yes' else 0
								  for w in workout_for_period]
	avg_days_workout_week = sum(workout_points_over_period) / (period/7)
	if avg_days_workout_week >= 4:
		return 'A'
	elif avg_days_workout_week >= 3 and avg_days_workout_week < 4:
		return 'B'
	elif avg_days_workout_week >= 2 and avg_days_workout_week < 3:
		return 'C'
	elif avg_days_workout_week >= 1 and avg_days_workout_week < 2:
		return 'D'
	elif avg_days_workout_week < 1:
		return 'F' 
	
def cal_overall_grade_gpa(grades):
	'''
		Return tuple (overall grade, overall health gpa)
	'''
	GRADE_POINT = {'A':4,'B':3,'C':2,'D':1,'F':0}
	grades.pop('overall_truth_grade')
	grades.pop('overall_truth_health_gpa')
	penalty = grades.pop('penalty')
	avg_points = (sum([GRADE_POINT[v] for v in grades.values()]) + penalty)/len(grades)
	
	if avg_points >= 3.4:
		grade = 'A'
	elif avg_points >= 3 and avg_points < 3.4:
		grade = 'B'
	elif avg_points >= 2 and avg_points < 3:
		grade = 'C'
	elif avg_points >= 1 and avg_points < 2:
		grade = 'D'
	elif avg_points < 1:
		grade = 'F'

	return(grade, avg_points) 

def cal_penalty(is_smoke,is_ctrl_subs):
	smoke_penalty = -3.1 if is_smoke == 'yes' else 0
	ctrl_subs_penalty = -3.1 if is_ctrl_subs == 'yes' else 0
	return smoke_penalty + ctrl_subs_penalty

def get_avg_sleep_grade(daily_strong,current_date):
	for q in daily_strong:
		if (q.user_input.created_at == current_date.date() and 
			q.sleep_time_excluding_awake_time != '' and
			q.sleep_time_excluding_awake_time != None):
			grade = cal_average_sleep_grade(
				  q.sleep_time_excluding_awake_time,
				  q.prescription_or_non_prescription_sleep_aids_last_night)
			return grade
	return ''

def get_unprocessed_food_grade(daily_strong,current_date):
	for q in daily_strong:
		if (q.user_input.created_at == current_date.date() and
			q.prcnt_unprocessed_food_consumed_yesterday != '' and
			q.prcnt_unprocessed_food_consumed_yesterday != None):
			grade = cal_unprocessed_food_grade(
					q.prcnt_unprocessed_food_consumed_yesterday)
			return grade
	return ''

def get_alcohol_grade(daily_strong,user):
	alcohol_grade = cal_alcohol_drink_grade(
		[q.number_of_alcohol_consumed_yesterday
		if not q.number_of_alcohol_consumed_yesterday in [None,''] else 0
		for q in daily_strong],
		user.profile.gender)
	return alcohol_grade

def get_sleep_stats(sleeps_json):
	recent_auto_manual = None
	recent_auto_final = None
	recent_auto_tentative = None
	target_sleep_data = None

	sleep_stats = {
		"deep_sleep": '',
		"light_sleep": '',
		"awake_time": '',
		"sleep_bed_time": '',
		"sleep_awake_time": ''
	}

	for obj in sleeps_json:
		if obj.get('validation',None) == 'AUTO_MANUAL':
			recent_auto_manual = obj
			break
		elif (obj.get('validation',None) == 'AUTO_FINAL' and not recent_auto_final):
			recent_auto_final = obj
		elif (obj.get('validation',None) == 'AUTO_TENTATIVE' and not recent_auto_tentative):
			recent_auto_tentative = obj

	if recent_auto_manual:
		target_sleep_data = recent_auto_manual
	elif recent_auto_final:
		target_sleep_data = recent_auto_final
	else:
		target_sleep_data = recent_auto_tentative

	if target_sleep_data:
		sleep_stats['deep_sleep'] = sec_to_hours_min(
									target_sleep_data.get('deepSleepDurationInSeconds'))
		sleep_stats['light_sleep'] = sec_to_hours_min(
									target_sleep_data.get('lightSleepDurationInSeconds'))
		sleep_stats['awake_time'] = sec_to_hours_min(
									target_sleep_data.get('awakeDurationInSeconds'))
		bed_time = datetime.utcfromtimestamp(target_sleep_data.get('startTimeInSeconds')+
											 target_sleep_data.get('startTimeOffsetInSeconds'))
		awake_time = datetime.utcfromtimestamp(target_sleep_data.get('startTimeInSeconds',0)+
											   target_sleep_data.get('startTimeOffsetInSeconds',0)+
											   target_sleep_data.get('durationInSeconds'))
		sleep_stats['sleep_bed_time'] = bed_time.strftime("%I:%M %p")
		sleep_stats['sleep_awake_time'] = awake_time.strftime("%I:%M %p")
	
	return sleep_stats

def create_quick_look(user,from_date=None,to_date=None):
	'''
		calculate and create quicklook instance for given date range

		Arguments -
			1) user is a "User" instance representing currently logged in user 
			2) from_date expect date string in format YYYY-MM-DD
			3) to_date expect date string in format YYYY-MM-DD   

	'''
	# date range for which quicklook is calculated
	from_dt = str_to_datetime(from_date)
	to_dt = str_to_datetime(to_date)
	current_date = from_dt
	SERIALIZED_DATA = []

	while current_date <= to_dt:
		last_seven_days_date = current_date - timedelta(days=7)
		start_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())
		end_epoch = start_epoch + 86400

		weather_data = extract_weather_data(
		fetch_weather_data(40.730610,-73.935242,start_epoch))

		epochs = get_garmin_model_data(UserGarminDataEpoch,user,start_epoch,end_epoch)

		# Get sleep data for yesterday
		sleeps = get_garmin_model_data(UserGarminDataSleep,
									   user,start_epoch-86400,end_epoch-86400,
									   '-id')
		dailies = get_garmin_model_data(UserGarminDataDaily,user,
										start_epoch,end_epoch,
										'-start_time_duration_in_seconds')
		stress = get_garmin_model_data(UserGarminDataStressDetails,user,start_epoch,end_epoch)
		activities =get_garmin_model_data(UserGarminDataActivity,user,start_epoch,end_epoch)
		user_metrics = [q.data for q in UserGarminDataMetrics.objects.filter(
				user = user,calendar_date = current_date.date())]

		# pull data for past 7 days (incuding today)
		daily_strong = list(DailyUserInputStrong.objects.filter(
			user_input__user = user,
			user_input__created_at__gte = last_seven_days_date,
			user_input__created_at__lte = current_date))

		todays_daily_strong = []
		for i,q in enumerate(daily_strong):
			if q.user_input.created_at == current_date.date():
				todays_daily_strong.append(daily_strong.pop(i))
				break

		daily_encouraged = DailyUserInputEncouraged.objects.filter(
			user_input__user = user,
			user_input__created_at = current_date)

		daily_optional = DailyUserInputOptional.objects.filter(
			user_input__user = user,
			user_input__created_at = current_date)

		dailies_json = [ast.literal_eval(dic) for dic in dailies]
		activities_json = [ast.literal_eval(dic) for dic in activities]
		epochs_json = [ast.literal_eval(dic) for dic in epochs]
		sleeps_json = [ast.literal_eval(dic) for dic in sleeps]
		user_metrics_json = [ast.literal_eval(dic) for dic in user_metrics]
		stress_json = [ast.literal_eval(dic) for dic in stress]

		grades_calculated_data = get_blank_model_fields('grade')
		exercise_calculated_data = get_blank_model_fields('exercise')
		swim_calculated_data = get_blank_model_fields('swim')
		bike_calculated_data = get_blank_model_fields('bike')
		steps_calculated_data = get_blank_model_fields('step')
		sleeps_calculated_data = get_blank_model_fields('sleep')
		food_calculated_data = get_blank_model_fields("food")
		alcohol_calculated_data = get_blank_model_fields("alcohol")

		# Exercise
		exercise_calculated_data['workout_easy_hard'] = safe_get(todays_daily_strong,
														 "work_out_easy_or_hard",'')
		# Meters to foot and rounding half up
		exercise_calculated_data['elevation_gain'] = int(round(safe_sum(activities_json,
													'totalElevationGainInMeters')*3.28084,1))
		exercise_calculated_data['elevation_loss'] = int(round(safe_sum(activities_json,
													'totalElevationLossInMeters')*3.28084,1))
		exercise_calculated_data['effort_level'] = safe_get(todays_daily_strong,
													"workout_effort_level", 0)
		exercise_calculated_data['dew_point'] = weather_data['dewPoint']
		exercise_calculated_data['temperature'] = weather_data['temperature']
		exercise_calculated_data['humidity'] = weather_data['humidity']
		exercise_calculated_data['temperature_feels_like'] = weather_data['apparentTemperature']
		exercise_calculated_data['wind'] = weather_data['windSpeed']
		exercise_calculated_data['sleep_resting_hr_last_night'] = safe_get_dict(dailies_json,
															'restingHeartRateInBeatsPerMinute',0)
		exercise_calculated_data['vo2_max'] = safe_get_dict(user_metrics_json,"vo2Max",0)
		exercise_calculated_data['running_cadence'] = safe_sum(activities_json,
											'averageRunCadenceInStepsPerMinute')
		exercise_calculated_data['water_consumed_workout'] = safe_get(daily_encouraged,
												"water_consumed_during_workout",0)
		exercise_calculated_data['chia_seeds_consumed_workout'] = safe_get(daily_optional,
									 		"chia_seeds_consumed_during_workout",0)
		exercise_calculated_data['fast_before_workout'] = safe_get(daily_optional,
							  						"fasted_during_workout",'')
		exercise_calculated_data['pain'] = safe_get(daily_encouraged,
								"pains_twings_during_or_after_your_workout",'')
		exercise_calculated_data['pain_area'] = safe_get(daily_encouraged,"pain_area", "")
		exercise_calculated_data['stress_level'] = safe_get(daily_encouraged,
												   "stress_level_yesterday", "")
		exercise_calculated_data['sick'] = safe_get(daily_optional, "sick", "")
		exercise_calculated_data['medication'] = safe_get(todays_daily_strong,
						 "prescription_or_non_prescription_medication_yesterday", "")
		exercise_calculated_data['smoke_substance'] = safe_get(todays_daily_strong,
						 					"smoke_any_substances_whatsoever", "")
		exercise_calculated_data['workout_comment'] = safe_get(daily_optional,
													 "general_Workout_Comments", "")
		
		# Steps
		steps_calculated_data['floor_climed'] = safe_get_dict(dailies,"floorsClimbed",0)

		# Sleeps
		sleep_stats = get_sleep_stats(sleeps_json)
		sleeps_calculated_data['sleep_aid'] = safe_get(todays_daily_strong,
					 "prescription_or_non_prescription_sleep_aids_last_night", "")
		sleeps_calculated_data['deep_sleep'] = sleep_stats['deep_sleep']
		sleeps_calculated_data['light_sleep'] = sleep_stats['light_sleep']
		sleeps_calculated_data['awake_time'] = sleep_stats['awake_time']
		sleeps_calculated_data['sleep_bed_time'] = sleep_stats['sleep_bed_time']
		sleeps_calculated_data['sleep_awake_time'] = sleep_stats['sleep_awake_time']

		# Food
		food_calculated_data['prcnt_non_processed_food'] = safe_get(todays_daily_strong,
									   "prcnt_unprocessed_food_consumed_yesterday", 0)
		food_calculated_data['non_processed_food'] = safe_get(todays_daily_strong,
								 "list_of_unprocessed_food_consumed_yesterday", "")
		food_calculated_data['diet_type'] = safe_get(daily_optional,"type_of_diet_eaten","")

		# Alcohol
		alcohol_calculated_data['alcohol_day'] = safe_get(todays_daily_strong,
											"number_of_alcohol_consumed_yesterday","")

		# Calculation of grades

		# Average sleep per night grade calculation
		grades_calculated_data['avg_sleep_per_night_grade'] = get_avg_sleep_grade(todays_daily_strong, current_date)

		# Unprocessed food grade calculation 
		grade  = get_unprocessed_food_grade(todays_daily_strong, current_date)
		grades_calculated_data['prcnt_unprocessed_food_consumed_grade'] = grade
		food_calculated_data['prcnt_non_processed_food_grade'] = grade

		# Alcohol drink consumed grade
		grades_calculated_data['alcoholic_drink_per_week_grade'] = get_alcohol_grade(daily_strong,user)

		# Movement consistency and movement consistency grade calculation
		movement_consistency_summary = cal_movement_consistency_summary(epochs_json)
		if movement_consistency_summary:
			steps_calculated_data['movement_consistency'] = json.dumps(movement_consistency_summary)
			inactive_hours = movement_consistency_summary.get("inactive_hours")
			grade = cal_movement_consistency_grade(inactive_hours)
			grades_calculated_data['movement_consistency_grade'] = grade

		# Exercise step calculation, Non exercise step calculation and
		# Non-Exercise steps grade calculation
		exercise_steps, total_steps = cal_exercise_steps_total_steps(
										  dailies_json,epochs_json)	
		# Have to fix this
		steps_calculated_data['non_exercise_steps'] = abs(total_steps - exercise_steps)
		steps_calculated_data['exercise_steps'] = exercise_steps
		steps_calculated_data['total_steps'] = total_steps

		grades_calculated_data['movement_non_exercise_steps_grade'] = \
		cal_non_exercise_step_grade(total_steps - exercise_steps)

		# Exercise Consistency grade calculation over period of 7 days
		exercise_consistency_grade = cal_exercise_consistency_grade(
			[q.workout for q in daily_strong],7)
		grades_calculated_data['exercise_consistency_grade'] = exercise_consistency_grade

		# Penalty calculation
		penalty = cal_penalty(
			safe_get(todays_daily_strong,"smoke_any_substances_whatsoever",""),
			safe_get(todays_daily_strong,"controlled_uncontrolled_substance","")
		)
		grades_calculated_data["penalty"] = penalty
		
		# If quick look for provided date exist then update it otherwise
		# create new quicklook instance 
		try:
			user_ql = UserQuickLook.objects.get(user=user,created_at = current_date.date())
			update_helper(user_ql.grades_ql,grades_calculated_data)
			update_helper(user_ql.exercise_reporting_ql, exercise_calculated_data)
			update_helper(user_ql.swim_stats_ql, swim_calculated_data)
			update_helper(user_ql.bike_stats_ql, bike_calculated_data)
			update_helper(user_ql.steps_ql, steps_calculated_data)
			update_helper(user_ql.sleep_ql, sleeps_calculated_data)
			update_helper(user_ql.food_ql, food_calculated_data)
			update_helper(user_ql.alcohol_ql, alcohol_calculated_data)

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