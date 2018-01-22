from datetime import datetime, timedelta

from django.shortcuts import render
from django.config import settings
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from quicklook import calculation_helper
from progress_analyzer.models import CumulativeSum
	
class ProgressReport(APIView):
	permission_classes = (IsAuthenticated,)

	def __init__(self, *args, **kwargs):
		super(APIView, self).__init__(*args, **kwargs)
		self.summary_type = ['overall_health','non_exercise','sleep','mc','ec'
		'nutrition','exercise','alcohol']
		self.duration_type = ['today','yesterday','week','month','year']

		# Custom date range for which report is to be created
		# expected format of the date is 'YYYY-MM-DD'
		self.current_date = self.context['request'].query_params.get('date',None)
		self.from_dt = self.context['request'].query_params.get('from',None)
		self.to_dt = self.context['request'].query_params.get('to',None)
		self.cumulative_datewise_data = {q.created_at.strftime("%Y-%m-%d"):q for q in self._get_queryset()}
		self.duration_denominator = {
			'today':1,'yesterday':1, 'week':7, "month":30, "year":365
		}

		summaries = self.context['request'].query_params.get('summary',None)
		if summaries:
			summaries = [item.strip() for item in summaries.strip().split(',')]
			allowed = set(summaries)
			existing = set(self.summary_type)
			for s in existing-allowed:
				self.summary_type.pop(s)

		duration = self.context['request'].query_params.get('duration',None)
		if duration:
			duration = [item.strip() for item in duration.strip().split(',')]
			allowed = set(duration)
			existing = set(self.duration_type)
			for d in existing-allowed:
				self.duration_type.pop(d)

	def _hours_to_hours_min(self,hours):
		mins = hours * 60
		hours,mins = divmod(mins,60)
		hours = round(hours)
		mins = round(mins)
		if mins < 10:
			mins = "{:02d}".format(mins) 
		return "{}:{}".format(hours,mins)

	def _get_average(self, stat1, stat2, duration_type):
		if duration_type == 'today' or duration_type == 'yesterday':
			return stat1
		avg = (stat1 - stat2)/self.duration_denominator(duration_type)
		return avg

	def _get_queryset(self):
		duration_end_dt = self._get_duration_datetime(self.current_date)
		filters = Q()
		for d in duration_end_dt.values():
			filters |= Q(created_at=d)
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

	def _cal_overall_health_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data):
			if key =='total_gpa_point':
				return self._get_average(
					todays_data.cum_total_gpa_point,
					current_data.cum_total_gpa_point,alias
				)

			elif key == 'overall_health_gpa':
				self._get_average(
					todays_data.cum_overall_health_gpa_point,
					current_data.cum_overall_health_gpa_point,alias
				)

			elif key == 'overall_health_gpa_grade':
				return calculation_helper.cal_overall_grade(
					self._get_average(
						todays_data.cum_overall_health_gpa_point,
						current_data.cum_overall_health_gpa_point,alias
					)
				)[0]

		calculated_data = {
			'total_gpa_point':{d:None for d in self.duration_type},
			'overall_health_gpa':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'overall_health_gpa_grade':{d:None for d in self.duration_type}
		}
		if custom_daterange:
			pass

		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		if todays_data:
			todays_data = todays_data.overall_health_grade_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.overall_health_grade_cum
				if todays_data and current_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)

	def _cal_non_exercise_summary(self,custom_daterange = False):

		def _calculate(key, alias,todays_data,current_data):
			if key =='non_exercise_steps':
				return self._get_average(
					todays_data.cum_non_exercise_steps,
					current_data.cum_non_exercise_steps,alias)

			elif key == 'non_exericse_steps_gpa':
				return self._get_average(
					todays_data.cum_non_exercise_steps_gpa,
					current_data.cum_non_exercise_steps_gpa,alias)

			elif key == 'total_steps':
				return self._get_average(
					todays_data.cum_total_steps,
					current_data.cum_total_steps,alias)

			elif key == 'movement_non_exercise_step_grade':
				return calculation_helper.cal_non_exercise_step_grade(
					self._get_average(
						todays_data.cum_non_exercise_steps,
						current_data.cum_non_exercise_steps,alias
					)
				)

		calculated_data = {
			'non_exercise_steps':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'movement_non_exercise_step_grade':{d:None for d in self.duration_type},
			'non_exericse_steps_gpa':{d:None for d in self.duration_type},
			'total_steps':{d:None for d in self.duration_type}
		}
		if custom_daterange:
			pass

		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		if todays_data:
			todays_data = todays_data.non_exercise_steps_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.non_exercise_steps_cum
				if todays_data and current_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)

	def _cal_sleep_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data):
			if key == 'total_sleep_in_hours_min':
				return self._get_average(
					todays_data.cum_total_sleep_in_hours,
					current_data.cum_total_sleep_in_hours,alias)

			elif key == 'overall_sleep_gpa':
				return self._get_average(
					todays_data.cum_overall_sleep_gpa,
					current_data.cum_overall_sleep_gpa,alias)

			elif key == 'average_sleep_grade':
				avg_hours = self._get_average(
					todays_data.cum_total_sleep_in_hours,
					current_data.cum_total_sleep_in_hours,alias
				)
				avg_hours_str = self._hours_to_hours_min(avg_hours)
				return calculation_helper.cal_average_sleep_grade(
					avg_hours_str,None	
				)[0]

		calculated_data = {
			'total_sleep_in_hours_min':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'average_sleep_grade':{d:None for d in self.duration_type},
			'overall_sleep_gpa':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			pass

		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		if todays_data:
			todays_data = todays_data.sleep_per_night_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.sleep_per_night_cum
				if todays_data and current_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)

	def _cal_movement_consistency_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data):
			if key =='movement_consistency_score':
				return self._get_average(
					todays_data.cum_movement_consistency_score,
					current_data.cum_movement_consistency_score,alias)

			elif key == 'movement_consistency_gpa':
				return self._get_average(
					todays_data.cum_movement_consistency_gpa,
					current_data.cum_movement_consistency_gpa,alias)

			elif key == 'movement_consistency_grade':
				return calculation_helper.cal_movement_consistency_grade(
					self._get_average(
						todays_data.cum_movement_consistency_score,
						current_data.cum_movement_consistency_score,alias
					)
				)

		calculated_data = {
			'movement_consistency_score':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'movement_consistency_grade':{d:None for d in self.duration_type},
			'movement_consistency_gpa':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			pass

		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		if todays_data:
			todays_data = todays_data.movement_consistency_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.movement_consistency_cum
				if todays_data and current_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)

	def _cal_exercise_consistency_summary(self,custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data):
			if key =='avg_no_of_days_exercises_per_week':
				return self._get_average(
					todays_data.cum_avg_exercise_day,
					current_data.cum_avg_exercise_day,alias)

			elif key == 'exercise_consistency_gpa':
				return self._get_average(
					todays_data.cum_exercise_consistency_gpa,
					current_data.cum_exercise_consistency_gpa,alias)

			elif key == 'exercise_consistency_grade':
				return calculation_helper.cal_exercise_consistency_grade(
					self._get_average(
						todays_data.cum_exercise_consistency_gpa,
						current_data.cum_exercise_consistency_gpa,alias
					)[0]
				)

		calculated_data = {
			'avg_no_of_days_exercises_per_week':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'exercise_consistency_grade':{d:None for d in self.duration_type},
			'exercise_consistency_gpa':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			pass

		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		if todays_data:
			todays_data = todays_data.exercise_consistency_cum
		
		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.exercise_consistency_cum
				if todays_data and current_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)

	def _cal_nutrition_summary(self, custom_daterange = False):
		
		def _calculate(key,alias,todays_data,current_data):
			if key =='prcnt_unprocessed_volume_of_food':
				return self._get_average(
					todays_data.cum_prcnt_unprocessed_food_consumed,
					current_data.cum_prcnt_unprocessed_food_consumed,alias)

			elif key == 'prcnt_unprocessed_food_gpa':
				return self._get_average(
					todays_data.cum_prcnt_processed_food_consumed_gpa,
					current_data.cum_prcnt_processed_food_consumed_gpa,alias)

			elif key == 'prcnt_unprocessed_food_grade':
				return calculation_helper.cal_unprocessed_food_grade(
					self._get_average(
						todays_data.cum_prcnt_processed_food_consumed_gpa,
						current_data.cum_prcnt_processed_food_consumed_gpa,alias
					)
				)

		calculated_data = {
			'prcnt_unprocessed_volume_of_food':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'prcnt_unprocessed_food_grade':{d:None for d in self.duration_type},
			'prcnt_unprocessed_food_gpa':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			pass

		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		if todays_data:
			todays_data = todays_data.nutrition_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.nutrition_cum
				if todays_data and current_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)

	def _cal_exercise_summary(self, custom_daterange = False):

		def _calculate(key,alias,todays_data,current_data):
			if key =='workout_duration_hours_min':
				avg_hours = self._get_average(
					todays_data.cum_workout_duration_in_hours,
					current_data.cum_workout_duration_in_hours,alias
				)
				return self._hours_to_hours_min(avg_hours)

			elif key == 'workout_effort_level':
				return self._get_average(
					todays_data.cum_workout_effort_level,
					current_data.cum_workout_effort_level,alias
				)

			elif key == 'avg_exercise_heart_rate':
				return self._get_average(
					todays_data.cum_avg_exercise_hr,
					current_data.cum_avg_exercise_hr,alias
				)

			elif key == 'overall_exercise_gpa':
				return self._get_average(
					todays_data.cum_overall_exercise_gpa,
					current_data.cum_overall_exercise_gpa,alias
				)

			elif key == 'workout_duration_grade':
				return calculation_helper.cal_workout_duration_grade(
					self._get_average(
						todays_data.cum_workout_duration_in_hours,
						current_data.cum_workout_duration_in_hours,alias
					) * 60
				)

			elif key == 'workout_effort_level_grade':
				return calculation_helper.cal_workout_duration_grade(
					'easy',
					self._get_average(
						todays_data.cum_workout_effort_level,
						current_data.cum_workout_effort_level,alias
					)
				)

			elif key == 'avg_exercise_heart_rate_grade':
				return calculation_helper.cal_avg_exercise_heartrate_grade(
					self._get_average(
						todays_data.cum_avg_exercise_hr,
						current_data.cum_avg_exercise_hr,alias
					),'easy',self.request.user.profile.age()
				)

			elif key == 'overall_workout_grade':
				return calculation_helper.cal_overall_workout_grade(
					self._get_average(
						todays_data.cum_overall_workout_gpa,
						current_data.cum_overall_workout_gpa,alias
					)
				)

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
			pass

		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		if todays_data:
			todays_data = todays_data.exercise_stats_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.exercise_stats_cum
				if todays_data and current_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)

	def _cal_alcohol_summary(self, custom_daterange = False):
		def _calculate(key,alias,todays_data,current_data):
			if key =='avg_drink_per_week':
				return self._get_average(
					todays_data.cum_average_drink_per_week,
					current_data.cum_average_drink_per_week,alias)

			elif key == 'alcoholic_drinks_per_week_gpa':
				return self._get_average(
					todays_data.cum_alcohol_drink_per_week_gpa,
					current_data.cum_alcohol_drink_per_week_gpa,alias)

			elif key == 'alcoholic_drinks_per_week_grade':
				return calculation_helper.cal_alcohol_drink_grade(
					self._get_average(
						todays_data.cum_average_drink_per_week,
						current_data.cum_average_drink_per_week,alias
					),self.request.user.profile.gender
				)

		calculated_data = {
			'avg_drink_per_week':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'alcoholic_drinks_per_week_grade':{d:None for d in self.duration_type},
			'alcoholic_drinks_per_week_gpa':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			pass

		
		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		if todays_data:
			todays_data = todays_data.alcohol_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.alcohol_cum
				if todays_data and current_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)

	def _cal_penalty_summary(self, custom_daterange = False):
		def _calculate(key,alias,todays_data,current_data):
			if key =='sleep_aid_penalty':
				return self._get_average(
					todays_data.cum_sleep_aid_penalty,
					current_data.cum_sleep_aid_penalty,alias)

			elif key == 'controlled_substance_penalty':
				return self._get_average(
					todays_data.cum_controlled_subs_penalty,
					current_data.cum_controlled_subs_penalty,alias)

			elif key == 'smoking_penalty':
				return self._get_average(
					todays_data.cum_smoking_penalty,
					current_data.cum_smoking_penalty,alias
				)

		calculated_data = {
			'sleep_aid_penalty':{d:None for d in self.duration_type},
			'controlled_substance_penalty':{d:None for d in self.duration_type},
			'smoking_penalty':{d:None for d in self.duration_type},
		}
		if custom_daterange:
			pass

		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		if todays_data:
			todays_data = todays_data.penalty_cum

		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				current_data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if current_data:
					current_data = current_data.penalty_cum
				if todays_data and current_data:
					calculated_data[key][alias] = _calculate(key,alias,todays_data,current_data)


	def get(self, request, format="json"):
		if self.from_dt and self.to_dt:
			pass