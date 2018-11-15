from django.contrib.auth.models import User
from django.core import serializers

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from garmin.serializers import UserLastSyncedSerializer
from fitbit.serializers import UserFitbitLastSyncedSerializer

from garmin.models import UserLastSynced
from fitbit.models import UserFitbitLastSynced

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