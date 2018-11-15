from rest_framework import serializers

from fitbit.models import UserFitbitLastSynced

class UserFitbitLastSyncedSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	class Meta:
		model = UserFitbitLastSynced
		fields = ('__all__')