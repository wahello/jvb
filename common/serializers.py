from rest_framework import serializers
from common.models import UserDataBackfillRequest

class UserRequestSerializer(serializers.ModelSerializer):

	class Meta:
		model=UserDataBackfillRequest
		fields='__all__'

	def create(self,validated_data):
		instance = UserDataBackfillRequest.objects.create(**validated_data)
		return instance

