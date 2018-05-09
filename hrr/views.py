import json
import ast
import time
from datetime import datetime,timedelta,date
from decimal import Decimal, ROUND_HALF_UP

from django.http import JsonResponse
from django.shortcuts import render

from registration.models import Profile
from user_input.models import DailyUserInputStrong
from garmin.models import GarminFitFiles,UserGarminDataDaily
from fitparse import FitFile

# Create your views here.
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
		if (k < 60) and (k >= 0):
			final_heartrate.extend([i])
			final_timestamp.extend([k]) 

	return (final_heartrate,final_timestamp,to_timestamp)

# code for HRR Automation

def hrr_calculations(request):
	start_date = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
	
	start_date_timestamp = start_date
	start_date_timestamp = start_date_timestamp.timetuple()
	start_date_timestamp = time.mktime(start_date_timestamp)

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

	count = 0
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
						count = count + 1
						activities.append(di[i])
	
	if activities:
		offset =  activities[0]['startTimeOffsetInSeconds']

	start_date_timestamp = start_date_timestamp
	garmin_data_daily = UserGarminDataDaily.objects.filter(user=request.user,start_time_in_seconds=start_date_timestamp).last()
	garmin_data_daily = ast.literal_eval(garmin_data_daily.data)
	daily_starttime = garmin_data_daily['startTimeInSeconds']

	workout = []
	hrr = []
	start = start_date
	end = start_date + timedelta(days=3)
	a1=GarminFitFiles.objects.filter(user=request.user,created_at__range=[start,end])

	if activities:
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
		Did_you_measure_HRR = 'Yes'
		hrr_data = fitfile_parse(hrr,offset,start)
		hrr_final_heartrate,hrr_final_timestamp,hrr_timestamp = hrr_data

		workout_hrr_before_hrrfile = []
		workout_time_before_hrrfile = []
		workout_timestamp_before_hrrfile = []
		for i,k,j in zip(workout_final_heartrate,workout_final_timestamp,workout_timestamp):
			if hrr_timestamp[1] > j:
				workout_hrr_before_hrrfile.append(i)
				workout_time_before_hrrfile.append(k)
				workout_timestamp_before_hrrfile.append(j)

		time_toreach_99 = []
		for i,k in zip(hrr_final_heartrate,hrr_final_timestamp):
			if i >= 99:
				time_toreach_99.append(k)
				if(i == 99):
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
		
		if b and min(min_heartrate) < b[0]:
			b = [min(min_heartrate)]

		if min(hrr_final_heartrate) <= 99:
			Did_heartrate_reach_99 = 'Yes'
		else:
			Did_heartrate_reach_99 = 'No'


		HRR_activity_start_time = hrr_timestamp[0]-(offset)
		HRR_start_beat = hrr_final_heartrate[0]
		try:
			lowest_hrr_1min = b[0]
		except IndexError:
			lowest_hrr_1min = 99
		time_99 = sum(time_toreach_99[:-1])
		end_time_activity = workout_timestamp_before_hrrfile[-1]-(offset)
		end_heartrate_activity  = workout_hrr_before_hrrfile[-1]
		diff_actity_hrr= HRR_activity_start_time - end_time_activity

		No_beats_recovered = HRR_start_beat - lowest_hrr_1min
		heart_rate_down_up = abs(end_heartrate_activity-HRR_start_beat)
		pure_1min_beats = []
		pure1min = 60-diff_actity_hrr
		for i,k in zip(hrr_final_heartrate,new_L):
			if k <= pure1min:
				pure_1min_beats.append(i)
		pure_1min_heart_beats = end_heartrate_activity - pure_1min_beats[-1]
		pure_time_99 = time_99 + diff_actity_hrr

	else:
		Did_you_measure_HRR = 'No'
	if count == 1:
		end_time_activity = workout_timestamp[-1]-(offset)
		end_heartrate_activity  = workout_final_heartrate[-1]
		daily_diff = end_time_activity - daily_starttime
		daily_activty_end = daily_diff % 15
		if daily_activty_end != 0:
			daily_diff = daily_diff + (15 - daily_activty_end)
		else:
			pass
		daily_diff_60 = str(int(daily_diff + 60))
		hrr_no_fitfile = garmin_data_daily['timeOffsetHeartRateSamples'][daily_diff_60]

		daily_diff_15 = str(int(daily_diff + 15))
		hrr_no_fitfile_15 = garmin_data_daily['timeOffsetHeartRateSamples'][daily_diff_15]

		daily_diff_30 = str(int(daily_diff + 30))
		hrr_no_fitfile_30 = garmin_data_daily['timeOffsetHeartRateSamples'][daily_diff_30]

		daily_diff_45 = str(int(daily_diff + 45))
		hrr_no_fitfile_45 = garmin_data_daily['timeOffsetHeartRateSamples'][daily_diff_45]

		daily_diff_75 = str(int(daily_diff + 75))
		hrr_no_fitfile_75 = garmin_data_daily['timeOffsetHeartRateSamples'][daily_diff_75]

		daily_diff_90 = str(int(daily_diff + 90))
		hrr_no_fitfile_90 = garmin_data_daily['timeOffsetHeartRateSamples'][daily_diff_90]

		if hrr_no_fitfile_15 <= 99:
			no_fitfile_hrr_time_reach_99 = 15
		elif hrr_no_fitfile_30 <= 99:
			no_fitfile_hrr_time_reach_99 = 30
		elif hrr_no_fitfile_45 <= 99:
			no_fitfile_hrr_time_reach_99 = 45
		elif hrr_no_fitfile <= 99:
			no_fitfile_hrr_time_reach_99 = 60
		elif hrr_no_fitfile_75 <= 99:
			no_fitfile_hrr_time_reach_99 = 75
		elif hrr_no_fitfile_90 <= 99:
			no_fitfile_hrr_time_reach_99 = 90
		else:
			no_fitfile_hrr_time_reach_99 = 105



		if hrr_no_fitfile <= 99:
			no_fitfile_hrr_reach_99 = 'Yes'
		else:
			no_fitfile_hrr_reach_99 = 'No'

		no_file_beats_recovered = end_heartrate_activity - hrr_no_fitfile

	if hrr:
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

				"offset":offset,
				}
	elif count == 1:
		data = {"Did_you_measure_HRR":Did_you_measure_HRR,
			"no_fitfile_hrr_reach_99":no_fitfile_hrr_reach_99,
			"no_fitfile_hrr_time_reach_99":no_fitfile_hrr_time_reach_99,
			"end_heartrate_activity":end_heartrate_activity,#same for without fitfile also with HRR File Starting Heart Rate
			"lowest_hrr_no_fitfile":hrr_no_fitfile,
			"no_file_beats_recovered":no_file_beats_recovered,

			"offset":offset,
			}
	else:
		data = {"Did_you_measure_HRR":"",
			"Did_heartrate_reach_99":"",
			"time_99":'',
			"HRR_start_beat":'',
			"lowest_hrr_1min":'',
			"No_beats_recovered":'',

			"end_time_activity":'',
			"diff_actity_hrr":'',
			"HRR_activity_start_time":'',
			"end_heartrate_activity":'',
			"heart_rate_down_up":'',
			"pure_1min_heart_beats":'',
			"pure_time_99":'',

			"no_fitfile_hrr_reach_99":'',
			"lowest_hrr_no_fitfile":'',
			"no_file_beats_recovered":'',

			"offset":'',
			}



	return JsonResponse(data)


# code for Aerobic and anarobic ranges 

def aa_calculations(request):
	start_date = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date, "%Y-%m-%d").date()

	start = start_date
	end = start_date + timedelta(days=7)
	start_date_str = start_date.strftime('%Y-%m-%d')

	data = {"total_time":"",
				"aerobic_zone":"",
				"anaerobic_range":"",
				"below_aerobic_zone":"",
				"aerobic_range":"",
				"anaerobic_range":"",
				"below_aerobic_range":"",
				"percent_aerobic":"",
				"percent_below_aerobic":"",
				"percent_anaerobic":"",
				"total_percent":""}

	user_input_strong = DailyUserInputStrong.objects.filter(
		user_input__created_at=(start_date),
		user_input__user = request.user).order_by('-user_input__created_at')

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
			if data_id == id_act:
				hrr.append(tmp) # getting only hrr files
			else:
				workout.append(tmp)

	if activities:
		offset =  activities[0]['startTimeOffsetInSeconds']

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
		try:
			percent_anaerobic = (time_in_anaerobic/total_time)*100
			percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))

			percent_below_aerobic = (time_in_below_aerobic/total_time)*100
			percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))

			percent_aerobic = (time_in_aerobic/total_time)*100
			percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))

			total_percent = 100
		except ZeroDivisionError:
			percent_anaerobic=''
			percent_below_aerobic=''
			percent_aerobic=''
			total_percent=''
			
		data = {"total_time":total_time,
				"aerobic_zone":time_in_aerobic,
				"anaerobic_zone":time_in_anaerobic,
				"below_aerobic_zone":time_in_below_aerobic,
				"aerobic_range":aerobic_range,
				"anaerobic_range":anaerobic_range,
				"below_aerobic_range":below_aerobic_range,
				"percent_aerobic":percent_aerobic,
				"percent_below_aerobic":percent_below_aerobic,
				"percent_anaerobic":percent_anaerobic,
				"total_percent":total_percent}

	return JsonResponse(data)

