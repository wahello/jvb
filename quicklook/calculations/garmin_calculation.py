from datetime import datetime, timedelta, timezone,time
from collections import OrderedDict,namedtuple
from decimal import Decimal, ROUND_HALF_DOWN
import json, ast, pytz
import requests
import copy
import re

from django.db.models import Q

from garmin.models import UserGarminDataEpoch,\
		  UserGarminDataSleep,\
		  UserGarminDataBodyComposition,\
		  UserGarminDataDaily,\
		  UserGarminDataActivity,\
		  UserGarminDataManuallyUpdated,\
		  UserGarminDataStressDetails,\
          UserGarminDataMetrics,\
          UserGarminDataMoveIQ,\
          UserLastSynced

from fitbit.models import UserFitbitLastSynced

from user_input.models import UserDailyInput,\
					DailyUserInputStrong,\
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
import user_input.views.garmin_views
from user_input.utils.daily_activity import get_daily_activities_in_base_format

def str_to_datetime(str_date):
	y,m,d = map(int,str_date.split('-'))
	return datetime(y,m,d,0,0,0)

def _str_duration_to_dt(dobj,str_duration):
	'''
	Convert string duration to datetime having date as dobj

	type dobj: Datetime
	type str_duration: string eg "7:30 AM"
	'''
	if dobj and str_duration:
		hour,minute = map(int, str_duration.split(' ')[0].split(":"))
		meridiem = str_duration.split(' ')[1]
		if hour == 12 and meridiem.lower() == 'am':
			hour = 0
		elif hour != 12 and meridiem.lower() == 'pm':
			hour += 12
		return datetime.combine(dobj.date(),time(hour,minute))
	return None

def _get_lst(lst,i,default = None):
	""" get method for list similar to dictionary's get method """
	try:
		return lst[i];
	except IndexError:
		return default
	except TypeError:
		return default

def _str_to_hours_min_sec(str_duration,time_format='hour',time_pattern="hh:mm:ss"):
	'''
		Expect duration in this format - "hh:mm:ss"
		convert in into hours, min or sec
		
		Arguments
		- str_duration : type String, time in format 'hh:mm:ss'

		- time_format: type String, possible values are [hour, minute, seconds]
		  specified in what format time to be converted
		  
		- time_pattern: type String, possible values are substring of "hh:mm:ss"
		  specify the position of hour, minute and second in the str_duration

	'''
	pattern = re.compile(r"\d?\d:\d\d(:\d\d)?")
	if str_duration and pattern.match(str_duration):
		hms = str_duration.split(":")
		pattern_lst = time_pattern.split(":")
		pattern_indexed = {
			"hour":pattern_lst.index("hh") if "hh" in pattern_lst else None,
			"minute":pattern_lst.index("mm") if "mm" in pattern_lst else None,
			"second":pattern_lst.index("ss") if "ss" in pattern_lst else None
		}

		h = int(_get_lst(hms,pattern_indexed["hour"],0))\
			if _get_lst(hms,pattern_indexed["hour"],0) else 0
		m = int(_get_lst(hms,pattern_indexed["minute"],0))\
			if _get_lst(hms,pattern_indexed["minute"],0) else 0
		s = int(_get_lst(hms,pattern_indexed["second"],0))\
			if _get_lst(hms,pattern_indexed["second"],0) else 0

		t = 0
		if time_format == 'hour':
			t = h + (m/60) + (s/3600)
		elif time_format == 'minute':
			t = (h*60) + m + (s/60)
		else:
			t = (h * 3600) + (m * 60) + s
		return round(t,3)
	return 0

def sec_to_hours_min_sec(seconds,include_sec = True):
	seconds = int(seconds)
	m,s = divmod(seconds,60)
	h,m = divmod(m,60)
	if s < 10:
		s = "{:02d}".format(s)
	if m < 10:
		m = "{:02d}".format(m) 
	if include_sec:
		hour_min_sec_str = "{}:{}:{}".format(h,m,s)
	else:
		hour_min_sec_str = "{}:{}".format(h,m)
	return hour_min_sec_str

def meter_per_sec_to_pace_per_mile(mps):
	'''
	Pace per mile means time (mm:ss) required to cover 1 mile
	1 meter = 0.000621371 miles
	'''
	try:
		secs = round(1/(mps * 0.000621371))
		mins = secs // 60
		sec = int(secs % 60) 
		if sec > 9:
			min_sec_str = "{}:{}".format(mins,sec)
		else:
			min_sec_str = "{}:{:02d}".format(mins,sec)
		return min_sec_str
	except ZeroDivisionError:
		return "0:0"

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
	'''
	for attr, value in data_dict.items():
		setattr(instance,attr,value)
	instance.save()

def get_blank_model_fields(model):
	if model == "grade":
		fields = {
			'overall_health_grade':'',
			'overall_health_gpa':0,
			'movement_non_exercise_steps_grade':'',
			'movement_non_exercise_steps_gpa':0,
			'movement_consistency_grade': '',
			'avg_sleep_per_night_grade':'',
			'avg_sleep_per_night_gpa':0,
			'exercise_consistency_grade':'',
			'exercise_consistency_score':0,
			'overall_workout_grade':'',
			'overall_workout_gpa':0,
			'workout_duration_grade':'',
			'workout_duration_gpa':0,
			'workout_effortlvl_grade':'',
			'workout_effortlvl_gpa':0,
			'avg_exercise_hr_grade':'',
			'avg_exercise_hr_gpa':0,
			'prcnt_unprocessed_food_consumed_grade':'',
			'prcnt_unprocessed_food_consumed_gpa':0,
			'alcoholic_drink_per_week_grade':'',
			'alcoholic_drink_per_week_gpa':0,
			'sleep_aid_penalty':0,
			'ctrl_subs_penalty':0,
			'smoke_penalty':0,
		}
		return fields

	elif model == "exercise":
		fields = {
			'did_workout':'',
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
			'avg_heartrate':json.dumps({}),
			'activities_duration':json.dumps({}),
			'avg_exercise_heartrate':0,
			'elevation_gain':0,
			'elevation_loss':0,
			'effort_level':0,

			'dew_point': 0,
			'temperature': 0,
			'humidity': 0,
			'temperature_feels_like':0,
			'wind': 0,

			'hrr_time_to_99': '',
			'hrr_starting_point': 0,
			'hrr_beats_lowered_first_minute': 0,
			'resting_hr_last_night': 0,
			'lowest_hr_during_hrr':0,
			'highest_hr_first_minute':0,

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
			'heartrate_variability_stress': 0,
			'fitness_age':0,
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
			 'movement_consistency':'',
			 'weight':{}
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
			'rem_sleep':0,
			'awake_time': 0,
			'sleep_comments':''
		}
		return fields

	elif model == "food":
		fields = {
			'prcnt_non_processed_food':0,
			'non_processed_food': '',
			'processed_food':'',
			'diet_type':'',
		}
		return fields

	elif model == "alcohol":
		fields = {
			'alcohol_day': '',
			'alcohol_week': 0
		}
		return fields

def get_garmin_model_data(model,user,start_epoch, end_epoch, order_by=None, filter_dup=False):

	def filter_duplicate(qs):
		filtered_qs = []
		seen_summaries = {}
		for summary in qs:
			if not seen_summaries.get(summary.summary_id,None):
				seen_summaries[summary.summary_id] = True
				filtered_qs.append(summary)
		return filtered_qs

	if order_by:
		summaries = model.objects.filter(
				Q(start_time_in_seconds__gte = start_epoch) &
				Q(start_time_in_seconds__lt = end_epoch),
				user = user).order_by(order_by)
		if filter_dup:
			summaries = filter_duplicate(summaries)
		return [q.data for q in summaries]
	else:
		summaries = model.objects.filter(
			Q(start_time_in_seconds__gte = start_epoch)&
			Q(start_time_in_seconds__lt = end_epoch),
			user = user)
		if filter_dup:
			summaries = filter_duplicate(summaries)
		return [q.data for q in summaries]

def get_weekly_data(data,to_date,from_date):
	'''
		Takes and array of garmin data and categorise them according to date
		to which data belongs

		Output is a Ordered dictionary like this - 
		{
			"2017-12-1":[{garmin_data}, {garmin_data}, ....],
			"2017-12-2":[{garmin_data}, {garmin_data}, ....],
								...

			"2017-12-7":[{garmin_data}, {garmin_data}, ....],
		}

	'''
	weekly_data = OrderedDict()
	while(from_date <= to_date):
		weekly_data[from_date.strftime('%Y-%m-%d')]=[]
		from_date += timedelta(days=1)

	for obj in data:
		obj = ast.literal_eval(obj)
		obj_starttime = datetime.utcfromtimestamp(obj.get('startTimeInSeconds',0)
											+obj.get('startTimeOffsetInSeconds',0))
		weekly_data[obj_starttime.strftime('%Y-%m-%d')].append(obj)
	return weekly_data

def get_weekly_user_input_data(qobj_lst,to_date,from_date):
	weekly_data = OrderedDict()
	while(from_date <= to_date):
		weekly_data[from_date.strftime('%Y-%m-%d')] = None
		from_date += timedelta(days=1)
	for obj in qobj_lst:
		weekly_data[obj.user_input.created_at.strftime("%Y-%m-%d")] = obj

	return weekly_data


def extract_weather_data(data):
	'''
		Extract weather information like - Temperature, Dew point
		Humidity, Apparent Temperature, Wind
	'''
	DATA = {
		"temperature":None,
		"dewPoint":None,
		"humidity":None,
		"apparentTemperature":None,
		"windSpeed":None
	}

	if data and data.get('daily',None):
		data = data['daily']['data'][0]
		if data.get('temperatureMin',None) and data.get('temperatureMax',None):
			DATA['temperature'] = round((data['temperatureMin'] + data['temperatureMax'])/2, 2)

		DATA['dewPoint'] = data.get('dewPoint',None)

		if data.get('humidity',None):
			DATA['humidity'] = round(data['humidity'] * 100,2)

		if data.get('apparentTemperatureMin',None) and data.get('apparentTemperatureMax',None):
			DATA['apparentTemperature'] = round((data['apparentTemperatureMin']+
										  data['apparentTemperatureMax'])/2, 2)
			
		DATA['windSpeed'] = data.get('windSpeed',None)

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
	UNIT = 'si'
	URL =  'https://api.darksky.net/forecast/{}/{},{},{}?exclude={}&units={}'.format(
				KEY, latitude, longitude, date,",".join(EXCLUDE),UNIT)

	try:
		r = requests.get(URL)
		return r.json()
	except:
		return {}

def get_sleep_stats(sleep_calendar_date, yesterday_sleep_data = None,
	today_sleep_data = None, user_input_bedtime = None, user_input_awake_time = None,
	user_input_timezone = None,str_dt = True,bed_time_today=None):
	"""
	If str_dt is True then string reperesentation of sleep and awake
	time is returned otherwise datetime Object or None if no sleep data.

	If bed_time_today is True, that's mean we are tying to find out today's bedtime
	"""

	def _get_deep_light_awake_sleep_duration(data):
		'''
		Get deep sleep, light sleep and rem sleep duration
		from sleep levels

		Args:
			data(dict): Sleep summary

		Returns:
			dict: deep, light and rem sleep duration in seconds
		'''
		durations = {'deep':0,'light':0,'awake':0,"rem":0}
		sleep_level_maps = data.get('sleepLevelsMap')
		if sleep_level_maps:
			for lvl_type,lvl_data in sleep_level_maps.items():
				if lvl_type in durations.keys():
					durations[lvl_type] += sum(
						[(datetime.utcfromtimestamp(d['endTimeInSeconds'])
						- datetime.utcfromtimestamp(d['startTimeInSeconds'])).seconds
						for d in lvl_data])
		return durations

	recent_auto_manual = None
	recent_auto_final = None
	recent_tentative = None
	target_sleep_data = None

	user_submitted_sleep = False
	local_user_input_bedtime = None
	local_user_input_awake_time = None

	sleep_stats = {
		"deep_sleep": '',
		"light_sleep": '',
		"awake_time": '',
		"rem_sleep":'',
		"sleep_bed_time": '',
		"sleep_awake_time": '',
		"sleep_per_wearable":''
	}

	if user_input_bedtime and user_input_awake_time and user_input_timezone:
		# If manual sleep bedtime last night and awake time is submitted then we'll
		# user this sleep bedtime time and awake time. We'll convert these time in
		# timezone from where user input was submitted by user
		user_submitted_sleep = True
		target_tz = pytz.timezone(user_input_timezone)
		local_user_input_bedtime = user_input_bedtime.astimezone(target_tz)
		local_user_input_awake_time = user_input_awake_time.astimezone(target_tz)


	if yesterday_sleep_data:
		for obj in yesterday_sleep_data:
			start_time = datetime.utcfromtimestamp(
				obj.get('startTimeInSeconds',0) +
				obj.get('startTimeOffsetInSeconds',0))
			next_day_midnight = datetime.combine(
				(start_time+timedelta(days=1)).date(),time(0))
			end_time = start_time + timedelta(
				seconds=obj.get('durationInSeconds',0))
			if end_time > next_day_midnight:
				if 'MANUAL' in obj.get('validation',None):
					recent_auto_manual = obj
					break;
				elif (obj.get('validation',None) == 'AUTO_FINAL' 
						and not recent_auto_final):
					recent_auto_final = obj
				elif ('TENTATIVE' in obj.get('validation',None) 
						and not recent_tentative):
					recent_tentative = obj

		if recent_auto_manual:
			target_sleep_data = recent_auto_manual
		elif recent_auto_final:
			target_sleep_data = recent_auto_final
		else:
			target_sleep_data = recent_tentative

	if not target_sleep_data:
		max_end_time = None
		for obj in today_sleep_data[::-1]:
			start_time = datetime.utcfromtimestamp(
				obj.get('startTimeInSeconds',0) +
				obj.get('startTimeOffsetInSeconds',0))
			midnight = datetime.combine(start_time.date(),time(0))
			if start_time >= midnight:

				obj_start_time = datetime.utcfromtimestamp(
					obj.get('startTimeInSeconds')
					+ obj.get('startTimeOffsetInSeconds'))
				obj_end_time = (
					obj_start_time 
					+ timedelta(seconds=obj.get('durationInSeconds',0)))

				if not target_sleep_data:
					# most earliest(or recent if trying to find bedtime today) record of the day
					# at start of loop
					target_sleep_data = obj
					max_end_time = obj_end_time
					# the most recent record on any date will be used to determine the bedtime
					# on that day, so once we get it no need to look further
					if bed_time_today:
						break
					continue

				if ('TENTATIVE' in obj.get('validation',None) and
					obj_start_time < max_end_time):
					target_sleep_data = obj
					max_end_time = obj_end_time

				elif ('MANUAL' in obj.get('validation',None) and
					obj_start_time < max_end_time):
					target_sleep_data = obj
					max_end_time = obj_end_time

				elif (obj.get('validation',None) == 'AUTO_FINAL' and
					  obj_start_time < max_end_time and
					  'TENTATIVE' in target_sleep_data.get('validation',None)):
					target_sleep_data = obj
					max_end_time = obj_end_time

	if target_sleep_data:
		if target_sleep_data.get('validation',None) == 'MANUAL':
			sleep_info = _get_deep_light_awake_sleep_duration(target_sleep_data)
			sleep_stats['deep_sleep'] = sec_to_hours_min_sec(
				sleep_info['deep'],include_sec = False
			)
			sleep_stats['light_sleep'] = sec_to_hours_min_sec(
				sleep_info['light'], include_sec = False
			)
			sleep_stats['awake_time'] = sec_to_hours_min_sec(
				sleep_info['awake'],include_sec = False
			)
			sleep_stats['rem_sleep'] = sec_to_hours_min_sec(
				sleep_info['rem'],include_sec = False
			)
		else:
			sleep_stats['deep_sleep'] = sec_to_hours_min_sec(
				target_sleep_data.get('deepSleepDurationInSeconds',0),
				include_sec=False)
			sleep_stats['light_sleep'] = sec_to_hours_min_sec(
				target_sleep_data.get('lightSleepDurationInSeconds',0),
				include_sec=False)
			sleep_stats['awake_time'] = sec_to_hours_min_sec(
				target_sleep_data.get('awakeDurationInSeconds',0),
				include_sec=False)
			sleep_stats['rem_sleep'] = sec_to_hours_min_sec(
				target_sleep_data.get('remSleepInSeconds',0),
				include_sec=False)

		if target_sleep_data.get('validation',None) == 'MANUAL':
			awake_duration = _get_deep_light_awake_sleep_duration(target_sleep_data)
			awake_duration = awake_duration.get('awake',0)
		else:
			awake_duration = target_sleep_data.get('awakeDurationInSeconds',0)

		if yesterday_sleep_data is not None and user_submitted_sleep:
			# Here trying to get bedtime last night and awake time. If user submitted
			# manual bedtime and awake time then, we'll use that timezone aware bedtime 
			# and awake time and get the naive datetime object
			bed_time = local_user_input_bedtime.replace(tzinfo = None)
			awake_time = local_user_input_awake_time.replace(tzinfo = None)

		elif (yesterday_sleep_data is None and today_sleep_data and user_input_timezone):
			# Here trying to get todays bedtime, we'll assume that sleep data was recorded
			# in same timezone as of user input submitted by user today. Thus we'll convert 
			# bedtime and awake time in same timezone and get the naive datetime object
			target_tz = pytz.timezone(user_input_timezone)
			bed_time = pytz.utc.localize(
				datetime.utcfromtimestamp(
					target_sleep_data.get('startTimeInSeconds'))
				).astimezone(target_tz).replace(tzinfo=None)
			
			feb17 = datetime(2018,2,17,0,0,0)
			if(sleep_calendar_date < feb17):
				awake_time = pytz.utc.localize(
					datetime.utcfromtimestamp(
						target_sleep_data.get('startTimeInSeconds')
						+ target_sleep_data.get('durationInSeconds'))
					).astimezone(target_tz).replace(tzinfo = None)
			else:
				awake_time = pytz.utc.localize(datetime.utcfromtimestamp(
					target_sleep_data.get('startTimeInSeconds')
					+ target_sleep_data.get('durationInSeconds')
					+ awake_duration)).astimezone(target_tz).replace(tzinfo = None)
		else:
			bed_time = datetime.utcfromtimestamp(
				target_sleep_data.get('startTimeInSeconds')
				+ target_sleep_data.get('startTimeOffsetInSeconds'))

			feb17 = datetime(2018,2,17,0,0,0)
			if(sleep_calendar_date < feb17):
				awake_time = datetime.utcfromtimestamp(
					target_sleep_data.get('startTimeInSeconds',0)
					+ target_sleep_data.get('startTimeOffsetInSeconds',0)
					+ target_sleep_data.get('durationInSeconds'))
			else:
				awake_time = datetime.utcfromtimestamp(
					target_sleep_data.get('startTimeInSeconds',0)
					+ target_sleep_data.get('startTimeOffsetInSeconds',0)
					+ target_sleep_data.get('durationInSeconds')
					+ awake_duration)

		sleep_per_wearable = (awake_time-bed_time).seconds - awake_duration
		sleep_stats['sleep_per_wearable'] = sec_to_hours_min_sec(
			sleep_per_wearable,include_sec=False)
		if str_dt:
			sleep_stats['sleep_bed_time'] = bed_time.strftime("%I:%M %p")
			sleep_stats['sleep_awake_time'] = awake_time.strftime("%I:%M %p")
		else:
			sleep_stats['sleep_bed_time'] = bed_time
			sleep_stats['sleep_awake_time'] = awake_time
		return sleep_stats

	elif user_submitted_sleep:
		# If there is no sleep data at all, use whatever submitted by user
		bed_time = local_user_input_bedtime.replace(tzinfo = None)
		awake_time = local_user_input_awake_time.replace(tzinfo = None)
		if str_dt:
			sleep_stats['sleep_bed_time'] = bed_time.strftime("%I:%M %p")
			sleep_stats['sleep_awake_time'] = awake_time.strftime("%I:%M %p")
		else:
			sleep_stats['sleep_bed_time'] = bed_time
			sleep_stats['sleep_awake_time'] = awake_time
	else:
		if not str_dt:
			sleep_stats['sleep_bed_time'] = None
			sleep_stats['sleep_awake_time'] = None

	return sleep_stats

def is_potential_hrr_activity(activity):
	'''
	Check if activity is potential HRR file or not. 
	Any activity is potential HRR if meets following criteria - 
		1)it's not actually "HEART RATE RECOVERY" file
		2) Not created manually by user from activity grid
		3) Not yet submitted from the user input. How to check?
			Any activity file submitted from user input activity grid 
			will have "duplicate" key.  
		4) Duration in seconds is greater than or equal to 1200 seconds
		5) Distance in meters is greater than or equal to 1287.48 (0.8 miles) 
	'''
	if(activity 
		and activity.get('activityType') != "HEART_RATE_RECOVERY"
		and not activity.get('created_manually',False) # not manually created by user 
		and not "duplicate" in activity # not edited by user yet 
		and activity.get("durationInSeconds",0) <= 1200
		and activity.get("distanceInMeters",0) <= 1287.48):
		return True
	return False

def get_renamed_to_hrr_activities(user,calendar_date,activities):
	'''
	Return the list of summary ids which has to be renamed as
	"HEART_RATE_RECOVERY"

	Args:
		user(:obj:`User`): Currently logged user
		calendar_date(datetime): Date for which calculation has to be done
		activities(list): List of activities

	Return:
		list: List of summary id. Empty list if there is no activity which
			need to be renamed 
	'''
	calendar_date = calendar_date.strftime("%Y-%m-%d")
	renamed_summaries = []
	any_potential_hrr = False
	for activity in activities:
		if not any_potential_hrr and is_potential_hrr_activity(activity):
			any_potential_hrr = True
			break
	if any_potential_hrr:
		try:
			# call the FIT parser function and get the renamed activities
			renamed_activities = user_input.views.garmin_views._get_activities(
				user,calendar_date)
		except Exception as e:
			renamed_activities = None
		if renamed_activities:	
			for activity in activities:
				renamed_act = renamed_activities.get(activity.get('summaryId'),None)
				if(renamed_act 
					and renamed_act.get('activityType') == 'HEART_RATE_RECOVERY'):
					renamed_summaries.append(activity['summaryId'])
	return renamed_summaries

def is_duplicate_activity(activity, all_activities):
	'''
	Determine if the activity file is duplicate activity file or not
	using following logic - 

	1. Check if any two or more activities are overlapping (10 min or more)
	   based on start and end time of activities and they are from different
	   devices
	2. Discard any activity which does not have average heart rate information,
	   assuming at least some of them have heart rate information.
	3. Now pick that activity which has the longest duration.
	4. If all overlapping activities have no heart rate information, then pick
	   the activity with the longest duration  [ALTERNATE SCENARIO]
	
	Args:
		activity(dict): Activity which needs to be classified
		all_activities(list): A list of all activities

	Return:
		Bool: True if activity is duplicate else False 
	'''
	is_duplicate = False

	if activity and all_activities:
		if 'duplicate' in activity:
			# If user has already classified any activity then return 
			# that classification otherwise proceed with full check.
			duplicate = activity.get('duplicate',None)
			if duplicate is not None:
				return duplicate

		overlapping_activities = []
		activity_start = datetime.utcfromtimestamp(
			activity.get('startTimeInSeconds',0)
			+activity.get('startTimeOffsetInSeconds',0))
		activity_end = (activity_start 
			+ timedelta(seconds=activity.get('durationInSeconds',0)))

		for act in all_activities:
			overlapping_duration_in_sec = 0
			act_start = datetime.utcfromtimestamp(
				act.get('startTimeInSeconds',0)
				+ act.get('startTimeOffsetInSeconds',0))
			act_end = (act_start 
				+ timedelta(seconds=act.get('durationInSeconds',0)))
			if (act_start >= activity_start and act_end <= activity_end):
				overlapping_duration_in_sec += act.get('durationInSeconds',0)
			elif (act_start >= activity_start and act_start <= activity_end):
				overlapping_sec = (activity_end - act_start).seconds
				overlapping_duration_in_sec += overlapping_sec
			elif (act_end >= activity_start and act_end <= activity_end):
				overlapping_sec = (act_end - activity_start).seconds
				overlapping_duration_in_sec += overlapping_sec
			elif (act_start <= activity_start and act_end >= activity_end):
				overlapping_sec = (activity_start - activity_end).seconds
				overlapping_duration_in_sec += overlapping_sec
			if (overlapping_duration_in_sec 
				and overlapping_duration_in_sec > 600
				and (not activity.get('deviceName','manually_created') 
					== act.get('deviceName','manually_created'))):
				overlapping_activities.append(act)

		overlapping_activities.append(activity)
		if overlapping_activities:
			original_act = None
			longest_duration = 0
			for act in overlapping_activities:
				if (act.get('durationInSeconds',0) >= longest_duration
					and act.get('averageHeartRateInBeatsPerMinute',0)):
					original_act = act
					longest_duration = act.get('durationInSeconds',0)

			if not original_act:
				# If no original activity is found that means all of the 
				# overlapping activities have no average heart rate information. 
				# So in such case pick the activity with longest duration.
				longest_duration = 0
				for act in overlapping_activities:
					if (act.get('durationInSeconds',0) >= longest_duration):
						original_act = act
						longest_duration = act.get('durationInSeconds',0)

			if (original_act 
				and original_act.get('summaryId') != activity.get('summaryId')):
					is_duplicate = True

	return is_duplicate

def activity_step_from_epoch(act_start, act_end, epochs):
	'''
	Try to guess the number of steps for given activity start
	and end time. Especially for those activities which have
	0 steps for example, Indoor Rowing, Yoga, Swimming etc.

	Args:
		act_start(datetime): Start time of the activity
		act_end(datetime): End time of the activity
		epoch(list): List of epoch summaries

	Returns:
		Int: Number of steps
	'''
	steps = 0
	for epoch in epochs:
		epoch_steps = epoch.get('steps',0)
		epoch_start = datetime.utcfromtimestamp(
			epoch.get('startTimeInSeconds')
			+ epoch.get('startTimeOffsetInSeconds'))
		epoch_end = (epoch_start + timedelta(
			seconds=epoch.get('durationInSeconds')))
		if(epoch_start >= act_start and epoch_end <= act_end):
			steps += epoch_steps
	return steps

def get_zones_cutoff(age):
	'''
	calculate the aerobic and anaerobic zone
	start heartbeat
	'''
	if age:

		return {
			"aerobic_zone":180-age-29,
			"anaerobic_zone":180-age+5
		}
	return None

def get_activity_exercise_non_exercise_category(activity,user_age):
	'''
	Determine the category of provided activity summary. Possible
	categories are "exercise" and "non-exercise"
	'''
	EXERCISE = 'exercise'
	NON_EXERCISE = 'non_exercise'
	HEART_RATE_RECOVERY = 'heart_rate_recovery'
	zones = get_zones_cutoff(user_age)
	if activity.get("steps_type"):
		return activity.get("steps_type")

	if activity.get('activityType','').lower() == HEART_RATE_RECOVERY:
		return NON_EXERCISE
	elif 'walk' in activity.get('activityType','').lower():
		avg_hr = activity.get("averageHeartRateInBeatsPerMinute",0)
		# If average heart rate in beats per minute is not submitted by user
		# then it would be by default empty string. In that case default it to 0 
		if not avg_hr:
			avg_hr = 0	
		if(not avg_hr or avg_hr < zones['aerobic_zone']):
			return NON_EXERCISE
		else:
			return EXERCISE
	else:
		return EXERCISE

def get_filtered_activity_stats(activities_json,user_age,
		manually_updated_json={},userinput_activities = None,
		include_duplicate = False,include_deleted = False,
		include_non_exercise = False,provide_all=False,**kwargs):
	
	'''
	Combine activities, manually edited activities and user input activities
	and provide final list of activities.

	During combining activities, information from activites are preferrend in
	following order - user edited/modifies > Manually edited > normal activities 

	Args:
		activities_json (list): List of  activities
		user_age(int): Age of the user 
		manually_updated_json (dict): Dictionary of manually edited activities.
			Key is activity id and value is activity data. Default to empty
			dictionary
		userinput_activities (dict): dictionary of user created/modified
			activities. Key is activity id and value is complete activity data 
		include_duplicate (bool): Include duplicate activity summaries in the
			final activities list if set to True. Default to False
		include_deleted (bool): Include deleted activity summaries in the
			final activities list if set to True. Default to False,
		include_non_exercise(bool): Include non exercise activitity sumamaries
			in the final activities list if set to True. Default to False.
		provide_all(bool): Return separately both exercise and non-exercise
			activity summaries. Default to False 

		Return:
			list: List of all exercise activities if "include_non_exercise" is 
				False else list of all exercise and non-exercise activities
			tuple(list,list): Tuple having list of exercise activitities and
				list of both exercise and non-exercise activities as first
				and second item if "provide_all" is true
	'''

	activities_json = copy.deepcopy(activities_json)
	userinput_activities = copy.deepcopy(userinput_activities)
	manually_updated_json = copy.deepcopy(manually_updated_json)
	epoch_summaries = kwargs.get('epoch_summaries')
	
	# If same id exist in user submited activities, give it more preference
	# than manually edited activities
	def userinput_edited(obj):
		obj_in_user_activities = userinput_activities.get(obj.get('summaryId'),None)
		if obj_in_user_activities:
			userinput_activities.pop(obj.get('summaryId'))
			filtered_obj = {}
			for key,val in obj_in_user_activities.items():
				# if any key (except 'duplicate') have empty, null or 0 value
				# then remove it and look for that key in original garmin provided
				# summary because sometimes user submitted activities might have
				# no value for fields like - avgHeartRateInBeatsPerMinute, steps
				# etc. In that case empty value will be taken for those keys even
				# though value exist in original summary provided by garmin 
				if(val or key == 'duplicate' or key == 'deleted' 
					or key == 'comments' or key == 'activity_weather'):
					filtered_obj[key] = val
			return filtered_obj
		return obj

	# If same id existed in manually edited, give it more prefrence
	manually_edited = lambda x: manually_updated_json.get(x.get('summaryId'),x)	
	filtered_activities = []
	if activities_json:
		for obj in activities_json:
			non_edited_steps = obj.get('steps',0)
			obj = manually_edited(obj)
			manually_edited_steps = obj.get('steps',None)
			if (non_edited_steps and not manually_edited_steps):
				# Manually edited summaries drop steps data, so if steps
				# data in manually edited summary is not present but
				# it was present in normal unedited version of summary, in
				# that case add the previous step data to the current summary
				obj['steps'] = non_edited_steps
			elif epoch_summaries and not non_edited_steps:
				# Try to guess the activity steps from epoch summaries
				# if epoch summaries are present(in Garmin, it is present)
				act_start_end_time = _get_activities_start_end_time([obj])[0]
				steps = activity_step_from_epoch(
					act_start_end_time.start,
					act_start_end_time.end,
					epoch_summaries
				)
				obj['steps'] = steps

			if userinput_activities:
				obj.update(userinput_edited(obj))
			filtered_activities.append(obj)

	# merge user created manual activities which are not provided by garmin
	if userinput_activities:
		for activity in userinput_activities.values():
			# Manually created activities will have extra key 'created_manually'
			# which represents that it is manually created activity 
			activity['created_manually'] = True
		filtered_activities += userinput_activities.values()

	act_renamed_to_hrr = []
	if kwargs.get('user') and kwargs.get('calendar_date') and filtered_activities:
		act_renamed_to_hrr = get_renamed_to_hrr_activities(
			user = kwargs.get('user'),
			calendar_date = kwargs.get('calendar_date'),
			activities = filtered_activities
		)
	for act in filtered_activities:
		# If any activity is categorized as HRR as per our logic but
		# user decided to change it to something else, in that case
		# do not rename it to HRR
		is_edited_by_user = False
		if userinput_activities:
			is_edited_by_user = (True 
				if userinput_activities.get(act.get('summaryId'),None) else False)
			
		if act['summaryId'] in act_renamed_to_hrr and not is_edited_by_user:
			act['activityType'] = 'HEART_RATE_RECOVERY'
		act_category = get_activity_exercise_non_exercise_category(act,
				user_age)
		act['steps_type'] = act_category

	deleted_activities = []
	duplicate_activities = []
	dup_del_activities = []
	non_dup_non_del_activities = []

	deleted_non_exec_activities = []
	duplicate_non_exec_activities = []
	dup_del_non_exec_activities = []
	non_dup_non_del_non_exec_activities = []

	for act in filtered_activities:
		duplicate = is_duplicate_activity(act,filtered_activities)
		deleted = act.get('deleted',False)
		activity_category = act.get('steps_type')
		if activity_category == 'non_exercise':
			if not duplicate and not deleted:
				act['duplicate'] = False
				act['deleted'] = False
				non_dup_non_del_non_exec_activities.append(act)
			elif duplicate and deleted:
				act['duplicate'] = True
				dup_del_non_exec_activities.append(act)
			elif duplicate and not deleted:
				act['duplicate'] = True
				act['deleted'] = False
				duplicate_non_exec_activities.append(act)
			elif deleted and not duplicate:
				deleted_non_exec_activities.append(act)
		else:
			if not duplicate and not deleted:
				act['duplicate'] = False
				act['deleted'] = False
				non_dup_non_del_activities.append(act)
			elif duplicate and deleted:
				act['duplicate'] = True
				dup_del_activities.append(act)
			elif duplicate and not deleted:
				act['duplicate'] = True
				act['deleted'] = False
				duplicate_activities.append(act)
			elif deleted and not duplicate:
				deleted_activities.append(act)

	# Have both exercise and non-exercise activity
	final_all_activities = []
	if(provide_all or include_non_exercise):
		if include_duplicate and include_deleted:
			final_all_activities = (
				non_dup_non_del_activities + non_dup_non_del_non_exec_activities
				+ duplicate_activities + duplicate_non_exec_activities
				+ deleted_activities + deleted_non_exec_activities
				+ dup_del_activities + dup_del_non_exec_activities)
		elif not include_duplicate and not include_deleted:
			final_all_activities = (
				non_dup_non_del_activities 
				+ non_dup_non_del_non_exec_activities)
		elif include_duplicate:
			final_all_activities = (
				non_dup_non_del_activities + non_dup_non_del_non_exec_activities
				+ duplicate_activities + duplicate_non_exec_activities)
		elif include_deleted:
			final_all_activities = (
				non_dup_non_del_activities + non_dup_non_del_non_exec_activities
				+ deleted_activities + deleted_non_exec_activities)
		else:
			final_all_activities = filtered_activities
	
	final_exercise_activities = []
	if include_duplicate and include_deleted:
		final_exercise_activities = (
			non_dup_non_del_activities
			+ duplicate_activities
			+ deleted_activities
			+ dup_del_activities)
	elif not include_duplicate and not include_deleted:
		final_exercise_activities = non_dup_non_del_activities
	elif include_duplicate:
		final_exercise_activities = non_dup_non_del_activities+duplicate_activities
	elif include_deleted:
		final_exercise_activities = non_dup_non_del_activities+deleted_activities
	else:
		final_exercise_activities = filtered_activities

	if provide_all and include_non_exercise:
		return (final_all_activities,final_all_activities)
	elif provide_all:
		return (final_exercise_activities,final_all_activities)
	elif include_non_exercise:
		return final_all_activities
	else:
		return final_exercise_activities
	

def do_user_has_exercise_activity(combined_user_activities,user_age):
	IGNORE_ACTIVITY = ['HEART_RATE_RECOVERY']
	have_activities = False
	if combined_user_activities:
		for act in combined_user_activities:
			if act.get("activityType","") not in IGNORE_ACTIVITY:
				act_steps_type = act.get("steps_type","")
				if not have_activities and act_steps_type == 'exercise':
					have_activities = True

	return have_activities

def get_activity_stats(combined_user_activities,user_age):

	IGNORE_ACTIVITY = ['HEART_RATE_RECOVERY']

	activity_stats = {
		"have_activity":False,
		"distance_run_miles": 0,
		"distance_bike_miles": 0,
		"distance_swim_yards": 0,
		"distance_other_miles": 0,
		"total_duration":0,
		"pace":'',
		"avg_heartrate":json.dumps({}),
		"activities_duration":json.dumps({}),
		"hr90_duration_15min":False, # exercised for at least 15 min with atleast avg hr 90
		"latitude":None,
		"longitude":None
	}
	
	activities_hr = {}
	activities_duration = {}
	max_duration = 0

	if len(combined_user_activities):
		avg_run_speed_mps = 0
		total_duration = 0
		workout_wise_total_duration = {}

		for obj in combined_user_activities:
			activity_type = obj.get('activityType')
			activity_duration = obj.get('durationInSeconds',0)
			if(activity_type not in IGNORE_ACTIVITY):
				total_duration += activity_duration
			if not workout_wise_total_duration.get(activity_type):
				workout_wise_total_duration[activity_type] = 0
			workout_wise_total_duration[activity_type] += activity_duration
		
		for obj in combined_user_activities:

			act_duration = obj.get('durationInSeconds',0)
			obj_act = obj.get('activityType')
			obj_avg_hr = obj.get('averageHeartRateInBeatsPerMinute')
			workout_type_total_duration = workout_wise_total_duration.get(obj_act)
			if not obj_avg_hr:
				obj_avg_hr = 0

			if not activity_stats['have_activity']:
				activity_stats['have_activity'] = (
					do_user_has_exercise_activity(
						combined_user_activities,user_age))

			activities_duration[obj['activityType']] = obj.get('durationInSeconds',0)
			if not activities_hr.get(obj_act, None):
				activities_hr[obj_act] = 0
			# weighted average
			activities_hr[obj_act] += round((act_duration/workout_type_total_duration)*obj_avg_hr)

			# capture lat and lon of activity with maximum duration
			if (obj.get('durationInSeconds',0) >= max_duration) or \
			   (not activity_stats['latitude'] or not activity_stats['longitude']):
				if obj.get('startingLatitudeInDegree',None) or obj.get('startingLongitudeInDegree',None):
					activity_stats['latitude'] = obj.get('startingLatitudeInDegree',None)
					activity_stats['longitude'] = obj.get('startingLongitudeInDegree',None)
					max_duration = obj.get('durationInSeconds',0)
					

			if not activity_stats['hr90_duration_15min']:
				if (obj_avg_hr >= 90 and  
					obj.get('durationInSeconds',0) >= 900):
					activity_stats['hr90_duration_15min'] = True
				elif ('swimming' in obj.get('activityType').lower() and #HR is not required for swimming activities
					  obj.get('durationInSeconds',0) >= 900):
					activity_stats['hr90_duration_15min'] = True

			if 'running' in obj.get('activityType','').lower():
				activity_stats['distance_run_miles'] += obj.get('distanceInMeters',0)
				act_avg_speed = obj.get("averageSpeedInMetersPerSecond",0)
				# Weighted average
				avg_run_speed_mps += ((act_duration/workout_type_total_duration)*act_avg_speed)

			elif 'swimming' in obj.get('activityType','').lower():
				activity_stats['distance_swim_yards'] += obj.get('distanceInMeters',0)

			elif 'biking' in obj.get('activityType','').lower():
				activity_stats['distance_bike_miles'] += obj.get('distanceInMeters',0)

			elif 'other' in obj.get('activityType','').lower():
				activity_stats['distance_other_miles'] += obj.get('distanceInMeters',0)
	
		activity_stats['avg_heartrate'] = json.dumps(activities_hr)
		activity_stats['total_duration'] = total_duration
		
		# Conversion into respective units
		to_miles = lambda x: round(x * 0.000621371, 2)
		to_yards = lambda x: round(x * 1.09361, 2)
		activity_stats['distance_run_miles'] = to_miles(activity_stats['distance_run_miles'])
		activity_stats['distance_bike_miles'] = to_miles(activity_stats['distance_bike_miles'])
		activity_stats['distance_other_miles'] = to_miles(activity_stats['distance_other_miles'])
		activity_stats['distance_swim_yards'] = to_yards(activity_stats['distance_swim_yards'])
		activity_stats['pace'] = meter_per_sec_to_pace_per_mile(avg_run_speed_mps) 

		activity_stats['activities_duration'] = json.dumps(activities_duration)
	return activity_stats

def _get_avg_hr_points_range(age,workout_easy_hard):
	Range = namedtuple('Range',['min','max'])
	point_range  = {}
	if workout_easy_hard == 'easy':
		point_range[4] = Range(180-age+5-30, 180-age+5)
		point_range[3] = Range(180-age+6, 180-age+9)
		point_range[2] = Range(180-age+10, 180-age+13)
		point_range[1] = Range(180-age+14,180-age+14)
		point_range[0] = Range(180-age-31, 180-age+15)
	elif workout_easy_hard == 'hard':
		point_range[4] = Range(180-age+25, 180-age+59)
		point_range[3] = Range(180-age+20, 180-age+24)
		point_range[2] = Range(180-age+10, 180-age+19)
		point_range[1] = Range(180-age+5,180-age+9)
		point_range[0] = Range(180-age+4, 180-age+60)
	else:
		return None
	return point_range

def _get_activities_start_end_time(combined_user_activities):
	'''
		Return list of named tuples containing start and end datetime
		object of each activities
	'''

	Time = namedtuple("Time",["start","end","duration"])
	activities_start_end_time = []

	if combined_user_activities:
		for activity in combined_user_activities:
			start_time = (
				activity.get('startTimeInSeconds',0) 
				+ activity.get('startTimeOffsetInSeconds')
			)
			end_time = start_time + activity.get('durationInSeconds',0)
			activities_start_end_time.append(
				Time(
					datetime.utcfromtimestamp(start_time),
					datetime.utcfromtimestamp(end_time),
					activity.get('durationInSeconds',0)
				)
			)
	return activities_start_end_time  

def in_interval(act_start,act_end,int_start,int_end):
	if(act_start >= int_start and act_end <= int_end):
		return True
	elif(act_start >= int_start and act_start <= int_end):
		return True
	elif(act_end >= int_start and act_end <= int_end):
		return True
	elif(act_start <= int_end and act_end >= int_end):
		return True
	else:
		return False

def _is_epoch_falls_in_activity_duration(activites_time_list,epoch_start):
	for activity_time in activites_time_list:
		start = datetime.combine(activity_time.start.date(),time(activity_time.start.hour))
		end = datetime.combine(activity_time.end.date(),time(activity_time.end.hour,59))
		if epoch_start >= start and epoch_start <= end:
			return True
	return False 

def _update_status_to_sleep_hours(mc_data,last_sleeping_hour,calendar_date):
	active_hours = 0
	inactive_hours = 0
	total_steps = 0
	sleeping_hours = 0
	strength_hours = 0
	exercise_hours = 0
	nap_hours = 0
	no_data_hours = 0
	timezone_change_hours = 0

	for interval,values in list(mc_data.items()):
		non_interval_keys = ['active_hours','inactive_hours','sleeping_hours',
			'strength_hours','exercise_hours','total_steps','timezone_change_hours',
			'no_data_hours','nap_hours','total_active_minutes','total_active_prcnt']
		if interval not in non_interval_keys:
			am_or_pm = interval.split('to')[0].strip().split(' ')[1]
			hour = interval.split('to')[0].strip().split(' ')[0].split(':')[0]
			if am_or_pm == 'PM' and int(hour) != 12:
				hour = int(hour) + 12
			elif am_or_pm == 'AM' and int(hour) == 12:
				hour = 0
			else:
				hour = int(hour)
				
			hour_start = datetime.combine(calendar_date.date(),time(hour))

			if last_sleeping_hour and hour_start <= last_sleeping_hour:
				mc_data[interval]['status'] = 'sleeping'
				for quarter in mc_data[interval]["quarterly"]:
					mc_data[interval]["quarterly"][quarter]['status'] = 'sleeping'

			if mc_data[interval]['status'] == 'active': 
				active_hours += 1 
			elif mc_data[interval]['status'] == 'inactive':
				inactive_hours += 1
			elif mc_data[interval]['status'] == 'sleeping':
				sleeping_hours += 1
			elif mc_data[interval]['status'] == 'strength':
				strength_hours += 1
			elif mc_data[interval]['status'] == 'exercise':
				exercise_hours += 1
			elif mc_data[interval]['status'] == 'nap':
				nap_hours += 1
			elif mc_data[interval]['status'] == 'no data yet':
				no_data_hours += 1
			elif mc_data[interval]['status'] == 'time zone change':
				timezone_change_hours += 1
			total_steps += values['steps']
			
	mc_data['active_hours'] = active_hours
	mc_data['inactive_hours'] = inactive_hours
	mc_data['sleeping_hours'] = sleeping_hours
	mc_data['strength_hours'] = strength_hours
	mc_data['exercise_hours'] = exercise_hours
	mc_data['nap_hours'] = nap_hours
	mc_data['no_data_hours'] = no_data_hours
	mc_data['timezone_change_hours'] = timezone_change_hours
	mc_data['total_steps'] = total_steps

def _get_user_current_local_time(user,tz_offset=None):
	'''
	Return the current local time of user.
	If timezone offset is provided then use this offset to 
	determine local time otherwise look for offset value.
	If no offset value is found then return current UTC time.

	Args:
		tz_offset(int): Offset value of user's timezone. Default is None

	Returns:
		Datetime: Return a naive datetime object   
	'''
	utc_time_now = datetime.utcnow()
	# First check garmin last sync
	if not tz_offset:
		try:
			last_synced_obj = UserLastSynced.objects.get(user=user)
			tz_offset = last_synced_obj.offset
		except UserLastSynced.DoesNotExist as e:
			tz_offset = 0

	# Still no offset, look if user have fitbit last sync time
	if not tz_offset:
		try:
			last_synced_obj = UserFitbitLastSynced.objects.get(user=user)
			tz_offset = last_synced_obj.offset
		except UserFitbitLastSynced.DoesNotExist as e:
			tz_offset = 0

	if tz_offset:
		td = timedelta(seconds = tz_offset)
		local_time = utc_time_now + td
		return local_time
	return utc_time_now

def check_timezone_change(today_epoch_data,
 		yesterday_epoch_data=None, tomorrow_epoch_data=None):
	"""
	Check timezone changes and return the list of time interval 
	which have to be marked as "Timezone Change"
	"""
	timezone_change_interval = []
	Interval = namedtuple('Interval',['start','end'])
	if yesterday_epoch_data:
		# sort record so that oldest record first and newest record last
		yesterday_epoch_data = sorted(
			yesterday_epoch_data,
			key=lambda x: int(x.get('startTimeInSeconds')))

	if tomorrow_epoch_data:
		tomorrow_epoch_data = sorted(
			tomorrow_epoch_data,
			key=lambda x: int(x.get('startTimeInSeconds')))

	if today_epoch_data:
		today_epoch_data = sorted(
			today_epoch_data,
			key=lambda x: int(x.get('startTimeInSeconds')))
		epoch_data_date = datetime.utcfromtimestamp(
			today_epoch_data[0].get("startTimeInSeconds")
			+ today_epoch_data[0].get("startTimeOffsetInSeconds"))
		today_midnight_dt = datetime.combine(epoch_data_date.date(),time(0))
		today_last_min_dt = datetime.combine(epoch_data_date.date(),time(23,59))

		last_start_time = None
		last_offset = None
		for i,epoch in enumerate(today_epoch_data):
			current_start_time = (epoch.get('startTimeInSeconds')
				+ epoch.get('startTimeOffsetInSeconds'))
			current_start_time = datetime.utcfromtimestamp(current_start_time)
			current_offset = epoch.get('startTimeOffsetInSeconds',0)

			if i == 0 and yesterday_epoch_data:
				# if it is first record of the day and user
				# moved in tz ahead of previous tz eg. if user switched
				# timezone at 11:00 PM July 30 California to NY then
				# the next summary would be recorded at 2:00 AM NY timezone.
				# So we have to mark interval 12:00 - 12:59 AM and
				# 1:00 to 1:59 AM on July 31 as timezone change 
				yday_last_record = yesterday_epoch_data[-1]
				yday_last_record_offset = yday_last_record.get(
					'startTimeOffsetInSeconds')
				if not current_offset == yday_last_record_offset:
					if current_offset > yday_last_record_offset:
						timezone_change_interval.append(
							Interval(today_midnight_dt,current_start_time))

			elif i == len(today_epoch_data)-1 and tomorrow_epoch_data:
				# if it is last record of the day and user
				# moved in tz ahead of current tz eg. if user switched
				# timezone at 10:30 PM July 30 California to NY then
				# the next summary would be recorded at 1:30 AM NY timezone.
				# So we have to mark interval 10:00 - 10:59 AM and
				# 11:00 to 11:59 AM on July 30 as timezone change
				tomorrow_first_record = tomorrow_epoch_data[0]
				tomorrow_first_record_offset = tomorrow_first_record.get(
					'startTimeOffsetInSeconds')
				if not current_offset == tomorrow_first_record_offset:
					if current_offset < tomorrow_first_record_offset:
						timezone_change_interval.append(
							Interval(current_start_time,today_last_min_dt))

			elif last_offset and last_start_time:
				# check for timezone changes
				if not current_offset == last_offset:
					#offset are different, timezone got changed 
					if current_offset > last_offset:
						# user moved to time zone which is ahead of 
						# last timezone eg. California to NY
						timezone_change_interval.append(
							Interval(last_start_time,current_start_time))
					else:
						# user moved to time zone which is behind 
						# last timezone eg. NY to California
						timezone_change_interval.append(
							Interval(current_start_time,last_start_time))

			last_start_time = current_start_time
			last_offset = current_offset

	return timezone_change_interval

def _update_status_to_timezone_change(mc_data,timezone_change_interval,calendar_date):
	'''
	Update status of hourly intervals to "timezone change" according to 
	the interval list

	Args:
		mc_data(dict): Dictionary containing hourly interval MC data
		timezone_change_interval(list): A list containing named tuple,
			representing time interval to be marked as "timezone change"
		calendar_date(datetime): A datetime object representing date for which
			this MC data is
	'''
	def in_tz_interval(hour_start):
		for interval in timezone_change_interval:
			interval_start = datetime.combine(
				interval.start.date(),
				time(interval.start.hour))
			interval_end = datetime.combine(
				interval.end.date(),
				time(interval.end.hour,59))
			if hour_start >= interval_start and hour_start <= interval_end:
				return True
		return False

	for interval,values in list(mc_data.items()):
		non_interval_keys = ['active_hours','inactive_hours','sleeping_hours',
			'strength_hours','exercise_hours','total_steps']
		if interval not in non_interval_keys:
			am_or_pm = interval.split('to')[0].strip().split(' ')[1]
			hour = interval.split('to')[0].strip().split(' ')[0].split(':')[0]
			if am_or_pm == 'PM' and int(hour) != 12:
				hour = int(hour) + 12
			elif am_or_pm == 'AM' and int(hour) == 12:
				hour = 0
			else:
				hour = int(hour)
				
			hour_start = datetime.combine(calendar_date.date(),time(hour))
			if in_tz_interval(hour_start):
				mc_data[interval]['status'] = 'time zone change'
	return mc_data

def get_epoch_active_time(activites_time_list,epoch,intensity_level):
	'''
	Calculate active time for the given epoch data by considering
	duration of any activity(ies) overlapping with epoch duration.
	If activities overlap with epoch duration then, the overlapping duration
	will be added to active minutes.

	Args:
		activites_time_list(list): List of named tuple containing start time,
			end time and duration of activities.
		epoch(dict): Epoch data

	'''
	epoch_start = datetime.utcfromtimestamp(
		epoch.get('startTimeInSeconds')+ epoch.get('startTimeOffsetInSeconds'))
	epoch_end = epoch_start + timedelta(seconds=epoch.get('durationInSeconds'))

	overlapping_duration_in_sec = 0 
	for activity_time in activites_time_list:
		if (activity_time.start >= epoch_start 
			and activity_time.end <= epoch_end):
			overlapping_duration_in_sec += activity_time.duration
		elif (activity_time.start >= epoch_start 
			  and activity_time.start <= epoch_end):
			overlapping_sec = (epoch_end - activity_time.start).seconds
			overlapping_duration_in_sec += overlapping_sec
		elif (activity_time.end >= epoch_start 
			  and activity_time.end <= epoch_end):
			overlapping_sec = (activity_time.end - epoch_start).seconds
			overlapping_duration_in_sec += overlapping_sec
		elif (activity_time.start <= epoch_start
			  and activity_time.end >= epoch_end):
			overlapping_sec = (epoch_end - epoch_start).seconds
			overlapping_duration_in_sec += overlapping_sec
	
	if overlapping_duration_in_sec:
		active_seconds = overlapping_duration_in_sec
		if intensity_level != 'SEDENTARY':
			active_seconds += epoch.get('activeTimeInSeconds',0) 

		# Active minuted per epoch data is capped to 15 mins (900 sec)
		if active_seconds > 900:
			active_seconds = 900
	else:
		active_seconds = 0
		if intensity_level != 'SEDENTARY':
			active_seconds = epoch.get('activeTimeInSeconds',0)
	return active_seconds


def cal_quarter_status(quarter_start, quarter_end,
	steps, user_current_local_time,
	yesterday_bedtime = None, today_awake_time = None,
	today_bedtime = None, ui_strength_start_time = None,
	ui_strength_end_time = None, nap_start_time = None,
	nap_end_time = None, activities_start_end_time = None,
	timezone_change_interval = None):
	
	def in_act_interval(act_start_end_time_list,int_start, int_end):
		for interval in act_start_end_time_list:
			if in_interval(interval.start,
				interval.end,int_start,int_end):
				return True
		return False

	status = ''
	if 	in_act_interval(timezone_change_interval,quarter_start,quarter_end):
		status = "time zone change"
	elif (yesterday_bedtime and today_awake_time 
		and in_interval(yesterday_bedtime,today_awake_time,
		quarter_start,quarter_end)):
		status = "sleeping"
	elif (today_bedtime 
		  and (quarter_start >= today_bedtime
		  or today_bedtime >= quarter_start 
		  and today_bedtime <= quarter_end)):
		status = "sleeping"
	elif(ui_strength_start_time and ui_strength_end_time
		and in_interval(ui_strength_start_time,ui_strength_end_time,
		quarter_start,quarter_end)):
		status = "strength"
	elif(in_act_interval(activities_start_end_time,quarter_start,quarter_end)):
		status = "exercise"
	elif(nap_start_time and nap_end_time
		and in_interval(nap_start_time,nap_end_time,
		quarter_start,quarter_end)):
			status = "nap"
	elif(not steps 
		and user_current_local_time.date() == quarter_start.date()
		and quarter_start > user_current_local_time):
		status = "no data yet"
	else:
		status = "active" if steps >= 300 else "inactive"

	return status

def populate_quarterly_active_secs_status(mcs_data,calendar_date,
	user_current_local_time, yesterday_bedtime = None,
	today_awake_time = None, today_bedtime = None,
	ui_strength_start_time = None, ui_strength_end_time = None,
	nap_start_time = None, nap_end_time = None,
	activities_start_end_time = None,timezone_change_interval = None):
	
	mcs_data = copy.deepcopy(mcs_data)
	for interval,values in list(mcs_data.items()):
		non_interval_keys = ['active_hours','inactive_hours','sleeping_hours',
			'strength_hours','exercise_hours','total_steps','timezone_change_hours',
			'no_data_hours','nap_hours','total_active_minutes','total_active_prcnt']
		if interval not in non_interval_keys:
			am_or_pm = interval.split('to')[0].strip().split(' ')[1]
			hour = interval.split('to')[0].strip().split(' ')[0].split(':')[0]
			if am_or_pm == 'PM' and int(hour) != 12:
				hour = int(hour) + 12
			elif am_or_pm == 'AM' and int(hour) == 12:
				hour = 0
			else:
				hour = int(hour)
			interval_start = datetime.combine(calendar_date.date(),time(hour))
			current_quarter_start = interval_start
			for quarter in range(4):
				steps = values['quarterly'][str(quarter)]['steps']
				if quarter:
					current_quarter_start = current_quarter_start + timedelta(seconds = 900)
				current_quarter_end = current_quarter_start + timedelta(seconds = 899)
				status = cal_quarter_status(
					current_quarter_start,current_quarter_end,
					steps, user_current_local_time,
					yesterday_bedtime, today_awake_time,
					today_bedtime, ui_strength_start_time,
					ui_strength_end_time, nap_start_time,
					nap_end_time, activities_start_end_time,
					timezone_change_interval)
				values['quarterly'][str(quarter)]['status'] = status

	return mcs_data

def which_quarter(dt):
	'''
	Tell which quarter the given time is
	0 - 14 min : quarter 0
	15 - 29 min : quarter 1
	30 - 44 min : quarter 2
	45 - 59 min : quarter 3
	'''
	minute = dt.minute
	if minute >= 0 and minute <= 14:
		return 0
	elif minute >= 15 and minute <= 29:
		return 1
	elif minute >= 30 and minute <= 44:
		return 2
	elif minute >= 45 and minute <= 59:
		return 3

def cal_movement_consistency_summary(user,calendar_date,epochs_json,
		yesterday_bedtime,today_awake_time,combined_user_activities,
		today_bedtime=None, user_input_strength_start_time = None,
		user_input_strength_end_time = None,yesterday_epoch_data = None,
		tomorrow_epoch_data = None, nap_start_time = None, nap_end_time = None):
	
	'''
		Calculate the movement consistency summary
	'''

	def stretch_time(dt,direction):
		if direction == 'start':
			return datetime.combine(dt.date(),time(dt.hour))
		elif direction == 'end':
			return datetime.combine(dt.date(),time(dt.hour,59))
		else:
			return dt
	
	activities_start_end_time =_get_activities_start_end_time(
		combined_user_activities)

	# If user slept after midnight and again went to bed after next midnight
	# In that case we have same yesterday_bedtime and today_bedtime 
	if today_bedtime and today_awake_time and today_bedtime <= today_awake_time:
		today_bedtime = None

	movement_consistency = OrderedDict()
		
	if epochs_json:
		timezone_change_interval = check_timezone_change(
			epochs_json,yesterday_epoch_data,tomorrow_epoch_data)
		epochs_json = sorted(epochs_json, key=lambda x: int(x.get('startTimeInSeconds')))
		data_date = datetime.utcfromtimestamp(epochs_json[0].get("startTimeInSeconds") +
											  epochs_json[0].get("startTimeOffsetInSeconds"))
		data_date_midnight = datetime.combine(data_date.date(),time(0))
		next_day = data_date_midnight + timedelta(days=1)
		td_hour = timedelta(hours=1)
		while(data_date_midnight < next_day):
			end_hour = data_date_midnight + timedelta(minutes=59)
			time_interval = data_date_midnight.strftime("%I:%M %p")+" to "+end_hour.strftime("%I:%M %p")
			movement_consistency[time_interval] = {
				"steps":0,
				"status":"sleeping",
				"active_duration":{
					'duration':0,
					'unit':'minute'
				},
				"active_prcnt":0,
				"quarterly":{str(quarter):{"active_sec":0,"status":"","steps":0} 
								for quarter in range(4)}
			}
			data_date_midnight += td_hour

		for data in epochs_json:
			start_time = data.get('startTimeInSeconds')+ data.get('startTimeOffsetInSeconds')
			hour_start = datetime.utcfromtimestamp(start_time)
			time_interval = hour_start.strftime("%I:00 %p")+" to "+hour_start.strftime("%I:59 %p")
			steps_in_interval = movement_consistency[time_interval].get('steps',0)
			status = "sleeping"
			# ex 6:00 PM, not 6:32 PM
			hour_start_zero_min = stretch_time(hour_start,"start")

			if (yesterday_bedtime and
				today_awake_time and
				hour_start >= stretch_time(yesterday_bedtime,"start") and
				hour_start_zero_min <= today_awake_time):
				status = "sleeping"
			elif(yesterday_bedtime and
				hour_start >= stretch_time(yesterday_bedtime,"start") and
				today_bedtime and
				(hour_start >= stretch_time(today_bedtime,"start"))):
				status = "sleeping"
			elif(user_input_strength_start_time and user_input_strength_end_time and
				hour_start >= stretch_time(user_input_strength_start_time,"start") and
				hour_start <= stretch_time(user_input_strength_end_time,"end")):
				status = "strength"
			elif(_is_epoch_falls_in_activity_duration(activities_start_end_time, hour_start)):
				status = "exercise"
			else:
				status = "active" if data.get('steps') + steps_in_interval >= 300 else "inactive"

			intensity_level = data.get('intensity')
			active_duration_sec = get_epoch_active_time(
				activities_start_end_time,data,intensity_level)
			quarter = str(which_quarter(hour_start))

			if(movement_consistency[time_interval]["quarterly"][quarter]["active_sec"]
				+ active_duration_sec > 900):
				movement_consistency[time_interval]["quarterly"][quarter]["active_sec"] = 900
			else:
				movement_consistency[time_interval]["quarterly"][quarter]["active_sec"]\
					+= active_duration_sec

			movement_consistency[time_interval]["quarterly"][quarter]['steps'] = (
				movement_consistency[time_interval]["quarterly"][quarter]['steps']
				+ data.get("steps",0))
			movement_consistency[time_interval]['steps'] = steps_in_interval + data.get('steps')
			movement_consistency[time_interval]['status'] = status

		user_current_local_time = _get_user_current_local_time(user)
		movement_consistency = populate_quarterly_active_secs_status(
			movement_consistency,calendar_date, user_current_local_time,
			yesterday_bedtime,today_awake_time, today_bedtime,
			user_input_strength_start_time, user_input_strength_end_time,
			nap_start_time, nap_end_time, activities_start_end_time,
			timezone_change_interval)
		
		total_active_minutes = 0
		active_hours = 0
		inactive_hours = 0
		total_steps = 0
		sleeping_hours = 0
		strength_hours = 0
		exercise_hours = 0
		no_data_hours = 0
		nap_hours = 0
		timezone_change_hours = 0
		previous_hour_steps = None
		last_sleeping_hour = None
		have_steps_before_9_am  = False

		# update interval status if there any timezone change
		# Note: 'sleeping' can overide 'time zone change' status
		_update_status_to_timezone_change(
			movement_consistency,timezone_change_interval,calendar_date)

		for interval,values in list(movement_consistency.items()):
			am_or_pm = am_or_pm = interval.split('to')[0].strip().split(' ')[1]
			hour = interval.split('to')[0].strip().split(' ')[0].split(':')[0]
			if am_or_pm == 'PM' and int(hour) != 12:
				hour = int(hour) + 12
			elif am_or_pm == 'AM' and int(hour) == 12:
				hour = 0
			else:
				hour = int(hour)
				
			hour_start = datetime.combine(calendar_date.date(),time(hour))
			if (yesterday_bedtime and
				hour_start < stretch_time(yesterday_bedtime,"start")):
				# if user slept after midnight say 01:30 AM and there are no steps then interval
				# 12:00 - 12:59 should be marked as "inactive" instead of "sleeping" 
				if(movement_consistency[interval]['status'] == 'sleeping' and  
					not movement_consistency[interval]['steps']):
					movement_consistency[interval]['status'] = 'inactive'
					movement_consistency[interval]['steps'] = 0

			elif today_awake_time and hour_start >= today_awake_time:
				if (not movement_consistency[interval]['steps'] 
					and user_current_local_time.date() == hour_start.date()
					and hour_start > user_current_local_time):
					movement_consistency[interval]['status'] = 'no data yet'
					movement_consistency[interval]['steps'] = 0
				elif (not movement_consistency[interval]['steps'] 
						and not movement_consistency[interval]['status'] == 'time zone change'):
						movement_consistency[interval]['status'] = 'inactive'
						movement_consistency[interval]['steps'] = 0
						
				if today_bedtime and hour_start >= stretch_time(today_bedtime,"start"):
					# if interval is beyond the today's bedtime then it will be marked as "sleeping"
					movement_consistency[interval]['status'] = 'sleeping'
					
				elif(user_input_strength_end_time and user_input_strength_start_time
					and hour_start >= stretch_time(user_input_strength_start_time,"start") 
					and hour_start <= stretch_time(user_input_strength_end_time,"end")):
						movement_consistency[interval]['status'] = 'strength'
				elif(nap_start_time and nap_start_time
					and hour_start >= stretch_time(nap_start_time,"start") 
					and hour_start <= stretch_time(nap_end_time,"end")):
						movement_consistency[interval]['status'] = 'nap'
				elif(_is_epoch_falls_in_activity_duration(activities_start_end_time,hour_start)):
					movement_consistency[interval]['status'] = 'exercise'

			elif(not yesterday_bedtime and not today_awake_time):
				nine_am = datetime.combine(calendar_date.date(),time(9))
				if (movement_consistency[interval]['steps'] and hour_start < nine_am):
					if not have_steps_before_9_am:
						have_steps_before_9_am = True

				if (movement_consistency[interval]['status'] == "sleeping"
				 	and not movement_consistency[interval]['steps']
				 	and user_current_local_time.date() == hour_start.date()
					and hour_start > user_current_local_time):
					movement_consistency[interval]['status'] = 'no data yet'
				elif (movement_consistency[interval]['status'] == "sleeping" and
					not movement_consistency[interval]['steps']):
					movement_consistency[interval]['status'] = 'inactive'

				if previous_hour_steps is None:
					previous_hour_steps = movement_consistency[interval]['steps']
				else:
					diff_steps = abs(
						movement_consistency[interval]['steps'] - 
						previous_hour_steps
					)
					if diff_steps >= 150 and not last_sleeping_hour:
						last_sleeping_hour = hour_start - timedelta(hours=1)
					previous_hour_steps = movement_consistency[interval]['steps']

			active_minutes = 0
			for quarter in movement_consistency[interval]['quarterly'].values():
				active_minutes += quarter['active_sec']
			active_minutes = round(active_minutes/60)

			# Total active minute in the hourly interval is capped to 60 mins
			active_minutes  = 60 if active_minutes > 60 else active_minutes
			active_minute_prcnt = round((active_minutes/60) * 100)
			movement_consistency[interval]['active_duration']['duration'] = (
				active_minutes)
			movement_consistency[interval]['active_prcnt'] = active_minute_prcnt

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
			total_active_minutes += active_minutes

		movement_consistency['total_active_minutes'] = total_active_minutes
		movement_consistency['total_active_prcnt'] = round(
			(total_active_minutes / 1440)*100)
		movement_consistency['active_hours'] = active_hours
		movement_consistency['inactive_hours'] = inactive_hours
		movement_consistency['sleeping_hours'] = sleeping_hours
		movement_consistency['strength_hours'] = strength_hours
		movement_consistency['exercise_hours'] = exercise_hours
		movement_consistency['nap_hours'] = nap_hours
		movement_consistency['no_data_hours'] = no_data_hours
		movement_consistency['timezone_change_hours'] = timezone_change_hours
		movement_consistency['total_steps'] = total_steps

		if(not yesterday_bedtime and not today_awake_time and have_steps_before_9_am):
			_update_status_to_sleep_hours(
				movement_consistency,
				last_sleeping_hour,
				calendar_date
			)
			
		return movement_consistency

def cal_exercise_steps_total_steps(total_daily_steps,combined_user_activities,age):
	'''
		Calculate exercise steps and total steps
	'''	
	IGNORE_ACTIVITY = ["HEART_RATE_RECOVERY"]

	garmin_total_steps = 0
	garmin_non_activity_steps = 0
	garmin_exec_steps = 0
	garmin_non_exec_steps = 0
	manual_exec_steps = 0
	manual_non_exec_steps = 0

	if len(combined_user_activities):
		for obj in combined_user_activities:
			steps = obj.get("steps",0)
			if not steps:
				# In case of user created manual activity, if user does not submit steps data
				# then by default it would be empty string. In that case, default it to 0
				steps = 0

			if(obj.get('activityType') not in IGNORE_ACTIVITY
				and obj.get("steps_type","") == "exercise"):
				if obj.get('created_manually',False):
					manual_exec_steps += steps
				else:
					garmin_exec_steps += steps
			else:
				if obj.get('created_manually',False):
					manual_non_exec_steps += steps
				else:
					garmin_non_exec_steps += steps

	
	garmin_total_steps = total_daily_steps

	if (garmin_total_steps 
		and garmin_total_steps >= (garmin_exec_steps+garmin_non_exec_steps)):
		garmin_non_activity_steps = (garmin_total_steps 
			- garmin_exec_steps 
			- garmin_non_exec_steps)
	
	total_exercise_steps = garmin_exec_steps + manual_exec_steps
	total_non_exec_steps = (garmin_non_exec_steps 
		+ manual_non_exec_steps 
		+ garmin_non_activity_steps)

	total_steps = total_exercise_steps + total_non_exec_steps

	return (total_exercise_steps,total_non_exec_steps,total_steps)

def _get_sleep_grade_from_point(point):
	if point < 1:
		return 'F'
	elif point >= 1 and point < 2:
		return 'D'
	elif point >= 2 and point < 3:
		return 'C'
	elif point >= 3 and point < 4:
		return 'B'
	else:
		return 'A'

def _to_sec(duration):
	'''
	Convert hour:minute string to seconds
	
	Args:
		duration(string): String duration in format hh:mm eg 06:30

	Example:
		>>> _to_sec("05:30")
		19800
	'''
	hours,mins = map(int,[0 if x == '' else x 
				for x in duration.split(':')])
	return hours * 3600 + mins * 60

def sleep_point_for_kids(sleep_duration):
	'''
	Calculate the sleep point for kids. Person below age of 18
	is considered as kid for this calculation.

	Args:
		sleep_duration(string): Sleep duration as a hh:mm string

	Return:
		int: sleep point between [0,4]
	'''
	_sec_min = lambda x: divmod(x,60)[0] #second to minute

	sleep_duration = _to_sec(sleep_duration)
	points = 0

	if sleep_duration < _to_sec("6:30") or sleep_duration > _to_sec("14:00"):
		if sleep_duration > _to_sec("14:00"):
			points = 0
		else: 
			points = round(_sec_min((sleep_duration - 0)) * 0.00256 + 0, 5)

	elif sleep_duration >= _to_sec("8:00") and sleep_duration <= _to_sec("12:00"):
	   points = 4

	elif ((sleep_duration >= _to_sec("7:30") and sleep_duration <= _to_sec("7:59")) or \
		(sleep_duration >= _to_sec("12:01") and sleep_duration <= _to_sec("12:30"))) :

		if (sleep_duration >= _to_sec("7:30") and sleep_duration <= _to_sec("7:59")):
			points = round(_sec_min(sleep_duration - _to_sec("7:30")) * 0.03333 + 3, 5)
		elif(sleep_duration == _to_sec("12:30")):
			points = round(1 - (_sec_min(sleep_duration - _to_sec("12:30")) * 0.03333) + 2,5)
		else:
			points = round(0.96667 - (_sec_min(sleep_duration - _to_sec("12:01")) * 0.03333) + 3,5)

	elif ((sleep_duration >= _to_sec("7:00") and sleep_duration <= _to_sec("7:29")) or \
		(sleep_duration >= _to_sec("12:31") and sleep_duration <= _to_sec("13:00"))) :

		if(sleep_duration >= _to_sec("7:00") and sleep_duration <= _to_sec("7:29")):
			points = round(_sec_min(sleep_duration - _to_sec("7:00")) * 0.03333 + 2, 5)
		elif(sleep_duration == _to_sec("13:00")):
			points = round(1 - (_sec_min(sleep_duration - _to_sec("13:00")) * 0.01667) + 1,5)
		else:
			points = round(1 - (_sec_min(sleep_duration - _to_sec("12:30")) * 0.03333) + 2,5)

	elif ((sleep_duration >= _to_sec("6:30") and sleep_duration <= _to_sec("6:59")) or \
		(sleep_duration >= _to_sec("13:01") and sleep_duration <= _to_sec("14:00"))) :

		if(sleep_duration >= _to_sec("6:30") and sleep_duration <= _to_sec("6:59")):
	   		points = round(_sec_min(sleep_duration - _to_sec("6:30")) * 0.03333 + 1, 5)
		else:
			points = round(1 - (_sec_min(sleep_duration - _to_sec("13:00")) * 0.01667) + 1,5)
	
	return points

def sleep_point_for_adults(sleep_duration):
	'''
	Calculate the sleep point for adults. Person of age 18 or above
	is considered as adult for this calculation.

	Args:
		sleep_duration(string): Sleep duration as a hh:mm string

	Return:
		int: sleep point between [0,4]
	'''
	_sec_min = lambda x: divmod(x,60)[0]

	sleep_duration = _to_sec(sleep_duration)
	points = 0

	if sleep_duration < _to_sec("6:00") or sleep_duration > _to_sec("13:00"):
		if sleep_duration > _to_sec("13:00"):
			points = 0
		else: 
			points = round(_sec_min((sleep_duration - 0)) * 0.00278 + 0, 5)

	elif sleep_duration >= _to_sec("7:30") and sleep_duration <= _to_sec("10:00"):
	   points = 4

	elif ((sleep_duration >= _to_sec("7:00") and sleep_duration <= _to_sec("7:29")) or \
		(sleep_duration >= _to_sec("10:01") and sleep_duration <= _to_sec("10:30"))) :

		if (sleep_duration >= _to_sec("7:00") and sleep_duration <= _to_sec("7:29")):
			points = round(_sec_min(sleep_duration - _to_sec("7:00")) * 0.03333 + 3, 5)
		elif(sleep_duration == _to_sec("10:30")):
			points = round(1 - (_sec_min(sleep_duration - _to_sec("10:30")) * 0.03333) + 2,5)
		else:
			points = round(0.96667 - (_sec_min(sleep_duration - _to_sec("10:01")) * 0.03333) + 3,5)

	elif ((sleep_duration >= _to_sec("6:30") and sleep_duration <= _to_sec("6:59")) or \
		(sleep_duration >= _to_sec("10:31") and sleep_duration <= _to_sec("11:00"))) :

		if(sleep_duration >= _to_sec("6:30") and sleep_duration <= _to_sec("6:59")):
			points = round(_sec_min(sleep_duration - _to_sec("6:30")) * 0.03333 + 2, 5)
		elif(sleep_duration == _to_sec("11:00")):
			points = round(1 - (_sec_min(sleep_duration - _to_sec("11:00")) * 0.01639) + 1,5)
		else:
			points = round(1 - (_sec_min(sleep_duration - _to_sec("10:30")) * 0.03333) + 2,5)

	elif ((sleep_duration >= _to_sec("6:00") and sleep_duration <= _to_sec("6:29")) or \
		(sleep_duration >= _to_sec("11:01") and sleep_duration <= _to_sec("12:00"))) :

		if(sleep_duration >= _to_sec("6:00") and sleep_duration <= _to_sec("6:29")):
	   		points = round(_sec_min(sleep_duration - _to_sec("6:00")) * 0.03333 + 1, 5)
		else:
			points = round(1 - (_sec_min(sleep_duration - _to_sec("11:00")) * 0.01639) + 1,5)

	elif sleep_duration >= _to_sec("12:01") and sleep_duration <= _to_sec("13:00"):
		points = round(1 - (_sec_min(sleep_duration - _to_sec("12:00")) * 0.01639),5)
	
	return points

def cal_average_sleep_grade(sleep_duration,age,sleep_aid_taken=None):
	'''
	Calculate average sleep grade 

	Args:
		sleep_duration(string): Sleep duration as a hh:mm string
		age(int): age of person
		sleep_aid_taken(string, optional): Whether person have taken any sleep aid.
			Possible answers are "yes", "no" or empty string. Default to None
	Returns:
		tuple(str,int): A Tuple having grade for points as first value and original points
			as second value. Example ('A',4)
	'''
	points = 0
	if age >= 18:
		points = sleep_point_for_adults(sleep_duration)
	else:
		points = sleep_point_for_kids(sleep_duration)

	if sleep_aid_taken == "yes":
		if points >= 1.5:
			points -= 1.5
		else:
			points = 0

	return (_get_sleep_grade_from_point(points),points)
 
def cal_unprocessed_food_grade(prcnt_food):
	def _point_advantage(current_prcnt, range_min_prcnt, per_prcnt_pt):
		return (current_prcnt - range_min_prcnt) * per_prcnt_pt

	point = 0
	grade = 'F'
	prcnt_food = int(Decimal(prcnt_food).quantize(0,ROUND_HALF_DOWN))
	
	if (prcnt_food >= 80):
		grade = 'A'
		point = 4
	elif (prcnt_food >= 70 and prcnt_food < 80):
		grade = 'B'
		point = 3 + _point_advantage(prcnt_food,70,0.1)
	elif (prcnt_food >= 60 and prcnt_food < 70):
		grade = 'C'
		point = 2 + _point_advantage(prcnt_food,60,0.1)
	elif (prcnt_food >= 50 and prcnt_food < 60):
		grade = 'D'
		point = 1 + _point_advantage(prcnt_food,50,0.1)
	elif (prcnt_food < 50):
		grade = 'F'
		point = 0 + _point_advantage(prcnt_food,0,0.02)
	return (grade,point)

def cal_alcohol_drink_grade(drink_avg, gender):
	'''
	Calculate Average alcohol dring a week and grade
	return tuple (grade,average drink,point)
	'''
	def item_in_range(max_avg,current_avg):
		max_avg = round(max_avg,1)
		current_avg = round(current_avg,1)
		dec_current_avg = int((round(current_avg - int(current_avg),1))*10)
		dec_max_avg = 9 - int((round(max_avg - int(max_avg),1))*10)
		x = (int(max_avg) - int(current_avg))+ 1
		return x*10 - dec_current_avg - dec_max_avg

	grade = 'F'
	point = 0
	if gender == 'M':
		if (drink_avg <= 5):
			grade = 'A'
			point = 4
		elif (drink_avg > 5 and drink_avg < 12):
			point = 3 + (item_in_range(11.90,drink_avg) - 1) * 0.01449
			grade = 'B'
		elif (drink_avg >= 12 and drink_avg < 15):
			point = 2 + (item_in_range(14.90,drink_avg) - 1) * 0.03333
			grade = 'C'
		elif (drink_avg >= 15 and drink_avg < 16):
			point = 1 + (item_in_range(15.90,drink_avg) - 1) * 0.1
			grade = 'D'
		elif (drink_avg >= 16 and drink_avg <= 21):
			point = 0 + item_in_range(21.00,drink_avg) * 0.01923
			grade = 'F'
		elif drink_avg > 21:
			point = 0
			grade = 'F'

	else:
		if (drink_avg <= 3):
			point = 4
			grade = 'A'
		elif (drink_avg > 3 and drink_avg <= 5):
			point = 3 + (item_in_range(5.00,drink_avg) - 1) * 0.05
			grade = 'B'
		elif (drink_avg > 5 and drink_avg <= 7):
			point = 2 + (item_in_range(7.00,drink_avg) - 1) * 0.05
			grade = 'C'
		elif (drink_avg > 7 and drink_avg <= 9):
			point = 1 + (item_in_range(9.00,drink_avg) - 1) * 0.05
			grade = 'D'
		elif (drink_avg > 9 and drink_avg <= 14):
			point = 0 + item_in_range(14.00,drink_avg) * 0.01961
			grade = 'F'
		elif drink_avg > 14:
			point = 0
			grade = 'F'

	return (grade,round(drink_avg,2),round(point,2))

def cal_non_exercise_step_grade(steps):

	def _point_advantage(current_steps, range_min_steps, per_step_pt):
		return (current_steps - range_min_steps) * per_step_pt

	point = 0
	grade = 'F'
	if steps >= 10000:
		grade = 'A'
		point = 4
	elif (steps <= 9999 and steps >= 7500):
		grade = 'B'
		point = 3 + _point_advantage(steps,7500,0.0004)
	elif (steps <= 7499 and steps >= 5000):
		grade = 'C'
		point = 2 + _point_advantage(steps,5000,0.0004)
	elif (steps <= 4999 and steps >= 3500):
		grade = 'D'
		point = 1 + _point_advantage(steps,3500,0.00067)
	elif steps < 3500:
		grade = 'F'
		point = 0 + _point_advantage(steps,0,0.00029)
	return (grade, round(point,2))

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

def cal_exercise_consistency_grade(avg_point_week):
	grade = 'F'
	if avg_point_week >= 4:
		grade = 'A'
	elif avg_point_week >= 3 and avg_point_week < 4:
		grade =  'B'
	elif avg_point_week >= 2 and avg_point_week < 3:
		grade =  'C'
	elif avg_point_week >= 1 and avg_point_week < 2:
		grade =  'D'
	elif avg_point_week < 1:
		grade = 'F'
	return (grade, avg_point_week) 
	
def cal_overall_workout_grade(gpa):
	'''
		Return tuple (overall grade, overall health gpa)
	'''
	if gpa >= 3.4:
		grade = 'A'
	elif gpa >= 3 and gpa < 3.4:
		grade = 'B'
	elif gpa >= 2.5 and gpa < 3:
		grade = 'C'
	elif gpa >= 2 and gpa < 2.5:
		grade = 'D'
	elif gpa < 2:
		grade = 'F'

	return(grade, gpa)

def cal_overall_grade(gpa):
	'''
		Return tuple (overall grade, overall health gpa)
	'''
	if gpa >= 3.4:
		grade = 'A'
	elif gpa >= 3 and gpa < 3.4:
		grade = 'B'
	elif gpa >= 2 and gpa < 3:
		grade = 'C'
	elif gpa >= 1 and gpa < 2:
		grade = 'D'
	elif gpa < 1:
		grade = 'F'

	return(grade, gpa)

def cal_penalty(is_smoke,is_ctrl_subs,is_sleep_aid):
	smoke_penalty = -3.1 if is_smoke == 'yes' else 0
	ctrl_subs_penalty = -3.1 if is_ctrl_subs == 'yes' else 0
	sleep_aid_penalty = -1.5 if is_sleep_aid == 'yes' else 0
	penalties = {
		"smoke_penalty":smoke_penalty,
		"ctrl_subs_penalty":ctrl_subs_penalty,
		"sleep_aid_penalty": sleep_aid_penalty
	}
	return penalties

def cal_workout_duration_grade(duration_in_min):
	if duration_in_min >= 60:
		grade = 'A'
		point = 4
	elif duration_in_min  >=30 and duration_in_min <= 59:
		grade = 'B'
		point = 3
	elif duration_in_min >= 15 and duration_in_min <= 29:
		grade = 'C'
		point = 2
	elif duration_in_min >= 1 and duration_in_min <= 14:
		grade = 'D'
		point = 1
	elif duration_in_min < 1:
		grade = 'F'
		point = 0

	return (grade, point)

def cal_workout_effort_level_grade(workout_easy_hard, effort_level):
	grade = 'F'
	point  = 0
	if workout_easy_hard and effort_level:
		if workout_easy_hard == 'easy':
			if effort_level >= 1 and effort_level <= 4:
				grade = 'A'
				point = 4
			elif effort_level == 5:
				grade = 'B'
				point = 3
			elif effort_level >= 6 and effort_level <= 7:
				grade = 'C'
				point = 2
			elif effort_level == 8:
				grade = 'D'
				point = 1
			elif effort_level >= 9 and effort_level <= 10:
				grade = 'F'
				point = 0

		elif workout_easy_hard == 'medium':
			if effort_level in [5,6]:
				grade = 'A'
				point = 4
			elif effort_level in [3,4,7]:
				grade = 'B'
				point = 3
			elif effort_level in [2,8]:
				grade = 'C'
				point = 2
			elif effort_level in [1,9]:
				grade = 'D'
				point = 1
			elif effort_level == 10:
				grade = 'F'
				point = 0

		elif workout_easy_hard == 'hard':
			if effort_level >= 1 and effort_level <= 3:
				grade = 'F'
				point = 0
			elif effort_level >= 4 and effort_level <= 5:
				grade = 'D'
				point = 1
			elif effort_level == 6:
				grade = 'C'
				point = 2
			elif effort_level == 7:
				grade = 'B'
				point = 3
			elif effort_level >= 8 and effort_level <= 10:
				grade = 'A'
				point = 4

	return (grade, point)

def cal_avg_exercise_heartrate_grade(avg_heartrate,workout_easy_hard,age):
	prange = _get_avg_hr_points_range(age, workout_easy_hard)
	if prange and avg_heartrate:
		grade,point = 'F',0
		if avg_heartrate >= prange[4].min and avg_heartrate <= prange[4].max:
			grade = 'A'
			point = 4
		elif avg_heartrate >= prange[3].min and avg_heartrate <= prange[3].max:
			grade = 'B'
			point = 3
		elif avg_heartrate >= prange[2].min and avg_heartrate <= prange[2].max:
			grade = 'C'
			point = 2
		elif avg_heartrate >= prange[1].min and avg_heartrate <= prange[1].max:
			grade = 'D'
			point = 1
		elif avg_heartrate <= prange[0].min or avg_heartrate >= prange[0].max:
			grade = 'F'
			point = 0
		return (grade, point, avg_heartrate)
	return (None, None, avg_heartrate)

def get_avg_sleep_grade(sleep_calendar_date,yesterday_sleep_data,today_sleep_data,
	user_input_bedtime, user_input_awake_time,user_input_sleep_duration,
	user_input_timezone,sleep_aid,age):

	sleep_stats = get_sleep_stats(sleep_calendar_date,yesterday_sleep_data,
		today_sleep_data,user_input_bedtime,user_input_awake_time, user_input_timezone)
	sleep_per_wearable = sleep_stats['sleep_per_wearable']

	if user_input_sleep_duration and user_input_sleep_duration != ":":
		grade_point = cal_average_sleep_grade(user_input_sleep_duration,age,sleep_aid)
		return grade_point
	elif sleep_per_wearable:
		grade_point = cal_average_sleep_grade(sleep_per_wearable,age,sleep_aid)
		return grade_point
	return (None,None)

def get_unprocessed_food_grade(daily_strong,current_date):
	for q in daily_strong:
		if (q.user_input.created_at == current_date.date() and
			q.prcnt_unprocessed_food_consumed_yesterday != '' and
			q.prcnt_unprocessed_food_consumed_yesterday != None):
			grade_pt = cal_unprocessed_food_grade(
					q.prcnt_unprocessed_food_consumed_yesterday)
			return grade_pt
	return (None,None)

def get_alcohol_grade_avg_alcohol_week(daily_strong,user):
	alcoholic_drink_last_week = [q.number_of_alcohol_consumed_yesterday
		if not q.number_of_alcohol_consumed_yesterday in [None,''] else 0
		for q in daily_strong]

	alcoholic_drink_last_week = ['21' if x == '20+' else x
								for x in alcoholic_drink_last_week]
	period = 7
	drink_avg = (sum(map(float,alcoholic_drink_last_week))/period)*7

	alcohol_stats = cal_alcohol_drink_grade(drink_avg,user.profile.gender)
	return alcohol_stats

def get_exercise_consistency_grade(workout_over_period,weekly_activity,period,age):
	points = 0
	for (strong_obj,activity_list) in zip(
			workout_over_period.values(),weekly_activity.values()):
		have_no_workout = not strong_obj or (strong_obj and strong_obj.workout != "yes")
		# have_activities = activity_list or (
		# 	strong_obj and strong_obj.activities and json.loads(strong_obj.activities)
		# )
		have_activities = do_user_has_exercise_activity(activity_list,age)	
		if strong_obj and (strong_obj.workout == 'yes'):
			points += 1
		elif(have_no_workout and have_activities):
			points += 1
	avg_point_week = points / (period/7)
	grade_point = cal_exercise_consistency_grade(avg_point_week)
	return grade_point 

def get_workout_duration_grade(total_duration):
	'''
		Returns a tuple having grade and point (grade, point)
	'''
	return cal_workout_duration_grade(total_duration//60)

def get_workout_effort_grade(todays_daily_strong):
	'''
		Returns a tuple having grade and point (grade, point)
	'''
	workout_easy_hard = safe_get(todays_daily_strong,'work_out_easy_or_hard','')
	workout_effort_level = safe_get(todays_daily_strong,'workout_effort_level',-1)
	if workout_effort_level == -1:
		workout_effort_level = ''
	return cal_workout_effort_level_grade(workout_easy_hard, workout_effort_level)

def get_average_exercise_heartrate_grade(combined_user_activities,
		todays_daily_strong, age):
	
	total_duration = 0
	IGNORE_ACTIVITY = ['STRENGTH_TRAINING','OTHER','HEART_RATE_RECOVERY']
	final_activities = []
	# If same summary is edited manually then give it more preference.
	
	for i,act in enumerate(combined_user_activities):

		if not act.get('averageHeartRateInBeatsPerMinute',None):
			pass
		elif 'swimming' in act.get('activityType','').lower():
			pass
		elif act.get('activityType','') in IGNORE_ACTIVITY:
			pass
		elif act.get('durationInSeconds',0) < 600: #less than 10 min (600 seconds)
			pass
		else:
			final_activities.append(act)
			total_duration += act.get('durationInSeconds',0)

	if final_activities:
		avg_hr = 0
		for act in final_activities:
			avg_hr += (act.get('durationInSeconds',0) / total_duration) *\
					   act.get('averageHeartRateInBeatsPerMinute',0)
		avg_hr = round(avg_hr)
		workout_easy_hard = safe_get(todays_daily_strong,'work_out_easy_or_hard','')
		return cal_avg_exercise_heartrate_grade(avg_hr,workout_easy_hard,age)
	else:
		return (None, None, None)

def get_overall_workout_grade(wout_duration_pt, wout_effortlvl_pt, avg_exercise_hr_pt):
	if avg_exercise_hr_pt:
		workout_avg_point = round(
			(wout_duration_pt + wout_effortlvl_pt + avg_exercise_hr_pt)/3, 2)
	else:
		workout_avg_point = round(
			(wout_duration_pt + wout_effortlvl_pt)/2, 2)

	grade_pt = cal_overall_workout_grade(workout_avg_point)
	return grade_pt

def get_overall_grade(grades):
	GRADES = {'A':4,'B':3,'C':2,'D':1,'F':0,'':0,'N/A':0}
	non_exercise_step_gpa = grades.get('movement_non_exercise_steps_gpa')
	movement_consistency_grade = grades.get('movement_consistency_grade')
	avg_sleep_per_night_gpa = grades.get('avg_sleep_per_night_gpa')
	exercise_consistency_grade = grades.get('exercise_consistency_grade')
	prcnt_unprocessed_food_gpa = grades.get('prcnt_unprocessed_food_consumed_gpa')
	alcoholic_drink_per_week_gpa = grades.get('alcoholic_drink_per_week_gpa')
	
	if avg_sleep_per_night_gpa:
		penalty = grades.get('ctrl_subs_penalty')+grades.get('smoke_penalty')
	else:
		penalty = (grades.get('ctrl_subs_penalty')+
			grades.get('smoke_penalty')+
			grades.get('sleep_aid_penalty'))

	gpa = round((non_exercise_step_gpa +
		   GRADES[movement_consistency_grade]+
		   avg_sleep_per_night_gpa +
		   GRADES[exercise_consistency_grade]+
		   prcnt_unprocessed_food_gpa+
		   alcoholic_drink_per_week_gpa+
		   penalty) / 6,2)
	return cal_overall_grade(gpa)

def get_weather_data(todays_daily_strong,todays_date_epoch,
	activity_stat):
	manual_weather = False
	if(safe_get(todays_daily_strong,'indoor_temperature','') or
	   safe_get(todays_daily_strong,'outdoor_temperature','') or
	   safe_get(todays_daily_strong,'dewpoint','') or
	   safe_get(todays_daily_strong,'humidity','') or
	   safe_get(todays_daily_strong,'apparent_temperature','') or
	   safe_get(todays_daily_strong,'wind_speed','')):
		manual_weather = True

	temperature = safe_get(todays_daily_strong,'outdoor_temperature',None)
	dewPoint = safe_get(todays_daily_strong,'dewpoint',None)
	humidity = safe_get(todays_daily_strong,'humidity',None)
	apparentTemperature = safe_get(todays_daily_strong,'temperature_feels_like',None)
	windSpeed = safe_get(todays_daily_strong,'wind',None)

	if manual_weather:
		DATA = {
			"temperature":float(temperature) if temperature else None,
			"dewPoint":float(dewPoint) if dewPoint else None,
			"humidity":float(humidity) if humidity else None,
			"apparentTemperature":float(apparentTemperature) if apparentTemperature else None,
			"windSpeed":float(windSpeed) if windSpeed else None
		}
		return DATA
	else:
		latitude = activity_stat['latitude']
		longitude = activity_stat['longitude']
		if latitude and longitude:
			DATA = extract_weather_data(fetch_weather_data(latitude,longitude,todays_date_epoch))
			return DATA
		else:
			DATA = {
				"temperature":None,
				"dewPoint":None,
				"humidity":None,
				"apparentTemperature":None,
				"windSpeed":None
			}
			return DATA

def did_workout_today(have_activities,user_did_workout):
	if user_did_workout:
		if have_activities and user_did_workout != 'yes':
			return "yes"
		return user_did_workout
	elif have_activities:
		return "yes"
	else:
		return ""

def get_user_input_total_sleep(todays_daily_strong,daily_optional):
	'''
	Calculate total sleep duration as per user input. This includes
	duration of Sleep last night and any nap user took.
	'''
	sleep_duration = safe_get(
		todays_daily_strong,"sleep_time_excluding_awake_time","00:00")
	sleep_duration = _str_to_hours_min_sec(
		sleep_duration,time_format='seconds',time_pattern="hh:mm")
	nap_duration = safe_get(
		daily_optional,"nap_duration","00:00")
	nap_duration = _str_to_hours_min_sec(
		nap_duration,time_format='seconds',time_pattern="hh:mm")
	total_duration_in_seconds = sleep_duration + nap_duration
	
	if total_duration_in_seconds:
		return sec_to_hours_min_sec(total_duration_in_seconds,include_sec = False)
	return None

def get_weight(bodycmp_data,daily_optional):
	weight = {}
	weight_userinput = safe_get(daily_optional,"weight","")
	if weight_userinput:
		weight["value"] = weight_userinput
		if weight_userinput == "i do not weigh myself today":
			weight["unit"] = None
		else:
			weight["unit"] = "pound"
		return json.dumps(weight)
	elif bodycmp_data and not weight_userinput:
		weight_val = safe_get_dict(bodycmp_data,"weightInGrams",None)
		weight['value'] = weight_val
		if weight_val:
			weight['unit'] = 'gram'
		else:
			weight['unit'] = None
		return json.dumps(weight)

	return json.dumps(weight)

def get_weekly_combined_activities(weekly_activities,
	weekly_manully_edited_activities, weekly_user_input_activities,
	week_start_date, week_end_date,user_age):
	weekly_combined_activities = OrderedDict()
	current_date = week_start_date
	while(current_date <= week_end_date):
		current_date_str = current_date.strftime('%Y-%m-%d')
		weekly_combined_activities[current_date_str] = None
		userinput_activities = weekly_user_input_activities[current_date_str]
		if not userinput_activities:
			userinput_activities = None
		
		activities = weekly_activities.get(current_date_str,[])
		manually_edited_activities = (
			weekly_manully_edited_activities.get(current_date_str))

		if manually_edited_activities:
			manually_edited_activities = {act['summaryId']:act
				for act in manually_edited_activities}
		else:
			manually_edited_activities = {}

		combined_user_activities = get_filtered_activity_stats(
			activities,user_age,manually_edited_activities,
			userinput_activities)

		if combined_user_activities:
			weekly_combined_activities[current_date_str] = (
				combined_user_activities)
		current_date += timedelta(days=1)

	return weekly_combined_activities



def create_garmin_quick_look(user,from_date=None,to_date=None):
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
	user_age = user.profile.age()
	while current_date <= to_dt:
		last_seven_days_date = current_date - timedelta(days=6)
		start_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())
		end_epoch = start_epoch + 86400

		# epoch data for yesterday, today and tomorrow
		epochs = get_garmin_model_data(
			UserGarminDataEpoch,user,
			start_epoch-86400,end_epoch+86400,
			order_by ='-id',filter_dup = True)

		epochs = get_weekly_data(
			epochs,current_date+timedelta(days=1),current_date-timedelta(days=1))

		# Get sleep data for yesterday
		sleeps = get_garmin_model_data(UserGarminDataSleep,
									   user,start_epoch-86400,end_epoch-86400,
									   order_by = '-id')
		sleeps_today = get_garmin_model_data(UserGarminDataSleep,
											user, start_epoch,end_epoch,order_by = '-id')
 
		dailies = get_garmin_model_data(UserGarminDataDaily,user,
										start_epoch,end_epoch,
										order_by = '-start_time_duration_in_seconds')
		stress = get_garmin_model_data(UserGarminDataStressDetails,user,start_epoch,end_epoch)

		# pull data for past 7 days (including today)
		manually_updated = get_garmin_model_data(UserGarminDataManuallyUpdated,user,
			last_seven_days_date.replace(tzinfo=timezone.utc).timestamp(),end_epoch,
			order_by = '-id', filter_dup = True)

		# Already parsed from json to python objects
		weekly_manual_activities = get_weekly_data(manually_updated,current_date,last_seven_days_date)
		todays_manually_updated = weekly_manual_activities.get(current_date.strftime('%Y-%m-%d'))

		# pull data for past 7 days (incuding today)
		activities = get_garmin_model_data(UserGarminDataActivity,user,
			last_seven_days_date.replace(tzinfo=timezone.utc).timestamp(),end_epoch,
			order_by = '-id', filter_dup = True)

		# Already parsed from json to python objects
		weekly_activities = get_weekly_data(activities,current_date,last_seven_days_date)
		todays_activities = weekly_activities.get(current_date.strftime('%Y-%m-%d'))

		user_metrics = [q.data for q in UserGarminDataMetrics.objects.filter(
				user = user,calendar_date = current_date.date()).order_by('-id')]

		# pull data for past 7 days (incuding today)
		daily_strong = list(DailyUserInputStrong.objects.filter(
			Q(user_input__created_at__gte = last_seven_days_date)&
			Q(user_input__created_at__lte = current_date),
			user_input__user = user).order_by('user_input__created_at'))

		#dict of weekly strong data
		weekly_daily_strong = get_weekly_user_input_data(
			daily_strong,current_date,last_seven_days_date)

		weekly_user_input_activities = get_daily_activities_in_base_format(
			user,last_seven_days_date.date(),
			to_date = current_date.date(),
			include_all = True)

		weekly_combined_activities = get_weekly_combined_activities(
			weekly_activities,weekly_manual_activities,
			weekly_user_input_activities,last_seven_days_date,
			current_date,user_age)

		try:
			tomorrow_date = current_date + timedelta(days=1)
			user_inputs_qs = UserDailyInput.objects.select_related(
				'strong_input','encouraged_input','optional_input').filter(
				created_at__range = (current_date,tomorrow_date),user=user)
			user_inputs = {q.created_at.strftime("%Y-%m-%d"):q for q in user_inputs_qs}
			todays_user_input = user_inputs.get(current_date.strftime("%Y-%m-%d"))
			tomorrows_user_input = user_inputs.get(tomorrow_date.strftime("%Y-%m-%d"))
		except UserDailyInput.DoesNotExist:
			todays_user_input = None
			tomorrows_user_input = None

		todays_daily_strong = []
		for i,q in enumerate(daily_strong):
			if q.user_input.created_at == current_date.date():
				todays_daily_strong.append(daily_strong[i])
				break
		
		# userinput_activities = safe_get(todays_daily_strong,'activities',None)
		# if userinput_activities:
		# 	userinput_activities = json.loads(userinput_activities)
		userinput_activities = weekly_user_input_activities[current_date.strftime('%Y-%m-%d')]

		bodycmp = get_garmin_model_data(
			UserGarminDataBodyComposition,user,
			start_epoch,end_epoch,order_by = '-id')

		daily_encouraged = [todays_user_input.encouraged_input if todays_user_input else None]

		daily_optional = [todays_user_input.optional_input if todays_user_input else None]

		dailies_json = [ast.literal_eval(dic) for dic in dailies]

		todays_activities_json = todays_activities
		
		todays_manually_updated_json = {}
		for dic in todays_manually_updated:
			todays_manually_updated_json[dic.get('summaryId')] = dic

		# todays_manually_updated_json.update(userinput_activities)
		
		epochs_json = epochs[current_date.strftime("%Y-%m-%d")]
		yesterday_epoch = epochs[(current_date-timedelta(days=1)).strftime("%Y-%m-%d")]
		tomorrow_epoch = epochs[(current_date+timedelta(days=1)).strftime("%Y-%m-%d")]
		sleeps_json = [ast.literal_eval(dic) for dic in sleeps]
		sleeps_today_json = [ast.literal_eval(dic) for dic in sleeps_today]
		user_metrics_json = [ast.literal_eval(dic) for dic in user_metrics]
		stress_json = [ast.literal_eval(dic) for dic in stress]
		bodycmp_json = [ast.literal_eval(dic) for dic in bodycmp]

		grades_calculated_data = get_blank_model_fields('grade')
		exercise_calculated_data = get_blank_model_fields('exercise')
		swim_calculated_data = get_blank_model_fields('swim')
		bike_calculated_data = get_blank_model_fields('bike')
		steps_calculated_data = get_blank_model_fields('step')
		sleeps_calculated_data = get_blank_model_fields('sleep')
		food_calculated_data = get_blank_model_fields("food")
		alcohol_calculated_data = get_blank_model_fields("alcohol")

		# Combined user activities (Garmin and user manually created activity)
		# Some activities are automatically renamed to "HEART RATE RECOVERY",
		# but not necessarily 
		combined_user_exercise_activities,combined_user_exec_non_exec_activities =\
			 get_filtered_activity_stats(
				todays_activities_json, user_age, todays_manually_updated_json,
				userinput_activities,user = user, calendar_date = current_date,
				epoch_summaries = epochs_json,provide_all=True)
		activity_stats = get_activity_stats(combined_user_exercise_activities,user_age)
		weather_data = get_weather_data(todays_daily_strong,start_epoch,activity_stats)

		# Exercise Calculation
		exercise_calculated_data['did_workout'] = did_workout_today(
				activity_stats['have_activity'],
				safe_get(todays_daily_strong,"workout","")
			)
		exercise_calculated_data['workout_easy_hard'] = safe_get(todays_daily_strong,
														 "work_out_easy_or_hard",'')
		exercise_calculated_data['distance_run'] = activity_stats['distance_run_miles']
		exercise_calculated_data['distance_bike'] = activity_stats['distance_bike_miles']
		exercise_calculated_data['distance_swim'] = activity_stats['distance_swim_yards']
		exercise_calculated_data['distance_other'] = activity_stats['distance_other_miles']
		exercise_calculated_data['pace'] = activity_stats['pace']
		exercise_calculated_data['avg_heartrate'] = activity_stats['avg_heartrate']
		exercise_calculated_data['workout_duration'] = sec_to_hours_min_sec(activity_stats['total_duration'])
		exercise_calculated_data['activities_duration'] = activity_stats['activities_duration']

		# Meters to foot and rounding half up
		exercise_calculated_data['elevation_gain'] = int(round(safe_sum(combined_user_exercise_activities,
													'totalElevationGainInMeters')*3.28084,1))
		exercise_calculated_data['elevation_loss'] = int(round(safe_sum(combined_user_exercise_activities,
													'totalElevationLossInMeters')*3.28084,1))
		exercise_calculated_data['effort_level'] = safe_get(todays_daily_strong,
													"workout_effort_level", 0)
		exercise_calculated_data['dew_point'] = weather_data['dewPoint']
		exercise_calculated_data['temperature'] = weather_data['temperature']
		exercise_calculated_data['humidity'] = weather_data['humidity']
		exercise_calculated_data['temperature_feels_like'] = weather_data['apparentTemperature']
		exercise_calculated_data['wind'] = weather_data['windSpeed']
		exercise_calculated_data['hrr_time_to_99'] = safe_get(daily_encouraged,"time_to_99","") 
		exercise_calculated_data['hrr_starting_point'] = safe_get(daily_encouraged,"hr_level",0)

		hr_at_start_of_hrr = safe_get(daily_encouraged,"hr_level",0)
		lowest_hr_first_minute = safe_get(daily_encouraged,"lowest_hr_first_minute",0)
		if (hr_at_start_of_hrr and lowest_hr_first_minute 
			and hr_at_start_of_hrr >= lowest_hr_first_minute):
			hr_lowered = hr_at_start_of_hrr - lowest_hr_first_minute
			exercise_calculated_data['hrr_beats_lowered_first_minute'] = hr_lowered 

		exercise_calculated_data['resting_hr_last_night'] = safe_get_dict(dailies_json,
			'restingHeartRateInBeatsPerMinute',0)
		exercise_calculated_data['lowest_hr_during_hrr'] = safe_get(
			daily_encouraged,"lowest_hr_first_minute",0)
				
		exercise_calculated_data['vo2_max'] = safe_get_dict(user_metrics_json,"vo2Max",0)
		exercise_calculated_data['running_cadence'] = safe_sum(combined_user_exercise_activities,
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
		exercise_calculated_data['fitness_age'] = safe_get_dict(user_metrics_json,
													 			"fitnessAge", 0)
		exercise_calculated_data['heartrate_variability_stress'] = safe_get_dict(dailies_json,
														'averageStressLevel',-1)
		exercise_calculated_data['nose_breath_prcnt_workout'] = safe_get(
			daily_encouraged,
			"workout_that_user_breathed_through_nose",0)
		
		# Steps
		steps_calculated_data['floor_climed'] = safe_get_dict(dailies_json,"floorsClimbed",0)
		weight = get_weight(bodycmp_json,daily_optional)
		steps_calculated_data['weight'] = weight

		# Sleeps
		user_input_bedtime = safe_get(todays_daily_strong,"sleep_bedtime",None)
		user_input_awake_time = safe_get(todays_daily_strong,"sleep_awake_time",None)
		user_input_sleep_duration = get_user_input_total_sleep(
			todays_daily_strong,daily_optional)
		user_input_timezone = todays_user_input.timezone if todays_user_input else None
		
		sleep_stats = get_sleep_stats(current_date,sleeps_json,sleeps_today_json,
									  user_input_bedtime = user_input_bedtime,
									  user_input_awake_time = user_input_awake_time,
									  user_input_timezone = user_input_timezone,
									  str_dt=False)

		sleep_bed_time = sleep_stats['sleep_bed_time']
		sleep_awake_time = sleep_stats['sleep_awake_time']
		if sleep_bed_time:
			sleep_bed_time = sleep_bed_time.strftime("%I:%M %p")
		else:
			sleep_bed_time = ''

		if sleep_awake_time:
			sleep_awake_time = sleep_awake_time.strftime("%I:%M %p")
		else:
			sleep_awake_time = ''
		
		sleeps_calculated_data['sleep_aid'] = safe_get(todays_daily_strong,
					 "prescription_or_non_prescription_sleep_aids_last_night", "")
		sleeps_calculated_data['deep_sleep'] = sleep_stats['deep_sleep']
		sleeps_calculated_data['light_sleep'] = sleep_stats['light_sleep']
		sleeps_calculated_data['rem_sleep'] = sleep_stats['rem_sleep']
		sleeps_calculated_data['awake_time'] = sleep_stats['awake_time']
		sleeps_calculated_data['sleep_bed_time'] = sleep_bed_time
		sleeps_calculated_data['sleep_awake_time'] = sleep_awake_time
		sleeps_calculated_data['sleep_per_wearable'] = sleep_stats['sleep_per_wearable']
		sleeps_calculated_data['sleep_per_user_input'] = (user_input_sleep_duration 
			if user_input_sleep_duration else "")
		comment = safe_get(todays_daily_strong,"sleep_comment",'')
		sleeps_calculated_data['sleep_comments'] = comment if comment else ''

		# Food
		food_calculated_data['prcnt_non_processed_food'] = safe_get(todays_daily_strong,
									   "prcnt_unprocessed_food_consumed_yesterday", 0)
		food_calculated_data['non_processed_food'] = safe_get(todays_daily_strong,
								 "list_of_unprocessed_food_consumed_yesterday", "")			
		food_calculated_data['processed_food'] = safe_get(todays_daily_strong,
								 "list_of_processed_food_consumed_yesterday", "")
		food_calculated_data['diet_type'] = safe_get(daily_optional,"type_of_diet_eaten","")

		# Alcohol
		alcohol_today = safe_get(todays_daily_strong,"number_of_alcohol_consumed_yesterday","")
		alcohol_calculated_data['alcohol_day'] = '' if not alcohol_today else alcohol_today
		
		# **************************************CALCULATION OF GRADES**************************************
		
		# Workout duration grade calculation
		workout_duration_grade_pts  = get_workout_duration_grade(activity_stats.get('total_duration',0))
		grades_calculated_data['workout_duration_grade'] = workout_duration_grade_pts[0]
		grades_calculated_data['workout_duration_gpa'] = workout_duration_grade_pts[1]

		# Workout effort level grade calculation
		workout_effortlvl_grade_pts = get_workout_effort_grade(todays_daily_strong)
		grades_calculated_data['workout_effortlvl_grade'] = workout_effortlvl_grade_pts[0]
		grades_calculated_data['workout_effortlvl_gpa'] = workout_effortlvl_grade_pts[1]

		# Average exercise heartrate grade calculation
		avg_exercise_hr_grade_pts = get_average_exercise_heartrate_grade(
			combined_user_exercise_activities,todays_daily_strong,user_age)
		hr_grade = 'N/A' if not avg_exercise_hr_grade_pts[0] else avg_exercise_hr_grade_pts[0] 
		grades_calculated_data['avg_exercise_hr_grade'] = hr_grade
		grades_calculated_data['avg_exercise_hr_gpa'] = avg_exercise_hr_grade_pts[1]\
			if avg_exercise_hr_grade_pts[1] else 0
		exercise_calculated_data['avg_exercise_heartrate'] = avg_exercise_hr_grade_pts[2]\
			if avg_exercise_hr_grade_pts[2] else 0

		# Overall workout grade calculation
		overall_workout_grade_pt = get_overall_workout_grade(
								workout_duration_grade_pts[1],
								workout_effortlvl_grade_pts[1],
								avg_exercise_hr_grade_pts[1])
		grades_calculated_data['overall_workout_grade'] = overall_workout_grade_pt[0]
		grades_calculated_data['overall_workout_gpa'] = overall_workout_grade_pt[1]

		# Average sleep per night grade calculation

		user_input_sleep_aid = safe_get(
			todays_daily_strong,"prescription_or_non_prescription_sleep_aids_last_night",''
		)
		grade_point = get_avg_sleep_grade(
			current_date,
			sleeps_json,
			sleeps_today_json,
			user_input_bedtime = user_input_bedtime,
			user_input_awake_time = user_input_awake_time,
			user_input_sleep_duration = user_input_sleep_duration,
			user_input_timezone = user_input_timezone,
			sleep_aid = user_input_sleep_aid,
			age = user_age
		)
		grades_calculated_data['avg_sleep_per_night_grade'] = grade_point[0] if grade_point[0] else ''
		grades_calculated_data['avg_sleep_per_night_gpa'] = grade_point[1] if grade_point[1] else 0

		# Unprocessed food grade calculation 
		prcnt_unprocessed_food_grade_pt  = get_unprocessed_food_grade(todays_daily_strong, current_date)
		grades_calculated_data['prcnt_unprocessed_food_consumed_grade'] = prcnt_unprocessed_food_grade_pt[0] \
			if prcnt_unprocessed_food_grade_pt[0] else ''
		grades_calculated_data['prcnt_unprocessed_food_consumed_gpa'] = prcnt_unprocessed_food_grade_pt[1] \
			if prcnt_unprocessed_food_grade_pt[1] else 0 
	
		# Alcohol drink consumed grade and avg alcohol per week
		grade,avg_alcohol,avg_alcohol_gpa = get_alcohol_grade_avg_alcohol_week(daily_strong,user)
		grades_calculated_data['alcoholic_drink_per_week_grade'] = grade
		alcohol_calculated_data['alcohol_week'] = avg_alcohol
		grades_calculated_data['alcoholic_drink_per_week_gpa'] = avg_alcohol_gpa

		# Movement consistency and movement consistency grade calculation
		user_input_strength_start_time = safe_get(todays_daily_strong,"strength_workout_start",None)
		user_input_strength_end_time = safe_get(todays_daily_strong,"strength_workout_end",None)
		if user_input_strength_start_time and user_input_strength_end_time:
			user_input_strength_start_time = _str_duration_to_dt(current_date,user_input_strength_start_time)
			user_input_strength_end_time = _str_duration_to_dt(current_date,user_input_strength_end_time)

		todays_bedtime = None
		tomorrows_user_input_tz = None
		if tomorrows_user_input and tomorrows_user_input.strong_input:
			todays_bedtime = tomorrows_user_input.strong_input.sleep_bedtime
			tomorrows_user_input_tz = tomorrows_user_input.timezone
		nap_start_time = safe_get(daily_optional, "nap_start_time", None)
		nap_end_time = safe_get(daily_optional, "nap_end_time", None)
		if nap_start_time and nap_end_time:
			nap_start_time = _str_duration_to_dt(current_date,nap_start_time)
			nap_end_time = _str_duration_to_dt(current_date,nap_end_time)

		yesterday_bedtime = sleep_stats['sleep_bed_time']
		today_awake_time = sleep_stats['sleep_awake_time']
		today_bedtime = None
		if (todays_bedtime and tomorrows_user_input_tz):
			target_tz = pytz.timezone(tomorrows_user_input_tz)
			today_bedtime = todays_bedtime.astimezone(target_tz).replace(tzinfo=None)
		else:
			sleeps_today_stats = get_sleep_stats(current_date,None,sleeps_today_json[::-1],
				user_input_timezone = user_input_timezone,str_dt=False,bed_time_today=True)
			today_bedtime = sleeps_today_stats['sleep_bed_time']

		movement_consistency_summary = cal_movement_consistency_summary(
			user,
			current_date,
			epochs_json,
			yesterday_bedtime = yesterday_bedtime,
			today_awake_time = today_awake_time,
			combined_user_activities = combined_user_exercise_activities,
			today_bedtime = today_bedtime,
		  	user_input_strength_start_time = user_input_strength_start_time,
		  	user_input_strength_end_time = user_input_strength_end_time,
		  	yesterday_epoch_data = yesterday_epoch,
		  	tomorrow_epoch_data = tomorrow_epoch,
		  	nap_start_time = nap_start_time,
		  	nap_end_time = nap_end_time
		)
		
		if movement_consistency_summary:
			steps_calculated_data['movement_consistency'] = json.dumps(movement_consistency_summary)
			inactive_hours = movement_consistency_summary.get("inactive_hours")
			grade = cal_movement_consistency_grade(inactive_hours)
			grades_calculated_data['movement_consistency_grade'] = grade

		# Exercise step calculation, Non exercise step calculation and
		# Non-Exercise steps grade calculation
		daily_total_steps = 0
		if dailies_json:
			daily_total_steps = dailies_json[0].get('steps',0)
		exercise_steps,non_exercise_steps,total_steps = cal_exercise_steps_total_steps(
			daily_total_steps,
			combined_user_exec_non_exec_activities,
			user_age
		)	
		steps_calculated_data['non_exercise_steps'] = non_exercise_steps
		steps_calculated_data['exercise_steps'] = exercise_steps
		steps_calculated_data['total_steps'] = total_steps

		moment_non_exercise_steps_grade_point = cal_non_exercise_step_grade(non_exercise_steps)
		grades_calculated_data['movement_non_exercise_steps_grade'] = moment_non_exercise_steps_grade_point[0]
		grades_calculated_data['movement_non_exercise_steps_gpa'] = moment_non_exercise_steps_grade_point[1]
		

		# Exercise Consistency grade calculation over period of 7 days
		exercise_consistency_grade_point = get_exercise_consistency_grade(
			weekly_daily_strong,weekly_combined_activities,7,user_age)

		grades_calculated_data['exercise_consistency_grade'] = exercise_consistency_grade_point[0]
		grades_calculated_data['exercise_consistency_score'] = exercise_consistency_grade_point[1]

		# Penalty calculation
		penalties = cal_penalty(
			safe_get(todays_daily_strong,"smoke_any_substances_whatsoever",""),
			safe_get(todays_daily_strong,"controlled_uncontrolled_substance",""),
			safe_get(todays_daily_strong, "prescription_or_non_prescription_sleep_aids_last_night","")
		)
		grades_calculated_data["sleep_aid_penalty"] = penalties['sleep_aid_penalty']
		grades_calculated_data['ctrl_subs_penalty'] = penalties['ctrl_subs_penalty']
		grades_calculated_data['smoke_penalty'] = penalties['smoke_penalty']

		# Overall Grade and Overall GPA calculation
		overall_grade_pt = get_overall_grade(grades_calculated_data)
		grades_calculated_data['overall_health_grade'] = overall_grade_pt[0]
		grades_calculated_data['overall_health_gpa'] = overall_grade_pt[1]
		
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