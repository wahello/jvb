from rest_framework import serializers

from .models import AaCalculations, TimeHeartZones

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