from datetime import datetime,timedelta
import ast
import pdb

from quicklook.serializers import UserQuickLookSerializer
from .garmin_calculation import (
	get_blank_model_fields,
	str_to_datetime,
	update_helper,
	sec_to_hours_min_sec
	)
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

from .convertor.fitbit_to_garmin_convertor import fitbit_to_garmin_sleep

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

def get_sleep_stats(sleep_data):		
	sleep_stats = {
		"deep_sleep": '',
		"light_sleep": '',
		"awake_time": '',
		"rem_sleep":'',
		"sleep_bed_time": '',
		"sleep_awake_time": '',
		"sleep_per_wearable":''
	}
	if sleep_data:
		main_sleep_data = list(filter(lambda x:x.get('isMainSleep'),sleep_data['sleep']))
		if not main_sleep_data:
			main_sleep_data = sleep_data['sleep']
		main_sleep_data = main_sleep_data[0]
		trans_sleep_data = fitbit_to_garmin_sleep(main_sleep_data)

		bed_time = datetime.strptime(
			trans_sleep_data['startTimeInSeconds'],
			"%Y-%m-%dT%H:%M:%S.%f")
		wake_time = bed_time + timedelta(
			seconds = trans_sleep_data['durationInSeconds'])


		sleep_stats["sleep_bed_time"] = bed_time.strftime("%I:%M %p")
		sleep_stats["sleep_awake_time"] = wake_time.strftime("%I:%M %p")

		sleep_stats["deep_sleep"] = sec_to_hours_min_sec(
			trans_sleep_data['deepSleepDurationInSeconds'],
			include_sec = False
		)
		sleep_stats["light_sleep"] = sec_to_hours_min_sec(
			trans_sleep_data['lightSleepDurationInSeconds'],
			include_sec = False
		)
		sleep_stats["awake_time"] = sec_to_hours_min_sec(
			trans_sleep_data['awakeDurationInSeconds'],
			include_sec = False
		)
		sleep_stats["rem_sleep"] = sec_to_hours_min_sec(
			trans_sleep_data['remSleepInSeconds'],
			include_sec = False
		)
		sleep_stats["sleep_per_wearable"] = sec_to_hours_min_sec(
			trans_sleep_data['durationInSeconds'],
			include_sec = False
		)

	return sleep_stats

def create_fitbit_quick_look(user,from_date=None,to_date=None):
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
		
		grades_calculated_data = get_blank_model_fields('grade')
		exercise_calculated_data = get_blank_model_fields('exercise')
		swim_calculated_data = get_blank_model_fields('swim')
		bike_calculated_data = get_blank_model_fields('bike')
		steps_calculated_data = get_blank_model_fields('step')
		sleeps_calculated_data = get_blank_model_fields('sleep')
		food_calculated_data = get_blank_model_fields("food")
		alcohol_calculated_data = get_blank_model_fields("alcohol")

		# TODO: grabbing fitbit sleep data and populate sleeps_calculated_data fields
		todays_sleep_data = get_fitbit_model_data(
			UserFitbitDataSleep,user,current_date.date(),current_date.date())
		if todays_sleep_data:
			todays_sleep_data = ast.literal_eval(todays_sleep_data[0].replace(
				"'sleep_fitbit': {...}","'sleep_fitbit': {}"))
		else:
			todays_sleep_data = None
		sleep_stats = get_sleep_stats(todays_sleep_data)
		sleeps_calculated_data['deep_sleep'] = sleep_stats['deep_sleep']
		sleeps_calculated_data['light_sleep'] = sleep_stats['light_sleep']
		sleeps_calculated_data['rem_sleep'] = sleep_stats['rem_sleep']
		sleeps_calculated_data['awake_time'] = sleep_stats['awake_time']
		sleeps_calculated_data['sleep_bed_time'] = sleep_stats['sleep_bed_time']
		sleeps_calculated_data['sleep_awake_time'] = sleep_stats['sleep_awake_time']
		sleeps_calculated_data['sleep_per_wearable'] = sleep_stats['sleep_per_wearable']
		
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