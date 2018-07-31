def update_helper_aa(instance,data_dict):
	for attr, value in data_dict.items():
		setattr(instance,attr,value)
	instance.save()

def update_aa_instance(instance, data):
	update_helper_aa(instance, data2)

def create_aa_instance(user, data, start_date):
	created_at = start_date
	TimeHeartZones.objects.create(user = user,created_at = created_at,**data2)

def aa_data(user,start_date):
	heart_rate_zone_low_end = ""
	heart_rate_zone_high_end = ""
	time_in_zone_for_last_7_days = ""
	prcnt_total_duration_in_zone = ""
	
	start_date_timestamp = start_date
	start_date_timestamp = start_date_timestamp.timetuple()
	start_date_timestamp = time.mktime(start_date_timestamp)
	end_date = start_date + timedelta(days=7)
	end_date_timestamp = end_date.timetuple()
	end_date_timestamp = time.mktime(end_date_timestamp)

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
	end = start_date + timedelta(days=7)
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

	profile = Profile.objects.filter(user=user)
	if profile:
		for tmp_profile in profile:
			user_dob = tmp_profile.date_of_birth
		user_age = (date.today() - user_dob) // timedelta(days=365.2425)
	data = {"low_end":"",
			"high_end":"",
			"classificaton":"",
			"time_in_zone":"",
			"prcnt_in_zone":"",
			"total_duration":""}

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
			data={"low_end":a,
			  "high_end":b,
			  "classificaton":classification_dic[a],
			  "time_in_zone":low_end_dict[a],
			  "prcnt_in_zone":prcnt_in_zone,
			 }
			data2[a]=data

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
def aa_heartzone_calculations(request):
	start_date_get = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date_get, "%Y-%m-%d").date()
	data = aa_data(request.user,start_date)
	
		try:
			user = TimeHeartZones.objects.get(user=request.user, created_at=start_date)
			update_aa_instance(user, data2)
		except TimeHeartZones.DoesNotExist:
			create_aa_instance(request.user, data2, start_date)
	return JsonResponse(data2)

def aa_weekly(user,start_date):
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

	profile = Profile.objects.filter(user=user)
	if profile:
		for tmp_profile in profile:
			user_dob = tmp_profile.date_of_birth
		user_age = (date.today() - user_dob) // timedelta(days=365.2425)
	below_aerobic_value = 180-user_age-30
	anaerobic_value = 180-user_age+5
	
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

	if workout:
		workout_data = fitfile_parse(workout,offset,start_date_str)
		workout_final_heartrate,workout_final_timestamp,workout_timestamp = workout_data

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
