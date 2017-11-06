# Changed all TimeField() with CharField() to resolve
# timezone issue in Postgres on server (have to resolve this)

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator ,MaxValueValidator

class UserQuickLook(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	created_at = models.DateField(auto_now_add=True,unique=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
	    dtime = str(self.created_at)
	    return "{}-{}".format(self.user.username,dtime)

class Grades(models.Model):
	GRADE_CHOICES = (
		('A','A'),
		('B','B'),
		('C','C'),
		('D','D'),
		('F','F'),
	)

	user_ql = models.OneToOneField(UserQuickLook, related_name = "grades_ql")
	overall_truth_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	overall_truth_health_gpa = models.FloatField(validators=[
								MinValueValidator(0),MaxValueValidator(4)])
	movement_non_exercise_steps_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	movement_consistency_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	avg_sleep_per_night_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	exercise_consistency_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	overall_workout_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	prcnt_unprocessed_food_consumed_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	alcoholic_drink_per_week_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	penalty = models.CharField(choices=GRADE_CHOICES, max_length=1)

class ExerciseAndReporting(models.Model):
	Low = 'low'
	Medium = 'medium'
	High = 'high'

	Yes = 'yes'
	No = 'no'

	Easy = 'easy'
	Hard = 'hard'

	TR = 'trademil run'
	OR = 'outdoor run'
	Bike = 'bike'
	Swim = 'swim'
	Elliptical = 'elliptical'

	CS = 'controlled substances'
	ID = 'illicit drugs'
	SA = 'sleep aids'

	GRADE_CHOICES = (
		('A','A'),
		('B','B'),
		('C','C'),
		('D','D'),
		('F','F'),
	)

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
	workout_easy_hard = models.CharField(choices=EH_CHOICES, max_length=4)
	workout_type = models.CharField(choices=WORKOUT_TYPE, max_length=20)

	workout_time = models.CharField(max_length=10)
	# workout_time = models.TimeField()

	workout_location = models.CharField(max_length=100)

	workout_duration = models.CharField(max_length=10)
	# workout_duration = models.TimeField()
	maximum_elevation_workout = models.IntegerField()

	minutes_walked_before_workout = models.CharField(max_length=10)
	# minutes_walked_before_workout = models.TimeField()
	distance = models.FloatField()

	pace = models.CharField(max_length=10)
	# pace = models.TimeField()

	avg_heartrate = models.PositiveIntegerField()
	elevation_gain = models.IntegerField()
	elevation_loss = models.IntegerField()
	effort_level = models.PositiveIntegerField()
	dew_point = models.PositiveIntegerField()
	temperature = models.FloatField()
	humidity = models.FloatField(validators=[MinValueValidator(0),MaxValueValidator(100)])
	temperature_feels_like = models.FloatField()
	wind = models.FloatField()

	hrr  = models.CharField(max_length=10)
	# hrr  = models.TimeField()

	hrr_start_point = models.IntegerField()
	hrr_beats_lowered = models.IntegerField()
	sleep_resting_hr_last_night = models.IntegerField()
	vo2_max = models.IntegerField()
	running_cadence = models.IntegerField()
	nose_breath_prcnt_workout = models.FloatField(
		validators=[MinValueValidator(0),MaxValueValidator(100)])
	water_consumed_workout = models.FloatField()
	chia_seeds_consumed_workout = models.IntegerField(
		validators = [MinValueValidator(0),MaxValueValidator(20)])
	fast_before_workout = models.CharField(choices= YN_CHOICES, max_length=3)
	pain = models.CharField(choices=YN_CHOICES, max_length=3)
	pain_area = models.CharField(max_length=20, blank=True)
	stress_level = models.CharField(choices=STRESS_LEVEL_CHOICES, max_length=6)
	sick = models.CharField(choices=YN_CHOICES, max_length=3)
	drug_consumed = models.CharField(choices=YN_CHOICES, max_length=3)
	drug = models.CharField(choices = DRUGS, max_length=30,blank=True)
	medication = models.TextField()
	smoke_substance = models.CharField(choices=YN_CHOICES, max_length=3)
	exercise_fifteen_more = models.CharField(choices=YN_CHOICES, max_length=3)

	workout_elapsed_time = models.CharField(max_length=10)
	# workout_elapsed_time = models.TimeField()

	timewatch_paused_workout = models.CharField(max_length=10)	
	# timewatch_paused_workout = models.TimeField()

	exercise_consistency = models.FloatField(validators=[MinValueValidator(0),MaxValueValidator(7)])
	workout_duration_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	workout_effortlvl_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	avg_heartrate_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	overall_workout_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	heartrate_variability_grade = models.CharField(choices=GRADE_CHOICES, max_length=1)
	workout_comment = models.CharField(max_length=250)

class SwimStats(models.Model):
	user_ql = models.OneToOneField(UserQuickLook, related_name = "swim_stats_ql")
	pace_per_100_yard = models.FloatField()
	total_strokes = models.IntegerField() 

class BikeStats(models.Model):
	user_ql = models.OneToOneField(UserQuickLook, related_name = "bike_stats_ql")
	avg_speed = models.FloatField()
	avg_power = models.FloatField()
	avg_speed_per_mile = models.FloatField()
	avg_cadence = models.FloatField()

class Steps(models.Model):
	user_ql = models.OneToOneField(UserQuickLook, related_name = "steps_ql")
	non_exercise_steps = models.PositiveIntegerField()
	exercise_steps = models.PositiveIntegerField()
	total_steps = models.PositiveIntegerField()
	floor_climed = models.PositiveIntegerField()
	floor_decended = models.PositiveIntegerField()
	movement_consistency = models.TextField(blank=True)

class Sleep(models.Model):
	Yes = 'yes'
	No = 'no'
	
	YN_CHOICES = (
		(Yes, 'Yes'),
		(No, 'No'),
	)

	user_ql = models.OneToOneField(UserQuickLook, related_name = "sleep_ql")

	sleep_per_wearable = models.CharField(max_length=10)
	# sleep_per_wearable = models.TimeField()

	sleep_per_user_input = models.CharField(blank=True,max_length=10)
	# sleep_per_user_input = models.TimeField(blank=True,null=True)

	sleep_aid = models.CharField(choices=YN_CHOICES, max_length=3)
	
	# TODO : AM or PM should be taken care
	sleep_bed_time = models.CharField(max_length=10)
	sleep_awake_time = models.CharField(max_length=10)
	deep_sleep = models.CharField(max_length=10)
	light_sleep = models.CharField(max_length=10)
	awake_time = models.CharField(max_length=10)

	# sleep_bed_time = models.TimeField()
	# sleep_awake_time = models.TimeField()
	# deep_sleep = models.TimeField()
	# light_sleep = models.TimeField()
	# awake_time = models.TimeField()

class Food(models.Model):
	GRADE_CHOICES = (
		('A','A'),
		('B','B'),
		('C','C'),
		('D','D'),
		('F','F'),
	)
	user_ql = models.OneToOneField(UserQuickLook, related_name = "food_ql")
	prcnt_non_processed_food = models.FloatField(validators=[
		MinValueValidator(0),MaxValueValidator(100)])
	prcnt_non_processed_food_grade = models.CharField(choices=GRADE_CHOICES,max_length=1)
	non_processed_food = models.TextField()

	# choices are not provided, will be choice field in the future
	diet_type = models.CharField(max_length=50)


class Alcohol(models.Model):
	user_ql = models.OneToOneField(UserQuickLook, related_name = "alcohol_ql")
	alcohol_day = models.FloatField()
	alcohol_week = models.FloatField()