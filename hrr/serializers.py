from django.contrib.auth.models import User
from rest_framework import serializers
from .models import AaCalculations, TimeHeartZones
from registration.models import Profile
from .models import Hrr

class AaSerializer(serializers.ModelSerializer):
	user_aa = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = AaCalculations
		fields = ('__all__')

class HeartzoneSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = TimeHeartZones
		fields = ('__all__')

class HrrSerializer(serializers.ModelSerializer):
	user_hrr= serializers.PrimaryKeyRelatedField(read_only = True)
	age = serializers.SerializerMethodField('get_user_age')

	def get_user_age(self, obj):
		current_user = self.context['request'].user
		return current_user.profile.age()

	class Meta:
		model = Hrr
		fields = ('__all__')