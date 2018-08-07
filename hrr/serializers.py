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

	def get_user_age(self, obj):
		current_user = self.context['request'].user
		return current_user.profile.age()

	class Meta:
		model = Hrr
		fields = ('__all__')

	def update(self, instance, validated_data):
		hrr_keys = ["Did_you_measure_HRR","Did_heartrate_reach_99",
		"time_99","HRR_start_beat","lowest_hrr_1min","No_beats_recovered",
		"end_time_activity","diff_actity_hrr","HRR_activity_start_time",
		"end_heartrate_activity","heart_rate_down_up","pure_1min_heart_beats",
		"pure_time_99","no_fitfile_hrr_reach_99","no_fitfile_hrr_time_reach_99",
		"time_heart_rate_reached_99","lowest_hrr_no_fitfile",
		"no_file_beats_recovered"]
		print("fffffffffffffffffffffffff")
		for hrr_key in hrr_keys:
			instance.hrr_key = validated_data.get(hrr_key, instance.hrr_key)
		instance.created_at = date.now()
		instance.save()
		return instance