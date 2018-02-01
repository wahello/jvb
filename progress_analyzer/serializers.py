from rest_framework import serializers

from progress_analyzer.models import CumulativeSum,\
	OverallHealthGradeCumulative, \
	NonExerciseStepsCumulative, \
	SleepPerNightCumulative, \
	MovementConsistencyCumulative, \
	ExerciseConsistencyCumulative, \
	NutritionCumulative, \
	ExerciseStatsCumulative, \
	AlcoholCumulative, \
	PenaltyCumulative

class OverallHealthGradeCumulativeSerializer(serializers.ModelSerializer):
	user_cum = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = OverallHealthGradeCumulative
		fields = ('__all__')

class NonExerciseStepsCumulativeSerializer(serializers.ModelSerializer):
	user_cum = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = NonExerciseStepsCumulative
		fields = ('__all__')

class SleepPerNightCumulativeSerializer(serializers.ModelSerializer):
	user_cum = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = SleepPerNightCumulative
		fields = ('__all__')

class MovementConsistencyCumulativeSerializer(serializers.ModelSerializer):
	user_cum = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = MovementConsistencyCumulative
		fields = ('__all__')

class ExerciseConsistencyCumulativeSerializer(serializers.ModelSerializer):
	user_cum = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = ExerciseConsistencyCumulative
		fields = ('__all__')

class NutritionCumulativeSerializer(serializers.ModelSerializer):
	user_cum = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = NutritionCumulative
		fields = ('__all__')

class ExerciseStatsCumulativeSerializer(serializers.ModelSerializer):
	user_cum = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = ExerciseStatsCumulative
		fields = ('__all__')

class AlcoholCumulativeSerializer(serializers.ModelSerializer):
	user_cum = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = AlcoholCumulative
		fields = ('__all__')

class PenaltyCumulativeSerializer(serializers.ModelSerializer):
	user_cum = serializers.PrimaryKeyRelatedField(read_only = True)
	class Meta:
		model = PenaltyCumulative
		fields = ('__all__')

class CumulativeSumSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	overall_health_grade_cum = OverallHealthGradeCumulativeSerializer()
	non_exercise_steps_cum = NonExerciseStepsCumulativeSerializer()
	sleep_per_night_cum = SleepPerNightCumulativeSerializer()
	movement_consistency_cum = MovementConsistencyCumulativeSerializer()
	exercise_consistency_cum = ExerciseConsistencyCumulativeSerializer()
	nutrition_cum = NutritionCumulativeSerializer()
	exercise_stats_cum = ExerciseStatsCumulativeSerializer()
	alcohol_cum = AlcoholCumulativeSerializer()
	penalty_cum = PenaltyCumulativeSerializer()

	class Meta:
		model = CumulativeSum
		fields = ('user','created_at','updated_at','overall_health_grade_cum','non_exercise_steps_cum',
			'sleep_per_night_cum','movement_consistency_cum','exercise_consistency_cum','nutrition_cum',
			'exercise_stats_cum','alcohol_cum','penalty_cum')
	
		read_only_fields = ('updated_at',)

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
		overall_health_grade_cum_data = validated_data.pop('overall_health_grade_cum')
		non_exercise_steps_cum_data = validated_data.pop('non_exercise_steps_cum')
		sleep_per_night_cum_data = validated_data.pop('sleep_per_night_cum')
		mc_cum_data = validated_data.pop('movement_consistency_cum')
		ec_cum_data = validated_data.pop('exercise_consistency_cum')
		nutrition_cum_data = validated_data.pop('nutrition_cum')
		exercise_stats_cum_data = validated_data.pop('exercise_stats_cum')
		alcohol_cum_data = validated_data.pop('alcohol_cum')
		penalty_cum_data = validated_data.pop('penalty_cum')

		user_cum = CumulativeSum.objects.create(user=user, **validated_data)
		OverallHealthGradeCumulative.objects.create(user_cum=user_cum, **overall_health_grade_cum_data)
		NonExerciseStepsCumulative.objects.create(user_cum=user_cum,**non_exercise_steps_cum_data)
		SleepPerNightCumulative.objects.create(user_cum=user_cum,**sleep_per_night_cum_data)
		MovementConsistencyCumulative.objects.create(user_cum=user_cum,**mc_cum_data)
		ExerciseConsistencyCumulative.objects.create(user_cum=user_cum,**ec_cum_data)
		NutritionCumulative.objects.create(user_cum=user_cum,**nutrition_cum_data)
		ExerciseStatsCumulative.objects.create(user_cum=user_cum,**exercise_stats_cum_data)
		AlcoholCumulative.objects.create(user_cum=user_cum,**alcohol_cum_data)
		PenaltyCumulative.objects.create(user_cum=user_cum,**penalty_cum_data)

		return user_cum


	def update(self,instance,validated_data):
		overall_health_grade_cum_data = validated_data.pop('overall_health_grade_cum')
		non_exercise_steps_cum_data = validated_data.pop('non_exercise_steps_cum')
		sleep_per_night_cum_data = validated_data.pop('sleep_per_night_cum')
		mc_cum_data = validated_data.pop('movement_consistency_cum')
		ec_cum_data = validated_data.pop('exercise_consistency_cum')
		nutrition_cum_data = validated_data.pop('nutrition_cum')
		exercise_stats_cum_data = validated_data.pop('exercise_stats_cum')
		alcohol_cum_data = validated_data.pop('alcohol_cum')
		penalty_cum_data = validated_data.pop('penalty_cum')

		overall_health_grade_obj = instance.overall_health_grade_cum
		self._update_helper(overall_health_grade_obj,overall_health_grade_cum_data)

		non_exercise_steps_obj = instance.non_exercise_steps_cum
		self._update_helper(non_exercise_steps_obj, non_exercise_steps_cum_data)

		sleep_per_night_obj = instance.sleep_per_night_cum
		self._update_helper(sleep_per_night_obj,sleep_per_night_cum_data)

		mc_obj = instance.movement_consistency_cum
		self._update_helper(mc_obj,mc_cum_data)

		ec_obj = instance.exercise_consistency_cum
		self._update_helper(ec_obj,ec_cum_data)

		nutrition_obj = instance.nutrition_cum
		self._update_helper(nutrition_obj,nutrition_cum_data)

		exercise_stat_obj = instance.exercise_stats_cum
		self._update_helper(exercise_stat_obj,exercise_stats_cum_data)

		alcohol_obj = instance.alcohol_cum
		self._update_helper(alcohol_obj,alcohol_cum_data)

		penalty_obj = instance.penalty_cum
		self._update_helper(penalty_obj,penalty_cum_data)

		return instance