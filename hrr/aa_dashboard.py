import ast
import time
from datetime import datetime,timedelta,date
from decimal import Decimal, ROUND_HALF_UP

from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from django.db.models import Q

from registration.models import Profile

from garmin.models import GarminFitFiles,\
						UserGarminDataDaily,\
						UserGarminDataActivity,\
						UserGarminDataManuallyUpdated

from quicklook.calculations.garmin_calculation import get_filtered_activity_stats
from user_input.utils.daily_activity import get_daily_activities_in_base_format
from user_input.views.garmin_views import _get_activities
from fitparse import FitFile
import fitbit
import quicklook
from hrr.models import Hrr,AAdashboard
import pprint
from hrr import aa_ranges
from hrr.calculation_helper import fitfile_parse

def get_garmin_activities(user,start_date_timestamp,end_date_timestamp):
	'''
		Get Garmin activities from Garmn models
	'''
	try:
		garmin_data_activities = UserGarminDataActivity.objects.filter(
			user=user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
		garmin_list = []
		garmin_dic = {}
		if garmin_data_activities:
			garmin_activity_files = [pr.data for pr in garmin_data_activities]
			for i,k in enumerate(garmin_activity_files):
				act_files=ast.literal_eval(garmin_activity_files[i])
				act_id=act_files['summaryId']
				garmin_dic[act_id]=act_files
				garmin_list.append(act_files)
	except (ValueError, SyntaxError):
		garmin_list = []
		garmin_dic = {}
	return garmin_list,garmin_dic

def get_garmin_manully_activities(user,start_date_timestamp,end_date_timestamp):
	'''
		Get Garmin manually edited activities from Garmn models
	'''
	try:
		manually_updated_activities = UserGarminDataManuallyUpdated.objects.filter(
			user=user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
		manually_edited_dic = {}
		manually_edited_list = []
		if manually_updated_activities:
			manual_activity_files = [activity.data for activity in manually_updated_activities]
			for i,k in enumerate(manual_activity_files):
				manual_files=ast.literal_eval(manual_activity_files[i])
				manual_act_id=manual_files['summaryId']
				manually_edited_dic[manual_act_id]=manual_files
				manually_edited_list.append(manual_files)
	except (ValueError, SyntaxError):
		manually_edited_dic = {}
		manually_edited_list = []
	return manually_edited_dic,manually_edited_list

def get_usernput_activities(user,start_date):
	'''
		Get activities from user input models
	'''
	activities_dic = get_daily_activities_in_base_format(user,start_date)
	if activities_dic:
		return activities_dic
	else:
		return {}

def get_fitfiles(user,start_date,start,end,start_date_timestamp=None,end_date_timestamp=None):
	'''
		get the today fitfiles or 3 days fitfiles
	'''

	activity_files_qs=UserGarminDataActivity.objects.filter(
		user=user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
	print(user,start_date)
	fitfiles_obj = GarminFitFiles.objects.filter(user=user,fit_file_belong_date=start_date)
	print(fitfiles_obj)
	if not fitfiles_obj or len(activity_files_qs) != len(fitfiles_obj):
		fitfiles_obj=GarminFitFiles.objects.filter(user=user,created_at__range=[start,end])
	return fitfiles_obj


def generate_aa_new_table(heartrate,time_difference,current_user_aa_ranges):
	'''This function will generaate the new table for AA dashboard
	Args: heart rate(int)
	      time_difference(int)
	      current_user_aa_ranges(dict)
	Return: dict witj updated current user aa ranges
	'''
	new_format = {}
	for ranges,values in current_user_aa_ranges.items():
		from_hr = int(ranges.split('-')[0])
		to_hr = int(ranges.split('-')[1])+1
		if heartrate in range(from_hr,to_hr):
			values['duration'] = time_difference + values.get('duration',0)

		new_data = {from_hr:values}
		new_format.update(new_data)
	for key,value in new_format.items():
		is_duration = value.get('duration')
		if not is_duration:
			value['duration'] = 0

	return new_format


def aa_dashboard_ranges(user,start_date):
	'''
		This function calculates the A/A third chart data
	''' 
	heart_rate_zone_low_end = ""
	heart_rate_zone_high_end = ""
	time_in_zone_for_last_7_days = ""
	prcnt_total_duration_in_zone = ""
	# start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
	start_date_str = start_date.strftime('%Y-%m-%d')

	start_date_timestamp = start_date
	start_date_timestamp = start_date_timestamp.timetuple()
	start_date_timestamp = time.mktime(start_date_timestamp)
	end_date_timestamp = start_date_timestamp + 86400

	activity_files_qs=UserGarminDataActivity.objects.filter(user= user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
	if activity_files_qs:
		activity_files = [pr.data for pr in activity_files_qs]
		one_activity_file_dict =  ast.literal_eval(activity_files[0])
		offset = one_activity_file_dict['startTimeOffsetInSeconds']

	garmin_list,garmin_dic = get_garmin_activities(
		user,start_date_timestamp,end_date_timestamp)
	manually_edited_dic,manually_edited_list = get_garmin_manully_activities(
		user,start_date_timestamp,end_date_timestamp)
	activities_dic = get_usernput_activities(
		user,start_date)

	user_age = user.profile.age()
	filtered_activities_files = get_filtered_activity_stats(activities_json=garmin_list,
													user_age=user_age,
													manually_updated_json=manually_edited_dic,
													userinput_activities=activities_dic,
													user=user,calendar_date=start_date)

	filtered_activities_only = get_filtered_activity_stats(activities_json=garmin_list,
													user_age=user_age,
													manually_updated_json=manually_edited_dic,
													user=user,calendar_date=start_date)
	activities = []
	hrr_summary_id = []
	workout_summary_id = []
	id_act = 0
	workout_data = []
	for i,k in enumerate(filtered_activities_files):
		if filtered_activities_files[i]['activityType'] == 'HEART_RATE_RECOVERY':
			id_act = int(filtered_activities_files[i]['summaryId'])
			activities.append(filtered_activities_files[i])
			hrr_summary_id.append(filtered_activities_files[i]['summaryId'])
		else:
			if filtered_activities_files[i]["duplicate"] == False:
				workout_data.append(filtered_activities_files[i])
				workout_summary_id.append(filtered_activities_files[i]['summaryId'])

	workout = []
	hrr = []
	start = start_date
	end = start_date + timedelta(days=3)
	fitfiles_obj = get_fitfiles(user,start_date,start,end,start_date_timestamp,end_date_timestamp)
	print(fitfiles_obj,start_date)
	if activities_dic and fitfiles_obj:
		for tmp in fitfiles_obj:
			meta = tmp.meta_data_fitfile
			meta = ast.literal_eval(meta)
			data_id = meta['activityIds'][0]
			if str(data_id) in workout_summary_id and str(data_id):
				workout.append(tmp)
			elif str(data_id) in hrr_summary_id	:
				hrr.append(tmp)
	elif fitfiles_obj:
		for tmp in fitfiles_obj:
			meta = tmp.meta_data_fitfile
			meta = ast.literal_eval(meta)
			data_id = meta['activityIds'][0]
			if str(data_id) in workout_summary_id:
				workout.append(tmp)
			elif str(data_id) in hrr_summary_id:
				hrr.append(tmp)
	print(workout,"workout")
	print(hrr,"hrr")
	aa_ranges_all_users = aa_ranges.all_age_aa_ranges()
	# print(aa_ranges_all_users,"user age")
	current_user_aa_ranges = aa_ranges_all_users.get(str(user_age))
	if workout:
		workout_data = fitfile_parse(workout,offset,start_date_str)
		workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_data
		for heartrate,time_difference in zip(workout_final_heartrate,workout_final_timestamp):
			aa_dashboard_table = generate_aa_new_table(
									heartrate,time_difference,current_user_aa_ranges)
	else:
		aa_dashboard_table = {}

	print(aa_dashboard_table,user,start_date)
	return aa_dashboard_table

def aadashboard_update_instance(user,start_date,data):
	AAdashboard.objects.filter(user=user,created_at=start_date).update(data=data)

def aadashboard_create_instance(user, data, start_date):
	created_at = start_date
	AAdashboard.objects.create(user = user,created_at = created_at,data=data)

def store_garmin_aa_dashboard(user,from_date,to_date):
	print("AA dashboard calculations got started",user.username)
	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	current_date = to_date_obj
	aa_dashboard = AAdashboard.objects.filter(user=user,created_at=from_date_obj)
	while (current_date >= from_date_obj):
		data = aa_dashboard_ranges(user,current_date)
		if data:
			print("AA dashboard calculations creating")
			try:
				user_aa = AAdashboard.objects.get(user=user, created_at=current_date)
				aadashboard_update_instance(user,current_date,data)
			except AAdashboard.DoesNotExist:
				aadashboard_create_instance(user, data, current_date)
		else:
			print("NO AA dashboard")
		current_date -= timedelta(days=1)
	print("AA ddashboard calculations got finished")

# def store_fitbit_aa1(user,from_date,to_date):
# 	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
# 	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
# 	current_date = to_date_obj
# 	while (current_date >= from_date_obj):
# 		activities_dict = get_usernput_activities(user,current_date)
# 		data = fitbit_aa.fitbit_aa_chart_one_new(user,current_date,user_input_activities=activities_dict)
# 		if data.get('total_time'):
# 			print("Fitbit AA1 calculations creating")
# 			try:
# 				user_aa = AA.objects.get(user=user, created_at=current_date)
# 				aa_update_instance(user_aa, data)
# 			except AA.DoesNotExist:
# 				aa_create_instance(user, data, current_date)
# 		else:
# 			print("NO Fitbit AA1")
# 		current_date -= timedelta(days=1)

def store_aadashboard_calculations(user,from_date,to_date):
	'''
	This function takes user start date and end date, calculate the AA calculations 
	then stores in Data base

	Args:user(user object)
		:from_date(start date)
		:to_date(end date)

	Return:None
	'''
	device_type = quicklook.calculations.calculation_driver.which_device(user)
	print(device_type,"device type")
	if device_type == "garmin":
		store_garmin_aa_dashboard(user,from_date,to_date)
	# elif device_type == "fitbit":
	# 	print("Fitbit AA chat1 data calculation got started")
	# 	store_fitbit_aa1(user,from_date,to_date)
	# 	print("Fitbit AA chat1 data calculation finished")
	return None