import json
from datetime import datetime, timedelta

from django.db import transaction,DatabaseError

from quicklook.models import UserQuickLook
from leaderboard.models import LeaderBoard

def _get_lst(lst,i,default = None):
	""" get method for list similar to dictionary's get method """
	try:
		return lst[i];
	except IndexError:
		return default
	except TypeError:
		return default

def str_to_datetime(str_date):
	y,m,d = map(int,str_date.split('-'))
	return datetime(y,m,d,0,0,0)

def _str_to_hours_min_sec(str_duration,time_format='hour',time_pattern="hh:mm:ss"):
	'''
		Expect duration in this format - "hh:mm:ss"
		convert in into hours, min or sec
		
		Arguments
		- str_duration : type String, time in format 'hh:mm:ss'

		- time_format: type String, possible values are [hour, minute, seconds]
		  specified in what format time to be converted
		  
		- time_pattern: type String, possible values are subtring of "hh:mm:ss"
		  specify the position of hour, minute and second in the str_duration

	'''
	if str_duration:
		hms = str_duration.split(":")
		pattern_lst = time_pattern.split(":")
		pattern_indexed = {
			"hour":pattern_lst.index("hh") if "hh" in pattern_lst else None,
			"minute":pattern_lst.index("mm") if "mm" in pattern_lst else None,
			"second":pattern_lst.index("ss") if "ss" in pattern_lst else None
		}

		h = int(_get_lst(hms,pattern_indexed["hour"],0))\
			if _get_lst(hms,pattern_indexed["hour"],0) else 0
		m = int(_get_lst(hms,pattern_indexed["minute"],0))\
			if _get_lst(hms,pattern_indexed["minute"],0) else 0
		s = int(_get_lst(hms,pattern_indexed["second"],0))\
			if _get_lst(hms,pattern_indexed["second"],0) else 0

		t = 0
		if time_format == 'hour':
			t = h + (m/60) + (s/3600)
		elif time_format == 'minute':
			t = (h*60) + m + (s/60)
		else:
			t = (h * 3600) + (m * 60) + s
		return round(t,3)
	return 0

def _update_helper(instance,data_dict):
	'''
		Helper function to update the instance
		with provided key,value pair
	'''
	attr_original_val = {}
	for attr, value in data_dict.items():
		attr_original_val[attr] = getattr(instance,attr)
		setattr(instance,attr,value)

	try:
		with transaction.atomic():
			instance.save()
	except DatabaseError:
		setattr(instance,attr,attr_original_val[attr])

def _safe_get_mobj(obj,attr, default):
	'''
		Takes a model object and return the value
		of attribute from the object. If value is None
		then return the default provided

		type obj: model objct
		type attr: string
		type default: any type
	'''
	if obj and attr:
		val = obj.__dict__.get(attr,None)
		return val if val else default
	return None

def _get_model_related_fields_names(model):

	''' Returns the list of all the related fields in the model'''

	related_fields_names = [f.name for f in model._meta.get_fields()
		if (f.one_to_many or f.one_to_one)
		and f.auto_created and not f.concrete]
	return related_fields_names

def _get_queryset(model,user,from_dt, to_dt, cache=False):

	''' Returns the queryset and cache all the related fields '''
	if cache:
		related_fields = _get_model_related_fields_names(model)
		qs = model.objects.select_related(*related_fields).filter(
			user = user,created_at__range = (from_dt.date(),to_dt.date()))
		return qs
	else:
		return model.objects.filter(
			user = user,created_at__range = (from_dt.date(),to_dt.date()))

def _update_score_instance(instance, old_score, current_score):
	if instance and old_score and current_score and old_score != current_score:
		_update_helper(instance,{"score":current_score})

def _update_scores(ql_data,score_data):

	''' update the scores'''

	cur_score_oh_gpa = _safe_get_mobj(
				ql_data.__dict__.get('_grades_ql_cache'),'overall_health_gpa',None)
	old_score_oh_gpa = _safe_get_mobj(score_data.get('oh_gpa',None),'score',None)
	_update_score_instance(score_data.get('oh_gpa',None),old_score_oh_gpa, cur_score_oh_gpa)

	cur_score_mne_gpa = _safe_get_mobj(
		ql_data.__dict__.get('_grades_ql_cache'),'movement_non_exercise_steps_gpa',None)
	old_score_mne_gpa = _safe_get_mobj(score_data.get('mne_gpa',None),'score',None)
	_update_score_instance(score_data.get('mne_gpa',None),old_score_mne_gpa,cur_score_mne_gpa)

	mc = _safe_get_mobj(
		ql_data.__dict__.get('_steps_ql_cache'),'movement_consistency',None)
	if mc:
		mc = json.loads(mc)['inactive_hours']
	cur_score_mc = mc
	old_score_mc = _safe_get_mobj(score_data.get('mc', None),'score',None)
	_update_score_instance(score_data.get('mc', None),old_score_mc,cur_score_mc)

	cur_score_avg_sleep = _safe_get_mobj(
		ql_data.__dict__.get('_grades_ql_cache'),'avg_sleep_per_night_gpa',None)
	old_score_avg_sleep = _safe_get_mobj(score_data.get('avg_sleep',None),'score',None)
	_update_score_instance(score_data.get('avg_sleep',None),
		old_score_avg_sleep,cur_score_avg_sleep)

	cur_score_ec = _safe_get_mobj(
		ql_data.__dict__.get('_grades_ql_cache'),'exercise_consistency_score',None)
	old_score_ec = _safe_get_mobj(score_data.get('ec',None),'score',None)
	_update_score_instance(score_data.get('ec',None),old_score_ec, cur_score_ec)

	cur_score_prcnt_uf = _safe_get_mobj(
		ql_data.__dict__.get('_grades_ql_cache'),'prcnt_unprocessed_food_consumed_gpa',None)
	old_score_prcnt_uf = _safe_get_mobj(score_data.get('prcnt_uf',None),'score',None)
	_update_score_instance(score_data.get('prcnt_uf',None),
		old_score_prcnt_uf,cur_score_prcnt_uf)

	cur_score_alcohol_drink = _safe_get_mobj(
		ql_data.__dict__.get('_alcohol_ql_cache'),'alcohol_week',None)
	old_score_alcohol_drink = _safe_get_mobj(score_data.get('alcohol_drink'),'score',None)
	_update_score_instance(score_data.get('alcohol_drink'),
		old_score_alcohol_drink,cur_score_alcohol_drink)

	cur_score_total_steps = _safe_get_mobj(
		ql_data.__dict__.get('_steps_ql_cache'),'total_steps',None)
	old_score_total_steps = _safe_get_mobj(score_data.get('total_steps',None),'score',None)
	_update_score_instance(score_data.get('total_steps',None),
		old_score_total_steps,cur_score_total_steps)

	cur_score_floor_climbed = _safe_get_mobj(
		ql_data.__dict__.get('_steps_ql_cache'),'floor_climed',None)
	old_score_floor_climbed = _safe_get_mobj(score_data.get('floor_climbed', None),'score',None)
	_update_score_instance(score_data.get('floor_climbed', None),
		old_score_floor_climbed,cur_score_floor_climbed)

	cur_score_resting_hr = _safe_get_mobj(
		ql_data.__dict__.get('_exercise_reporting_ql_cache'),'resting_hr_last_night',None)
	old_score_resting_hr = _safe_get_mobj(score_data.get('resting_hr',None),'score',None)
	_update_score_instance(score_data.get('resting_hr',None),
		old_score_resting_hr,cur_score_resting_hr)

	cur_score_deep_sleep = _safe_get_mobj(
		ql_data.__dict__.get('_sleep_ql_cache'),'deep_sleep',None)
	if cur_score_deep_sleep:
		cur_score_deep_sleep = _str_to_hours_min_sec(cur_score_deep_sleep,"hour","hh:mm")
	old_score_deep_sleep = _safe_get_mobj(score_data.get('deep_sleep',None),'score',None)
	_update_score_instance(score_data.get('deep_sleep',None),
		old_score_deep_sleep,cur_score_deep_sleep)

	cur_score_awake_time = _safe_get_mobj(
		ql_data.__dict__.get('_sleep_ql_cache'),'awake_time',None)
	if cur_score_awake_time:
		cur_score_awake_time = _str_to_hours_min_sec(cur_score_awake_time,"hour","hh:mm")
	old_score_awake_time = _safe_get_mobj(score_data.get('awake_time',None),'score',None)
	_update_score_instance(score_data.get('awake_time',None),
		old_score_awake_time,cur_score_awake_time)

def _create_score_instance(user,current_date,category,score):
	return LeaderBoard(user = user, created_at = current_date,
		category = category, score = score)

def _create_scores(user,current_date,ql_data):

	''' Create the score instances'''

	score_instances = []

	cur_score_oh_gpa = _safe_get_mobj(
				ql_data.__dict__.get('_grades_ql_cache'),'overall_health_gpa',None)
	if cur_score_oh_gpa:
		score_instances.append(_create_score_instance(user,current_date,
			"oh_gpa",cur_score_oh_gpa))
	
	cur_score_mne_gpa = _safe_get_mobj(
		ql_data.__dict__.get('_grades_ql_cache'),'movement_non_exercise_steps_gpa',None)
	if cur_score_mne_gpa:
		score_instances.append(_create_score_instance(user,current_date,
			"mne_gpa",cur_score_mne_gpa))

	mc = _safe_get_mobj(
		ql_data.__dict__.get('_steps_ql_cache'),'movement_consistency',None)
	if mc:
		mc = json.loads(mc)['inactive_hours']
	cur_score_mc = mc
	if cur_score_mc:
		score_instances.append(_create_score_instance(user,current_date,"mc",cur_score_mc))

	cur_score_avg_sleep = _safe_get_mobj(
		ql_data.__dict__.get('_grades_ql_cache'),'avg_sleep_per_night_gpa',None)
	if cur_score_avg_sleep:
		score_instances.append(_create_score_instance(user,current_date,
			"avg_sleep",cur_score_avg_sleep))

	cur_score_ec = _safe_get_mobj(
		ql_data.__dict__.get('_grades_ql_cache'),'exercise_consistency_score',None)
	if cur_score_ec:
		score_instances.append(_create_score_instance(user,current_date,"ec",cur_score_ec))

	cur_score_prcnt_uf = _safe_get_mobj(
		ql_data.__dict__.get('_grades_ql_cache'),'prcnt_unprocessed_food_consumed_gpa',None)
	if cur_score_prcnt_uf:
		score_instances.append(_create_score_instance(user,current_date,
			"prcnt_uf",cur_score_prcnt_uf))
	
	cur_score_alcohol_drink = _safe_get_mobj(
		ql_data.__dict__.get('_alcohol_ql_cache'),'alcohol_week',None)
	if cur_score_alcohol_drink:
		score_instances.append(_create_score_instance(user,current_date,
			"alcohol_drink",cur_score_alcohol_drink))
	
	cur_score_total_steps = _safe_get_mobj(
		ql_data.__dict__.get('_steps_ql_cache'),'total_steps',None)
	if cur_score_total_steps:
		score_instances.append(_create_score_instance(user,current_date,
			"total_steps",cur_score_total_steps))

	cur_score_floor_climbed = _safe_get_mobj(
		ql_data.__dict__.get('_steps_ql_cache'),'floor_climed',None)
	if cur_score_floor_climbed:
		score_instances.append(_create_score_instance(user,current_date,
			"floor_climbed",cur_score_floor_climbed))

	cur_score_resting_hr = _safe_get_mobj(
		ql_data.__dict__.get('_exercise_reporting_ql_cache'),'resting_hr_last_night',None)
	if cur_score_resting_hr:
		score_instances.append(_create_score_instance(user,current_date,
			"resting_hr",cur_score_resting_hr))

	cur_score_deep_sleep = _safe_get_mobj(
		ql_data.__dict__.get('_sleep_ql_cache'),'deep_sleep',None)
	if cur_score_deep_sleep:
		cur_score_deep_sleep = _str_to_hours_min_sec(cur_score_deep_sleep,"hour","hh:mm")
		score_instances.append(_create_score_instance(user,current_date,
			"deep_sleep",cur_score_deep_sleep))

	cur_score_awake_time = _safe_get_mobj(
		ql_data.__dict__.get('_sleep_ql_cache'),'awake_time',None)
	if cur_score_awake_time:
		cur_score_awake_time = _str_to_hours_min_sec(cur_score_awake_time,"hour","hh:mm")
		score_instances.append(_create_score_instance(user,current_date,
			"awake_time",cur_score_awake_time))

	# create score instance in bulk
	LeaderBoard.objects.bulk_create(score_instances)

def create_update_score(user, from_date, to_date):
	'''
		create or update score for given date range

		Arguments
		- user: type Obj, a "User" instance representing currently logged in user 
		- from_date: type String, expect date string in format YYYY-MM-DD
		- to_date: type String, expect date string in format YYYY-MM-DD   

	'''
	# date range for which quicklook is calculated
	from_dt = str_to_datetime(from_date)
	to_dt = str_to_datetime(to_date)
	current_date = from_dt

	quicklook_datewise_data = {q.created_at.strftime('%Y-%m-%d'):q for q
		in _get_queryset(UserQuickLook,user,from_dt,to_dt,cache=True)}

	score_data = {q for q in _get_queryset(LeaderBoard, user, from_dt, to_dt)}
	score_datewise_data = {}
	for q in score_datewise_data:
		created_at = q.strftime("%Y-%m-%d")
		if score_datewise_data.get(created_at,None):
			score_datewise_data.get(created_at)[q.category] = q
		else:
			score_datewise_data[created_at]={}
			score_datewise_data[created_at][q.category] = q


	while current_date <= to_dt:
		ql_data = quicklook_datewise_data.get(current_date.strftime("%Y-%m-%d"),None)
		score_data = score_datewise_data.get(current_date.strftime("%Y-%m-%d"),None)

		if ql_data and score_data:
			# update score
			_update_scores(ql_data,score_data)
		elif ql_data:
			# create score
			_create_scores(user,current_date,ql_data)

		current_date += timedelta(days=1)