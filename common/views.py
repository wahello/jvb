from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from garmin.serializers import UserLastSyncedSerializer
from fitbit.serializers import UserFitbitLastSyncedSerializer

from garmin.models import UserLastSynced,GarminConnectToken
from fitbit.models import UserFitbitLastSynced,FitbitConnectToken
from users.models import GarminToken
from quicklook.calculations.calculation_driver import which_device

class UserLastSyncedItemview(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = UserLastSyncedSerializer

	def get(self,request, format=None):
		user = self.request.user
		device_type = which_device(user)
		if device_type == 'garmin':
			queryset = UserLastSynced.objects.all()
			try:
				last_synced_obj = queryset.get(user=self.request.user)
				if last_synced_obj:
					serializer = UserLastSyncedSerializer(last_synced_obj)
					return Response(serializer.data,status=status.HTTP_200_OK)
				else:
					return Response({})
			except UserLastSynced.DoesNotExist as e:
				return Response({})
		elif  device_type == 'fitbit':
			queryset = UserFitbitLastSynced.objects.all()
			try:
				last_synced_obj = queryset.get(user=self.request.user)
				if last_synced_obj:
					serializer = UserFitbitLastSyncedSerializer(last_synced_obj)
					new_data = {}
					new_data["last_synced"] = serializer.data["last_synced_fitbit"]
					new_data.update(serializer.data)
					new_data.pop("last_synced_fitbit")
					return Response(new_data,status=status.HTTP_200_OK)
				else:
					return Response({})
			except UserFitbitLastSynced.DoesNotExist as e:
				return Response({})

		else:
			return Response({})

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