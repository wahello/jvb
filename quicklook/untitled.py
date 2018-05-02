for x in a1:
	fitfile = FitFile(x.fit_file)
	for record in fitfile.get_messages('record'):
	    for record_data in record:
	        if record_data.units:
	            print (" * %s: %s %s" % (record_data.name, record_data.value, record_data.units,))
	        else:
	            print (" * %s: %s" % (record_data.name, record_data.value))
	    print()

int(current_date.replace(tzinfo=timezone.utc).timestamp())

from django.contrib.auth.models import User
user = User.objects.get(username='jvbhealth')
from fitparse import FitFile
from garmin.models import GarminFitFiles
from datetime import datetime
import time
start = '2018-04-29'
end = '2018-04-30'
a1=GarminFitFiles.objects.filter(user=user,created_at__range=[start,end])



heartrate_complete = []
timestamp_complete = []
for x in a1:
	fitfile = FitFile(x.fit_file)
	for record in fitfile.get_messages('record'):
		for record_data in record:
			if(record_data.name=='heart_rate'):
				b = record_data.value
				heartrate_complete.extend([b])

			if(record_data.name=='timestamp'):
				c = record_data.value
				timestamp_complete.extend([c])

heartrate_selected_date = []
timestamp_selected_date = []
start_date_obj = datetime(2018,4,28,0,0,0)
end_date_obj = datetime(2018,4,29,0,0,0)
for heart,timeheart in zip(heartrate_complete,timestamp_complete):
	timeheart_str = timeheart.strftime("%Y-%m-%d %H:%M:%S")
	timeheart_utc = int(time.mktime(datetime.strptime(timeheart_str, "%Y-%m-%d %H:%M:%S").timetuple()))+10800
	timeheart_utc = datetime.utcfromtimestamp(timeheart_utc)
	if timeheart_utc >= start_date_obj and timeheart_utc <= end_date_obj:
		heartrate_selected_date.extend([heart])
		timestamp_selected_date.extend([timeheart])


to_timestamp = []
for i,k in enumerate(timestamp_complete):
	dtt = k.timetuple()
	ts = time.mktime(dtt)
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

for i,k in zip(heartrate_complete,timestamp_difference):
	if (k < 60) and (k >= 0):
		final_heartrate.extend([i])
		final_timestamp.extend([k])


below_aerobic_value = 180-40-30
anaerobic_value = 180-40+5

aerobic_range = '{}-{}'.format(below_aerobic_value,anaerobic_value)
anaerobic_range = '{} or above'.format(anaerobic_value+1)
below_aerobic_range = 'below {}'.format(below_aerobic_value	)

anaerobic_range_list = []
below_aerobic_list = []
aerobic_list = []

low_end_values = [-60,-55,-50,-45,-40,-35,-30,-25,-20,-15,-10,+1,6,10,14,19,24,
					29,34,39,44,49,54,59]
high_end_values = [-56,-51,-46,-41,-36,-31,-26,-21,-16,-11,0,5,10,13,18,23,28,
					33,38,43,48,53,58,63]

low_end_heart = [180-40+tmp for tmp in low_end_values]
high_end_heart = [180-40+tmp for tmp in high_end_values]

low_end_dict = dict.fromkeys(low_end_heart, 0)

for a,b in zip(low_end_heart,high_end_heart):
	for c,d in zip(final_heartrate,final_timestamp):
		if c>=a and c<=b:
			low_end_dict[a] = low_end_dict[a] + d



for a, b in zip(final_heartrate,final_timestamp):
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

# hrr finding file

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
		timeheart_utc = int(time.mktime(datetime.strptime(timeheart_str, "%Y-%m-%d %H:%M:%S").timetuple()))-14400
		timeheart_utc = datetime.utcfromtimestamp(timeheart_utc)
		if timeheart_utc >= start_date_obj and timeheart_utc <= end_date_obj:
			heartrate_selected_date.extend([heart])
			timestamp_selected_date.extend([timeheart])

		
	to_timestamp = []
	for i,k in enumerate(timestamp_selected_date):
		dtt = k.timetuple()
		ts = time.mktime(dtt)
		ts = ts-14400
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
					id_act = di[i]['summaryId']
					activities.append(di[i])

if activities:
	offset =  activities[0]['startTimeOffsetInSeconds']

workout = []
hrr = []

a1=GarminFitFiles.objects.filter(user=user,created_at__range=[start,end])

for tmp in a1:
	meta = tmp.meta_data_fitfile
	meta = ast.literal_eval(meta)
	data_id = int(meta['activityIds'][0])
	print(data_id)
	if id_act == data_id:
		hrr.append(tmp)
	else:
		workout.append(tmp)

if workout:
	workout_data = fitfile_parse(workout,offset,start_date_str)
	workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_data