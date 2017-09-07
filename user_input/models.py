from datetime import datetime

from django.db import models
from django.core.validators import MinValueValidator ,MaxValueValidator
from django.contrib.auth.models import User
# Create your models here.

Yes = 'Yes'
No = 'No'
Low = 'Low'
High = 'High'
Medium = 'Medium'

class UserDailyInput(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True,unique=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        dtime = str(self.created_at)
        return "{}-{}".format(self.user.username,dtime)

class DailyUserInputStrong(models.Model):
    Easy = 'Easy'
    Hard = 'Hard'
    work_out_Easy_or_hard_choices = (
    (Easy,'Easy'),
    (Hard,'Hard'),
    )
    number_alcohol_choice = (
        (0,'0'),(0.5,'0.5'),(1,'1'),(1.5,'1.5'),(2,'2'),
        (2.5,'2.5'),(3,'3'),(3.5,'3.5'),(4,'4'),(4.5,'4.5'),
        (5,'5'),(5.5,'5.5'),(6,'6'),(6.5,'6.5'),(7,'7'),
        (7.5,'7.5'),(8,'8'),(8.5,'8.5'),(9,'9'),(9.5,'9.5'),
        (10,'10'),
    )
    sleep_aids_last_night_choices = (
        (Yes,'Yes'),
        (No,'No'),
    )

    user_input = models.OneToOneField(UserDailyInput,related_name='strong_input')
    work_out_easy_or_hard = models.CharField(max_length=4,choices=work_out_Easy_or_hard_choices)
    work_out_effort_level = models.IntegerField(validators=[MinValueValidator(1),MaxValueValidator(10)])
    unprocessed_food_consumed_yesterday = models.FloatField(validators=[MinValueValidator(0),MaxValueValidator(100)])
    number_of_alcohol_consumed_yesterday = models.FloatField(max_length=2,choices=number_alcohol_choice)
    sleep_aids_last_night =  models.CharField(max_length=4,choices=sleep_aids_last_night_choices)
    prescription_or_non_prescription_sleep_aids_last_night =  models.CharField(max_length=4,blank=True,null =True,default = None,choices=sleep_aids_last_night_choices)
    smoke_any_substances_whatsoever = models.CharField(max_length=4,blank=True,null =True,default = None,choices=sleep_aids_last_night_choices)
    medications_or_controlled_substances_yesterday= models.CharField(max_length=4,blank=True,null =True,default = None,choices=sleep_aids_last_night_choices)

class DailyUserInputEncouraged(models.Model):
    NECK = 'neck'
    LEG = 'leg'
    stress_level_choices =  (
        ( Low,'Low'),
        ( Medium,'Medium'),
        ( High,'High'),
    )

    choice = (
    (Yes,'Yes'),
    (No,'No'),
    )

    PAIN_AREA_CHOICE = (
        (NECK, 'Neck'),
        (LEG, 'Leg')
    )
    user_input = models.OneToOneField(UserDailyInput, related_name='encouraged_input')
    stress_level_yesterday = models.CharField(max_length=4,choices = stress_level_choices)
    pains_twings_during_or_after_your_workout =models.CharField(max_length=4,choices = choice)
    water_consumed_during_workout = models.IntegerField(validators=[MinValueValidator(1),MaxValueValidator(250)])
    workout_that_user_breathed_through_nose = models.FloatField(validators=[MinValueValidator(0),MaxValueValidator(100)])
    pain_area = models.CharField(max_length=10, choices = PAIN_AREA_CHOICE)



class DailyUserInputOptional(models.Model):
    choice = (
        (Yes,'Yes'),
        (No,'No'),
    )
    user_input = models.OneToOneField(UserDailyInput, related_name='optional_input')
    list_of_processed_food_consumed_yesterday = models.CharField(max_length=264)
    chia_seeds_consumed_during_workout = models.IntegerField(validators = [MinValueValidator(0),MaxValueValidator(20)])
    fasted_during_workout = models.CharField(max_length=264,choices = choice)
    general_Workout_Comments = models.CharField( max_length = 256 )
    weight = models.FloatField(validators = [MinValueValidator(30),MaxValueValidator(500)])
    waist_size =models.FloatField(validators = [MinValueValidator(20),MaxValueValidator(60)])
    clothes_size = models.FloatField( validators = [MinValueValidator(1),MaxValueValidator(15)])
    heart_rate_variability = models.FloatField(validators = [MinValueValidator(1),MaxValueValidator(100)])
    sick = models.CharField(max_length = 3, choices = choice)
    sick_comment = models.CharField(max_length=250,blank=True)
    stand_for_three_hours = models.CharField(max_length=3, choices=choice)
    percent_breath_nose_last_night = models.FloatField(validators = [MinValueValidator(1),MaxValueValidator(100)])
    percent_breath_nose_all_day_not_exercising = models.FloatField(validators = [MinValueValidator(1),MaxValueValidator(100)])


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