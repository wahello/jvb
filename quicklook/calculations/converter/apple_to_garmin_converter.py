import ast
from datetime import datetime, timezone, time
from decimal import Decimal, ROUND_HALF_UP
import datetime, pytz, time, json

import quicklook.calculations.garmin_calculation
from quicklook.calculations.converter.fitbit_to_garmin_converter import timestring_to_datetime


def apple_steps_minutly_to_quartly(summary_date,steps):
	quaterly_data_list = []
	if steps:
		quarterly_data = {}
		for step in steps:
			start_time = step['Start date'][11:]
			start_time_in_seconds = timestring_to_datetime(summary_date,start_time)
			hour = start_time_in_seconds.hour
			quarter = quicklook.calculations.garmin_calculation.\
				which_quarter(start_time_in_seconds)
			if not quarterly_data.get(hour,None):
				quarter1 = "{}:00:00".format(hour)
				quarter2 = "{}:15:00".format(hour)
				quarter3 = "{}:30:00".format(hour)
				quarter4 = "{}:45:00".format(hour)
				quarterly_data[hour] = {
					0:{"time":quarter1, "value":0, "activeSeconds":0},
					1:{"time":quarter2, "value":0, "activeSeconds":0},
					2:{"time":quarter3, "value":0, "activeSeconds":0},
					3:{"time":quarter4, "value":0, "activeSeconds":0}
				}
			active_seconds = 0
			if(step.get('steps',0)):
				active_seconds = 60
			steps_per_minute = round(step.get('steps',0.0))
			quarterly_data[hour][quarter]["value"] += steps_per_minute
			quarterly_data[hour][quarter]["activeSeconds"] += active_seconds

		quaterly_data_list = [quaterly for hour in quarterly_data.values()
								   	   for quaterly in hour.values()]
	return quaterly_data_list

def get_epoch_offset_from_timestamp(timestamp, timezone):
	'''
	Parse ISO 8601 timestamp string and return offset and 
	POSIX timestamp (time in seconds in UTC). For example - if timestamp
	is "2018-08-19T15:46:35.000-05:00", then returned value would be a 
	tuple like this -  (POSIX timestamp, UTC offset in seconds)
	So, for timestamp in example, it would be  - (1534711595, -18000)

	Args:
		timestamp(str): Timestamp in string
	'''
	if timezone == 'nil' or timezone == '(null)':
		timezone = 0

	if timestamp and timezone:
		try:
			continent,country = timezone.split("-")
		except:
			continent,country = timezone.split("/")
			if continent[-1] == "\\": 
				continent = continent[:-1]
		timezone = continent+'/'+country
		local = pytz.timezone(timezone)
		naive = datetime.datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
		local_dt = local.localize(naive, is_dst=None)
		utc_dt = local_dt.astimezone(pytz.utc).timetuple()
		time_in_utc_seconds = int(time.mktime(utc_dt))
		

		zone = pytz.timezone(timezone)
		offset = zone.utcoffset(datetime.datetime.now()).total_seconds()
		return (time_in_utc_seconds,offset)
	else:
		naive = datetime.datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
		utc_dt = naive.timetuple()
		time_in_utc_seconds = int(time.mktime(utc_dt))
		return (time_in_utc_seconds,0) 

def apple_to_garmin_activities(active_summary):
	
	if active_summary:
		result_reponse = []
		for each in active_summary:
			garmin_activites = {
				'summaryId': '',
				'durationInSeconds': None,
				'startTimeInSeconds': None, 
				'startTimeOffsetInSeconds': None, 
				'activityType': '', 
				'averageHeartRateInBeatsPerMinute': None,
				'averageRunCadenceInStepsPerMinute': None,
				'averageSpeedInMetersPerSecond': 0, 
				'averagePaceInMinutesPerKilometer': 0,  
				'activeKilocalories': None,
				'deviceName': 'forerunner935',
				'distanceInMeters': 0,
				'maxHeartRateInBeatsPerMinute': None, 
				'maxPaceInMinutesPerKilometer': None,
				'maxRunCadenceInStepsPerMinute': None,
				'maxSpeedInMetersPerSecond': None,     
				'startingLatitudeInDegree': None, 
				'startingLongitudeInDegree': None,
				'steps': 0, 
				'totalElevationGainInMeters': None, 
				'totalElevationLossInMeters': None,
				'resting_hr_last_night'     : None

			}
			start_time_in_sec,start_time_offset_in_sec = get_epoch_offset_from_timestamp(each['Start date'],each['TimeZone'])

			garmin_activites['summaryId'] = str(each['ActivityID'])
			garmin_activites['distanceInMeters'] = int(float(each['Distance']))
			garmin_activites['durationInSeconds'] = int(each['Duration'])
			garmin_activites['startTimeInSeconds'] = start_time_in_sec
			garmin_activites['startTimeOffsetInSeconds'] = start_time_offset_in_sec
			garmin_activites['activityType'] = each['WorkoutType']
			garmin_activites['activeKilocalories'] = each['totalEnergyBurned']
			garmin_activites['averageHeartRateInBeatsPerMinute'] = round(float(each.get('AverageHearthRate')))
			
			garmin_activites['steps'] = round(float(each.get('steps',0)))
			result_reponse.append(garmin_activites)

		return result_reponse
	else:
		return None
