# from datetime import datetime

from django.db import models
from django.core.validators import MinValueValidator ,MaxValueValidator
from django.contrib.auth.models import User
# from django.core.exceptions import ValidationError 
# Create your models here.

YES = 'yes'
NO = 'no'
LOW = 'low'
HIGH = 'high'
MEDIUM = 'medium'

class UserDailyInput(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateField()
    updated_at = models.DateTimeField(auto_now=True)

    # def validate_unique(self, exclude=None):
    #     qs = UserDailyInput.objects.filter(user=self.user,
    #         created_at__contains=self.created_at.date())
    #     if qs:
    #         raise ValidationError('User input for date {} already exist'.format(self.created_at))

    # def save(self, *args, **kwargs):
    #     self.validate_unique()
    #     super(UserDailyInput, self).save(*args, **kwargs)

    def __str__(self):
        dtime = str(self.created_at)
        return "{}-{}".format(self.user.username,dtime)

    class Meta:
        unique_together = ('user', 'created_at')

class DailyUserInputStrong(models.Model):
    EASY = 'easy'
    HARD = 'hard'
    NO_WORKOUT = 'no workout today'

    WORK_OUT_EASY_OR_HARD_CHOICES = (
    (EASY,'Easy'),
    (HARD,'Hard'),
    (NO_WORKOUT,'No Workout Today'),
    )
    NUMBER_ALCOHOL_CHOICE = (
        (0,'0'),(0.5,'0.5'),(1,'1'),(1.5,'1.5'),(2,'2'),
        (2.5,'2.5'),(3,'3'),(3.5,'3.5'),(4,'4'),(4.5,'4.5'),
        (5,'5'),(5.5,'5.5'),(6,'6'),(6.5,'6.5'),(7,'7'),
        (7.5,'7.5'),(8,'8'),(8.5,'8.5'),(9,'9'),(9.5,'9.5'),
        (10,'10'),
    )
    YN_CHOICE = (
        (YES,'Yes'),
        (NO,'No'),
    )

    user_input = models.OneToOneField(UserDailyInput,related_name='strong_input')
    work_out_easy_or_hard = models.CharField(max_length=4,choices=WORK_OUT_EASY_OR_HARD_CHOICES)

    # for work_out_effort_level value 0 means "no workout today"
    workout_effort_level = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(10)])

    hard_portion_workout_effort_level = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(10)], blank=True, null=True)

    prcnt_unprocessed_food_consumed_yesterday = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(100)])

    list_of_unprocessed_food_consumed_yesterday = models.TextField(blank=True)

    number_of_alcohol_consumed_yesterday = models.FloatField(
        max_length=2,choices=NUMBER_ALCOHOL_CHOICE)

    sleep_time_excluding_awake_time = models.CharField(max_length=10)

    prescription_or_non_prescription_sleep_aids_last_night = models.CharField(
        max_length=4,choices=YN_CHOICE)

    sleep_aid_taken = models.TextField(max_length=300, blank=True)

    smoke_any_substances_whatsoever = models.CharField(
        max_length=4, choices=YN_CHOICE)

    smoked_substance = models.TextField(max_length=300, blank=True)

    medications_or_controlled_substances_yesterday= models.CharField(
        max_length=4, choices=YN_CHOICE)

    medications_or_controlled_substances_taken = models.TextField(max_length=300, blank=True)

class DailyUserInputEncouraged(models.Model):

    NO_WORKOUT = 'no workout today'
    
    stress_level_choices =  (
        ( LOW,'Low'),
        ( MEDIUM,'Medium'),
        ( HIGH,'High'),
    )

    YN_CHOICE = (
    (YES,'Yes'),
    (NO,'No'),
    )

    PAIN_CHOICES = (
        (YES,'Yes'),
        (NO,'No'),
        (NO_WORKOUT,'No workout today')
    )

    
    user_input = models.OneToOneField(UserDailyInput, related_name='encouraged_input')
    stress_level_yesterday = models.CharField(max_length=6,choices = stress_level_choices)
    pains_twings_during_or_after_your_workout =models.CharField(max_length=4,choices = PAIN_CHOICES)

    # for water_consumed_during_workout, value 0 means "no workout today"
    water_consumed_during_workout = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(250)])

    # for workout_that_user_breathed_through_nose, value 0 means "no workout today"
    workout_that_user_breathed_through_nose = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(100)])
    
    # expect comma separated one or more body areas 
    # (right foot, left foot, right shins, left shins,no workout today) 
    pain_area = models.TextField(max_length=300, blank=True)



class DailyUserInputOptional(models.Model):

    NO_WORKOUT = 'no workout today'
    VEGAN = 'vegan'
    VEGETARIAN = 'vegetarian'
    PALEO = 'paleo'
    LOW_CARB_HIGH_FAT = 'low carb/high fat'
    OTHER = 'other'

    YN_CHOICE = (
        (YES,'Yes'),
        (NO,'No')
    )

    WORKOUT_ENJOYABLE_CHOICE = (
        (YES,'Yes'),
        (NO,'No'),
        (NO_WORKOUT, 'No Workout Today')
    )

    DIET_TYPE = (
        (VEGAN,'Vegan'),
        (VEGETARIAN,'Vegetarian'),
        (PALEO,'paleo'),
        (LOW_CARB_HIGH_FAT,'Low carb/high fat'),
        (OTHER, 'Other')
    )
    user_input = models.OneToOneField(UserDailyInput, related_name='optional_input')
    list_of_processed_food_consumed_yesterday = models.TextField(blank=True)

    # for chia_seeds_consumed_during_workout, value 0 means "no workout today"
    chia_seeds_consumed_during_workout = models.IntegerField(
        validators = [MinValueValidator(0),MaxValueValidator(20)])

    fasted_during_workout = models.CharField(max_length=3,choices = YN_CHOICE)
    food_ate_before_workout = models.TextField(max_length=300, blank=True)

    # for calories_consumed_during_workout, value -1 means "no workout today"
    calories_consumed_during_workout = models.IntegerField()
    food_ate_during_workout = models.TextField(max_length=300, blank=True)

    workout_enjoyable = models.CharField(max_length=3, choices = WORKOUT_ENJOYABLE_CHOICE)
    general_Workout_Comments = models.TextField( max_length = 300, blank=True )
    weight = models.FloatField(validators = [MinValueValidator(30),MaxValueValidator(500)],
                                blank=True, null=True)
    waist_size =models.IntegerField(validators = [MinValueValidator(20),MaxValueValidator(60)],
        blank=True, null=True)
    clothes_size = models.IntegerField( validators = [MinValueValidator(0),MaxValueValidator(16)],
        blank=True, null=True)

    heart_rate_variability = models.IntegerField(
        validators = [MinValueValidator(1),MaxValueValidator(100)],
        blank=True, null=True)

    sick = models.CharField(max_length = 3, choices = YN_CHOICE)
    sickness = models.TextField(max_length=300,blank=True)
    stand_for_three_hours = models.CharField(max_length=3, choices=YN_CHOICE,
        blank=True)

    percent_breath_nose_last_night = models.IntegerField(
        validators = [MinValueValidator(1),MaxValueValidator(100)])

    percent_breath_nose_all_day_not_exercising = models.IntegerField(
        validators = [MinValueValidator(1),MaxValueValidator(100)])

    type_of_diet_eaten = models.CharField(max_length=100, blank=True)


class InputsChangesFromThirdSources(models.Model):
    user_input = models.OneToOneField(UserDailyInput, related_name='third_source_input')
    resting_heart_rate = models.FloatField( validators = [MinValueValidator(25),MaxValueValidator(125)])
    sleep_time_excluding_awake_time = models.CharField(max_length=264)
    other = models.CharField(max_length=264)
    tbd = models.CharField(max_length=264)

class Goals(models.Model):
    Maintain_overall_health='Maintain overall health'
    improve_health='improve health'
    improve_energy_levels='improve energy levels'
    improve_blood_work_levels='improve blood work levels'
    weight_loss_waist_size_reduction='weight loss/waist size reduction'
    reduce_stress_anxiety='reduce stress/anxiety'
    train_for_a_running_race='train for a running race'
    train_for_a_triathlon='train for a triathlon'
    get_faster_as_an_athlete='get faster as an athlete'
    qualify_for_the_Boston_marathon='qualify for the Boston marathon'
    qualify_for_a_world_level_triathlon_ironman_kona_half_ironman_world_championships ='qualify for a world level triathlon_ironman kona_half ironman world championships'
    completely_transform_my_life='completely transform my life'
    be_proud_to_look_in_the_mirror_again='be proud to look in the mirror again'
    other='other'
    CHOICE =   (
    ( Maintain_overall_health,'Maintain overall health'),
    (improve_health,'improve health'),
     (improve_energy_levels,'improve energy levels'),
     (improve_blood_work_levels,'improve blood work levels'),
     (weight_loss_waist_size_reduction,'weight loss/waist size reduction'),
     (reduce_stress_anxiety,'reduce stress/anxiety'),
     (train_for_a_running_race,'train for a running race'),
     (train_for_a_triathlon,'train for a triathlon'),
     (get_faster_as_an_athlete,'get faster as an athlete'),
     (qualify_for_the_Boston_marathon,'qualify for the Boston marathon'),
     (qualify_for_a_world_level_triathlon_ironman_kona_half_ironman_world_championships,'qualify for a world level triathlon(ironman kona/half ironman world championships)'),
     (completely_transform_my_life,'completely transform my life'),
     (be_proud_to_look_in_the_mirror_again,'be proud to look in the mirror again'),
     (other,'other'),
     )
    user_input = models.OneToOneField(UserDailyInput, related_name='goals')
    goals = models.CharField(max_length=264,choices = CHOICE)
    other = models.CharField(max_length=264,null=True,blank=True)