from progress_analyzer.helpers.cumulative_helper import create_cum_raw_data


class ToOverallHealthGradeCumulative(object):
	def __init__(self,raw_data):
		self.cum_total_gpa_point = raw_data["cum_total_gpa_point"]
		self.cum_overall_health_gpa_point = raw_data["cum_overall_health_gpa_point"]
		self.rank = raw_data["rank"]

class ToNonExerciseStepsCumulative(object):
	def __init__(self,raw_data):
		self.cum_non_exercise_steps = raw_data["cum_non_exercise_steps"]
		self.cum_non_exercise_steps_gpa = raw_data["cum_non_exercise_steps_gpa"]
		self.cum_total_steps = raw_data["cum_total_steps"]
		self.rank = raw_data["rank"]

class ToSleepPerNightCumulative(object):
	def __init__(self,raw_data):
		self.cum_total_sleep_in_hours = raw_data["cum_total_sleep_in_hours"]
		self.cum_overall_sleep_gpa = raw_data["cum_overall_sleep_gpa"]
		self.rank = raw_data["rank"]

class ToMovementConsistencyCumulative(object):
	def __init__(self,raw_data):
		self.cum_movement_consistency_gpa = raw_data["cum_movement_consistency_gpa"]
		self.cum_movement_consistency_score = raw_data["cum_movement_consistency_score"]
		self.rank = raw_data["rank"]

class ToExerciseConsistencyCumulative(object):
	def __init__(self,raw_data):
		self.cum_avg_exercise_day = raw_data["cum_avg_exercise_day"]
		self.cum_exercise_consistency_gpa = raw_data["cum_exercise_consistency_gpa"]
		self.rank = raw_data["rank"]

class ToNutritionCumulative(object):
	def __init__(self,raw_data):
		self.cum_prcnt_unprocessed_food_consumed = raw_data["cum_prcnt_unprocessed_food_consumed"]
		self.cum_prcnt_processed_food_consumed_gpa = raw_data["cum_prcnt_processed_food_consumed_gpa"]
		self.rank = raw_data["rank"]

class ToExerciseStatsCumulative(object):
	def __init__(self,raw_data):
		self.cum_workout_duration_in_hours = raw_data["cum_workout_duration_in_hours"]
		self.cum_workout_effort_level = raw_data["cum_workout_effort_level"]
		self.cum_avg_exercise_hr = raw_data["cum_avg_exercise_hr"]
		self.cum_overall_workout_gpa = raw_data["cum_overall_workout_gpa"]
		self.cum_overall_exercise_gpa = raw_data["cum_overall_exercise_gpa"]
		self.rank = raw_data["rank"]
		self.overall_exercise_rank = raw_data["overall_exercise_rank"]

class ToAlcoholCumulative(object):
	def __init__(self,raw_data):
		self.cum_average_drink_per_week = raw_data["cum_average_drink_per_week"]
		self.cum_alcohol_drink_per_week_gpa = raw_data["cum_alcohol_drink_per_week_gpa"]
		self.rank = raw_data["rank"]

class ToPenaltyCumulative(object):
	def __init__(self,raw_data):
		self.cum_sleep_aid_penalty = raw_data["cum_sleep_aid_penalty"]
		self.cum_controlled_subs_penalty = raw_data["cum_controlled_subs_penalty"]
		self.cum_smoking_penalty = raw_data["cum_smoking_penalty"]

class ToCumulativeSum(object):
	'''
	Convert a quicklook object to cumulative sum object
	'''
	def __init__(self,ql_obj,cum_obj=None):

		cum_raw_data = create_cum_raw_data(ql_obj,cum_obj)

		self.overall_health_grade_cum = ToOverallHealthGradeCumulative(
			cum_raw_data["overall_health_grade_cum"]
		)
		self.non_exercise_steps_cum = ToNonExerciseStepsCumulative(
			cum_raw_data["non_exercise_steps_cum"]
		)
		self.sleep_per_night_cum = ToSleepPerNightCumulative(
			cum_raw_data["sleep_per_night_cum"]
		)
		self.movement_consistency_cum = ToMovementConsistencyCumulative(
			cum_raw_data["movement_consistency_cum"]
		)
		self.exercise_consistency_cum = ToExerciseConsistencyCumulative(
			cum_raw_data["exercise_consistency_cum"]
		)
		self.nutrition_cum = ToNutritionCumulative(
			cum_raw_data["nutrition_cum"]
		)
		self.exercise_stats_cum = ToExerciseStatsCumulative(
			cum_raw_data["exercise_stats_cum"]
		)
		self.alcohol_cum = ToAlcoholCumulative(
			cum_raw_data["alcohol_cum"]
		)
		self.penalty_cum = ToPenaltyCumulative(
			cum_raw_data["penalty_cum"]
		)