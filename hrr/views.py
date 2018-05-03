import json
import ast
import time
from datetime import datetime,timedelta

from django.http import JsonResponse
from django.shortcuts import render
from user_input.models import DailyUserInputStrong
from garmin.models import GarminFitFiles

# Create your views here.

def fitfile_parse(obj,offset,start_date_str):
	heartrate_complete = []
	timestamp_complete = []

	obj_start_year = int(start_date_str.split('-')[0])
	obj_start_month = int(start_date_str.split('-')[1])
	obj_start_date = int(start_date_str.split('-')[2])
	obj_end_date = obj_start_date + 1
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
	end_date_obj = datetime(obj_start_year,obj_start_month,obj_end_date,0,0,0)

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
		if (k < 60) and (k >= 0):
			final_heartrate.extend([i])
			final_timestamp.extend([k]) 

	return (final_heartrate,final_timestamp,to_timestamp)

def hrr_calculations(request):
	start_date = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date, "%Y-%m-%d").date()

	start_date_str = start_date.strftime('%Y-%m-%d')
	user_input_strong = DailyUserInputStrong.objects.filter(
		user_input__created_at=(start_date),
		user_input__user = request.user).order_by('-user_input__created_at')

	data = {"HRR_activity_start_time":'00:00:00',
				"HRR_start_beat":'',
				"lowest_hrr_1min":'',
				"time_99":'00:00',
				"end_time_activity":'00:00:00',
				"end_heartrate_activity":'',
				"diff_actity_hrr":'00:00:00',
				"offset":'',
				}

	activities = []
	if user_input_strong:
		for tmp in user_input_strong:
			sn = tmp.activities
			if sn:
				sn = ast.literal_eval(sn)
				di = sn.values()
				di = list(di)
				for i,k in enumerate(di):
					if di[i]['activityType'] == 'HEART_RATE_RECOVERY':
						id_act = int(di[i]['summaryId'])
						activities.append(di[i])
	
	if activities:
		offset =  activities[0]['startTimeOffsetInSeconds']
	
	workout = []
	hrr = []
	start = start_date
	end = start_date + timedelta(days=3)
	a1=GarminFitFiles.objects.filter(user=request.user,created_at__range=[start,end])

	for tmp in a1:
		meta = tmp.meta_data_fitfile
		meta = ast.literal_eval(meta)
		data_id = int(meta['activityIds'][0])
		if data_id == id_act:
			hrr.append(tmp) # getting only hrr files
		else:
			workout.append(tmp)
	
	if workout:
		workout_data = fitfile_parse(workout,offset,start_date_str)
		workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_data
	
	if hrr:
		hrr_data = fitfile_parse(hrr,offset,start_date_str)
		hrr_final_heartrate,hrr_final_timestamp,hrr_timestamp = hrr_data
	
		time_toreach_99 = []
		for i,k in zip(hrr_final_heartrate,hrr_final_timestamp):
			if i >= 99:
				time_toreach_99.append(k)

		new_L = [sum(hrr_final_timestamp[:i+1]) for i in range(len(hrr_final_timestamp))]
		min_heartrate = []
		for i,k in zip(hrr_final_heartrate,new_L):
			if k <= 60:
				min_heartrate.append(i)

		HRR_activity_start_time = hrr_timestamp[0]-(offset)
		HRR_start_beat = hrr_final_heartrate[0]
		lowest_hrr_1min = min(min_heartrate)
		time_99 = sum(time_toreach_99)
		end_time_activity = workout_timestamp[-1]-(offset)
		end_heartrate_activity  = workout_final_heartrate[-1]
		diff_actity_hrr= HRR_activity_start_time - end_time_activity


		data = {"HRR_activity_start_time":HRR_activity_start_time,
				"HRR_start_beat":HRR_start_beat,
				"lowest_hrr_1min":lowest_hrr_1min,
				"time_99":time_99,
				"end_time_activity":end_time_activity,
				"end_heartrate_activity":end_heartrate_activity,
				"diff_actity_hrr":diff_actity_hrr,
				"offset":offset,
				}


	return JsonResponse(data)
