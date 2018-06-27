import json
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


from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.db.models import Q

from registration.models import Profile
from user_input.models import DailyUserInputStrong
from garmin.models import GarminFitFiles,\
						UserGarminDataDaily,\
						UserGarminDataActivity,\
						UserGarminDataManuallyUpdated
from quicklook.calculation_helper import get_filtered_activity_stats
from fitparse import FitFile

from .serializers import AaSerializer,HeartzoneSerializer
from hrr.models import Hrr,AaCalculations,TimeHeartZones
from .serializers import HrrSerializer
from hrr.models import Hrr
import pprint

class UserHrrView(generics.ListCreateAPIView):
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

# Parse the fit files and return the heart beat and timstamp
def fitfile_parse(obj,offset,start_date_str):
	heartrate_complete = []
	timestamp_complete = []

	obj_start_year = int(start_date_str.split('-')[0])
	obj_start_month = int(start_date_str.split('-')[1])
	obj_start_date = int(start_date_str.split('-')[2])
	
	x = [(FitFile(x.fit_file)).get_messages('record') for x in obj]
	
	for record in x:
		for record_data in record:
			for ss in record_data:
				if(ss.name=='heart_rate'):
					b = ss.value
					heartrate_complete.extend([b])

				if(ss.name=='timestamp'):
					c = ss.value
					cc = c.strftime('%Y-%m-%d')
					timestamp_complete.extend([c])

	heartrate_selected_date = []
	timestamp_selected_date = []
	
	start_date_obj = datetime(obj_start_year,obj_start_month,obj_start_date,0,0,0)
	end_date_obj = start_date_obj + timedelta(days=1)
	
	
	for heart,timeheart in zip(heartrate_complete,timestamp_complete):
		timeheart_str = timeheart.strftime("%Y-%m-%d %H:%M:%S")
		timeheart_utc = int(time.mktime(datetime.strptime(timeheart_str, "%Y-%m-%d %H:%M:%S").timetuple()))+offset
		timeheart_utc = datetime.utcfromtimestamp(timeheart_utc)
		if timeheart_utc >= start_date_obj and timeheart_utc <= end_date_obj:
			heartrate_selected_date.extend([heart])
			timestamp_selected_date.extend([timeheart])

		
	to_timestamp = []
	for i,k in enumerate(timestamp_selected_date):
		dtt = k.timetuple()
		ts = time.mktime(dtt)
		ts = ts+offset
		to_timestamp.extend([ts])
	
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

	return (final_heartrate,final_timestamp,to_timestamp)

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


def aa_calculations(request):
	start_date = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date, "%Y-%m-%d").date()

	start = start_date
	end = start_date + timedelta(days=7)
	start_date_str = start_date.strftime('%Y-%m-%d')

	start_date_timestamp = start_date
	start_date_timestamp = start_date_timestamp.timetuple()
	start_date_timestamp = time.mktime(start_date_timestamp)
	end_date_timestamp = start_date_timestamp + 86400

	activity_files_qs=UserGarminDataActivity.objects.filter(user=request.user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
	activity_files = [pr.data for pr in activity_files_qs]

	if activity_files:
		one_activity_file_dict =  ast.literal_eval(activity_files[0])
		offset = one_activity_file_dict['startTimeOffsetInSeconds']

	hrr_not_recorded_list = []
	hrr_recorded = []
	if activity_files:
		for i in range(len(activity_files)):
			one_activity_file_dict =  ast.literal_eval(activity_files[i])
			if 'averageHeartRateInBeatsPerMinute' in one_activity_file_dict.keys():
				if (one_activity_file_dict['averageHeartRateInBeatsPerMinute'] == 0 or ''):
					hrr_not_recorded_time = one_activity_file_dict['durationInSeconds']
					hrr_not_recorded_list.append(hrr_not_recorded_time)
			else:
				hrr_not_recorded_time = one_activity_file_dict['durationInSeconds']
				hrr_not_recorded_list.append(hrr_not_recorded_time)
	if hrr_not_recorded_list:
		hrr_not_recorded_seconds = sum(hrr_not_recorded_list)

	data = {"total_time":"",
				"aerobic_zone":"",
				"anaerobic_range":"",
				"below_aerobic_zone":"",
				"aerobic_range":"",
				"anaerobic_range":"",
				"below_aerobic_range":"",
				"hrr_not_recorded":"",
				"percent_hrr_not_recorded":"",
				"percent_aerobic":"",
				"percent_below_aerobic":"",
				"percent_anaerobic":"",
				"total_percent":""}

	user_input_strong = DailyUserInputStrong.objects.filter(
		user_input__created_at=(start_date),
		user_input__user = request.user).order_by('-user_input__created_at')

	activities = []
	id_act = 0
	if user_input_strong:
		for tmp in user_input_strong:
			sn = tmp.activities
			if sn:
				sn = json.loads(sn)
				di = sn.values()
				di = list(di)
				for i,k in enumerate(di):
					if di[i]['activityType'] == 'HEART_RATE_RECOVERY':
						id_act = int(di[i]['summaryId'])
						activities.append(di[i])

	workout = []
	hrr = []
	start = start_date
	end = start_date + timedelta(days=7)
	a1=GarminFitFiles.objects.filter(user=request.user,created_at__range=[start,end])

	if activities:
		for tmp in a1:
			meta = tmp.meta_data_fitfile
			meta = ast.literal_eval(meta)
			data_id = int(meta['activityIds'][0])
			if id_act == data_id:
				hrr.append(tmp)
			else:
				workout.append(tmp)
	else:
		for tmp in a1:
			meta = tmp.meta_data_fitfile
			meta = ast.literal_eval(meta)
			data_id = meta['activityIds'][0]
			for i,k in enumerate(activity_files):
				activity_files_dict = ast.literal_eval(activity_files[i])
				if ((activity_files_dict.get("summaryId",None) == str(data_id)) and (activity_files_dict.get("durationInSeconds",None) <= 1200) and (activity_files_dict.get("distanceInMeters",0) <= 200.00)):
					hrr.append(tmp)
				elif activity_files_dict.get("summaryId",None) == str(data_id) :
					workout.append(tmp)

	# if a1:
	# 	for tmp in a1:
	# 		meta = tmp.meta_data_fitfile
	# 		meta = ast.literal_eval(meta)
	# 		data_id = int(meta['activityIds'][0])
	# 		if data_id == id_act:
	# 			hrr.append(tmp) # getting only hrr files
	# 		else:
	# 			workout.append(tmp)

	# if activities:
	# 	offset =  activities[0]['startTimeOffsetInSeconds']

	profile = Profile.objects.filter(user=request.user)
	for tmp_profile in profile:
		user_dob = tmp_profile.date_of_birth
	user_age = (date.today() - user_dob) // timedelta(days=365.2425)

	if workout:
		workout_data = fitfile_parse(workout,offset,start_date_str)
		workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_data

		below_aerobic_value = 180-user_age-30
		anaerobic_value = 180-user_age+5

		aerobic_range = '{}-{}'.format(below_aerobic_value,anaerobic_value)
		anaerobic_range = '{} or above'.format(anaerobic_value+1)
		below_aerobic_range = 'below {}'.format(below_aerobic_value	)
		
		anaerobic_range_list = []
		below_aerobic_list = []
		aerobic_list = []

		for a, b in zip(workout_final_heartrate,workout_final_timestamp):
			if a > anaerobic_value:
				anaerobic_range_list.extend([b])
			elif a < below_aerobic_value:
				below_aerobic_list.extend([b])
			else:
				aerobic_list.extend([b])

		time_in_aerobic = sum(aerobic_list)
		time_in_below_aerobic = sum(below_aerobic_list)
		time_in_anaerobic = sum(anaerobic_range_list)
		
		total_time = time_in_aerobic+time_in_below_aerobic+time_in_anaerobic
		if hrr_not_recorded_list:
			hrr_not_recorded = hrr_not_recorded_seconds

		try:
			percent_anaerobic = (time_in_anaerobic/total_time)*100
			percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))

			percent_below_aerobic = (time_in_below_aerobic/total_time)*100
			percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))

			percent_aerobic = (time_in_aerobic/total_time)*100
			percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))
			if hrr_not_recorded_list:
				percent_hrr_not_recorded = (hrr_not_recorded/total_time)*100
				percent_hrr_not_recorded = (int(Decimal(percent_hrr_not_recorded).quantize(0,ROUND_HALF_UP)))
			
			total_percent = 100
		except ZeroDivisionError:
			percent_anaerobic=''
			percent_below_aerobic=''
			percent_aerobic=''
			percent_hrr_not_recorded=''
			total_percent=''
			
		if hrr_not_recorded_list:
			data = {"total_time":total_time,
					"aerobic_zone":time_in_aerobic,
					"anaerobic_zone":time_in_anaerobic,
					"below_aerobic_zone":time_in_below_aerobic,
					"aerobic_range":aerobic_range,
					"anaerobic_range":anaerobic_range,
					"below_aerobic_range":below_aerobic_range,
					"hrr_not_recorded":hrr_not_recorded,
					"percent_hrr_not_recorded":percent_hrr_not_recorded,
					"percent_aerobic":percent_aerobic,
					"percent_below_aerobic":percent_below_aerobic,
					"percent_anaerobic":percent_anaerobic,
					"total_percent":total_percent}
		else:
			data = {"total_time":total_time,
					"aerobic_zone":time_in_aerobic,
					"anaerobic_zone":time_in_anaerobic,
					"below_aerobic_zone":time_in_below_aerobic,
					"aerobic_range":aerobic_range,
					"anaerobic_range":anaerobic_range,
					"below_aerobic_range":below_aerobic_range,
					"hrr_not_recorded":"",
					"percent_hrr_not_recorded":"",
					"percent_aerobic":percent_aerobic,
					"percent_below_aerobic":percent_below_aerobic,
					"percent_anaerobic":percent_anaerobic,
					"total_percent":total_percent}
	return JsonResponse(data)

def aa_workout_calculations(request):
	start_date = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
	start_date_str = start_date.strftime('%Y-%m-%d')

	start_date_timestamp = start_date
	start_date_timestamp = start_date_timestamp.timetuple()
	start_date_timestamp = time.mktime(start_date_timestamp)
	end_date_timestamp = start_date_timestamp + 86400
	try:
		user_input_strong = DailyUserInputStrong.objects.filter(
		user_input__created_at=(start_date),
		user_input__user = request.user).order_by('-user_input__created_at')
		activities=[]
		activities_dic={}
		if user_input_strong:
			user_input_activities =[act.activities for act in user_input_strong]
			for i,k in enumerate(user_input_activities):
				input_files=json.loads(user_input_activities[i])
				summaryId = []
				for keys in input_files.keys():
					summaryId.append(keys)
				for i in range(len(summaryId)):
					activities.append(input_files[summaryId[i]])
					activities_dic[summaryId[i]]=input_files[summaryId[i]]
	except (ValueError, SyntaxError):
		pass

	try:
		manually_updated_activities = UserGarminDataManuallyUpdated.objects.filter(user=request.user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
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
		pass

	try:
		garmin_data_activities = UserGarminDataActivity.objects.filter(user=request.user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
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
		pass

	filtered_activities_files = get_filtered_activity_stats(activities_json=garmin_list,
													manually_updated_json=manually_edited_dic,
													userinput_activities=activities_dic)
	act_id = []
	workout = []
	hrr = []
	start = start_date
	end = start_date + timedelta(days=7)
	a1=GarminFitFiles.objects.filter(user=request.user,created_at__range=[start,end])
	if filtered_activities_files:
		for tmp in a1:
			meta = tmp.meta_data_fitfile
			meta = ast.literal_eval(meta)
			data_id = meta['activityIds'][0]
			act_id.append(str(data_id))
			for i,k in enumerate(filtered_activities_files):
				if (filtered_activities_files[i].get("summaryId") == str(data_id) and 
					filtered_activities_files[i].get("durationInSeconds",0) <= 1200 and 
					filtered_activities_files[i].get("distanceInMeters",0) <200) or (filtered_activities_files[i].get("activityType") =="HEART_RATE_RECOVERY"):
					hrr.append(filtered_activities_files[i])
				elif filtered_activities_files[i].get("summaryId") == str(data_id):
					workout.append(filtered_activities_files[i])
		for x in filtered_activities_files:
			if (x.get("summaryId") not in act_id and 
			    x.get("activityType") != "HEART_RATE_RECOVERY"):
				workout.append(x)

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
		start_date = datetime.utcfromtimestamp(start_date_timestamp)
		date = start_date.strftime('%d-%b-%y')
		for workout in workout:
			act_date = date
			summaryId = workout['summaryId']
			workout_type = workout['activityType']
			duration = workout['durationInSeconds']
			time_duration.append(duration)
			avg_heart_rate = workout.get('averageHeartRateInBeatsPerMinute',0)
			heart_rate.append(avg_heart_rate)
			max_heart_rate = workout.get('maxHeartRateInBeatsPerMinute',0)
			max_hrr.append(max_heart_rate)
			exercise_steps = workout.get("steps",0)
			steps.append(exercise_steps)
			
			data = {"date":act_date,
				  "workout_type":workout_type,
				  "duration":duration,
				  "average_heart_rate":avg_heart_rate,
				  "max_heart_rate":max_heart_rate,
				  "steps":exercise_steps,
				  "hrr_not_recorded":"",
				  "prcnt_hrr_not_recorded":""
					}
			data1[summaryId] = data 
			if "averageHeartRateInBeatsPerMinute" in workout.keys():
				if workout['averageHeartRateInBeatsPerMinute'] == 0 or "":
					hrr_not_recorded = workout['durationInSeconds']
					hrr_not_recorded_list.append(hrr_not_recorded)
					data['hrr_not_recorded'] = hrr_not_recorded
			else:
				hrr_not_recorded = workout['durationInSeconds']
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
		return JsonResponse(data1)
	else:
		return JsonResponse({})

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
	if activity_files_qs:
		activity_files = [pr.data for pr in activity_files_qs]
		one_activity_file_dict =  ast.literal_eval(activity_files[0])
		offset = one_activity_file_dict['startTimeOffsetInSeconds']

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

	user_input_strong = DailyUserInputStrong.objects.filter(
		user_input__created_at=(start_date),
		user_input__user = user).order_by('-user_input__created_at')

	workout = []
	hrr = []
	activities_duration = []
	data_summaryid = []
	start = start_date
	end = start_date + timedelta(days=7)
	a1=GarminFitFiles.objects.filter(user=user,created_at__range=[start,end])
	if a1:
		for tmp in a1:
			meta = tmp.meta_data_fitfile
			meta = ast.literal_eval(meta)
			data_id = meta['activityIds'][0]
			if activity_files_qs:
				for i,k in enumerate(activity_files):
					activity_files_dict = ast.literal_eval(activity_files[i])
					if ((activity_files_dict.get("summaryId",None) == str(data_id)) and (activity_files_dict.get("durationInSeconds",0) <= 1200) and (activity_files_dict.get("distanceInMeters",0) <= 200.00)):
						hrr.append(tmp)
					elif activity_files_dict.get("summaryId",None) == str(data_id):
						duration = activity_files_dict.get('durationInSeconds')
						activities_duration.append(duration)
						workout.append(tmp)
						average_heartrate = activity_files_dict.get("averageHeartRateInBeatsPerMinute",0)
						avg_hrr_list.append(average_heartrate)
						maximum_heartrate =  activity_files_dict.get('maxHeartRateInBeatsPerMinute',0)
						max_hrr_list.append(maximum_heartrate)
						data_summaryid.append(data_id)
						if "averageHeartRateInBeatsPerMinute" in activity_files_dict.keys():
							if activity_files_dict.get("averageHeartRateInBeatsPerMinute",0) == 0 or "" :
								hrr_not_recorded = activity_files_dict.get('durationInSeconds')
								hrr_not_recorded_list.append(hrr_not_recorded)
							else:
								hrr_not_recorded_list.append(0)
						else:
							hrr_not_recorded = activity_files_dict.get('durationInSeconds')
							hrr_not_recorded_list.append(hrr_not_recorded)
	if hrr_not_recorded_list:
		for tm in hrr_not_recorded_list:
			try:
				prcnt_hrr_not_recorded = (tm/sum(activities_duration))*100
				prcnt_hrr_not_recorded = int(Decimal(int(Decimal(prcnt_hrr_not_recorded).quantize(0,ROUND_HALF_UP))).quantize(0,ROUND_HALF_UP))
				prcnt_hrr_not_recorded_list.append(prcnt_hrr_not_recorded)
			except ZeroDivisionError:
				prcnt_hrr_not_recorded = ""
				prcnt_hrr_not_recorded_list.append(prcnt_hrr_not_recorded)


	try:
		avg_hrr = sum(filter(lambda i: isinstance(i, int),avg_hrr_list))/len(avg_hrr_list)
		avg_hrr = int(Decimal(avg_hrr).quantize(0,ROUND_HALF_UP))
	except ZeroDivisionError:
		avg_hrr = ""
	try:
		max_hrr = max(max_hrr_list)
	except ValueError:
		max_hrr = ""
	
	profile = Profile.objects.filter(user=user)
	if profile:
		for tmp_profile in profile:
			user_dob = tmp_profile.date_of_birth
		user_age = (date.today() - user_dob) // timedelta(days=365.2425)

	all_activities_heartrate = []
	all_activities_timestamp = []
	activies_timestamp = []
	daily_aa_data={}

	if workout:
		for tmp in workout:
			workout_activities = fitfile_parse([tmp],offset,start_date_str)
			workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_activities
			all_activities_heartrate.append(workout_final_heartrate)
			all_activities_timestamp.append(workout_final_timestamp)
			activies_timestamp.append(workout_timestamp)

		below_aerobic_value = 180-user_age-30
		anaerobic_value = 180-user_age+5

		aerobic_range = '{}-{}'.format(below_aerobic_value,anaerobic_value)
		anaerobic_range = '{} or above'.format(anaerobic_value+1)
		below_aerobic_range = 'below {}'.format(below_aerobic_value	)
		
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

			
			data = {"avg_heart_rate":avg_hrr_list[i],
					"max_heart_rate":max_hrr_list[i],
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
			daily_aa_data[str(data_summaryid[i])] =data
	
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
				  "total_duration":total_time,
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
	
	if daily_aa_data:
		return daily_aa_data
	else:
		return ({})

def update_aa_instance(user,start_date,data):
	AaCalculations.objects.filter(
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
			user_aa = AaCalculations.objects.get(
				user_aa=request.user, created_at=start_date)
			update_aa_instance(request.user,start_date,data)
		except AaCalculations.DoesNotExist:
			create_aa_instance(request.user, data, start_date)
	return JsonResponse(data)


def aa_low_high_end_data(user,start_date):
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
	if activity_files_qs:
		activity_files = [pr.data for pr in activity_files_qs]
		one_activity_file_dict =  ast.literal_eval(activity_files[0])
		offset = one_activity_file_dict['startTimeOffsetInSeconds']

	user_input_strong = DailyUserInputStrong.objects.filter(
		user_input__created_at=(start_date),
		user_input__user = user).order_by('-user_input__created_at')

	activities = []
	id_act = 0
	if user_input_strong:
		for tmp in user_input_strong:
			sn = tmp.activities
			if sn:
				sn = json.loads(sn)
				di = sn.values()
				di = list(di)
				for i,k in enumerate(di):
					if di[i]['activityType'] == 'HEART_RATE_RECOVERY':
						id_act = int(di[i]['summaryId'])
						activities.append(di[i])

	workout = []
	hrr = []
	start = start_date
	end = start_date + timedelta(days=7)
	a1=GarminFitFiles.objects.filter(user= user,created_at__range=[start,end])
	if a1:
		for tmp in a1:
			meta = tmp.meta_data_fitfile
			meta = ast.literal_eval(meta)
			data_id = meta['activityIds'][0]
			for i,k in enumerate(activity_files):
				activity_files_dict = ast.literal_eval(activity_files[i])
				if ((activity_files_dict.get("summaryId",None) == str(data_id)) and (activity_files_dict.get("durationInSeconds",None) <= 1200) and (activity_files_dict.get("distanceInMeters",0) <= 200.00)):
					hrr.append(tmp)
				elif activity_files_dict.get("summaryId",None) == str(data_id) :
					workout.append(tmp)


	profile = Profile.objects.filter(user=user)
	if profile:
		for tmp_profile in profile:
			user_dob = tmp_profile.date_of_birth
		user_age = (date.today() - user_dob) // timedelta(days=365.2425)
	
	data = {"heart_rate_zone_low_end":"",
				"heart_rate_zone_high_end":"",
				"classification":"",
				"time_in_zone":"",
				"prcnt_total_duration_in_zone":"",
				}

	below_aerobic_value = 180-user_age-30
	anaerobic_value = 180-user_age+5
	data2 = {}
	classification_dic = {}
	if workout:
		workout_data = fitfile_parse(workout,offset,start_date_str)
		workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_data

		low_end_values = [-60,-55,-50,-45,-40,-35,-30,-25,-20,-15,-10,+1,6,10,14,19,24,
							29,34,39,44,49,54,59]
		high_end_values = [-56,-51,-46,-41,-36,-31,-26,-21,-16,-11,0,5,10,13,18,23,28,
							33,38,43,48,53,58,63]

		low_end_heart = [180-user_age+tmp for tmp in low_end_values]
		high_end_heart = [180-user_age+tmp for tmp in high_end_values]

		low_end_dict = dict.fromkeys(low_end_heart,0)
		# high_end_dict = dict.fromkeys(high_end_heart,0)

		for a,b in zip(low_end_heart,high_end_heart):
			for c,d in zip(workout_final_heartrate,workout_final_timestamp):
				if c>=a and c<=b:
					low_end_dict[a] = low_end_dict[a] + d
		total_time_duration = sum(low_end_dict.values())
				
		for a,b in zip(low_end_heart,high_end_heart):					
			if a and b > anaerobic_value:
				classification_dic[a] = 'anaerobic_zone'
			elif a and b < below_aerobic_value:
				classification_dic[a] = 'below_aerobic_zone'
			else:
				classification_dic[a] = 'aerobic_zone'
			prcnt_in_zone = (low_end_dict[a]/total_time_duration)*100
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
		return data2
	else:
		return ({})



def update_heartzone_instance(user, start_date,data):
	user = TimeHeartZones.objects.filter(
			user=user, created_at=start_date).update(data=data)

def create_heartzone_instance(user, data, start_date):
	created_at = start_date
	TimeHeartZones.objects.create(user = user,created_at = created_at,data=data)

def aa_low_high_end_calculations(request):
	start_date_get = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date_get, "%Y-%m-%d").date()
	data = aa_low_high_end_data(request.user,start_date)
	# data = json.dumps(data)
	if data:
		try:
			user = TimeHeartZones.objects.get(
				user=request.user, created_at=start_date)
			update_heartzone_instance(request.user, start_date,data)
		except TimeHeartZones.DoesNotExist:
			create_heartzone_instance(request.user, data, start_date)
	return JsonResponse(data)
	

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
	user_input_strong = DailyUserInputStrong.objects.filter(
		user_input__created_at=(start_date),
		user_input__user = user).order_by('-user_input__created_at')

	activity_files_qs=UserGarminDataActivity.objects.filter(user=user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
	activity_files = [pr.data for pr in activity_files_qs]

	offset = 0
	if activity_files:
		one_activity_file_dict =  ast.literal_eval(activity_files[0])
		offset = one_activity_file_dict['startTimeOffsetInSeconds']

	count = 0
	id_act = 0
	activities = []
	if user_input_strong:
		for tmp in user_input_strong:
			sn = tmp.activities
			if sn:
				sn = json.loads(sn)
				di = sn.values()
				di = list(di)
				for i,k in enumerate(di):
					if di[i]['activityType'] == 'HEART_RATE_RECOVERY':
						id_act = int(di[i]['summaryId'])
						count = count + 1
						activities.append(di[i])
	
	start_date_timestamp = start_date_timestamp
	garmin_data_daily = UserGarminDataDaily.objects.filter(user=user,start_time_in_seconds=start_date_timestamp).last()
	
	if garmin_data_daily:
		garmin_data_daily = ast.literal_eval(garmin_data_daily.data)
		daily_starttime = garmin_data_daily['startTimeInSeconds']

	start = start_date
	end = start_date + timedelta(days=3)
	a1=GarminFitFiles.objects.filter(user=user,created_at__range=[start,end])

	workout = []
	hrr = []
	
	'''
		Below try block do, first capture data from user input form and identify file as  
		hrr file if it fails then else block will do assumtion calculation for idetifying
		the HRR fit file
	'''

	try:
		if activities:
			for tmp in a1:
				meta = tmp.meta_data_fitfile
				meta = ast.literal_eval(meta)
				data_id = int(meta['activityIds'][0])
				if id_act == data_id:
					hrr.append(tmp)
				else:
					workout.append(tmp)
		else:
			for tmp in a1:
				meta = tmp.meta_data_fitfile
				meta = ast.literal_eval(meta)
				data_id = meta['activityIds'][0]
				for i,k in enumerate(activity_files):
					activity_files_dict = ast.literal_eval(activity_files[i])
					if ((activity_files_dict.get("summaryId",None) == str(data_id)) and (activity_files_dict.get("durationInSeconds",None) <= 1200) and (activity_files_dict.get("distanceInMeters",0) <= 200.00)):
						hrr.append(tmp)
					elif activity_files_dict.get("summaryId",None) == str(data_id) :
						workout.append(tmp)
	except:
		pass


	if workout:
		workout_data = fitfile_parse(workout,offset,start_date_str)
		workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_data
		
	Did_you_measure_HRR = ""
	if hrr:
		hrr_data = fitfile_parse(hrr,offset,start_date_str)
		hrr_final_heartrate,hrr_final_timestamp,hrr_timestamp = hrr_data
		hrr_difference = hrr_final_heartrate[0]-hrr_final_heartrate[-1]
		if (hrr_difference > 10) or activities:
			Did_you_measure_HRR = 'yes'
			workout_hrr_before_hrrfile = []
			workout_time_before_hrrfile = []
			workout_timestamp_before_hrrfile = []

			for i,k,j in zip(workout_final_heartrate,workout_final_timestamp,workout_timestamp):
				if j < hrr_timestamp[1]:
					workout_hrr_before_hrrfile.append(i)
					workout_time_before_hrrfile.append(k)
					workout_timestamp_before_hrrfile.append(j)

			time_toreach_99 = []
			for i,k in zip(hrr_final_heartrate,hrr_final_timestamp):
				if i >= 99:
					time_toreach_99.append(k)
				if(i == 99) or (i < 99):
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
			time_99 = sum(time_toreach_99[:-1])
			end_time_activity = workout_timestamp_before_hrrfile[-1]-(offset)
			end_heartrate_activity  = workout_hrr_before_hrrfile[-2]
			
			# end_time_activity = workout_timestamp[-1]-(offset)
			# end_heartrate_activity  = workout_final_heartrate[-1]
			daily_diff = end_time_activity - daily_starttime
			daily_activty_end = daily_diff % 15
			if daily_activty_end != 0:
				daily_diff = daily_diff + (15 - daily_activty_end)
			else:
				pass
			if garmin_data_daily:
				if garmin_data_daily.get('timeOffsetHeartRateSamples',None):
					daily_diff1 = str(int(daily_diff))
					data_end_activity = garmin_data_daily['timeOffsetHeartRateSamples'].get(daily_diff1,None)
			if data_end_activity:
				end_heartrate_activity = data_end_activity
			end_heartrate_activity  = workout_hrr_before_hrrfile[-2]

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
			else:
				daily_diff_hrr = end_time_activity - daily_starttime
				daily_activty_end = daily_diff_hrr % 15
				if daily_activty_end != 0:
					daily_diff_hrr = daily_diff_hrr + (15 - daily_activty_end)
				else:
					pass
				if garmin_data_daily.get('timeOffsetHeartRateSamples',None):
					daily_diff_60 = str(int(daily_diff_hrr + 60))
					daily_diff_data_60 = garmin_data_daily['timeOffsetHeartRateSamples'].get(daily_diff_60,None)
				if daily_diff_data_60:
					hrr_no_fitfile = daily_diff_data_60
				else:
					hrr_no_fitfile = None
			if pure1min >= 0 and pure_1min_beats:
				pure_1min_heart_beats = abs(end_heartrate_activity - pure_1min_beats[-1])
			elif hrr_no_fitfile:
				pure_1min_heart_beats = abs(end_heartrate_activity - hrr_no_fitfile)
			else:
				pure_1min_heart_beats = 0
			pure_time_99 = time_99 + diff_actity_hrr
			
			if Did_heartrate_reach_99 == 'no':
				pure_time_99 = None

			# end_time_activity = workout_timestamp[-1]-(offset)
			# end_heartrate_activity  = workout_final_heartrate[-1]
			# daily_diff = end_time_activity - daily_starttime
			# daily_activty_end = daily_diff % 15
			# if daily_activty_end != 0:
			# 	daily_diff = daily_diff + (15 - daily_activty_end)
			# else:
			# 	pass
			# if garmin_data_daily.get('timeOffsetHeartRateSamples',None):
			# 	daily_diff1 = str(int(daily_diff))
			# 	data_end_activity = garmin_data_daily['timeOffsetHeartRateSamples'].get(daily_diff1,None)
			# if data_end_activity:
			# 	end_heartrate_activity = data_end_activity

	else:
		Did_you_measure_HRR = 'no'

	if (not hrr) and workout and workout_final_heartrate:
		end_time_activity = workout_timestamp[-1]-(offset)
		end_heartrate_activity  = workout_final_heartrate[-1]
		daily_diff = end_time_activity - daily_starttime
		daily_activty_end = daily_diff % 15
		if daily_activty_end != 0:
			daily_diff = daily_diff + (15 - daily_activty_end)
		else:
			pass
		if garmin_data_daily:
			if garmin_data_daily.get('timeOffsetHeartRateSamples',None):
				daily_diff1 = str(int(daily_diff))
				data_end_activity = garmin_data_daily['timeOffsetHeartRateSamples'].get(daily_diff1,None)
		if data_end_activity:
			end_heartrate_activity = data_end_activity
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
							Did_you_measure_HRR = "Heart Rate Data Not Provided"
							break

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

	if (hrr and (Did_you_measure_HRR == 'yes' or
		Did_you_measure_HRR == 'no') and garmin_data_daily):
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
	elif Did_you_measure_HRR == 'Heart Rate Data Not Provided':
		data = {"Did_you_measure_HRR":'Heart Rate Data Not Provided',
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
	# print(data)
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

class UserheartzoneView(APIView):

	permission_classes = (IsAuthenticated,)
	serializer_class = HeartzoneSerializer
	def calculate_weekly_zone_data(self,zone_weekly_qs):
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
		
		for hr in hr_values:
			for key,time,prcnt in zip(hr_keys,lists[0],lists[1]):
				low_end = hr[key].get('heart_rate_zone_low_end',0)
				high_end = hr[key].get('heart_rate_zone_high_end',0)
				classification = hr[key].get('classificaton')
				time = sum(time)
				try:
					percent_duration = sum(prcnt)/len(prcnt)
					percent_duration = int(Decimal(percent_duration).quantize(0,ROUND_HALF_UP))
				except ZeroDivisionError:
					percent_duration = ""

				heartzone_data = {"heart_rate_zone_low_end":low_end,
								  "heart_rate_zone_high_end":high_end,
								  "classificaton":classification,
								  "time_in_zone":time,
								  "prcnt_total_duration_in_zone":percent_duration
								  }
				heartzone_dic[low_end] = heartzone_data
		return heartzone_dic


	def get(self,request,format="json"):
		weekly_zone_data = self.calculate_weekly_zone_data(self.get_queryset())
		return Response(weekly_zone_data, status=status.HTTP_200_OK)

	def get_queryset(self):
		user = self.request.user

		end_dt = self.request.query_params.get('to',None)
		start_dt = self.request.query_params.get('from', None)

		if start_dt and end_dt:
			queryset = TimeHeartZones.objects.filter(Q(created_at__gte=start_dt)&
							  Q(created_at__lte=end_dt),
							  user=user)
		else:
			queryset = TimeHeartZones.objects.all()
		
		return queryset

class UserAaView(APIView):

	permission_classes = (IsAuthenticated,)
	serializer_class = AaSerializer

	def calculate_weekly_aa_data(self,aa_weekly_qs):
		data_values = [aa_data.data for aa_data in aa_weekly_qs]
		keys = ['avg_heart_rate','max_heart_rate','total_duration','duration_in_aerobic_range',
				'percent_aerobic','duration_in_anaerobic_range','percent_anaerobic','duration_below_aerobic_range',
				'percent_below_aerobic','duration_hrr_not_recorded','percent_hrr_not_recorded']
		lists = [[],[],[],[],[],[],[],[],[],[],[]]
		for aa in data_values:
			try:
				aa_dic = ast.literal_eval(aa)
				if aa_dic:
					aa_totals = aa_dic['Totals']
				else:
					aa_totals = ''
			except (ValueError,SyntaxError):
				aa_totals = aa_dic.Totals
			for key,li in zip(keys,lists):
				if li:
					aa_values = aa_totals[key]
					li.append(aa_values)
		try:
			avg_heart_rate = sum(lists[0])/len(lists[0])
			avg_heart_rate = int(Decimal(avg_heart_rate).quantize(0,ROUND_HALF_UP))
			
			percent_aerobic = sum(lists[4])/len(lists[4])
			percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))

			percent_anaerobic = sum(lists[6])/len(lists[6])
			percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))

			percent_below_aerobic = sum(lists[8])/len(lists[8])
			percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))

			percent_hrr_not_recorded = sum(lists[10])/len(lists[10])
			percent_hrr_not_recorded = int(Decimal(percent_hrr_not_recorded).quantize(0,ROUND_HALF_UP))

		except ZeroDivisionError:
			avg_heart_rate = ""
			percent_aerobic = ""
			percent_anaerobic = ""
			percent_below_aerobic = ""
			percent_hrr_not_recorded = ""
		try:
			max_heart_rate = max(lists[1])
		except ValueError:
			max_heart_rate = ""
		
		total_duration = sum(lists[2])
		duration_in_aerobic_range = sum(lists[3])
		duration_in_anaerobic_range = sum(lists[5])
		duration_below_aerobic_range = sum(lists[7])
		duration_hrr_not_recorded = sum(lists[9])

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
		# print("jofdjodnbinfgibnfinbfngbifnbionronbr",type([total_data]))
		
		return total_data

	def get(self,request,format="json"):
		weekly_aa_data = self.calculate_weekly_aa_data(self.get_queryset())
		return Response(weekly_aa_data, status=status.HTTP_200_OK)

	def get_queryset(self):
		user = self.request.user

		end_dt = self.request.query_params.get('to',None)
		start_dt = self.request.query_params.get('from', None)

		if start_dt and end_dt:
			queryset = AaCalculations.objects.filter(Q(created_at__gte=start_dt)&
							  Q(created_at__lte=end_dt),
							  user_aa=user)
		else:
			queryset = AaCalculations.objects.all()

		return queryset