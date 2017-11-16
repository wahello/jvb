import re
from .custom_signals import user_input_post_save,user_input_notify

from rest_framework import serializers

from .models import UserDailyInput,\
					DailyUserInputStrong,\
					DailyUserInputEncouraged,\
					DailyUserInputOptional,\
					InputsChangesFromThirdSources,\
					Goals


class DailyUserInputStrongSerializer(serializers.ModelSerializer):
	user_input = serializers.PrimaryKeyRelatedField(read_only = True)

	def validate(self, data):
		prcnt_food = data['prcnt_unprocessed_food_consumed_yesterday']
		pattern = re.compile("(^\d{1,3}).*")
		if prcnt_food and not pattern.match(prcnt_food):
			raise serializers.ValidationError("not a valid percentage value")

		if prcnt_food:
			prcnt_food = pattern.match(prcnt_food).group(1)
			data['prcnt_unprocessed_food_consumed_yesterday'] = prcnt_food
		return data

	class Meta:
		model = DailyUserInputStrong
		fields = ('__all__')

class DailyUserInputEncouragedSerializer(serializers.ModelSerializer):
	user_input = serializers.PrimaryKeyRelatedField(read_only = True)

	def validate(self, data):
		prcnt_breath = data['workout_that_user_breathed_through_nose']
		pattern = re.compile("(^\d{1,3}).*")
		if (prcnt_breath and prcnt_breath != "no workout today") \
						 and not pattern.match(prcnt_breath):
			raise serializers.ValidationError("not a valid percentage value")

		if prcnt_breath and prcnt_breath != 'no workout today':
			prcnt_breath = pattern.match(prcnt_breath).group(1)
			data['workout_that_user_breathed_through_nose'] = prcnt_breath
		return data

	class Meta:
		model = DailyUserInputEncouraged
		fields = ('__all__')

class DailyUserInputOptionalSerializer(serializers.ModelSerializer):
	user_input = serializers.PrimaryKeyRelatedField(read_only = True)

	def validate(self, data):
		heart_variability = data['heart_rate_variability']
		breath_nose = data['percent_breath_nose_last_night']
		breath_nose_day = data['percent_breath_nose_all_day_not_exercising']

		pattern = re.compile("(^\d{1,3}).*")
		if heart_variability and not pattern.match(heart_variability):
			raise serializers.ValidationError("not a valid percentage value")

		if breath_nose and not pattern.match(breath_nose):
			raise serializers.ValidationError("not a valid percentage value")

		if breath_nose_day and not pattern.match(breath_nose_day):
			raise serializers.ValidationError("not a valid percentage value")

		if heart_variability:
			heart_variability = pattern.match(heart_variability).group(1)
			data['heart_rate_variability'] = heart_variability

		if breath_nose:
			breath_nose = pattern.match(breath_nose).group(1)
			data['percent_breath_nose_last_night'] = breath_nose

		if breath_nose_day:
			breath_nose_day = pattern.match(breath_nose_day).group(1)
			data['percent_breath_nose_all_day_not_exercising'] = breath_nose_day

		return data

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
	
		read_only_fields = ('updated_at',)


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

		#sending signal to calculate quicklook
		user_input_post_save.send(
			sender=self.__class__,
		 	request=self.context['request'],
		 	dt=validated_data['created_at'])

		# send signal to notify admins by sending email about 
		# this newly created userinput 
		user_input_notify.send(
			sender=self.__class__,
			request=self.context['request'],
			instance = user_input_obj,
			created=True)

		return user_input_obj

	def update(self,instance,validated_data):
		strong_data = validated_data.pop('strong_input')
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

		#sending signal to calculate quicklook
		user_input_post_save.send(
			sender=self.__class__,
		 	request=self.context['request'],
		 	dt=validated_data['created_at'])

		return instance