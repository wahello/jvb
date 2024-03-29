from datetime import datetime,timedelta,date
import time
import ast
import json
import collections
from django.db.models import Q

from hrr.models import AaWorkoutCalculations,AaCalculations
from user_input.utils.daily_activity import get_daily_activities_in_base_format
from user_input.models import DailyUserInputStrong
from fitparse import FitFile


# Parse the fit files and return the heart beat and timstamp
def fitfile_parse(obj,offset,start_date_str):
	try:
		heartrate_complete = []
		timestamp_complete = []

		obj_start_year = int(start_date_str.split('-')[0])
		obj_start_month = int(start_date_str.split('-')[1])
		obj_start_date = int(start_date_str.split('-')[2])
		
		single_obj = [(FitFile(single_obj.fit_file)).get_messages('record') for single_obj in obj]
		
		for record in single_obj:
			for record_data in record:
				for single_record_data in record_data:
					if(single_record_data.name=='heart_rate'):
						heart_rate_value = single_record_data.value
						heartrate_complete.extend([heart_rate_value])

					if(single_record_data.name=='timestamp'):
						timestamp = single_record_data.value
						timestamp_complete.extend([timestamp])

		heartrate_selected_date = []
		timestamp_selected_date = []
		
		start_date_obj = datetime(obj_start_year,obj_start_month,obj_start_date,0,0,0)
		end_date_obj = start_date_obj + timedelta(days=1)

		for heart,timeheart in zip(heartrate_complete,timestamp_complete):
			timeheart_str = timeheart.strftime("%Y-%m-%d %H:%M:%S")
			timeheart_utc = int(time.mktime(datetime.strptime(timeheart_str, "%Y-%m-%d %H:%M:%S").timetuple()))+offset
			timeheart_utc = datetime.utcfromtimestamp(timeheart_utc)
			if timeheart_utc >= start_date_obj and timeheart_utc <= end_date_obj and heart:
				heartrate_selected_date.extend([heart])
				timestamp_selected_date.extend([timeheart])

			
		to_timestamp = []
		for index,value in enumerate(timestamp_selected_date):
			value_timetuple = value.timetuple()
			value_mktime = time.mktime(value_timetuple)
			value_mktime = value_mktime+offset
			to_timestamp.extend([value_mktime])
		
		timestamp_difference = []
		for i,single_timestamp in enumerate(to_timestamp):
			try:
				dif_tim = to_timestamp[i+1] - to_timestamp[i]
				timestamp_difference.extend([dif_tim])
			except IndexError:
				timestamp_difference.extend([1])

		final_heartrate = []
		final_timestamp = []

		for heart_rate,time_stamp in zip(heartrate_selected_date,timestamp_difference):
			if (time_stamp <= 200) and (time_stamp >= 0):
				final_heartrate.extend([heart_rate])
				final_timestamp.extend([time_stamp])
	except:
		final_heartrate = []
		final_timestamp =[]
		to_timestamp = []

	return (final_heartrate,final_timestamp,to_timestamp)

def get_usernput_activities(user,start_date):
	'''
		Get activities from user input models
	'''
	# try:
	# 	user_input_strong = DailyUserInputStrong.objects.filter(
	# 	user_input__created_at=(start_date),
	# 	user_input__user = user).order_by('-user_input__created_at')
	# 	activities=[]
	# 	activities_dic={}
	# 	if user_input_strong:
	# 		user_input_activities =[act.activities for act in user_input_strong]
	# 		user_input_activities = json.loads(user_input_activities[0])
	# 		for i,k in user_input_activities.items():
	# 			summaryId = []
	# 			for keys in user_input_activities.keys():
	# 				summaryId.append(keys)
	# 			for i in range(len(summaryId)):
	# 				activities.append(user_input_activities[summaryId[i]])
	# 				activities_dic[summaryId[i]]=user_input_activities[summaryId[i]]
	# except (ValueError, SyntaxError):
	# 	activities =[]
	# 	activities_dic = {}
	# 	user_input_strong = ''
	# return activities,activities_dic,user_input_strong
	activities_dic = get_daily_activities_in_base_format(user,start_date)
	if activities_dic:
		return activities_dic
	else:
		return {}

def week_date(start_date):
	'''
	Takes data object and convert to the last week from Monday to Sunday

	Args: start_date(datatime.date object)

	Returns:Week start date and End date
	'''
	week_start_date = start_date - timedelta(
		days = start_date.weekday())
	week_end_date = start_date - timedelta(
		days = start_date.weekday()-6)
	return(week_start_date,week_end_date)

def get_weekly_workouts(user,start_date,end_date):
	'''
		Get week workout data
	'''
	queryset = AaWorkoutCalculations.objects.filter(Q(created_at__gte=start_date)&
							  Q(created_at__lte=end_date),
							  user_aa_workout=user)
	# print(queryset,"weekly workout data")
	return queryset

def get_weekly_aa(user,start_date,end_date):
	'''
		Get week Aerobic and anarobic zone data
	'''
	queryset = AaCalculations.objects.filter(Q(created_at__gte=start_date)&
							  Q(created_at__lte=end_date),
							  user_aa=user)
	return queryset

def workout_percent(workout_dict):
	'''
		calculating the average heart rate and percent of days having activities 
	'''
	for key,value in workout_dict.items():
		if value.get('no_activity_in_week') and value.get("average_heart_rate"):
			workout_dict[key]["average_heart_rate"] = ((
				workout_dict[key]["average_heart_rate"])/workout_dict[key]["no_activity_in_week"])
			workout_dict[key]["percent_of_days"] = ((
				workout_dict[key]["days_with_activity"])/7)*100
		elif value.get('days_with_activity'):	
			workout_dict[key]["percent_of_days"] = ((
				workout_dict[key]["days_with_activity"])/7)*100
	return workout_dict

def add_activity_type(workout_dict,workout_type):
	'''
		Add new dictonary(activity duration) for every activty
	''' 
	workout_type_unique = list(set(workout_type))
	for key,value in workout_dict.items():
		for i,k in enumerate(workout_type_unique):
			if k == key:
				k_str = k.lower()+"_distance"
				if not value.get(k_str):
					workout_dict[key][k_str] = {}
				workout_dict[key][k_str]['value'] = value["distance_meters"]
				workout_dict[key][k_str]['unit'] = "meters"
			# else:
			# 	k_str = k.lower()+"_distance"
			# 	if not value.get(k_str):
			# 		workout_dict[key][k_str] = {}
			# 	workout_dict[key][k_str]['value'] = 0
			# 	workout_dict[key][k_str]['unit'] = "meters"
	return workout_dict

def change_hrr_key(workout_dict_percent):
	'''
		Add duration for the activity which does not have the HRR
	'''
	workout_dict_percent_copy = workout_dict_percent.copy()
	for key,value in workout_dict_percent.items():
		if value['hrr_not_recorded']:
			workout_dict_percent_copy[key]['duration_hrr_not_recorded'] = value.get(
			'hrr_not_recorded',0)
			workout_dict_percent_copy[key]['percent_hrr_not_recorded'] = value.get(
			'prcnt_hrr_not_recorded',0.0)

		else:
			workout_dict_percent_copy[key]['duration_hrr_not_recorded'] = 0.0
			workout_dict_percent_copy[key]['percent_hrr_not_recorded'] = 0
	return workout_dict_percent

def remove_spaces(weekly_workout):
	'''
		This function removes the White spaces for the activity type
	'''
	workouts_dict = {}
	for single_workout in weekly_workout:
		single_workout = ast.literal_eval(single_workout)
		single_workout.pop('Totals',None)
		for key,value in single_workout.items():
			workout_type  = value["workout_type"]
			workout_type_nospace = workout_type.strip()
			value["workout_type"] = workout_type_nospace
			workouts_dict[key] = value
	workouts = [str(workouts_dict)]
	return workouts

def add_dates(value,workout_dict):
	'''
		Add dates to single activity
	'''
	for key,data in workout_dict.items():
		data_workout = value.get("date")
		if key == value.get("workout_type"):
			try:
				if data["dates"][value.get(
					"date",'0')].get("workout_date",'0') == data_workout:
					workout_dict[key]["dates"][value["date"]]['workout_date'] = value.get("date")	
					workout_dict[key]["dates"][value["date"]]['repeated'] = (
						1+workout_dict[key]["dates"][value["date"]]['repeated'])
					workout_dict[key]["dates"][value["date"]]['duration'] = value.get(
						"duration",0)+workout_dict[key]["dates"][value["date"]].get('duration',0)

			except KeyError:
				workout_dict[key]["dates"][value["date"]] = {}
				workout_dict[key]["dates"][value["date"]]['workout_date'] = value.get("date")
				workout_dict[key]["dates"][value["date"]]['repeated'] = 1
				workout_dict[key]["dates"][value["date"]]['duration'] = value.get("duration",0)

	return workout_dict

def days_with_activity(workout_dict,value):
	no_activities = len(workout_dict[value['workout_type']]["dates"])
	workout_dict[value['workout_type']]['days_with_activity'] = no_activities
	return workout_dict
	
def weekly_workout_calculations(weekly_workout):
	'''
		Make Similar activities into single activity
	'''
	# print(weekly_workout,"weekly_workout")
	workout_type = []
	workout_dict = {}
	workout_summary_id = {}
	weekly_workout = remove_spaces(weekly_workout)
	for single_workout in weekly_workout:
		single_workout = ast.literal_eval(single_workout)
		for key,value in single_workout.items():
			if value['workout_type'] in workout_type:
				workout_type.append(value['workout_type'])
				workout_summary_id[key] = [value['workout_type']]
				no_workouts = dict(collections.Counter(workout_type))
				repeated_workout = no_workouts[value['workout_type']]
				workout_dict[value['workout_type']]['no_activity_in_week'] = repeated_workout
				workout_dict[value['workout_type']]['duration'] = (
					(workout_dict[value['workout_type']]['duration']) + (value['duration']))
				if value['average_heart_rate'] and workout_dict[value['workout_type']]['average_heart_rate']:
					workout_dict[value['workout_type']]['average_heart_rate'] = (
						(workout_dict[value['workout_type']]['average_heart_rate']) + (
							value['average_heart_rate']))
				else:	
					workout_dict[value['workout_type']]['average_heart_rate'] = None
				workout_dict[value['workout_type']]['steps'] = (
					(workout_dict[value['workout_type']]['steps']) + (value['steps']))
				workout_dict[value['workout_type']]['distance_meters'] = (
					(workout_dict[value['workout_type']].get('distance_meters',0)) + (value.get('distance_meters',0)))

				workout_dict = add_dates(value,workout_dict)
				workout_dict = days_with_activity(workout_dict,value)

			else:
				workout_type.append(value['workout_type'])
				workout_dict[value['workout_type']] = value
				workout_dict[value['workout_type']]["dates"] = {}
				workout_dict[value['workout_type']]["dates"][value["date"]] = {}
				workout_dict[value['workout_type']]["dates"][value["date"]]['workout_date'] = value['date']
				workout_dict[value['workout_type']]["dates"][value["date"]]['duration'] = value['duration']
				workout_dict[value['workout_type']]["dates"][value["date"]]['repeated'] = 1
				workout_dict[value['workout_type']]['days_with_activity'] = 1
				workout_dict[value['workout_type']]['no_activity_in_week'] = 1
				workout_summary_id[key] = [value['workout_type']]
	
	added_all_actiivtes = add_activity_type(workout_dict,workout_type)
	workout_dict_percent = workout_percent(added_all_actiivtes)
	final_workout_data = change_hrr_key(workout_dict_percent)
	return final_workout_data,workout_summary_id,workout_type

def add_workout_type(single_aa,workout_summary_id):
	'''
		Make activity type as key
	'''
	for key,value in single_aa.items():
		for key1,values1 in workout_summary_id.items():
			if key == key1:
				value["workout_type"] = values1[0]
	return single_aa

def percent_calculations(aa_dict):
	'''
		Add percentages to Aerobic and Anarobic ranges for activity
	'''
	for key,value in aa_dict.items():
		if value.get('days_with_activity'):
			try:
				aa_dict[key]["percent_aerobic"] = ((
					aa_dict[key]["duration_in_aerobic_range"])/aa_dict[key]["total_duration"])*100
			except ZeroDivisionError:
				aa_dict[key]["percent_aerobic"] = 0
			try:
				aa_dict[key]["percent_anaerobic"] = ((
					aa_dict[key]["duration_in_anaerobic_range"])/aa_dict[key]["total_duration"])*100
			except ZeroDivisionError:
				aa_dict[key]["percent_anaerobic"] = 0
			try:
				aa_dict[key]["percent_below_aerobic"] = ((
					aa_dict[key]["duration_below_aerobic_range"])/aa_dict[key]["total_duration"])*100
			except ZeroDivisionError:
				aa_dict[key]["percent_below_aerobic"] = 0
			try:
				aa_dict[key]["percent_hrr_not_recorded"] = ((
					aa_dict[key]["duration_hrr_not_recorded"])/aa_dict[key]["total_duration"])*100
			except ZeroDivisionError:
				aa_dict[key]["percent_hrr_not_recorded"] = 0
	return aa_dict

def weekly_aa_calculations(weekly_aa,workout_summary_id,final_workout_data):
	'''
		Add Aerobic and Anarobic range values to activity
	'''
	activity_type = []
	aa_dict = {}
	for single_aa in weekly_aa:
		single_aa = ast.literal_eval(single_aa)
		single_aa.pop('Totals',None)
		single_aa_modified = add_workout_type(single_aa,workout_summary_id)
		for key,value in single_aa_modified.items():
			if value.get('workout_type',None):
				if value['workout_type'] in activity_type:
					activity_type.append(value['workout_type'])
					no_workouts = dict(collections.Counter(activity_type))
					repeated_workout = no_workouts[value['workout_type']]
					aa_dict[value['workout_type']]['no_activity_in_week'] = repeated_workout
					aa_dict[value['workout_type']]['days_with_activity'] = (
						final_workout_data[value['workout_type']]['days_with_activity'])
					aa_dict[value['workout_type']]['total_duration'] = (
						(aa_dict[value['workout_type']]['total_duration']) + (value['total_duration']))
					aa_dict[value['workout_type']]['duration_in_aerobic_range'] = (
						(aa_dict[value['workout_type']]['duration_in_aerobic_range']) + (
							value['duration_in_aerobic_range']))
					aa_dict[value['workout_type']]['duration_in_anaerobic_range'] = (
						(aa_dict[value['workout_type']]['duration_in_anaerobic_range']) + (
							value['duration_in_anaerobic_range']))
					aa_dict[value['workout_type']]['duration_below_aerobic_range'] = (
						(aa_dict[value['workout_type']]['duration_below_aerobic_range']) + (
							value['duration_below_aerobic_range']))
					aa_dict[value['workout_type']]['duration_hrr_not_recorded'] = (
						(aa_dict[value['workout_type']]['duration_hrr_not_recorded']) + (
							value['duration_hrr_not_recorded']))


				else:
					activity_type.append(value['workout_type'])	
					aa_dict[value['workout_type']] = value
	added_percent = percent_calculations(aa_dict)
	return added_percent

def merge_activities(final_workout_data,final_aa_data):
	'''
		Merge Totals dict and activity dicts
	'''
	for key,value in final_workout_data.items():
		for key1,values1 in final_aa_data.items():
			if key == key1:
				final_workout_data[key].update(final_aa_data[key1])
	return final_workout_data

def percent_total(merged_data_total):
	'''
		Add percentages to Aerobic and Anarobic ranges for Totals
	'''
	merged_data_total['Totals']['percent_aerobic'] = (
		(merged_data_total['Totals']['duration_in_aerobic_range'])/(
			merged_data_total['Totals']['duration']))*100
	merged_data_total['Totals']['percent_anaerobic'] = (
		(merged_data_total['Totals']['duration_in_anaerobic_range'])/(
			merged_data_total['Totals']['duration']))*100
	merged_data_total['Totals']['percent_below_aerobic'] = (
		(merged_data_total['Totals']['duration_below_aerobic_range'])/(
			merged_data_total['Totals']['duration']))*100
	merged_data_total['Totals']['percent_hrr_not_recorded'] = (
		(merged_data_total['Totals']['duration_hrr_not_recorded'])/(
			merged_data_total['Totals']['duration']))*100
	merged_data_total['Totals']['percent_of_days'] = (
		(merged_data_total['Totals']['days_with_activity'])/(7))*100
	merged_data_total['Totals']['days_no_activity'] = (
		 (7)-(merged_data_total['Totals']['days_with_activity']))
	merged_data_total['Totals']['percent_days_no_activity'] = (
		(merged_data_total['Totals']['days_no_activity'])/(7))*100
	return merged_data_total

def totals_workout(merged_data,no_days_activity):
	'''
		Create Totals dictionary and update with relavant data
	'''
	merged_data_total = merged_data.copy()
	for key,value in merged_data.items():
		if not merged_data_total.get('Totals'):
			merged_data_total['Totals'] = {}
		merged_data_total['Totals']['days_with_activity'] = no_days_activity
		merged_data_total['Totals']['percent_of_days'] = (no_days_activity/7)*100
		merged_data_total['Totals']['duration'] = merged_data_total['Totals'].get(
			'duration',0) + value["duration"]
		merged_data_total['Totals']['workout_duration_percent'] = 100
		if value["average_heart_rate"]:
			merged_data_total['Totals']['average_heart_rate'] = ((
				value["average_heart_rate"] + merged_data_total['Totals'].get('average_heart_rate',0)))
		merged_data_total['Totals']['duration_in_aerobic_range'] = ((
			value.get("duration_in_aerobic_range",0) + merged_data_total['Totals'].get(
				'duration_in_aerobic_range',0)))
		merged_data_total['Totals']['duration_below_aerobic_range'] = ((
			value.get("duration_below_aerobic_range",0) + merged_data_total['Totals'].get(
				'duration_below_aerobic_range',0)))
		merged_data_total['Totals']['duration_in_anaerobic_range'] = ((
			value.get("duration_in_anaerobic_range",0) + merged_data_total['Totals'].get(
				'duration_in_anaerobic_range',0)))
		merged_data_total['Totals']['duration_hrr_not_recorded'] = ((
			value.get("duration_hrr_not_recorded",0) + merged_data_total['Totals'].get(
				'duration_hrr_not_recorded',0)))

	final_data = percent_total(merged_data_total)
	return final_data

def add_duration_percent(final_data):
	'''
		Remove unwanted keys from activity
	'''
	final_data_total = final_data.copy()
	heart_rate = []
	for key,value in final_data.items():
		if key != 'Totals':
			final_data_total[key]['workout_duration_percent'] = ((
				value['duration'])/final_data_total['Totals']['duration'])*100

			if value['average_heart_rate']:
				heart_rate.append(value['average_heart_rate'])

			value.pop('avg_heart_rate', None)
			value.pop('max_heart_rate', None)
			value.pop('total_duration', None)
			value.pop('hrr_not_recorded', None)
			value.pop('prcnt_hrr_not_recorded', None)
			value.pop('prcnt_hrr_not_recorded', None)
			value.pop('steps', None)
			value.pop('date', None)
		else:
			value['workout_type'] = 'Total'
			value["distance_meters"] = None
			if not final_data_total.get('extra'):
				final_data_total['extra'] = {}
				final_data_total['extra']['days_no_activity'] = final_data_total['Totals']['days_no_activity']
				final_data_total['extra']['percent_days_no_activity'] = ((
					final_data_total['Totals']['percent_days_no_activity']))
			final_data_total['Totals'].pop('days_no_activity', None)
			final_data_total['Totals'].pop('percent_days_no_activity', None)
	if heart_rate:
		final_data_total['Totals']['average_heart_rate'] = ((
			final_data_total['Totals']['average_heart_rate']/len(heart_rate)))

	return final_data_total
 
def dynamic_activities(final_data,workout_type):
	'''
		Add value and unit for activity distance in Totals dictionary
	'''
	workout_type_unique = list(set(workout_type))
	for key,value in final_data.items():
		if key == 'Totals':
			for i,k in enumerate(workout_type_unique):
				if k == key:
					k_str = k.lower()+"_distance"
					if not value.get(k_str):
						final_data['Totals'][k_str] = {}
					final_data['Totals'][k_str]['value'] = value["distance_meters"]
					final_data['Totals'][k_str]['unit'] = "meters"
				else:
					k_str = k.lower()+"_distance"
					if not value.get(k_str):
						final_data['Totals'][k_str] = {}
					final_data['Totals'][k_str]['value'] = final_data[k]["distance_meters"]
					final_data['Totals'][k_str]['unit'] = "meters"
	return final_data

def single_dates_obj(workout_date_list,single_data,data_copy):
	'''
		Add duration of the Activity for single date
	'''
	for single_workout_date in workout_date_list:
		try:
			if single_data["dates"].get(
				single_workout_date,'0').get(
				"workout_date",'0') == data_copy["Totals"]["dates"][single_workout_date]['workout_date']:	
				data_copy["Totals"]["dates"][single_workout_date]['repeated'] = (
					data_copy["Totals"]["dates"][single_workout_date]['repeated']+single_data["dates"].get(
						single_workout_date,'0').get("repeated",'0'))
				data_copy["Totals"]["dates"][single_workout_date]['duration'] = single_data["dates"].get(
				single_workout_date,'0').get("duration",'0') + data_copy["Totals"]["dates"][single_workout_date]['duration'] 

		except KeyError:
			data_copy["Totals"]["dates"][single_workout_date] = {}
			data_copy["Totals"]["dates"][single_workout_date]['workout_date'] = single_workout_date
			data_copy["Totals"]["dates"][single_workout_date]['repeated'] = single_data["dates"].get(
				single_workout_date,'0').get("repeated",'0')
			data_copy["Totals"]["dates"][single_workout_date]['duration'] = single_data.get("duration",0)
	return data_copy

def add_duration_total(final_data,weekly_workout,workout_date_list):
	'''
		Add total duration of the single date
	'''
	for weekly_workout_str in weekly_workout:
		single_workout = ast.literal_eval(weekly_workout_str)
		for key,workout in single_workout.items():
			for i,single_data in enumerate(workout_date_list):
				if single_data == single_workout[key]['date']:		
					final_data["Totals"]["dates"][single_data]["duration"] = single_workout["Totals"]["duration"]
	return final_data

def add_dates_totals(data):
	'''
		Add dated to the totals key
	'''
	workout_date_list = []	
	data_copy = data.copy()
	for key,single_data in data.items():
		if key != "Totals" and key != "extra":
			# print(single_data,"single data")
			workout_date = single_data["dates"].keys()
			workout_date = list(workout_date)
			workout_date_list.extend(workout_date)
			data_total = single_dates_obj(workout_date,single_data,data_copy)
	
	return data_total,workout_date_list
			
def remove_distance_meters(data,weekly_workout):	
	'''
		Remove distace in meters key from all the dictionaries
	'''
	for key,value in data.items():
		value.pop("distance_meters",None)
	data["Totals"]["dates"] = {}
	final_data,workout_date_list = add_dates_totals(data)
	data_duration_copy = add_duration_total(final_data,weekly_workout,workout_date_list)
	return data_duration_copy
