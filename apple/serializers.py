from rest_framework import serializers
from apple.models import (UserAppleDataSteps,
						  UserAppleDataActivities,
						  AppleUser)

class UserAppleDataStepsSerializer(serializers.ModelSerializer):
	"""	This class is for serializing the Apple steps
	"""

	data = serializers.JSONField()
	
	class Meta:
		model  = UserAppleDataSteps
		fields = ('user','summary_id','belong_to','data')

class UserAppleDataActivitiesSerializer(serializers.ModelSerializer):
	"""	This class is for serializing the Apple steps
	"""
	data = serializers.JSONField()
	class Meta:
		model   =   UserAppleDataActivities
		fields  =  ('user','belong_to','data')


class AppleUserSerializer(serializers.ModelSerializer):
	"""	This class is for serializing the Apple User Data
	"""
	data = serializers.JSONField()

	class Meta:
		model  = AppleUser
		fields = ('user','status')

