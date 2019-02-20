from rest_framework import serializers
from .models import UserAppleDataSteps

class UserAppleDataStepsSerializer(serializers.ModelSerializer):
	"""	This class is for serializing the Apple steps
	"""

	data = serializers.JSONField()
	
	class Meta:
		model = UserAppleDataSteps
		fields = ('user','summary_id','data')

