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
	cum_days_ohg_got_a = models.PositiveIntegerField(blank=True,null=True)
	cum_days_ohg_got_b = models.PositiveIntegerField(blank=True,null=True)
	cum_days_ohg_got_c = models.PositiveIntegerField(blank=True,null=True)
	cum_days_ohg_got_d = models.PositiveIntegerField(blank=True,null=True)
	cum_days_ohg_got_f = models.PositiveIntegerField(blank=True,null=True)

class NonExerciseStepsCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="non_exercise_steps_cum")
	cum_non_exercise_steps = models.BigIntegerField(blank=True, null=True)
	cum_non_exercise_steps_gpa = models.FloatField(blank=True, null=True)
	cum_total_steps = models.BigIntegerField(blank=True, null=True)
	cum_days_nes_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_nes_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_nes_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_nes_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_nes_got_f = models.PositiveIntegerField(blank=True, null=True)
	cum_days_nes_above_10k = models.PositiveIntegerField(blank=True, null=True)
	cum_days_nes_above_20k = models.PositiveIntegerField(blank=True, null=True)
	cum_days_nes_above_25k = models.PositiveIntegerField(blank=True, null=True)
	cum_days_nes_above_30k = models.PositiveIntegerField(blank=True, null=True)
	cum_days_nes_above_40k = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ts_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ts_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ts_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ts_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ts_got_f = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ts_above_10k = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ts_above_20k = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ts_above_25k = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ts_above_30k = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ts_above_40k = models.PositiveIntegerField(blank=True, null=True)

class SleepPerNightCumulative(models.Model):
	user_cum = models.OneToOneField(CumulativeSum, related_name="sleep_per_night_cum")
	cum_total_sleep_in_hours = models.FloatField(blank=True, null=True)
	cum_overall_sleep_gpa = models.FloatField(blank=True, null=True)
	cum_days_sleep_aid_taken = models.IntegerField(blank=True, null=True)
	cum_deep_sleep_in_hours = models.FloatField(blank=True, null=True)
	cum_awake_duration_in_hours = models.FloatField(blank=True, null=True)
	cum_days_sleep_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_sleep_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_sleep_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_sleep_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_sleep_got_f = models.PositiveIntegerField(blank=True, null=True)

class MovementConsistencyCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="movement_consistency_cum")
	cum_movement_consistency_gpa = models.FloatField(blank=True, null=True)
	cum_movement_consistency_score = models.FloatField(blank=True, null=True)
	cum_total_active_min = models.FloatField(blank=True,null=True)
	cum_sleep_active_min = models.FloatField(blank=True,null=True)
	cum_exercise_active_min = models.FloatField(blank=True,null=True)
	cum_sleep_hours = models.FloatField(blank=True, null=True)
	cum_exercise_hours = models.FloatField(blank=True, null=True)
	cum_days_mcs_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_mcs_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_mcs_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_mcs_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_mcs_got_f = models.PositiveIntegerField(blank=True, null=True)
	cum_days_total_act_min_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_total_act_min_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_total_act_min_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_total_act_min_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_total_act_min_got_f = models.PositiveIntegerField(blank=True, null=True)
	cum_days_act_min_no_sleep_exec_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_act_min_no_sleep_exec_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_act_min_no_sleep_exec_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_act_min_no_sleep_exec_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_act_min_no_sleep_exec_got_f = models.PositiveIntegerField(blank=True, null=True)
	
class ExerciseConsistencyCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="exercise_consistency_cum")
	cum_avg_exercise_day = models.FloatField(blank=True, null=True)
	cum_exercise_consistency_gpa = models.FloatField(blank=True, null=True)
	cum_days_ec_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ec_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ec_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ec_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ec_got_f = models.PositiveIntegerField(blank=True, null=True)
	
class NutritionCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="nutrition_cum")
	cum_prcnt_unprocessed_food_consumed = models.IntegerField(blank=True, null=True)
	cum_prcnt_unprocessed_food_consumed_gpa = models.FloatField(blank=True, null=True)
	cum_days_ufood_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ufood_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ufood_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ufood_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_ufood_got_f = models.PositiveIntegerField(blank=True, null=True)
	
class ExerciseStatsCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="exercise_stats_cum")
	cum_workout_duration_in_hours = models.FloatField(blank=True, null=True)
	cum_workout_effort_level = models.FloatField(blank=True, null=True)
	cum_avg_exercise_hr = models.IntegerField(blank=True, null=True)
	cum_avg_non_strength_exercise_hr = models.IntegerField(blank=True, null=True)
	cum_total_exercise_activities = models.IntegerField(blank=True, null=True)
	cum_total_strength_activities = models.IntegerField(blank=True, null=True)
	cum_vo2_max = models.IntegerField(blank=True, null=True)
	cum_weekly_workout_duration_in_hours = models.FloatField(blank=True,null=True)
	cum_hr_aerobic_duration_hours = models.FloatField(blank=True,null=True)
	cum_hr_anaerobic_duration_hours = models.FloatField(blank=True,null=True)
	cum_hr_below_aerobic_duration_hours = models.FloatField(blank=True,null=True)
	cum_hr_not_recorded_duration_hours = models.FloatField(blank=True,null=True)
	cum_days_workout_dur_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_workout_dur_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_workout_dur_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_workout_dur_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_workout_dur_got_f = models.PositiveIntegerField(blank=True, null=True)

class AlcoholCumulative(models.Model):
	user_cum  = models.OneToOneField(CumulativeSum,related_name="alcohol_cum")
	cum_alcohol_drink_consumed = models.FloatField(blank=True, null=True)
	cum_average_drink_per_week = models.FloatField(blank=True, null=True)
	cum_alcohol_drink_per_week_gpa = models.FloatField(blank=True, null=True)
	cum_days_alcohol_week_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_alcohol_week_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_alcohol_week_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_alcohol_week_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_alcohol_week_got_f = models.PositiveIntegerField(blank=True, null=True)

class OtherStatsCumulative(models.Model):
	user_cum = models.OneToOneField(CumulativeSum, related_name="other_stats_cum")
	cum_resting_hr = models.IntegerField(blank=True, null=True)
	cum_hrr_time_to_99_in_mins = models.FloatField(blank=True, null=True)
	cum_hrr_beats_lowered_in_first_min = models.IntegerField(blank=True, null=True )
	cum_highest_hr_in_first_min = models.IntegerField(blank=True,null=True)
	cum_hrr_lowest_hr_point = models.IntegerField(blank=True, null=True)
	cum_floors_climbed = models.IntegerField(blank=True,null=True)
	cum_hrr_pure_1_min_beats_lowered = models.IntegerField(blank=True,null=True)
	cum_hrr_pure_time_to_99 = models.FloatField(blank=True, null = True)
	cum_hrr_activity_end_hr = models.FloatField(blank=True,null=True)
	cum_days_resting_hr_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_days_resting_hr_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_days_resting_hr_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_days_resting_hr_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_days_resting_hr_got_f = models.PositiveIntegerField(blank=True, null=True)

class SickCumulative(models.Model):
	user_cum = models.OneToOneField(CumulativeSum, related_name="sick_cum")
	cum_days_sick = models.IntegerField(blank=True,null=True)

class StandingCumulative(models.Model):
	user_cum = models.OneToOneField(CumulativeSum, related_name="standing_cum")
	cum_days_stand_three_hour = models.IntegerField(blank=True,null=True)

class TravelCumulative(models.Model):
	user_cum = models.OneToOneField(CumulativeSum, related_name="travel_cum")
	cum_days_travel_away_from_home = models.IntegerField(blank=True,null=True)

class StressCumulative(models.Model):
	user_cum = models.OneToOneField(CumulativeSum, related_name="stress_cum")
	cum_days_low_stress = models.IntegerField(blank=True,null=True)
	cum_days_medium_stress = models.IntegerField(blank=True,null=True)
	cum_days_high_stress = models.IntegerField(blank=True,null=True)
	cum_days_garmin_stress_lvl = models.IntegerField(blank=True,null=True)
	cum_garmin_stress_days_got_a = models.PositiveIntegerField(blank=True, null=True)
	cum_garmin_stress_days_got_b = models.PositiveIntegerField(blank=True, null=True)
	cum_garmin_stress_days_got_c = models.PositiveIntegerField(blank=True, null=True)
	cum_garmin_stress_days_got_d = models.PositiveIntegerField(blank=True, null=True)
	cum_garmin_stress_days_got_f = models.PositiveIntegerField(blank=True, null=True)

class MetaCumulative(models.Model):
	user_cum = models.OneToOneField(CumulativeSum, related_name='meta_cum')
	cum_inputs_reported_days_count = models.IntegerField(blank=True,null=True)
	cum_workout_days_count = models.IntegerField(blank=True,null=True)
	cum_resting_hr_days_count = models.IntegerField(blank=True,null=True)
	cum_effort_level_days_count = models.IntegerField(blank=True,null=True)
	cum_vo2_max_days_count = models.IntegerField(blank=True,null=True)
	cum_avg_exercise_hr_days_count = models.IntegerField(blank=True,null=True)
	cum_hrr_to_99_days_count = models.IntegerField(blank=True,null=True)
	cum_hrr_beats_lowered_in_first_min_days_count = models.IntegerField(
		blank=True, null=True
	)
	cum_highest_hr_in_first_min_days_count = models.IntegerField(
		blank=True, null=True
	)
	cum_hrr_lowest_hr_point_days_count = models.IntegerField(
		blank=True, null=True
	)
	cum_mc_recorded_days_count = models.IntegerField(blank=True,null=True)
	cum_reported_sick_days_count = models.IntegerField(blank=True,null=True)
	cum_reported_stand_three_hours_days_count = models.IntegerField(
		blank=True,null=True)
	cum_reported_stress_days_count = models.IntegerField(blank=True,null=True)
	cum_reported_alcohol_days_count = models.IntegerField(blank=True,null=True)
	cum_hrr_pure_1_minute_beat_lowered_days_count = models.IntegerField(
		blank=True,null=True)
	cum_hrr_pure_time_to_99_days_count = models.IntegerField(
		blank=True,null=True)
	cum_hrr_activity_end_hr_days_count = models.IntegerField(
		blank=True,null=True)
	cum_sleep_reported_days_count = models.IntegerField(blank=True, null=True)
	cum_have_garmin_stress_days_count = models.PositiveIntegerField(
		blank=True,null=True)

class ProgressReportUpdateMeta(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="pa_update_meta"
	)
	requires_update_from = models.DateField(blank=True,null=True)