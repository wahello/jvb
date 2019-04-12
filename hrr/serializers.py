from datetime import date
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

	def _update_helper(self,instance, validated_data):
		'''
		This function will iterate all fields of given instance
		and update them with new data (if present) otherwise 
		with old data
		'''

		fields = [f.name for f in instance._meta._get_fields()]
		for f in fields:
			setattr(instance,f,
					validated_data.get(f,getattr(instance,f)))
		instance.save()

	def get_user_age(self, obj):
		current_user = obj.user_hrr
		return current_user.profile.age()

	class Meta:
		model = Hrr
		fields = ('__all__')
	
	def update(self, instance, validated_data):
		self._update_helper(instance,validated_data)
		return instance

	def create(self, validated_data):
		user = self.context['request'].user
		hrr_obj = Hrr.objects.create(user_hrr=user,**validated_data)
		return hrr_obj