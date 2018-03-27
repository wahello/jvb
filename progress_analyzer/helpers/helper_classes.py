from datetime import datetime, timedelta
from itertools import zip_longest

from django.db.models import Q

from quicklook import calculation_helper
from quicklook.models import UserQuickLook
from progress_analyzer.models import CumulativeSum
from progress_analyzer.helpers.cumulative_helper import create_cum_raw_data

class ToOverallHealthGradeCumulative(object):
	def __init__(self,raw_data):
		self.cum_total_gpa_point = raw_data["cum_total_gpa_point"]
		self.cum_overall_health_gpa_point = raw_data["cum_overall_health_gpa_point"]

class ToNonExerciseStepsCumulative(object):
	def __init__(self,raw_data):
		self.cum_non_exercise_steps = raw_data["cum_non_exercise_steps"]
		self.cum_non_exercise_steps_gpa = raw_data["cum_non_exercise_steps_gpa"]
		self.cum_total_steps = raw_data["cum_total_steps"]

class ToSleepPerNightCumulative(object):
	def __init__(self,raw_data):
		self.cum_total_sleep_in_hours = raw_data["cum_total_sleep_in_hours"]
		self.cum_overall_sleep_gpa = raw_data["cum_overall_sleep_gpa"]
		self.cum_days_sleep_aid_taken = raw_data["cum_days_sleep_aid_taken"]
		self.cum_deep_sleep_in_hours = raw_data["cum_deep_sleep_in_hours"]
		self.cum_awake_duration_in_hours = raw_data["cum_awake_duration_in_hours"]

class ToMovementConsistencyCumulative(object):
	def __init__(self,raw_data):
		self.cum_movement_consistency_gpa = raw_data["cum_movement_consistency_gpa"]
		self.cum_movement_consistency_score = raw_data["cum_movement_consistency_score"]

class ToExerciseConsistencyCumulative(object):
	def __init__(self,raw_data):
		self.cum_avg_exercise_day = raw_data["cum_avg_exercise_day"]
		self.cum_exercise_consistency_gpa = raw_data["cum_exercise_consistency_gpa"]

class ToNutritionCumulative(object):
	def __init__(self,raw_data):
		self.cum_prcnt_unprocessed_food_consumed = raw_data["cum_prcnt_unprocessed_food_consumed"]
		self.cum_prcnt_unprocessed_food_consumed_gpa = raw_data["cum_prcnt_unprocessed_food_consumed_gpa"]

class ToExerciseStatsCumulative(object):
	def __init__(self,raw_data):
		self.cum_workout_duration_in_hours = raw_data["cum_workout_duration_in_hours"]
		self.cum_workout_effort_level = raw_data["cum_workout_effort_level"]
		self.cum_avg_exercise_hr = raw_data["cum_avg_exercise_hr"]
		self.cum_vo2_max = raw_data["cum_vo2_max"]

class ToAlcoholCumulative(object):
	def __init__(self,raw_data):
		self.cum_average_drink_per_week = raw_data["cum_average_drink_per_week"]
		self.cum_alcohol_drink_per_week_gpa = raw_data["cum_alcohol_drink_per_week_gpa"]

class ToOtherStatsCumulative(object):
	def __init__(self,raw_data):
		self.cum_resting_hr = raw_data["cum_resting_hr"]
		self.cum_hrr_time_to_99_in_mins = raw_data["cum_hrr_time_to_99_in_mins"]
		self.cum_hrr_beats_lowered_in_first_min = raw_data["cum_hrr_beats_lowered_in_first_min"]
		self.cum_highest_hr_in_first_min = raw_data["cum_highest_hr_in_first_min"]
		self.cum_hrr_lowest_hr_point = raw_data["cum_hrr_lowest_hr_point"]
		self.cum_floors_climbed = raw_data["cum_floors_climbed"]

class ToMetaCumulative(object):
	def __init__(self,raw_data):
		self.cum_workout_days_count = raw_data["cum_workout_days_count"]
		self.cum_resting_hr_days_count = raw_data["cum_resting_hr_days_count"]
		self.cum_effort_level_days_count = raw_data["cum_effort_level_days_count"]
		self.cum_vo2_max_days_count = raw_data["cum_vo2_max_days_count"]
		self.cum_avg_exercise_hr_days_count = raw_data["cum_avg_exercise_hr_days_count"]
		self.cum_hrr_to_99_days_count = raw_data["cum_hrr_to_99_days_count"]

class ToCumulativeSum(object):
	'''
	Convert a quicklook object to cumulative sum object
	'''
	def __init__(self,ql_obj,cum_obj=None):

		cum_raw_data = create_cum_raw_data(ql_obj,cum_obj)
		
		self.overall_health_grade_cum = ToOverallHealthGradeCumulative(
			cum_raw_data["overall_health_grade_cum"]
		)
		self.non_exercise_steps_cum = ToNonExerciseStepsCumulative(
			cum_raw_data["non_exercise_steps_cum"]
		)
		self.sleep_per_night_cum = ToSleepPerNightCumulative(
			cum_raw_data["sleep_per_night_cum"]
		)
		self.movement_consistency_cum = ToMovementConsistencyCumulative(
			cum_raw_data["movement_consistency_cum"]
		)
		self.exercise_consistency_cum = ToExerciseConsistencyCumulative(
			cum_raw_data["exercise_consistency_cum"]
		)
		self.nutrition_cum = ToNutritionCumulative(
			cum_raw_data["nutrition_cum"]
		)
		self.exercise_stats_cum = ToExerciseStatsCumulative(
			cum_raw_data["exercise_stats_cum"]
		)
		self.alcohol_cum = ToAlcoholCumulative(
			cum_raw_data["alcohol_cum"]
		)
		self.other_stats_cum = ToOtherStatsCumulative(
			cum_raw_data["other_stats_cum"]
		)
		self.meta_cum = ToMetaCumulative(
			cum_raw_data["meta_cum"]
		)
	
class ProgressReport():
	'''Generate Progress Analyzer Reports on the fly'''

	def grouped(self,iterable,n,fillvalue):
		'''
		Return grouped data for any iterable
		"s -> (s0,s1,s2,...sn-1), (sn,sn+1,sn+2,...s2n-1), (s2n,s2n+1,s2n+2,...s3n-1), ..."

		Arguments
		- n: type int, number of item in group
		- fillvalue: type obj, If the iterables are of uneven length, missing values
		  are filled-in with fillvalue

		example -
		>>> l = [1,2,3,4,5,6,7]
		>>> list(pairwise(l,2,None))
		>>> [(1,2), (3,4), (5,6), (7,None)]
		'''
		a = iter(iterable)
		return zip_longest(*[a]*n, fillvalue=fillvalue)

	def __init__(self,user, query_params):
		self.user = user
		self.summary_type = ['overall_health','non_exercise','sleep','mc','ec',
		'nutrition','exercise','alcohol','other']
		self.duration_type = ['today','yesterday','week','month','year']
		self.current_date = self._str_to_dt(query_params.get('date',None))
		# Custom date range(s) for which report is to be created
		# expected format of the date is 'YYYY-MM-DD'
		self.custom_ranges = query_params.get('custom_ranges',None)

		year_denominator = 365
		if self.current_date:
			yesterday = self.current_date - timedelta(days=1)
			year_start = datetime(self.current_date.year,1,1)
			year_denominator = (yesterday - year_start).days + 1

		self.duration_denominator = {
			'today':1,'yesterday':1, 'week':7, "month":30, "year":year_denominator
		}

		if self.current_date:
			self.cumulative_datewise_data = {q.created_at.strftime("%Y-%m-%d"):q 
				for q in self._get_cum_queryset()}
			self.ql_datewise_data = {q.created_at.strftime("%Y-%m-%d"):q 
				for q in self._get_ql_queryset()}

		self.custom_daterange = False
		if self.custom_ranges:
			# it'll be list of tuples, where first item of tuple is the start of range
			# and second is end of the range. For example - 
			# [("2018-02-12","2018-02-17"), ("2018-02-01, 2018-02-29"), ...]

			self.custom_ranges = [(self._str_to_dt(r[0]),self._str_to_dt(r[1]))
				for r in list(self.grouped(self.custom_ranges.split(","),2,None))
				if r[0] and r[1]]

			self.cumulative_datewise_data_custom_range = {q.created_at.strftime("%Y-%m-%d"):q 
				for q in self._get_cum_queryset_custom_range(self.custom_ranges)}
			if not self.current_date:
				self.duration_type = []

			for r in self.custom_ranges: 
				str_range = r[0].strftime("%Y-%m-%d")+" to "+r[1].strftime("%Y-%m-%d")
				self.duration_denominator[str_range] = (r[1] - r[0]).days + 1
			self.custom_daterange = True


		summaries = query_params.get('summary',None)
		if summaries:
			summaries = [item.strip() for item in summaries.strip().split(',')]
			allowed = set(summaries)
			existing = set(self.summary_type)
			for s in existing-allowed:
				self.summary_type.pop(self.summary_type.index(s))

		duration = query_params.get('duration',None)
		if duration and self.current_date:
			duration = [item.strip() for item in duration.strip().split(',')]
			allowed = set(duration)
			existing = set(self.duration_type)
			for d in existing-allowed:
				self.duration_type.pop(self.duration_type.index(d))

	def _str_to_dt(self,dt_str):
		if dt_str:
			return datetime.strptime(dt_str, "%Y-%m-%d")
		else:
			return None

	def _hours_to_hours_min(self,hours):
		if hours:
			mins = hours * 60
			hours,mins = divmod(mins,60)
			hours = round(hours)
			mins = round(mins)
			if mins < 10:
				mins = "{:02d}".format(mins) 
			return "{}:{}".format(hours,mins)
		return "00:00"

	def _min_to_min_sec(self,mins):
		if mins:
			seconds = mins * 60
			mins,seconds = divmod(seconds,60)
			mins = round(mins)
			seconds = round(seconds)
			if seconds < 10:
				seconds = "{:02d}".format(seconds)
			return "{}:{}".format(mins,seconds)
		return "00:00"

	def _get_average(self, stat1, stat2, duration_type):
		if not stat1 == None and not stat2 == None:
			avg = (stat1 - stat2)/self.duration_denominator.get(duration_type)
			return avg
		return 0
	
	def _get_model_related_fields_names(self,model):
		related_fields_names = [f.name for f in model._meta.get_fields()
			if (f.one_to_many or f.one_to_one)
			and f.auto_created and not f.concrete]
		return related_fields_names

	def _get_cum_queryset(self):
		"""
			Returns queryset of CumulativeSum for "today", "yesterday",
			"day before yesterday","week", "month", "year" according
			to current date  
		"""
		duration_end_dt = self._get_duration_datetime(self.current_date)
		user = self.user
		# duration_end_dt.pop('today') # no need of today
		day_before_yesterday = self.current_date - timedelta(days=2)
		filters = Q(created_at=day_before_yesterday)
		for d in duration_end_dt.values():
			filters |= Q(created_at=d)
		related_fields = self._get_model_related_fields_names(CumulativeSum)
		cumulative_data_qs = CumulativeSum.objects.select_related(*related_fields).filter(
			filters,user=user
		) 
		return cumulative_data_qs

	def _get_ql_queryset(self):
		"""
			Returns queryset of Quicklook for "today"
			according to current_date	  
		"""
		user = self.user
		filters = Q(created_at=self.current_date.date())
		related_fields = self._get_model_related_fields_names(UserQuickLook)
		ql_data_qs = UserQuickLook.objects.select_related(*related_fields).filter(
			filters, user = user
		)
		return ql_data_qs

	def _get_cum_queryset_custom_range(self,custom_ranges):
		user = self.user
		filters = Q()
		for r in custom_ranges:
			day_before_from_date = r[0] - timedelta(days=1)
			filters |= Q(Q(created_at=r[1].date()) | Q (created_at=day_before_from_date.date()))

		related_fields = self._get_model_related_fields_names(CumulativeSum)
		cumulative_data_qs = CumulativeSum.objects.select_related(*related_fields).filter(
			filters, user = user
		) 
		return cumulative_data_qs

	def _get_duration_datetime(self,current_date):
		duration = {
			'today': current_date.date(),
			'yesterday':(current_date - timedelta(days=1)).date(),
			# Avg excluding today
			'week':(current_date - timedelta(days=8)).date(),
			'month':(current_date - timedelta(days=31)).date(),
			#from start of the year to current date
			'year':(datetime(current_date.year,1,1) - timedelta(days=1)).date()
		}
		return duration

	def _generic_custom_range_calculator(self,key,alias,summary_type,custom_avg_calculator):
		custom_average_data = {}

		for r in self.custom_ranges:
			#for select related
			to_select_related = lambda x : "_{}_cache".format(x)

			day_before_from_date = r[0] - timedelta(days=1)
			range_start_data = self.cumulative_datewise_data_custom_range.get(
				day_before_from_date.strftime("%Y-%m-%d"),None
			)
			range_end_data = self.cumulative_datewise_data_custom_range.get(
				r[1].strftime("%Y-%m-%d"),None
			)
			
			format_summary_name = True
			if not range_end_data and r[1] == self.current_date:
				yesterday_cum_data = self.cumulative_datewise_data.get(
					(r[1]-timedelta(days=1)).strftime("%Y-%m-%d"),None
				)
				range_end_data = self.ql_datewise_data.get(
					r[1].strftime("%Y-%m-%d"),None
				)
				if range_end_data and yesterday_cum_data:
					range_end_data = ToCumulativeSum(range_end_data,yesterday_cum_data)
					format_summary_name = False

			str_range = r[0].strftime("%Y-%m-%d")+" to "+r[1].strftime("%Y-%m-%d")
			if range_start_data and range_end_data:
				range_start_meta_data = range_start_data.__dict__.get(to_select_related("meta_cum"))
				range_start_data = range_start_data.__dict__.get(to_select_related(summary_type))
				
				tmp_summary_type = summary_type
				tmp_meta_summary = "meta_cum"
				if format_summary_name:
					tmp_summary_type = to_select_related(summary_type)
					tmp_meta_summary = to_select_related(tmp_meta_summary)
				range_end_meta_data = range_end_data.__dict__.get(tmp_meta_summary)
				range_end_data = range_end_data.__dict__.get(tmp_summary_type)
				ravg = {
					"from_dt":r[0].strftime("%Y-%m-%d"),
					"to_dt":r[1].strftime("%Y-%m-%d"),
					"data":custom_avg_calculator(key,str_range,range_end_data,range_start_data,
						range_end_meta_data,range_start_meta_data)
				}

			else:
				ravg = {
					"from_dt":r[0].strftime("%Y-%m-%d"),
					"to_dt":r[1].strftime("%Y-%m-%d"),
					"data":None
				}

			custom_average_data[str_range] = ravg

		return custom_average_data

	def _generic_summary_calculator(self,calculated_data_dict,avg_calculator,summary_type):
		todays_data = self.ql_datewise_data.get(
				self.current_date.strftime("%Y-%m-%d"),None)
		todays_meta_data = None
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		yesterday_meta_data = None
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_meta_data = None

		if todays_data:
			if yesterday_data:
				todays_meta_data = ToCumulativeSum(todays_data,yesterday_data).__dict__.get("meta_cum")
				todays_data = ToCumulativeSum(todays_data,yesterday_data).__dict__.get(summary_type)
			else:
				todays_meta_data = ToCumulativeSum(todays_data).__dict__.get(summary_type)
				todays_data = ToCumulativeSum(todays_data).__dict__.get(summary_type)
		if yesterday_data:
			# Because of select related, attribute names become "_attrname_cache"
			cached_summary_type = "_{}_cache".format(summary_type)
			yesterday_meta_data = yesterday_data.__dict__.get("_meta_cum_cache")
			yesterday_data = yesterday_data.__dict__.get(cached_summary_type)

		if day_before_yesterday_data:
			cached_summary_type = "_{}_cache".format(summary_type)
			day_before_yesterday_meta_data = day_before_yesterday_data.__dict__.get("_meta_cum_cache")
			day_before_yesterday_data = day_before_yesterday_data.__dict__.get(cached_summary_type)

		for key in calculated_data_dict.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				if alias in self.duration_type:
					current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
					current_meta_data = None
					if current_data:
						cached_summary_type = "_{}_cache".format(summary_type)
						current_meta_data = current_data.__dict__.get("_meta_cum_cache")
						current_data = current_data.__dict__.get(cached_summary_type)
					if alias == 'today' and yesterday_data:
						calculated_data_dict[key][alias] = avg_calculator(key,alias,todays_data,
							yesterday_data,todays_meta_data,yesterday_meta_data)
						continue
					elif alias == 'yesterday' and day_before_yesterday_data:
						calculated_data_dict[key][alias] = avg_calculator(key,alias,yesterday_data,
							day_before_yesterday_data,yesterday_meta_data,day_before_yesterday_meta_data)
						continue
					# Avg excluding today, that's why subtract from yesterday's cum sum
					calculated_data_dict[key][alias] = avg_calculator(key,alias,yesterday_data,
						current_data,yesterday_meta_data,current_meta_data)

	def _get_summary_calculator_binding(self):
		SUMMARY_CALCULATOR_BINDING = {
			"overall_health":self._cal_overall_health_summary,
			"non_exercise":self._cal_non_exercise_summary,
			"sleep":self._cal_sleep_summary,
			"mc":self._cal_movement_consistency_summary,
			"ec":self._cal_exercise_consistency_summary,
			"nutrition":self._cal_nutrition_summary,
			"exercise":self._cal_exercise_summary,
			"alcohol":self._cal_alcohol_summary,
			"other":self._cal_other_summary
		}
		return SUMMARY_CALCULATOR_BINDING


	def _cal_overall_health_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='total_gpa_point':
					val = self._get_average(
						todays_data.cum_total_gpa_point,
						current_data.cum_total_gpa_point,alias
					)
					return round(val,2)

				elif key == 'overall_health_gpa':
					val = self._get_average(
						todays_data.cum_overall_health_gpa_point,
						current_data.cum_overall_health_gpa_point,alias
					)
					return round(val,2)

				elif key == 'overall_health_gpa_grade':
					return calculation_helper.cal_overall_grade(
						self._get_average(
							todays_data.cum_overall_health_gpa_point,
							current_data.cum_overall_health_gpa_point,alias
						)
					)[0]
			return None

		calculated_data = {
			'total_gpa_point':{d:None for d in self.duration_type},
			'overall_health_gpa':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'overall_health_gpa_grade':{d:None for d in self.duration_type}
		}
		summary_type = "overall_health_grade_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias, summary_type, _calculate
				)
		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def _cal_non_exercise_summary(self,custom_daterange = False):

		def _calculate(key, alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='non_exercise_steps':
					val =  self._get_average(
						todays_data.cum_non_exercise_steps,
						current_data.cum_non_exercise_steps,alias)
					return round(val)

				elif key == 'non_exericse_steps_gpa':
					val = self._get_average(
						todays_data.cum_non_exercise_steps_gpa,
						current_data.cum_non_exercise_steps_gpa,alias)
					return round(val,2)

				elif key == 'total_steps':
					val = self._get_average(
						todays_data.cum_total_steps,
						current_data.cum_total_steps,alias)
					return round(val)

				elif key == 'movement_non_exercise_step_grade':
					return calculation_helper.cal_non_exercise_step_grade(
						self._get_average(
							todays_data.cum_non_exercise_steps,
							current_data.cum_non_exercise_steps,alias
						)
					)[0]
			return None

		calculated_data = {
			'non_exercise_steps':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'movement_non_exercise_step_grade':{d:None for d in self.duration_type},
			'non_exericse_steps_gpa':{d:None for d in self.duration_type},
			'total_steps':{d:None for d in self.duration_type}
		}
		summary_type = "non_exercise_steps_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)
		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def _cal_sleep_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key == 'total_sleep_in_hours_min':
					val = self._get_average(
						todays_data.cum_total_sleep_in_hours,
						current_data.cum_total_sleep_in_hours,alias)
					return self._hours_to_hours_min(val)

				if key == 'deep_sleep_in_hours_min':
					val = self._get_average(
						todays_data.cum_deep_sleep_in_hours,
						current_data.cum_deep_sleep_in_hours,alias)
					return self._hours_to_hours_min(val)

				if key == 'awake_duration_in_hours_min':
					val = self._get_average(
						todays_data.cum_awake_duration_in_hours,
						current_data.cum_awake_duration_in_hours,alias)
					return self._hours_to_hours_min(val)

				elif key == 'overall_sleep_gpa':
					val = self._get_average(
						todays_data.cum_overall_sleep_gpa,
						current_data.cum_overall_sleep_gpa,alias)
					return round(val,2)

				elif key == 'average_sleep_grade':
					avg_hours = self._get_average(
						todays_data.cum_total_sleep_in_hours,
						current_data.cum_total_sleep_in_hours,alias
					)
					avg_hours_str = self._hours_to_hours_min(avg_hours)
					return calculation_helper.cal_average_sleep_grade(
						avg_hours_str,None	
					)[0]

				elif key == 'num_days_sleep_aid_taken_in_period':
					val = 0
					if ((todays_data.cum_days_sleep_aid_taken is not None) and 
						(current_data.cum_days_sleep_aid_taken is not None)):
						val = todays_data.cum_days_sleep_aid_taken - current_data.cum_days_sleep_aid_taken
					return val

				elif key == 'prcnt_days_sleep_aid_taken_in_period':
					val = 0
					if((todays_data.cum_days_sleep_aid_taken is not None) and 
						(current_data.cum_days_sleep_aid_taken is not None)):
						val = todays_data.cum_days_sleep_aid_taken - current_data.cum_days_sleep_aid_taken
					prcnt = 0
					if val:
						prcnt = round((val / self.duration_denominator[alias])*100)
					return prcnt

			return None

		calculated_data = {
			'total_sleep_in_hours_min':{d:None for d in self.duration_type},
			'deep_sleep_in_hours_min':{d:None for d in self.duration_type},
			'awake_duration_in_hours_min':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'average_sleep_grade':{d:None for d in self.duration_type},
			'num_days_sleep_aid_taken_in_period':{d:None for d in self.duration_type},
			'prcnt_days_sleep_aid_taken_in_period':{d:None for d in self.duration_type},
			'overall_sleep_gpa':{d:None for d in self.duration_type},
		}
		summary_type = "sleep_per_night_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)
		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def _cal_movement_consistency_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='movement_consistency_score':
					val = self._get_average(
						todays_data.cum_movement_consistency_score,
						current_data.cum_movement_consistency_score,alias)
					return round(val,2)
				elif key == 'movement_consistency_gpa':
					val = self._get_average(
						todays_data.cum_movement_consistency_gpa,
						current_data.cum_movement_consistency_gpa,alias)
					return round(val,2)

				elif key == 'movement_consistency_grade':
					return calculation_helper.cal_movement_consistency_grade(
						self._get_average(
							todays_data.cum_movement_consistency_score,
							current_data.cum_movement_consistency_score,alias
						)
					)
			return None

		calculated_data = {
			'movement_consistency_score':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'movement_consistency_grade':{d:None for d in self.duration_type},
			'movement_consistency_gpa':{d:None for d in self.duration_type},
		}
		summary_type = "movement_consistency_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)
		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def _cal_exercise_consistency_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='avg_no_of_days_exercises_per_week':
					val = self._get_average(
						todays_data.cum_avg_exercise_day,
						current_data.cum_avg_exercise_day,alias)
					return round(val,2)
				elif key == 'exercise_consistency_gpa':
					val = self._get_average(
						todays_data.cum_exercise_consistency_gpa,
						current_data.cum_exercise_consistency_gpa,alias)
					return round(val,2)

				elif key == 'exercise_consistency_grade':
					return calculation_helper.cal_exercise_consistency_grade(
						self._get_average(
							todays_data.cum_avg_exercise_day,
							current_data.cum_avg_exercise_day,alias
						)
					)[0]
			return None

		calculated_data = {
			'avg_no_of_days_exercises_per_week':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'exercise_consistency_grade':{d:None for d in self.duration_type},
			'exercise_consistency_gpa':{d:None for d in self.duration_type},
		}
		summary_type = "exercise_consistency_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)
		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def _cal_nutrition_summary(self, custom_daterange = False):
		
		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='prcnt_unprocessed_volume_of_food':
					val = self._get_average(
						todays_data.cum_prcnt_unprocessed_food_consumed,
						current_data.cum_prcnt_unprocessed_food_consumed,alias)
					return round(val)
				elif key == 'prcnt_unprocessed_food_gpa':
					val = self._get_average(
						todays_data.cum_prcnt_unprocessed_food_consumed_gpa,
						current_data.cum_prcnt_unprocessed_food_consumed_gpa,alias)
					return round(val,2)
				elif key == 'prcnt_unprocessed_food_grade':
					return calculation_helper.cal_unprocessed_food_grade(
						self._get_average(
							todays_data.cum_prcnt_unprocessed_food_consumed,
							current_data.cum_prcnt_unprocessed_food_consumed,alias
						)
					)[0]
			return None

		calculated_data = {
			'prcnt_unprocessed_volume_of_food':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'prcnt_unprocessed_food_grade':{d:None for d in self.duration_type},
			'prcnt_unprocessed_food_gpa':{d:None for d in self.duration_type},
		}
		summary_type = "nutrition_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def _cal_exercise_summary(self, custom_daterange = False):
		def _cal_workout_dur_average(stat1, stat2,workout_days):
			if not stat1 == None and not stat2 == None and workout_days:
				avg = (stat1 - stat2)/workout_days
				return avg
			return 0

		def _cal_effort_lvl_average(stat1, stat2, effort_lvl_days):
			if not stat1 == None and not stat2 == None and effort_lvl_days:
				avg = (stat1 - stat2)/effort_lvl_days
				return avg
			return 0

		def _cal_vo2max_average(stat1, stat2, vo2max_days):
			if not stat1 == None and not stat2 == None and vo2max_days:
				avg = (stat1 - stat2)/vo2max_days
				return avg
			return 0

		def _cal_avg_exercise_hr_average(stat1, stat2, avg_exercise_hr_days):
			if not stat1 == None and not stat2 == None and avg_exercise_hr_days:
				avg = (stat1 - stat2)/avg_exercise_hr_days
				return avg
			return 0

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='workout_duration_hours_min':
					if todays_meta_data and current_meta_data:
						workout_days = (todays_meta_data.cum_workout_days_count - 
							current_meta_data.cum_workout_days_count)
						avg_hours = _cal_workout_dur_average(
							todays_data.cum_workout_duration_in_hours,
							current_data.cum_workout_duration_in_hours,
							workout_days
						)
						return self._hours_to_hours_min(avg_hours)
					return None

				elif key == 'workout_effort_level':
					if todays_meta_data and current_meta_data:
						effort_lvl_days = (todays_meta_data.cum_effort_level_days_count - 
							current_meta_data.cum_effort_level_days_count)
						val = _cal_effort_lvl_average(
							todays_data.cum_workout_effort_level,
							current_data.cum_workout_effort_level,
							effort_lvl_days
						)
						return round(val,2)

				elif key == 'avg_exercise_heart_rate':
					if todays_meta_data and current_meta_data:
						avg_exercise_hr_days = (todays_meta_data.cum_avg_exercise_hr_days_count - 
							current_meta_data.cum_avg_exercise_hr_days_count)
						val = _cal_avg_exercise_hr_average(
							todays_data.cum_avg_exercise_hr,
							current_data.cum_avg_exercise_hr,
							avg_exercise_hr_days
						)
						return round(val)

				elif key == 'vo2_max':
					if todays_meta_data and current_meta_data:
						vo2max_days = (todays_meta_data.cum_vo2_max_days_count - 
							current_meta_data.cum_vo2_max_days_count)
						val = _cal_vo2max_average(
							todays_data.cum_vo2_max,
							current_data.cum_vo2_max,
							vo2max_days
						)
						return round(val)
					return None
			return None

		calculated_data = {
			'workout_duration_hours_min':{d:None for d in self.duration_type},
			'workout_effort_level':{d:None for d in self.duration_type},
			'avg_exercise_heart_rate':{d:None for d in self.duration_type},
			'vo2_max':{d:None for d in self.duration_type}
		}
		summary_type = "exercise_stats_cum"

		if custom_daterange:
			alias = "custom_range"
			summary_type = "exercise_stats_cum"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)
		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def _cal_alcohol_summary(self, custom_daterange = False):
		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='avg_drink_per_week':
					val = self._get_average(
						todays_data.cum_average_drink_per_week,
						current_data.cum_average_drink_per_week,alias)
					return round(val,2)

				elif key == 'alcoholic_drinks_per_week_gpa':
					val = self._get_average(
						todays_data.cum_alcohol_drink_per_week_gpa,
						current_data.cum_alcohol_drink_per_week_gpa,alias)
					return round(val)
				elif key == 'alcoholic_drinks_per_week_grade':
					return calculation_helper.cal_alcohol_drink_grade(
						self._get_average(
							todays_data.cum_average_drink_per_week,
							current_data.cum_average_drink_per_week,alias
						),self.user.profile.gender
					)[0]
			return None

		calculated_data = {
			'avg_drink_per_week':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'alcoholic_drinks_per_week_grade':{d:None for d in self.duration_type},
			'alcoholic_drinks_per_week_gpa':{d:None for d in self.duration_type},
		}
		summary_type = "alcohol_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def _cal_other_summary(self, custom_daterange = False):

		def _cal_resting_hr_average(stat1, stat2,resting_hr_days):
			if not stat1 == None and not stat2 == None and resting_hr_days:
				avg = (stat1 - stat2)/resting_hr_days
				return avg
			return 0

		def _cal_hrr_to_99_average(stat1, stat2,hrr_time_to_99_days):
			if not stat1 == None and not stat2 == None and hrr_time_to_99_days:
				avg = (stat1 - stat2)/hrr_time_to_99_days
				return avg
			return 0

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='resting_hr':
					if todays_meta_data and current_meta_data:
						resting_hr_days = (todays_meta_data.cum_resting_hr_days_count - 
							current_meta_data.cum_resting_hr_days_count)
						val = _cal_resting_hr_average(
							todays_data.cum_resting_hr,
							current_data.cum_resting_hr,
							resting_hr_days)
						return round(val)
					return None

				elif key == 'hrr_time_to_99':
					if todays_meta_data and current_meta_data:
						hrr_time_to_99_days = (todays_meta_data.cum_hrr_to_99_days_count - 
							current_meta_data.cum_hrr_to_99_days_count)
						val = self._min_to_min_sec(_cal_hrr_to_99_average(
							todays_data.cum_hrr_time_to_99_in_mins,
							current_data.cum_hrr_time_to_99_in_mins,
							hrr_time_to_99_days))
						return val
					return None
				elif key == 'hrr_beats_lowered_in_first_min':
					val = self._get_average(
						todays_data.cum_hrr_beats_lowered_in_first_min,
						current_data.cum_hrr_beats_lowered_in_first_min,alias)
					return round(val)
				elif key == 'hrr_highest_hr_in_first_min':
					val = self._get_average(
						todays_data.cum_highest_hr_in_first_min,
						current_data.cum_highest_hr_in_first_min,alias)
					return round(val)
				elif key == 'hrr_lowest_hr_point':
					val = self._get_average(
						todays_data.cum_hrr_lowest_hr_point,
						current_data.cum_hrr_lowest_hr_point,alias)
					return round(val)
				elif key == 'floors_climbed':
					val = self._get_average(
						todays_data.cum_floors_climbed,
						current_data.cum_floors_climbed,alias)
					return round(val)
			return None

		calculated_data = {
			'resting_hr':{d:None for d in self.duration_type},
			'hrr_time_to_99':{d:None for d in self.duration_type},
			'hrr_beats_lowered_in_first_min':{d:None for d in self.duration_type},
			'hrr_highest_hr_in_first_min':{d:None for d in self.duration_type},
			'hrr_lowest_hr_point':{d:None for d in self.duration_type},
			'floors_climbed':{d:None for d in self.duration_type}
		}
		summary_type = "other_stats_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def get_progress_report(self):
		SUMMARY_CALCULATOR_BINDING = self._get_summary_calculator_binding()
		DATA = {'summary':{}, "report_date":None}
		for summary in self.summary_type:
			DATA['summary'][summary] = SUMMARY_CALCULATOR_BINDING[summary](self.custom_daterange)
		if self.current_date:
			duration = self._get_duration_datetime(self.current_date)
			duration_dt = {}
			for dur in self.duration_type:
				if dur == 'today' or dur == 'yesterday':
					duration_dt[dur] = duration[dur].strftime("%Y-%m-%d")
				else:
					dt_str = (duration[dur] + timedelta(days=1)).strftime("%Y-%m-%d") +\
					" to " + duration['yesterday'].strftime("%Y-%m-%d")
					duration_dt[dur] = dt_str
			DATA['duration_date'] = duration_dt
			DATA['report_date'] = self.current_date.strftime("%Y-%m-%d")

		return DATA