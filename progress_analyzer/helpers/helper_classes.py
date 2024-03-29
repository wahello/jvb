from datetime import datetime, timedelta
from itertools import zip_longest
from decimal import Decimal, ROUND_HALF_UP
import copy
import json

from django.db.models import Q

from .cumulative_helper import _get_datewise_aa_data
from quicklook.calculations import garmin_calculation
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
	MetaCumulative
from progress_analyzer.helpers.cumulative_helper import\
	create_cum_raw_data,\
	_get_model_not_related_concrete_fields

class ToOverallHealthGradeCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(OverallHealthGradeCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToNonExerciseStepsCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(NonExerciseStepsCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToSleepPerNightCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(SleepPerNightCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToMovementConsistencyCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(MovementConsistencyCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToExerciseConsistencyCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(ExerciseConsistencyCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToNutritionCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(NutritionCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToExerciseStatsCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(ExerciseStatsCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToAlcoholCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(AlcoholCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToSickCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(SickCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToStressCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(StressCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToTravelCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(TravelCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToStandingCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(StandingCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToOtherStatsCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(OtherStatsCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToMetaCumulative(object):
	def __init__(self,raw_data):
		fields = _get_model_not_related_concrete_fields(MetaCumulative)
		for field in fields:
			setattr(self, field, raw_data[field])

class ToCumulativeSum(object):
	'''
	Creates a fake object which behaves like CumulativeSum object.
	Basically used for creating a fake current day CumulativeSum
	record to fit within current PA architecure and avoid special
	handling.

	We do not generate CumulativeSum record for current day until 
	next day because for current day data will change thoughout 
	day as soon as users sync their device.So to avoid multiple
	database write we defer it till next day and create PA report
	for previous day in batch.

	To compensate curent day's CumulativeSum we create a fake object
	for current day which behaves like a normal CumulativeSum object
	and works with current PA code normally without any special
	handling. 
	'''

	def __exclude_no_data_yet_hours(self, ql_obj):
		'''
		If there is any "No Data Yet" hour in the MCs the,
		make it 0 because this should not be taken into consideration
		while calculating "inactive hours" for current day
		'''
		mcs = ql_obj.steps_ql.movement_consistency
		if mcs:
			mcs = json.loads(mcs)
			if mcs.get('no_data_hours'):
				mcs['no_data_hours'] = 0
				ql_obj.steps_ql.movement_consistency = json.dumps(mcs)
		return ql_obj


	def __init__(self,user,ql_obj,ui_obj,aa_obj,cum_obj=None):
		'''
		user(:obj:`User`)
		ql_obj(:obj:`UserQuickLook`)
		ui_obj(:obj:`UserDailyInput`)
		aa_obj(dict): Contains Aerobic/Anaerobic data
		cum_obj(:obj:`CumulativeSum`,optional)
		'''

		if ql_obj:
			ql_obj = copy.deepcopy(ql_obj)
			ql_obj = self.__exclude_no_data_yet_hours(ql_obj)

		cum_raw_data = create_cum_raw_data(user,ql_obj,ui_obj,aa_obj,cum_obj)
		
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
		self.sick_cum = ToSickCumulative(
			cum_raw_data["sick_cum"]
		)
		self.stress_cum = ToStressCumulative(
			cum_raw_data["stress_cum"]
		)
		self.travel_cum = ToTravelCumulative(
			cum_raw_data["travel_cum"]
		)
		self.standing_cum = ToStandingCumulative(
			cum_raw_data["standing_cum"]
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
		# Possible PA summary types
		self.summary_type = ['overall_health','non_exercise','sleep','mc','ec',
		'nutrition','exercise','alcohol','sick','stress','travel','standing','other']

		# Possible fixed duration types for PA report
		self.duration_type = ['today','yesterday','week','month','year']
		self.current_date = self._str_to_dt(query_params.get('date',None))
		# Custom date range(s) for which report is to be created
		# expected format of the date is 'YYYY-MM-DD'
		self.custom_ranges = query_params.get('custom_ranges',None)

		year_denominator = 365
		if self.current_date:
			# Year starts from the day user have Cumulative sums
			# for example if user have Cumulative sum record from
			# Jan 20, 2019 then year start date would be this and 
			# number of days will be counted from here on. 
			self.year_start = self._get_first_from_year_start_date()
			yesterday = self.current_date - timedelta(days=1)
			if not self.year_start == yesterday:
				year_denominator = (yesterday - self.year_start).days + 1
			else:
				year_denominator = 0

		self.duration_denominator = {
			'today':1,'yesterday':1, 'week':7, "month":30, "year":year_denominator
		}

		if self.current_date:
			self.cumulative_datewise_data = {q.created_at.strftime("%Y-%m-%d"):q 
				for q in self._get_cum_queryset()}
			self.ql_datewise_data = {q.created_at.strftime("%Y-%m-%d"):q 
				for q in self._get_ql_queryset()}
			self.ui_datewise_data = {q.created_at.strftime("%Y-%m-%d"):q 
				for q in self._get_ui_queryset()}
			self.aa_datewise_data = _get_datewise_aa_data(user,
														  self.current_date,
														  self.current_date) 

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
				if not r[1] == r[0]:
					self.duration_denominator[str_range] = (r[1] - r[0]).days + 1
				else:
					self.duration_denominator[str_range] = 1
			self.custom_daterange = True


		summaries = query_params.get('summary',None)
		if summaries:
			# Remove all the summary types except for what
			# is requested
			summaries = [item.strip() for item in summaries.strip().split(',')]
			allowed = set(summaries)
			existing = set(self.summary_type)
			for s in existing-allowed:
				self.summary_type.pop(self.summary_type.index(s))

		duration = query_params.get('duration',None)
		# Remove all the duration types except for what
		# is requested
		if duration and self.current_date:
			duration = [item.strip() for item in duration.strip().split(',')]
			allowed = set(duration)
			existing = set(self.duration_type)
			for d in existing-allowed:
				self.duration_type.pop(self.duration_type.index(d))

		self.todays_cum_data = self._get_todays_cum_data()

	@property
	def todays_cum_data(self):
		return self.__todays_cum_data

	@todays_cum_data.setter
	def todays_cum_data(self,data):
		self.__todays_cum_data = data

	def _get_todays_cum_data(self):
		'''
		Create todays cumulative data by merging todays raw report 
		and yesterday cumulative sum (if available) and user inputs
		data
		'''
		todays_ql_data = self.ql_datewise_data.get(
				self.current_date.strftime("%Y-%m-%d"),None)
		todays_ui_data = self.ui_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		todays_aa_data = self.aa_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)

		todays_cum = None
		if todays_ql_data:
			if yesterday_data:
				todays_cum = ToCumulativeSum(
					self.user,
					todays_ql_data,
					todays_ui_data,
					todays_aa_data,
					yesterday_data
				)
			else:
				todays_cum = ToCumulativeSum(
					self.user,
					todays_ql_data,
					todays_ui_data,
					todays_aa_data
				)
		return todays_cum
			

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
			if mins < 59:
				# if minute is less than 59 then round it
				# otherwise don't because it'll be rounded to
				# 60 and look like 5:60 which is incorrect
				mins = round(mins)
			else:
				mins = int(mins)
			if mins < 10:
				mins = "{:02d}".format(mins) 
			return "{}:{}".format(hours,mins)
		return "00:00"

	def _min_to_min_sec(self,mins):
		if mins:
			seconds = mins * 60
			mins,seconds = divmod(seconds,60)
			mins = round(mins)
			if seconds < 59:
				seconds = round(seconds)
			else:
				seconds = int(seconds)
			if seconds < 10:
				seconds = "{:02d}".format(seconds)
			return "{}:{}".format(mins,seconds)
		return "00:00"

	def _get_average(self,stat1, stat2, demominator):
		if demominator:
			avg = (stat1 - stat2)/demominator
			return avg
		return 0

	def _get_average_for_duration(self, stat1, stat2, duration_type):
		if not stat1 == None and not stat2 == None:
			denominator = self.duration_denominator.get(duration_type)
			return self._get_average(stat1,stat2,denominator)
		return 0
	
	def _get_model_related_fields_names(self,model):
		related_fields_names = [f.name for f in model._meta.get_fields()
			if (f.one_to_many or f.one_to_one)
			and f.auto_created and not f.concrete]
		return related_fields_names

	def _get_first_from_year_start_date(self):
		'''
		Return the date of first cumulative sum record from the
		start of the year(Jan 1,inclusive).If there is no record
		then returns the default date Jan 1 of the current year. 
		'''
		year_start = datetime(self.current_date.year,1,1)
		year_end = year_start - timedelta(days=1)
		first_from_year_start = CumulativeSum.objects.filter(
			created_at__gte=year_end,
			user = self.user
		).order_by('created_at')[:1]

		try:
			qobj = first_from_year_start[0]
			return datetime(qobj.created_at.year,
					qobj.created_at.month,
					qobj.created_at.day) + timedelta(days=1)
		except IndexError:
			return year_start

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

	def _get_ui_queryset(self):
		"""
			Returns queryset of User Inputs for "today"
			according to current_date	  
		"""
		user = self.user
		filters = Q(created_at=self.current_date.date())
		related_fields = self._get_model_related_fields_names(UserDailyInput)
		ui_data_qs = UserDailyInput.objects.select_related(*related_fields).filter(
			filters, user = user
		)
		return ui_data_qs

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
			'year':(self.year_start - timedelta(days=1)).date()
		}
		return duration

	def _get_last_three_days_data(self,summary_type):
		'''
		Return the Cumulative data for specifed summary type and 
		cumulative 'meta' data for today, yesterday and day before
		yesterday (calculated from current date)

		Args:
			summary_type(string): Summary type for which cumulative data is
			required. Possible summary types are defined in self.summary_type

		Returns:
			dict: Return a dictionary whose value is a tuple. Tuple have
			following values in same order- 
				1) Cumulative data of particular summary type
				2) cumulative data for meta summary
		'''
		todays_data = None
		todays_meta_data = None
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		yesterday_meta_data = None
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_meta_data = None

		if self.todays_cum_data:
			todays_meta_data = self.todays_cum_data.__dict__.get("meta_cum")
			todays_data = self.todays_cum_data.__dict__.get(summary_type)

		if yesterday_data:
			# Because of select related, attribute names become "_attrname_cache"
			cached_summary_type = "_{}_cache".format(summary_type)
			yesterday_meta_data = yesterday_data.__dict__.get("_meta_cum_cache")
			yesterday_data = yesterday_data.__dict__.get(cached_summary_type)

		if day_before_yesterday_data:
			cached_summary_type = "_{}_cache".format(summary_type)
			day_before_yesterday_meta_data = day_before_yesterday_data.__dict__.get("_meta_cum_cache")
			day_before_yesterday_data = day_before_yesterday_data.__dict__.get(cached_summary_type)

		data = {
			"today":(todays_data,todays_meta_data),
			"yesterday":(yesterday_data,yesterday_meta_data),
			"day_before_yesterday":(
				day_before_yesterday_data,
				day_before_yesterday_meta_data
			)
		}
		return data

	def _generic_custom_range_calculator(self,key,alias,summary_type,custom_avg_calculator):
		'''
		Generates averages for provided summary type for custom ranges,
		similar to the _generic_summary_calculator. 

		Args:
			key(str): Key for which average need to be calculates. This
				corresponds to the keys in 'calculated_data' dict.
			alias(str): Duration type for which average need to be
				calculated. In this case it will be 'custom_range'
			summary_type(string): Summary type for which averages to be 
				calculated. This summary type is the relative name of the
				model which stores the cumulative data of any summary type
				mentioned in self.summary_type. For example, model of
				summary type "overall_health" have relative name
				"overall_health_grade_cum"
			custom_avg_calculator (function): A function which have average
				logic for every field in given summary type.
		'''
		custom_average_data = {}

		for r in self.custom_ranges:
			#for select related
			to_select_related = lambda x : "_{}_cache".format(x)

			day_before_from_date = r[0] - timedelta(days=1)
			todays_ui_data = self.ui_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
			todays_aa_data = self.aa_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		
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
					range_end_data = ToCumulativeSum(
						self.user,range_end_data,todays_ui_data,todays_aa_data,yesterday_cum_data
					)
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
		'''
		Generates averages for provided summary type all ranges
		(today, yesterday etc) except custom range

		Args:
			calculated_data_dict (dict):  Dictionary where average for
				any field (eg overall_health_gpa) in given summary type
				(eg overall_health_grade_cum) is calculated and stored
				by mutating this dictionary

			avg_calculator (function): A function which have average logic
				for every field in given summary type.

			summary_type(string): Summary type for which averages to be 
				calculated. This summary type is the relative name of the
				model which stores the cumulative data of any summary type
				mentioned in self.summary_type. For example, model of
				summary type "overall_health" have relative name
				"overall_health_grade_cum" 
		'''
		last_three_days_data = self._get_last_three_days_data(summary_type)
		todays_data,todays_meta_data = last_three_days_data["today"]
		yesterday_data,yesterday_meta_data = last_three_days_data["yesterday"]
		day_before_yesterday_data,day_before_yesterday_meta_data = last_three_days_data[
			"day_before_yesterday"
		]

		for key in calculated_data_dict.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				if alias in self.duration_type:
					current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
					current_meta_data = None
					if current_data:
						cached_summary_type = "_{}_cache".format(summary_type)
						current_meta_data = current_data.__dict__.get("_meta_cum_cache")
						current_data = current_data.__dict__.get(cached_summary_type)
					if alias == 'today': 
						if yesterday_data:
							calculated_data_dict[key][alias] = avg_calculator(key,alias,todays_data,
								yesterday_data,todays_meta_data,yesterday_meta_data)
						continue
					elif alias == 'yesterday': 
						if day_before_yesterday_data:
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
			"sick":self._cal_sick_summary,
			"stress":self._cal_stress_summary,
			"travel":self._cal_travel_summary,
			"standing":self._cal_standing_summary,
			"other":self._cal_other_summary
		}
		return SUMMARY_CALCULATOR_BINDING

	def _create_grade_keys(self, prefix, grades=[]):
		if not grades:
			grades = ['a','b','c','d','f']
		return [prefix+'_'+grade for grade in grades]

	def _create_prcnt_grade_keys(self, prefix, grades=[]):
		if not grades:
			grades = ['a','b','c','d','f']
		return ['prcnt_'+prefix+'_'+grade for grade in grades]

	def _create_steps_milestone_keys(self, prefix, milestones=[]):
		if not milestones:
			milestones = ['10k','20k','25k','30k','40k']
		return [prefix+'_'+milestone for milestone in milestones]

	def _create_prcnt_steps_milestone_keys(self, prefix, milestones=[]):
		if not milestones:
			milestones = ['10k','20k','25k','30k','40k']
		return ['prcnt_'+prefix+'_'+milestone for milestone in milestones]

	def _cal_grade_days_over_period(self, today_catg_data, current_catg_data,
									key, days_over_period=None):
		'''
		Calculate the grade bifurcation for given category for example,
		number of days got A for overall health gpa (cum_ohg_days_got_a)
		etc.
		'''
		days_till_today = today_catg_data.__dict__[key]
		days_till_current = current_catg_data.__dict__[key]
		val = days_till_today - days_till_current
		if val and days_over_period is not None and not days_over_period:
			return 0
		return val

	def _cal_prcnt_grade_over_period(self, today_catg_data,current_catg_data,
										  key,duration_type, days_over_period=None):
		'''
		Calculate the percentage for grade bifurcation for given
		category for example, percentage number of days got A for
		overall health gpa (prcnt_ohg_days_got_a) for given duration
		etc.

		Args:
			duration_type(string): today, yesterday, week, month, year etc.
			days_over_period (int): Manual Number of days over the period
				default to None
		'''
		denominator = self.duration_denominator.get(duration_type)
		if days_over_period:
			denominator = days_over_period
		# create grade key from percentage key
		# example - prcnt_ohg_days_got_a -> cum_ohg_days_got_a
		grade_key = key.replace("prcnt","cum")
		days_till_today = today_catg_data.__dict__[grade_key]
		days_till_current = current_catg_data.__dict__[grade_key]
		val = days_till_today - days_till_current
		prcnt = 0
		if denominator:
			prcnt = (val/denominator)*100
			prcnt = int(Decimal(prcnt).quantize(0,ROUND_HALF_UP))
		return prcnt

	def _cal_steps_milestone_days_over_period(self, today_catg_data, current_catg_data, key):
		'''
		Calculate the steps bifurcation for non-exercise or total steps.
		for example, number of days got total steps over 10,000
		(cum_ts_days_above_10k) etc.
		'''
		days_till_today = today_catg_data.__dict__[key]
		days_till_current = current_catg_data.__dict__[key]
		val = days_till_today - days_till_current
		return val

	def _cal_prcnt_steps_milestone_over_period(self, today_catg_data, current_catg_data,
											   key, duration_type):
		'''
		Calculate the percentage for steps bifurcation for total or
		non-exercise steps for example, percentage number of days got
		steps over 10,000 (prcnt_ts_days_above_10k)for given duration.

		Args:
			duration_type(string): today, yesterday, week, month, year etc.
		'''
		denominator = self.duration_denominator.get(duration_type)
		grade_key = key.replace("prcnt","cum")
		days_till_today = today_catg_data.__dict__[grade_key]
		days_till_current = current_catg_data.__dict__[grade_key]
		val = days_till_today - days_till_current
		prcnt = 0
		if denominator:
			prcnt = (val/denominator)*100
			prcnt = int(Decimal(prcnt).quantize(0,ROUND_HALF_UP))
		return prcnt

	def _cal_overall_health_summary(self,custom_daterange = False):
		grades_bifurcation_keys = self._create_grade_keys('cum_days_ohg_got')
		grades_prcnt_bifurcation_keys = self._create_prcnt_grade_keys('days_ohg_got')

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='total_gpa_point':
					val = self._get_average_for_duration(
						todays_data.cum_total_gpa_point,
						current_data.cum_total_gpa_point,alias
					)
					return round(val,2)

				elif key == 'overall_health_gpa':
					val = self._get_average_for_duration(
						todays_data.cum_overall_health_gpa_point,
						current_data.cum_overall_health_gpa_point,alias
					)
					return round(val,2)

				elif key == 'overall_health_gpa_grade':
					return garmin_calculation.cal_overall_grade(
						self._get_average_for_duration(
							todays_data.cum_overall_health_gpa_point,
							current_data.cum_overall_health_gpa_point,alias
						)
					)[0]

				elif key in grades_bifurcation_keys:
					return self._cal_grade_days_over_period(todays_data,
															current_data,
															key)
				elif key in grades_prcnt_bifurcation_keys:
					return self._cal_prcnt_grade_over_period(todays_data,
																  current_data,
																  key, alias)
			return None

		calculated_data = {
			'total_gpa_point':{d:None for d in self.duration_type},
			'overall_health_gpa':{d:None for d in self.duration_type},
			'overall_health_gpa_grade':{d:None for d in self.duration_type}
		}
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_prcnt_bifurcation_keys})

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
		grades_bifurcation_keys = self._create_grade_keys('cum_days_nes_got')
		grades_bifurcation_keys += self._create_grade_keys('cum_days_ts_got')
		grades_prcnt_bifurcation_keys = self._create_prcnt_grade_keys('days_ts_got')
		grades_prcnt_bifurcation_keys += self._create_prcnt_grade_keys('days_nes_got')
		milestone_bifurcation_keys = self._create_steps_milestone_keys('cum_days_nes_above')
		milestone_bifurcation_keys += self._create_steps_milestone_keys('cum_days_ts_above')
		milestone_prcnt_bifurcation_keys = self._create_prcnt_steps_milestone_keys(
			'days_nes_above')
		milestone_prcnt_bifurcation_keys += self._create_prcnt_steps_milestone_keys(
			'days_ts_above')

		def _calculate(key, alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='non_exercise_steps':
					val =  self._get_average_for_duration(
						todays_data.cum_non_exercise_steps,
						current_data.cum_non_exercise_steps,alias)
					return int(Decimal(val).quantize(0,ROUND_HALF_UP))

				elif key == 'non_exericse_steps_gpa':
					val = self._get_average_for_duration(
						todays_data.cum_non_exercise_steps_gpa,
						current_data.cum_non_exercise_steps_gpa,alias)
					return round(val,2)

				elif key == 'total_steps':
					val = self._get_average_for_duration(
						todays_data.cum_total_steps,
						current_data.cum_total_steps,alias)
					return int(Decimal(val).quantize(0,ROUND_HALF_UP))

				elif key == 'movement_non_exercise_step_grade':
					return garmin_calculation.cal_non_exercise_step_grade(
						self._get_average_for_duration(
							todays_data.cum_non_exercise_steps,
							current_data.cum_non_exercise_steps,alias
						)
					)[0]

				elif key == 'exercise_steps':
					total_steps = self._get_average_for_duration(
						todays_data.cum_total_steps,
						current_data.cum_total_steps,alias)
					non_exec_steps = self._get_average_for_duration(
						todays_data.cum_non_exercise_steps,
						current_data.cum_non_exercise_steps,alias)
					exercise_steps = total_steps - non_exec_steps
					return int(Decimal(exercise_steps).quantize(0,ROUND_HALF_UP))

				elif key in grades_bifurcation_keys:
					return self._cal_grade_days_over_period(todays_data,
															current_data,
															key)
				elif key in grades_prcnt_bifurcation_keys:
					return self._cal_prcnt_grade_over_period(todays_data,
															 current_data,
															 key, alias)
				elif key in milestone_bifurcation_keys:
					return self._cal_steps_milestone_days_over_period(todays_data,
															current_data,
															key)
				elif key in milestone_prcnt_bifurcation_keys:
					return self._cal_prcnt_steps_milestone_over_period(todays_data,
															 current_data,
															 key, alias)

			return None

		calculated_data = {
			'non_exercise_steps':{d:None for d in self.duration_type},
			'movement_non_exercise_step_grade':{d:None for d in self.duration_type},
			'non_exericse_steps_gpa':{d:None for d in self.duration_type},
			'total_steps':{d:None for d in self.duration_type},
			'exercise_steps':{d:None for d in self.duration_type}
		}
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_prcnt_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in milestone_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in milestone_prcnt_bifurcation_keys})

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
		grades_bifurcation_keys = self._create_grade_keys('cum_days_sleep_got')
		grades_prcnt_bifurcation_keys = self._create_prcnt_grade_keys('days_sleep_got')

		def _get_sleep_grade_from_point_for_ranges(point):
			if point < 1:
				return 'F'
			elif point >= 1 and point < 2:
				return 'D'
			elif point >= 2 and point < 2.8:
				return 'C'
			elif point >= 2.8 and point < 3.3:
				return 'B'
			else:
				return 'A'

		def _cal_custom_average(stat1, stat2,days):
			if not stat1 == None and not stat2 == None and days:
				avg = (stat1 - stat2)/days
				return avg
			return 0

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key == 'total_sleep_in_hours_min':
					if todays_meta_data and current_meta_data:
						sleep_days = (
							todays_meta_data.cum_sleep_reported_days_count - 
							current_meta_data.cum_sleep_reported_days_count
						)
						if sleep_days:
							val = _cal_custom_average(
								todays_data.cum_total_sleep_in_hours,
								current_data.cum_total_sleep_in_hours,sleep_days)
							return self._hours_to_hours_min(val)
						else:
							return "00:00"

				if key == 'deep_sleep_in_hours_min':
					if todays_meta_data and current_meta_data:
						sleep_days = (
							todays_meta_data.cum_sleep_reported_days_count - 
							current_meta_data.cum_sleep_reported_days_count
						)
						if sleep_days:
							val = _cal_custom_average(
								todays_data.cum_deep_sleep_in_hours,
								current_data.cum_deep_sleep_in_hours,sleep_days)
							return self._hours_to_hours_min(val)
						else:
							return "00:00"

				if key == 'awake_duration_in_hours_min':
					if todays_meta_data and current_meta_data:
						sleep_days = (
							todays_meta_data.cum_sleep_reported_days_count - 
							current_meta_data.cum_sleep_reported_days_count
						)
						if sleep_days:
							val = _cal_custom_average(
								todays_data.cum_awake_duration_in_hours,
								current_data.cum_awake_duration_in_hours,sleep_days)
							return self._hours_to_hours_min(val)
						else:
							return "00:00"

				elif key == 'overall_sleep_gpa':
					if todays_meta_data and current_meta_data:
						sleep_days = (
							todays_meta_data.cum_sleep_reported_days_count - 
							current_meta_data.cum_sleep_reported_days_count
						)
						if sleep_days:
							val = _cal_custom_average(
								todays_data.cum_overall_sleep_gpa,
								current_data.cum_overall_sleep_gpa,sleep_days)
							return round(val,2)
						else:
							return 0

				elif key == 'average_sleep_grade':
					if todays_meta_data and current_meta_data:
						sleep_days = (
							todays_meta_data.cum_sleep_reported_days_count - 
							current_meta_data.cum_sleep_reported_days_count
						)
						if sleep_days:
							avg_sleep_gpa = round(_cal_custom_average(
								todays_data.cum_overall_sleep_gpa,
								current_data.cum_overall_sleep_gpa,sleep_days),2)
							if alias == 'today' or alias == 'yesterday':
								return garmin_calculation._get_sleep_grade_from_point(avg_sleep_gpa)
							else:
								return _get_sleep_grade_from_point_for_ranges(avg_sleep_gpa)
						else:
							return 'F'

				elif key == 'num_days_sleep_aid_taken_in_period':
					if todays_meta_data and current_meta_data:
						val = 0
						if ((todays_data.cum_days_sleep_aid_taken is not None) and 
							(current_data.cum_days_sleep_aid_taken is not None)):
							val = todays_data.cum_days_sleep_aid_taken - current_data.cum_days_sleep_aid_taken
						return val

				elif key == 'prcnt_days_sleep_aid_taken_in_period':
					if todays_meta_data and current_meta_data:
						val = 0
						if((todays_data.cum_days_sleep_aid_taken is not None) and 
							(current_data.cum_days_sleep_aid_taken is not None)):
							val = todays_data.cum_days_sleep_aid_taken - current_data.cum_days_sleep_aid_taken
						prcnt = 0
						if val:
							# if duration denominator is greator than 0
							if self.duration_denominator[alias]:
								prcnt = (val / self.duration_denominator[alias])*100
							prcnt = int(Decimal(prcnt).quantize(0,ROUND_HALF_UP))
						return prcnt

				elif key in grades_bifurcation_keys:
					if todays_meta_data and current_meta_data:
						sleep_days = (
							todays_meta_data.cum_sleep_reported_days_count - 
							current_meta_data.cum_sleep_reported_days_count
						)
						return self._cal_grade_days_over_period(todays_data,current_data,
																key, sleep_days)
				elif key in grades_prcnt_bifurcation_keys:
					if todays_meta_data and current_meta_data:
						sleep_days = (
							todays_meta_data.cum_sleep_reported_days_count - 
							current_meta_data.cum_sleep_reported_days_count
						)
						return self._cal_prcnt_grade_over_period(todays_data,current_data,
																 key, alias, sleep_days)

			return None

		calculated_data = {
			'total_sleep_in_hours_min':{d:None for d in self.duration_type},
			'deep_sleep_in_hours_min':{d:None for d in self.duration_type},
			'awake_duration_in_hours_min':{d:None for d in self.duration_type},
			'average_sleep_grade':{d:None for d in self.duration_type},
			'num_days_sleep_aid_taken_in_period':{d:None for d in self.duration_type},
			'prcnt_days_sleep_aid_taken_in_period':{d:None for d in self.duration_type},
			'overall_sleep_gpa':{d:None for d in self.duration_type},
		}
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_prcnt_bifurcation_keys})

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
		grades_bifurcation_keys = self._create_grade_keys('cum_days_mcs_got')
		grades_bifurcation_keys += self._create_grade_keys('cum_days_total_act_min_got')
		grades_bifurcation_keys += self._create_grade_keys('cum_days_act_min_no_sleep_exec_got')
		grades_prcnt_bifurcation_keys = self._create_prcnt_grade_keys('days_mcs_got')
		grades_prcnt_bifurcation_keys += self._create_prcnt_grade_keys('days_total_act_min_got')
		grades_prcnt_bifurcation_keys += self._create_prcnt_grade_keys('days_act_min_no_sleep_exec_got')

		def _cal_custom_average(stat1, stat2,days):
			if not stat1 == None and not stat2 == None and days:
				avg = (stat1 - stat2)/days
				return avg
			return 0

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='movement_consistency_score':
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count - 
							current_meta_data.cum_mc_recorded_days_count
						)

						val = _cal_custom_average(
							todays_data.cum_movement_consistency_score,
							current_data.cum_movement_consistency_score,
							mc_days)

						if mc_days:
							return round(val,2)
						else:
							return "Not Reported"
					return None

				elif key == 'movement_consistency_gpa':
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count - 
							current_meta_data.cum_mc_recorded_days_count
						)
						val = _cal_custom_average(
							todays_data.cum_movement_consistency_gpa,
							current_data.cum_movement_consistency_gpa,
							mc_days)

						if mc_days:
							return round(val,2)
						else:
							return "Not Reported"
					return None

				elif key == 'movement_consistency_grade':
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count - 
							current_meta_data.cum_mc_recorded_days_count
						)
						grade =  garmin_calculation.cal_movement_consistency_grade(
							_cal_custom_average(
								todays_data.cum_movement_consistency_score,
								current_data.cum_movement_consistency_score,
								mc_days
							)
						)
						if mc_days:
							return grade
						else:
							return "Not Reported"
					return None
				elif key == "total_active_minutes":
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count - 
							current_meta_data.cum_mc_recorded_days_count
						)
						value = round(_cal_custom_average(
									todays_data.cum_total_active_min,
									current_data.cum_total_active_min,
									mc_days))
						if mc_days:
							return value
						else:
							return "Not Reported"
							
				elif key == "sleep_active_minutes":
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count - 
							current_meta_data.cum_mc_recorded_days_count
						)
						value = round(_cal_custom_average(
									todays_data.cum_sleep_active_min,
									current_data.cum_sleep_active_min,
									mc_days))
						if mc_days:
							return value
						else:
							return "Not Reported"

				elif key == "exercise_active_minutes":
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count - 
							current_meta_data.cum_mc_recorded_days_count
						)
						value = round(_cal_custom_average(
									todays_data.cum_exercise_active_min,
									current_data.cum_exercise_active_min,
									mc_days))
						if mc_days:
							return value
						else:
							return "Not Reported"
				
				elif key == "active_minutes_without_sleep":
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count - 
							current_meta_data.cum_mc_recorded_days_count
						)
						act_min_without_sleep_today = (
							todays_data.cum_total_active_min
							- todays_data.cum_sleep_active_min)

						act_min_without_sleep_currently = (
							current_data.cum_total_active_min
							- current_data.cum_sleep_active_min)

						value = round(_cal_custom_average(
									act_min_without_sleep_today,
									act_min_without_sleep_currently,
									mc_days))
						if mc_days:
							return value
						else:
							return "Not Reported"
				elif key == "active_minutes_without_sleep_exercise":
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count - 
							current_meta_data.cum_mc_recorded_days_count
						)
						act_min_without_sleep_exercise_today = (
							todays_data.cum_total_active_min
							- todays_data.cum_sleep_active_min
							- todays_data.cum_exercise_active_min)

						act_min_without_sleep_exercise_currently = (
							current_data.cum_total_active_min
							- current_data.cum_sleep_active_min
							- current_data.cum_exercise_active_min)

						value = round(_cal_custom_average(
									act_min_without_sleep_exercise_today,
									act_min_without_sleep_exercise_currently,
									mc_days))
						if mc_days:
							return value
						else:
							return "Not Reported"
							
				elif key == "total_active_minutes_prcnt":
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count - 
							current_meta_data.cum_mc_recorded_days_count
						)
						value = round(_cal_custom_average(
									todays_data.cum_total_active_min,
									current_data.cum_total_active_min,
									mc_days))
						active_prcnt = round((value/1440)*100)
						if mc_days:
							return active_prcnt
						else:
							return "Not Reported"

				elif key == "active_minutes_without_sleep_prcnt":
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count 
							 - current_meta_data.cum_mc_recorded_days_count
						)
						act_min_without_sleep_today = (
							todays_data.cum_total_active_min
							- todays_data.cum_sleep_active_min)

						act_min_without_sleep_currently = (
							current_data.cum_total_active_min
							- current_data.cum_sleep_active_min)
 
						avg_sleep_mins = round(_cal_custom_average(
								todays_data.cum_sleep_hours,
								current_data.cum_sleep_hours,
								mc_days
							))

						total_mins_without_sleep = 1440 - (avg_sleep_mins)

						value = round(_cal_custom_average(
									act_min_without_sleep_today,
									act_min_without_sleep_currently,
									mc_days))
						try:
							active_prcnt = round((
								value/total_mins_without_sleep)*100)
						except ZeroDivisionError:
							active_prcnt = 0
							
						if mc_days:
							return active_prcnt
						else:
							return "Not Reported"

				elif key == "active_minutes_without_sleep_exercise_prcnt":
					if todays_meta_data and current_meta_data:
						mc_days = (
							todays_meta_data.cum_mc_recorded_days_count
							 - current_meta_data.cum_mc_recorded_days_count
						)
						act_min_without_sleep_exercise_today = (
							todays_data.cum_total_active_min
							- todays_data.cum_sleep_active_min
							- todays_data.cum_exercise_active_min)

						act_min_without_sleep_exercise_currently = (
							current_data.cum_total_active_min
							- current_data.cum_sleep_active_min
							- current_data.cum_exercise_active_min)

						avg_sleep_mins = round(_cal_custom_average(
								todays_data.cum_sleep_hours,
								current_data.cum_sleep_hours,
								mc_days
							))

						avg_exercise_mins = round(_cal_custom_average(
								todays_data.cum_exercise_hours,
								current_data.cum_exercise_hours,
								mc_days
							))

						total_mins_without_sleep_exercise = (1440 
							- avg_sleep_mins
							- avg_exercise_mins)


						value = round(_cal_custom_average(
									act_min_without_sleep_exercise_today,
									act_min_without_sleep_exercise_currently,
									mc_days))
						try:
							active_prcnt = round(
								(value/total_mins_without_sleep_exercise)*100)
						except ZeroDivisionError:
							active_prcnt = 0

						if mc_days:
							return active_prcnt
						else:
							return "Not Reported"

				elif key in grades_bifurcation_keys:
					mc_days = todays_meta_data.cum_mc_recorded_days_count\
							  - current_meta_data.cum_mc_recorded_days_count
					return self._cal_grade_days_over_period(todays_data,current_data,
															key, mc_days)
				elif key in grades_prcnt_bifurcation_keys:
					if todays_meta_data and current_meta_data:
						mc_days = todays_meta_data.cum_mc_recorded_days_count\
							  	  - current_meta_data.cum_mc_recorded_days_count
						return self._cal_prcnt_grade_over_period(todays_data,current_data,
															 	 key, alias, mc_days)

			return None

		calculated_data = {
			'movement_consistency_score':{d:None for d in self.duration_type},
			'movement_consistency_grade':{d:None for d in self.duration_type},
			'movement_consistency_gpa':{d:None for d in self.duration_type},
			'total_active_minutes':{d:None for d in self.duration_type},
			'sleep_active_minutes':{d:None for d in self.duration_type},
			'exercise_active_minutes':{d:None for d in self.duration_type},
			'total_active_minutes_prcnt':{d:None for d in self.duration_type},
			'active_minutes_without_sleep':{d:None for d in self.duration_type},
			'active_minutes_without_sleep_prcnt':{d:None for d in self.duration_type},
			'active_minutes_without_sleep_exercise':{d:None for d in self.duration_type},
			'active_minutes_without_sleep_exercise_prcnt':{d:None for d in self.duration_type},
		}
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_prcnt_bifurcation_keys})

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
		grades_bifurcation_keys = self._create_grade_keys('cum_days_ec_got')
		grades_prcnt_bifurcation_keys = self._create_prcnt_grade_keys('days_ec_got')

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='avg_no_of_days_exercises_per_week':
					val = self._get_average_for_duration(
						todays_data.cum_avg_exercise_day,
						current_data.cum_avg_exercise_day,alias)
					return round(val,2)
				elif key == 'exercise_consistency_gpa':
					val = self._get_average_for_duration(
						todays_data.cum_exercise_consistency_gpa,
						current_data.cum_exercise_consistency_gpa,alias)
					return round(val,2)

				elif key == 'exercise_consistency_grade':
					return garmin_calculation.cal_exercise_consistency_grade(
						self._get_average_for_duration(
							todays_data.cum_avg_exercise_day,
							current_data.cum_avg_exercise_day,alias
						)
					)[0]

				elif key in grades_bifurcation_keys:
					return self._cal_grade_days_over_period(todays_data,
															current_data,
															key)
				elif key in grades_prcnt_bifurcation_keys:
					return self._cal_prcnt_grade_over_period(todays_data,
															 current_data,
															 key, alias)
			return None

		calculated_data = {
			'avg_no_of_days_exercises_per_week':{d:None for d in self.duration_type},
			'exercise_consistency_grade':{d:None for d in self.duration_type},
			'exercise_consistency_gpa':{d:None for d in self.duration_type},
		}
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_prcnt_bifurcation_keys})

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
		grades_bifurcation_keys = self._create_grade_keys('cum_days_ufood_got')
		grades_prcnt_bifurcation_keys = self._create_prcnt_grade_keys('days_ufood_got')

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='prcnt_unprocessed_volume_of_food':
					val = self._get_average_for_duration(
						todays_data.cum_prcnt_unprocessed_food_consumed,
						current_data.cum_prcnt_unprocessed_food_consumed,alias)
					return int(Decimal(val).quantize(0,ROUND_HALF_UP))
				elif key == 'prcnt_unprocessed_food_gpa':
					val = self._get_average_for_duration(
						todays_data.cum_prcnt_unprocessed_food_consumed_gpa,
						current_data.cum_prcnt_unprocessed_food_consumed_gpa,alias)
					return round(val,2)
				elif key == 'prcnt_unprocessed_food_grade':
					return garmin_calculation.cal_unprocessed_food_grade(
						self._get_average_for_duration(
							todays_data.cum_prcnt_unprocessed_food_consumed,
							current_data.cum_prcnt_unprocessed_food_consumed,alias
						)
					)[0]

				elif key in grades_bifurcation_keys:
					return self._cal_grade_days_over_period(todays_data,
															current_data,
															key)
				elif key in grades_prcnt_bifurcation_keys:
					return self._cal_prcnt_grade_over_period(todays_data,
															 current_data,
															 key, alias)
			return None

		calculated_data = {
			'prcnt_unprocessed_volume_of_food':{d:None for d in self.duration_type},
			'prcnt_unprocessed_food_grade':{d:None for d in self.duration_type},
			'prcnt_unprocessed_food_gpa':{d:None for d in self.duration_type},
		}
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_prcnt_bifurcation_keys})

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
		grades_bifurcation_keys = self._create_grade_keys('cum_days_workout_dur_got')
		grades_prcnt_bifurcation_keys = self._create_prcnt_grade_keys('days_workout_dur_got')

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

				elif key == 'total_workout_duration_over_range':
					if todays_meta_data and current_meta_data:
						total_duration_over_period = todays_data.cum_workout_duration_in_hours\
							- current_data.cum_workout_duration_in_hours
						return self._hours_to_hours_min(total_duration_over_period)
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
						return int(Decimal(val).quantize(0,ROUND_HALF_UP))

				elif key == 'avg_non_strength_exercise_heart_rate':
					if todays_meta_data and current_meta_data:
						avg_exercise_hr_days = (todays_meta_data.cum_avg_exercise_hr_days_count - 
							current_meta_data.cum_avg_exercise_hr_days_count)
						val = _cal_avg_exercise_hr_average(
							todays_data.cum_avg_non_strength_exercise_hr,
							current_data.cum_avg_non_strength_exercise_hr,
							avg_exercise_hr_days
						)
						return int(Decimal(val).quantize(0,ROUND_HALF_UP))

				elif key == 'total_non_strength_activities':
					total_exercise = todays_data.cum_total_exercise_activities\
						  - current_data.cum_total_exercise_activities
					total_strength = todays_data.cum_total_strength_activities\
						  - current_data.cum_total_strength_activities
					return total_exercise - total_strength

				elif key == 'total_strength_activities':
					val = todays_data.cum_total_strength_activities\
						  - current_data.cum_total_strength_activities
					return val

				elif key == 'vo2_max':
					if todays_meta_data and current_meta_data:
						vo2max_days = (todays_meta_data.cum_vo2_max_days_count - 
							current_meta_data.cum_vo2_max_days_count)
						val = _cal_vo2max_average(
							todays_data.cum_vo2_max,
							current_data.cum_vo2_max,
							vo2max_days
						)
						return int(Decimal(val).quantize(0,ROUND_HALF_UP))
					return None

				elif key == 'hr_aerobic_duration_hour_min':
					if todays_meta_data and current_meta_data:
						val = todays_data.cum_hr_aerobic_duration_hours\
							  - current_data.cum_hr_aerobic_duration_hours
						return self._hours_to_hours_min(val)
					return None

				elif key == 'prcnt_aerobic_duration':
					if todays_meta_data and current_meta_data:
						# This stores workout duration per day from A/A chart 1
						# For some reason we were storing weekly workout duration
						# earlier but later we changed it. So please don't get
						# confused with the name.
						total_workout_duration = todays_data.cum_weekly_workout_duration_in_hours\
												 - current_data.cum_weekly_workout_duration_in_hours
						total_aerobic_duration = todays_data.cum_hr_aerobic_duration_hours\
												 - current_data.cum_hr_aerobic_duration_hours
						if total_workout_duration:
							val = (total_aerobic_duration/total_workout_duration) * 100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
					return None

				elif key == 'hr_anaerobic_duration_hour_min':
					if todays_meta_data and current_meta_data:
						val = todays_data.cum_hr_anaerobic_duration_hours\
							  - current_data.cum_hr_anaerobic_duration_hours
						return self._hours_to_hours_min(val)
					return None

				elif key == 'prcnt_anaerobic_duration':
					if todays_meta_data and current_meta_data:
						total_workout_duration = todays_data.cum_weekly_workout_duration_in_hours\
												 - current_data.cum_weekly_workout_duration_in_hours
						total_anaerobic_duration = todays_data.cum_hr_anaerobic_duration_hours\
												 - current_data.cum_hr_anaerobic_duration_hours
							
						if total_workout_duration:
							val = (total_anaerobic_duration/total_workout_duration) * 100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
					return None

				elif key == 'hr_below_aerobic_duration_hour_min':
					if todays_meta_data and current_meta_data:
						val = todays_data.cum_hr_below_aerobic_duration_hours\
							 - current_data.cum_hr_below_aerobic_duration_hours
						return self._hours_to_hours_min(val)
					return None

				elif key == 'prcnt_below_aerobic_duration':
					if todays_meta_data and current_meta_data:
						total_workout_duration = todays_data.cum_weekly_workout_duration_in_hours\
												 - current_data.cum_weekly_workout_duration_in_hours
						total_below_aerobic_duration = todays_data.cum_hr_below_aerobic_duration_hours\
							 						   - current_data.cum_hr_below_aerobic_duration_hours
						if total_workout_duration:
							val = (total_below_aerobic_duration/total_workout_duration) * 100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
					return None

				elif key == 'hr_not_recorded_duration_hour_min':
					if todays_meta_data and current_meta_data:
						val = todays_data.cum_hr_not_recorded_duration_hours\
							  - current_data.cum_hr_not_recorded_duration_hours
						return self._hours_to_hours_min(val)
					return None

				elif key == 'prcnt_hr_not_recorded_duration':
					if todays_meta_data and current_meta_data:
						total_workout_duration = todays_data.cum_weekly_workout_duration_in_hours\
												 - current_data.cum_weekly_workout_duration_in_hours
						total_hr_not_recorded_duration = todays_data.cum_hr_not_recorded_duration_hours\
							 							 - current_data.cum_hr_not_recorded_duration_hours
						if total_workout_duration:
							val = (total_hr_not_recorded_duration/total_workout_duration) * 100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
					return None

				elif key in grades_bifurcation_keys:
					if todays_meta_data and current_meta_data:
						workout_days = (todays_meta_data.cum_workout_days_count - 
							current_meta_data.cum_workout_days_count)
						return self._cal_grade_days_over_period(todays_data,current_data,
																key,workout_days)
				elif key in grades_prcnt_bifurcation_keys:
					if todays_meta_data and current_meta_data:
						workout_days = (todays_meta_data.cum_workout_days_count - 
							current_meta_data.cum_workout_days_count)
						return self._cal_prcnt_grade_over_period(todays_data,current_data,
															 	 key, alias, workout_days)

			return None

		calculated_data = {
			'workout_duration_hours_min':{d:None for d in self.duration_type},
			'workout_effort_level':{d:None for d in self.duration_type},
			'avg_exercise_heart_rate':{d:None for d in self.duration_type},
			'avg_non_strength_exercise_heart_rate':{d:None for d in self.duration_type},
			'total_non_strength_activities':{d:None for d in self.duration_type},
			'total_strength_activities':{d:None for d in self.duration_type},
			'vo2_max':{d:None for d in self.duration_type},
			'total_workout_duration_over_range':{d:None for d in self.duration_type},
			'hr_aerobic_duration_hour_min':{d:None for d in self.duration_type},
			'prcnt_aerobic_duration':{d:None for d in self.duration_type},
			'hr_anaerobic_duration_hour_min':{d:None for d in self.duration_type},
			'prcnt_anaerobic_duration':{d:None for d in self.duration_type},
			'hr_below_aerobic_duration_hour_min':{d:None for d in self.duration_type},
			'prcnt_below_aerobic_duration':{d:None for d in self.duration_type},
			'hr_not_recorded_duration_hour_min':{d:None for d in self.duration_type},
			'prcnt_hr_not_recorded_duration':{d:None for d in self.duration_type}
		}
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_prcnt_bifurcation_keys})

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
		grades_bifurcation_keys = self._create_grade_keys('cum_days_alcohol_week_got')
		grades_prcnt_bifurcation_keys = self._create_prcnt_grade_keys('days_alcohol_week_got')

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='avg_drink_per_day':
					if todays_meta_data and current_meta_data:
						alcohol_reported_days = (todays_meta_data.cum_reported_alcohol_days_count -
							current_meta_data.cum_reported_alcohol_days_count)

						if alcohol_reported_days: 
							val = self._get_average_for_duration(
								todays_data.cum_alcohol_drink_consumed,
								current_data.cum_alcohol_drink_consumed,alias)
							return round(val,2)
						else:
							return 'Not Reported'

				elif key =='avg_drink_per_week':
					if todays_meta_data and current_meta_data:
						alcohol_reported_days = (todays_meta_data.cum_reported_alcohol_days_count -
							current_meta_data.cum_reported_alcohol_days_count)

						if alcohol_reported_days: 
							val = self._get_average_for_duration(
								todays_data.cum_average_drink_per_week,
								current_data.cum_average_drink_per_week,alias)
							return round(val,2)
						else:
							return 'Not Reported'

				elif key == 'alcoholic_drinks_per_week_gpa':
					val = self._get_average_for_duration(
						todays_data.cum_alcohol_drink_per_week_gpa,
						current_data.cum_alcohol_drink_per_week_gpa,alias)
					return int(Decimal(val).quantize(0,ROUND_HALF_UP))
				elif key == 'alcoholic_drinks_per_week_grade':
					return garmin_calculation.cal_alcohol_drink_grade(
						self._get_average_for_duration(
							todays_data.cum_average_drink_per_week,
							current_data.cum_average_drink_per_week,alias
						),self.user.profile.gender
					)[0]
				elif key == "prcnt_alcohol_consumption_reported":
					if todays_meta_data and current_meta_data:
						val = self._get_average_for_duration(
							todays_meta_data.cum_reported_alcohol_days_count,
							current_meta_data.cum_reported_alcohol_days_count,alias
						) * 100
						return int(Decimal(val).quantize(0,ROUND_HALF_UP))

				elif key in grades_bifurcation_keys:
					if todays_meta_data and current_meta_data:
						alcohol_reported_days = (todays_meta_data.cum_reported_alcohol_days_count -
							current_meta_data.cum_reported_alcohol_days_count)
						return self._cal_grade_days_over_period(todays_data,current_data,
																key, alcohol_reported_days)
				elif key in grades_prcnt_bifurcation_keys:
					if todays_meta_data and current_meta_data:
						alcohol_reported_days = (todays_meta_data.cum_reported_alcohol_days_count -
							current_meta_data.cum_reported_alcohol_days_count)
						return self._cal_prcnt_grade_over_period(todays_data,current_data,
																 key, alias,alcohol_reported_days)
			return None

		calculated_data = {
			'avg_drink_per_day':{d:None for d in self.duration_type},
			'avg_drink_per_week':{d:None for d in self.duration_type},
			'alcoholic_drinks_per_week_grade':{d:None for d in self.duration_type},
			'alcoholic_drinks_per_week_gpa':{d:None for d in self.duration_type},
			'prcnt_alcohol_consumption_reported':{d:None for d in self.duration_type}
		}
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_prcnt_bifurcation_keys})

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
		grades_bifurcation_keys = self._create_grade_keys('cum_days_resting_hr_got')
		grades_prcnt_bifurcation_keys = self._create_prcnt_grade_keys('days_resting_hr_got')

		def _cal_custom_average(stat1, stat2,days):
			if not stat1 == None and not stat2 == None and days:
				avg = (stat1 - stat2)/days
				return avg
			return 0


		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='resting_hr':
					if todays_meta_data and current_meta_data:
						resting_hr_days = (todays_meta_data.cum_resting_hr_days_count - 
							current_meta_data.cum_resting_hr_days_count)
						val = _cal_custom_average(
							todays_data.cum_resting_hr,
							current_data.cum_resting_hr,
							resting_hr_days)
						if val:
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
						else:
							return "Not Provided"
					return None

				elif key == 'hrr_time_to_99':
					if todays_meta_data and current_meta_data:
						hrr_time_to_99_days = (todays_meta_data.cum_hrr_to_99_days_count - 
							current_meta_data.cum_hrr_to_99_days_count)
						val = self._min_to_min_sec(_cal_custom_average(
							todays_data.cum_hrr_time_to_99_in_mins,
							current_data.cum_hrr_time_to_99_in_mins,
							hrr_time_to_99_days))
						if hrr_time_to_99_days:
							return val
						else:
							return "Not Provided"
					return None
				elif key == 'hrr_beats_lowered_in_first_min':
					if todays_meta_data and current_meta_data:
						beats_lowered_in_first_min_days = (
							todays_meta_data.cum_hrr_beats_lowered_in_first_min_days_count - 
							current_meta_data.cum_hrr_beats_lowered_in_first_min_days_count
						)
						val = _cal_custom_average(
							todays_data.cum_hrr_beats_lowered_in_first_min,
							current_data.cum_hrr_beats_lowered_in_first_min,
							beats_lowered_in_first_min_days)
						if beats_lowered_in_first_min_days:
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
						else:
							return "Not Provided"
					return None
				elif key == 'hrr_highest_hr_in_first_min':
					if todays_meta_data and current_meta_data:
						highest_hr_in_first_min_days = (
							todays_meta_data.cum_highest_hr_in_first_min_days_count - 
							current_meta_data.cum_highest_hr_in_first_min_days_count
						)
						val = _cal_custom_average(
							todays_data.cum_highest_hr_in_first_min,
							current_data.cum_highest_hr_in_first_min,
							highest_hr_in_first_min_days)
						if highest_hr_in_first_min_days:
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
						else:
							return "Not Provided"
					return None
				elif key == 'hrr_lowest_hr_point':
					if todays_meta_data and current_meta_data:
						hrr_lowest_hr_point_days = (
							todays_meta_data.cum_hrr_lowest_hr_point_days_count - 
							current_meta_data.cum_hrr_lowest_hr_point_days_count
						)
						val = _cal_custom_average(
							todays_data.cum_hrr_lowest_hr_point,
							current_data.cum_hrr_lowest_hr_point,
							hrr_lowest_hr_point_days)
						if hrr_lowest_hr_point_days:
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
						else:
							return "Not Provided"
					return None
				elif key == 'hrr_pure_1_minute_beat_lowered':
					if todays_meta_data and current_meta_data:
						hrr_pure_1_minute_beat_lowered_days = (
							todays_meta_data.cum_hrr_pure_1_minute_beat_lowered_days_count 
							- current_meta_data.cum_hrr_pure_1_minute_beat_lowered_days_count
						)
						val = _cal_custom_average(
							todays_data.cum_hrr_pure_1_min_beats_lowered,
							current_data.cum_hrr_pure_1_min_beats_lowered,
							hrr_pure_1_minute_beat_lowered_days)
						if hrr_pure_1_minute_beat_lowered_days:
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
						else:
							return "Not Provided"
					return None
				elif key == 'hrr_pure_time_to_99':
					if todays_meta_data and current_meta_data:
						hrr_pure_time_to_99_days = (
							todays_meta_data.cum_hrr_pure_time_to_99_days_count 
							- current_meta_data.cum_hrr_pure_time_to_99_days_count
						)
						val = self._min_to_min_sec(_cal_custom_average(
							todays_data.cum_hrr_pure_time_to_99,
							current_data.cum_hrr_pure_time_to_99,
							hrr_pure_time_to_99_days))
						if hrr_pure_time_to_99_days:
							return val
						else:
							return "Not Provided"
					return None
				elif key == 'hrr_activity_end_hr':
					if todays_meta_data and current_meta_data:
						hrr_activity_end_hr = (
							todays_meta_data.cum_hrr_activity_end_hr_days_count 
							- current_meta_data.cum_hrr_activity_end_hr_days_count
						)
						val = _cal_custom_average(
							todays_data.cum_hrr_activity_end_hr,
							current_data.cum_hrr_activity_end_hr,
							hrr_activity_end_hr)
						if hrr_activity_end_hr:
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
						else:
							return "Not Provided"
					return None
				elif key == 'floors_climbed':
					val = self._get_average_for_duration(
						todays_data.cum_floors_climbed,
						current_data.cum_floors_climbed,alias)
					return int(Decimal(val).quantize(0,ROUND_HALF_UP))
				elif key == 'number_of_days_reported_inputs':
					if todays_meta_data and current_meta_data:
						days_reported_inputs = (
							todays_meta_data.cum_inputs_reported_days_count 
							- current_meta_data.cum_inputs_reported_days_count
						)
						if days_reported_inputs:
							return days_reported_inputs
						else:
							return "Not Reported"
				elif key == 'prcnt_of_days_reported_inputs':
					if todays_meta_data and current_meta_data:
						val = self._get_average_for_duration(
							todays_meta_data.cum_inputs_reported_days_count,
							current_meta_data.cum_inputs_reported_days_count,alias
						) * 100
						return int(Decimal(val).quantize(0,ROUND_HALF_UP))

				elif key in grades_bifurcation_keys:
					if todays_meta_data and current_meta_data:
						resting_hr_days = (todays_meta_data.cum_resting_hr_days_count - 
							current_meta_data.cum_resting_hr_days_count)
						return self._cal_grade_days_over_period(todays_data,current_data,
																key, resting_hr_days)
				elif key in grades_prcnt_bifurcation_keys:
					resting_hr_days = (todays_meta_data.cum_resting_hr_days_count - 
							current_meta_data.cum_resting_hr_days_count)
					return self._cal_prcnt_grade_over_period(todays_data,current_data,
															 key, alias, resting_hr_days)
			return None

		calculated_data = {
			'resting_hr':{d:None for d in self.duration_type},
			'hrr_time_to_99':{d:None for d in self.duration_type},
			'hrr_beats_lowered_in_first_min':{d:None for d in self.duration_type},
			'hrr_highest_hr_in_first_min':{d:None for d in self.duration_type},
			'hrr_lowest_hr_point':{d:None for d in self.duration_type},
			'hrr_pure_1_minute_beat_lowered':{d:None for d in self.duration_type},
			'hrr_pure_time_to_99':{d:None for d in self.duration_type},
			'hrr_activity_end_hr':{d:None for d in self.duration_type},
			'floors_climbed':{d:None for d in self.duration_type},
			'number_of_days_reported_inputs': {d:None for d in self.duration_type},
			'prcnt_of_days_reported_inputs': {d:None for d in self.duration_type}
		}
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_prcnt_bifurcation_keys})

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

	def _cal_sick_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='number_of_days_not_sick':
					if todays_meta_data and current_meta_data:
						days_sick_reported = (todays_meta_data.cum_reported_sick_days_count - 
							current_meta_data.cum_reported_sick_days_count)
						days_sick = todays_data.cum_days_sick - current_data.cum_days_sick
						val = days_sick_reported - days_sick
						return val

				elif key == 'prcnt_of_days_not_sick':
					if todays_meta_data and current_meta_data:
						days_sick_not_sick_reported = (todays_meta_data.cum_reported_sick_days_count - 
							current_meta_data.cum_reported_sick_days_count)
						days_sick = todays_data.cum_days_sick - current_data.cum_days_sick
						days_not_sick = days_sick_not_sick_reported - days_sick
						if days_sick_not_sick_reported:
							val = (days_not_sick/days_sick_not_sick_reported) * 100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))

				elif key == 'number_of_days_sick':
					val = todays_data.cum_days_sick - current_data.cum_days_sick
					return val

				elif key == 'prcnt_of_days_sick':
					if todays_meta_data and current_meta_data:
						days_sick_not_sick_reported = (todays_meta_data.cum_reported_sick_days_count - 
							current_meta_data.cum_reported_sick_days_count)
						days_sick = todays_data.cum_days_sick - current_data.cum_days_sick
						if days_sick_not_sick_reported:
							val = (days_sick/days_sick_not_sick_reported) * 100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))

				elif key == 'days_sick_not_sick_reported':
					if todays_meta_data and current_meta_data:
						days_sick_not_sick_reported = (todays_meta_data.cum_reported_sick_days_count - 
							current_meta_data.cum_reported_sick_days_count)
						return days_sick_not_sick_reported

			return None

		calculated_data = {
			'number_of_days_not_sick':{d:None for d in self.duration_type},
			'prcnt_of_days_not_sick':{d:None for d in self.duration_type},
			'number_of_days_sick':{d:None for d in self.duration_type},
			'prcnt_of_days_sick':{d:None for d in self.duration_type},
			'days_sick_not_sick_reported':{d:None for d in self.duration_type}
		}
		summary_type = "sick_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias, summary_type, _calculate
				)
		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def _cal_stress_summary(self,custom_daterange = False):
		grades_bifurcation_keys = self._create_grade_keys('cum_garmin_stress_days_got')
		grades_prcnt_bifurcation_keys = self._create_prcnt_grade_keys('garmin_stress_days_got')

		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='number_of_days_low_stress_reported':
					days_low_stress = (
						todays_data.cum_days_low_stress - 
						current_data.cum_days_low_stress
					)
					return days_low_stress 

				elif key == "prcnt_of_days_low_stress":
					if todays_meta_data and current_meta_data:
						days_stress_reported = (
							todays_meta_data.cum_reported_stress_days_count - 
							current_meta_data.cum_reported_stress_days_count
						)
						days_low_stress = (
							todays_data.cum_days_low_stress - 
							current_data.cum_days_low_stress
						)
						if days_stress_reported:
							val = (days_low_stress/days_stress_reported)*100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))

				elif key == "number_of_days_medium_stress_reported":
					days_medium_stress = (
						todays_data.cum_days_medium_stress - 
						current_data.cum_days_medium_stress
					)
					return days_medium_stress 

				elif key == "prcnt_of_days_medium_stress":
					if todays_meta_data and current_meta_data:
						days_stress_reported = (
							todays_meta_data.cum_reported_stress_days_count - 
							current_meta_data.cum_reported_stress_days_count
						)
						days_medium_stress = (
							todays_data.cum_days_medium_stress - 
							current_data.cum_days_medium_stress
						)
						if days_stress_reported:
							val = (days_medium_stress/days_stress_reported)*100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
				elif key == "number_of_days_high_stress_reported":
					days_high_stress = (
						todays_data.cum_days_high_stress - 
						current_data.cum_days_high_stress
					)
					return days_high_stress
				elif key == "prcnt_of_days_high_stress":
					if todays_meta_data and current_meta_data:
						days_stress_reported = (
							todays_meta_data.cum_reported_stress_days_count - 
							current_meta_data.cum_reported_stress_days_count
						)
						days_high_stress = (
							todays_data.cum_days_high_stress - 
							current_data.cum_days_high_stress
						)
						if days_stress_reported:
							val = (days_high_stress/days_stress_reported)*100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
				elif key == "days_stress_level_reported":
					days_stress_reported = (
							todays_meta_data.cum_reported_stress_days_count - 
							current_meta_data.cum_reported_stress_days_count
						)
					return days_stress_reported

				elif key == "garmin_stress_lvl":
					avg_stress_level = self._get_average_for_duration(
						todays_data.cum_days_garmin_stress_lvl,
						current_data.cum_days_garmin_stress_lvl,alias)
					return round(avg_stress_level,2)
				elif key == "number_of_days_high_medium_stress":
					days_medium_stress = (
						todays_data.cum_days_medium_stress - 
						current_data.cum_days_medium_stress
					)
					days_high_stress = (
						todays_data.cum_days_high_stress - 
						current_data.cum_days_high_stress
					)
					return days_medium_stress+days_high_stress

				elif key == "prcnt_of_days_high_medium_stress":
					if todays_meta_data and current_meta_data:
						days_stress_reported = (
							todays_meta_data.cum_reported_stress_days_count - 
							current_meta_data.cum_reported_stress_days_count
						)
						days_medium_stress = (
							todays_data.cum_days_medium_stress - 
							current_data.cum_days_medium_stress
						)
						days_high_stress = (
							todays_data.cum_days_high_stress - 
							current_data.cum_days_high_stress
						)
						total_medium_high_stress_days = days_medium_stress + days_high_stress
						if days_stress_reported:
							val = (total_medium_high_stress_days/days_stress_reported)*100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))

				elif key in grades_bifurcation_keys:
					if todays_meta_data and current_meta_data:
						reported_days = todays_meta_data.cum_have_garmin_stress_days_count\
							- current_meta_data.cum_have_garmin_stress_days_count
						return self._cal_grade_days_over_period(todays_data, current_data,
																key, reported_days)
				elif key in grades_prcnt_bifurcation_keys:
					if todays_meta_data and current_meta_data:
						reported_days = todays_meta_data.cum_have_garmin_stress_days_count\
							- current_meta_data.cum_have_garmin_stress_days_count
						return self._cal_prcnt_grade_over_period(todays_data, current_data,
																 key, alias, reported_days)
			return None

		calculated_data = {
			'number_of_days_low_stress_reported':{d:None for d in self.duration_type},
			'prcnt_of_days_low_stress':{d:None for d in self.duration_type},
			'number_of_days_medium_stress_reported':{d:None for d in self.duration_type},
			'prcnt_of_days_medium_stress':{d:None for d in self.duration_type},
			'number_of_days_high_stress_reported':{d:None for d in self.duration_type},
			'prcnt_of_days_high_stress':{d:None for d in self.duration_type},
			'days_stress_level_reported':{d:None for d in self.duration_type},
			'garmin_stress_lvl':{d:None for d in self.duration_type},
			'number_of_days_high_medium_stress':{d:None for d in self.duration_type},
			'prcnt_of_days_high_medium_stress':{d:None for d in self.duration_type}
		}
		calculated_data.update({key:{d:None for d in self.duration_type}
						for key in grades_bifurcation_keys})
		calculated_data.update({key:{d:None for d in self.duration_type}
								for key in grades_prcnt_bifurcation_keys})
		
		summary_type = "stress_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias, summary_type, _calculate
				)
		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data

	def _cal_travel_summary(self, custom_daterange = False):
		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='number_days_travel_away_from_home':
					val = (todays_data.cum_days_travel_away_from_home -
						current_data.cum_days_travel_away_from_home)
					return val 
				elif key == "prcnt_days_travel_away_from_home":
					val = self._get_average_for_duration(
						todays_data.cum_days_travel_away_from_home,
						current_data.cum_days_travel_away_from_home,alias
					) * 100
					return int(Decimal(val).quantize(0,ROUND_HALF_UP))
			return None

		calculated_data = {
			'number_days_travel_away_from_home':{d:None for d in self.duration_type},
			'prcnt_days_travel_away_from_home':{d:None for d in self.duration_type}
		}
		summary_type = "travel_cum"

		if custom_daterange:
			alias = "custom_range"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		if self.current_date:
			self._generic_summary_calculator(calculated_data,_calculate,summary_type)

		return calculated_data


	def _cal_standing_summary(self, custom_daterange = False):
		def _calculate(key,alias,todays_data,current_data,
			todays_meta_data,current_meta_data):
			if todays_data and current_data:
				if key =='number_days_stood_three_hours':
					val = (todays_data.cum_days_stand_three_hour -
						current_data.cum_days_stand_three_hour)
					return val 

				elif key == "prcnt_days_stood_three_hours":
					if todays_meta_data and current_meta_data:
						days_reported_stood_not_stood_three_hours = (
							todays_meta_data.cum_reported_stand_three_hours_days_count - 
							current_meta_data.cum_reported_stand_three_hours_days_count
						)
						val = (todays_data.cum_days_stand_three_hour -
						current_data.cum_days_stand_three_hour)
						if days_reported_stood_not_stood_three_hours:
							val = (val/days_reported_stood_not_stood_three_hours) * 100
							return int(Decimal(val).quantize(0,ROUND_HALF_UP))
						else:
							return 0

				elif key == "number_days_reported_stood_not_stood_three_hours":
					days_reported_stood_not_stood_three_hours = (
							todays_meta_data.cum_reported_stand_three_hours_days_count - 
							current_meta_data.cum_reported_stand_three_hours_days_count
						)
					return days_reported_stood_not_stood_three_hours
			return None

		calculated_data = {
			'number_days_stood_three_hours':{d:None for d in self.duration_type},
			'prcnt_days_stood_three_hours':{d:None for d in self.duration_type},
			'number_days_reported_stood_not_stood_three_hours':{d:None for d in self.duration_type}
		}
		summary_type = "standing_cum"

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
		# Driver method to generate and return PA reports 
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