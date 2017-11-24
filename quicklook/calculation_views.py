from datetime import datetime, timedelta, timezone
from collections import OrderedDict
import ast
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from . import calculation_helper as hlpr


from garmin.models import UserGarminDataEpoch

class QuicklookCalculationView(APIView):

	def post(self, request, format="json"):

		user = request.user

		# date range for which quicklook is calculated
		from_dt = self.request.data.get('from_date',None)
		to_dt = self.request.data.get('to_date',None)

		SERIALIZED_DATA = hlpr.create_quick_look(user,from_dt,to_dt)

		return Response(SERIALIZED_DATA,status = status.HTTP_201_CREATED)


class movementConsistencySummary(APIView):
	permission_classes = (IsAuthenticated,)

	def get(self, request, format="json"):
		y,m,d = map(int,request.GET.get('start_date').split('-'))
		start_date_dt = datetime(y,m,d,0,0,0)
		startDateTimeInSeconds = int(start_date_dt.replace(tzinfo=timezone.utc).timestamp())
		user = request.user

		epochs_json = [q.data for q in UserGarminDataEpoch.objects.filter(
                      user=user,
                      record_date_in_seconds__gte=startDateTimeInSeconds,
                      record_date_in_seconds__lte=startDateTimeInSeconds+86400)]

		epochs_json = [ast.literal_eval(dic) for dic in epochs_json]

		movement_consistency = OrderedDict()

		if epochs_json:
			epochs_json = sorted(epochs_json, key=lambda x: int(x.get('startTimeInSeconds')))
			for data in epochs_json:
				if data.get('activityType') == 'WALKING': 
					start_time = data.get('startTimeInSeconds')+ data.get('startTimeOffsetInSeconds')

					date_of_data = datetime.utcfromtimestamp(start_time).strftime("%Y-%m-%d")
					td = timedelta(hours=1)
					hour_start = datetime.utcfromtimestamp(start_time).strftime("%I %p")
					hour_end = (datetime.utcfromtimestamp(start_time)+td).strftime("%I %p")
					time_interval = hour_start+" to "+hour_end

					if not movement_consistency.get(date_of_data,None):
					  movement_consistency[date_of_data] = OrderedDict()

					if not movement_consistency[date_of_data].get(time_interval,None):
					  movement_consistency[date_of_data][time_interval] = {
						"steps":0,
						"status":"inactive"
					  }

					steps_in_interval = movement_consistency[date_of_data][time_interval].get('steps')
					is_active = True if data.get('steps') + steps_in_interval > 300 else False

					movement_consistency[date_of_data][time_interval]['steps']\
						= steps_in_interval + data.get('steps')

					movement_consistency[date_of_data][time_interval]['status']\
						= 'active' if is_active else 'inactive'

			for dt,data in list(movement_consistency.items()):
				active_hours = 0
				inactive_hours = 0
				for interval,values in list(data.items()):
					if values['status'] == 'active': 
						active_hours += 1 
					else:
						inactive_hours += 1
					movement_consistency[dt]['active_hours'] = active_hours
					movement_consistency[dt]['inactive_hours'] = inactive_hours

		return Response(movement_consistency, status=status.HTTP_200_OK)