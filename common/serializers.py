from django.contrib.auth.models import User

from rest_framework import serializers
from common.models import UserDataBackfillRequest

class UserBackfillRequestSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	class Meta:
		model = UserDataBackfillRequest
		fields = '__all__'

	def create(self,validated_data):
		user = User.objects.get(id = self.context['user_id'])
		instance = UserDataBackfillRequest.objects.create(
			user = user,
			**validated_data)
		return instance

