from rest_framework import serializers

from .models import UserDailyInput,\
					DailyUserInputStrong,\
					DailyUserInputEncouraged,\
					DailyUserInputOptional,\
					InputsChangesFromThirdSources,\
					Goals

class DailyUserInputStrongSerializer(serializers.ModelSerializer):
	user_input = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = DailyUserInputStrong
		fields = ('__all__')

class DailyUserInputEncouragedSerializer(serializers.ModelSerializer):
	user_input = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = DailyUserInputEncouraged
		fields = ('__all__')

class DailyUserInputOptionalSerializer(serializers.ModelSerializer):
	user_input = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = DailyUserInputOptional
		fields = ('__all__')

class InputsChangesFromThirdSourcesSerializer(serializers.ModelSerializer):
	user_input = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = InputsChangesFromThirdSources
		fields = ('__all__')

class GoalsSerializer(serializers.ModelSerializer):
	user_input = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = Goals
		fields = ('__all__')

class UserDailyInputSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	strong_input = DailyUserInputStrongSerializer()
	encouraged_input = DailyUserInputEncouragedSerializer()
	optional_input = DailyUserInputOptionalSerializer()
	# third_source_input = InputsChangesFromThirdSourcesSerializer()
	# goals = GoalsSerializer()

	class Meta:
		model = UserDailyInput
		fields = ('user','created_at','updated_at','strong_input','encouraged_input',
				  'optional_input')
		
		# fields = ('user','created_at','updated_at','strong_input','encouraged_input',
		# 		  'optional_input','third_source_input','goals')
	
		read_only_fields = ('created_at','updated_at',)

	def _update_helper(instance, validated_data):
		'''
		This function will iterate all fields of given instance
		and update them with new data (if present) otherwise 
		with old data
		'''

		fields = [f.name for f in instance._meta_get_fields()]
		for f in fields:
			setattr(instance,f,
					validated_data.get(f,getattr(instance,f)))
		instance.save()
	
	def create(self, validated_data):

		user = self.context['request'].user
		strong_data = validated_data.pop('strong_input')
		encouraged_data = validated_data.pop('encouraged_input')
		optional_data = validated_data.pop('optional_input')
		# third_source_data = validated_data.pop('third_source_input')
		# goals_data = validated_data.pop('goals')

		user_input_obj = UserDailyInput.objects.create(user=user,
												  **validated_data)

		DailyUserInputStrong.objects.create(user_input=user_input_obj,
														   **strong_data)

		DailyUserInputEncouraged.objects.create(user_input=user_input_obj,
														   **encouraged_data)

		DailyUserInputOptional.objects.create(user_input=user_input_obj,
														   **optional_data)
		
		# InputsChangesFromThirdSources.objects.create(user_input=user_input_obj,
		# 												   **third_source_data)
		# Goals.objects.create(user_input=user_input_obj,
		# 								 **goals_data)

		return user_input_obj

	def update(self,instance,validated_data):
		strong_data = validated_data.pop('strong')
		encouraged_data = validated_data.pop('encouraged_input')
		optional_data = validated_data.pop('optional_input')
		# third_source_data = validated_data.pop('third_source_input')
		# goals_data = validated_data.pop('goals')

		strong_obj = instance.strong_input
		self._update_helper(strong_obj, strong_data)

		encouraged_obj = instance.encouraged_input
		self._update_helper(encouraged_obj, encouraged_data)

		optional_obj = instance.optional_input
		self._update_helper(optional_obj, optional_data)

		# third_source_obj = instance.third_source_input
		# self._update_helper(third_source_obj, third_source_data)

		# goals_obj = instance.goals
		# self._update_helper(goals_obj, goals_data)