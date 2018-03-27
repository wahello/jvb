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
	UserGarminDataBodyComposition,
	UserGarminDataManuallyUpdated)

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

	def _get_activities_data(self,target_date):
		current_date = str_to_datetime(target_date)
		current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

		start_epoch = current_date_epoch
		end_epoch = current_date_epoch + 86400

		activity_data = get_garmin_model_data(UserGarminDataActivity,
			self.request.user, start_epoch,end_epoch,order_by = '-id')
		manually_updated_activity_data = get_garmin_model_data(UserGarminDataManuallyUpdated,
			self.request.user, start_epoch,end_epoch,order_by = '-id')

		#converting to python objects
		activity_data = [ast.literal_eval(dic) for dic in activity_data]
		manually_updated_activity_data = [ast.literal_eval(dic) for dic
			in manually_updated_activity_data]
		return (activity_data,manually_updated_activity_data)    

	def _create_activity_stat(self,activity_obj):
		
		final_act = {}
		tmp2 = {}
		if activity_obj:
			for k, v in activity_obj.items():
				if k == 'summaryId' or k == 'activityType' or k == 'durationInSeconds' or k == 'averageHeartRateInBeatsPerMinute':
					tmp_dict = {k:v}
					tmp2.update(tmp_dict)
					tmp_dict2 = {activity_obj['summaryId']:tmp2}
					final_act.update(tmp_dict2)
		# print(final_act)
		return final_act
		

	def _get_activities(self,target_date):
		act_data = self._get_activities_data(target_date)
		activity_data = act_data[0]
		manually_updated_act_data = act_data[1]
		final_act_data = {}
		manually_updated_act_data = {dic['summaryId']:dic for dic in manually_updated_act_data}
		manually_edited = lambda x: manually_updated_act_data.get(x.get('summaryId'),x)
		act_obj = {}
		for act in activity_data:
			act_obj = manually_edited(act)
			# print(act_obj)
			finall = self._create_activity_stat(act_obj)
			final_act_data.update(finall)
		# print(final_act_data)
		return final_act_data
			
	

	def get(self, request, format = "json"):
		target_date = request.query_params.get('date',None)
		if target_date:
			sleep_stats = self._get_sleep_stats(target_date)
			have_activities = self._have_activity_record(target_date)
			weight = self._get_weight(target_date)
			activites = self._get_activities(target_date)
			data = {
				"sleep_stats":sleep_stats,
				"have_activities":have_activities,
				"weight":weight,
				"activites":activites,
			}
			return Response(data)
		return Response({})
