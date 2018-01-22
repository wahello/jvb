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

		calculated_data = {
			'total_gpa_point':{d:None for d in self.duration_type},
			'overall_health_gpa':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'overall_health_gpa_grade':{d:None for d in self.duration_type}
		}
		if custom_daterange:
			pass

		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if todays_data and data:
					if key =='total_gpa_point':
						calculated_data[key][alias] = self._get_average(
							todays_data.cum_total_gpa_point,
							data.cum_total_gpa_point,alias)

					if key == 'overall_health_gpa':
						calculated_data[key][alias] = self._get_average(
							todays_data.cum_overall_health_gpa_point,
							data.cum_overall_health_gpa_point,alias)

					if key == 'overall_health_gpa_grade':
						calculated_data[key][alias] = calculation_helper.cal_overall_grade(
							self._get_average(
								todays_data.cum_overall_health_gpa_point,
								data.cum_overall_health_gpa_point,alias
							)
						)

	def _cal_non_exercise_summary(self,custom_daterange = False):
		calculated_data = {
			'non_exercise_steps':{d:None for d in self.duration_type},
			'rank':{d:None for d in self.duration_type},
			'movement_non_exercise_step_grade':{d:None for d in self.duration_type},
			'non_exericse_steps_gpa':{d:None for d in self.duration_type}
		}
		if custom_daterange:
			pass

		todays_data = self.cumulative_datewise_data.get(self.current_date.strftime("%Y-%m-%d"),None)
		for key in calculated_data.keys():
			for alias, dtobj in self._get_duration_datetime(self.current_date):
				data = self.cumulative_datewise_data.get(dtobj.strftime("%Y-%m-%d"),None)
				if todays_data and data:
					if key =='total_gpa_point':
						calculated_data[key][alias] = self._get_average(
							todays_data.cum_total_gpa_point,
							data.cum_total_gpa_point,alias)

					if key == 'overall_health_gpa':
						calculated_data[key][alias] = self._get_average(
							todays_data.cum_overall_health_gpa_point,
							data.cum_overall_health_gpa_point,alias)

					if key == 'overall_health_gpa_grade':
						calculated_data[key][alias] = calculation_helper.cal_overall_grade(
							self._get_average(
								todays_data.cum_overall_health_gpa_point,
								data.cum_overall_health_gpa_point,alias
							)
						)

	def _cal_sleep_summary(self,custom_daterange = False):
		pass

	def _cal_movement_consistency_summary(self,custom_daterange = False):
		pass

	def _cal_exercise_consistency_summary(self,custom_daterange = False):
		pass

	def _cal_nutrition_summary(self, custom_daterange = False):
		pass

	def _cal_exercise_summary(self, custom_daterange = False):
		pass

	def _cal_alcohol_summary(self, custom_daterange = False):
		pass

	def _cal_other_summary(self, custom_daterange = False):
		pass


	def get(self, request, format="json"):
		if self.from_dt and self.to_dt:
			pass