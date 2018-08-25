def levelData(sleepLevelsMap,sleep_type):
	sleep_level_stats = {
		"level_map":{
			'deep': [],
			'light': [],
			'awake': [],
			'rem': []
		},
		"deep_sleep_duration_in_sec":0,
		"light_sleep_duration_in_sec":0,
		"rem_sleep_duration_in_sec":0,
		"awake_duration_in_sec":0
	}

	if sleep_type == "stages":
		for levelData in sleepLevelsMap['data']:
			if levelData['level'] != "wake":
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
				sleep_level_stats['level_map']["light"].append(
					{'startTimeInSeconds': levelData['dateTime'],
					 'endTimeInSeconds':levelData['seconds']})

		sleep_level_stats['deep_sleep_duration_in_sec'] = int(
			sleepLevelsMap['summary']['asleep']['minutes']*60)
		sleep_level_stats['light_sleep_duration_in_sec'] = int(
			sleepLevelsMap['summary']['restless']['minutes']*60)
		sleep_level_stats['awake_duration_in_sec'] = int(
			sleepLevelsMap['summary']['awake']['minutes']*60)

	return sleep_level_stats

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
	return garmin_sleep