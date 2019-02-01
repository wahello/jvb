from rest_framework import serializers

from .models import ExerciseAndReporting,\
					SwimStats,\
					BikeStats,\
					Steps,\
					Sleep,\
					Food,\
					Alcohol,\
					Grades,\
					UserQuickLook

class ExerciseAndReportingSerializer(serializers.ModelSerializer):
	user_ql= serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = ExerciseAndReporting
		fields = ('__all__')
		read_only_fields = ('record_date',)

class SwimStatsSerializer(serializers.ModelSerializer):
	user_ql= serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = SwimStats
		fields = ('__all__')
		read_only_fields = ('record_date',)

class BikeStatsSerializer(serializers.ModelSerializer):
	user_ql = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = BikeStats
		fields = ('__all__')
		read_only_fields = ('record_date',)

class StepsSerializer(serializers.ModelSerializer):
	user_ql = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = Steps
		fields = ('__all__')
		read_only_fields = ('record_date',)

class SleepSerializer(serializers.ModelSerializer):
	user_ql = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = Sleep
		fields = ('__all__')
		read_only_fields = ('record_date',)

class FoodSerializer(serializers.ModelSerializer):
	user_ql = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = Food
		fields = ('__all__')
		read_only_fields = ('record_date',)

class AlcoholSerializer(serializers.ModelSerializer):
	user_ql = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = Alcohol
		fields = ('__all__')
		read_only_fields = ('record_date',)

class GradesSerializer(serializers.ModelSerializer):
	user_ql = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = Grades
		fields = ('__all__')
		read_only_fields = ('record_date',)

class UserQuickLookSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	grades_ql = GradesSerializer()
	exercise_reporting_ql = ExerciseAndReportingSerializer()
	swim_stats_ql = SwimStatsSerializer()
	bike_stats_ql = BikeStatsSerializer()
	steps_ql = StepsSerializer()
	sleep_ql = SleepSerializer()
	food_ql = FoodSerializer()
	alcohol_ql = AlcoholSerializer()

	class Meta:
		model = UserQuickLook
		fields = ('user','created_at','updated_at','grades_ql','exercise_reporting_ql','swim_stats_ql',
				  'bike_stats_ql','steps_ql','sleep_ql','food_ql','alcohol_ql')
	
		read_only_fields = ('created_at','updated_at',)

	def _update_helper(instance, validated_data):
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
		grades_data = validated_data.pop('grades_ql')
		exercise_reporting_data = validated_data.pop('exercise_reporting_ql')
		swim_data = validated_data.pop('swim_stats_ql')
		bike_data = validated_data.pop('bike_stats_ql')
		steps_data = validated_data.pop('steps_ql')
		sleep_data = validated_data.pop('sleep_ql')
		food_data = validated_data.pop('food_ql')
		alcohol_data = validated_data.pop('alcohol_ql')

		user_ql = UserQuickLook.objects.create(user=user, **validated_data)
		Grades.objects.create(user_ql=user_ql, **grades_data)
		ExerciseAndReporting.objects.create(user_ql = user_ql,**exercise_reporting_data)
		SwimStats.objects.create(user_ql = user_ql,**swim_data)
		BikeStats.objects.create(user_ql = user_ql,**bike_data)
		Steps.objects.create(user_ql = user_ql,**steps_data)
		Sleep.objects.create(user_ql = user_ql,**sleep_data)
		Food.objects.create(user_ql = user_ql,**food_data)
		Alcohol.objects.create(user_ql = user_ql,**alcohol_data)

		return user_ql


	def update(self,instance,validated_data):
		grades_data = validated_data.pop('grades_ql')
		exercise_reporting_data = validated_data.pop('exercise_and_reporting')
		swim_data = validated_data.pop('swim_stats')
		bike_data = validated_data.pop('bike_stats')
		steps_data = validated_data.pop('steps')
		sleep_data = validated_data.pop('sleep')
		food_data = validated_data.pop('food')
		alcohol_data = validated_data.pop('alcohol')

		grades_obj = instance.graded_ql
		self._update_helper(grades_obj,grades_data)

		exercise_reporting_obj = instance.exercise_reporting_ql
		self._update_helper(exercise_reporting_obj, exercise_reporting_data)

		swim_obj = instance.swim_stats_ql
		self._update_helper(swim_obj,swim_data)

		bike_obj = instance.bike_stats_ql
		self._update_helper(bike_obj,bike_data)

		steps_obj = instance.steps_ql
		self._update_helper(steps_obj,steps_data)

		sleep_obj = instance.sleep_ql
		self._update_helper(sleep_obj,sleep_data)

		food_obj = instance.food_ql
		self._update_helper(food_obj,food_data)

		alcohol_obj = instance.alcohol_ql
		self._update_helper(alcohol_obj,alcohol_data)

# class DetailSerializer(serializers.ModelSerializer):
# 	user_ql= serializers.PrimaryKeyRelatedField(read_only = True)

# 	class Meta:
# 		model=Detail
# 		fields='__all__'