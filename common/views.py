from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from fitbit.models import FitbitConnectToken
from users.models import GarminToken
from garmin.models import GarminConnectToken


class HaveTokens(APIView):
	'''
	Check availability of garmin connect, garmin health token
	and fitbit tokens for current user
	'''
	permission_classes = (IsAuthenticated,)
	def get(self,request,format="json"):
		have_tokens = {
			"have_garmin_health_token":False,
			"have_garmin_connect_token":False,
			"have_fitbit_token":False
		}

		if GarminToken.objects.filter(user=request.user).exists():
			have_tokens['have_garmin_health_token'] = True
		if GarminConnectToken.objects.filter(user=request.user).exists():
			have_tokens['have_garmin_connect_token'] = True
		if FitbitConnectToken.objects.filter(user=request.user).exists():
			have_tokens['have_fitbit_token'] = True

		if have_tokens['have_garmin_health_token'] or \
						have_tokens['have_garmin_connect_token'] or \
						have_tokens['have_fitbit_token']:
			return Response(have_tokens,status=status.HTTP_200_OK)
