from datetime import timezone,timedelta
import ast

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from quicklook.calculation_helper import get_sleep_stats,\
										 str_to_datetime,\
										 get_garmin_model_data,\
										 get_weekly_data

from garmin.models import (UserGarminDataSleep,
	UserGarminDataActivity,
	UserGarminDataBodyComposition)

class GarminData(APIView):
	permission_classes = (IsAuthenticated,)

	def _get_sleep_stats(self,target_date):
		current_date = str_to_datetime(target_date)
		yesterday_date = current_date - timedelta(days=1)
		current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

		start_epoch = current_date_epoch - 86400
		end_epoch = current_date_epoch + 86400
		sleep_data = get_garmin_model_data(UserGarminDataSleep,
			self.request.user, start_epoch,end_epoch,order_by = '-id')
		sleep_data_parsed = get_weekly_data(sleep_data,current_date,yesterday_date)
		todays_sleep_data = sleep_data_parsed[current_date.strftime('%Y-%m-%d')]
		yesterday_sleep_data = sleep_data_parsed[yesterday_date.strftime('%Y-%m-%d')]
		return get_sleep_stats(current_date,yesterday_sleep_data, todays_sleep_data,str_dt=False)

	def _get_weight(self, target_date):
		weight = {
			"value":None,
			"unit":None
		}
		current_date = str_to_datetime(target_date)
		current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

		start_epoch = current_date_epoch
		end_epoch = current_date_epoch + 86400
		todays_weight_data = get_garmin_model_data(UserGarminDataBodyComposition,
			self.request.user, start_epoch,end_epoch,order_by = '-id')

		if todays_weight_data:
			todays_weight_data = [ast.literal_eval(dic) for dic in todays_weight_data]
			weight_value = todays_weight_data[0].get('weightInGrams')
			weight['value'] = weight_value
			weight['unit'] = 'grams'
			return weight
		else:
			return weight

	def _have_activity_record(self, target_date):
		current_date = str_to_datetime(target_date)
		current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())
		start_epoch = current_date_epoch
		end_epoch = current_date_epoch + 86400
		activity_records = get_garmin_model_data(UserGarminDataActivity,
			self.request.user, start_epoch,end_epoch,order_by = '-id')

		return True if activity_records else False

	def get(self, request, format = "json"):
		target_date = request.query_params.get('date',None)
		if target_date:
			sleep_stats = self._get_sleep_stats(target_date)
			have_activities = self._have_activity_record(target_date)
			weight = self._get_weight(target_date)
			data = {
				"sleep_stats":sleep_stats,
				"have_activities":have_activities,
				"weight":weight
			}
			return Response(data)
		return Response({})