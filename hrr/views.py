import json
import ast
import time
import logging
import collections
import itertools
from datetime import datetime,timedelta,date
from decimal import Decimal, ROUND_HALF_UP

from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.db.models import Q

from registration.models import Profile
from user_input.models import DailyUserInputStrong,\
							  DailyUserInputEncouraged
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
from hrr.models import Hrr,\
						AaCalculations,\
						TimeHeartZones,\
						AaWorkoutCalculations,\
						AA, \
						TwentyfourHourAA, \
						TwentyfourHourTimeHeartZones,\
						AAdashboard
import pprint
from hrr import fitbit_aa
from hrr.calculation_helper import week_date,\
									get_weekly_workouts,\
									get_weekly_aa,\
									weekly_workout_calculations,\
									weekly_aa_calculations,\
									merge_activities,\
									totals_workout,\
									add_duration_percent,\
									dynamic_activities,\
									remove_distance_meters,\
									fitfile_parse

from .serializers import AaSerializer,HeartzoneSerializer
from .serializers import HrrSerializer


class UserHrrView(generics.ListCreateAPIView):
	'''
		- Create the Hrr instance
		- List all the Hrr instance
		- If query parameters "start_date" is provided
		  then filter the Hrr data for provided date interval
		  and return the list
	'''
	permission_classes = (IsAuthenticated,)
	serializer_class = HrrSerializer
	def calculate_aa_data(self,aa_data,user_get,start_dt):
		if aa_data:
			final_query = aa_data[0]
			return final_query
		else:
			start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
			final_query = hrr_data(user_get,start_date)
			device_type = quicklook.calculations.calculation_driver.which_device(user_get)
			if device_type == 'garmin':
				if final_query.get('Did_you_measure_HRR'):
					try:
						user_hrr = Hrr.objects.get(
							user_hrr=user_get, created_at=start_date)
						update_hrr_instance(user_hrr, final_query)
					except Hrr.DoesNotExist:
						create_hrr_instance(user_get, final_query, start_date)
				return final_query
			elif device_type == 'fitbit':
				start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
				fitbit_hrr = fitbit_aa.generate_hrr_charts(user_get,start_date)
				if fitbit_hrr.get('Did_you_measure_HRR'):
					try:
						user_hrr = Hrr.objects.get(
							user_hrr=user_get, created_at=start_date)
						update_hrr_instance(user_hrr, fitbit_hrr)
					except Hrr.DoesNotExist:
						create_hrr_instance(user_get, fitbit_hrr, start_date)
				return fitbit_hrr
				
	def get(self,request,format="json"):
		user_get = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		querset= self.get_queryset()
		aa_data = self.calculate_aa_data(querset,user_get,start_dt)
		return Response(aa_data, status=status.HTTP_200_OK)

	def get_queryset(self):
		user = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		if start_dt:
			queryset = Hrr.objects.filter(created_at=start_dt,
							  user_hrr=user).values()
		else:
			queryset = Hrr.objects.all()
		return queryset

class UserHrrViewRawData(generics.ListCreateAPIView):
	'''
		- Create the Hrr instance
		- List all the Hrr instance
		- If query parameters "to" and "from" are provided
		  then filter the Hrr data for provided date interval
		  and return the list
	'''
	permission_classes = (IsAuthenticated,)
	serializer_class = HrrSerializer

	def get_queryset(self):
		user = self.request.user

		end_dt = self.request.query_params.get('to',None)
		start_dt = self.request.query_params.get('from', None)

		if start_dt and end_dt:
			queryset = Hrr.objects.filter(Q(created_at__gte=start_dt)&
							  Q(created_at__lte=end_dt),
							  user_hrr=user)
			
		else:
			queryset = Hrr.objects.all()

		return queryset

class UpdateHrr(generics.RetrieveUpdateDestroyAPIView):
	'''
		-update the HRR
	'''
	permission_classes = (IsAuthenticated,)

	def get_queryset(self):
		date = self.request.query_params.get('start_date',None)
		if date:
			qs = Hrr.objects.filter(
				created_at = date 
			).order_by('-created_at')
		else:
			qs = Hrr.objects.filter(
			).order_by('-created_at')
		return qs 

	def get_object(self):
		qs = self.get_queryset()
		try:
			obj = qs.filter(user_hrr = self.request.user)
			if obj:
				return obj[0]
			else:
				None
		except Hrr.DoesNotExist:
			return None
	
	def put(self, request,format="json"):
		latest_hrr = self.get_object()
		if latest_hrr:
			serializer = HrrSerializer(latest_hrr,data = request.data, partial=True)
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data)
			else:
				return Response({})
		else:
			return Response({})

class UserAA(generics.ListCreateAPIView):
	'''
		- Create the AA instance
		- List all the AA instance
		- If query parameters "from" is provided
		  then filter the AA data for provided date interval
		  and return the list
	'''
	permission_classes = (IsAuthenticated,)

	def calculate_aa_data(self,aa_data_set,user_get,start_dt):
		if aa_data_set:
			final_query = aa_data_set[0]
			return final_query
		else:
			start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
			final_query = aa_data(user_get,start_date)
			device_type = quicklook.calculations.calculation_driver.which_device(user_get)
			if device_type == 'garmin':
				if final_query.get('total_time'):
					try:
						user_aa = AA.objects.get(
						user=user_get, created_at=start_date)
						aa_update_instance(user_aa, final_query)
					except AA.DoesNotExist:
						aa_create_instance(user_get, final_query, start_date)
				return final_query
			elif device_type == 'fitbit':
				start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
				fitbit_hr_difference = fitbit_aa.fitbit_aa_chart_one_new(user_get,start_date)
				if fitbit_hr_difference.get('total_time'):
					try:
						user_aa = AA.objects.get(
						user=user_get, created_at=start_date)
						aa_update_instance(user_aa, fitbit_hr_difference)
					except AA.DoesNotExist:
						aa_create_instance(user_get, fitbit_hr_difference, start_date)
				return fitbit_hr_difference

	def get(self,request,format="json"):
		user_get = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		querset= self.get_queryset()
		aa_data = self.calculate_aa_data(querset,user_get,start_dt)
		return Response(aa_data, status=status.HTTP_200_OK)

	def get_queryset(self):		
		user = self.request.user

		start_dt = self.request.query_params.get('start_date', None)

		if start_dt:
			queryset = AA.objects.filter(created_at=start_dt,
							  user=user).values()
		else:
			queryset = AA.objects.all()
		return queryset

class UserAA_workout(generics.ListCreateAPIView):
	'''
		- Create the AA_workout instance
		- List all the AA_workout instance
		- If query parameters "start_date" is provided
		  then filter the AA_workout data for provided date interval
		  and return the list
	'''
	permission_classes = (IsAuthenticated,)

	def calculate_aa_data(self,aa_data_set,user_get,start_dt):
		if aa_data_set:
			final_query = aa_data_set[0]
			return final_query
		else:
			device_type = quicklook.calculations.calculation_driver.which_device(user_get)
			if device_type == 'garmin':
				start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
				final_query = aa_workout_data(user_get,start_date)
				if final_query:
					try:
						user_obj = AaWorkoutCalculations.objects.get(
						user_aa_workout=user_get, created_at=start_date)
						user_obj.data = final_query
						user_obj.save()
					except AaWorkoutCalculations.DoesNotExist:
						create_workout_instance(user_get, final_query, start_date)
				else:
					final_query = {}
				return final_query
			elif device_type == 'fitbit':
				start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
				fitbit_aa2_workout = fitbit_aa.calculate_AA2_workout(user_get,start_date)
				if fitbit_aa2_workout:
					try:
						user_obj = AaWorkoutCalculations.objects.get(
						user_aa_workout=user_get, created_at=start_date)
						user_obj.data = fitbit_aa2_workout
						user_obj.save()
					except AaWorkoutCalculations.DoesNotExist:
						create_workout_instance(user_get, fitbit_aa2_workout, start_date)
				else:
					fitbit_aa2_workout = {}
				return fitbit_aa2_workout


	def get(self,request,format="json"):
		user_get = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		querset= self.get_queryset()
		aa_workout_data = self.calculate_aa_data(querset,user_get,start_dt)

		if aa_workout_data.get('data'):
			aa_workout_data_json = ast.literal_eval(aa_workout_data.get('data'))
			return Response(aa_workout_data_json, status=status.HTTP_200_OK)
		else:
			return Response(aa_workout_data, status=status.HTTP_200_OK)

	def get_queryset(self):
		user = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		if start_dt:
			queryset = AaWorkoutCalculations.objects.filter(created_at=start_dt,
							  user_aa_workout=user).values()
		else:
			queryset = AaWorkoutCalculations.objects.all()
		return queryset

class UserAA_daily(generics.ListCreateAPIView):
	'''
		- Create the AA_daily instance
		- List all the AA_daily instance
		- If query parameters "start_date" is provided
		  then filter the AA_daily data for provided date interval
		  and return the list
	'''
	permission_classes = (IsAuthenticated,)

	def calculate_aa_data(self,aa_data_set,user_get,start_dt):
		if aa_data_set:
			final_query = aa_data_set[0]
			return final_query
		else:
			device_type = quicklook.calculations.calculation_driver.which_device(user_get)
			if device_type == 'garmin':
				start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
				final_query = daily_aa_data(user_get,start_date)
				if final_query:
					try:
						user_obj = AaCalculations.objects.get(
						user_aa=user_get, created_at=start_date)
						user_obj.data = final_query
						user_obj.save()
					except AaCalculations.DoesNotExist:
						create_aa_instance(user_get, final_query, start_date)
				else:
					final_query = {}
				return final_query
			elif device_type == 'fitbit':
				start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
				fitbit_aa2_daily = fitbit_aa.calculate_AA2_daily(user_get,start_date)
				if fitbit_aa2_daily:
					try:
						user_obj = AaCalculations.objects.get(
						user_aa=user_get, created_at=start_date)
						user_obj.data = fitbit_aa2_daily
						user_obj.save()
					except AaCalculations.DoesNotExist:
						create_aa_instance(user_get, fitbit_aa2_daily, start_date)
				else:
					fitbit_aa2_daily = {}
				return fitbit_aa2_daily

	def get(self,request,format="json"):
		user_get = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		querset= self.get_queryset()
		aa_daily = self.calculate_aa_data(querset,user_get,start_dt)

		if aa_daily.get('data'):
			aa_daily_json = ast.literal_eval(aa_daily.get('data'))
			return Response(aa_daily_json, status=status.HTTP_200_OK)
		else:
			return Response(aa_daily, status=status.HTTP_200_OK)

	def get_queryset(self):
		user = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		if start_dt:
			queryset = AaCalculations.objects.filter(created_at=start_dt,
							  user_aa=user).values()
		else:
			queryset = AaCalculations.objects.all()
		return queryset

class UserAA_low_high_values(generics.ListCreateAPIView):
	'''
		- Create the AA_low_high_values instance
		- List all the AA_low_high_values instance
		- If query parameters "start_date" is provided
		  then filter the AA_low_high_values data for provided date interval
		  and return the list
	'''
	permission_classes = (IsAuthenticated,)

	def calculate_aa_data(self,aa_data_set,user_get,start_dt):
		if aa_data_set:
			final_query = aa_data_set[0]
			return final_query
		else:
			device_type = quicklook.calculations.calculation_driver.which_device(user_get)
			if device_type == 'garmin':
				start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
				final_query = aa_low_high_end_data(user_get,start_date)
				if final_query:
					try:
						user_obj = TimeHeartZones.objects.get(
						user=user_get, created_at=start_date)
						user_obj.data = final_query
						user_obj.save()
					except TimeHeartZones.DoesNotExist:
						create_heartzone_instance(user_get, final_query, start_date)
				else:
					final_query = {}
				return final_query
			elif device_type == 'fitbit':
				start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
				fitbit_aa3 = fitbit_aa.calculate_AA3(user_get,start_date,user_input_activities=None)
				if fitbit_aa3:
					try:
						user_obj = TimeHeartZones.objects.get(
						user=user_get, created_at=start_date)
						user_obj.data = fitbit_aa3
						user_obj.save()
					except TimeHeartZones.DoesNotExist:
						create_heartzone_instance(user_get, fitbit_aa3, start_date)
				else:
					fitbit_aa3 = {}
				return fitbit_aa3

	def get(self,request,format="json"):
		user_get = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		querset= self.get_queryset()
		aa_low_high_values = self.calculate_aa_data(querset,user_get,start_dt)

		if aa_low_high_values.get('data'):
			aa_low_high_values_json = ast.literal_eval(aa_low_high_values.get('data'))
			return Response(aa_low_high_values_json, status=status.HTTP_200_OK)
		else:
			return Response(aa_low_high_values, status=status.HTTP_200_OK)

	def get_queryset(self):
		user = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		if start_dt:
			queryset = TimeHeartZones.objects.filter(created_at=start_dt,
							  user=user).values()
		else:
			queryset = TimeHeartZones.objects.all()
		return queryset

class UserAA_twentyfour_hour(generics.ListCreateAPIView):
	'''
		- Create the TwentyfourHourAA instance
		- List all the TwentyfourHourAA instance
		- If query parameters "from" is provided
		  then filter the TwentyfourHourAA data for provided date interval
		  and return the list
	'''
	permission_classes = (IsAuthenticated,)

	def calculate_aa_data(self,aa_data_set,user_get,start_dt):
		if aa_data_set:
			final_query = aa_data_set[0]
			return final_query
		else:
			start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
			device_type = quicklook.calculations.calculation_driver.which_device(user_get)
			if device_type == 'fitbit':
				fitbit_hr_difference = fitbit_aa.fitbit_aa_twentyfour_hour_chart_one_new(user_get,start_date)
				if fitbit_hr_difference.get('total_time'):
					try:
						user_aa = TwentyfourHourAA.objects.get(
						user=user_get, created_at=start_date)
						aa_whole_day_update_instance(user_aa, fitbit_hr_difference)
					except TwentyfourHourAA.DoesNotExist:
						aa_whole_day_create_instance(user_get, fitbit_hr_difference, start_date)
				return fitbit_hr_difference
			elif device_type == 'garmin':
				final_query = twentyfour_hour_aa_data(user_get,start_date)
				if final_query.get('total_time'):
					try:
						user_aa = TwentyfourHourAA.objects.get(
						user=user_get, created_at=start_date)
						aa_whole_day_update_instance(user_aa, final_query)
					except TwentyfourHourAA.DoesNotExist:
						res = aa_whole_day_create_instance(user_get, final_query, start_date)
				return final_query

	def get(self,request,format="json"):
		user_get = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		querset= self.get_queryset()
		aa_data = self.calculate_aa_data(querset,user_get,start_dt)
		return Response(aa_data, status=status.HTTP_200_OK)

	def get_queryset(self):
		user = self.request.user

		start_dt = self.request.query_params.get('start_date', None)

		if start_dt:
			queryset = TwentyfourHourAA.objects.filter(created_at=start_dt,
							  user=user).values()
		else:
			queryset = TwentyfourHourAA.objects.all()
		return queryset

class UserAA_twentyfour_hour_low_high_values(generics.ListCreateAPIView):
	'''
		- Create the AA_low_high_values instance
		- List all the AA_low_high_values instance
		- If query parameters "start_date" is provided
		  then filter the AA_low_high_values data for provided date interval
		  and return the list
	'''
	permission_classes = (IsAuthenticated,)

	def calculate_aa_data(self,aa_data_set,user_get,start_dt):
		if aa_data_set:
			final_query = aa_data_set[0]
			return final_query
		else:
			device_type = quicklook.calculations.calculation_driver.which_device(user_get)
			start_date = datetime.strptime(start_dt, "%Y-%m-%d").date()
			if device_type == 'fitbit':
				fitbit_aa3 = fitbit_aa.calculate_twentyfour_hour_AA3(user_get,start_date,
												user_input_activities=None)
				if fitbit_aa3:
					try:
						user_obj = TwentyfourHourTimeHeartZones.objects.get(
						user=user_get, created_at=start_date)
						user_obj.data = fitbit_aa3
						user_obj.save()
					except TwentyfourHourTimeHeartZones.DoesNotExist:
						create_time_heartzone_instance(user_get, fitbit_aa3, start_date)
				else:
					fitbit_aa3 = {}
				return fitbit_aa3
			elif device_type == 'garmin':
				final_query = calculate_garmin_twentyfour_hour_AA3(user_get,start_date,
												user_input_activities=None)
				if final_query:
					try:
						user_obj = TwentyfourHourTimeHeartZones.objects.get(
						user=user_get, created_at=start_date)
						user_obj.data = final_query
						user_obj.save()
					except TwentyfourHourTimeHeartZones.DoesNotExist:
						create_time_heartzone_instance(user_get, final_query, start_date)
				else:
					final_query = {}
				return final_query


	def get(self,request,format="json"):
		user_get = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		querset= self.get_queryset()
		aa_low_high_values = self.calculate_aa_data(querset,user_get,start_dt)

		if aa_low_high_values.get('data'):
			aa_low_high_values_json = ast.literal_eval(aa_low_high_values.get('data'))
			return Response(aa_low_high_values_json, status=status.HTTP_200_OK)
		else:
			return Response(aa_low_high_values, status=status.HTTP_200_OK)

	def get_queryset(self):
		user = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		if start_dt:
			queryset = TwentyfourHourTimeHeartZones.objects.filter(created_at=start_dt,
							  user=user).values()
		else:
			queryset = TwentyfourHourTimeHeartZones.objects.all()
		return queryset

def avg_all_dashboard_data(all_data):
	week_data = all_data['week']
	month_data = all_data['month']
	year_data = all_data['year']
	if week_data and len(week_data) >= 2:
		print(week_data,"week data")
	if month_data and len(month_data) >= 2:
		for index,value in enumerate(month_data):
			value = ast.literal_eval(value)
			if index > 0:
				for key,data in value.items():
					pass

	if week_data and len(week_data) >= 2:
		pass

def create_aa_dashboard_format(data,start_dt=None,custom_range=None):
	all_data = {
				"today":[],
				"yesterday":[],
				"week":[],
				"month":[],
				"year":[],
				}
	# print(start_dt,"start_dt")
	start_dt_date_obj = datetime.strptime(start_dt,'%Y-%m-%d').date()
	yesterday_date = start_dt_date_obj - timedelta(days=1)
	# print(yesterday_date,"yesterday_date")
	week_date = yesterday_date - timedelta(days=6)
	# print(week_date,"week_date")
	month_date = yesterday_date - timedelta(days=29)
	# print(month_date,"month_date")
	for single_data in data:
		print(type(single_data.data),"single data")
		if custom_range:
			pass
		elif start_dt and not custom_range:
			start_date = single_data.created_at
			if start_dt_date_obj == start_date:
				all_data["today"].append(single_data.data)
			if yesterday_date == start_date:
				all_data["yesterday"].append(single_data.data)
			if start_date <= yesterday_date and start_date >= week_date:
				all_data["week"].append(single_data.data)
			if start_date <= yesterday_date and start_date >= month_date:
				all_data["month"].append(single_data.data)
			if start_date <= yesterday_date:
				all_data["year"].append(single_data.data)
	avg_all_dashboard_data(all_data)
	# print(all_data,"all_data")

class UserAAdashboadTable(generics.ListCreateAPIView):
	'''This class create the AA dashboard ranges table'''

	def get(self,request,format="json"):
		user_get = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		custom_range = self.request.query_params.get('custom_range', None)
		querset = self.get_queryset()
		create_aa_dashboard_format(querset,start_dt,custom_range)

	def get_queryset(self):
		user = self.request.user
		start_dt = self.request.query_params.get('start_date', None)
		custom_range = self.request.query_params.get('custom_range', None)
		if custom_range:
			queryset = AAdashboard.objects.filter(
				created_at__range=custom_range,user=user)
		elif start_dt and not custom_range:
			current_time  = datetime.now()
			current_year = current_time.year
			from_date = '{}-01-01'.format(str(current_year))
			queryset = AAdashboard.objects.filter(
				created_at__range=[from_date,start_dt],user=user)
		return queryset

def aa_ranges_api(request):
	user = request.user
	user_age = user.profile.age()
	aa_ranges =fitbit_aa.belowaerobic_aerobic_anaerobic(user,user_age)
	return JsonResponse({"0":aa_ranges})

def calculate_garmin_twentyfour_hour_AA3(user,start_date,user_input_activities=None):
	hr_dataset = get_garmin_hr_data(user,start_date)
	start_dt = 0
	hr_time_diff = get_garmin_hrr_timediff(hr_dataset,start_dt)
	all_activities_heartrate_list = hr_time_diff['hr_values']
	all_activities_timestamp_list = hr_time_diff['time_diff']

	AA_data = TwentyfourHourTimeHeartZones.objects.filter(user=user,created_at=start_date)
	response = fitbit_aa.calculate_AA_chart3(user,start_date,user_input_activities,\
									AA_data,all_activities_heartrate_list,
									all_activities_timestamp_list)
	if response['total']['total_duration']is not None:
		total_time = 86400

		for key,value in response.items():
			if key != 'total':
				prcnt_total_duration_in_zone = (response[key]['time_in_zone']/total_time)*100
				response[key]['prcnt_total_duration_in_zone'] = int(Decimal(prcnt_total_duration_in_zone).quantize(0,ROUND_HALF_UP))

		heartrate_not_recorded = response['heartrate_not_recorded']

		heartrate_not_recorded['time_in_zone'] = total_time-response['total']['total_duration']

		percent_hrr_not_recorded = (heartrate_not_recorded['time_in_zone']/total_time)*100
		percent_hrr_not_recorded = int(Decimal(percent_hrr_not_recorded).quantize(0,ROUND_HALF_UP))

		heartrate_not_recorded['prcnt_total_duration_in_zone'] = percent_hrr_not_recorded
		response['total']['total_duration'] = total_time

		return response
	else:
		return {}

def twentyfour_hour_aa_data(user_get,start_date,user_input_activities=None):
	hr_dataset = get_garmin_hr_data(user_get,start_date)
	start_dt = 0
	hrr_data = get_garmin_hrr_timediff(hr_dataset,start_dt)
	garmin_hr_difference = fitbit_aa.fitbit_aa_twentyfour_hour_chart_one(user_get,start_date, hrr_data)
	total_time = 86400
	if garmin_hr_difference['total_time']:
		garmin_hr_difference['hrr_not_recorded']=total_time-garmin_hr_difference['total_time']

		percent_anaerobic = (garmin_hr_difference['anaerobic_zone']/total_time)*100
		percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))

		percent_aerobic = (garmin_hr_difference['aerobic_zone']/total_time)*100
		percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))

		percent_below_aerobic = (garmin_hr_difference['below_aerobic_zone']/total_time)*100
		percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))

		percent_hrr_not_recorded = (garmin_hr_difference['hrr_not_recorded']/total_time)*100
		percent_hrr_not_recorded = int(Decimal(percent_hrr_not_recorded).quantize(0,ROUND_HALF_UP))

		garmin_hr_difference['percent_anaerobic'] = percent_anaerobic
		garmin_hr_difference['percent_hrr_not_recorded'] = percent_hrr_not_recorded
		garmin_hr_difference['percent_below_aerobic'] = percent_below_aerobic
		garmin_hr_difference['percent_aerobic'] = percent_aerobic

		garmin_hr_difference['total_time'] = total_time

	return garmin_hr_difference

def get_garmin_hrr_timediff(hr_dataset,start_date):
	hr = []
	hr_time_diff = []
	hr_dataset = sorted(hr_dataset, key = lambda i: i['time'])
	
	dataset = []
	for index, single_time in enumerate(hr_dataset):
		if hr_dataset[index]['time'] <= 86400:
			dataset.append({'time': hr_dataset[index]["time"], 
							'value': hr_dataset[index]["value"]})
	hr_dataset = dataset
	
	for index, single_time in enumerate(hr_dataset):
		act_interval_time = hr_dataset[index]["time"]
		act_interval_hr = hr_dataset[index]["value"]

		if index == len(hr_dataset)-1:
			end_date = hr_dataset[len(hr_dataset)-1]["time"]
			diff_times = end_date - act_interval_time
			hr_time_diff.append(diff_times)

		else:
			act_pre_interval_time = hr_dataset[index+1]["time"]
			diff_times = act_pre_interval_time - act_interval_time
			hr_time_diff.append(diff_times)
		hr.append(act_interval_hr)
		index += 1

	return {'time_diff': hr_time_diff, 'hr_values': hr}

def get_garmin_hr_data(user_get,start_date):
	hr_dataset = []
	date_format ='%Y-%m-%d'
	start_dt = start_date.strftime('%Y-%m-%d')
	start_date_time_obj = int(time.mktime(time.strptime(start_dt,date_format)))
	hr_qs = UserGarminDataDaily.objects.filter(
							start_time_in_seconds=start_date_time_obj,
							user=user_get).last()
	if hr_qs != None:
		hrr_qs = ast.literal_eval(hr_qs.data)
		hr_data = hrr_qs['timeOffsetHeartRateSamples']
		for keys in hr_data:
			act_interval_time = ast.literal_eval(keys)
			act_interval_hr = hr_data[keys]
			hr_dataset.append({'time': act_interval_time, 'value':act_interval_hr})
	return hr_dataset

# Parse the fit files and return the heart beat and timstamp
def fitfile_parse(obj,offset,start_date_str):
	try:
		heartrate_complete = []
		timestamp_complete = []
		obj_start_year = int(start_date_str.split('-')[0])
		obj_start_month = int(start_date_str.split('-')[1])
		obj_start_date = int(start_date_str.split('-')[2])
		
		x = [(FitFile(x.fit_file)).get_messages('record') for x in obj]
		for record in x:
			# print(type(record)) # generator
			for record_data in record:
				# print(type(record_data)) # <class 'fitparse.records.DataMessage'>
				for single_record in record_data:
					# print(type(ss)) # <class 'fitparse.records.FieldData'>
					if(single_record.name=='heart_rate'):
						single_heartrate_value = single_record.value
						if single_heartrate_value:
							heartrate_complete.extend([single_heartrate_value])

					if(single_record.name=='timestamp'):
						single_timestamp_vale = single_record.value
						timestamp_complete.extend([single_timestamp_vale])
		# print(timestamp_complete,"timestamp_complete")
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
		# print(timestamp_selected_date,"timestamp_selected_date")
		to_timestamp = []
		for i,k in enumerate(timestamp_selected_date):
			dtt = k.timetuple()
			ts = time.mktime(dtt)
			ts = ts+offset
			to_timestamp.extend([ts])
		# print(to_timestamp,"to_timestamp")
		timestamp_difference = []
		for i,k in enumerate(to_timestamp):
			try:
				dif_tim = to_timestamp[i+1] - to_timestamp[i]
				timestamp_difference.extend([dif_tim])
			except IndexError:
				timestamp_difference.extend([1])

		final_heartrate = []
		final_timestamp = []
		for i,k in zip(heartrate_selected_date,timestamp_difference):
			if (k <= 200) and (k >= 0):
				final_heartrate.extend([i])
				final_timestamp.extend([k])
		# print(to_timestamp,"to_timestamp") 

	except:
		final_heartrate = []
		final_timestamp = []
		to_timestamp = []
		logging.exception("message")

	return (final_heartrate,final_timestamp,to_timestamp)

def get_fitfiles(user,start_date,start,end,start_date_timestamp=None,end_date_timestamp=None):
	'''
		get the today fitfiles or 3 days fitfiles
	'''
	activity_files_qs=UserGarminDataActivity.objects.filter(
		user=user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
	fitfiles_obj = GarminFitFiles.objects.filter(user=user,fit_file_belong_date=start_date)
	if not fitfiles_obj or len(activity_files_qs) != len(fitfiles_obj):
		fitfiles_obj=GarminFitFiles.objects.filter(user=user,created_at__range=[start,end])
	return fitfiles_obj

def update_helper(instance,data_dict):
	'''
		Helper function to update the instance
		with provided key,value pair
		Warning: This will not trigger any signals
				 like post or pre save
	'''
	
	# attr_original_val = {}
	# for attr, value in data_dict.items():
	# 	attr_original_val[attr] = getattr(instance,attr)
	# 	setattr(instance,attr,value)

	# try:
	# 	with transaction.atomic():
	# 		instance.save()
	# except DatabaseError as e:
	# 	# If any error, set instance to previous state
	for attr, value in data_dict.items():
		setattr(instance,attr,value)
	instance.save()

# update Hrr table

def update_hrr_instance(instance, data):
	update_helper(instance, data)


#creating hrr table

def create_hrr_instance(user, data, start_date):
	created_at = start_date
	Hrr.objects.create(user_hrr = user,created_at = created_at,**data)


def add_created_activity1(
	di,data,below_aerobic,anaerobic,aerobic_range,anaerobic_range,below_aerobic_range):
	'''
		This function will add user created activty in user input form to AA calculation
	'''
	# print(di,"di")
	# print(data,"data in side the below")
	data_copy = data.copy()
	modified_data = {}
	data_copy["aerobic_range"] = aerobic_range
	data_copy["anaerobic_range"] = anaerobic_range
	data_copy["below_aerobic_range"] = below_aerobic_range
	for i,single_activity in enumerate(di):
		avg_hr = single_activity.get("averageHeartRateInBeatsPerMinute",0.0)
		if not avg_hr:
			avg_hr = ''
		if avg_hr != '' and int(avg_hr) >= anaerobic:
			data_anaerobic_zone = data_copy.get("anaerobic_zone",0)
			if data_anaerobic_zone:
				data_copy["anaerobic_zone"] = single_activity.get(
					"durationInSeconds",0.0) + data_copy.get("anaerobic_zone",0)
			else:
				data_copy["anaerobic_zone"] = single_activity.get(
					"durationInSeconds",0.0)
			if data_copy.get("total_time",0):
				data_copy["total_time"] = single_activity.get(
				"durationInSeconds",0.0)+data_copy.get("total_time",0)
			else:
				data_copy["total_time"] = single_activity.get(
				"durationInSeconds",0.0)
		elif avg_hr != '' and int(avg_hr) < anaerobic and int(avg_hr) > below_aerobic:
			data_aerobic_zone = data_copy.get("aerobic_zone",0)
			if data_aerobic_zone:
				data_copy["aerobic_zone"] = single_activity.get(
					"durationInSeconds",0.0)+data_copy.get("aerobic_zone",0)
			else:
				data_copy["aerobic_zone"] = single_activity.get("durationInSeconds",0.0)
			if data_copy.get("total_time",0):
				data_copy["total_time"] = single_activity.get(
					"durationInSeconds",0.0)+data_copy.get("total_time",0)
			else:
				data_copy["total_time"] = single_activity.get(
				"durationInSeconds",0.0)
		elif avg_hr != '' and int(avg_hr) > 0.0 and int(avg_hr) <= below_aerobic:
			data_below_aerobic_zone = data_copy.get("below_aerobic_zone",0)
			if data_below_aerobic_zone:
				data_copy["below_aerobic_zone"] = single_activity.get(
					"durationInSeconds",0.0)+data_copy.get("below_aerobic_zone",0)
				
			else:
				data_copy["below_aerobic_zone"] = single_activity.get("durationInSeconds",0.0)
			if data_copy.get("total_time",0):
				data_copy["total_time"] = single_activity.get(
					"durationInSeconds",0.0)+data_copy.get("total_time",0)
			else:
				data_copy["total_time"] = single_activity.get(
					"durationInSeconds",0.0)
		elif avg_hr == '' or int(avg_hr) == 0:
			if data_copy.get("total_time",0):
				data_copy["total_time"] = single_activity.get(
						"durationInSeconds",0.0)+data_copy.get("total_time",0)
			else:
				data_copy["total_time"] = single_activity.get(
						"durationInSeconds",0.0)
	
	return data_copy

def add_total_percent(added_data):
	'''
		Add percentages to the All Zones,HR not recorded
	'''
	# print(added_data,"added_data")
	try:
		if added_data.get("anaerobic_zone",0):
			added_data["percent_anaerobic"] = added_data.get(
				"anaerobic_zone",0)/added_data.get("total_time",0)*100
		else:
			added_data["percent_anaerobic"] = 0 
	except ZeroDivisionError:
		added_data["percent_anaerobic"] = 0 
	try:
		if added_data.get("aerobic_zone",0):
			added_data["percent_aerobic"] = added_data.get(
				"aerobic_zone",0)/added_data.get("total_time",0)*100
		else:
			added_data["percent_aerobic"] = 0
	except ZeroDivisionError:
		added_data["percent_aerobic"] = 0
	try:
		if added_data.get("below_aerobic_zone",0):
			added_data["percent_below_aerobic"] = added_data.get(
				"below_aerobic_zone",0)/added_data.get("total_time",0)*100
		else:
			added_data["percent_below_aerobic"] = 0
	except ZeroDivisionError:
		added_data["percent_below_aerobic"] = 0
	try:
		if added_data.get("hrr_not_recorded",0):	
			added_data["percent_hrr_not_recorded"] = added_data.get(
				"hrr_not_recorded",0)/added_data.get("total_time",0)*100
		else:
			added_data["percent_hrr_not_recorded"] = 0
	except ZeroDivisionError:
		added_data["percent_hrr_not_recorded"] = 0
	added_data['total_percent'] = 100
	return added_data

def aa_data(user,start_date):
	'''
		Calculate the A/A Aeroboc and Anarobic zones data
	'''
	start = start_date
	end = start_date + timedelta(days=3)
	start_date_str = start_date.strftime('%Y-%m-%d')

	start_date_timestamp = start_date
	start_date_timestamp = start_date_timestamp.timetuple()
	start_date_timestamp = time.mktime(start_date_timestamp)
	end_date_timestamp = start_date_timestamp + 86400

	activity_files_qs=UserGarminDataActivity.objects.filter(user=user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
	activity_files = [pr.data for pr in activity_files_qs]
	garmin_activity_keys = []
	garmin_workout = []
	if activity_files:
		one_activity_file_dict =  ast.literal_eval(activity_files[0])
		offset = one_activity_file_dict['startTimeOffsetInSeconds']
		for i,single_activity in enumerate(activity_files):
			one_activity_file =  ast.literal_eval(single_activity)
			garmin_activity_keys.append(one_activity_file['summaryId'])
			garmin_workout.append(one_activity_file)

	else:
		activity_files = []
	activities_dic = get_usernput_activities(
		user,start_date)

	hrr_not_recorded_list = []
	hrr_recorded = []
	activities_summary_id = []
	hrr_summaryid = []
	if activity_files:
		for i in range(len(activity_files)):
			one_activity_file_dict =  ast.literal_eval(activity_files[i])
			activities_summary_id.append(one_activity_file_dict['summaryId'])
			garmin_id = one_activity_file_dict.get('summaryId')
			if 'averageHeartRateInBeatsPerMinute' in one_activity_file_dict.keys():
				if (one_activity_file_dict['averageHeartRateInBeatsPerMinute'] == 0 or ''):
					if activities_dic:
						for index,single_ui_act in activities_dic.items():
							ui_id = single_ui_act.get("summaryId")
							garmin_id = one_activity_file_dict.get('summaryId')
							ui_hr = single_ui_act.get("averageHeartRateInBeatsPerMinute")
							garmin_hr = one_activity_file_dict.get("averageHeartRateInBeatsPerMinute")
							if ui_hr == None or ui_hr == '':
								ui_hr = 0
							if garmin_hr == None or garmin_hr == '':
								garmin_hr = 0
							if ui_id == garmin_id and garmin_hr == ui_hr:
								if garmin_id not in hrr_summaryid:
									hrr_not_recorded_time = one_activity_file_dict.get('durationInSeconds',0)
									hrr_not_recorded_list.append(hrr_not_recorded_time)
									hrr_summaryid.append(garmin_id)
					else:
						if garmin_id not in hrr_summaryid:
							hrr_not_recorded_time = one_activity_file_dict.get('durationInSeconds',0)
							hrr_not_recorded_list.append(hrr_not_recorded_time)
							hrr_summaryid.append(garmin_id)
			else:
				if activities_dic:
					for index,single_ui_act in activities_dic.items():
						ui_id = single_ui_act.get("summaryId")
						garmin_id = one_activity_file_dict.get('summaryId')
						ui_hr = single_ui_act.get("averageHeartRateInBeatsPerMinute")
						garmin_hr = one_activity_file_dict.get("averageHeartRateInBeatsPerMinute")
						if ui_hr == None or ui_hr == '':
							ui_hr = 0
						if garmin_hr == None or garmin_hr == '':
							garmin_hr = 0
						if ui_id == garmin_id and ui_hr == 0:
							if garmin_id not in hrr_summaryid:
								hrr_not_recorded_time = one_activity_file_dict.get('durationInSeconds',0)
								hrr_not_recorded_list.append(hrr_not_recorded_time)
								hrr_summaryid.append(garmin_id)
				else:
					if garmin_id not in hrr_summaryid:
						hrr_not_recorded_time = one_activity_file_dict.get('durationInSeconds',0)
						hrr_not_recorded_list.append(hrr_not_recorded_time)
						hrr_summaryid.append(garmin_id)	

	ui_data = _get_activities(user,start_date_str)
	ui_data_keys = [ui_keys for ui_keys in ui_data.keys()]
	ui_data_hrr = []
	ui_data_keys_test = []

	for ui_data_single in ui_data.values():
		if ui_data_single.get('activityType') == 'HEART_RATE_RECOVERY':
			summaryId = ui_data_single['summaryId']
			ui_data_hrr.append(summaryId)
		elif ui_data_single.get("duplicate") == False:
				summaryId = ui_data_single['summaryId'] 
				ui_data_keys_test.append(summaryId)
	data = {"total_time":None,
			"aerobic_zone":None,
			"anaerobic_zone":None,
			"below_aerobic_zone":None,
			"aerobic_range":'',
			"anaerobic_range":'',
			"below_aerobic_range":'',
			"hrr_not_recorded":None,
			"percent_hrr_not_recorded":None,
			"percent_aerobic":None,
			"percent_below_aerobic":None,
			"percent_anaerobic":None,
			"total_percent":None}

	activities = []
	user_input_keys = []
	created_activity_dict = {}
	id_act = 0
	user_input_workout_keys = []
	user_input_workout_data = []
	garmin_list,garmin_dic = get_garmin_activities(
		user,start_date_timestamp,end_date_timestamp)
	manually_edited_dic,manually_edited_list = get_garmin_manully_activities(
		user,start_date_timestamp,end_date_timestamp)

	user_age = user.profile.age()

	filtered_activities_files = get_filtered_activity_stats(activities_json=garmin_list,
													user_age=user_age,
													manually_updated_json=manually_edited_dic,
													userinput_activities=activities_dic,
													user=user,calendar_date=start_date,)
	# print(filtered_activities_files,"filtered activities")
	filtered_activities_only = filtered_activities_files.copy()
	filtered_activities_only = remove_hrr_file(filtered_activities_only)
	if activities_dic:
		for i,k in enumerate(filtered_activities_files):
			user_input_keys.append(filtered_activities_files[i]['summaryId'])
			user_input_summary_id = list(set(user_input_keys))
			created_activity = list(set(
				user_input_summary_id) - set(activities_summary_id))
			if created_activity and filtered_activities_files[i]['summaryId'] in created_activity:
				summayid = filtered_activities_files[i]['summaryId']
				created_activity_dict[summayid] = k
			if filtered_activities_files[i]['activityType'] == 'HEART_RATE_RECOVERY':
				id_act = int(filtered_activities_files[i]['summaryId'])
				activities.append(filtered_activities_files[i])
			else:
				user_input_workout_keys.append(filtered_activities_files[i]['summaryId'])
				user_input_workout_data.append(filtered_activities_files[i])
	else:
		for i,k in enumerate(filtered_activities_files):
			user_input_keys.append(filtered_activities_files[i]['summaryId'])
	user_created_activity = list(set(user_input_workout_keys)-set(activities_summary_id))
	# garmin_workout_keys = set(activities_summary_id) - set(activities_hrr)
	user_created_activity_list = []
	if user_input_workout_data and user_created_activity:
		for single_activity in user_input_workout_data:
			for single_activity_key in user_created_activity:
				if single_activity_key == single_activity['summaryId']:
					user_created_activity_list.append(single_activity)
	remove_in_workout = []
	# print(filtered_activities_files,"filtered_activities_files")
	for i,single_actiivty in enumerate(filtered_activities_files):
		if single_actiivty.get("manual",0) == True:
			created_activity_dict[single_actiivty.get('summaryId',0)] = single_actiivty
			for i,k in enumerate(filtered_activities_files):
				garmin_id = single_actiivty.get("summaryId")
				ui_id = filtered_activities_files[i].get('summaryId')
				garmin_hr = single_actiivty.get("averageHeartRateInBeatsPerMinute",0)
				ui_hr = filtered_activities_files[i].get("averageHeartRateInBeatsPerMinute",0)
				garmin_duration = single_actiivty.get("durationInSeconds",0)
				ui_duration = filtered_activities_files[i].get("durationInSeconds",0)
				if ui_hr == None or ui_hr == '':
					ui_hr = 0
				if garmin_hr == None or garmin_hr == '':
					garmin_hr = 0
				if garmin_duration == None or garmin_duration == '':
					garmin_duration = 0
				if ui_duration == None or ui_duration == '':
					ui_duration = 0
				if (garmin_id == ui_id) and ((garmin_hr != ui_hr) or (garmin_duration != ui_duration)):
					user_created_activity_list.append(k)
					remove_in_workout.append(int(k["summaryId"]))
		elif (single_actiivty.get("manual",0) != True 
			and activities_dic
			and activities_dic.get(single_actiivty["summaryId"])):
			for i,k in enumerate(filtered_activities_files):
				garmin_id = single_actiivty.get("summaryId")
				ui_id = filtered_activities_files[i].get('summaryId')
				garmin_hr = single_actiivty.get("averageHeartRateInBeatsPerMinute",0)
				ui_hr = filtered_activities_files[i].get("averageHeartRateInBeatsPerMinute",0)
				if ui_hr == None or ui_hr == '':
					ui_hr = 0
				if garmin_hr == None or garmin_hr == '':
					garmin_hr = 0
				if (garmin_id == ui_id) and ((not garmin_hr and ui_hr) or (garmin_hr != ui_hr)):
					user_created_activity_list.append(k)
					remove_in_workout.append(int(k["summaryId"]))

	for single_activity in created_activity_dict.values():
		hr_value = single_activity.get('averageHeartRateInBeatsPerMinute',0)
		if hr_value == 0 or hr_value == '' or not hr_value:
			if activities_dic:
				ui_activity = activities_dic.get(single_activity["summaryId"],0)
				if ui_activity:
					hrr_not_recorded_list.append(ui_activity.get('durationInSeconds',0))

	if hrr_not_recorded_list:
		hrr_not_recorded_seconds = sum(hrr_not_recorded_list)
		data["hrr_not_recorded"] = hrr_not_recorded_seconds
	workout = []
	hrr = []
	start = start_date
	end = start_date + timedelta(days=3)
	fitfiles_obj = get_fitfiles(user,start_date,start,end,start_date_timestamp,end_date_timestamp)
	if activities_dic:
		for tmp in fitfiles_obj:
			meta = tmp.meta_data_fitfile
			meta = ast.literal_eval(meta)
			data_id = int(meta['activityIds'][0])
			if id_act == data_id:
				hrr.append(tmp)
			elif (str(data_id) in user_input_workout_keys) and data_id not in remove_in_workout:
				workout.append(tmp)
	else:
		
		for tmp in fitfiles_obj:
			meta = tmp.meta_data_fitfile
			meta = ast.literal_eval(meta)
			data_id = meta['activityIds'][0]
			if str(data_id) in user_input_keys:
				workout.append(tmp)
			elif str(data_id) in ui_data_hrr:
				hrr.append(tmp)		

	aa_ranges =fitbit_aa.belowaerobic_aerobic_anaerobic(user,user_age)
	update =fitbit_aa.Update_AA_ranges_by_ages(user)
	below_aerobic_value = update[0]
	anaerobic_value = update[1]
	aerobic_range = update[2]
	anaerobic_range = update [3]
	below_aerobic_range = update [4]

	all_activities_heartrate = []
	all_activities_timestamp = []
	activies_timestamp = []
	
	if workout:
		for tmp in workout:
			workout_activities = fitfile_parse([tmp],offset,start_date_str)
			workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_activities
			all_activities_heartrate.append(workout_final_heartrate)
			all_activities_timestamp.append(workout_final_timestamp)
			activies_timestamp.append(workout_timestamp)
		all_activities_heartrate_list = [single_list for single_list in all_activities_heartrate if single_list]
		all_activities_timestamp_list = [single_list for single_list in all_activities_timestamp if single_list]
		activies_timestamp = [single_list for single_list in activies_timestamp if single_list]
		all_activities_heartrate_list = list(itertools.chain.from_iterable(all_activities_heartrate_list))
		all_activities_timestamp_list = list(itertools.chain.from_iterable(all_activities_timestamp_list))
		anaerobic_range_list = []
		below_aerobic_list = []
		aerobic_list = []
		for a, b in zip(all_activities_heartrate_list,all_activities_timestamp_list):
			# print(a,"aaaaaaaaa")
			if a > anaerobic_value:
				anaerobic_range_list.extend([b])
			elif a < below_aerobic_value:
				below_aerobic_list.extend([b])
			else:
				aerobic_list.extend([b])

		time_in_aerobic = sum(aerobic_list)
		time_in_below_aerobic = sum(below_aerobic_list)
		time_in_anaerobic = sum(anaerobic_range_list)
		
		if hrr_not_recorded_list:
			total_time =  hrr_not_recorded_seconds+time_in_aerobic+time_in_below_aerobic+time_in_anaerobic 
		else:
			total_time = time_in_aerobic+time_in_below_aerobic+time_in_anaerobic
		try:
			percent_anaerobic = (time_in_anaerobic/total_time)*100
			percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))

			percent_below_aerobic = (time_in_below_aerobic/total_time)*100
			percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))

			percent_aerobic = (time_in_aerobic/total_time)*100
			percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))
			if hrr_not_recorded_list:
				percent_hrr_not_recorded = (hrr_not_recorded_seconds/total_time)*100
				percent_hrr_not_recorded = (int(Decimal(percent_hrr_not_recorded).quantize(0,ROUND_HALF_UP)))
			
			total_percent = 100
		except ZeroDivisionError:
			percent_anaerobic=''
			percent_below_aerobic=''
			percent_aerobic=''
			percent_hrr_not_recorded=''
			total_percent=''
			
		if hrr_not_recorded_list and workout:
			data = {"total_time":total_time,
					"aerobic_zone":time_in_aerobic,
					"anaerobic_zone":time_in_anaerobic,
					"below_aerobic_zone":time_in_below_aerobic,
					"aerobic_range":aerobic_range,
					"anaerobic_range":anaerobic_range,
					"below_aerobic_range":below_aerobic_range,
					"hrr_not_recorded":hrr_not_recorded_seconds,
					"percent_hrr_not_recorded":percent_hrr_not_recorded,
					"percent_aerobic":percent_aerobic,
					"percent_below_aerobic":percent_below_aerobic,
					"percent_anaerobic":percent_anaerobic,
					"total_percent":total_percent}
		elif workout:
			data = {"total_time":total_time,
					"aerobic_zone":time_in_aerobic,
					"anaerobic_zone":time_in_anaerobic,
					"below_aerobic_zone":time_in_below_aerobic,
					"aerobic_range":aerobic_range,
					"anaerobic_range":anaerobic_range,
					"below_aerobic_range":below_aerobic_range,
					"hrr_not_recorded":None,
					"percent_hrr_not_recorded":None,
					"percent_aerobic":percent_aerobic,
					"percent_below_aerobic":percent_below_aerobic,
					"percent_anaerobic":percent_anaerobic,
					"total_percent":total_percent}
		else:
			data = {"total_time":None,
					"aerobic_zone":None,
					"anaerobic_zone":None,
					"below_aerobic_zone":None,
					"aerobic_range":'',
					"anaerobic_range":'',
					"below_aerobic_range":'',
					"hrr_not_recorded":None,
					"percent_hrr_not_recorded":None,
					"percent_aerobic":None,
					"percent_below_aerobic":None,
					"percent_anaerobic":None,
					"total_percent":None}
	if user_created_activity_list:
		added_data = add_created_activity1(
			user_created_activity_list,data,below_aerobic_value,anaerobic_value,aerobic_range,anaerobic_range,below_aerobic_range)
	else:
		added_data = {}
	# print(added_data,"added_data")
	if added_data:
		final_data = add_total_percent(added_data)
		return final_data
	return data

def aa_update_helper(instance,data_dict):
	'''
		Helper function to update the instance
		with provided key,value pair
		Warning: This will not trigger any signals
				 like post or pre save
	'''
	
	for attr, value in data_dict.items():
		setattr(instance,attr,value)
	instance.save()

# update AA table

def aa_update_instance(instance, data):
	aa_update_helper(instance, data)


#creating AA table

def aa_create_instance(user, data, start_date):
	created_at = start_date
	AA.objects.create(user = user,created_at = created_at,**data)

# update TwentyfourHourAA table

def aa_whole_day_update_instance(instance, data):
	aa_update_helper(instance, data)


#creating TwentyfourHourAA table

def aa_whole_day_create_instance(user, data, start_date):
	created_at = start_date
	TwentyfourHourAA.objects.create(user = user,created_at = created_at,**data)

def aa_calculations(request):
	start_date_get = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date_get, "%Y-%m-%d").date()
	data = aa_data(request.user,start_date)
	if data.get('total_time'):
		try:
			user_aa = AA.objects.get(user=request.user, created_at=start_date)
			aa_update_instance(user_aa, data)
		except AA.DoesNotExist:
			aa_create_instance(request.user, data, start_date)
	return JsonResponse(data)

def store_garmin_aa1(user,from_date,to_date):
	print("AA calculations got started",user.username)
	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	current_date = to_date_obj
	AA1 = AA.objects.filter(user=user,created_at=from_date_obj)
	while (current_date >= from_date_obj):
		data = aa_data(user,current_date)
		if data.get('total_time') or (AA1 and not data.get('total_time')):
			print("AA calculations creating")
			try:
				user_aa = AA.objects.get(user=user, created_at=current_date)
				aa_update_instance(user_aa, data)
			except AA.DoesNotExist:
				aa_create_instance(user, data, current_date)
		else:
			print("NO AA")
		current_date -= timedelta(days=1)
	print("HRR calculations got finished")

def store_fitbit_aa1(user,from_date,to_date):
	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	current_date = to_date_obj
	while (current_date >= from_date_obj):
		activities_dict = get_usernput_activities(user,current_date)
		data = fitbit_aa.fitbit_aa_chart_one_new(user,current_date,user_input_activities=activities_dict)
		if data.get('total_time'):
			print("Fitbit AA1 calculations creating")
			try:
				user_aa = AA.objects.get(user=user, created_at=current_date)
				aa_update_instance(user_aa, data)
			except AA.DoesNotExist:
				aa_create_instance(user, data, current_date)
		else:
			print("NO Fitbit AA1")
		current_date -= timedelta(days=1)

def store_aa_calculations(user,from_date,to_date):
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
		store_garmin_aa1(user,from_date,to_date)
	elif device_type == "fitbit":
		print("Fitbit AA chat1 data calculation got started")
		store_fitbit_aa1(user,from_date,to_date)
		print("Fitbit AA chat1 data calculation finished")
	return None

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

def remove_hrr_file(filtered_activities_files):
	for i,single_actiivty in enumerate(filtered_activities_files):
		if single_actiivty.get("activityType",0) == 'HEART_RATE_RECOVERY':
			del filtered_activities_files[i]
	return filtered_activities_files

# data = aa_workout_data(user,start_date)
def aa_workout_data(user,start_date):

	start_date_str = start_date.strftime('%Y-%m-%d')
	start_date_timestamp = start_date
	start_date_timestamp = start_date_timestamp.timetuple()
	start_date_timestamp = time.mktime(start_date_timestamp)
	end_date_timestamp = start_date_timestamp + 86400
	
	ui_data = _get_activities(user,start_date_str)
	ui_data_keys = [ui_keys for ui_keys in ui_data.keys()]
	only_hrr_summary_id = []
	for ui_data_single in ui_data.values():
		if ui_data_single['activityType'] == 'HEART_RATE_RECOVERY':
			summaryId = ui_data_single['summaryId']
			only_hrr_summary_id.append(summaryId)
			ui_data_keys.remove(summaryId)
	
	activities_dic = get_usernput_activities(user,start_date)

	count = 0
	id_act = 0
	activities = []
	ui_hrr_keys = []
	# if user_input_strong:
	# 	for single_ui_object in user_input_strong:
	# 		single_activity = single_ui_object.activities
	# 		if single_activity:
	# 			single_activity_json = json.loads(single_activity)
	# 			single_activity_values = single_activity_json.values()
	# 			single_activity_values = list(single_activity_values)
	# 			for i,k in enumerate(single_activity_values):
	# 				if single_activity_values[i]['activityType'] == 'HEART_RATE_RECOVERY':
	# 					id_act = int(single_activity_values[i]['summaryId'])
	# 					count = count + 1
	# 					ui_hrr_keys.append(single_activity_values[i]['summaryId'])
	# 					activities.append(single_activity_values[i])
	# 				else:
	# 					activities.append(single_activity_values[i])

	if activities_dic:
		single_activity_values = activities_dic.values()
		single_activity_values = list(single_activity_values)
		for i,k in enumerate(single_activity_values):
			if single_activity_values[i]['activityType'] == 'HEART_RATE_RECOVERY':
				id_act = int(single_activity_values[i]['summaryId'])
				count = count + 1
				ui_hrr_keys.append(single_activity_values[i]['summaryId'])
				activities.append(single_activity_values[i])
			else:
				activities.append(single_activity_values[i])					
	manually_edited_dic,manually_edited_list = get_garmin_manully_activities(
		user,start_date_timestamp,end_date_timestamp)


	garmin_list,garmin_dic = get_garmin_activities(
		user,start_date_timestamp,end_date_timestamp)
	user_age = user.profile.age()
	filtered_activities_files = get_filtered_activity_stats(activities_json=garmin_list,
													user_age=user_age,
													manually_updated_json=manually_edited_dic,
													userinput_activities=activities_dic,
													user=user,calendar_date=start_date)
	
	filtered_activities_files_copy = filtered_activities_files.copy()
	filtered_activities_files_copy = remove_hrr_file(filtered_activities_files_copy)
	
	act_id = []
	workout = []
	hrr = []
	start = start_date
	end = start_date + timedelta(days=3)
	a1=GarminFitFiles.objects.filter(user=user,created_at__range=[start,end])
	if activities:
		if filtered_activities_files_copy:
			for i,k in enumerate(filtered_activities_files_copy):
				if filtered_activities_files_copy[i].get("summaryId") in only_hrr_summary_id:
					hrr.append(filtered_activities_files_copy[i])
				else:
					workout.append(filtered_activities_files_copy[i])
	else:
		if filtered_activities_files_copy:
			for i,k in enumerate(filtered_activities_files_copy):
				if filtered_activities_files_copy[i].get("summaryId") in ui_data_keys:
					workout.append(filtered_activities_files_copy[i])
				else:
					hrr.append(filtered_activities_files_copy[i])
	data={"date":"",
		  "workout_type":"",
		  "duration":"",
		  "average_heart_rate":"",
		  "max_heart_rate":"",
		  "steps":"",
		  "hrr_not_recorded":"",
		  "prcnt_hrr_not_recorded":""
			}
	time_duration = []
	heart_rate = []
	max_hrr = []
	data1={}
	steps = []
	hrr_not_recorded_list = []
	if workout:
		start_date_timestamp = workout[0]['startTimeInSeconds']
		start_date_timestamp = start_date_timestamp +  workout[0].get("startTimeOffsetInSeconds",0)
		start_date = datetime.utcfromtimestamp(start_date_timestamp)
		date = start_date.strftime('%d-%b-%y')
		for workout in workout:
			act_date = date
			summaryId = workout['summaryId']
			workout_type = workout['activityType']
			duration = workout['durationInSeconds']
			time_duration.append(duration)
			avg_heart_rate = workout.get('averageHeartRateInBeatsPerMinute')
			heart_rate.append(avg_heart_rate)
			max_heart_rate = workout.get('maxHeartRateInBeatsPerMinute',0)
			max_hrr.append(max_heart_rate)
			exercise_steps = workout.get("steps",0)
			steps.append(exercise_steps)
			distance_meters = workout.get("distanceInMeters",0)			
			data = {"date":act_date,
				  "workout_type":workout_type,
				  "duration":duration,
				  "average_heart_rate":avg_heart_rate,
				  "max_heart_rate":max_heart_rate,
				  "steps":exercise_steps,
				  "hrr_not_recorded":"",
				  "prcnt_hrr_not_recorded":"",
				  "distance_meters":distance_meters
					}
			data1[summaryId] = data 
			if "averageHeartRateInBeatsPerMinute" in workout.keys():
				if workout['averageHeartRateInBeatsPerMinute'] == 0 or "":
					hrr_not_recorded = workout['durationInSeconds']
					hrr_not_recorded_list.append(hrr_not_recorded)
					data['hrr_not_recorded'] = hrr_not_recorded
			else:
				hrr_not_recorded = workout.get('durationInSeconds',0)
				hrr_not_recorded_list.append(hrr_not_recorded)
				data['hrr_not_recorded'] = hrr_not_recorded
		for tm in hrr_not_recorded_list:
			try:
				prcnt_hrr_not_recorded = (tm/sum(time_duration))*100
				prcnt_hrr_not_recorded = int(Decimal(prcnt_hrr_not_recorded).quantize(0,ROUND_HALF_UP))
				data['prcnt_hrr_not_recorded']=prcnt_hrr_not_recorded
			except ZeroDivisionError:
				prcnt_hrr_not_recorded = ""
				data['prcnt_hrr_not_recorded'] = prcnt_hrr_not_recorded

		try:
			heart_rate = [x for x in heart_rate if x != '']
			heart_rate = [x for x in heart_rate if x != 0]
			avg_hrr = sum(filter(lambda i: isinstance(i, int),heart_rate))/len(heart_rate)
			avg_hrr = int(Decimal(avg_hrr).quantize(0,ROUND_HALF_UP))
		except ZeroDivisionError:
			avg_hrr = ""
		try:
			maxi_hrr = max(max_hrr)
		except ValueError:
			maxi_hrr = ''
		time_total = sum(time_duration)
		try:
			total_prcnt_hrr_not_recorded = (sum(hrr_not_recorded_list)/sum(time_duration))*100
			total_prcnt_hrr_not_recorded = int(Decimal(total_prcnt_hrr_not_recorded).quantize(0,ROUND_HALF_UP))
		except ZeroDivisionError:
			total_prcnt_hrr_not_recorded = ""
		total = {"date":date,
				 "workout_type":"Totals",
				 "duration":time_total,
				 "average_heart_rate":avg_hrr,
				 "max_heart_rate":maxi_hrr,
				 "steps":sum(steps),
				 "hrr_not_recorded":sum(hrr_not_recorded_list),
				 "prcnt_hrr_not_recorded":total_prcnt_hrr_not_recorded
				 }
		if total:	
			data1['Totals'] = total
		else:
			data1['Totals'] = {}
	if data1:
		return data1
	else:
		return ({})
	

def update_workout_instance(user,start_date,data):
	AaWorkoutCalculations.objects.filter(
			user_aa_workout=user, created_at=start_date).update(data=data)

def create_workout_instance(user, data, start_date):
	AaWorkoutCalculations.objects.create(
		user_aa_workout = user,created_at = start_date,data=data)

def aa_workout_calculations(request):
	start_date_get = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date_get, "%Y-%m-%d").date()
	data = aa_workout_data(request.user,start_date)
	# data = json.dumps(data)
	if data:
		try:
			user_obj = AaWorkoutCalculations.objects.get(
				user_aa_workout=request.user, created_at=start_date)
			user_obj.data = data
			user_obj.save()
		except AaWorkoutCalculations.DoesNotExist:
			create_workout_instance(request.user, data, start_date)
	return JsonResponse(data)

def store_garmin_aa_workout(user,from_date,to_date):
	print("A/A Workout started")
	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	current_date = to_date_obj
	AA2 = AaWorkoutCalculations.objects.filter(user_aa_workout=user,created_at=from_date_obj)
	while (current_date >= from_date_obj):
		data = aa_workout_data(user,current_date)
		# data = json.dumps(data)
		if data or (AA2 and not data):
			print("A/A workout")
			try:
				user_obj = AaWorkoutCalculations.objects.get(
					user_aa_workout=user, created_at=current_date)
				user_obj.data = data
				user_obj.save()
				# update_workout_instance(user,start_date,data)
			except AaWorkoutCalculations.DoesNotExist:
				create_workout_instance(user, data, current_date)
		current_date -= timedelta(days=1)
	print("A/A workout finished")
	return None


def store_fitbit_aa_workout(user,from_date,to_date):
	activities_dict = get_usernput_activities(user,from_date)
	data = fitbit_aa.calculate_AA2_workout(user,from_date,user_input_activities=activities_dict)
	if data:
			try:
				user_aa_workout = AaWorkoutCalculations.objects.get(
					user_aa_workout=user, created_at=from_date)
				update_workout_instance(user,from_date,data)
			except  AaWorkoutCalculations.DoesNotExist:
				create_workout_instance(user, data, from_date)

def store_aa_workout_calculations(user,from_date,to_date):
	'''
	This function takes user start date and end date, calculate the Daily A/A
	workout calculations then stores in Data base

	Args:user(user object)
		:from_date(start date)
		:to_date(end date)

	Return:None
	'''
	device_type = quicklook.calculations.calculation_driver.which_device(user)
	if device_type == "garmin":
		store_garmin_aa_workout(user,from_date,to_date)
	elif device_type == "fitbit":
		print("Fitbit AA chat workout data calculation got started")
		store_fitbit_aa_workout(user,from_date,to_date)
		print("Fitbit AA chat workout data calculation finished")
	return None

def total_percent(modified_data_total):
	'''
		Add percent to all the fields in Totals
	'''
	try:
		modified_data_total['Totals']['percent_aerobic'] = (
		(modified_data_total["Totals"].get("duration_in_aerobic_range",0.0)/modified_data_total['Totals']['total_duration'])*100)
	except ZeroDivisionError:
		modified_data_total['Totals']['percent_aerobic'] = 0
	try:
		modified_data_total['Totals']['percent_below_aerobic'] = (
		(modified_data_total["Totals"].get("duration_below_aerobic_range",0.0)/modified_data_total['Totals']['total_duration'])*100)
	except ZeroDivisionError:
		modified_data_total['Totals']['percent_below_aerobic'] = 0
	try:
		modified_data_total['Totals']['percent_anaerobic'] = (
		(modified_data_total["Totals"].get("duration_in_anaerobic_range",0.0)/modified_data_total['Totals']['total_duration'])*100)
	except ZeroDivisionError:
		modified_data_total['Totals']['percent_anaerobic'] = 0
	try:
		modified_data_total['Totals']['percent_hrr_not_recorded'] = (
		(modified_data_total["Totals"].get("duration_hrr_not_recorded",0.0)/modified_data_total['Totals']['total_duration'])*100)
	except ZeroDivisionError:
		modified_data_total['Totals']['percent_hrr_not_recorded'] = 0
	return(modified_data_total)

def add_totals(modified_data):
	'''
		Add totals field to user created activity
	'''
	modified_data_total = modified_data.copy()
	for key,value in modified_data.items():
		if not modified_data_total.get('Totals'):
			modified_data_total['Totals'] = {}
		modified_data_total['Totals']['total_duration'] = (
		value.get('total_duration',0.0) + modified_data_total['Totals'].get('total_duration',0.0))
		modified_data_total['Totals']['duration_in_anaerobic_range'] = (
		value.get('duration_in_anaerobic_range',0.0) + modified_data_total['Totals'].get(
		'duration_in_anaerobic_range',0.0))
		modified_data_total['Totals']['duration_in_aerobic_range'] = (
		value.get('duration_in_aerobic_range',0.0) + modified_data_total['Totals'].get(
		'duration_in_aerobic_range',0.0))
		modified_data_total['Totals']['duration_below_aerobic_range'] = (
		value.get('duration_below_aerobic_range',0.0) + modified_data_total['Totals'].get(
		'duration_below_aerobic_range',0.0))
		modified_data_total['Totals']['duration_hrr_not_recorded'] = (
		value.get('duration_hrr_not_recorded',0.0) + modified_data_total['Totals'].get(
		'duration_hrr_not_recorded',0.0))
	percent_added = total_percent(modified_data_total)
	return(percent_added)

def add_created_activity(di,data,below_aerobic,anaerobic):
	'''
		This function will add user created activty in user input form to AA calculation
	'''
	modified_data = {}
	for i,single_activity in enumerate(di):
		data_copy = data.copy()
		data_copy["total_duration"] = single_activity.get("durationInSeconds",0.0)
		data_copy["avg_heart_rate"] = single_activity.get("averageHeartRateInBeatsPerMinute",0.0)
		avg_hr = single_activity.get("averageHeartRateInBeatsPerMinute",0.0)
		if not avg_hr:
			avg_hr = 0 
		if avg_hr != '' and int(avg_hr) >= anaerobic:
			data_copy["duration_in_anaerobic_range"] = single_activity.get("durationInSeconds",0.0)
			data_copy["percent_anaerobic"] = 100
		elif avg_hr != '' and int(avg_hr) < anaerobic and int(avg_hr) > below_aerobic:
			data_copy["duration_in_aerobic_range"] = single_activity.get("durationInSeconds",0.0)
			data_copy["percent_aerobic"] = 100
		elif avg_hr != '' and int(avg_hr) > 0.0 and int(avg_hr) <= below_aerobic:
			data_copy["duration_below_aerobic_range"] = single_activity.get("durationInSeconds",0.0)
			data_copy["percent_below_aerobic"] = 100
		elif avg_hr == '' or avg_hr == 0:
			data_copy["duration_hrr_not_recorded"] = single_activity.get("durationInSeconds",0.0)
			data_copy["percent_hrr_not_recorded"] = 100
		modified_data[single_activity['summaryId']] = data_copy
	return(modified_data)

def remove_duplicate(final_date,duplicate_file):
	'''
		Remove duplicate files from user acticities
	'''
	for i,single_key in enumerate(duplicate_file):
		final_date.pop(single_key,None)
	return final_date

def daily_aa_data(user, start_date):
	avg_heart_rate = 0.0
	max_heart_rate = 0.0 
	total_duration = 0.0 
	duration_in_aerobic_range = 0.0 
	percent_aerobic = 0.0 
	duration_in_anaerobic_range = 0.0
	percent_anaerobic = 0.0
	duration_below_aerobic_range = 0.0
	percent_below_aerobic = 0.0
	duration_hrr_not_recorded = 0.0 
	percent_hrr_not_recorded = 0.0
	
	start_date_str = start_date.strftime('%Y-%m-%d')
	start_date_timestamp = start_date
	start_date_timestamp = start_date_timestamp.timetuple()
	start_date_timestamp = time.mktime(start_date_timestamp)
	end_date_timestamp = start_date_timestamp + 86400

	activity_files_qs=UserGarminDataActivity.objects.filter(user=user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
	garmin_activity_keys = []
	garmin_workout = []
	if activity_files_qs:
		activity_files = [pr.data for pr in activity_files_qs]
		one_activity_file_dict =  ast.literal_eval(activity_files[0])
		offset = one_activity_file_dict['startTimeOffsetInSeconds']
		for i,single_activity in enumerate(activity_files):
			one_activity_file =  ast.literal_eval(single_activity)
			garmin_activity_keys.append(one_activity_file['summaryId'])
			garmin_workout.append(one_activity_file)
	else:
		activity_files = []

	ui_data = _get_activities(user,start_date_str)
	ui_data_keys = [ui_keys for ui_keys in ui_data.keys()]
	ui_data_hrr = []
	for ui_data_single in ui_data.values():
		if ui_data_single['activityType'] == 'HEART_RATE_RECOVERY':
			summaryId = ui_data_single['summaryId']
			ui_data_keys.remove(summaryId)
			ui_data_hrr.append(summaryId)
		if ui_data_single['steps_type'] == 'non_exercise':
			summaryId = ui_data_single['summaryId']
			if summaryId in ui_data_keys:
				ui_data_keys.remove(summaryId)
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
	# print(filtered_activities_files,"filtered_activities_files")
	filtered_activities_only = get_filtered_activity_stats(activities_json=garmin_list,
													user_age=user_age,
													manually_updated_json=manually_edited_dic,
													user=user,calendar_date=start_date)
	
	filtered_activities_only = remove_hrr_file(filtered_activities_only)
	garmin_activity_keys = []
	filtered_act_keys = []
	for i,single_activity in enumerate(filtered_activities_only):
		garmin_activity_keys.append(single_activity.get("summaryId"))
	for i,single_activity in enumerate(filtered_activities_files):
		if single_activity.get("summaryId") != "HEART_RATE_RECOVERY":
			filtered_act_keys.append(single_activity.get("summaryId"))
	duplicate_file = list(set(ui_data_keys)-set(garmin_activity_keys))
	count = 0
	id_act = 0
	activities = []
	activities_workout = []
	activities_hrr = []
	workout_data = []
	for i,k in enumerate(filtered_activities_files):
		if filtered_activities_files[i]['activityType'] == 'HEART_RATE_RECOVERY':
			id_act = int(filtered_activities_files[i]['summaryId'])
			count = count + 1
			activities.append(filtered_activities_files[i])
			activities_hrr.append(filtered_activities_files[i]['summaryId'])
		else:
			workout_data.append(filtered_activities_files[i])
			activities_workout.append(filtered_activities_files[i]['summaryId'])
	user_created_activity = list(set(activities_workout) - set(garmin_activity_keys))
	garmin_workout_keys = list(set(garmin_activity_keys) - set(activities_hrr))
	user_created_activity_list = []
	if workout_data and user_created_activity:
		for single_activity in workout_data:
			for single_activity_key in user_created_activity:
				if single_activity_key == single_activity['summaryId']:
					user_created_activity_list.append(single_activity)
	
	for i,single_activity in enumerate(filtered_activities_only):
		avg_hr = single_activity.get('averageHeartRateInBeatsPerMinute',0)
		if avg_hr == '' or avg_hr == 0 or not avg_hr:
			user_created_activity_list.append(single_activity)
	remove_in_workout = []
	act_from_ui = []
	if activities_hrr:
		act_from_ui.extend(activities_hrr)
	if activities_workout:
		act_from_ui.extend(activities_workout)
	if garmin_workout_keys and act_from_ui:
		deleted_act = list(set(garmin_workout_keys)-set(act_from_ui))
	else:
		deleted_act = []
	if deleted_act:
		for i,sigle_act_id in enumerate(deleted_act):
			garmin_workout_keys.remove(sigle_act_id)
	for i,single_actiivty in enumerate(garmin_list):
		if (single_actiivty.get("manual",0) == True 
			and activities_dic
			and activities_dic.get(single_actiivty["summaryId"])):
			for i,k in enumerate(filtered_activities_files):
				garmin_id = single_actiivty.get("summaryId")
				ui_id = filtered_activities_files[i].get('summaryId')
				garmin_hr = single_actiivty.get("averageHeartRateInBeatsPerMinute",0)
				ui_hr = filtered_activities_files[i].get("averageHeartRateInBeatsPerMinute",0)
				garmin_duration = single_actiivty.get("durationInSeconds",0)
				ui_duration = filtered_activities_files[i].get("durationInSeconds",0)
				if ui_hr == None or ui_hr == '':
					ui_hr = 0
				if garmin_hr == None or garmin_hr == '':
					garmin_hr = 0
				if garmin_duration == None or garmin_duration == '':
					garmin_duration = 0
				if ui_duration == None or ui_duration == '':
					ui_duration = 0
				if (garmin_id == ui_id) and ((garmin_hr != ui_hr) or (garmin_duration != ui_duration)):
					user_created_activity_list.append(k)
					remove_in_workout.append(int(k["summaryId"]))
		elif (single_actiivty.get("manual",0) != True 
			and activities_dic
			and activities_dic.get(single_actiivty["summaryId"])):
			for i,k in enumerate(filtered_activities_files):
				garmin_id = single_actiivty.get("summaryId")
				ui_id = filtered_activities_files[i].get('summaryId')
				garmin_hr = single_actiivty.get("averageHeartRateInBeatsPerMinute",0)
				ui_hr = filtered_activities_files[i].get("averageHeartRateInBeatsPerMinute",0)
				if ui_hr == None or ui_hr == '':
					ui_hr = 0
				if garmin_hr == None or garmin_hr == '':
					garmin_hr = 0
				if (garmin_id == ui_id) and ((not garmin_hr and ui_hr) or (garmin_hr != ui_hr)):
					user_created_activity_list.append(k)
					remove_in_workout.append(int(k["summaryId"]))
	hrr_not_recorded_list = []
	prcnt_hrr_not_recorded_list = []
	hrr_recorded = []
	avg_hrr_list = []
	max_hrr_list = []
	data = {"avg_heart_rate":0.0,
			"max_heart_rate":0.0,
			"total_duration":0.0,
			"duration_in_aerobic_range":0.0,
			"percent_aerobic":0.0,
			"duration_in_anaerobic_range":0.0,
			"percent_anaerobic":0.0,
			"duration_below_aerobic_range":0.0,
			"percent_below_aerobic":0.0,
			"duration_hrr_not_recorded":0.0,
			"percent_hrr_not_recorded":0.0,
			}
	workout = []
	hrr = []
	activities_duration = []
	data_summaryid = []
	start = start_date
	end = start_date + timedelta(days=3)
	fitfiles_obj = get_fitfiles(user,start_date,start,end,start_date_timestamp,end_date_timestamp)
	try:
		if activities_dic:
			for tmp in fitfiles_obj:
				meta = tmp.meta_data_fitfile
				meta = ast.literal_eval(meta)
				data_id = int(meta['activityIds'][0])
				if id_act == data_id:
					hrr.append(tmp)
				elif str(data_id) in filtered_act_keys:
					workout.append(tmp)
					data_summaryid.append(data_id)
				if filtered_activities_files:
					for i,k in enumerate(filtered_activities_files):
						activity_files_dict = filtered_activities_files[i]	
						if activity_files_dict.get("summaryId",None) == str(data_id) and str(data_id) in garmin_workout_keys:
							duration = activity_files_dict.get('durationInSeconds',0)
							activities_duration.append(duration)
							average_heartrate = activity_files_dict.get("averageHeartRateInBeatsPerMinute",0)
							avg_hrr_list.append(average_heartrate)
							maximum_heartrate =  activity_files_dict.get('maxHeartRateInBeatsPerMinute',0)
							max_hrr_list.append(maximum_heartrate)
							if "averageHeartRateInBeatsPerMinute" in activity_files_dict.keys():
								if activity_files_dict.get("averageHeartRateInBeatsPerMinute",0) == 0 or "" :
									hrr_not_recorded = activity_files_dict.get('durationInSeconds')
									hrr_not_recorded_list.append(hrr_not_recorded)
								else:
									hrr_not_recorded_list.append(0)
							else:
								hrr_not_recorded = activity_files_dict.get('durationInSeconds')
								hrr_not_recorded_list.append(hrr_not_recorded)

						else:
							hrr_not_recorded_list.append(0)
		else:
			for tmp in fitfiles_obj:
				meta = tmp.meta_data_fitfile
				meta = ast.literal_eval(meta)
				data_id = meta['activityIds'][0]
				if str(data_id) in ui_data_keys:
					workout.append(tmp)
					data_summaryid.append(data_id)
				elif str(data_id) in ui_data_hrr:
					hrr.append(tmp)
				if filtered_activities_files:
					for i,k in enumerate(filtered_activities_files):
						activity_files_dict = filtered_activities_files[i]
						if activity_files_dict.get("summaryId",None) == str(data_id) and str(data_id) in ui_data_keys:
							duration = activity_files_dict.get('durationInSeconds',0)
							activities_duration.append(duration)
							average_heartrate = activity_files_dict.get("averageHeartRateInBeatsPerMinute",0)
							avg_hrr_list.append(average_heartrate)
							maximum_heartrate =  activity_files_dict.get('maxHeartRateInBeatsPerMinute',0)
							max_hrr_list.append(maximum_heartrate)
							if "averageHeartRateInBeatsPerMinute" in activity_files_dict.keys():
								if activity_files_dict.get("averageHeartRateInBeatsPerMinute",0) == 0 or "" :
									hrr_not_recorded = activity_files_dict.get('durationInSeconds')
									hrr_not_recorded_list.append(hrr_not_recorded)
								else:
									hrr_not_recorded_list.append(0)
							else:
								hrr_not_recorded = activity_files_dict.get('durationInSeconds')
								hrr_not_recorded_list.append(hrr_not_recorded)

						else:
							hrr_not_recorded_list.append(0)
	except:
		logging.exception("message")

	data_summaryid = [str(summaryid) for summaryid in data_summaryid]
	no_hrr_actvities = list(set(ui_data_keys) - set(data_summaryid))
	no_hrr_actvities = list(set(no_hrr_actvities) - set(activities_hrr))
	# if garmin_workout and no_hrr_actvities:
	# 	for single_activity in garmin_workout:
	# 		for single_activity_key in no_hrr_actvities:
	# 			single_activity_key == single_activity['summaryId']
	# 			if single_activity_key and single_activity_key not in deleted_act:
	# 				user_created_activity_list.append(single_activity)
	
	if hrr_not_recorded_list:
		for tm in hrr_not_recorded_list:
			try:
				prcnt_hrr_not_recorded = (tm/sum(activities_duration))*100
				prcnt_hrr_not_recorded = int(Decimal(int(Decimal(prcnt_hrr_not_recorded).quantize(0,ROUND_HALF_UP))).quantize(0,ROUND_HALF_UP))
				prcnt_hrr_not_recorded_list.append(prcnt_hrr_not_recorded)
			except ZeroDivisionError:
				prcnt_hrr_not_recorded = 0
				prcnt_hrr_not_recorded_list.append(prcnt_hrr_not_recorded)
	else:
		prcnt_hrr_not_recorded_list.append(0)

	try:
		avg_hrr = sum(filter(lambda i: isinstance(i, int),avg_hrr_list))/len(avg_hrr_list)
		avg_hrr = int(Decimal(avg_hrr).quantize(0,ROUND_HALF_UP))
	except ZeroDivisionError:
		avg_hrr = ""
	try:
		max_hrr = max(max_hrr_list)
	except ValueError:
		max_hrr = ""

	all_activities_heartrate = []
	all_activities_timestamp = []
	activies_timestamp = []
	daily_aa_data={}

	aa_ranges = fitbit_aa.belowaerobic_aerobic_anaerobic(user,user_age)
	update = fitbit_aa.Update_AA_ranges_by_ages(user)
	below_aerobic_value = update[0]
	anaerobic_value = update[1]
	aerobic_range = update[2]
	anaerobic_range = update [3]
	below_aerobic_range = update [4]

	if workout and workout_data:
		for tmp in workout:
			workout_activities = fitfile_parse([tmp],offset,start_date_str)
			workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_activities
			all_activities_heartrate.append(workout_final_heartrate)
			all_activities_timestamp.append(workout_final_timestamp)
			activies_timestamp.append(workout_timestamp)
		all_activities_heartrate = [single_list for single_list in all_activities_heartrate if single_list]
		all_activities_timestamp = [single_list for single_list in all_activities_timestamp if single_list]
		activies_timestamp = [single_list for single_list in activies_timestamp if single_list]	

		def individual_activity(heart,time):
			anaerobic_range_list = []
			below_aerobic_list = []
			aerobic_list = []
			for hrt,tm in zip(heart,time):
				if hrt > anaerobic_value:
					anaerobic_range_list.append(tm)
				elif hrt < below_aerobic_value:
					below_aerobic_list.append(tm)
				else:
					aerobic_list.append(tm)
			return aerobic_list,below_aerobic_list,anaerobic_range_list
		aerobic_duration = []
		anaerobic_duration = []
		below_aerobic_duration = []
		total_duration = []
		for i in range(len(all_activities_heartrate)):
			single_activity_file = individual_activity(all_activities_heartrate[i],all_activities_timestamp[i])
			single_activity_list =list(single_activity_file)
			time_in_aerobic = sum(single_activity_list[0])
			aerobic_duration.append(time_in_aerobic)
			time_in_below_aerobic = sum(single_activity_list[1])
			below_aerobic_duration.append(time_in_below_aerobic)
			time_in_anaerobic = sum(single_activity_list[2])
			anaerobic_duration.append(time_in_anaerobic)
			total_time = time_in_aerobic+time_in_below_aerobic+time_in_anaerobic
			total_duration.append(total_time)
			
			try:
				percent_anaerobic = (time_in_anaerobic/total_time)*100
				percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))
			
				percent_below_aerobic = (time_in_below_aerobic/total_time)*100
				percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))
				
				percent_aerobic = (time_in_aerobic/total_time)*100
				percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))
			
				total_percent = 100
			except (ZeroDivisionError):
				percent_anaerobic=''
				percent_below_aerobic=''
				percent_aerobic=''
				total_percent=''
			try:
				avg_hr_single_data = avg_hrr_list[i]
			except:
				avg_hr_single_data = ''
			try:
				max_hr_single_data = max_hrr_list[i]
			except:
				max_hr_single_data = ''
			single_data = {"avg_heart_rate":avg_hr_single_data,
					"max_heart_rate":max_hr_single_data,
					"total_duration":total_time,
					"duration_in_aerobic_range":time_in_aerobic,
					"percent_aerobic":percent_aerobic,
					"duration_in_anaerobic_range":time_in_anaerobic,
					"percent_anaerobic":percent_anaerobic,
					"duration_below_aerobic_range":time_in_below_aerobic,
					"percent_below_aerobic":percent_below_aerobic,
					"duration_hrr_not_recorded":hrr_not_recorded_list[i],
					"percent_hrr_not_recorded":prcnt_hrr_not_recorded_list[i]
					}
			daily_aa_data[str(data_summaryid[i])] = single_data
		try:
			total_prcnt_anaerobic = (sum(anaerobic_duration)/sum(total_duration)*100)
			total_prcnt_anaerobic = int(Decimal(total_prcnt_anaerobic).quantize(0,ROUND_HALF_UP))
			total_prcnt_below_aerobic = (sum(below_aerobic_duration)/sum(total_duration)*100)
			total_prcnt_below_aerobic = int(Decimal(total_prcnt_below_aerobic).quantize(0,ROUND_HALF_UP))
			total_prcnt_aerobic = (sum(aerobic_duration)/sum(total_duration)*100)
			total_prcnt_aerobic = int(Decimal(total_prcnt_aerobic).quantize(0,ROUND_HALF_UP))
		except (ZeroDivisionError,IndexError):
			total_prcnt_anaerobic = ''
			total_prcnt_below_aerobic = ''
			total_prcnt_aerobic = ''
		total =  {"avg_heart_rate":avg_hrr,
				  "max_heart_rate":max_hrr,
				  "total_duration":sum(total_duration),
				  "duration_in_aerobic_range":sum(aerobic_duration),
				  "duration_in_anaerobic_range":sum(anaerobic_duration),
				  "duration_below_aerobic_range":sum(below_aerobic_duration),
				  "percent_aerobic":total_prcnt_aerobic,
				  "percent_below_aerobic":total_prcnt_below_aerobic,
				  "percent_anaerobic":total_prcnt_anaerobic,
				  "duration_hrr_not_recorded":sum(hrr_not_recorded_list),
				  "percent_hrr_not_recorded":sum(prcnt_hrr_not_recorded_list)
					}
		if total:
			daily_aa_data['Totals'] = total
		else:
			daily_aa_data['Totals'] = {}
	# print(daily_aa_data,"daily_aa_data")
	if user_created_activity_list:
		data_ui= add_created_activity(user_created_activity_list,data,below_aerobic_value,anaerobic_value)
		daily_aa_data.pop('Totals',None)
		for key,value in data_ui.items():
			daily_aa_data.update({key:value})
		final_date = add_totals(daily_aa_data)
		if duplicate_file:
			return (remove_duplicate(final_date,duplicate_file))
		else:
			return (final_date)
	# elif user_input_strong:
	# 	data_ui = add_created_activity(filtered_activities_only,data,below_aerobic_value,anaerobic_value)
	# 	return (add_totals(data_ui)
	if daily_aa_data:
		if duplicate_file:
			return (remove_duplicate(daily_aa_data,duplicate_file))
		else:
			return daily_aa_data
	else:
		return ({})

def update_aa_instance(user,start_date,data):
	user = AaCalculations.objects.filter(
			user_aa=user, created_at=start_date).update(data=data)

def create_aa_instance(user, data, start_date):
	AaCalculations.objects.create(
		user_aa = user,created_at = start_date,data=data)

def daily_aa_calculations(request):
	start_date_get = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date_get, "%Y-%m-%d").date()
	data = daily_aa_data(request.user,start_date)
	# data = json.dumps(data)
	if data:
		try:
			user_obj = AaCalculations.objects.get(
				user_aa=request.user, created_at=start_date)
			user_obj.data = data
			user_obj.save()
		except AaCalculations.DoesNotExist:
			create_aa_instance(request.user, data, start_date)
	return JsonResponse(data)

def store_garmin_aa_daily(user,from_date,to_date):
	print("A/A dailies got started")
	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	current_date = to_date_obj
	AA3 = AaCalculations.objects.filter(user_aa=user,created_at=from_date_obj)
	while (current_date >= from_date_obj):
		data = daily_aa_data(user,current_date)
		# data = json.dumps(data)
		if data or (AA3 and not data):
			print("A/A low high creating")
			try:
				user_aa = AaCalculations.objects.get(
					user_aa=user, created_at=current_date)
				update_aa_instance(user,current_date,data)
			except AaCalculations.DoesNotExist:
				create_aa_instance(user, data, current_date)
		current_date -= timedelta(days=1)
	print("A/A dailes finished")

def store_fitbit_aa_daily(user,from_date,to_date):
	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	current_date = to_date_obj
	while (current_date >= from_date_obj):
		activities_dict = get_usernput_activities(user,current_date)
		data = fitbit_aa.calculate_AA2_daily(user,current_date,user_input_activities=activities_dict)
		if data:
				try:
					user_aa = AaCalculations.objects.get(
						user_aa=user, created_at=current_date)
					update_aa_instance(user,current_date,data)
				except AaCalculations.DoesNotExist:
					create_aa_instance(user, data, current_date)
		current_date -= timedelta(days=1)

def store_daily_aa_calculations(user,from_date,to_date):
	'''
	This function takes user start date and end date, calculate the Daily A/A calculations 
	then stores in Data base

	Args:user(user object)
		:from_date(start date)
		:to_date(end date)

	Return:None
	'''
	device_type = quicklook.calculations.calculation_driver.which_device(user)
	if device_type == "garmin":
		store_garmin_aa_daily(user,from_date,to_date)
	elif device_type == "fitbit":
		print("Fitbit AA chat daily data calculation got started")
		store_fitbit_aa_daily(user,from_date,to_date)
		print("Fitbit AA chat daily data calculation finished")
	return None

def low_high_hr(low_end_heart,high_end_heart,heart_beat):
	'''
		Making ranges for A/A third chart
	'''
	low_hr = sorted(i for i in low_end_heart if i <= int(heart_beat))
	high_hr = sorted(i for i in high_end_heart if i >= int(heart_beat))
	return low_hr[-1],high_hr[1]

def add_hr_nor_recorded_heartbeat(
	no_hr_data,totals_data,low_end_heart,high_end_heart,below_aerobic_value,anaerobic_value):
	'''
		Adding user created activity to A/A third chart, When user has heartrate information
	'''
	data={}
	for i,single_data in enumerate(no_hr_data):
		heart_beat = single_data.get('averageHeartRateInBeatsPerMinute',0)
		if not heart_beat:
			heart_beat = 0
		if heart_beat != '' and heart_beat != 0 and int(heart_beat) <= below_aerobic_value:
			low_hr,high_hr = low_high_hr(low_end_heart,high_end_heart,int(heart_beat))
			if not data.get(low_hr):
				data[low_hr] = {}
			data[low_hr]["classificaton"] = "below_aerobic_zone"
			data[low_hr]["time_in_zone"]=single_data.get(
			"durationInSeconds",0)+data[low_hr].get("time_in_zone",0)
			data[low_hr]["heart_rate_zone_low_end"] = low_hr
			data[low_hr]["heart_rate_zone_high_end"] = high_hr
		elif heart_beat != '' and heart_beat != 0 and int(heart_beat) > anaerobic_value:
			low_hr,high_hr = low_high_hr(low_end_heart,high_end_heart,int(heart_beat))
			if not data.get(low_hr):
				data[low_hr] = {}
			data[low_hr]["classificaton"] = "anaerobic_zone"
			data[low_hr]["time_in_zone"]=single_data.get(
			"durationInSeconds",0)+data.get("time_in_zone",0)
			data[low_hr]["heart_rate_zone_low_end"] = low_hr
			data[low_hr]["heart_rate_zone_high_end"] = high_hr
		elif heart_beat != '' and heart_beat != 0 and int(heart_beat) <= anaerobic_value and int(heart_beat) > below_aerobic_value:
			low_hr,high_hr = low_high_hr(low_end_heart,high_end_heart,int(heart_beat))
			if not data.get(low_hr):
				data[low_hr] = {}
			data[low_hr]["classificaton"] = "aerobic_zone"
			data[low_hr]["time_in_zone"]=single_data.get(
			"durationInSeconds",0)+data.get("time_in_zone",0)
			data[low_hr]["heart_rate_zone_low_end"] = low_hr
			data[low_hr]["heart_rate_zone_high_end"] = high_hr
	
	return data

def add_hr_nor_recorded(no_hr_data,totals_data):
	'''
		Add new row to third chart in A/A, When Heart rate is not measured
	'''
	data={}
	data["prcnt_total_duration_in_zone"] = 0
	data["time_in_zone"] = 0
	data["classificaton"] = "heart_rate_not_recorded"
	for i,single_data in enumerate(no_hr_data):
		heart_beat = single_data.get('averageHeartRateInBeatsPerMinute',0)
		if not heart_beat:
			heart_beat = 0
		if heart_beat == '' or int(heart_beat) == 0:
			data["time_in_zone"]=single_data.get(
			"durationInSeconds",0) +  data.get("time_in_zone",0)
		
	if totals_data:
		try:
			data["prcnt_total_duration_in_zone"]=(data.get(
				"time_in_zone",0)/totals_data.get('total_duration',0))*100
		except:
			data["prcnt_total_duration_in_zone"] = 0
	else:
		data["prcnt_total_duration_in_zone"] = 100
	return data

def update_prcent(data,total_duration):
	'''
		Update the percent of each zone
	'''
	for key,value in data.items():
		if key != 'total':
			try:
				value['prcnt_total_duration_in_zone'] = (value.get('time_in_zone',0)/total_duration)*100
			except:
				value['prcnt_total_duration_in_zone'] = 0
	return data

def percent_added_activity(data2,total_duration):
	'''
		This function add percentage of totals
	'''
	for key,value in data2.items():
		if key != 'total' or key != 'heartrate_not_recorded':
			try:
				data2[key]['prcnt_total_duration_in_zone'] = (data2[key]['time_in_zone']/total_duration)*100
			except:
				pass
	return data2

def aa_low_high_end_data(user,start_date):
	'''
		This function calculates the A/A third chart data
	''' 
	heart_rate_zone_low_end = ""
	heart_rate_zone_high_end = ""
	time_in_zone_for_last_7_days = ""
	prcnt_total_duration_in_zone = ""

	start_date_str = start_date.strftime('%Y-%m-%d')

	start_date_timestamp = start_date
	start_date_timestamp = start_date_timestamp.timetuple()
	start_date_timestamp = time.mktime(start_date_timestamp)
	end_date_timestamp = start_date_timestamp + 86400

	activity_files_qs=UserGarminDataActivity.objects.filter(user= user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
	garmin_activity_keys = []
	garmin_workout = []
	if activity_files_qs:
		activity_files = [pr.data for pr in activity_files_qs]
		one_activity_file_dict =  ast.literal_eval(activity_files[0])
		offset = one_activity_file_dict['startTimeOffsetInSeconds']
		for i,single_activity in enumerate(activity_files):
			one_activity_file =  ast.literal_eval(single_activity)
			garmin_activity_keys.append(one_activity_file['summaryId'])
			garmin_workout.append(one_activity_file)
	else:
		activity_files = ''
		offset = 0
	ui_data = _get_activities(user,start_date_str)
	ui_data_keys = [ui_keys for ui_keys in ui_data.keys()]
	ui_data_hrr = []
	ui_data_keys_test = []

	for ui_data_single in ui_data.values():
		if ui_data_single.get(
			'activityType') == 'HEART_RATE_RECOVERY':
			summaryId = ui_data_single['summaryId']
			ui_data_hrr.append(summaryId)
		elif ui_data_single.get("duplicate") == False:
				summaryId = ui_data_single['summaryId'] 
				ui_data_keys_test.append(summaryId)
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

	user_created_activity = list(set(workout_summary_id)- set(garmin_activity_keys))
	garmin_workout_keys = set(garmin_activity_keys) - set(hrr_summary_id)
	user_created_activity_list = []
	if workout_data and user_created_activity:
		for single_activity in workout_data:
			for single_activity_key in user_created_activity:
				if single_activity_key == single_activity['summaryId']:
					user_created_activity_list.append(single_activity)

	remove_in_workout = []
	for i,single_actiivty in enumerate(filtered_activities_files):
		if (single_actiivty.get("manual",0) == True 
			and activities_dic
			and activities_dic.get(single_actiivty["summaryId"])):

			# user_created_activity_list.append(
			# 	activities_dic.get(single_actiivty["summaryId"]))
			for i,k in enumerate(filtered_activities_files):
				garmin_id = single_actiivty.get("summaryId")
				ui_id = filtered_activities_files[i].get('summaryId')
				garmin_hr = single_actiivty.get("averageHeartRateInBeatsPerMinute",0)
				ui_hr = filtered_activities_files[i].get("averageHeartRateInBeatsPerMinute",0)
				garmin_duration = single_actiivty.get("durationInSeconds",0)
				ui_duration = filtered_activities_files[i].get("durationInSeconds",0)
				if ui_hr == None or ui_hr == '':
					ui_hr = 0
				if garmin_hr == None or garmin_hr == '':
					garmin_hr = 0
				if garmin_duration == None or garmin_duration == '':
					garmin_duration = 0
				if ui_duration == None or ui_duration == '':
					ui_duration = 0
				if (garmin_id == ui_id) and ((garmin_hr != ui_hr) or (garmin_duration != ui_duration)):
					user_created_activity_list.append(k)
					remove_in_workout.append(int(k["summaryId"]))

		elif (single_actiivty.get("manual",0) != True 
			and activities_dic
			and activities_dic.get(single_actiivty["summaryId"])):
			for i,k in enumerate(filtered_activities_files):
				garmin_id = single_actiivty.get("summaryId")
				ui_id = filtered_activities_files[i].get('summaryId')
				garmin_hr = single_actiivty.get("averageHeartRateInBeatsPerMinute",0)
				ui_hr = filtered_activities_files[i].get("averageHeartRateInBeatsPerMinute",0)
				if ui_hr == None or ui_hr == '':
					ui_hr = 0
				if garmin_hr == None or garmin_hr == '':
					garmin_hr = 0
				if (garmin_id == ui_id) and ((not garmin_hr and ui_hr) or (garmin_hr != ui_hr)):
					user_created_activity_list.append(k)
					remove_in_workout.append(int(k["summaryId"]))

	for i,single_activity in enumerate(filtered_activities_only):
		avg_hr = single_activity.get('averageHeartRateInBeatsPerMinute',0)
		summaryid = int(single_activity.get('summaryId',0))
		if avg_hr == '' or avg_hr == 0 and summaryid not in remove_in_workout:
			user_created_activity_list.append(single_activity)

	workout = []
	hrr = []
	start = start_date
	end = start_date + timedelta(days=3)
	fitfiles_obj = get_fitfiles(user,start_date,start,end,start_date_timestamp,end_date_timestamp)
	if activities_dic and fitfiles_obj:
		for tmp in fitfiles_obj:
			meta = tmp.meta_data_fitfile
			meta = ast.literal_eval(meta)
			data_id = meta['activityIds'][0]
			if str(data_id) in workout_summary_id and str(data_id) not in remove_in_workout:
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
			elif str(data_id) in ui_data_hrr:
				hrr.append(tmp)				
	user_age = user.profile.age()
	
	data = {"heart_rate_zone_low_end":"",
				"heart_rate_zone_high_end":"",
				"classification":"",
				"time_in_zone":"",
				"prcnt_total_duration_in_zone":"",
				}

	aa_ranges = fitbit_aa.belowaerobic_aerobic_anaerobic(user,user_age)
	update = fitbit_aa.Update_AA_ranges_by_ages(user)
	below_aerobic_value = update[0]
	anaerobic_value = update[1]

	data2 = {}
	classification_dic = {}
	low_end_values = [-60,-55,-50,-45,-40,-35,-30,-25,-20,-15,-10,+1,6,11,14,19,24,
						29,34,39,44,49,54,59]
	high_end_values = [-56,-51,-46,-41,-36,-31,-26,-21,-16,-11,0,5,10,13,18,23,28,
						33,38,43,48,53,58,63]
	

	high_end_heart = [180-user_age+tmp for tmp in high_end_values]
	low_end_heart = [180-user_age+tmp for tmp in low_end_values]

	for a,b in zip(low_end_heart,high_end_heart):			
		if a and b > anaerobic_value:
			classification_dic[a] = 'anaerobic_zone'
		elif a and b < below_aerobic_value:
			classification_dic[a] = 'below_aerobic_zone'
		else:
			classification_dic[a] = 'aerobic_zone'

		data={"heart_rate_zone_low_end":a,
			  "heart_rate_zone_high_end":b,
			  "classificaton":classification_dic[a],
			  "time_in_zone":0,
			  "prcnt_total_duration_in_zone":0,
			 }
		data2[str(a)]=data
	total = {"total_duration":0,
				"total_percent":0}
	data2['total'] = total

	# print(data2,"data")

	if workout:
		workout_data = fitfile_parse(workout,offset,start_date_str)
		workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_data
		low_end_dict = dict.fromkeys(low_end_heart,0)
		# high_end_dict = dict.fromkeys(high_end_heart,0)
		for a,b in zip(low_end_heart,high_end_heart):
			for c,d in zip(workout_final_heartrate,workout_final_timestamp):
				if c>=a and c<=b:
					low_end_dict[a] = low_end_dict[a] + d
		# print(low_end_dict,"low_end_dict")
		total_time_duration = sum(low_end_dict.values())		
		for a,b in zip(low_end_heart,high_end_heart):	
			if a and b > anaerobic_value:
				classification_dic[a] = 'anaerobic_zone'
			elif a and b < below_aerobic_value:
				classification_dic[a] = 'below_aerobic_zone'
			else:
				classification_dic[a] = 'aerobic_zone'
			try:
				prcnt_in_zone = (low_end_dict[a]/total_time_duration)*100
			except ZeroDivisionError:
				prcnt_in_zone = 0
			prcnt_in_zone = int(Decimal(prcnt_in_zone).quantize(0,ROUND_HALF_UP))
			data={"heart_rate_zone_low_end":a,
			  "heart_rate_zone_high_end":b,
			  "classificaton":classification_dic[a],
			  "time_in_zone":low_end_dict[a],
			  "prcnt_total_duration_in_zone":prcnt_in_zone,
			 }
			data2[str(a)]=data

		total = {"total_duration":total_time_duration,
				"total_percent":"100%"}
		if total:
			data2['total'] = total
		else:
			data2['total'] = ""
	if data2:
		data2["heartrate_not_recorded"] = {}
		data2["heartrate_not_recorded"]["prcnt_total_duration_in_zone"] = 0
		data2["heartrate_not_recorded"]["time_in_zone"] = 0
		data2["heartrate_not_recorded"]["classificaton"] = "heart_rate_not_recorded"
	
	if user_created_activity_list:

		duration_activites = []
		hr_not_recorded = add_hr_nor_recorded(user_created_activity_list,data2.get("total"))
		hr_recorded = add_hr_nor_recorded_heartbeat(user_created_activity_list,data2,
			low_end_heart,high_end_heart,below_aerobic_value,anaerobic_value)
		if hr_recorded:
			for key,value in hr_recorded.items():
				if data2.get(str(key)):
					data2[str(key)]["time_in_zone"] = data2[str(key)]["time_in_zone"]+value['time_in_zone']
				else:
					data2[key] = value
				duration = value.get("time_in_zone",0)
				duration_activites.append(duration)
		data2['heartrate_not_recorded'] = hr_not_recorded
		if not data2.get('total'):
			data2['total'] = {}
			data2['total']['total_duration'] = sum(
				duration_activites)+data2['heartrate_not_recorded'].get('time_in_zone',0)
			data2['total']['total_percent'] = '100%'
			data = update_prcent(data2,data2['total']['total_duration'])
			data2 = data
		else:
			data2['total']['total_duration'] = (
				data2['total']['total_duration']+data2['heartrate_not_recorded'].get('time_in_zone',0)+sum(
					duration_activites))
		data2 = percent_added_activity(data2,data2['total']['total_duration'])
	if data2["total"]["total_duration"]:
		return data2
	else:
		return ({})



def update_heartzone_instance(user, start_date,data):
	user = TimeHeartZones.objects.filter(
			user=user, created_at=start_date).update(data=data)

def create_heartzone_instance(user, data, start_date):
	created_at = start_date
	TimeHeartZones.objects.create(user = user,created_at = created_at,data=data)

def create_time_heartzone_instance(user, data, start_date):
	created_at = start_date
	TwentyfourHourTimeHeartZones.objects.create(user = user,created_at = created_at,data=data)

def aa_low_high_end_calculations(request):
	start_date_get = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date_get, "%Y-%m-%d").date()
	data = aa_low_high_end_data(request.user,start_date)
	# data = json.dumps(data)
	if data:
		try:
			user_obj = TimeHeartZones.objects.get(
				user=request.user, created_at=start_date)
			user_obj.data = data
			user_obj.save()
		except TimeHeartZones.DoesNotExist:
			create_heartzone_instance(request.user, data, start_date)
	return JsonResponse(data)

def store_garmin_aa3(user,from_date,to_date):
	activities_dict = get_usernput_activities(user,from_date)
	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	current_date = to_date_obj
	AA4 = TimeHeartZones.objects.filter(user=user,created_at=from_date_obj)
	while (current_date >= from_date_obj):
		data = aa_low_high_end_data(user,current_date)
		# data = json.dumps(data)
		if data or (AA4 and not data):
			try:
				time_hr_zone_obj = TimeHeartZones.objects.get(
					user=user, created_at=current_date)
				if time_hr_zone_obj:
					update_heartzone_instance(user, current_date,data)
			except TimeHeartZones.DoesNotExist:
				create_heartzone_instance(user, data, current_date)
		current_date -= timedelta(days=1)
	return None

def store_fitbit_aa3(user,from_date,to_date):
	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	current_date = to_date_obj
	while (current_date >= from_date_obj):
		activities_dict = get_usernput_activities(user,from_date)
		data = fitbit_aa.calculate_AA3(user,from_date,user_input_activities=activities_dict)
		if data:
			try:
				time_hr_zone_obj = TimeHeartZones.objects.get(
					user=user, created_at=from_date)
				if time_hr_zone_obj:
					update_heartzone_instance(user, from_date,data)
			except TimeHeartZones.DoesNotExist:
				create_heartzone_instance(user, data, from_date)
		current_date -= timedelta(days=1)
			
def store_aa_low_high_end_calculations(user,from_date,to_date):
	'''
	This function takes user start date and end date, calculate the low_high_end 
	HR calculations 
	then stores in Data base

	Args:user(user object)
		:from_date(start date)
		:to_date(end date)

	Return:None
	'''
	device_type = quicklook.calculations.calculation_driver.which_device(user)
	if device_type == "garmin":
		store_garmin_aa3(user,from_date,to_date)
	elif device_type == 'fitbit':
		print("Fitbit AA chat3 data calculation got started")
		store_fitbit_aa3(user,from_date,to_date)
		print("Fitbit AA chat3 data calculation finished")

# def store_garmin_aa_dashboard(user,from_date,to_date):
# 	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
# 	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
# 	current_date = to_date_obj
# 	while (current_date >= from_date_obj):
# 		data = aa_low_high_end_data(user,current_date)
# 		# data = json.dumps(data)
# 		if data:
# 			try:
# 				time_hr_zone_obj = TimeHeartZones.objects.get(
# 					user=user, created_at=current_date)
# 				if time_hr_zone_obj:
# 					update_heartzone_instance(user, current_date,data)
# 			except TimeHeartZones.DoesNotExist:
# 				create_heartzone_instance(user, data, current_date)
# 		current_date -= timedelta(days=1)
# 	return None

# def store_aa_dashboard(user,from_date,to_date):
# 	device_type = quicklook.calculations.calculation_driver.which_device(user)
# 	if device_type == "garmin":
# 		store_garmin_aa_dashboard(user,from_date,to_date)
# 	elif device_type == 'fitbit':
# 		print("Fitbit AA chat3 data calculation got started")
# 		store_fitbit_aa3(user,from_date,to_date)
		# print("Fitbit AA chat3 data calculation finished")

def hrr_data(user,start_date):
	Did_heartrate_reach_99 = ''
	time_99 = 0.0
	HRR_start_beat = 0.0
	lowest_hrr_1min = 0.0
	No_beats_recovered = 0.0
	end_time_activity = 0.0
	diff_actity_hrr = 0.0
	HRR_activity_start_time = 0.0
	end_heartrate_activity = 0.0
	heart_rate_down_up = 0.0 
	pure_1min_heart_beats = 0.0
	pure_time_99 = 0.0 
	no_fitfile_hrr_reach_99 = ''
	no_fitfile_hrr_time_reach_99 = 0.0
	time_heart_rate_reached_99 = 0.0
	lowest_hrr_no_fitfile = 0.0 
	no_file_beats_recovered = 0.0
	daily_starttime = 0
	data_end_activity = ""
	daily_diff_data_60 = 0

	start_date_timestamp = start_date
	start_date_timestamp = start_date_timestamp.timetuple()
	start_date_timestamp = time.mktime(start_date_timestamp)
	end_date_timestamp = start_date_timestamp + 86400

	start_date_str = start_date.strftime('%Y-%m-%d')
	activity_files_qs=UserGarminDataActivity.objects.filter(user=user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
	activity_files = [pr.data for pr in activity_files_qs]
	
	offset = 0
	if activity_files:
		one_activity_file_dict =  ast.literal_eval(activity_files[0])
		offset = one_activity_file_dict['startTimeOffsetInSeconds']
		# start_times_seconds = one_activity_file_dict['startTimeInSeconds']
		# duration_seconds = one_activity_file_dict['durationInSeconds']
		# end_times_seconds = start_times_seconds+offset+duration_seconds
	
	ui_data = _get_activities(user,start_date_str)
	ui_data_keys = [ui_keys for ui_keys in ui_data.keys()]
	ui_data_hrr = []
	for ui_data_single in ui_data.values():
		if ui_data_single['activityType'] == 'HEART_RATE_RECOVERY':
			summaryId = ui_data_single['summaryId']
			ui_data_keys.remove(summaryId)
			ui_data_hrr.append(summaryId)
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
													include_non_exercise = True,user=user)
	count = 0
	id_act = []
	activities = []
	workout_id = []
	for i,k in enumerate(filtered_activities_files):
		if filtered_activities_files[i]['activityType'] == 'HEART_RATE_RECOVERY':
			id_act.append(int(filtered_activities_files[i]['summaryId']))
			count = count + 1
			activities.append(filtered_activities_files[i])
		elif filtered_activities_files[i]['steps_type'] == 'exercise':
			workout_id.append(int(filtered_activities_files[i]['summaryId']))

	start_date_timestamp = start_date_timestamp
	garmin_data_daily = UserGarminDataDaily.objects.filter(user=user,start_time_in_seconds=start_date_timestamp).last()
	if garmin_data_daily:
		garmin_data_daily = ast.literal_eval(garmin_data_daily.data)
		daily_starttime = garmin_data_daily['startTimeInSeconds']
	else:
		daily_starttime = None
	start = start_date
	end = start_date + timedelta(days=3)
	fitfiles_obj = get_fitfiles(user,start_date,start,end,start_date_timestamp,end_date_timestamp)
	workout = []
	hrr = []
	'''
		Below try block do, first capture data from user input form and identify file as  
		hrr file if it fails then else block will do assumtion calculation for idetifying
		the HRR fit file
	'''
	try:		
		if activities_dic:
			for tmp in fitfiles_obj:
				meta = tmp.meta_data_fitfile
				meta = ast.literal_eval(meta)
				data_id = int(meta['activityIds'][0])
				if data_id in id_act:
					hrr.append(tmp)
				elif data_id in workout_id:
					workout.append(tmp)
		else:		
			for tmp in fitfiles_obj:
				meta = tmp.meta_data_fitfile
				meta = ast.literal_eval(meta)
				data_id = meta['activityIds'][0]
				if str(data_id) in ui_data_keys:
					workout.append(tmp)
				elif str(data_id) in ui_data_hrr:
					hrr.append(tmp)
	except:
		logging.exception("message")

	all_activities_heartrate = []
	all_activities_timestamp = []
	all_activities_timestamp_raw = []
	if workout:
		for single_fitfiles in workout:
			workout_activities = fitfile_parse([single_fitfiles],offset,start_date_str)
			workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_activities
			all_activities_heartrate.extend(workout_final_heartrate)
			all_activities_timestamp.extend(workout_final_timestamp)
			all_activities_timestamp_raw.extend(workout_timestamp)
	else:
		workout_final_heartrate = ''
		workout_final_timestamp = ''
		workout_timestamp = ''
	Did_you_measure_HRR = ""
	if hrr and workout and all_activities_heartrate:	
		hrr_data = fitfile_parse(hrr,offset,start_date_str)
		hrr_final_heartrate,hrr_final_timestamp,hrr_timestamp = hrr_data
		Did_you_measure_HRR = 'yes'
		workout_hrr_before_hrrfile = []
		workout_time_before_hrrfile = []
		workout_timestamp_before_hrrfile = []

		for heart_rate,timestamp_diff,time_stamp in zip(
		all_activities_heartrate,all_activities_timestamp,all_activities_timestamp_raw):
			if time_stamp < hrr_timestamp[1]:
				workout_hrr_before_hrrfile.append(heart_rate)
				workout_time_before_hrrfile.append(timestamp_diff)
				workout_timestamp_before_hrrfile.append(time_stamp)
		dict_timestamp_heart = dict(zip(
			workout_timestamp_before_hrrfile, workout_hrr_before_hrrfile))
		sort_dict_timestamp_heart = sorted(dict_timestamp_heart.items())
		timestamp_before_hrrfile = [i[0] for i in sort_dict_timestamp_heart]
		heartrate_before_hrrfile = [i[1] for i in sort_dict_timestamp_heart]
		time_toreach_99 = []
		for heartrate_hrr,timestamp_hrr in zip(hrr_final_heartrate,hrr_final_timestamp):
			if heartrate_hrr >= 99:
				time_toreach_99.append(timestamp_hrr)
			if(heartrate_hrr == 99) or (heartrate_hrr < 99):
				break		
		new_L = [sum(hrr_final_timestamp[:i+1]) for i in range(len(hrr_final_timestamp))]
		min_heartrate = []
		for i,k in zip(hrr_final_heartrate,new_L):
			if k <= 60:
				min_heartrate.append(i)

		b = []
		a = len(hrr_final_heartrate)-len(min_heartrate)
		if a > 0:
			b =  hrr_final_heartrate[-a:]
		elif a == 0:
			b = [min(min_heartrate)]
		else:
			min_heartrate.reverse()
			b = min_heartrate
		if min_heartrate:
			if b and min(min_heartrate) < b[0]:
				b = [min(min_heartrate)]

		if min(hrr_final_heartrate) <= 99:
			Did_heartrate_reach_99 = 'yes'
		else:
			Did_heartrate_reach_99 = 'no'

		HRR_activity_start_time = hrr_timestamp[0]-(offset)
		HRR_start_beat = hrr_final_heartrate[0]
		try:
			lowest_hrr_1min = b[0]
		except IndexError:
			lowest_hrr_1min = 99
		if Did_heartrate_reach_99 == 'yes':
			time_99 = sum(time_toreach_99[:-1])
		else:
			time_99 = None
		if workout:
			no_workouts = len(workout)
		else:
			no_workouts = 1
		end_time_activity = timestamp_before_hrrfile[-no_workouts]
		end_time_activity =  end_time_activity - (offset) 
		end_heartrate_activity  = heartrate_before_hrrfile[-no_workouts]
		diff_actity_hrr= HRR_activity_start_time - end_time_activity
		No_beats_recovered = HRR_start_beat - lowest_hrr_1min
		heart_rate_down_up = abs(end_heartrate_activity-HRR_start_beat)
		pure_1min_beats = []
		pure1min = 60-diff_actity_hrr
		hrr_no_fitfile = None
		if pure1min >= 0:
			for i,k in zip(hrr_final_heartrate,new_L):
				if k <= pure1min:
					pure_1min_beats.append(i)
		elif daily_starttime:
			daily_diff_hrr = end_time_activity - daily_starttime
			daily_activty_end = daily_diff_hrr % 15
			if daily_activty_end != 0:
				daily_diff_hrr = daily_diff_hrr + (15 - daily_activty_end)
			else:
				pass
			if garmin_data_daily:
				if garmin_data_daily.get('timeOffsetHeartRateSamples',None):
					daily_diff_60 = str(int(daily_diff_hrr + 60))
					daily_diff_data_60 = garmin_data_daily['timeOffsetHeartRateSamples'].get(daily_diff_60,None)
				if daily_diff_data_60:
					hrr_no_fitfile = daily_diff_data_60
				else:
					hrr_no_fitfile = None
			else:
				Did_heartrate_reach_99 = 'no'
				# -1 represents the pure time to 99 did not reach never
				pure_time_99 = -1
				pure_1min_heart_beats = None
		else:
			Did_heartrate_reach_99 = 'no'
			pure_time_99 = None
			pure_1min_heart_beats = None
		if pure1min >= 0 and pure_1min_beats:
			pure_1min_heart_beats = abs(end_heartrate_activity - min(pure_1min_beats))
		elif hrr_no_fitfile:
			pure_1min_heart_beats = abs(end_heartrate_activity - hrr_no_fitfile)
		else:
			pure_1min_heart_beats = 0
		if time_99:
			pure_time_99 = time_99 + diff_actity_hrr
		else:
			pure_time_99 = -1
		
		if Did_heartrate_reach_99 == 'no' and garmin_data_daily:
			if daily_starttime:
				daily_start_time = HRR_activity_start_time - daily_starttime
				make_to_daily_key = (daily_start_time) % 15
				if make_to_daily_key > 7:
					daily_key = str(int(daily_start_time + make_to_daily_key))
				else:
					daily_key = str(int(daily_start_time - make_to_daily_key))
				daily_diff_data_99 = 100
				daily_key_copy = daily_key
				while daily_diff_data_99 >= 99:
					daily_diff_data_99 = garmin_data_daily['timeOffsetHeartRateSamples'].get(
						daily_key_copy,None)
					daily_key_copy = int(daily_key_copy) + 15
					daily_key_copy = str(daily_key_copy)
					if daily_diff_data_99 == 99:
						Did_heartrate_reach_99 == 'yes'
					if daily_diff_data_99 == None or daily_diff_data_99 == 99:
						break
				if time_99:
					time_99 = (int(daily_key_copy) - int(daily_key)) + time_99
				else:
					time_99 = (int(daily_key_copy) - int(daily_key))
				pure_time_99 = time_99 + diff_actity_hrr
			else:
				time_99 = None
				
		if diff_actity_hrr > 120:
			# -1 represents the pure time to 99 did not reach never
			pure_time_99 = -1
			pure_1min_heart_beats = None
		if end_heartrate_activity < 99:
			# -1 represents the HRR activty started before 99
			time_99 = -1
			pure_time_99 = -1
			pure_1min_heart_beats = None

	else:
		Did_you_measure_HRR = 'no'
		
	if (not hrr) and workout and workout_final_heartrate:
		end_time_activity = workout_timestamp[-1]-(offset)
		end_heartrate_activity  = workout_final_heartrate[-1]
		if daily_starttime:
			daily_diff = end_time_activity - daily_starttime
			daily_activty_end = daily_diff % 15
			if daily_activty_end != 0:
				daily_diff = daily_diff + (15 - daily_activty_end)
			else:
				pass
		else:
			daily_diff = 0
		if garmin_data_daily:
			if garmin_data_daily.get('timeOffsetHeartRateSamples',None):
				daily_diff1 = str(int(daily_diff))
				data_end_activity = garmin_data_daily['timeOffsetHeartRateSamples'].get(daily_diff1,None)
		#if data_end_activity:
			#end_heartrate_activity = data_end_activity
		daily_diff_data_99 = None
		if garmin_data_daily:
			if garmin_data_daily.get('timeOffsetHeartRateSamples',None):
				daily_diff_60 = str(int(daily_diff + 60))
				daily_diff_data_60 = garmin_data_daily['timeOffsetHeartRateSamples'].get(daily_diff_60,None)
				daily_diff_99 = daily_diff_60
				daily_diff_data_99 = daily_diff_data_60
				if daily_diff_data_99:
					while daily_diff_data_99 >= 99:
						daily_diff_data_99 = garmin_data_daily['timeOffsetHeartRateSamples'].get(daily_diff_99,None)
						daily_diff_99 = int(daily_diff_99) + 15
						daily_diff_99 = str(daily_diff_99)
						if daily_diff_data_99 == None:
							no_fitfile_hrr_reach_99 = "no"
							no_fitfile_hrr_time_reach_99 = 0.00
							time_heart_rate_reached_99 = 0.00
							break
				if daily_diff_data_99 != None and daily_diff_data_99 <= 99:
					Did_heartrate_reach_99 = 'yes'
				if daily_diff_data_60:
					if daily_diff_data_60 < 99:
						no_fitfile_hrr_time_reach_99 = daily_diff_data_60
					if daily_diff_data_60 >= 99:
						no_fitfile_hrr_time_reach_99 = int(daily_diff_99)-int(daily_diff_60)-15
				else:
					no_fitfile_hrr_time_reach_99 = None
			else:
				no_fitfile_hrr_time_reach_99 = None
		if daily_diff_data_60:
			hrr_no_fitfile = daily_diff_data_60
		else:
			hrr_no_fitfile = None

		if daily_diff_data_60:		
			if daily_diff_data_60 <= 99:
				no_fitfile_hrr_reach_99 = 'yes'
			else:
				no_fitfile_hrr_reach_99 = 'no'
		else:
			no_fitfile_hrr_reach_99 = ''
		if daily_diff_data_60:
			no_file_beats_recovered = abs(end_heartrate_activity - daily_diff_data_60)
		else:
			no_file_beats_recovered = 0
		if no_fitfile_hrr_time_reach_99:
			time_heart_rate_reached_99 = end_time_activity + no_fitfile_hrr_time_reach_99
		else:
			time_heart_rate_reached_99 = None
		if daily_diff_data_99 == None:
			# Did_heartrate_reach_99 = "Heart Rate Data Not Provided"
			Did_heartrate_reach_99 = "no"
			no_fitfile_hrr_time_reach_99 = 0.00
			time_heart_rate_reached_99 = 0.00

	if (hrr and (Did_you_measure_HRR == 'yes' or
		Did_you_measure_HRR == 'no')):
		data = {"Did_you_measure_HRR":Did_you_measure_HRR,
				"Did_heartrate_reach_99":Did_heartrate_reach_99,
				"time_99":time_99,
				"HRR_start_beat":HRR_start_beat,
				"lowest_hrr_1min":lowest_hrr_1min,
				"No_beats_recovered":No_beats_recovered,
				"end_time_activity":end_time_activity,
				"diff_actity_hrr":diff_actity_hrr,
				"HRR_activity_start_time":HRR_activity_start_time,
				"end_heartrate_activity":end_heartrate_activity,#same for without fitfile also with HRR File Starting Heart Rate
				"heart_rate_down_up":heart_rate_down_up,
				"pure_1min_heart_beats":pure_1min_heart_beats,
				"pure_time_99":pure_time_99,

				"no_fitfile_hrr_reach_99":'',
				"no_fitfile_hrr_time_reach_99":None,
				"time_heart_rate_reached_99":None,
				"lowest_hrr_no_fitfile":None,
				"no_file_beats_recovered":None,

				"offset":offset,
				}
	elif (workout and workout_final_heartrate and (Did_you_measure_HRR == 'yes' or
		Did_you_measure_HRR == 'no') and garmin_data_daily):
		data = {
			"Did_heartrate_reach_99":"",
			"time_99":None,
			"HRR_start_beat":None,
			"lowest_hrr_1min":None,
			"No_beats_recovered":None,

			"end_time_activity":end_time_activity,
			"diff_actity_hrr":None,
			"HRR_activity_start_time":None,
			"heart_rate_down_up":None,
			"pure_1min_heart_beats":None,
			"pure_time_99":None,
			"Did_you_measure_HRR":Did_you_measure_HRR,
			"no_fitfile_hrr_reach_99":no_fitfile_hrr_reach_99,
			"no_fitfile_hrr_time_reach_99":no_fitfile_hrr_time_reach_99,
			"time_heart_rate_reached_99":time_heart_rate_reached_99,
			"end_heartrate_activity":end_heartrate_activity,#same for without fitfile also with HRR File Starting Heart Rate
			"lowest_hrr_no_fitfile":hrr_no_fitfile,
			"no_file_beats_recovered":no_file_beats_recovered,

			"offset":offset,
			}
	elif workout and not workout_final_heartrate:
		data = {"Did_you_measure_HRR":'no',
			# "Did_heartrate_reach_99":'Heart rate data did not provided',
			"Did_heartrate_reach_99":'no',
			"time_99":None,
			"HRR_start_beat":None,
			"lowest_hrr_1min":None,
			"No_beats_recovered":None,
			"end_time_activity":None,
			"diff_actity_hrr":None,
			"HRR_activity_start_time":None,
			"end_heartrate_activity":None,
			"heart_rate_down_up":None,
			"pure_1min_heart_beats":None,
			"pure_time_99":None,
			"no_fitfile_hrr_reach_99":'',
			"no_fitfile_hrr_time_reach_99":None,
			"time_heart_rate_reached_99":None,
			"lowest_hrr_no_fitfile":None,
			"no_file_beats_recovered":None,
			"offset":None,
			}
	else:
		data = {"Did_you_measure_HRR":'',
			"Did_heartrate_reach_99":'',
			"time_99":None,
			"HRR_start_beat":None,
			"lowest_hrr_1min":None,
			"No_beats_recovered":None,
			"end_time_activity":None,
			"diff_actity_hrr":None,
			"HRR_activity_start_time":None,
			"end_heartrate_activity":None,
			"heart_rate_down_up":None,
			"pure_1min_heart_beats":None,
			"pure_time_99":None,
			"no_fitfile_hrr_reach_99":'',
			"no_fitfile_hrr_time_reach_99":None,
			"time_heart_rate_reached_99":None,
			"lowest_hrr_no_fitfile":None,
			"no_file_beats_recovered":None,
			"offset":None,
			}
	# add_date_to_fitfile()
	return data

def hrr_calculations(request):
	start_date_get = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date_get, "%Y-%m-%d").date()
	data = hrr_data(request.user,start_date)
	if data.get('Did_you_measure_HRR'):
		try:	
			user_hrr = Hrr.objects.get(user_hrr=request.user, created_at=start_date)
			update_hrr_instance(user_hrr, data)
		except Hrr.DoesNotExist:
			create_hrr_instance(request.user, data, start_date)
	return JsonResponse(data)	

def update_data_as_per_userinput_form(user,data,current_date):
	'''
		Take user input form data and update to calculated values
	'''
	userinput_obj = DailyUserInputEncouraged.objects.filter(
		user_input__user=user,user_input__created_at=current_date)
	for single_obj in userinput_obj:
		time_99 = single_obj.time_to_99
		hr_down_99 = single_obj.hr_down_99
		hr_level = single_obj.hr_level
		lowest_hr_first_minute = single_obj.lowest_hr_first_minute
		if time_99:
			min,sec = time_99.split(':')
			time_99_convert = (float(sec))+(float(min)*60)
			data["time_99"] = time_99_convert
		if hr_down_99:
			data["Did_heartrate_reach_99"] = hr_down_99
		if hr_level:
			data['HRR_start_beat'] =  float(hr_level)
		if lowest_hr_first_minute:
			data['lowest_hrr_1min'] =  float(lowest_hr_first_minute)
			data['No_beats_recovered'] = data.get(
				'HRR_start_beat',0)-float(lowest_hr_first_minute)
		if single_obj.measured_hr:
			data['Did_you_measure_HRR'] = single_obj.measured_hr

	return data

def hrr_only_store(user,current_date):
	data = hrr_data(user,current_date)
	data = update_data_as_per_userinput_form(user,data,current_date)
	try:
		user_hrr = Hrr.objects.get(user_hrr=user, created_at=current_date)
		update_hrr_instance(user_hrr, data)
	except Hrr.DoesNotExist:
		create_hrr_instance(user, data, current_date)

def store_garmin_hrr(user,from_date,to_date,type_data):
	'''
		This function will store only Garmin HRR data
	'''
	print("HRR calculations got started",user.username)
	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	current_date = to_date_obj
	while (current_date >= from_date_obj):
		try:
			hrr_obj = Hrr.objects.get(user_hrr=user,created_at=current_date)
		except:
			hrr_obj = None
			logging.exception("message")
		if not hrr_obj or not hrr_obj.use_updated_hrr:
			if type_data == 'dailies' or not hrr_obj or hrr_obj.Did_you_measure_HRR == 'no':
				hrr_only_store(user,current_date)
			elif not type_data:
				hrr_only_store(user,current_date)
		current_date -= timedelta(days=1)
	print("HRR calculations got finished")
	return None

def store_fitbit_hrr(user,from_date,to_date):
	from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	current_date = to_date_obj
	while (current_date >= from_date_obj):
		fitbit_hrr = fitbit_aa.generate_hrr_charts(user,current_date)
		if fitbit_hrr.get('Did_you_measure_HRR'):
			print("Storing Fitbit HRR")
			try:
				user_hrr = Hrr.objects.get(
					user_hrr=user, created_at=current_date)
				update_hrr_instance(user_hrr, fitbit_hrr)
			except Hrr.DoesNotExist:
				create_hrr_instance(user, fitbit_hrr, current_date)
		current_date -= timedelta(days=1)
	return None

def store_hhr(user,from_date,to_date,type_data=None):
	'''
	This function takes user start date and end date, calculate the HRR calculations 
	then stores in Data base

	Args:user(user object)
		:from_date(start date)
		:to_date(end date)

	Return:None
	'''
	# print("HRR calculations got started",user.username)
	# from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
	# to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
	# current_date = to_date_obj
	# while (current_date >= from_date_obj):
	# 	try:
	# 		hrr_obj = Hrr.objects.get(user_hrr=user,created_at=current_date)
	# 	except:
	# 		hrr_obj = None
	# 	if type_data == 'dailies' or not hrr_obj or hrr_obj.Did_you_measure_HRR == 'no':	 
	# 		hrr_only_store(user,current_date)
	# 	elif not type_data:
	# 		hrr_only_store(user,current_date)
	# 	current_date -= timedelta(days=1)
	# print("HRR calculations got finished")
	device_type = quicklook.calculations.calculation_driver.which_device(user)
	if device_type == "garmin":
		store_garmin_hrr(user,from_date,to_date,type_data)
	elif device_type == 'fitbit':
		print("Fitbit HRR data calculation got started")
		store_fitbit_hrr(user,from_date,to_date)
		print("Fitbit HRR data calculation finished")
	return None

class UserheartzoneView(APIView):

	permission_classes = (IsAuthenticated,)
	serializer_class = HeartzoneSerializer
	def calculate_weekly_zone_data(self,zone_weekly_qs,no_days):
		hr_data_values = [hr_data.data for hr_data in zone_weekly_qs]
		hr_values = []
		for hr in hr_data_values:
			if hr:
				hr_values.append(ast.literal_eval(hr))

		lists = [[],[]]
		heartzone_dic = {}
		for hr in hr_values:
			hr_keys = hr.keys()
			hr_keys = list(hr_keys)

			for i in range(len(hr_keys)):
				lists[0].append([])
				lists[1].append([])

			for key,li_time,li_prcnt in zip(hr_keys,lists[0],lists[1]):
				duration_in_zone = hr[key].get('time_in_zone',0)
				li_time.append(duration_in_zone)
				percent_in_zone = hr[key].get('prcnt_total_duration_in_zone',0)
				li_prcnt.append(percent_in_zone)
		total_duration = []
		no_hr_time = []
		for hr in hr_values:
			for key,time,prcnt in zip(hr_keys,lists[0],lists[1]):
				low_end = hr[key].get('heart_rate_zone_low_end',0)
				high_end = hr[key].get('heart_rate_zone_high_end',0)
				classification = hr[key].get('classificaton')
				total_time = hr[key].get('total_duration',0)
				time_in_zone = hr[key].get('time_in_zone',0)
				avg_time = (sum(time)/no_days)*7
				total_duration.append(time_in_zone)
				if key == "heartrate_not_recorded":
					no_hr_time.append(hr[key]["time_in_zone"])
				try:
					percent_duration = sum(prcnt)/len(prcnt)
					percent_duration = int(Decimal(percent_duration).quantize(0,ROUND_HALF_UP))
				except ZeroDivisionError:
					percent_duration = ""

				heartzone_data = {"heart_rate_zone_low_end":low_end,
								  "heart_rate_zone_high_end":high_end,
								  "classificaton":classification,
								  "time_in_zone":avg_time,
								  "prcnt_total_duration_in_zone":percent_duration
								  }
				heartzone_dic[low_end] = heartzone_data
		if heartzone_dic:
			heartzone_dic["heartrate_not_recorded"] = {}
			heartzone_dic["heartrate_not_recorded"]["classificaton"] = "heart_rate_not_recorded"
			heartzone_dic["heartrate_not_recorded"]["time_in_zone"] = sum(no_hr_time)
			try:
				heartzone_dic["heartrate_not_recorded"]["prcnt_total_duration_in_zone"] = (
					total_duration/sum(no_hr_time))
			except:
				heartzone_dic["heartrate_not_recorded"]["prcnt_total_duration_in_zone"] = 0

		heartzone_dic['total'] = (sum(total_duration)/no_days)*7	
		return heartzone_dic


	def get(self,request,format="json"):
		weekly_queryset,no_days = self.get_queryset()
		weekly_zone_data = self.calculate_weekly_zone_data(weekly_queryset,no_days)
		return Response(weekly_zone_data, status=status.HTTP_200_OK)

	def get_queryset(self):
		user = self.request.user

		end_dt = self.request.query_params.get('to',None)
		start_dt = self.request.query_params.get('from', None)
		start_date_obj = datetime.strptime(start_dt, "%Y-%m-%d")
		end_dt_obj = datetime.strptime(end_dt, "%Y-%m-%d")
		no_days = (end_dt_obj.date() - start_date_obj.date())+timedelta(days=1)

		if start_dt and end_dt:
			queryset = TimeHeartZones.objects.filter(Q(created_at__gte=start_dt)&
							  Q(created_at__lte=end_dt),
							  user=user)
		else:
			queryset = TimeHeartZones.objects.all()
		
		return (queryset,no_days.days)

class UserAaView(APIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = AaSerializer

	def calculate_weekly_aa_data(self,aa_weekly_qs,no_days):
		data_values = [aa_data.data for aa_data in aa_weekly_qs]
		keys = ['avg_heart_rate','max_heart_rate','total_duration','duration_in_aerobic_range',
				'percent_aerobic','duration_in_anaerobic_range','percent_anaerobic','duration_below_aerobic_range',
				'percent_below_aerobic','duration_hrr_not_recorded','percent_hrr_not_recorded']
		# Change below list, for time being I am using this
		lists = [[],[],[],[],[],[],[],[],[],[],[]]
		average_heart_rates = []
		maximum_heart_rates = []
		for single_activty in data_values:
			single_activty = ast.literal_eval(single_activty)
			for key,value in single_activty.items():
				if key != "Totals":
					single_hr = value.get("avg_heart_rate",0)
					average_heart_rates.append(single_hr)
					max_hr = value.get("max_heart_rate",0)
					maximum_heart_rates.append(max_hr)
		avg_heart_rate = [x for x in average_heart_rates if x != 0]
		try:
			avg_heart_rate = sum(avg_heart_rate)/len(avg_heart_rate)
		except:
			avg_heart_rate = 0
		try:
			max_heart_rate = max(maximum_heart_rates)
		except:
			max_heart_rate = 0
		for aa in data_values:
			aa = ast.literal_eval(aa)
			if aa:
				try:
					aa_totals = aa['Totals']
					aa_totals["avg_heart_rate"] = avg_heart_rate
					aa_totals["max_heart_rate"] = max_heart_rate
				except (ValueError,SyntaxError):
					aa_totals = aa['Totals']
					aa_totals["avg_heart_rate"] = avg_heart_rate
					aa_totals["max_heart_rate"] = max_heart_rate
				#print(aa_totals,"aa_totals")
				for key,li in zip(keys,lists):
					aa_values = aa_totals[key]
					li.append(aa_values)
		try:
			max_heart_rate = max(lists[1])
		except ValueError:
			max_heart_rate = ""
		
		duration_in_aerobic_range = ((sum(lists[3])/no_days)*7)
		duration_in_anaerobic_range = ((sum(lists[5])/no_days)*7)
		duration_below_aerobic_range = ((sum(lists[7])/no_days)*7)
		duration_hrr_not_recorded = ((sum(lists[9])/no_days)*7)
		total_duration = (duration_in_aerobic_range+
							duration_in_anaerobic_range+
							duration_below_aerobic_range+
							duration_hrr_not_recorded)
		try:
			avg_heart_rate = sum(lists[0])/len(lists[0])
			avg_heart_rate = int(Decimal(avg_heart_rate).quantize(0,ROUND_HALF_UP))

			percent_aerobic = (duration_in_aerobic_range/total_duration)*100
			percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))

			percent_anaerobic = (duration_in_anaerobic_range/total_duration)*100
			percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))

			percent_below_aerobic = (duration_below_aerobic_range/total_duration)*100
			percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))

			percent_hrr_not_recorded = (duration_hrr_not_recorded/total_duration)*100
			percent_hrr_not_recorded = int(Decimal(percent_hrr_not_recorded).quantize(0,ROUND_HALF_UP))
		except ZeroDivisionError:
			avg_heart_rate = ""
			percent_aerobic = ""
			percent_anaerobic = ""
			percent_below_aerobic = ""
			percent_hrr_not_recorded = ""

		total_data = {"avg_heart_rate":avg_heart_rate,
					"max_heart_rate":max_heart_rate,
					"total_duration":total_duration,
					"duration_in_aerobic_range":duration_in_aerobic_range,
					"percent_aerobic":percent_aerobic,
					"duration_in_anaerobic_range":duration_in_anaerobic_range,
					"percent_anaerobic":percent_anaerobic,
					"duration_below_aerobic_range":duration_below_aerobic_range,
					"percent_below_aerobic":percent_below_aerobic,
					"duration_hrr_not_recorded":duration_hrr_not_recorded,
					"percent_hrr_not_recorded":percent_hrr_not_recorded}
		
		return total_data

	def get(self,request,format="json"):
		weekly_queryset,no_days = self.get_queryset()
		weekly_aa_data = self.calculate_weekly_aa_data(weekly_queryset,no_days)
		return Response(weekly_aa_data, status=status.HTTP_200_OK)

	def get_queryset(self):
		user = self.request.user

		end_dt = self.request.query_params.get('to',None)
		start_dt = self.request.query_params.get('from', None)
		start_date_obj = datetime.strptime(start_dt, "%Y-%m-%d")
		end_dt_obj = datetime.strptime(end_dt, "%Y-%m-%d")
		no_days = (end_dt_obj.date() - start_date_obj.date())+timedelta(days=1)
		if start_dt and end_dt:
			queryset = AaCalculations.objects.filter(Q(created_at__gte=start_dt)&
							  Q(created_at__lte=end_dt),
							  user_aa=user)
		else:
			queryset = AaCalculations.objects.all()
		return (queryset,no_days.days)

def weekly_workout_summary(request):
	'''
		Create the weekly workout summary cart api
	'''
	start_date = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
	complete_data = weekly_workout_helper(request.user,start_date)
	return JsonResponse(complete_data)

def weekly_workout_helper(user,start_date):
	week_start_date,week_end_date = week_date(start_date)
	print("start date",week_start_date,"end date",week_end_date)
	weekly_workouts_query = get_weekly_workouts(
		user,week_start_date,week_end_date)
	user_age = user.profile.age()
	below_aerobic_value = 180-user_age-30
	anaerobic_value = 180-user_age+5
	aerobic_range = '{}-{}'.format(below_aerobic_value,anaerobic_value)
	anaerobic_range = '{} or above'.format(anaerobic_value+1)
	below_aerobic_range = 'below {}'.format(below_aerobic_value	)
	weekly_workout = [single_workout.data for single_workout in weekly_workouts_query]
	if weekly_workout:
		final_workout_data,workout_summary_id,workout_type = weekly_workout_calculations(
			weekly_workout)
	else:
		final_workout_data = ''
		workout_summary_id = ''
	weekly_aa_query = get_weekly_aa(
		user,week_start_date,week_end_date)
	weekly_aa = [single_aa.data for single_aa in weekly_aa_query]
	if weekly_aa:
		final_aa_data = weekly_aa_calculations(weekly_aa,workout_summary_id,final_workout_data)
	else:
		final_aa_data = ''
	if final_workout_data and final_aa_data:
		merged_data = merge_activities(final_workout_data,final_aa_data)
		added_totals = totals_workout(merged_data,len(weekly_aa_query))
	else:
		added_totals = {}
	if added_totals:
		final_data = add_duration_percent(added_totals)
		data = dynamic_activities(final_data,workout_type)
	else:
		data = {}
	if data:
		data_v2 = remove_distance_meters(data,weekly_workout)
		data_v2["heartrate_ranges"] = {}
		data_v2["heartrate_ranges"]["aerobic_range"] = aerobic_range
		data_v2["heartrate_ranges"]["below_aerobic_range"] = below_aerobic_range
		data_v2["heartrate_ranges"]["anaerobic_range"] = anaerobic_range
	else:
		data_v2 = {}
	# print(data_v2,"sssssssssssss")
	return data_v2

def particular_activity(user,activity_id):
	'''
		Update the fitfile belong date to the particular Fitfile
	'''
	activities = UserGarminDataActivity.objects.filter(
					user=user,summary_id=activity_id).order_by('id')
	if activities:
		for value in activities:
			data = value.data
			data_formated = ast.literal_eval(data)
			strat_time = data_formated.get("startTimeInSeconds",0)
			activity_offset = data_formated.get("startTimeOffsetInSeconds",0)
			start_time = strat_time + activity_offset
			if start_time:
				fitfile_belong_date = datetime.utcfromtimestamp(start_time)
			else:
				fitfile_belong_date = None
	else:
		fitfile_belong_date = None
	if fitfile_belong_date:
		return fitfile_belong_date.date()
	else:
		return fitfile_belong_date

def get_activty_related_fitfile(fitfiles_no_date):
	'''
		this function will get the related activities to the Fitfiles
	'''
	for single_fitfile in fitfiles_no_date:
		user = single_fitfile.user
		meta_data_fitfile = single_fitfile.meta_data_fitfile
		meta_data_fitfile = ast.literal_eval(meta_data_fitfile)
		activity_id = meta_data_fitfile.get('activityIds',0)
		if activity_id[0] and user:
			have_activity = particular_activity(user,str(activity_id[0]))
		else:
			have_activity = None
		if have_activity:
			single_fitfile.fit_file_belong_date = have_activity
			single_fitfile.save()

def add_date_to_fitfile():
	'''
		This fuction will work as if thre is none value in the fitfile belong date 
		then update that field
	'''
	# data_now = date.today()
	# year = data_now.year
	# month = data_now.month
	# day = data_now.day
	# datetime_obj = datetime(year,month,day,0,0,0)
	# print(datetime_obj)
	fitfiles_no_date = GarminFitFiles.objects.filter(fit_file_belong_date=None)
	# print(fitfiles_no_date,"fitfiles_no_date")
	if fitfiles_no_date:
		get_activty_related_fitfile(fitfiles_no_date)