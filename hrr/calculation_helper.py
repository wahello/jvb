from datetime import datetime,timedelta,date
import time

from fitparse import FitFile


# Parse the fit files and return the heart beat and timstamp
def fitfile_parse(obj,offset,start_date_str):
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
		if timeheart_utc >= start_date_obj and timeheart_utc <= end_date_obj:
			heartrate_selected_date.extend([heart])
			timestamp_selected_date.extend([timeheart])

		
	to_timestamp = []
	for index,value in enumerate(timestamp_selected_date):
		value_timetuple = value.timetuple()
		value_mktime = time.mktime(value_timetuple)
		value_mktime = value_mktime+offset
		to_timestamp.extend([value_mktime])
	
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

def week_date(start_date):
	'''
	Takes data object and convert to the last week from Monday to Sunday

	Args: start_date(datatime.date object)

	Returns:Week start date and End date
	'''
	week_start_date = start_date - timedelta(
		days = start_date.weekday()+7)
	week_end_date = start_date - timedelta(
		days = start_date.weekday()+1)
	return(week_start_date,week_end_date)

