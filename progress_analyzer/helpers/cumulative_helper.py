from datetime import datetime,timedelta
import json

from django.db import transaction,DatabaseError
from django.core.exceptions import ObjectDoesNotExist

from hrr.models import Hrr,AA
from quicklook.models import UserQuickLook
from user_input.models import UserDailyInput

from progress_analyzer.models import CumulativeSum,\
	OverallHealthGradeCumulative, \
	NonExerciseStepsCumulative, \
	SleepPerNightCumulative, \
	MovementConsistencyCumulative, \
	ExerciseConsistencyCumulative, \
	NutritionCumulative, \
	ExerciseStatsCumulative, \
	AlcoholCumulative,\
	SickCumulative,\
	StandingCumulative,\
	TravelCumulative,\
	StressCumulative,\
	OtherStatsCumulative,\
	MetaCumulative,\
	ProgressReportUpdateMeta

from quicklook.calculations.garmin_calculation import\
	cal_non_exercise_step_grade,\
	get_active_duration_grade,\
	cal_resting_hr_grade,\
	get_garmin_stress_grade

def _get_model_not_related_concrete_fields(model):
	fields_name = [f.name for f in model._meta.get_fields()
		if f.concrete
		and not f.auto_created
		and not f.is_relation
	]
	return fields_name

def _get_blank_pa_model_fields(model):
	if model == "overall_health_grade":
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(OverallHealthGradeCumulative)}
		return fields
	elif model == "non_exercise_steps":
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(NonExerciseStepsCumulative)}
		return fields
	elif model == "sleep_per_night":
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(SleepPerNightCumulative)}
		return fields
	elif model == "mc":
		fields = {field: None for field
			  in _get_model_not_related_concrete_fields(MovementConsistencyCumulative)}
		return fields
	elif model == "ec":
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(ExerciseConsistencyCumulative)}
		return fields
	elif model == "nutrition":
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(NutritionCumulative)}
		return fields
	elif model == "exercise_stats":
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(ExerciseStatsCumulative)}
		return fields
	elif model == "alcohol":
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(AlcoholCumulative)}
		return fields
	elif model == 'sick':
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(SickCumulative)}
		return fields
	elif model == 'standing':
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(StandingCumulative)}
		return fields
	elif model == 'travel':
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(TravelCumulative)}
		return fields
	elif model == 'stress':
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(StressCumulative)}
		return fields
	elif model == "other_stats":
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(OtherStatsCumulative)}
		return fields
	elif model == "meta":
		fields = {field: None for field
				  in _get_model_not_related_concrete_fields(MetaCumulative)}
		return fields

def _str_to_datetime(str_date):
	y,m,d = map(int,str_date.split('-'))
	return datetime(y,m,d,0,0,0)

def _get_lst(lst,i,default = None):
	""" get method for list similar to dictionary's get method """
	try:
		return lst[i];
	except IndexError:
		return default
	except TypeError:
		return default

def _str_to_hours_min_sec(str_duration,time_format='hour',time_pattern="hh:mm:ss"):
	'''
		Expect duration in this format - "hh:mm:ss"
		convert in into hours, min or sec
		
		Arguments
		- str_duration : type String, time in format 'hh:mm:ss'

		- time_format: type String, possible values are [hour, minute, seconds]
		  specified in what format time to be converted
		  
		- time_pattern: type String, possible values are substring of "hh:mm:ss"
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

		Warning: This will not trigger any signals
				 like post or pre save
	'''
	attr_original_val = {}
	for attr, value in data_dict.items():
		attr_original_val[attr] = getattr(instance,attr)
		setattr(instance,attr,value)

	try:
		with transaction.atomic():
			instance.save()
	except DatabaseError as e:
		# If any error, set instance to previous state
		for attr, value in attr_original_val.items():
			setattr(instance,attr,value)

def _safe_get_mobj(obj,attr, default):
	'''
		Takes a model object and return the value
		of attribute from the object. If value is None
		then return the default provided

		type obj: model object
		type attr: string
		type default: any type
	'''
	if obj and attr:
		val = obj.__dict__.get(attr,None)
		return val if val else default
	return None

def _get_grading_sheme():
	return {'A':4,'B':3,'C':2,'D':1,'F':0}

def _get_model_related_fields_names(model):
	related_fields_names = [f.name for f in model._meta.get_fields()
		if (f.one_to_many or f.one_to_one)
		and f.auto_created and not f.concrete]
	return related_fields_names

def _get_object_field_data_pair(obj):
	fields = _get_model_not_related_concrete_fields(obj.__class__)
	data = {f:obj.__dict__.get(f) for f in fields}
	return data

def _get_queryset(model,user,from_dt, to_dt):
	day_before_from_date = from_dt - timedelta(days=1)
	related_fields = _get_model_related_fields_names(model)
	qs = model.objects.select_related(*related_fields).filter(
		user = user,created_at__range = (day_before_from_date.date(),to_dt.date()))
	return qs

def _get_datewise_aa_data(user,from_dt, to_dt):
	data = {}
	current_dt = from_dt
	sec_to_hour = lambda x: round(x/3600, 3)
	while current_dt <= to_dt:
		current_dt_str = current_dt.strftime("%Y-%m-%d")
		try:
			aa_data = AA.objects.get(user=user,created_at=current_dt.date())
			if aa_data:
				total_workout_duration = _safe_get_mobj(aa_data,"total_time",0)
				aerobic_duration = _safe_get_mobj(aa_data,"aerobic_zone",0)
				anaerobic_duration = _safe_get_mobj(aa_data,"anaerobic_zone",0)
				below_aerobic = _safe_get_mobj(aa_data,"below_aerobic_zone",0)
				hr_not_recorded = _safe_get_mobj(aa_data,"hrr_not_recorded",0)
				data[current_dt_str] = {
					"weekly_workout_duration": sec_to_hour(total_workout_duration),
					"hr_anaerobic_duration": sec_to_hour(anaerobic_duration),
					"hr_aerobic_duration": sec_to_hour(aerobic_duration),
					"hr_below_aerobic": sec_to_hour(below_aerobic),
					"hr_not_recorded_duration": sec_to_hour(hr_not_recorded)
				}
		except Exception as e:
			pass
		current_dt += timedelta(days=1)
	return data

def _update_cumulative_instance(instance, data):
	_update_helper(instance.overall_health_grade_cum, data['overall_health_grade_cum'])
	_update_helper(instance.non_exercise_steps_cum, data['non_exercise_steps_cum'])
	_update_helper(instance.sleep_per_night_cum, data['sleep_per_night_cum'])
	_update_helper(instance.movement_consistency_cum, data['movement_consistency_cum'])
	_update_helper(instance.exercise_consistency_cum, data['exercise_consistency_cum'])
	_update_helper(instance.nutrition_cum, data['nutrition_cum'])
	_update_helper(instance.exercise_stats_cum, data['exercise_stats_cum'])
	_update_helper(instance.alcohol_cum, data['alcohol_cum'])
	_update_helper(instance.other_stats_cum, data['other_stats_cum'])
	_update_helper(instance.sick_cum, data['sick_cum'])
	_update_helper(instance.standing_cum, data['standing_cum'])
	_update_helper(instance.travel_cum, data['travel_cum'])
	_update_helper(instance.stress_cum, data['stress_cum'])
	_update_helper(instance.meta_cum, data['meta_cum'])
	instance.save()

@transaction.atomic
def _create_cumulative_instance(user, data):
	created_at = _str_to_datetime(data['created_at'])
	user_cum = CumulativeSum.objects.create(user = user, created_at = created_at)
	OverallHealthGradeCumulative.objects.create(user_cum = user_cum,**data['overall_health_grade_cum'])
	NonExerciseStepsCumulative.objects.create(user_cum = user_cum,**data['non_exercise_steps_cum'])
	SleepPerNightCumulative.objects.create(user_cum = user_cum,**data['sleep_per_night_cum'])
	MovementConsistencyCumulative.objects.create(user_cum = user_cum,**data['movement_consistency_cum'])
	ExerciseConsistencyCumulative.objects.create(user_cum = user_cum,**data['exercise_consistency_cum'])
	NutritionCumulative.objects.create(user_cum = user_cum,**data['nutrition_cum'])
	ExerciseStatsCumulative.objects.create(user_cum = user_cum,**data['exercise_stats_cum'])
	AlcoholCumulative.objects.create(user_cum = user_cum,**data['alcohol_cum'])
	OtherStatsCumulative.objects.create(user_cum = user_cum, **data['other_stats_cum'])
	SickCumulative.objects.create(user_cum = user_cum, **data['sick_cum'])
	StandingCumulative.objects.create(user_cum = user_cum, **data['standing_cum'])
	TravelCumulative.objects.create(user_cum = user_cum, **data['travel_cum'])
	StressCumulative.objects.create(user_cum = user_cum, **data['stress_cum'])
	MetaCumulative.objects.create(user_cum = user_cum, **data['meta_cum'])

def _update_grade_days_cum_sum(grade,grade_days_prefix,catg_data,
							   today_ql_data,yday_catg_cum_data=None):
	'''
	It's small framework to get the cumulative sum for the grade
	bifurcation keys for various categories dynamically. For example -
	cum_days_ohg_got_a,cum_days_ohg_got_b, cum_days_nes_got_a etc.

	It's worth noting that all the fields have on thing common,
	they all ends with some grade ('a', 'b', 'c', 'd', 'f') and
	only prefix is changing. For example in [cum_days_ohg_got_a,
	cum_days_ohg_got_b, cum_days_ohg_got_c, cum_days_ohg_got_d,
	cum_days_ohg_got_f], they have common prefix "cum_days_ohg_got".
	So we can dynamicall generate the keys for all grades and
	calculate the cumulative sum without writing extra lines of
	code for each grade.

	Args:
		grade(string): Grade for particular category
		grade_days_prefix(string): string preceding the grade
			in category key. For example in "cum_days_ohg_got_b"
			"cum_days_ohg_got" is the prefix.
		catg_data(dict): Dictionary which holds cumulative sum
			for given category.
		today_ql_data: Today quick look data
		yday_catg_cum_data: Cumulative data for given category
	'''
	grades = ['a','b','c','d','f']
	grade_days_keys = [grade_days_prefix+'_'+grade for grade in grades]
	target_grade_key = None
	if grade:
		target_grade_key = grade_days_prefix+'_'+grade.lower()
	for key in grade_days_keys:
		if today_ql_data and yday_catg_cum_data:
			if target_grade_key and target_grade_key == key:
				catg_data[key] = 1 + _safe_get_mobj(yday_catg_cum_data,key,0)
			else:
				catg_data[key] = _safe_get_mobj(yday_catg_cum_data,key,0)
		elif today_ql_data:
			if target_grade_key and target_grade_key == key:
				catg_data[key] = 1
			else:
				catg_data[key] = 0
	return catg_data

def _update_steps_milestone_cum_sum(steps, steps_days_prefix, catg_data,
									today_ql_data, yday_catg_cum_data=None):
	'''
	It's small framework to get the cumulative sum for the steps
	bifurcation keys for total and non-exercise steps category
	dynamically. It's very similar to the framework for grade
	bifurcation.
	'''
	milestones = ['10k','20k','25k','30k','40k']
	steps_days_keys = [steps_days_prefix+'_'+m for m in milestones]
	if steps > 40000:
		milestone_key = '40k'
	elif steps >= 30000:
		milestone_key = '30k'
	elif steps >= 25000:
		milestone_key = '25k'
	elif steps >= 20000:
		milestone_key = '20k'
	elif steps > 10000:
		milestone_key = '10k'
	else:
		milestone_key = None

	if milestone_key:
		milestone_key = steps_days_prefix+'_'+milestone_key

	for key in steps_days_keys:
		if today_ql_data and yday_catg_cum_data:
			if milestone_key and milestone_key == key:
				catg_data[key] = 1 + _safe_get_mobj(yday_catg_cum_data,key,0)
			else:
				catg_data[key] = _safe_get_mobj(yday_catg_cum_data,key,0)
		elif today_ql_data:
			if milestone_key and milestone_key == key:
				catg_data[key] = 1
			else:
				catg_data[key] = 0
	return catg_data

def _get_overall_health_grade_cum_sum(today_ql_data, yday_cum_data=None):
	overall_health_grade_cal_data = _get_blank_pa_model_fields("overall_health_grade")
	GRADE_POINT = _get_grading_sheme()
	def _cal_total_point(ql_data):
		avg_sleep_per_night_gpa = _safe_get_mobj(today_ql_data.grades_ql,"avg_sleep_per_night_gpa",0)

		total_penalty = _safe_get_mobj(today_ql_data.grades_ql,"ctrl_subs_penalty",0) + \
			_safe_get_mobj(today_ql_data.grades_ql,"smoke_penalty",0)
			
		if not avg_sleep_per_night_gpa:
			total_penalty += _safe_get_mobj(today_ql_data.grades_ql,"sleep_aid_penalty",0)

		total_gpa_point = _safe_get_mobj(
			today_ql_data.grades_ql,"movement_non_exercise_steps_gpa",0)\
			+ GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"movement_consistency_grade",'F')]\
			+ _safe_get_mobj(
			today_ql_data.grades_ql,"prcnt_unprocessed_food_consumed_gpa",0)\
			+ _safe_get_mobj(today_ql_data.grades_ql,"alcoholic_drink_per_week_gpa",0)\
			+ GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"exercise_consistency_grade","F")]\
			+ avg_sleep_per_night_gpa\
			+ total_penalty

		return total_gpa_point

	if today_ql_data and yday_cum_data:
		total_gpa_point = _cal_total_point(today_ql_data)
		today_ohg_grade = _safe_get_mobj(today_ql_data.grades_ql,"overall_health_grade",'')

		overall_health_grade_cal_data['cum_total_gpa_point'] = _safe_get_mobj(
			yday_cum_data.overall_health_grade_cum,"cum_total_gpa_point",0) + total_gpa_point

		overall_health_grade_cal_data['cum_overall_health_gpa_point'] = _safe_get_mobj(
			today_ql_data.grades_ql,"overall_health_gpa",0)\
			+ _safe_get_mobj(yday_cum_data.overall_health_grade_cum,"cum_overall_health_gpa_point",0)
		
		_update_grade_days_cum_sum(today_ohg_grade, 'cum_days_ohg_got',
								   overall_health_grade_cal_data, today_ql_data,
								   yday_cum_data.overall_health_grade_cum)

	elif today_ql_data:
		today_ohg_grade = _safe_get_mobj(today_ql_data.grades_ql,"overall_health_grade",'')
		overall_health_grade_cal_data['cum_total_gpa_point'] = _cal_total_point(today_ql_data)
		overall_health_grade_cal_data['cum_overall_health_gpa_point'] = _safe_get_mobj(
			today_ql_data.grades_ql,"overall_health_gpa",0)

		_update_grade_days_cum_sum(today_ohg_grade, 'cum_days_ohg_got',
								   overall_health_grade_cal_data, today_ql_data)

	return overall_health_grade_cal_data

def _get_non_exercise_steps_cum_sum(today_ql_data, yday_cum_data=None):
	non_exercise_steps_cum_data = _get_blank_pa_model_fields("non_exercise_steps")

	if today_ql_data and yday_cum_data:
		nes_grade = _safe_get_mobj(today_ql_data.grades_ql,"movement_non_exercise_steps_grade",'')

		ts_grade = cal_non_exercise_step_grade(
			_safe_get_mobj(today_ql_data.steps_ql,"total_steps",0))[0]

		non_exercise_steps = _safe_get_mobj(today_ql_data.steps_ql, "non_exercise_steps",0)
		total_steps = _safe_get_mobj(today_ql_data.steps_ql, "total_steps",0)

		non_exercise_steps_cum_data['cum_non_exercise_steps_gpa'] = _safe_get_mobj(
			today_ql_data.grades_ql,"movement_non_exercise_steps_gpa",0)\
			+ _safe_get_mobj(yday_cum_data.non_exercise_steps_cum,"cum_non_exercise_steps_gpa",0)

		non_exercise_steps_cum_data['cum_non_exercise_steps'] = non_exercise_steps\
			+ _safe_get_mobj(yday_cum_data.non_exercise_steps_cum,"cum_non_exercise_steps",0)

		non_exercise_steps_cum_data['cum_total_steps'] = total_steps\
			+ _safe_get_mobj(yday_cum_data.non_exercise_steps_cum,"cum_total_steps",0)

		_update_grade_days_cum_sum(nes_grade, 'cum_days_nes_got',
								   non_exercise_steps_cum_data, today_ql_data,
								   yday_cum_data.non_exercise_steps_cum)

		_update_grade_days_cum_sum(ts_grade, 'cum_days_ts_got',
								   non_exercise_steps_cum_data, today_ql_data,
								   yday_cum_data.non_exercise_steps_cum)

		_update_steps_milestone_cum_sum(non_exercise_steps, 'cum_days_nes_above',
										non_exercise_steps_cum_data, today_ql_data,
										yday_cum_data.non_exercise_steps_cum)

		_update_steps_milestone_cum_sum(total_steps, 'cum_days_ts_above',
										non_exercise_steps_cum_data, today_ql_data,
										yday_cum_data.non_exercise_steps_cum)

	elif today_ql_data:
		nes_grade = _safe_get_mobj(today_ql_data.grades_ql,"movement_non_exercise_steps_grade",'')
		
		ts_grade = cal_non_exercise_step_grade(
			_safe_get_mobj(today_ql_data.steps_ql,"total_steps",0))[0]

		non_exercise_steps = _safe_get_mobj(today_ql_data.steps_ql, "non_exercise_steps",0)
		total_steps = _safe_get_mobj(today_ql_data.steps_ql, "total_steps",0)

		non_exercise_steps_cum_data['cum_non_exercise_steps_gpa'] = _safe_get_mobj(
			today_ql_data.grades_ql,"movement_non_exercise_steps_gpa",0)
			
		non_exercise_steps_cum_data['cum_non_exercise_steps'] = non_exercise_steps

		non_exercise_steps_cum_data['cum_total_steps'] = total_steps

		_update_grade_days_cum_sum(nes_grade, 'cum_days_nes_got',
								   non_exercise_steps_cum_data, today_ql_data)

		_update_grade_days_cum_sum(ts_grade, 'cum_days_ts_got',
								   non_exercise_steps_cum_data, today_ql_data)

		_update_steps_milestone_cum_sum(non_exercise_steps, 'cum_days_nes_above',
										non_exercise_steps_cum_data, today_ql_data)

		_update_steps_milestone_cum_sum(total_steps, 'cum_days_ts_above',
										non_exercise_steps_cum_data, today_ql_data)

	return non_exercise_steps_cum_data


def _get_sleep_per_night_cum_sum(today_ql_data, yday_cum_data=None):
	sleep_per_night_cum_data = _get_blank_pa_model_fields("sleep_per_night")
	def _get_sleep_in_hours(ql_data):
		sleep_duration = _safe_get_mobj(ql_data.sleep_ql,"sleep_per_user_input",None)
		if not sleep_duration:
			sleep_duration = _safe_get_mobj(ql_data.sleep_ql,"sleep_per_wearable",None)
		return _str_to_hours_min_sec(sleep_duration)

	if today_ql_data and yday_cum_data:
		sleep_grade = _safe_get_mobj(today_ql_data.grades_ql,"avg_sleep_per_night_grade","")
		sleep_per_night_cum_data['cum_overall_sleep_gpa'] = _safe_get_mobj(
			today_ql_data.grades_ql,"avg_sleep_per_night_gpa",0) \
			+ _safe_get_mobj(yday_cum_data.sleep_per_night_cum,"cum_overall_sleep_gpa",0)

		sleep_per_night_cum_data['cum_total_sleep_in_hours'] = round(_get_sleep_in_hours(today_ql_data) \
			+ _safe_get_mobj(yday_cum_data.sleep_per_night_cum,"cum_total_sleep_in_hours",0),3)

		sleep_aid_taken = 1 if _safe_get_mobj(today_ql_data.sleep_ql,"sleep_aid","no") == "yes" else 0
		sleep_per_night_cum_data['cum_days_sleep_aid_taken'] = sleep_aid_taken \
			+ _safe_get_mobj(yday_cum_data.sleep_per_night_cum,"cum_days_sleep_aid_taken",0)

		sleep_per_night_cum_data['cum_deep_sleep_in_hours'] = round(
			_str_to_hours_min_sec(
				_safe_get_mobj(today_ql_data.sleep_ql,"deep_sleep",None),time_pattern="hh:mm"
			)+_safe_get_mobj(yday_cum_data.sleep_per_night_cum,"cum_deep_sleep_in_hours",0),3
		)

		sleep_per_night_cum_data['cum_awake_duration_in_hours'] = round(
			_str_to_hours_min_sec(
				_safe_get_mobj(today_ql_data.sleep_ql,"awake_time",None),time_pattern="hh:mm"
			)+_safe_get_mobj(yday_cum_data.sleep_per_night_cum,"cum_awake_duration_in_hours",0),3
		)

		_update_grade_days_cum_sum(sleep_grade,"cum_days_sleep_got",
								   sleep_per_night_cum_data,today_ql_data,
								   yday_cum_data.sleep_per_night_cum)

	elif today_ql_data:
		sleep_grade = _safe_get_mobj(today_ql_data.grades_ql,"avg_sleep_per_night_grade","")
		sleep_per_night_cum_data['cum_overall_sleep_gpa'] =_safe_get_mobj(
			today_ql_data.grades_ql,"avg_sleep_per_night_gpa",0)
			
		sleep_per_night_cum_data['cum_total_sleep_in_hours'] = round(_get_sleep_in_hours(today_ql_data),3)

		sleep_aid_taken = 1 if _safe_get_mobj(today_ql_data.sleep_ql,"sleep_aid","no") == "yes" else 0
		sleep_per_night_cum_data['cum_days_sleep_aid_taken'] = sleep_aid_taken

		sleep_per_night_cum_data['cum_deep_sleep_in_hours'] = round(
			_str_to_hours_min_sec(
				_safe_get_mobj(today_ql_data.sleep_ql,"deep_sleep",None),time_pattern="hh:mm"
			),3
		)

		sleep_per_night_cum_data['cum_awake_duration_in_hours'] = round(
			_str_to_hours_min_sec(
				_safe_get_mobj(today_ql_data.sleep_ql,"awake_time",None),time_pattern="hh:mm"
			),3
		)
		_update_grade_days_cum_sum(sleep_grade,"cum_days_sleep_got",
								   sleep_per_night_cum_data,today_ql_data)

	return sleep_per_night_cum_data

def _get_mc_active_min_sleep_exercise_hours(ql_data):
	'''
	Calculate total active minutes, active minute during 
	sleeping and active minute during exercise from 
	movement consistency data.

	It also provides total sleep (includes nap) and exercise hours

	Returns:
		tuple: A Tuple having above mentioned active minutes
		information in following order - 
		(total active mins, sleep active mins, exercise act mins,
			sleep hours, exercise hours)
	'''
	mc = _safe_get_mobj(ql_data.steps_ql,"movement_consistency",None)
	total_active_min = 0
	sleep_active_sec = 0
	exercise_active_sec = 0
	sleep_min = 0
	exercise_min = 0
	NON_INTERVAL_KEYS = ['total_active_minutes','total_active_prcnt',
		'active_hours','inactive_hours','sleeping_hours','strength_hours',
		'exercise_hours','nap_hours','no_data_hours','timezone_change_hours',
		'total_steps']
	if mc:
		mc = json.loads(mc)
		total_active_min = mc['total_active_minutes']
		for key,data in mc.items():
			if key not in NON_INTERVAL_KEYS:
				quarterly_data = data['quarterly']
				for quarter in quarterly_data.values():
					if(quarter['status'] == 'sleeping' or quarter['status'] == 'nap'):
						sleep_min += 15
						sleep_active_sec += quarter['active_sec']
					elif(quarter['status'] == 'exercise'):
						exercise_min += 15
						exercise_active_sec += quarter['active_sec']

	sleep_active_min = round(sleep_active_sec/60)
	exercise_active_min = round(exercise_active_sec/60)

	return (total_active_min,sleep_active_min,
			exercise_active_min,sleep_min,exercise_min)

def _get_mc_cum_sum(today_ql_data, yday_cum_data=None):
	mc_cum_data = _get_blank_pa_model_fields("mc")
	GRADE_POINT = _get_grading_sheme()
	
	def have_mc_data(today_ql_data):
		have_mc = _safe_get_mobj(
			today_ql_data.steps_ql,"movement_consistency",None)
		return True if have_mc else False

	def _get_mc_score(ql_data):
		mc = _safe_get_mobj(ql_data.steps_ql,"movement_consistency",None)
		if mc:
			mc = json.loads(mc)
			inactive_hours = int(mc.get('inactive_hours',0))
			inactive_hours += int(mc.get('no_data_hours',0))
			return inactive_hours
		return 0

	if today_ql_data and yday_cum_data:
		active_min_sleep_exercise_hours = (
			_get_mc_active_min_sleep_exercise_hours(today_ql_data))
		total_active_min = active_min_sleep_exercise_hours[0]
		sleep_active_min = active_min_sleep_exercise_hours[1]
		exercise_active_min = active_min_sleep_exercise_hours[2]
		sleep_mins = active_min_sleep_exercise_hours[3]
		exercise_mins = active_min_sleep_exercise_hours[4]
		total_active_dur_sec = round(total_active_min * 60)
		exercise_active_dur_sec = round(exercise_active_min * 60)
		mc_grade = _safe_get_mobj(
			today_ql_data.grades_ql,"movement_consistency_grade","")
		total_act_min_grade = get_active_duration_grade(total_active_dur_sec)
		act_dur_no_sleep_exec_grade = get_active_duration_grade(total_active_dur_sec,
														  		exercise_active_dur_sec)
		if not have_mc_data(today_ql_data):
			# If there is no movement consistency data then
			# total active duration and active duration excluding
			# sleep and exercise will get default 'F' grade
			# which should be ignored
			total_act_min_grade = ""
			act_dur_no_sleep_exec_grade = ""

		mc_cum_data['cum_movement_consistency_gpa'] = (GRADE_POINT[
			_safe_get_mobj(
			today_ql_data.grades_ql,"movement_consistency_grade","F")]
			+ _safe_get_mobj(yday_cum_data.movement_consistency_cum,
			"cum_movement_consistency_gpa",0))

		mc_cum_data['cum_movement_consistency_score'] = (
			_get_mc_score(today_ql_data)
			+ _safe_get_mobj(yday_cum_data.movement_consistency_cum,
			"cum_movement_consistency_score",0))

		mc_cum_data['cum_total_active_min'] = (total_active_min
			+ _safe_get_mobj(yday_cum_data.movement_consistency_cum,
			"cum_total_active_min",0))

		mc_cum_data['cum_sleep_active_min'] = (sleep_active_min
			+ _safe_get_mobj(yday_cum_data.movement_consistency_cum,
			"cum_sleep_active_min",0))

		mc_cum_data['cum_exercise_active_min'] = (exercise_active_min
			+ _safe_get_mobj(yday_cum_data.movement_consistency_cum,
			"cum_exercise_active_min",0))

		mc_cum_data['cum_sleep_hours'] = (sleep_mins
			+ _safe_get_mobj(yday_cum_data.movement_consistency_cum,
			"cum_sleep_hours",0))

		mc_cum_data['cum_exercise_hours'] = (exercise_mins
			+ _safe_get_mobj(yday_cum_data.movement_consistency_cum,
			"cum_exercise_hours",0))

		_update_grade_days_cum_sum(mc_grade, 'cum_days_mcs_got',
								   mc_cum_data, today_ql_data,
								   yday_cum_data.movement_consistency_cum)

		_update_grade_days_cum_sum(total_act_min_grade, 'cum_days_total_act_min_got',
								   mc_cum_data, today_ql_data,
								   yday_cum_data.movement_consistency_cum)

		_update_grade_days_cum_sum(act_dur_no_sleep_exec_grade,
								   'cum_days_act_min_no_sleep_exec_got',
								   mc_cum_data, today_ql_data,
								   yday_cum_data.movement_consistency_cum)

	elif today_ql_data:
		active_min_sleep_exercise_hours = (
			_get_mc_active_min_sleep_exercise_hours(today_ql_data))
		total_active_min = active_min_sleep_exercise_hours[0]
		sleep_active_min = active_min_sleep_exercise_hours[1]
		exercise_active_min = active_min_sleep_exercise_hours[2]
		sleep_mins = active_min_sleep_exercise_hours[3]
		exercise_mins = active_min_sleep_exercise_hours[4]
		total_active_dur_sec = round(total_active_min * 60)
		exercise_active_dur_sec = round(exercise_active_min * 60)
		mc_grade = _safe_get_mobj(
			today_ql_data.grades_ql,"movement_consistency_grade","")
		total_act_min_grade = get_active_duration_grade(total_active_dur_sec)
		act_dur_no_sleep_exec_grade = get_active_duration_grade(total_active_dur_sec,
														  exercise_active_dur_sec)
		if not have_mc_data(today_ql_data):
			# If there is no movement consistency data then
			# total active duration and active duration excluding
			# sleep and exercise will get default 'F' grade
			# which should be ignored
			total_act_min_grade = ""
			act_dur_no_sleep_exec_grade = ""
		
		mc_cum_data['cum_movement_consistency_gpa'] = GRADE_POINT[
			_safe_get_mobj(
				today_ql_data.grades_ql,"movement_consistency_grade","F")]

		mc_cum_data['cum_movement_consistency_score'] = (
			_get_mc_score(today_ql_data))

		mc_cum_data['cum_total_active_min'] = total_active_min
		mc_cum_data['cum_sleep_active_min'] = sleep_active_min
		mc_cum_data['cum_exercise_active_min'] = exercise_active_min
		mc_cum_data['cum_sleep_hours'] = sleep_mins
		mc_cum_data['cum_exercise_hours'] = exercise_mins

		_update_grade_days_cum_sum(mc_grade, 'cum_days_mcs_got',
								   mc_cum_data, today_ql_data)

		_update_grade_days_cum_sum(total_act_min_grade, 'cum_days_total_act_min_got',
								   mc_cum_data, today_ql_data)

		_update_grade_days_cum_sum(act_dur_no_sleep_exec_grade, 'cum_days_act_min_no_sleep_exec_got',
								   mc_cum_data, today_ql_data)
		
	return mc_cum_data


def _get_ec_cum_sum(today_ql_data, yday_cum_data=None):
	ec_cum_data = _get_blank_pa_model_fields("ec")
	GRADE_POINT = _get_grading_sheme()

	if today_ql_data and yday_cum_data:
		ec_grade = _safe_get_mobj(today_ql_data.grades_ql,
								  "exercise_consistency_grade","")

		ec_cum_data['cum_exercise_consistency_gpa'] = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"exercise_consistency_grade","F")] \
			+ _safe_get_mobj(yday_cum_data.exercise_consistency_cum,"cum_exercise_consistency_gpa",0)

		ec_cum_data["cum_avg_exercise_day"] = _safe_get_mobj(
			today_ql_data.grades_ql,"exercise_consistency_score",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_consistency_cum,"cum_avg_exercise_day",0)

		_update_grade_days_cum_sum(ec_grade, 'cum_days_ec_got',
								   ec_cum_data, today_ql_data,
								   yday_cum_data.exercise_consistency_cum)
	
	elif today_ql_data:
		ec_grade = _safe_get_mobj(today_ql_data.grades_ql,
								  "exercise_consistency_grade","")

		ec_cum_data['cum_exercise_consistency_gpa'] = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"exercise_consistency_grade","F")] 

		ec_cum_data["cum_avg_exercise_day"] = _safe_get_mobj(
			today_ql_data.grades_ql,"exercise_consistency_score",0)

		_update_grade_days_cum_sum(ec_grade, 'cum_days_ec_got',
								   ec_cum_data, today_ql_data)
	
	return ec_cum_data


def _get_nutrition_cum_sum(today_ql_data, yday_cum_data=None):
	nutrition_cum_data = _get_blank_pa_model_fields("nutrition")

	if today_ql_data and yday_cum_data:
		ufood_grade = _safe_get_mobj(today_ql_data.grades_ql,
									 "prcnt_unprocessed_food_consumed_grade","")
		nutrition_cum_data['cum_prcnt_unprocessed_food_consumed_gpa'] = _safe_get_mobj(
			today_ql_data.grades_ql,"prcnt_unprocessed_food_consumed_gpa",0) \
			+ _safe_get_mobj(yday_cum_data.nutrition_cum,"cum_prcnt_unprocessed_food_consumed_gpa",0)

		nutrition_cum_data['cum_prcnt_unprocessed_food_consumed'] = _safe_get_mobj(
			today_ql_data.food_ql,"prcnt_non_processed_food",0)\
			+ _safe_get_mobj(yday_cum_data.nutrition_cum,"cum_prcnt_unprocessed_food_consumed",0)

		_update_grade_days_cum_sum(ufood_grade, 'cum_days_ufood_got',
								   nutrition_cum_data, today_ql_data,
								   yday_cum_data.nutrition_cum)
	
	elif today_ql_data:
		ufood_grade = _safe_get_mobj(today_ql_data.grades_ql,
									 "prcnt_unprocessed_food_consumed_grade","")

		nutrition_cum_data['cum_prcnt_unprocessed_food_consumed_gpa'] = _safe_get_mobj(
			today_ql_data.grades_ql,"prcnt_unprocessed_food_consumed_gpa",0)

		nutrition_cum_data['cum_prcnt_unprocessed_food_consumed'] = _safe_get_mobj(
			today_ql_data.food_ql,"prcnt_non_processed_food",0)

		_update_grade_days_cum_sum(ufood_grade, 'cum_days_ufood_got',
								   nutrition_cum_data, today_ql_data)

	return nutrition_cum_data


def _update_with_aa_cum_sum(today_aa_data, exercise_stats_cum_data, yday_cum_data=None):
	if today_aa_data and yday_cum_data:
		exercise_stats_cum_data["cum_weekly_workout_duration_in_hours"] = \
			today_aa_data["weekly_workout_duration"]\
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_weekly_workout_duration_in_hours",0)
		exercise_stats_cum_data["cum_hr_aerobic_duration_hours"] = \
			today_aa_data["hr_aerobic_duration"]\
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_hr_aerobic_duration_hours",0)
		exercise_stats_cum_data["cum_hr_anaerobic_duration_hours"] = \
			today_aa_data["hr_anaerobic_duration"]\
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_hr_anaerobic_duration_hours",0)
		exercise_stats_cum_data["cum_hr_below_aerobic_duration_hours"] = \
			today_aa_data["hr_below_aerobic"]\
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_hr_below_aerobic_duration_hours",0)
		exercise_stats_cum_data["cum_hr_not_recorded_duration_hours"] = \
			today_aa_data["hr_not_recorded_duration"]\
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_hr_not_recorded_duration_hours",0)
	elif not today_aa_data and yday_cum_data:
		exercise_stats_cum_data["cum_weekly_workout_duration_in_hours"] = \
			_safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_weekly_workout_duration_in_hours",0)
		exercise_stats_cum_data["cum_hr_aerobic_duration_hours"] = \
			_safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_hr_aerobic_duration_hours",0)
		exercise_stats_cum_data["cum_hr_anaerobic_duration_hours"] = \
			_safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_hr_anaerobic_duration_hours",0)
		exercise_stats_cum_data["cum_hr_below_aerobic_duration_hours"] = \
			_safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_hr_below_aerobic_duration_hours",0)
		exercise_stats_cum_data["cum_hr_not_recorded_duration_hours"] = \
			_safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_hr_not_recorded_duration_hours",0)
	elif today_aa_data:
		exercise_stats_cum_data["cum_weekly_workout_duration_in_hours"] = \
			today_aa_data["weekly_workout_duration"]
		exercise_stats_cum_data["cum_hr_aerobic_duration_hours"] = \
			today_aa_data["hr_aerobic_duration"]
		exercise_stats_cum_data["cum_hr_anaerobic_duration_hours"] = \
			today_aa_data["hr_anaerobic_duration"]
		exercise_stats_cum_data["cum_hr_below_aerobic_duration_hours"] = \
			today_aa_data["hr_below_aerobic"]
		exercise_stats_cum_data["cum_hr_not_recorded_duration_hours"] = \
			today_aa_data["hr_not_recorded_duration"]
	else:
		exercise_stats_cum_data["cum_weekly_workout_duration_in_hours"] = 0
		exercise_stats_cum_data["cum_hr_aerobic_duration_hours"] = 0
		exercise_stats_cum_data["cum_hr_anaerobic_duration_hours"] = 0
		exercise_stats_cum_data["cum_hr_below_aerobic_duration_hours"] = 0
		exercise_stats_cum_data["cum_hr_not_recorded_duration_hours"] = 0


def _get_exercise_stats_cum_sum(today_ql_data, yday_cum_data=None, today_aa_data=None):
	exercise_stats_cum_data = _get_blank_pa_model_fields("exercise_stats")
	def is_valid_grade(grade, today_ql_data):
		if grade.lower() == 'f':
			# Check if there is actually some workout duration or not.
			# If there is no workout duration, that means this 'F' grade
			# is given by default and should be ignored.
			workout_dur = _str_to_hours_min_sec(_safe_get_mobj(
				today_ql_data.exercise_reporting_ql,"workout_duration",None
			))
			return True if workout_dur else False
		return True

	if today_ql_data and yday_cum_data:
		workout_grade = _safe_get_mobj(today_ql_data.grades_ql,"workout_duration_grade","")
		if not is_valid_grade(workout_grade, today_ql_data):
			workout_grade = ""

		exercise_stats_cum_data['cum_workout_duration_in_hours'] = round(_str_to_hours_min_sec(_safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"workout_duration",None)) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_workout_duration_in_hours",0),3)

		exercise_stats_cum_data['cum_workout_effort_level'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"effort_level",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_workout_effort_level",0)

		exercise_stats_cum_data['cum_avg_exercise_hr'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"avg_exercise_heartrate",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_avg_exercise_hr",0)

		exercise_stats_cum_data['cum_avg_non_strength_exercise_hr'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"avg_non_strength_heartrate",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_avg_non_strength_exercise_hr",0)

		exercise_stats_cum_data['cum_total_exercise_activities'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"total_exercise_activities",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_total_exercise_activities",0)

		exercise_stats_cum_data['cum_total_strength_activities'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"total_strength_activities",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_total_strength_activities",0)

		exercise_stats_cum_data['cum_vo2_max'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"vo2_max",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_vo2_max",0)

		_update_with_aa_cum_sum(today_aa_data,exercise_stats_cum_data,yday_cum_data)

		_update_grade_days_cum_sum(workout_grade,"cum_days_workout_dur_got",
								   exercise_stats_cum_data,today_ql_data,
								   yday_cum_data.exercise_stats_cum)
	
	elif today_ql_data:
		workout_grade = _safe_get_mobj(today_ql_data.grades_ql,"workout_duration_grade","")
		if not is_valid_grade(workout_grade, today_ql_data):
			workout_grade = ""

		exercise_stats_cum_data['cum_workout_duration_in_hours'] = _str_to_hours_min_sec(_safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"workout_duration",None)) 
		exercise_stats_cum_data['cum_workout_effort_level'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"effort_level",0) 
		exercise_stats_cum_data['cum_avg_exercise_hr'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"avg_exercise_heartrate",0)
		exercise_stats_cum_data['cum_vo2_max'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"vo2_max",0)
		exercise_stats_cum_data['cum_avg_non_strength_exercise_hr'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"avg_non_strength_heartrate",0)
		exercise_stats_cum_data['cum_total_exercise_activities'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"total_exercise_activities",0) 
		exercise_stats_cum_data['cum_total_strength_activities'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"total_strength_activities",0)

		_update_with_aa_cum_sum(today_aa_data,exercise_stats_cum_data)

		_update_grade_days_cum_sum(workout_grade,"cum_days_workout_dur_got",
								   exercise_stats_cum_data,today_ql_data)
		
		
	return exercise_stats_cum_data


def _get_alcohol_cum_sum(today_ql_data, yday_cum_data=None):

	def validate_alcohol(alcohol_drink_consumed):
		if alcohol_drink_consumed:
			if alcohol_drink_consumed == "20+":
				alcohol_drink_consumed = 21
			else:
				alcohol_drink_consumed = float(alcohol_drink_consumed)
		else:
			alcohol_drink_consumed = 0
		return alcohol_drink_consumed

	alcohol_cum_data = _get_blank_pa_model_fields("alcohol")
	
	if today_ql_data and yday_cum_data:
		alcohol_grade = _safe_get_mobj(today_ql_data.grades_ql,
									   "alcoholic_drink_per_week_grade","")

		alcohol_cum_data['cum_average_drink_per_week'] = _safe_get_mobj(
			today_ql_data.alcohol_ql,"alcohol_week",0) \
			+ _safe_get_mobj(yday_cum_data.alcohol_cum,"cum_average_drink_per_week",0)

		alcohol_cum_data['cum_alcohol_drink_per_week_gpa'] = _safe_get_mobj(
			today_ql_data.grades_ql,"alcoholic_drink_per_week_gpa",0) \
			+ _safe_get_mobj(yday_cum_data.alcohol_cum, "cum_alcohol_drink_per_week_gpa",0)

		alcohol_drink_consumed = validate_alcohol(
			_safe_get_mobj(today_ql_data.alcohol_ql,"alcohol_day",0))
			
		alcohol_cum_data['cum_alcohol_drink_consumed'] = alcohol_drink_consumed \
			+ _safe_get_mobj(yday_cum_data.alcohol_cum,"cum_alcohol_drink_consumed",0)

		_update_grade_days_cum_sum(alcohol_grade,"cum_days_alcohol_week_got",
								   alcohol_cum_data, today_ql_data,
								   yday_cum_data.alcohol_cum)
	
	elif today_ql_data:
		alcohol_grade = _safe_get_mobj(today_ql_data.grades_ql,
									   "alcoholic_drink_per_week_grade","")

		alcohol_cum_data['cum_average_drink_per_week'] = _safe_get_mobj(
			today_ql_data.alcohol_ql,"alcohol_week",0) 

		alcohol_cum_data['cum_alcohol_drink_per_week_gpa'] = _safe_get_mobj(
			today_ql_data.grades_ql,"alcoholic_drink_per_week_gpa",0)

		alcohol_drink_consumed = validate_alcohol(
			_safe_get_mobj(today_ql_data.alcohol_ql,"alcohol_day",0))
			
		alcohol_cum_data['cum_alcohol_drink_consumed'] = alcohol_drink_consumed

		_update_grade_days_cum_sum(alcohol_grade,"cum_days_alcohol_week_got",
								   alcohol_cum_data, today_ql_data)

	return alcohol_cum_data


def _get_hrr_api_data(user,date):
	'''
	Get the HRR data from the HRR table. If there is no
	data or any exception occurs return None

	Args:
		user (:obj:`User`): User object
		date (datetime.date): Date for which HRR have to be looked

	Returns:
		dict: Dictionary having HRR data
		None: If any error occurs or no data returned from API 
	'''
	try:
		data = Hrr.objects.get(user_hrr = user,created_at=date)
		formated_data = {
			"hrr_starting_point":0,
			"lowest_hr_during_hrr":0,
			"hrr_beats_lowered_first_minute":0,
			"hrr_time_to_99":0,
			"hrr_pure_1_min_beats_lowered":0,
			"hrr_pure_time_to_99":0,
			"hrr_activity_end_hr":0
		}
		measured_hrr = _safe_get_mobj(data,'Did_you_measure_HRR','')
		include_hrr = _safe_get_mobj(data,'include_hrr',False)
		if (measured_hrr == 'yes' or measured_hrr == 'no') and include_hrr:
			if measured_hrr == 'yes':
				hrr_start_beat = _safe_get_mobj(data,'HRR_start_beat',0)
			else:
				hrr_start_beat = _safe_get_mobj(data,'end_heartrate_activity',0)
			if hrr_start_beat:
				formated_data['hrr_starting_point'] = hrr_start_beat

			if measured_hrr == 'yes':
				lowest_hrr_1min = _safe_get_mobj(data,"lowest_hrr_1min",0)
			else:
				lowest_hrr_1min = _safe_get_mobj(data,"lowest_hrr_no_fitfile",0)
			if lowest_hrr_1min:
				formated_data['lowest_hr_during_hrr'] = lowest_hrr_1min

			if measured_hrr == 'yes':
				time_99 = _safe_get_mobj(data,"time_99",0)
			else:
				time_99 = _safe_get_mobj(data,"no_fitfile_hrr_time_reach_99",0)
			if time_99 and time_99 != -1:
				time_in_mins = time_99 / 60
				time_in_mins = round(time_in_mins,3)
				formated_data['hrr_time_to_99'] = time_in_mins

			if(hrr_start_beat and lowest_hrr_1min
				and hrr_start_beat >= lowest_hrr_1min):
				formated_data['hrr_beats_lowered_first_minute'] = (
					hrr_start_beat - lowest_hrr_1min
				)

			pure_1min_heart_beats = _safe_get_mobj(data,"pure_1min_heart_beats",0)
			if pure_1min_heart_beats:
				formated_data['hrr_pure_1_min_beats_lowered'] = pure_1min_heart_beats

			pure_time_99 = _safe_get_mobj(data,"pure_time_99",0)
			if pure_time_99 and pure_time_99 != -1:
				pure_time_99_in_min = round(
					pure_time_99 / 60, 3)
				formated_data["hrr_pure_time_to_99"] = pure_time_99_in_min

			activity_end_hr = _safe_get_mobj(data,"end_heartrate_activity",0)
			if activity_end_hr:
				formated_data['hrr_activity_end_hr'] = activity_end_hr
			return formated_data
		return None	
	except Exception as e:
		return None

def _get_user_hrr_data(user,today_ql_data,hrr_api_lookup = True):
	'''
	Returns the HRR information from given Raw data report.
	If HRR information is not present in the Raw report, then 
	tries to get the HRR information from HRR API which
	calculates it from FIT files.

	Args:
		user (:obj:`User`): User object

		today_ql_data(:obj:`UserQuickLook`): Raw data report from which
			HRR data have to be extracted

		hrr_api_lookup(bool): If True, try to get HRR data from the 
			HRR API if HRR data is not present in Raw report. If False,
			do not make call to API. Default is True

	Returns:
		dict: Dictionary containing HRR data.
	'''
	data = {
		"hrr_starting_point":0,
		"lowest_hr_during_hrr":0,
		"hrr_beats_lowered_first_minute":0,
		"hrr_time_to_99":0,
		"hrr_pure_1_min_beats_lowered":0,
		"hrr_pure_time_to_99":0,
		"hrr_activity_end_hr":0
	}

	if hrr_api_lookup:
		hrr_api_data = _get_hrr_api_data(user,today_ql_data.created_at)
	else:
		hrr_api_data = None

	if hrr_api_data:
		data["hrr_time_to_99"] = hrr_api_data.get("hrr_time_to_99")
		data["hrr_starting_point"] = hrr_api_data.get("hrr_starting_point")
		data["lowest_hr_during_hrr"] = hrr_api_data.get("lowest_hr_during_hrr")
		data["hrr_beats_lowered_first_minute"] = hrr_api_data.get(
			"hrr_beats_lowered_first_minute"
		)

		data["hrr_pure_1_min_beats_lowered"] = hrr_api_data.get(
			"hrr_pure_1_min_beats_lowered"
		)

		data["hrr_pure_time_to_99"] = hrr_api_data.get(
			"hrr_pure_time_to_99"
		)

		data["hrr_activity_end_hr"] = hrr_api_data.get(
			"hrr_activity_end_hr"
		)

	return data


def _get_other_stats_cum_sum(today_ql_data,user_hrr_data,yday_cum_data=None):
	other_stats_cum_data = _get_blank_pa_model_fields("other_stats")

	if today_ql_data and yday_cum_data:
		resting_hr = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"resting_hr_last_night",0)
		resting_hr_grade = None
		if resting_hr:
			resting_hr_grade = cal_resting_hr_grade(resting_hr)

		other_stats_cum_data['cum_resting_hr'] = resting_hr\
			+ _safe_get_mobj(yday_cum_data.other_stats_cum, "cum_resting_hr",0)

		other_stats_cum_data['cum_hrr_time_to_99_in_mins'] = (
			user_hrr_data['hrr_time_to_99']
			+ _safe_get_mobj(
				yday_cum_data.other_stats_cum,"cum_hrr_time_to_99_in_mins",0
			)
		)

		other_stats_cum_data['cum_hrr_beats_lowered_in_first_min'] = (
			user_hrr_data['hrr_beats_lowered_first_minute']
			+ _safe_get_mobj(
				yday_cum_data.other_stats_cum,
				"cum_hrr_beats_lowered_in_first_min",0
			)
		)

		other_stats_cum_data['cum_highest_hr_in_first_min'] = (
			user_hrr_data["hrr_starting_point"]
			+ _safe_get_mobj(
				yday_cum_data.other_stats_cum,"cum_highest_hr_in_first_min",0
			)
		)

		other_stats_cum_data['cum_hrr_lowest_hr_point'] = (
			user_hrr_data["lowest_hr_during_hrr"]
			+ _safe_get_mobj(
				yday_cum_data.other_stats_cum,"cum_hrr_lowest_hr_point",0
			)
		)

		other_stats_cum_data['cum_hrr_pure_1_min_beats_lowered'] = (
			user_hrr_data["hrr_pure_1_min_beats_lowered"]
			+_safe_get_mobj(
				yday_cum_data.other_stats_cum,
				"cum_hrr_pure_1_min_beats_lowered",0
			)
		)

		other_stats_cum_data['cum_hrr_pure_time_to_99'] = (
			user_hrr_data["hrr_pure_time_to_99"]
			+_safe_get_mobj(
				yday_cum_data.other_stats_cum,
				"cum_hrr_pure_time_to_99",0
			)
		)

		other_stats_cum_data['cum_hrr_activity_end_hr'] = (
			user_hrr_data["hrr_activity_end_hr"]
			+_safe_get_mobj(
				yday_cum_data.other_stats_cum,
				"cum_hrr_activity_end_hr",0
			)
		)

		other_stats_cum_data['cum_floors_climbed'] = _safe_get_mobj(
			today_ql_data.steps_ql,"floor_climed",0) \
			+ _safe_get_mobj(yday_cum_data.other_stats_cum,"cum_floors_climbed",0)

		_update_grade_days_cum_sum(resting_hr_grade,"cum_days_resting_hr_got",
								   other_stats_cum_data,today_ql_data,
								   yday_cum_data.other_stats_cum)

	elif today_ql_data:
		resting_hr = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"resting_hr_last_night",0)
		resting_hr_grade = None
		if resting_hr:
			resting_hr_grade = cal_resting_hr_grade(resting_hr)

		other_stats_cum_data['cum_resting_hr'] = resting_hr

		other_stats_cum_data['cum_hrr_time_to_99_in_mins'] = user_hrr_data[
			'hrr_time_to_99'
		]
		other_stats_cum_data['cum_hrr_beats_lowered_in_first_min'] = user_hrr_data[
			'hrr_beats_lowered_first_minute'
		]
		other_stats_cum_data['cum_highest_hr_in_first_min'] = user_hrr_data[
			"hrr_starting_point"
		]

		other_stats_cum_data['cum_hrr_lowest_hr_point'] = user_hrr_data[
			"lowest_hr_during_hrr"
		]

		other_stats_cum_data['cum_hrr_pure_1_min_beats_lowered'] = user_hrr_data[
			"hrr_pure_1_min_beats_lowered"
		]
			
		other_stats_cum_data['cum_hrr_pure_time_to_99'] = user_hrr_data[
			"hrr_pure_time_to_99"
		]

		other_stats_cum_data['cum_hrr_activity_end_hr'] = user_hrr_data[
			"hrr_activity_end_hr"
		]
		
		other_stats_cum_data['cum_floors_climbed'] = _safe_get_mobj(
			today_ql_data.steps_ql,"floor_climed",0)

		_update_grade_days_cum_sum(resting_hr_grade,"cum_days_resting_hr_got",
								   other_stats_cum_data,today_ql_data)
	return other_stats_cum_data

def _get_sick_cum_sum(today_ql_data, yday_cum_data=None):
	sick_cum_data = _get_blank_pa_model_fields("sick")

	if today_ql_data and yday_cum_data:
		is_sick = _safe_get_mobj(today_ql_data.exercise_reporting_ql,"sick",None)
		is_sick = 1 if (is_sick and is_sick == 'yes') else 0 
		sick_cum_data['cum_days_sick'] = is_sick \
			+ _safe_get_mobj(yday_cum_data.sick_cum,"cum_days_sick",0)

	elif today_ql_data:
		is_sick = _safe_get_mobj(today_ql_data.exercise_reporting_ql,"sick",None) 
		sick_cum_data['cum_days_sick'] = 1 if (is_sick and is_sick == 'yes') else 0

	return sick_cum_data

def _get_standing_cum_sum(today_ui_data,yday_cum_data=None):
	standing_cum_data = _get_blank_pa_model_fields("standing")

	if today_ui_data and yday_cum_data:
		stand_three_hours = _safe_get_mobj(
			today_ui_data.optional_input,"stand_for_three_hours",None)
		stand_three_hours = 1 if (stand_three_hours and stand_three_hours == 'yes') else 0
		standing_cum_data['cum_days_stand_three_hour'] = stand_three_hours \
			+ _safe_get_mobj(yday_cum_data.standing_cum,"cum_days_stand_three_hour",0)

	elif not today_ui_data and yday_cum_data:
		# if no user input then copy last cumulative sum
		standing_cum_data['cum_days_stand_three_hour'] = _safe_get_mobj(
			yday_cum_data.standing_cum,"cum_days_stand_three_hour",0)

	elif today_ui_data:
		stand_three_hours = _safe_get_mobj(
			today_ui_data.optional_input,"stand_for_three_hours",None)
		stand_three_hours = 1 if (stand_three_hours and stand_three_hours == 'yes') else 0 
		standing_cum_data['cum_days_stand_three_hour'] = stand_three_hours
	else:
		standing_cum_data['cum_days_stand_three_hour'] = 0


	return standing_cum_data


def _get_travel_cum_sum(today_ui_data,yday_cum_data=None):
	travel_cum_data = _get_blank_pa_model_fields("travel")

	if today_ui_data and yday_cum_data:
		travel_away_from_home = _safe_get_mobj(today_ui_data.optional_input,"travel",None)
		travel_away_from_home = (1 if (
			travel_away_from_home and travel_away_from_home == 'yes')else 0)
		travel_cum_data['cum_days_travel_away_from_home'] = travel_away_from_home \
			+ _safe_get_mobj(yday_cum_data.travel_cum,"cum_days_travel_away_from_home",0)

	elif not today_ui_data and yday_cum_data:
		# if no user input then copy last cumulative sum
		travel_cum_data['cum_days_travel_away_from_home'] = _safe_get_mobj(
			yday_cum_data.travel_cum,"cum_days_travel_away_from_home",0)

	elif today_ui_data:
		travel_away_from_home = _safe_get_mobj(today_ui_data.optional_input,"travel",None)
		travel_away_from_home = (1 if (
			travel_away_from_home and travel_away_from_home == 'yes')else 0)
		travel_cum_data['cum_days_travel_away_from_home'] = travel_away_from_home

	else:
		travel_cum_data['cum_days_travel_away_from_home'] = 0

	return travel_cum_data

def _get_stress_cum_sum(today_ql_data, yday_cum_data=None):
	stress_cum_data = _get_blank_pa_model_fields("stress")

	if today_ql_data and yday_cum_data:
		stress_level = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"stress_level",None
		)
		stress_low = 1 if stress_level and stress_level == 'low' else 0
		stress_cum_data["cum_days_low_stress"] = stress_low + \
			_safe_get_mobj(yday_cum_data.stress_cum,"cum_days_low_stress",0)

		stress_medium = 1 if stress_level and stress_level == 'medium' else 0
		stress_cum_data["cum_days_medium_stress"] = stress_medium + \
			_safe_get_mobj(yday_cum_data.stress_cum,"cum_days_medium_stress",0)

		stress_high = 1 if stress_level and stress_level == 'high' else 0
		stress_cum_data["cum_days_high_stress"] = stress_high + \
			_safe_get_mobj(yday_cum_data.stress_cum,"cum_days_high_stress",0)

		garmin_stress_level = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"heartrate_variability_stress",-1)
		garmin_stress_level_grade = ''
		if garmin_stress_level and garmin_stress_level > 0:
			garmin_stress_level_grade = get_garmin_stress_grade(garmin_stress_level)

		stress_cum_data["cum_days_garmin_stress_lvl"] = garmin_stress_level + \
			_safe_get_mobj(yday_cum_data.stress_cum,"cum_days_garmin_stress_lvl",0)

		_update_grade_days_cum_sum(garmin_stress_level_grade,
								   "cum_garmin_stress_days_got",
								   stress_cum_data,today_ql_data,
								   yday_cum_data.stress_cum)

	elif today_ql_data:
		stress_level = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"stress_level",None
		)
		stress_low = 1 if stress_level and stress_level == 'low' else 0
		stress_cum_data["cum_days_low_stress"] = stress_low 

		stress_medium = 1 if stress_level and stress_level == 'medium' else 0
		stress_cum_data["cum_days_medium_stress"] = stress_medium 

		stress_high = 1 if stress_level and stress_level == 'high' else 0
		stress_cum_data["cum_days_high_stress"] = stress_high

		garmin_stress_level = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"heartrate_variability_stress",-1)
		garmin_stress_level_grade = ''
		if garmin_stress_level and garmin_stress_level > 0:
			garmin_stress_level_grade = get_garmin_stress_grade(garmin_stress_level)

		stress_cum_data["cum_days_garmin_stress_lvl"] = garmin_stress_level

		_update_grade_days_cum_sum(garmin_stress_level_grade,
								   "cum_garmin_stress_days_got",
								   stress_cum_data,today_ql_data)

	return stress_cum_data

def _get_meta_cum_sum(today_ql_data, today_ui_data, user_hrr_data,
		yday_cum_data = None):
	meta_cum_data = _get_blank_pa_model_fields("meta")
	
	if today_ql_data and yday_cum_data:
		workout_dur = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"did_workout",None
		)
		workout_dur = 1 if (workout_dur and workout_dur == 'yes') else 0
		meta_cum_data['cum_workout_days_count'] = workout_dur \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_workout_days_count",0)

		resting_hr = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"resting_hr_last_night",0
		)
		resting_hr = 1 if resting_hr else 0
		meta_cum_data['cum_resting_hr_days_count'] = resting_hr \
			+ _safe_get_mobj(yday_cum_data.meta_cum, "cum_resting_hr_days_count",0)

		effort_level = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"effort_level",0
		)
		effort_level = 1 if effort_level else 0
		meta_cum_data['cum_effort_level_days_count'] = effort_level \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_effort_level_days_count",0)

		vo2_max = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"vo2_max",0
		)
		vo2_max = 1 if vo2_max else 0
		meta_cum_data['cum_vo2_max_days_count'] = vo2_max \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_vo2_max_days_count",0)

		avg_exercise_heartrate = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"avg_exercise_heartrate",0		
		)
		avg_exercise_heartrate = 1 if avg_exercise_heartrate else 0
		meta_cum_data['cum_avg_exercise_hr_days_count'] = avg_exercise_heartrate \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_avg_exercise_hr_days_count",0)

		hrr_to_99 = 1 if user_hrr_data['hrr_time_to_99'] else 0
		meta_cum_data['cum_hrr_to_99_days_count'] = hrr_to_99 \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_hrr_to_99_days_count",0)

		hrr_beats_lowered_in_first_min = user_hrr_data["hrr_beats_lowered_first_minute"]
		hrr_beats_lowered_in_first_min = 1 if hrr_beats_lowered_in_first_min  else 0
		meta_cum_data['cum_hrr_beats_lowered_in_first_min_days_count'] = hrr_beats_lowered_in_first_min \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_hrr_beats_lowered_in_first_min_days_count",0)

		highest_hr_in_first_min = user_hrr_data["hrr_starting_point"]
		highest_hr_in_first_min = 1 if highest_hr_in_first_min else 0
		meta_cum_data['cum_highest_hr_in_first_min_days_count'] = highest_hr_in_first_min \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_highest_hr_in_first_min_days_count",0)

		hrr_lowest_hr_point = user_hrr_data['lowest_hr_during_hrr']
		hrr_lowest_hr_point = 1 if hrr_lowest_hr_point else 0
		meta_cum_data['cum_hrr_lowest_hr_point_days_count'] = hrr_lowest_hr_point \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_hrr_lowest_hr_point_days_count",0)

		have_mc = _safe_get_mobj(
			today_ql_data.steps_ql,"movement_consistency",None)
		have_mc = 1 if have_mc else 0
		meta_cum_data['cum_mc_recorded_days_count'] = have_mc \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_mc_recorded_days_count",0)

		sick_reported = _safe_get_mobj(today_ql_data.exercise_reporting_ql,"sick",0)
		sick_reported = 1 if sick_reported else 0
		meta_cum_data['cum_reported_sick_days_count'] = (sick_reported +
			_safe_get_mobj(yday_cum_data.meta_cum,"cum_reported_sick_days_count",0))

		stress_reported = _safe_get_mobj(today_ql_data.exercise_reporting_ql,"stress_level",0)
		stress_reported = 1 if stress_reported else 0
		meta_cum_data['cum_reported_stress_days_count'] = (stress_reported + 
			_safe_get_mobj(yday_cum_data.meta_cum,"cum_reported_stress_days_count",0)) 

		if today_ui_data:
			stand_three_hour = _safe_get_mobj(today_ui_data.optional_input,"stand_for_three_hours",0)
		else:
			stand_three_hour = 0
		stand_three_hour = 1 if stand_three_hour else 0
		meta_cum_data['cum_reported_stand_three_hours_days_count'] = (stand_three_hour + 
			_safe_get_mobj(yday_cum_data.meta_cum,"cum_reported_stand_three_hours_days_count",0))

		alcohol_yesterday = _safe_get_mobj(today_ql_data.alcohol_ql,"alcohol_day",0)
		alcohol_yesterday = 1 if alcohol_yesterday else 0 
		meta_cum_data['cum_reported_alcohol_days_count'] = alcohol_yesterday \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_reported_alcohol_days_count",0)

		beat_lowered_in_pure_1_min = user_hrr_data.get(
			"hrr_pure_1_min_beats_lowered",0)
		beat_lowered_in_pure_1_min = 1 if beat_lowered_in_pure_1_min else 0
		meta_cum_data['cum_hrr_pure_1_minute_beat_lowered_days_count'] = (
			beat_lowered_in_pure_1_min
			+ _safe_get_mobj(
				yday_cum_data.meta_cum,
				"cum_hrr_pure_1_minute_beat_lowered_days_count",0)
		)

		pure_time_to_99 = user_hrr_data.get(
			"hrr_pure_time_to_99",0)
		pure_time_to_99 = 1 if pure_time_to_99 else 0
		meta_cum_data['cum_hrr_pure_time_to_99_days_count'] = (
			pure_time_to_99
			+ _safe_get_mobj(
				yday_cum_data.meta_cum,"cum_hrr_pure_time_to_99_days_count",0)
		)

		hrr_activity_end_hr = user_hrr_data.get(
			"hrr_activity_end_hr",0
		)
		hrr_activity_end_hr = 1 if hrr_activity_end_hr else 0
		meta_cum_data['cum_hrr_activity_end_hr_days_count'] = (
			hrr_activity_end_hr
			+ _safe_get_mobj(
				yday_cum_data.meta_cum, "cum_hrr_activity_end_hr_days_count",0
			)
		)

		sleep_dur = _safe_get_mobj(today_ql_data.sleep_ql,"sleep_per_user_input",None)
		if not sleep_dur:
			sleep_dur = _safe_get_mobj(today_ql_data.sleep_ql,"sleep_per_wearable",None)
		sleep_dur = 1 if sleep_dur else 0
		meta_cum_data['cum_sleep_reported_days_count'] = sleep_dur \
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_sleep_reported_days_count",0)

		reported_inputs = 1 if today_ui_data else 0
		meta_cum_data['cum_inputs_reported_days_count'] = reported_inputs\
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_inputs_reported_days_count",0)

		garmin_stress_level = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"heartrate_variability_stress",-1)
		have_garmin_stress = 1 if garmin_stress_level and garmin_stress_level > 0 else 0
		meta_cum_data['cum_have_garmin_stress_days_count'] = have_garmin_stress\
			+ _safe_get_mobj(yday_cum_data.meta_cum,"cum_have_garmin_stress_days_count",0)

	elif today_ql_data:
		workout_dur = _str_to_hours_min_sec(_safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"workout_duration",None
		))
		meta_cum_data['cum_workout_days_count'] = 1 if workout_dur else 0

		resting_hr = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"resting_hr_last_night",0
		)
		meta_cum_data['cum_resting_hr_days_count'] = 1 if resting_hr else 0

		effort_level = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"effort_level",0
		)
		meta_cum_data['cum_effort_level_days_count'] = 1 if effort_level else 0

		vo2_max = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"vo2_max",0
		)
		meta_cum_data['cum_vo2_max_days_count'] = 1 if vo2_max else 0

		avg_exercise_heartrate = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"avg_exercise_heartrate",0		
		)
		meta_cum_data['cum_avg_exercise_hr_days_count'] = 1 if avg_exercise_heartrate else 0

		hrr_to_99 = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"hrr_time_to_99",""
		)
		meta_cum_data['cum_hrr_to_99_days_count'] = 1 if hrr_to_99 else 0

		hrr_beats_lowered_in_first_min = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"hrr_beats_lowered_first_minute",0)
		meta_cum_data['cum_hrr_beats_lowered_in_first_min_days_count'] = 1 if hrr_beats_lowered_in_first_min else 0

		highest_hr_in_first_min = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"hrr_starting_point",0)
		meta_cum_data['cum_highest_hr_in_first_min_days_count'] = 1 if highest_hr_in_first_min else 0

		hrr_lowest_hr_point = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"lowest_hr_during_hrr",0)
		meta_cum_data['cum_hrr_lowest_hr_point_days_count'] = 1 if hrr_lowest_hr_point else 0

		have_mc = _safe_get_mobj(
			today_ql_data.steps_ql,"movement_consistency",None)
		meta_cum_data['cum_mc_recorded_days_count'] = 1 if have_mc else 0

		sick_reported = _safe_get_mobj(today_ql_data.exercise_reporting_ql,"sick",0)
		meta_cum_data['cum_reported_sick_days_count'] = 1 if sick_reported else 0

		stress_reported = _safe_get_mobj(today_ql_data.exercise_reporting_ql,"stress_level",0)
		meta_cum_data['cum_reported_stress_days_count'] = 1 if stress_reported else 0

		if today_ui_data:
			stand_three_hour = _safe_get_mobj(today_ui_data.optional_input,"stand_for_three_hours",0)
		else:
			stand_three_hour = 0
		meta_cum_data['cum_reported_stand_three_hours_days_count'] = 1 if stand_three_hour else 0

		alcohol_yesterday = _safe_get_mobj(today_ql_data.alcohol_ql,"alcohol_day",0)
		meta_cum_data['cum_reported_alcohol_days_count'] = 1 if alcohol_yesterday else 0 

		beat_lowered_in_pure_1_min = user_hrr_data.get(
			"hrr_pure_1_min_beats_lowered",0)
		beat_lowered_in_pure_1_min = 1 if beat_lowered_in_pure_1_min else 0
		meta_cum_data['cum_hrr_pure_1_minute_beat_lowered_days_count'] = beat_lowered_in_pure_1_min

		pure_time_to_99 = user_hrr_data.get(
			"hrr_pure_time_to_99",0)
		pure_time_to_99 = 1 if pure_time_to_99 else 0
		meta_cum_data['cum_hrr_pure_time_to_99_days_count'] = pure_time_to_99

		hrr_activity_end_hr = user_hrr_data.get(
			"cum_hrr_activity_end_hr",0
		)
		hrr_activity_end_hr = 1 if hrr_activity_end_hr else 0
		meta_cum_data['cum_hrr_activity_end_hr_days_count'] = hrr_activity_end_hr

		sleep_dur = _safe_get_mobj(today_ql_data.sleep_ql,"sleep_per_user_input",None)
		if not sleep_dur:
			sleep_dur = _safe_get_mobj(today_ql_data.sleep_ql,"sleep_per_wearable",None)
		sleep_dur = 1 if sleep_dur else 0
		meta_cum_data['cum_sleep_reported_days_count'] = sleep_dur

		reported_inputs = 1 if today_ui_data else 0
		meta_cum_data['cum_inputs_reported_days_count'] = reported_inputs

		garmin_stress_level = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"heartrate_variability_stress",-1)
		have_garmin_stress = 1 if garmin_stress_level and garmin_stress_level > 0 else 0
		meta_cum_data['cum_have_garmin_stress_days_count'] = have_garmin_stress
		
	return meta_cum_data


def create_cumulative_instance(user, from_dt=None, to_dt=None):
	'''
	Creates or updates the cumulative sum record for certain user
	for provided date range.

	Args:
		user(:obj:`User`): User for whom cumulative sum is created
		from_dt(str): Date from which sums need to be created. Date
			is in 'YYYY-MM-DD' format.
		to_dt(str): Date upto which sums need to be created. Date
			is in 'YYYY-MM-DD' format.
	'''
	from_dt = _str_to_datetime(from_dt)
	to_dt = _str_to_datetime(to_dt)
	quicklook_datewise_data = {q.created_at.strftime('%Y-%m-%d'):q 
		for q in _get_queryset(UserQuickLook,user,from_dt,to_dt)}

	userinput_datewise_data = {q.created_at.strftime('%Y-%m-%d'):q 
		for q in _get_queryset(UserDailyInput,user,from_dt,to_dt)}

	aa_datewise_data = _get_datewise_aa_data(user,from_dt,to_dt)

	current_date = from_dt
	while current_date <= to_dt:
		data = {"created_at":current_date.strftime("%Y-%m-%d")}
		yday_dt = current_date - timedelta(days=1)
		# Pull required data from various sources which are 
		# required for generating PA reports
		today_ql_data = quicklook_datewise_data.get(current_date.strftime('%Y-%m-%d'),None)
		today_ui_data = userinput_datewise_data.get(current_date.strftime('%Y-%m-%d'),None)
		today_aa_data = aa_datewise_data.get(current_date.strftime("%Y-%m-%d"),None)
		yday_cum_data = {q.created_at.strftime("%Y-%m-%d"):q 
			for q in _get_queryset(CumulativeSum,user,yday_dt,yday_dt)}
		yday_cum_data = yday_cum_data.get(yday_dt.strftime('%Y-%m-%d'),None)

		if today_ql_data and yday_cum_data:
			data["overall_health_grade_cum"] = _get_overall_health_grade_cum_sum(today_ql_data,yday_cum_data)
			data["non_exercise_steps_cum"] = _get_non_exercise_steps_cum_sum(today_ql_data,yday_cum_data)
			data["sleep_per_night_cum"] = _get_sleep_per_night_cum_sum(today_ql_data,yday_cum_data)
			data["movement_consistency_cum"] = _get_mc_cum_sum(today_ql_data,yday_cum_data)
			data["exercise_consistency_cum"] = _get_ec_cum_sum(today_ql_data, yday_cum_data)
			data["nutrition_cum"] = _get_nutrition_cum_sum(today_ql_data, yday_cum_data)
			data["exercise_stats_cum"] = _get_exercise_stats_cum_sum(today_ql_data,
																	 yday_cum_data,
																	 today_aa_data)
			data["alcohol_cum"] = _get_alcohol_cum_sum(today_ql_data, yday_cum_data)

			user_hrr_data = _get_user_hrr_data(
				user,today_ql_data,hrr_api_lookup = True
			)
			data["other_stats_cum"] = _get_other_stats_cum_sum(
				today_ql_data,user_hrr_data,yday_cum_data
			)
			
			data["sick_cum"] = _get_sick_cum_sum(today_ql_data, yday_cum_data)
			data["standing_cum"] = _get_standing_cum_sum(today_ui_data, yday_cum_data)
			data["travel_cum"] = _get_travel_cum_sum(today_ui_data, yday_cum_data)
			data["stress_cum"] = _get_stress_cum_sum(today_ql_data, yday_cum_data)
			data["meta_cum"] = _get_meta_cum_sum(
				today_ql_data,today_ui_data,user_hrr_data,yday_cum_data
			)

		elif not today_ql_data and yday_cum_data:
			# No quick look data today that means no user input as well,
			# so copy yesterday PA report data
			data["overall_health_grade_cum"] = _get_object_field_data_pair(
				yday_cum_data.overall_health_grade_cum
			)
			data["non_exercise_steps_cum"] = _get_object_field_data_pair(
				yday_cum_data.non_exercise_steps_cum
			)
			data["sleep_per_night_cum"] = _get_object_field_data_pair(
				yday_cum_data.sleep_per_night_cum
			)
			data["movement_consistency_cum"] = _get_object_field_data_pair(
				yday_cum_data.movement_consistency_cum
			)
			data["exercise_consistency_cum"] = _get_object_field_data_pair(
				yday_cum_data.exercise_consistency_cum
			)
			data["nutrition_cum"] = _get_object_field_data_pair(
				yday_cum_data.nutrition_cum
			)
			data["exercise_stats_cum"] = _get_object_field_data_pair(
				yday_cum_data.exercise_stats_cum
			)
			data["alcohol_cum"] = _get_object_field_data_pair(
				yday_cum_data.alcohol_cum
			)
			data["other_stats_cum"] = _get_object_field_data_pair(
				yday_cum_data.other_stats_cum
			)
			data["sick_cum"] = _get_object_field_data_pair(yday_cum_data.sick_cum)
			data["standing_cum"] = _get_object_field_data_pair(yday_cum_data.standing_cum)
			data["travel_cum"] = _get_object_field_data_pair(yday_cum_data.travel_cum)
			data["stress_cum"] = _get_object_field_data_pair(yday_cum_data.stress_cum)
			data["meta_cum"] = _get_object_field_data_pair(yday_cum_data.meta_cum)

		elif today_ql_data and not yday_cum_data:
			# Very beginning when there is no quick look data yesterday
			# get current quick look data and create cumulative sum
			data["overall_health_grade_cum"] = _get_overall_health_grade_cum_sum(today_ql_data)
			data["non_exercise_steps_cum"] = _get_non_exercise_steps_cum_sum(today_ql_data)
			data["sleep_per_night_cum"] = _get_sleep_per_night_cum_sum(today_ql_data)
			data["movement_consistency_cum"] = _get_mc_cum_sum(today_ql_data)
			data["exercise_consistency_cum"] = _get_ec_cum_sum(today_ql_data)
			data["nutrition_cum"] = _get_nutrition_cum_sum(today_ql_data)
			data["exercise_stats_cum"] = _get_exercise_stats_cum_sum(today_ql_data,
																	 today_aa_data = today_aa_data)
			data["alcohol_cum"] = _get_alcohol_cum_sum(today_ql_data)

			user_hrr_data = _get_user_hrr_data(
				user, today_ql_data, hrr_api_lookup = True
			)
			data["other_stats_cum"] = _get_other_stats_cum_sum(
				today_ql_data,user_hrr_data
			)

			data["sick_cum"] = _get_sick_cum_sum(today_ql_data)
			data["standing_cum"] = _get_standing_cum_sum(today_ui_data)
			data["travel_cum"] = _get_travel_cum_sum(today_ui_data)
			data["stress_cum"] = _get_stress_cum_sum(today_ql_data)
			data["meta_cum"] = _get_meta_cum_sum(
				today_ql_data,today_ui_data,user_hrr_data
			)
		else:
			# Insufficient data, do not create cumulative sum for current date
			current_date += timedelta(days = 1)
			continue
		try:
			user_cum = CumulativeSum.objects.get(user=user, created_at=current_date.date())
			_update_cumulative_instance(user_cum, data)
		except CumulativeSum.DoesNotExist:
			_create_cumulative_instance(user, data)

		current_date += timedelta(days = 1)


def create_cum_raw_data(user,today_ql_data,today_ui_data,today_aa_data,yday_cum_data=None):
	'''
	Creates cumulative sum raw data and returns it. It doesn't create 
	or update the cumulative sum records. It's a helper function 
	used in 'ToCumulativeSum' class in 'helpers/helper_classes.py'

	Args:
		user(:obj:`User`): User for whom cumulative sum is created
		today_ql_data(:obj:`UserQuickLook`)
		today_ui_data(:obj:`UserDailyInput`) 
		yday_cum_data(:obj:`CumulativeSum`,optional)
		
	'''
	data = {"created_at":today_ql_data.created_at.strftime("%Y-%m-%d")}
	if today_ql_data and yday_cum_data:
		data["overall_health_grade_cum"] = _get_overall_health_grade_cum_sum(today_ql_data,yday_cum_data)
		data["non_exercise_steps_cum"] = _get_non_exercise_steps_cum_sum(today_ql_data,yday_cum_data)
		data["sleep_per_night_cum"] = _get_sleep_per_night_cum_sum(today_ql_data,yday_cum_data)
		data["movement_consistency_cum"] = _get_mc_cum_sum(today_ql_data,yday_cum_data)
		data["exercise_consistency_cum"] = _get_ec_cum_sum(today_ql_data, yday_cum_data)
		data["nutrition_cum"] = _get_nutrition_cum_sum(today_ql_data, yday_cum_data)
		data["exercise_stats_cum"] = _get_exercise_stats_cum_sum(today_ql_data,
																 yday_cum_data,
																 today_aa_data)
		data["alcohol_cum"] = _get_alcohol_cum_sum(today_ql_data, yday_cum_data)

		user_hrr_data = _get_user_hrr_data(
			user,today_ql_data,hrr_api_lookup = True
		)
		data["other_stats_cum"] = _get_other_stats_cum_sum(
			today_ql_data, user_hrr_data, yday_cum_data
		)
		data["sick_cum"] = _get_sick_cum_sum(today_ql_data, yday_cum_data)
		data["standing_cum"] = _get_standing_cum_sum(today_ui_data, yday_cum_data)
		data["travel_cum"] = _get_travel_cum_sum(today_ui_data, yday_cum_data)
		data["stress_cum"] = _get_stress_cum_sum(today_ql_data, yday_cum_data)
		data["meta_cum"] = _get_meta_cum_sum(
			today_ql_data,today_ui_data,user_hrr_data,yday_cum_data
		)

	elif today_ql_data:
		# get current quick look data and create cumulative sum
		data["overall_health_grade_cum"] = _get_overall_health_grade_cum_sum(today_ql_data)
		data["non_exercise_steps_cum"] = _get_non_exercise_steps_cum_sum(today_ql_data)
		data["sleep_per_night_cum"] = _get_sleep_per_night_cum_sum(today_ql_data)
		data["movement_consistency_cum"] = _get_mc_cum_sum(today_ql_data)
		data["exercise_consistency_cum"] = _get_ec_cum_sum(today_ql_data)
		data["nutrition_cum"] = _get_nutrition_cum_sum(today_ql_data)
		data["exercise_stats_cum"] = _get_exercise_stats_cum_sum(today_ql_data,
																 today_aa_data = today_aa_data)
		data["alcohol_cum"] = _get_alcohol_cum_sum(today_ql_data)

		user_hrr_data = _get_user_hrr_data(
			user,today_ql_data,hrr_api_lookup = True
		)
		data["other_stats_cum"] = _get_other_stats_cum_sum(
			today_ql_data,user_hrr_data
		)
		data["sick_cum"] = _get_sick_cum_sum(today_ql_data)
		data["standing_cum"] = _get_standing_cum_sum(today_ui_data)
		data["travel_cum"] = _get_travel_cum_sum(today_ui_data)
		data["stress_cum"] = _get_stress_cum_sum(today_ql_data)
		data["meta_cum"] = _get_meta_cum_sum(
			today_ql_data,today_ui_data,user_hrr_data
		)

	return data

def set_pa_bulk_update_start_date(user,from_dt):
	try:
		update_require_from = user.pa_update_meta.requires_update_from
	except ObjectDoesNotExist:
		ProgressReportUpdateMeta.objects.create(
			user = user,
			requires_update_from = None
		)
		update_require_from = None

	from_dt = datetime.strptime(from_dt,"%Y-%m-%d").date()

	if not update_require_from or from_dt <= update_require_from:
		user.pa_update_meta.requires_update_from = from_dt
		user.pa_update_meta.save()