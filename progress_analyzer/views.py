from datetime import datetime, timedelta
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from quicklook import calculation_helper
from progress_analyzer.models import CumulativeSum
	
class ProgressReportView(APIView):
	permission_classes = (IsAuthenticated,)

	def _initialize(self):
		self.summary_type = ['overall_health','non_exercise','sleep','mc','ec',
		'nutrition','exercise','alcohol','penalty']
		self.duration_type = ['today','yesterday','week','month','year']

		# Custom date range for which report is to be created
		# expected format of the date is 'YYYY-MM-DD'
		self.current_date = self._str_to_dt(self.request.query_params.get('date',None))
		self.from_dt = self._str_to_dt(self.request.query_params.get('from',None))
		self.to_dt = self._str_to_dt(self.request.query_params.get('to',None))
		self.cumulative_datewise_data = {q.created_at.strftime("%Y-%m-%d"):q for q in self.get_queryset()}
		self.cumulative_datewise_data_custom_range = {q.created_at.strftime("%Y-%m-%d"):q 
			for q in self._get_queryset_custom_range(self.from_dt, self.to_dt)}
		self.duration_denominator = {
			'today':1,'yesterday':1, 'week':7, "month":30, "year":365
		}
		self.custom_daterange = False

		if self.from_dt and self.to_dt:
			custom_range_denominator = (self.to_dt - self.from_dt).days + 1
			self.duration_denominator['custom_range'] = custom_range_denominator
			self.custom_daterange = True


		summaries = self.request.query_params.get('summary',None)
		if summaries:
			summaries = [item.strip() for item in summaries.strip().split(',')]
			allowed = set(summaries)
			existing = set(self.summary_type)
			for s in existing-allowed:
				self.summary_type.pop(s)

		duration = self.request.query_params.get('duration',None)
		if duration:
			duration = [item.strip() for item in duration.strip().split(',')]
			allowed = set(duration)
			existing = set(self.duration_type)
			for d in existing-allowed:
				self.duration_type.pop(d)

	def _str_to_dt(self,dt_str):
		if dt_str:
			return datetime.strptime(dt_str, "%Y-%m-%d")
		else:
			return None

	def _hours_to_hours_min(self,hours):
		mins = hours * 60
		hours,mins = divmod(mins,60)
		hours = round(hours)
		mins = round(mins)
		if mins < 10:
			mins = "{:02d}".format(mins) 
		return "{}:{}".format(hours,mins)

	def _get_average(self, stat1, stat2, duration_type):
		avg = (stat1 - stat2)/self.duration_denominator.get(duration_type)
		return avg

	def get_queryset(self):
		duration_end_dt = self._get_duration_datetime(self.current_date)
		day_before_yesterday = self.current_date - timedelta(days=2)
		filters = Q(created_at=day_before_yesterday)
		for d in duration_end_dt.values():
			filters |= Q(created_at=d)
		cumulative_data_qs = CumulativeSum.objects.select_related(
				'overall_health_grade_cum','non_exercise_steps_cum','sleep_per_night_cum',
				'movement_consistency_cum','exercise_consistency_cum','nutrition_cum',
				'exercise_stats_cum','alcohol_cum','penalty_cum').filter(filters) 
		return cumulative_data_qs

	def _get_queryset_custom_range(self,from_dt, to_dt):
		filters = Q(created_at=to_dt.date()) | Q(created_at=from_dt.date())
		cumulative_data_qs = CumulativeSum.objects.select_related(
			'overall_health_grade_cum','non_exercise_steps_cum','sleep_per_night_cum',
			'movement_consistency_cum','exercise_consistency_cum','nutrition_cum',
			'exercise_stats_cum','alcohol_cum','penalty_cum').filter(filters) 
		return cumulative_data_qs

	def _get_duration_datetime(self,current_date):
		duration = {
			'today': current_date.date(),
			'yesterday':(current_date - timedelta(days=1)).date(),
			'week':(current_date - timedelta(days=7)).date(),
			'month':(current_date - timedelta(days=30)).date(),
			'year':(current_date - timedelta(days=365)).date()
		}
		return duration

	def _generic_custom_range_calculator(self,key,alias,summary_type,custom_avg_calculator):

		#for select related
		summary_type = "_{}_cache".format(summary_type)
		range_start_data = self.cumulative_datewise_data_custom_range.get(
			self.from_dt.strftime("%Y-%m-%d"),None
		)
		range_start_data = range_start_data.__dict__.get(summary_type)
		range_end_data = self.cumulative_datewise_data_custom_range.get(
			self.to_dt.strftime("%Y-%m-%d"),None
		)
		range_end_data = range_end_data.__dict__.get(summary_type)
		return {
			"from_dt":self.from_dt.strftime("%Y-%m-%d"),
			"to_dt":self.to_dt.strftime("%Y-%m-%d"),
			"data":custom_avg_calculator(key,alias,range_end_data,range_start_data)
		}

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
			"penalty":self._cal_penalty_summary
		}
		return SUMMARY_CALCULATOR_BINDING


	def _cal_overall_health_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data):
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

		if custom_daterange:
			alias = "custom_range"
			summary_type = "overall_health_grade_cum"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias, summary_type, _calculate
				)

		todays_data = self.cumulative_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)

		if todays_data:
			todays_data = todays_data.overall_health_grade_cum
		if yesterday_data:
			yesterday_data = yesterday_data.overall_health_grade_cum
		if day_before_yesterday_data:
			day_before_yesterday_data = day_before_yesterday_data.overall_health_grade_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.overall_health_grade_cum
				if alias == 'today' and yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,yesterday_data)
					continue
				elif alias == 'yesterday' and day_before_yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,yesterday_data,day_before_yesterday_data)
					continue
				calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)

		return calculated_data

	def _cal_non_exercise_summary(self,custom_daterange = False):

		def _calculate(key, alias,todays_data,current_data):
			if todays_data and current_data:
				if key =='non_exercise_steps':
					val =  self._get_average(
						todays_data.cum_non_exercise_steps,
						current_data.cum_non_exercise_steps,alias)
					return int(val)

				elif key == 'non_exericse_steps_gpa':
					val = self._get_average(
						todays_data.cum_non_exercise_steps_gpa,
						current_data.cum_non_exercise_steps_gpa,alias)
					return round(val,2)

				elif key == 'total_steps':
					val = self._get_average(
						todays_data.cum_total_steps,
						current_data.cum_total_steps,alias)
					return int(val)

				elif key == 'movement_non_exercise_step_grade':
					return calculation_helper.cal_non_exercise_step_grade(
						self._get_average(
							todays_data.cum_non_exercise_steps,
							current_data.cum_non_exercise_steps,alias
						)
					)
			return None

		calculated_data = {
			'non_exercise_steps':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'movement_non_exercise_step_grade':{d:None for d in self.duration_type},
			'non_exericse_steps_gpa':{d:None for d in self.duration_type},
			'total_steps':{d:None for d in self.duration_type}
		}
		if custom_daterange:
			alias = "custom_range"
			summary_type = "non_exercise_steps_cum"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		todays_data = self.cumulative_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)

		if todays_data:
			todays_data = todays_data.non_exercise_steps_cum
		if yesterday_data:
			yesterday_data = yesterday_data.non_exercise_steps_cum
		if day_before_yesterday_data:
			day_before_yesterday_data = day_before_yesterday_data.non_exercise_steps_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.non_exercise_steps_cum
				if alias == 'today' and yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,yesterday_data)
					continue
				elif alias == 'yesterday' and day_before_yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,yesterday_data,day_before_yesterday_data)
					continue
				calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)
		return calculated_data

	def _cal_sleep_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data):
			if todays_data and current_data:
				if key == 'total_sleep_in_hours_min':
					val = self._get_average(
						todays_data.cum_total_sleep_in_hours,
						current_data.cum_total_sleep_in_hours,alias)
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
			return None

		calculated_data = {
			'total_sleep_in_hours_min':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'average_sleep_grade':{d:None for d in self.duration_type},
			'overall_sleep_gpa':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			alias = "custom_range"
			summary_type = "sleep_per_night_cum"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		todays_data = self.cumulative_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)

		if todays_data:
			todays_data = todays_data.sleep_per_night_cum
		if yesterday_data:
			yesterday_data = yesterday_data.sleep_per_night_cum
		if day_before_yesterday_data:
			day_before_yesterday_data = day_before_yesterday_data.sleep_per_night_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.sleep_per_night_cum
				if alias == 'today' and yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,yesterday_data)
					continue
				elif alias == 'yesterday' and day_before_yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,yesterday_data,day_before_yesterday_data)
					continue
				calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)
		return calculated_data

	def _cal_movement_consistency_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data):
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
		if custom_daterange:
			alias = "custom_range"
			summary_type = "movement_consistency_cum"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		todays_data = self.cumulative_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)

		if todays_data:
			todays_data = todays_data.movement_consistency_cum
		if yesterday_data:
			yesterday_data = yesterday_data.movement_consistency_cum
		if day_before_yesterday_data:
			day_before_yesterday_data = day_before_yesterday_data.movement_consistency_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.movement_consistency_cum
				if alias == 'today' and yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,yesterday_data)
					continue
				elif alias == 'yesterday' and day_before_yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,yesterday_data,day_before_yesterday_data)
					continue
				calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)
		return calculated_data

	def _cal_exercise_consistency_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data):
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
							todays_data.cum_exercise_consistency_gpa,
							current_data.cum_exercise_consistency_gpa,alias
						)
					)[0]
			return None

		calculated_data = {
			'avg_no_of_days_exercises_per_week':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'exercise_consistency_grade':{d:None for d in self.duration_type},
			'exercise_consistency_gpa':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			alias = "custom_range"
			summary_type = "exercise_consistency_cum"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		todays_data = self.cumulative_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)

		if todays_data:
			todays_data = todays_data.exercise_consistency_cum
		if yesterday_data:
			yesterday_data = yesterday_data.exercise_consistency_cum
		if day_before_yesterday_data:
			day_before_yesterday_data = day_before_yesterday_data.exercise_consistency_cum
		
		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.exercise_consistency_cum
				if alias == 'today' and yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,yesterday_data)
					continue
				elif alias == 'yesterday' and day_before_yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,yesterday_data,day_before_yesterday_data)
					continue
				calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)
		return calculated_data

	def _cal_nutrition_summary(self, custom_daterange = False):
		
		def _calculate(key,alias,todays_data,current_data):
			if todays_data and current_data:
				if key =='prcnt_unprocessed_volume_of_food':
					val = self._get_average(
						todays_data.cum_prcnt_unprocessed_food_consumed,
						current_data.cum_prcnt_unprocessed_food_consumed,alias)
					return round(val)
				elif key == 'prcnt_unprocessed_food_gpa':
					val = self._get_average(
						todays_data.cum_prcnt_processed_food_consumed_gpa,
						current_data.cum_prcnt_processed_food_consumed_gpa,alias)
					return round(val,2)
				elif key == 'prcnt_unprocessed_food_grade':
					return calculation_helper.cal_unprocessed_food_grade(
						self._get_average(
							todays_data.cum_prcnt_processed_food_consumed_gpa,
							current_data.cum_prcnt_processed_food_consumed_gpa,alias
						)
					)
			return None

		calculated_data = {
			'prcnt_unprocessed_volume_of_food':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'prcnt_unprocessed_food_grade':{d:None for d in self.duration_type},
			'prcnt_unprocessed_food_gpa':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			alias = "custom_range"
			summary_type = "nutrition_cum"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		todays_data = self.cumulative_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)

		if todays_data:
			todays_data = todays_data.nutrition_cum
		if yesterday_data:
			yesterday_data = yesterday_data.nutrition_cum
		if day_before_yesterday_data:
			day_before_yesterday_data = day_before_yesterday_data.nutrition_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.nutrition_cum
				if alias == 'today' and yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,yesterday_data)
					continue
				elif alias == 'yesterday' and day_before_yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,yesterday_data,day_before_yesterday_data)
					continue
				calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)
		return calculated_data

	def _cal_exercise_summary(self, custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data):
			if todays_data and current_data:
				if key =='workout_duration_hours_min':
					avg_hours = self._get_average(
						todays_data.cum_workout_duration_in_hours,
						current_data.cum_workout_duration_in_hours,alias
					)
					return self._hours_to_hours_min(avg_hours)

				elif key == 'workout_effort_level':
					val = self._get_average(
						todays_data.cum_workout_effort_level,
						current_data.cum_workout_effort_level,alias
					)
					return round(val,2)

				elif key == 'avg_exercise_heart_rate':
					val = self._get_average(
						todays_data.cum_avg_exercise_hr,
						current_data.cum_avg_exercise_hr,alias
					)
					return round(val)

				elif key == 'overall_exercise_gpa':
					val = self._get_average(
						todays_data.cum_overall_exercise_gpa,
						current_data.cum_overall_exercise_gpa,alias
					)
					return round(val,2)

				elif key == 'workout_duration_grade':
					return calculation_helper.cal_workout_duration_grade(
						self._get_average(
							todays_data.cum_workout_duration_in_hours,
							current_data.cum_workout_duration_in_hours,alias
						) * 60
					)[0]

				elif key == 'workout_effort_level_grade':
					return calculation_helper.cal_workout_effort_level_grade(
						'easy',
						self._get_average(
							todays_data.cum_workout_effort_level,
							current_data.cum_workout_effort_level,alias
						)
					)[0]

				elif key == 'avg_exercise_heart_rate_grade':
					return calculation_helper.cal_avg_exercise_heartrate_grade(
						self._get_average(
							todays_data.cum_avg_exercise_hr,
							current_data.cum_avg_exercise_hr,alias
						),'easy',self.request.user.profile.age()
					)[0]

				elif key == 'overall_workout_grade':
					return calculation_helper.cal_overall_workout_grade(
						self._get_average(
							todays_data.cum_overall_workout_gpa,
							current_data.cum_overall_workout_gpa,alias
						)
					)[0]
			return None

		calculated_data = {
			'workout_duration_hours_min':{d:None for d in self.duration_type},
			'workout_duration_grade':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'workout_effort_level':{d:None for d in self.duration_type},
			'workout_effort_level_grade':{d:None for d in self.duration_type},
			'avg_exercise_heart_rate':{d:None for d in self.duration_type},
			'avg_exercise_heart_rate_grade':{d:None for d in self.duration_type},
			'overall_workout_grade':{d:None for d in self.duration_type},
			'overall_exercise_gpa':{d:None for d in self.duration_type},
			'overall_exercise_gpa_rank':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			alias = "custom_range"
			summary_type = "exercise_stats_cum"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		todays_data = self.cumulative_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)

		if todays_data:
			todays_data = todays_data.exercise_stats_cum
		if yesterday_data:
			yesterday_data = yesterday_data.exercise_stats_cum
		if day_before_yesterday_data:
			day_before_yesterday_data = day_before_yesterday_data.exercise_stats_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.exercise_stats_cum
				if alias == 'today' and yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,yesterday_data)
					continue
				elif alias == 'yesterday' and day_before_yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,yesterday_data,day_before_yesterday_data)
					continue
				calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)
		return calculated_data

	def _cal_alcohol_summary(self, custom_daterange = False):
		def _calculate(key,alias,todays_data,current_data):
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
						),self.request.user.profile.gender
					)[0]
			return None

		calculated_data = {
			'avg_drink_per_week':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'alcoholic_drinks_per_week_grade':{d:None for d in self.duration_type},
			'alcoholic_drinks_per_week_gpa':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			alias = "custom_range"
			summary_type = "alcohol_cum"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		
		todays_data = self.cumulative_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)

		if todays_data:
			todays_data = todays_data.alcohol_cum
		if yesterday_data:
			yesterday_data = yesterday_data.alcohol_cum
		if day_before_yesterday_data:
			day_before_yesterday_data = day_before_yesterday_data.alcohol_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.alcohol_cum

				if alias == 'today' and yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,yesterday_data)
					continue
				elif alias == 'yesterday' and day_before_yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,yesterday_data,day_before_yesterday_data)
					continue
				calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)
		return calculated_data

	def _cal_penalty_summary(self, custom_daterange = False):
		def _calculate(key,alias,todays_data,current_data):
			if todays_data and current_data:
				if key =='sleep_aid_penalty':
					val = self._get_average(
						todays_data.cum_sleep_aid_penalty,
						current_data.cum_sleep_aid_penalty,alias)
					return round(val,2)
				elif key == 'controlled_substance_penalty':
					val = self._get_average(
						todays_data.cum_controlled_subs_penalty,
						current_data.cum_controlled_subs_penalty,alias)
					return round(val,2)
				elif key == 'smoking_penalty':
					val = self._get_average(
						todays_data.cum_smoking_penalty,
						current_data.cum_smoking_penalty,alias
					)
					return round(val,2)

			return None

		calculated_data = {
			'sleep_aid_penalty':{d:None for d in self.duration_type},
			'controlled_substance_penalty':{d:None for d in self.duration_type},
			'smoking_penalty':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			alias = "custom_range"
			summary_type = "penalty_cum"
			for key in calculated_data.keys():
				calculated_data[key][alias] = self._generic_custom_range_calculator(
					key, alias,summary_type, _calculate
				)

		todays_data = self.cumulative_datewise_data.get(
			self.current_date.strftime("%Y-%m-%d"),None)
		yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=1)).strftime("%Y-%m-%d"),None)
		day_before_yesterday_data = self.cumulative_datewise_data.get(
			(self.current_date-timedelta(days=2)).strftime("%Y-%m-%d"),None)

		if todays_data:
			todays_data = todays_data.penalty_cum
		if yesterday_data:
			yesterday_data = yesterday_data.penalty_cum
		if day_before_yesterday_data:
			day_before_yesterday_data = day_before_yesterday_data.penalty_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date).items():
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.penalty_cum
				if alias == 'today' and yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,yesterday_data)
					continue
				elif alias == 'yesterday' and day_before_yesterday_data:
					calculated_data[key][alias] = _calculate(key,alias,yesterday_data,day_before_yesterday_data)
					continue
				calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)
		return calculated_data


	def get(self, request, format="json"):
		self._initialize()
		SUMMARY_CALCULATOR_BINDING = self._get_summary_calculator_binding()
		DATA = {'summary':{}, "created_at":None}
		for summary in self.summary_type:
			DATA['summary'][summary] = SUMMARY_CALCULATOR_BINDING[summary](self.custom_daterange)
		DATA['created_at'] = self.current_date.strftime("%Y-%m-%d")

		return Response(DATA,status=status.HTTP_200_OK)