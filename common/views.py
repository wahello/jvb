from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from garmin.serializers import UserLastSyncedSerializer
from fitbit.serializers import UserFitbitLastSyncedSerializer
from apple.serializers import UserAppleLastSyncedSerializer

import json
from garmin.models import UserLastSynced,GarminConnectToken
from fitbit.models import UserFitbitLastSynced,FitbitConnectToken
from users.models import GarminToken
from quicklook.calculations.calculation_driver import which_device
from .models import UserDataBackfillRequest
from .serializers import UserBackfillRequestSerializer,AACustomRangesSerializer
from apple.models import AppleUser,UserAppleLastSynced

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
		elif  device_type == 'apple':
			queryset = UserAppleLastSynced.objects.all()
			try:
				last_synced_obj = queryset.get(user=self.request.user)
				if last_synced_obj:
					serializer = UserAppleLastSyncedSerializer(last_synced_obj)
					new_data = {}
					new_data["last_synced"] = serializer.data["last_synced_apple"]
					new_data.update(serializer.data)
					new_data.pop("last_synced_apple")
					return Response(new_data,status=status.HTTP_200_OK)
				else:
					return Response({})
			except UserFitbitLastSynced.DoesNotExist as e:
				return Response({})


		else:
			return Response({})

class 	HaveTokens(APIView):
	'''
	Check availability of garmin connect, garmin health token
	and fitbit tokens for current user
	'''
	permission_classes = (IsAuthenticated,)
	def get(self,request,format="json"):
		have_tokens = {
			"linked_devices":False,
			"have_garmin_health_token":False,
			"have_garmin_connect_token":False,
			"have_fitbit_token":False,
			"have_apple_token": False
		}

		if GarminToken.objects.filter(user=request.user).exists():
			have_tokens['have_garmin_health_token'] = True
			have_tokens['linked_devices'] = True
		if GarminConnectToken.objects.filter(user=request.user).exists():
			have_tokens['have_garmin_connect_token'] = True
			have_tokens['linked_devices'] = True
		if FitbitConnectToken.objects.filter(user=request.user).exists():
			have_tokens['have_fitbit_token'] = True
			have_tokens['linked_devices'] = True
		if AppleUser.objects.filter(user=request.user).exists():
			have_tokens['have_apple_token'] = True
			have_tokens['linked_devices'] = True

		return Response(have_tokens,status=status.HTTP_200_OK)


class UserBackfillRequestView(generics.ListCreateAPIView):

	permission_classes = (IsAuthenticated,)
	serializer_class = UserBackfillRequestSerializer

	def get(self,request,*args,**kwargs):
		userrequestmodel=UserDataBackfillRequest.objects.all()
		serializer=UserBackfillRequestSerializer(userrequestmodel,many=True)
		return Response(serializer.data)

	def post(self,request,*args,**kwargs):
		serializer = UserBackfillRequestSerializer(data=request.data,
			context={'user_id':request.user.id})
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data,status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AACustomRangesView(generics.ListCreateAPIView):

	permission_classes = (IsAuthenticated,)
	serializer_class = AACustomRangesSerializer

	def post(self,request,*args,**kwargs):
		serializer = AACustomRangesSerializer(data=request.data,
			context={'user_id':request.user.id})
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data,status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_user_id(request):
	user = request.user
	print(user,"user")
	user = User.objects.get(username=user)
	return JsonResponse({'user_id':user.id})

