from datetime import datetime,timezone,time
import string
import random

def get_epoch_offset_from_timestamp(timestamp):
	'''
	Parse ISO 8601 timestamp string and return offset and 
	POSIX timestamp (time in seconds in UTC). For example - if timestamp
	is "2018-08-19T15:46:35.000-05:00", then returned value would be a 
	tuple like this -  (POSIX timestamp, UTC offset in seconds)
	So, for timestamp in example, it would be  - (1534711595, -18000)

	Args:
		timestamp(str): Timestamp in string
	'''
	if timestamp:
		if timestamp[-3:-2] == ':':
			# Before Python 3.7, if tz offset have colon in it
			# then strptime cannot parse it and throw error
			# More - https://bugs.python.org/msg169952
			# So a simple workaround is to remove the colon
			timestamp = timestamp[:-3]+timestamp[-2:]

		try:
			dobj = datetime.strptime(timestamp,"%Y-%m-%dT%H:%M:%S.%f%z")
		except ValueError as e:
			dobj = datetime.strptime(timestamp,"%Y-%m-%dT%H:%M:%S.%fZ")

		offset = 0
		if dobj.utcoffset():
			offset = int(dobj.utcoffset().total_seconds())

		time_in_utc_seconds = int(dobj.timestamp())
		return (time_in_utc_seconds,offset)

def levelData(sleepLevelsMap,sleep_type):
	sleep_level_stats = {
		"level_map":{
			'deep': [],
			'light': [],
			'awake': [],
			'rem': [],
			'restless': []
		},
		"deep_sleep_duration_in_sec":0,
		"light_sleep_duration_in_sec":0,
		"rem_sleep_duration_in_sec":0,
		"awake_duration_in_sec":0,
		"restless_duration_in_sec":0,                     
	}

	if sleep_type == "stages":
		valid_level = list(sleep_level_stats["level_map"].keys())
		for levelData in sleepLevelsMap['data']:
			if (levelData['level'] != "wake" 
				and levelData['level'] in valid_level):
				sleep_level_stats['level_map'][levelData['level']].append(
					{'startTimeInSeconds': levelData['dateTime'],
					 'endTimeInSeconds':levelData['seconds']})
			else:
				sleep_level_stats['level_map']['awake'].append(
					{'startTimeInSeconds': levelData['dateTime'],
					 'endTimeInSeconds':levelData['seconds']})
		sleep_level_stats['deep_sleep_duration_in_sec'] = int(
			sleepLevelsMap['summary']['deep']['minutes']*60)
		sleep_level_stats['light_sleep_duration_in_sec'] = int(
			sleepLevelsMap['summary']['light']['minutes']*60)
		sleep_level_stats['awake_duration_in_sec'] = int(
			sleepLevelsMap['summary']['wake']['minutes']*60)
		sleep_level_stats['rem_sleep_duration_in_sec'] = int(
			sleepLevelsMap['summary']['rem']['minutes']*60)

	elif sleep_type == 'classic':
		for levelData in sleepLevelsMap['data']:
			if levelData['level'] == "asleep":
				sleep_level_stats['level_map']["deep"].append(
					{'startTimeInSeconds': levelData['dateTime'],
					 'endTimeInSeconds':levelData['seconds']})
			elif levelData['level'] == "awake":
				sleep_level_stats['level_map']["awake"].append(
					{'startTimeInSeconds': levelData['dateTime'],
					 'endTimeInSeconds':levelData['seconds']})
			elif levelData['level'] == "restless":
				sleep_level_stats['level_map']["restless"].append(
					{'startTimeInSeconds': levelData['dateTime'],
					 'endTimeInSeconds':levelData['seconds']})
		
		sleep_level_stats['deep_sleep_duration_in_sec'] = int(
			sleepLevelsMap['summary']['asleep']['minutes']*60)
		sleep_level_stats['awake_duration_in_sec'] = int(
			sleepLevelsMap['summary']['awake']['minutes']*60)
		sleep_level_stats['restless_duration_in_sec'] = int(
			sleepLevelsMap['summary']['restless']['minutes']*60)

	return sleep_level_stats

def generate_random_id(length=19):
	 rid = ''.join([random.choice(string.ascii_letters+string.digits)
	 			    for _ in range(length)])
	 return rid

def fitbit_to_garmin_sleep(sleep_summary):
	garmin_sleep = {
		'summaryId': '',
		'calendarDate': '',
		'durationInSeconds':None,
		'startTimeInSeconds': None,
		'startTimeOffsetInSeconds': None,
		'unmeasurableSleepInSeconds': None,
		'deepSleepDurationInSeconds': None,
		'lightSleepDurationInSeconds': None,
		'restlessDurationInSeconds':None,
		'remSleepInSeconds': None,
		'awakeDurationInSeconds': None,
		'sleepLevelsMap':{
		},
		'validation': ''
	}
	sleep_type = sleep_summary.get("type","unknown")
	sleep_level_stats = levelData(sleep_summary['levels'],sleep_type)

	garmin_sleep['summaryId'] = sleep_summary['logId']
	garmin_sleep['calendarDate'] = sleep_summary['dateOfSleep']
	garmin_sleep['durationInSeconds'] = int(sleep_summary['duration']/1000)
	garmin_sleep['sleepLevelsMap'] = sleep_level_stats['level_map']
	garmin_sleep['startTimeInSeconds'] = sleep_summary['startTime']
	garmin_sleep['deepSleepDurationInSeconds'] = sleep_level_stats["deep_sleep_duration_in_sec"]
	garmin_sleep['lightSleepDurationInSeconds'] =sleep_level_stats["light_sleep_duration_in_sec"] 
	garmin_sleep['remSleepInSeconds'] = sleep_level_stats["rem_sleep_duration_in_sec"]
	garmin_sleep['awakeDurationInSeconds'] = sleep_level_stats["awake_duration_in_sec"]
	garmin_sleep['restlessDurationInSeconds'] = sleep_level_stats["restless_duration_in_sec"]
	return garmin_sleep

def fitbit_to_garmin_activities(active_summary):
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
	if active_summary:
		start_time_in_sec,start_time_offset_in_sec = get_epoch_offset_from_timestamp(
			active_summary['startTime'])

		garmin_activites['summaryId'] = str(active_summary['logId'])
		garmin_activites['durationInSeconds'] = int(active_summary['duration']/1000)
		garmin_activites['startTimeInSeconds'] = start_time_in_sec
		garmin_activites['startTimeOffsetInSeconds'] = start_time_offset_in_sec
		garmin_activites['activityType'] = active_summary['activityName']
		garmin_activites['activeKilocalories'] = active_summary['calories']
		garmin_activites['averageHeartRateInBeatsPerMinute'] = active_summary.get('averageHeartRate')
		heartRate = []
		for hr_zone in active_summary.get('heartRateZones',[]):
			heartRate.append(hr_zone['max'])
		try:
			garmin_activites["maxHeartRateInBeatsPerMinute"] = sum(heartRate)/len(heartRate)
		except:
			garmin_activites["maxHeartRateInBeatsPerMinute"] = 0
		garmin_activites['steps'] = active_summary.get('steps',0)
		return garmin_activites
	else:
		return None

def fitbit_to_garmin_epoch(epoch_summary,summary_date,summary_duration=900):
	'''
	Convert intraday step data to the garmin epoch
	
	Args:
		epoch_summary(dict): single fitbit intraday step data
		summary_date(datetime.date): Date to which the summary belongs
		summary_duration(int): Summary interval duration in seconds.
			Default to 900 seconds
	Return:
		dict: step summary in garmin epoch style
	'''
	garmin_epoch = {
		'activityType': 'WALKING',
		'durationInSeconds': summary_duration,
		'startTimeInSeconds': 0,
		'maxMotionIntensity': 0,
		'intensity': 'ACTIVE',
		'activeTimeInSeconds': 0,
		'steps': 0,
		'summaryId':generate_random_id(), 
		'meanMotionIntensity': 0,
		'met': 0,
		'distanceInMeters': 0,
		'activeKilocalories': 0,
		'startTimeOffsetInSeconds': 0
	}
	h,m,s = list(map(int,epoch_summary['time'].split(':')))
	# Since fitbit do not provide the offset value like Garmin,
	# the step summary start time is converted into the utc datetime
	# So for example, if start time is "13:05:00", it'll be converted
	# to utc 13:05:00 datetime object and then converted in epoch
	start_time_in_seconds = int(datetime.combine(
		summary_date,time(h,m,s,tzinfo=timezone.utc)).timestamp())
	garmin_epoch["startTimeInSeconds"] = start_time_in_seconds
	garmin_epoch['steps'] = epoch_summary.get('value',0)
	return garmin_epoch