from rest_framework import serializers

from .models import UserGarminDataEpoch,\
					UserGarminDataSleep,\
					UserGarminDataBodyComposition,\
					UserGarminDataDaily,\
					UserGarminDataActivity,\
					UserGarminDataManuallyUpdated

class UserGarminDataEpochSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	class Meta:
		model = UserGarminDataEpoch
		fields = ('__all__')

class UserGarminDataSleepSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	class Meta:
		model = UserGarminDataSleep
		fields = ('__all__')

class UserGarminDataBodyCompositionSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	class Meta:
		model = UserGarminDataBodyComposition
		fields = ('__all__')

class UserGarminDataDailySerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	class Meta:
		model = UserGarminDataDaily
		fields = ('__all__')

class UserGarminDataActivitySerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	class Meta:
		model = UserGarminDataActivity
		fields = ('__all__')

class UserGarminDataManuallyUpdatedSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	class Meta:
		model = UserGarminDataManuallyUpdated
		fields = ('__all__')