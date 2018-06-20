from rest_framework import serializers
from registration.models import Profile
from django.contrib.auth.models import User

from .models import Hrr

class HrrSerializer(serializers.ModelSerializer):
	user_hrr= serializers.PrimaryKeyRelatedField(read_only = True)
	age = serializers.SerializerMethodField('get_user_age')

	def get_user_age(self, obj):
		current_user = self.context['request'].user
		return current_user.profile.age()

	class Meta:
		model = Hrr
		fields = ('__all__')