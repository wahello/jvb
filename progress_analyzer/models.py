from django.db import models
from django.conf import settings

class CumulativeSum(models.Model):
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE
	)
	created_at = models.DateField()
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		dtime = str(self.created_at)
		return "{}-{}".format(self.user.username,dtime)
		
	class Meta:
		unique_together = ("user", "created_at")
		indexes = [
			models.Index(fields=['user', '-created_at']),
			models.Index(fields=['created_at']),
		]

class OverallHealthGradeCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="overall_health_grade_cum")
	cum_total_gpa_point = models.FloatField(blank=True, null=True)
	cum_overall_health_gpa_point = models.FloatField(blank=True, null=True)
	rank = models.BigIntegerField(blank=True, null=True)

class NonExerciseStepsCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="non_exercise_steps_cum")
	cum_non_exercise_steps = models.BigIntegerField(blank=True, null=True)
	cum_non_exercise_steps_gpa = models.FloatField(blank=True, null=True)
	cum_total_steps = models.BigIntegerField(blank=True, null=True)
	rank = models.BigIntegerField(blank=True, null=True)

class SleepPerNightCumulative(models.Model):
	user_cum = models.OneToOneField(CumulativeSum, related_name="sleep_per_night_cum")
	cum_total_sleep_in_hours = models.FloatField(blank=True, null=True)
	cum_overall_sleep_gpa = models.FloatField(blank=True, null=True)
	rank = models.BigIntegerField(blank=True, null=True)

class MovementConsistencyCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="movement_consistency_cum")
	cum_movement_consistency_gpa = models.FloatField(blank=True, null=True)
	cum_movement_consistency_score = models.FloatField(blank=True, null=True)
	rank = models.BigIntegerField(blank=True, null=True)

class ExerciseConsistencyCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="exercise_consistency_cum")
	cum_avg_exercise_day = models.FloatField(blank=True, null=True)
	cum_exercise_consistency_gpa = models.FloatField(blank=True, null=True)
	rank = models.BigIntegerField(blank=True, null=True)

class NutritionCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="nutrition_cum")
	cum_prcnt_unprocessed_food_consumed = models.BigIntegerField(blank=True, null=True)
	cum_prcnt_processed_food_consumed_gpa = models.FloatField(blank=True, null=True)
	rank = models.BigIntegerField(blank=True, null=True)

class ExerciseStatsCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="exercise_stats_cum")
	cum_workout_duration_in_hours = models.FloatField(blank=True, null=True)
	cum_workout_effort_level = models.FloatField(blank=True, null=True)
	cum_avg_exercise_hr = models.BigIntegerField(blank=True, null=True)
	cum_overall_workout_gpa = models.FloatField(blank=True, null=True)
	cum_overall_exercise_gpa = models.FloatField(blank=True, null=True)
	rank = models.BigIntegerField(blank=True, null=True)
	overall_exercise_rank = models.BigIntegerField(blank=True, null=True)

class AlcoholCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="alcohol_cum")
	cum_average_drink_per_week = models.FloatField(blank=True, null=True)
	cum_alcohol_drink_per_week_gpa = models.FloatField(blank=True, null=True)
	rank = models.BigIntegerField(blank=True, null=True)

class PenaltyCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="penalty_cum")
	cum_sleep_aid_penalty = models.FloatField(blank=True, null=True)
	cum_controlled_subs_penalty = models.FloatField(blank=True, null=True)
	cum_smoking_penalty = models.FloatField(blank=True, null=True)