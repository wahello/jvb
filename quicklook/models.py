# Changed all TimeField() with CharField() to resolve
# timezone issue in Postgres on server (have to resolve this)

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator ,MaxValueValidator

class UserQuickLook(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	created_at = models.DateField()
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
	    dtime = str(self.created_at)                                     
	    return "{}-{}".format(self.user.username,dtime)
	    
	class Meta:
		unique_together = ("user", "created_at")

class Grades(models.Model,):
	GRADE_CHOICES = (
		('A','A'),
		('B','B'),
		('C','C'),
		('D','D'),
		('F','F'),
		('N/A','N/A')
	)

	user_ql = models.OneToOneField(UserQuickLook, related_name = "grades_ql")
	overall_health_grade = models.CharField(choices=GRADE_CHOICES, max_length=3,blank=True)
	overall_health_gpa = models.FloatField(blank=True,null=True)
	movement_non_exercise_steps_grade = models.CharField(choices=GRADE_CHOICES,
														 max_length=3,blank=True)
	movement_non_exercise_steps_gpa = models.FloatField(blank=True,null=True)
	movement_consistency_grade = models.CharField(choices=GRADE_CHOICES, max_length=3, blank=True)
	avg_sleep_per_night_grade = models.CharField(choices=GRADE_CHOICES, max_length=3, blank=True)
	avg_sleep_per_night_gpa = models.FloatField(blank=True,null=True)
	exercise_consistency_grade = models.CharField(choices=GRADE_CHOICES, max_length=3, blank=True)
	exercise_consistency_score = models.FloatField(blank=True, null=True)
	overall_workout_grade = models.CharField(choices=GRADE_CHOICES, max_length=3,blank=True)
	overall_workout_gpa = models.FloatField(blank=True, null=True)
	workout_duration_grade = models.CharField(choices=GRADE_CHOICES, max_length=3,blank=True)
	workout_duration_gpa = models.FloatField(blank=True, null=True)
	workout_effortlvl_grade = models.CharField(choices=GRADE_CHOICES, max_length=3,blank=True)
	workout_effortlvl_gpa = models.FloatField(blank=True, null=True)
	avg_exercise_hr_grade = models.CharField(choices=GRADE_CHOICES, max_length=3,blank=True)
	avg_exercise_hr_gpa = models.FloatField(blank=True, null=True)
	prcnt_unprocessed_food_consumed_grade = models.CharField(choices=GRADE_CHOICES,
															 max_length=3, blank=True)
	prcnt_unprocessed_food_consumed_gpa = models.FloatField(blank=True, null=True)
	alcoholic_drink_per_week_grade = models.CharField(choices=GRADE_CHOICES, max_length=3,blank=True)
	alcoholic_drink_per_week_gpa = models.FloatField(blank=True,null=True)
	sleep_aid_penalty = models.FloatField(blank=True, null=True)
	ctrl_subs_penalty = models.FloatField(blank=True, null=True)
	smoke_penalty = models.FloatField(blank=True, null=True)

class ExerciseAndReporting(models.Model):
	Low = 'low'
	Medium = 'medium'
	High = 'high'

	Yes = 'yes'
	No = 'no'

	Easy = 'easy'
	MEDIUM = 'medium'
	Hard = 'hard'

	TR = 'trademil run'
	OR = 'outdoor run'
	Bike = 'bike'
	Swim = 'swim'
	Elliptical = 'elliptical'

	CS = 'controlled substances'
	ID = 'illicit drugs'
	SA = 'sleep aids'

	STRESS_LEVEL_CHOICES =  (
        ( Low,'low'),
        ( Medium,'medium'),
        ( High,'high'),
    )

	WORKOUT_TYPE = (
		(TR, 'Trademil Run'),
		(OR, 'Outdoor Run'),
		(Bike, 'Bike'),
		(Swim, 'Swim'),
		(Elliptical, 'Elliptical'),
	)

	EH_CHOICES = (
		(Easy, 'Easy'),
		(MEDIUM,'Medium'),
		(Hard, 'Hard'),
	)

	YN_CHOICES = (
		(Yes, 'Yes'),
		(No, 'No'),
	)

	DRUGS = (
		(CS,'Controlled Substances'),
		(ID, 'Illicit Drugs'),
		(SA, 'Sleep Aids')
	)

	user_ql = models.OneToOneField(UserQuickLook, related_name = "exercise_reporting_ql")
	did_workout = models.CharField(choices = YN_CHOICES,max_length=10, blank=True) 
	workout_easy_hard = models.CharField(choices=EH_CHOICES, max_length=10, blank=True)
	workout_type = models.CharField(choices=WORKOUT_TYPE, max_length=20, blank=True)

	workout_time = models.CharField(max_length=10, blank=True)
	# workout_time = models.TimeField()

	workout_location = models.TextField(blank=True)

	workout_duration = models.CharField(max_length=10,blank=True)
	# workout_duration = models.TimeField()
	maximum_elevation_workout = models.IntegerField(blank=True,null=True)

	minutes_walked_before_workout = models.CharField(max_length=10,blank=True)
	# minutes_walked_before_workout = models.TimeField()
	distance_run = models.FloatField(blank=True,null=True)
	distance_bike = models.FloatField(blank=True,null=True)
	distance_swim = models.FloatField(blank=True,null=True)
	distance_other = models.FloatField(blank=True,null=True)

	pace = models.CharField(max_length=10,blank=True)
	# pace = models.TimeField()

	avg_heartrate = models.TextField(blank=True)
	activities_duration = models.TextField(blank=True) 
	avg_exercise_heartrate = models.FloatField(blank=True,null=True)
	elevation_gain = models.IntegerField(blank=True,null=True)
	elevation_loss = models.IntegerField(blank=True,null=True)
	effort_level = models.PositiveIntegerField(blank=True,null=True)
	dew_point = models.FloatField(blank=True,null=True)
	temperature = models.FloatField(blank=True,null=True)
	humidity = models.FloatField(blank=True,null=True)
	temperature_feels_like = models.FloatField(blank=True,null=True)
	wind = models.FloatField(blank=True,null=True)

	hrr_time_to_99  = models.CharField(max_length=10,blank=True)
	hrr_starting_point = models.IntegerField(blank=True,null=True)
	hrr_beats_lowered_first_minute = models.IntegerField(blank=True,null=True)
	resting_hr_last_night = models.IntegerField(blank=True,null=True)
	lowest_hr_during_hrr = models.IntegerField(blank=True, null=True)
	highest_hr_first_minute = models.IntegerField(blank=True, null=True)

	vo2_max = models.FloatField(blank=True,null=True)
	running_cadence = models.IntegerField(blank=True,null=True)
	nose_breath_prcnt_workout = models.FloatField(
		validators=[MinValueValidator(0),MaxValueValidator(100)],
		blank=True,null=True)
	water_consumed_workout = models.FloatField(blank=True,null=True)
	chia_seeds_consumed_workout = models.IntegerField(
		validators = [MinValueValidator(0),MaxValueValidator(20)],
		blank=True,null=True)
	fast_before_workout = models.CharField(choices= YN_CHOICES, max_length=3,blank=True)
	pain = models.CharField(choices=YN_CHOICES, max_length=3, blank=True)
	pain_area = models.TextField(blank=True)
	stress_level = models.CharField(choices=STRESS_LEVEL_CHOICES, max_length=6,
									blank=True)
	sick = models.CharField(choices=YN_CHOICES, max_length=3,blank=True)
	drug_consumed = models.CharField(choices=YN_CHOICES, max_length=3, blank=True)
	drug = models.TextField(blank=True)
	medication = models.TextField(blank=True)
	smoke_substance = models.CharField(choices=YN_CHOICES, max_length=3,blank=True)
	exercise_fifteen_more = models.CharField(choices=YN_CHOICES, max_length=3,blank=True)

	workout_elapsed_time = models.CharField(max_length=10,blank=True)
	# workout_elapsed_time = models.TimeField()

	timewatch_paused_workout = models.CharField(max_length=10,blank=True)	
	# timewatch_paused_workout = models.TimeField()

	exercise_consistency = models.FloatField(validators=[MinValueValidator(0),MaxValueValidator(7)],
											 blank=True,null=True)
	heartrate_variability_stress =  models.IntegerField(blank=True,null=True)
	fitness_age = models.IntegerField(blank=True,null=True)
	workout_comment = models.TextField(blank=True)

class SwimStats(models.Model):
	user_ql = models.OneToOneField(UserQuickLook, related_name = "swim_stats_ql")
	pace_per_100_yard = models.FloatField(blank=True,null=True)
	total_strokes = models.IntegerField(blank=True,null=True) 

class BikeStats(models.Model):
	user_ql = models.OneToOneField(UserQuickLook, related_name = "bike_stats_ql")
	avg_speed = models.FloatField(blank=True,null=True)
	avg_power = models.FloatField(blank=True,null=True)
	avg_speed_per_mile = models.FloatField(blank=True,null=True)
	avg_cadence = models.FloatField(blank=True,null=True)

class Steps(models.Model):
	user_ql = models.OneToOneField(UserQuickLook, related_name = "steps_ql")
	non_exercise_steps = models.PositiveIntegerField(blank=True,null=True)
	exercise_steps = models.PositiveIntegerField(blank=True,null=True)
	total_steps = models.PositiveIntegerField(blank=True,null=True)
	floor_climed = models.PositiveIntegerField(blank=True,null=True)
	movement_consistency = models.TextField(blank=True)

class Sleep(models.Model):
	Yes = 'yes'
	No = 'no'
	
	YN_CHOICES = (
		(Yes, 'Yes'),
		(No, 'No'),
	)

	user_ql = models.OneToOneField(UserQuickLook, related_name = "sleep_ql")

	sleep_per_wearable = models.CharField(max_length=10,blank=True)
	# sleep_per_wearable = models.TimeField()

	sleep_per_user_input = models.CharField(blank=True,max_length=10)
	# sleep_per_user_input = models.TimeField(blank=True,null=True)

	sleep_aid = models.CharField(choices=YN_CHOICES, max_length=3,blank=True)
	
	# TODO : AM or PM should be taken care
	sleep_bed_time = models.CharField(max_length=20,blank=True)
	sleep_awake_time = models.CharField(max_length=20,blank=True)
	deep_sleep = models.CharField(max_length=10,blank=True)
	light_sleep = models.CharField(max_length=10,blank=True)
	awake_time = models.CharField(max_length=10,blank=True)
	sleep_comments = models.TextField(blank=True)
	rem_sleep = models.CharField(max_length=10,blank=True)

	# sleep_bed_time = models.TimeField()
	# sleep_awake_time = models.TimeField()
	# deep_sleep = models.TimeField()
	# light_sleep = models.TimeField()
	# awake_time = models.TimeField()

class Food(models.Model):
	user_ql = models.OneToOneField(UserQuickLook, related_name = "food_ql")
	prcnt_non_processed_food = models.FloatField(validators=[
		MinValueValidator(0),MaxValueValidator(100)],
		blank=True,null=True)

	non_processed_food = models.TextField(blank=True)
	processed_food = models.TextField(blank=True)

	# choices are not provided, will be choice field in the future
	diet_type = models.TextField(blank=True)


class Alcohol(models.Model):
	user_ql = models.OneToOneField(UserQuickLook, related_name = "alcohol_ql")
	alcohol_day = models.CharField(max_length = 4,blank=True)
	alcohol_week = models.FloatField(blank=True,null=True)



