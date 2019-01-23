from rest_framework import serializers
from common.models import UserDataBackfillRequest

class UserRequestSerializer(serializers.ModelSerializer):
	# user = serializers.PrimaryKeyRelatedField(read_only = True)

	class Meta:
		model=UserDataBackfillRequest
		# fields=('id','user','device_type','start_date','end_date','requested_at','status')
		fields='__all__'

	def create(self,validated_data):
		user = self.context['request'].user
		# You cannot access the request.user directly. 
		# You need to access the request object, and then fetch the user attribute.
		# user = self.request.user
		instance = UserDataBackfillRequest.objects.create(**validated_data)
		#validated_data is an OrderedDict and you can see it only after is_valid() == True
		return instance

