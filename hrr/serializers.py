from rest_framework import serializers

from .models import Hrr

class HrrSerializer(serializers.ModelSerializer):
	user_hrr= serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = Hrr
		fields = ('__all__')