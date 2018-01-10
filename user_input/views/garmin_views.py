from datetime import timezone,timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from quicklook.calculation_helper import get_sleep_stats,\
										 str_to_datetime,\
										 get_garmin_model_data,\
										 get_weekly_data

from garmin.models import UserGarminDataSleep

class GarminData(APIView):
	permission_classes = (IsAuthenticated,)
	def get(self, request, format = "json"):
		target_date = request.query_params.get('date',None)
		print(request.query_params)
		if target_date:
			current_date = str_to_datetime(target_date)
			yesterday_date = current_date - timedelta(days=1)
			current_date_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())

			# sleep data
			start_epoch = current_date_epoch - 86400
			end_epoch = current_date_epoch + 86400
			sleep_data = get_garmin_model_data(UserGarminDataSleep,
				request.user, start_epoch,end_epoch,order_by = '-id')
			sleep_data_parsed = get_weekly_data(sleep_data,current_date,yesterday_date)
			todays_sleep_data = sleep_data_parsed[current_date.strftime('%Y-%m-%d')]
			yesterday_sleep_data = sleep_data_parsed[yesterday_date.strftime('%Y-%m-%d')]
			sleep_stats = get_sleep_stats(yesterday_sleep_data, todays_sleep_data,str_dt=False)
			return Response(sleep_stats)
		return Response({})