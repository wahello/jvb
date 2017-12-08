from datetime import datetime
import ast

from django.db.models import Q 

from rest_framework.views import APIView
from rest_framework import status,generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from . import calculation_helper as hlpr
from .models import Steps

class QuicklookCalculationView(APIView):

	def post(self, request, format="json"):

		user = request.user

		# date range for which quicklook is calculated
		from_dt = self.request.data.get('from_date',None)
		to_dt = self.request.data.get('to_date',None)

		SERIALIZED_DATA = hlpr.create_quick_look(user,from_dt,to_dt)

		return Response(SERIALIZED_DATA,status = status.HTTP_201_CREATED)


class movementConsistencySummary(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)

	def _create_mc_object(self,ql):
		mc = ql.movement_consistency
		obj = {
			"created_at":ql.user_ql.created_at.strftime("%Y-%m-%d"),
			"movement_consistency":ast.literal_eval(mc) if (mc != ''and mc != None) else {} 
		}
		return obj

	def get_queryset(self):
		from_dt = None
		to_dt = None
		y,m,d = map(int,self.request.query_params.get('from_date').split('-'))
		from_dt = datetime(y,m,d,0,0,0)
		if self.request.query_params.get('to_date',None):
			y,m,d = map(int,self.request.query_params.get('to_date').split('-'))
			to_dt = datetime(y,m,d,0,0,0)
		else:
			to_dt = from_dt

		qs = Steps.objects.filter(Q(user_ql__created_at__gte = from_dt.date())&
								  Q(user_ql__created_at__lte = to_dt.date()),
								  user_ql__user = self.request.user)
		return qs

	def get(self, request, format="json"):
		movement_consistency = []
		qs = self.get_queryset()
		for ql in qs:
			movement_consistency.append(self._create_mc_object(ql))

		return Response(movement_consistency, status=status.HTTP_200_OK)