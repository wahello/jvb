from datetime import datetime,timedelta
import json

from django.db import transaction,DatabaseError

from quicklook.models import UserQuickLook
from progress_analyzer.models import CumulativeSum,\
	OverallHealthGradeCumulative, \
	NonExerciseStepsCumulative, \
	SleepPerNightCumulative, \
	MovementConsistencyCumulative, \
	ExerciseConsistencyCumulative, \
	NutritionCumulative, \
	ExerciseStatsCumulative, \
	AlcoholCumulative,\
	OtherStatsCumulative

def _get_blank_pa_model_fields(model):
	if model == "overall_health_grade":
		fields = {
			"cum_total_gpa_point":None,
			"cum_overall_health_gpa_point":None,
		}
		return fields
	elif model == "non_exercise_steps":
		fields = {
			"cum_non_exercise_steps":None,
			"cum_non_exercise_steps_gpa":None,
			"cum_total_steps":None,
		}
		return fields
	elif model == "sleep_per_night":
		fields = {
			"cum_total_sleep_in_hours":None,
			"cum_overall_sleep_gpa":None,
		}
		return fields
	elif model == "mc":
		fields = {
			"cum_movement_consistency_gpa":None,
			"cum_movement_consistency_score":None,
		}
		return fields
	elif model == "ec":
		fields = {
			"cum_avg_exercise_day":None,
			"cum_exercise_consistency_gpa":None,
		}
		return fields
	elif model == "nutrition":
		fields = {
			"cum_prcnt_unprocessed_food_consumed":None,
			"cum_prcnt_unprocessed_food_consumed_gpa":None,
		}
		return fields
	elif model == "exercise_stats":
		fields = {
			"cum_workout_duration_in_hours":None,
			"cum_workout_effort_level":None,
			"cum_avg_exercise_hr":None,
			"cum_vo2_max":None,
		}
		return fields
	elif model == "alcohol":
		fields = {
			"cum_average_drink_per_week":None,
			"cum_alcohol_drink_per_week_gpa":None,
		}
		return fields
	elif model == "other_stats":
		fields = {
			"cum_resting_hr":None,
			"cum_hrr_time_to_99_in_mins":None,
			"cum_hrr_beats_lowered_in_first_min":None,
			"cum_highest_hr_in_first_min":None,
			"cum_hrr_lowest_hr_point":None,
			"cum_floors_climbed":None
		}
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

def _get_grading_sheme():
	return {'A':4,'B':3,'C':2,'D':1,'F':0}

def _get_model_related_fields_names(model):
	related_fields_names = [f.name for f in model._meta.get_fields()
		if (f.one_to_many or f.one_to_one)
		and f.auto_created and not f.concrete]
	return related_fields_names

def _get_queryset(model,user,from_dt, to_dt):
	day_before_from_date = from_dt - timedelta(days=1)
	related_fields = _get_model_related_fields_names(model)
	qs = model.objects.select_related(*related_fields).filter(
		user = user,created_at__range = (day_before_from_date.date(),to_dt.date()))
	return qs

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

def _get_overall_health_grade_cum_sum(today_ql_data, yday_cum_data=None):
	overall_health_grade_cal_data = _get_blank_pa_model_fields("overall_health_grade")
	GRADE_POINT = _get_grading_sheme()
	def _cal_total_point(ql_data):
		total_gpa_point = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"movement_non_exercise_steps_grade",'F')]\
			+ GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"movement_consistency_grade",'F')]\
			+ GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"prcnt_unprocessed_food_consumed_grade",'F')]\
			+ GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"alcoholic_drink_per_week_grade",'F')]\
			+ GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"exercise_consistency_grade","F")]\
			+ _safe_get_mobj(today_ql_data.grades_ql,"avg_sleep_per_night_gpa",0)\
			+ _safe_get_mobj(today_ql_data.grades_ql,"sleep_aid_penalty",0)\
			+ _safe_get_mobj(today_ql_data.grades_ql,"ctrl_subs_penalty",0)\
			+ _safe_get_mobj(today_ql_data.grades_ql,"smoke_penalty",0)
		return total_gpa_point

	if today_ql_data and yday_cum_data:
		total_gpa_point = _cal_total_point(today_ql_data)

		overall_health_grade_cal_data['cum_total_gpa_point'] = _safe_get_mobj(
			yday_cum_data.overall_health_grade_cum,"cum_total_gpa_point",0) + total_gpa_point

		overall_health_grade_cal_data['cum_overall_health_gpa_point'] = _safe_get_mobj(
			today_ql_data.grades_ql,"overall_health_gpa","0")\
			+ _safe_get_mobj(yday_cum_data.overall_health_grade_cum,"cum_overall_health_gpa_point",0)
	elif today_ql_data:
		overall_health_grade_cal_data['cum_total_gpa_point'] = _cal_total_point(today_ql_data.grades_ql)
		overall_health_grade_cal_data['cum_overall_health_gpa_point'] = _safe_get_mobj(
			today_ql_data.grades_ql,"overall_health_gpa","0")

	return overall_health_grade_cal_data

def _get_non_exercise_steps_cum_sum(today_ql_data, yday_cum_data=None):
	non_exercise_steps_cum_data = _get_blank_pa_model_fields("non_exercise_steps")
	GRADE_POINT = _get_grading_sheme()

	if today_ql_data and yday_cum_data:
		non_exercise_steps_cum_data['cum_non_exercise_steps_gpa'] = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"movement_non_exercise_steps_grade",'F')]\
			+ _safe_get_mobj(yday_cum_data.non_exercise_steps_cum,"cum_non_exercise_steps_gpa",0)

		non_exercise_steps_cum_data['cum_non_exercise_steps'] = _safe_get_mobj(
			today_ql_data.steps_ql, "non_exercise_steps",0)\
			+ _safe_get_mobj(yday_cum_data.non_exercise_steps_cum,"cum_non_exercise_steps",0)

		non_exercise_steps_cum_data['cum_total_steps'] = _safe_get_mobj(
			today_ql_data.steps_ql, "total_steps",0)\
			+ _safe_get_mobj(yday_cum_data.non_exercise_steps_cum,"cum_total_steps",0)

	elif today_ql_data:
		non_exercise_steps_cum_data['cum_non_exercise_steps_gpa'] = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"movement_non_exercise_steps_grade",'F')]
			
		non_exercise_steps_cum_data['cum_non_exercise_steps'] = _safe_get_mobj(
			today_ql_data.steps_ql, "non_exercise_steps",0)

		non_exercise_steps_cum_data['cum_total_steps'] = _safe_get_mobj(
			today_ql_data.steps_ql, "total_steps",0)

	return non_exercise_steps_cum_data

def _get_sleep_per_night_cum_sum(today_ql_data, yday_cum_data=None):
	sleep_per_night_cum_data = _get_blank_pa_model_fields("sleep_per_night")
	def _get_sleep_in_hours(ql_data):
		sleep_duration = _safe_get_mobj(ql_data.sleep_ql,"sleep_per_user_input",None)
		if not sleep_duration:
			sleep_duration = _safe_get_mobj(ql_data.sleep_ql,"sleep_per_wearable",None)
		return _str_to_hours_min_sec(sleep_duration)

	if today_ql_data and yday_cum_data:
		sleep_per_night_cum_data['cum_overall_sleep_gpa'] = _safe_get_mobj(
			today_ql_data.grades_ql,"avg_sleep_per_night_gpa",0) \
			+ _safe_get_mobj(yday_cum_data.sleep_per_night_cum,"cum_overall_sleep_gpa",0)

		sleep_per_night_cum_data['cum_total_sleep_in_hours'] = round(_get_sleep_in_hours(today_ql_data) \
			+ _safe_get_mobj(yday_cum_data.sleep_per_night_cum,"cum_total_sleep_in_hours",0),3)

		sleep_aid_taken = 1 if _safe_get_mobj(today_ql_data.sleep_ql,"sleep_aid","no") == "yes" else 0
		sleep_per_night_cum_data['cum_days_sleep_aid_taken'] = sleep_aid_taken \
			+ _safe_get_mobj(yday_cum_data.sleep_per_night_cum,"cum_days_sleep_aid_taken",0)

	elif today_ql_data:
		sleep_per_night_cum_data['cum_overall_sleep_gpa'] =_safe_get_mobj(
			today_ql_data.grades_ql,"avg_sleep_per_night_gpa",0)
			
		sleep_per_night_cum_data['cum_total_sleep_in_hours'] = round(_get_sleep_in_hours(today_ql_data),0)

		sleep_aid_taken = 1 if _safe_get_mobj(today_ql_data.sleep_ql,"sleep_aid","no") == "yes" else 0
		sleep_per_night_cum_data['cum_days_sleep_aid_taken'] = sleep_aid_taken

	return sleep_per_night_cum_data

def _get_mc_cum_sum(today_ql_data, yday_cum_data=None):
	mc_cum_data = _get_blank_pa_model_fields("mc")
	GRADE_POINT = _get_grading_sheme()
	def _get_mc_score(ql_data):
		mc = _safe_get_mobj(ql_data.steps_ql,"movement_consistency",None)
		if mc:
			mc = json.loads(mc)
			return int(mc['inactive_hours'])
		return 0

	if today_ql_data and yday_cum_data:
		mc_cum_data['cum_movement_consistency_gpa'] = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"movement_consistency_grade","F")] \
			+ _safe_get_mobj(yday_cum_data.movement_consistency_cum,"cum_movement_consistency_gpa",0)

		mc_cum_data['cum_movement_consistency_score'] = _get_mc_score(today_ql_data) \
			+ _safe_get_mobj(yday_cum_data.movement_consistency_cum, "cum_movement_consistency_score",0)

	elif today_ql_data:
		mc_cum_data['cum_movement_consistency_gpa'] = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"movement_consistency_grade","F")]

		mc_cum_data['cum_movement_consistency_score'] = _get_mc_score(today_ql_data)
			
	return mc_cum_data

def _get_ec_cum_sum(today_ql_data, yday_cum_data=None):
	ec_cum_data = _get_blank_pa_model_fields("ec")
	GRADE_POINT = _get_grading_sheme()

	if today_ql_data and yday_cum_data:
		ec_cum_data['cum_exercise_consistency_gpa'] = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"exercise_consistency_grade","F")] \
			+ _safe_get_mobj(yday_cum_data.exercise_consistency_cum,"cum_exercise_consistency_gpa",0)

		ec_cum_data["cum_avg_exercise_day"] = _safe_get_mobj(
			today_ql_data.grades_ql,"exercise_consistency_score",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_consistency_cum,"cum_avg_exercise_day",0)
	
	elif today_ql_data:
		ec_cum_data['cum_exercise_consistency_gpa'] = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"exercise_consistency_grade","F")] 

		ec_cum_data["cum_avg_exercise_day"] = _safe_get_mobj(
			today_ql_data.grades_ql,"exercise_consistency_score",0)
	
	return ec_cum_data

def _get_nutrition_cum_sum(today_ql_data, yday_cum_data=None):
	nutrition_cum_data = _get_blank_pa_model_fields("nutrition")

	if today_ql_data and yday_cum_data:
		nutrition_cum_data['cum_prcnt_unprocessed_food_consumed_gpa'] = _safe_get_mobj(
			today_ql_data.grades_ql,"prcnt_unprocessed_food_consumed_gpa",0) \
			+ _safe_get_mobj(yday_cum_data.nutrition_cum,"cum_prcnt_unprocessed_food_consumed_gpa",0)

		nutrition_cum_data['cum_prcnt_unprocessed_food_consumed'] = _safe_get_mobj(
			today_ql_data.food_ql,"prcnt_non_processed_food",0)\
			+ _safe_get_mobj(yday_cum_data.nutrition_cum,"cum_prcnt_unprocessed_food_consumed",0)	 
	
	elif today_ql_data:
		nutrition_cum_data['cum_prcnt_unprocessed_food_consumed_gpa'] = _safe_get_mobj(
			today_ql_data.grades_ql,"prcnt_unprocessed_food_consumed_gpa",0)

		nutrition_cum_data['cum_prcnt_unprocessed_food_consumed'] = _safe_get_mobj(
			today_ql_data.food_ql,"prcnt_non_processed_food",0)

	return nutrition_cum_data

def _get_exercise_stats_cum_sum(today_ql_data, yday_cum_data=None):
	exercise_stats_cum_data = _get_blank_pa_model_fields("exercise_stats")

	if today_ql_data and yday_cum_data:
		exercise_stats_cum_data['cum_workout_duration_in_hours'] = round(_str_to_hours_min_sec(_safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"workout_duration",None)) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_workout_duration_in_hours",0),3)

		exercise_stats_cum_data['cum_workout_effort_level'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"effort_level",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_workout_effort_level",0)

		exercise_stats_cum_data['cum_avg_exercise_hr'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"avg_exercise_heartrate",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_avg_exercise_hr",0)

		exercise_stats_cum_data['cum_vo2_max'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"vo2_max",0) \
			+ _safe_get_mobj(yday_cum_data.exercise_stats_cum,"cum_vo2_max",0)
	
	elif today_ql_data:
		exercise_stats_cum_data['cum_workout_duration_in_hours'] = _str_to_hours_min_sec(_safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"workout_duration",None)) 
		exercise_stats_cum_data['cum_workout_effort_level'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"effort_level",0) 
		exercise_stats_cum_data['cum_avg_exercise_hr'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"avg_exercise_heartrate",0)
		exercise_stats_cum_data['cum_vo2_max'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"vo2_max",0) 
		
		
	return exercise_stats_cum_data

def _get_alcohol_cum_sum(today_ql_data, yday_cum_data=None):
	alcohol_cum_data = _get_blank_pa_model_fields("alcohol")
	GRADE_POINT = _get_grading_sheme()

	if today_ql_data and yday_cum_data:
		alcohol_cum_data['cum_average_drink_per_week'] = _safe_get_mobj(
			today_ql_data.alcohol_ql,"alcohol_week",0) \
			+ _safe_get_mobj(yday_cum_data.alcohol_cum,"cum_average_drink_per_week",0)

		alcohol_cum_data['cum_alcohol_drink_per_week_gpa'] = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"alcoholic_drink_per_week_grade","F")] \
			+ _safe_get_mobj(yday_cum_data.alcohol_cum, "cum_alcohol_drink_per_week_gpa",0)
	
	elif today_ql_data:
		alcohol_cum_data['cum_average_drink_per_week'] = _safe_get_mobj(
			today_ql_data.alcohol_ql,"alcohol_week",0) 

		alcohol_cum_data['cum_alcohol_drink_per_week_gpa'] = GRADE_POINT[_safe_get_mobj(
			today_ql_data.grades_ql,"alcoholic_drink_per_week_grade","F")] 
	return alcohol_cum_data

def _get_other_stats_cum_sum(today_ql_data, yday_cum_data=None):
	other_stats_cum_data = _get_blank_pa_model_fields("other_stats")

	if today_ql_data and yday_cum_data:
		other_stats_cum_data['cum_resting_hr'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"resting_hr_last_night",0) \
			+ _safe_get_mobj(yday_cum_data.other_stats_cum, "cum_resting_hr",0)

		other_stats_cum_data['cum_hrr_time_to_99_in_mins'] = round(
			_str_to_hours_min_sec(_safe_get_mobj(
				today_ql_data.exercise_reporting_ql,"hrr_time_to_99",0),'minute',"mm:ss"),3) \
			+ _safe_get_mobj(yday_cum_data.other_stats_cum,"cum_hrr_time_to_99_in_mins",0)

		other_stats_cum_data['cum_hrr_beats_lowered_in_first_min'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"hrr_beats_lowered_first_minute",0) \
			+ _safe_get_mobj(yday_cum_data.other_stats_cum,"cum_hrr_beats_lowered_in_first_min",0)

		other_stats_cum_data['cum_highest_hr_in_first_min'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"highest_hr_first_minute",0) \
			+ _safe_get_mobj(yday_cum_data.other_stats_cum,"cum_highest_hr_in_first_min",0)

		other_stats_cum_data['cum_hrr_lowest_hr_point'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"lowest_hr_during_hrr",0) \
			+ _safe_get_mobj(yday_cum_data.other_stats_cum,"cum_hrr_lowest_hr_point",0)

		other_stats_cum_data['cum_floors_climbed'] = _safe_get_mobj(
			today_ql_data.steps_ql,"floor_climed",0) \
			+ _safe_get_mobj(yday_cum_data.other_stats_cum,"cum_floors_climbed",0)
	
	elif today_ql_data:
		other_stats_cum_data['cum_resting_hr'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"resting_hr_last_night",0)

		other_stats_cum_data['cum_hrr_time_to_99_in_mins'] = round(
			_str_to_hours_min_sec(_safe_get_mobj(
				today_ql_data.exercise_reporting_ql,"hrr_time_to_99",0),'minute',"mm:ss"),3)

		other_stats_cum_data['cum_hrr_beats_lowered_in_first_min'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"hrr_beats_lowered_first_minute",0)

		other_stats_cum_data['cum_highest_hr_in_first_min'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"highest_hr_first_minute",0)

		other_stats_cum_data['cum_hrr_lowest_hr_point'] = _safe_get_mobj(
			today_ql_data.exercise_reporting_ql,"lowest_hr_during_hrr",0)

		other_stats_cum_data['cum_floors_climbed'] = _safe_get_mobj(
			today_ql_data.steps_ql,"floor_climed",0)

	return other_stats_cum_data


def create_cumulative_instance(user, from_dt=None, to_dt=None):
	from_dt = _str_to_datetime(from_dt)
	to_dt = _str_to_datetime(to_dt)
	quicklook_datewise_data = {q.created_at.strftime('%Y-%m-%d'):q for q in _get_queryset(UserQuickLook,user,from_dt,to_dt)}
	cum_sum_datewise_data = {q.created_at.strftime("%Y-%m-%d"):q for q in _get_queryset(CumulativeSum,user,from_dt,to_dt)}
	current_date = from_dt
	while current_date <= to_dt:
		data = {"created_at":current_date.strftime("%Y-%m-%d")}
		yday_dt = current_date - timedelta(days=1)
		today_ql_data = quicklook_datewise_data.get(current_date.strftime('%Y-%m-%d'),None)
		yday_cum_data = cum_sum_datewise_data.get(yday_dt.strftime('%Y-%m-%d'),None)

		if not yday_cum_data:
			yday_cum_data = {q.created_at.strftime("%Y-%m-%d"):q for q in _get_queryset(CumulativeSum,user,yday_dt,yday_dt)}
			yday_cum_data = yday_cum_data.get(yday_dt.strftime('%Y-%m-%d'),None)

		if today_ql_data and yday_cum_data:
			data["overall_health_grade_cum"] = _get_overall_health_grade_cum_sum(today_ql_data,yday_cum_data)
			data["non_exercise_steps_cum"] = _get_non_exercise_steps_cum_sum(today_ql_data,yday_cum_data)
			data["sleep_per_night_cum"] = _get_sleep_per_night_cum_sum(today_ql_data,yday_cum_data)
			data["movement_consistency_cum"] = _get_mc_cum_sum(today_ql_data,yday_cum_data)
			data["exercise_consistency_cum"] = _get_ec_cum_sum(today_ql_data, yday_cum_data)
			data["nutrition_cum"] = _get_nutrition_cum_sum(today_ql_data, yday_cum_data)
			data["exercise_stats_cum"] = _get_exercise_stats_cum_sum(today_ql_data, yday_cum_data)
			data["alcohol_cum"] = _get_alcohol_cum_sum(today_ql_data, yday_cum_data)
			data["other_stats_cum"] = _get_other_stats_cum_sum(today_ql_data, yday_cum_data)

		elif today_ql_data:
			# Very begining when there is no quick look data yesterday
			# get current quicklook data and create cumulative sum
			data["overall_health_grade_cum"] = _get_overall_health_grade_cum_sum(today_ql_data)
			data["non_exercise_steps_cum"] = _get_non_exercise_steps_cum_sum(today_ql_data)
			data["sleep_per_night_cum"] = _get_sleep_per_night_cum_sum(today_ql_data)
			data["movement_consistency_cum"] = _get_mc_cum_sum(today_ql_data)
			data["exercise_consistency_cum"] = _get_ec_cum_sum(today_ql_data)
			data["nutrition_cum"] = _get_nutrition_cum_sum(today_ql_data)
			data["exercise_stats_cum"] = _get_exercise_stats_cum_sum(today_ql_data)
			data["alcohol_cum"] = _get_alcohol_cum_sum(today_ql_data)
			data["other_stats_cum"] = _get_other_stats_cum_sum(today_ql_data)
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

def create_cum_raw_data(today_ql_data, yday_cum_data=None):
	data = {"created_at":today_ql_data.created_at.strftime("%Y-%m-%d")}

	if today_ql_data and yday_cum_data:
		data["overall_health_grade_cum"] = _get_overall_health_grade_cum_sum(today_ql_data,yday_cum_data)
		data["non_exercise_steps_cum"] = _get_non_exercise_steps_cum_sum(today_ql_data,yday_cum_data)
		data["sleep_per_night_cum"] = _get_sleep_per_night_cum_sum(today_ql_data,yday_cum_data)
		data["movement_consistency_cum"] = _get_mc_cum_sum(today_ql_data,yday_cum_data)
		data["exercise_consistency_cum"] = _get_ec_cum_sum(today_ql_data, yday_cum_data)
		data["nutrition_cum"] = _get_nutrition_cum_sum(today_ql_data, yday_cum_data)
		data["exercise_stats_cum"] = _get_exercise_stats_cum_sum(today_ql_data, yday_cum_data)
		data["alcohol_cum"] = _get_alcohol_cum_sum(today_ql_data, yday_cum_data)
		data["other_stats_cum"] = _get_other_stats_cum_sum(today_ql_data, yday_cum_data)

	elif today_ql_data:
		# get current quicklook data and create cumulative sum
		data["overall_health_grade_cum"] = _get_overall_health_grade_cum_sum(today_ql_data)
		data["non_exercise_steps_cum"] = _get_non_exercise_steps_cum_sum(today_ql_data)
		data["sleep_per_night_cum"] = _get_sleep_per_night_cum_sum(today_ql_data)
		data["movement_consistency_cum"] = _get_mc_cum_sum(today_ql_data)
		data["exercise_consistency_cum"] = _get_ec_cum_sum(today_ql_data)
		data["nutrition_cum"] = _get_nutrition_cum_sum(today_ql_data)
		data["exercise_stats_cum"] = _get_exercise_stats_cum_sum(today_ql_data)
		data["alcohol_cum"] = _get_alcohol_cum_sum(today_ql_data)
		data["other_stats_cum"] = _get_other_stats_cum_sum(today_ql_data)

	return data