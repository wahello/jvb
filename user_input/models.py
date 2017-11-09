# from datetime import datetime
import re
from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator,BaseValidator
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from django.utils.deconstruct import deconstructible

YES = 'yes'
NO = 'no'
LOW = 'low'
HIGH = 'high'
MEDIUM = 'medium'


@deconstructible
class CharMinValueValidator(BaseValidator):
    message = _('Ensure this value is greator than or equal to %(limit_value)s.')
    code = 'min_value'

    def compare(self, a, b):
        if a == 'no workout today':
            return False
        return a < b

    def clean(self, x):
        if x == 'no workout today':
            return x

        pattern = re.compile("(^\d{1,3}).*")
        if x and pattern.match(x):
            return int(pattern.match(x).group(1))

        return int(x);


@deconstructible
class CharMaxValueValidator(BaseValidator):
    message = _('Ensure this value is less than or equal to %(limit_value)s.')
    code = 'max_value'

    def compare(self, a, b):
        if a == 'no workout today':
            return False
        return a > b

    def clean(self, x):
        if x == 'no workout today':
            return x

        pattern = re.compile("(^\d{1,3}).*")
        if x and pattern.match(x):
            return int(pattern.match(x).group(1))

        return int(x);

class UserDailyInput(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        dtime = str(self.created_at)
        return "{}-{}".format(self.user.username,dtime)

    class Meta:
        unique_together = ('user', 'created_at')

class DailyUserInputStrong(models.Model):
    EASY = 'easy'
    HARD = 'hard'
    NO_WORKOUT = 'no workout today'
    NOT_YET = 'not yet'

    WORK_OUT_EASY_OR_HARD_CHOICES = (
    ('','-'),
    (EASY,'Easy'),
    (HARD,'Hard'),
    (NO_WORKOUT,'No Workout Today'),
    )
    NUMBER_ALCOHOL_CHOICE = (
        ('','-'),
        ('0','0'),('0.5','0.5'),('1','1'),('1.5','1.5'),('2','2'),
        ('2.5','2.5'),('3','3'),('3.5','3.5'),('4','4'),('4.5','4.5'),
        ('5','5'),('5.5','5.5'),('6','6'),('6.5','6.5'),('7','7'),
        ('7.5','7.5'),('8','8'),('8.5','8.5'),('9','9'),('9.5','9.5'),
        ('10','10'),('10.5','10.5'),('11','11'),('11.5','11.5'),('12','12'),
        ('12.5','12.5'),('13','13'),('13.5','13.5'),('14','14'),('14.5','14.5'),
        ('15','15'),('15.5','15.5'),('16','16'),('16.5','16.5'),('17','17'),
        ('17.5','17.5'),('18','18'),('18.5','18.5'),('19','19'),('19.5','19.5'),
        ('20','20'),('20+','More than 20')
    )
    YN_CHOICE = (
        ('','-'),
        (YES,'Yes'),
        (NO,'No'),
    )

    WORKOUT_DONE_CHOICES = (
        (YES,'Yes'),
        (NO,'No'),
        (NOT_YET,'Not Yet')
    )

    WORKOUT_TYPE_CHOICES = (
        ('cardio','Cardio'),
        ('strength','Strength'),
        ('both','Both')
    )

    WORKOUT_INPUT_TYPE_CHOICES = (
        ('cardio','Cardio'),
        ('strength','Strength')
    )

    user_input = models.OneToOneField(UserDailyInput,related_name='strong_input')
    workout = models.CharField(
        max_length=10,
        choices=WORKOUT_DONE_CHOICES,
        blank=True
    )

    workout_type = models.CharField(
        max_length = 10,
        choices = WORKOUT_TYPE_CHOICES,
        blank = True
    )

    workout_input_type = models.CharField(
        max_length = 10,
        choices = WORKOUT_INPUT_TYPE_CHOICES,
        blank = True
    )

    work_out_easy_or_hard = models.CharField(
        max_length=20,
        choices=WORK_OUT_EASY_OR_HARD_CHOICES,
        blank=True)

    workout_effort_level = models.CharField(
        max_length=20,
        validators=[CharMinValueValidator(0),CharMaxValueValidator(10)],
        blank = True,null = True)

    hard_portion_workout_effort_level = models.CharField(
        max_length=20,
        validators=[CharMinValueValidator(0),CharMaxValueValidator(10)],
        blank=True, null=True)

    prcnt_unprocessed_food_consumed_yesterday = models.CharField(
        max_length=20,
        validators=[CharMinValueValidator(0),CharMaxValueValidator(100)],
        blank = True,null = True)

    list_of_unprocessed_food_consumed_yesterday = models.TextField(blank=True)

    list_of_processed_food_consumed_yesterday = models.TextField(blank=True)

    number_of_alcohol_consumed_yesterday = models.CharField(
        max_length=5,choices=NUMBER_ALCOHOL_CHOICE,
        blank = True,null = True)

    alcohol_drink_consumed_list = models.TextField(blank=True)

    sleep_time_excluding_awake_time = models.CharField(max_length=10, blank = True)

    sleep_comment = models.TextField(blank=True)

    prescription_or_non_prescription_sleep_aids_last_night = models.CharField(
        max_length=4,choices=YN_CHOICE, blank = True)

    sleep_aid_taken = models.TextField(blank=True)

    smoke_any_substances_whatsoever = models.CharField(
        max_length=4, choices=YN_CHOICE, blank = True)

    smoked_substance = models.TextField(blank=True)

    medications_or_controlled_substances_yesterday= models.CharField(
        max_length=4, choices=YN_CHOICE, blank = True)

    medications_or_controlled_substances_taken = models.TextField(blank=True)
    
class DailyUserInputEncouraged(models.Model):

    NO_WORKOUT = 'no workout today'
    
    stress_level_choices =  (
        ('','-'),
        ( LOW,'Low'),
        ( MEDIUM,'Medium'),
        ( HIGH,'High'),
    )

    YN_CHOICE = (
    ('','-'),
    (YES,'Yes'),
    (NO,'No'),
    )

    PAIN_CHOICES = (
        ('','-'),
        (YES,'Yes'),
        (NO,'No'),
        (NO_WORKOUT,'No workout today')
    )

    
    user_input = models.OneToOneField(UserDailyInput, related_name='encouraged_input')
    stress_level_yesterday = models.CharField(
        max_length=6,
        choices = stress_level_choices,
        blank=True)

    pains_twings_during_or_after_your_workout =models.CharField(
        max_length=20,
        choices = PAIN_CHOICES,
        blank=True)

    water_consumed_during_workout = models.CharField(
        max_length=20,
        validators=[CharMinValueValidator(0),CharMaxValueValidator(250)],
        blank = True,null = True)

    workout_that_user_breathed_through_nose = models.CharField(
        max_length=20,
        validators=[CharMinValueValidator(0),CharMaxValueValidator(100)],
        blank = True,null = True)
    
    # expect comma separated one or more body areas 
    # (right foot, left foot, right shins, left shins,no workout today) 
    pain_area = models.TextField(blank=True)



class DailyUserInputOptional(models.Model):

    NO_WORKOUT = 'no workout today'
    VEGAN = 'vegan'
    VEGETARIAN = 'vegetarian'
    PALEO = 'paleo'
    LOW_CARB_HIGH_FAT = 'low carb/high fat'
    HIGH_CARB = 'high carb'
    OTHER = 'other'

    YN_CHOICE = (
        ('','-'),
        (YES,'Yes'),
        (NO,'No')
    )

    YN_NO_WRKOUT_CHOICE = (
        ('','-'),
        (YES,'Yes'),
        (NO,'No'),
        (NO_WORKOUT, 'No Workout Today')
    )

    DIET_CHOICE = (
        ('','-'),
        (VEGAN,'Vegan'),
        (VEGETARIAN,'Vegetarian'),
        (PALEO,'paleo'),
        (LOW_CARB_HIGH_FAT,'Low carb/high fat'),
        (HIGH_CARB, 'High Carb'),
        (OTHER, 'Other')
    )
    user_input = models.OneToOneField(UserDailyInput, related_name='optional_input')
    chia_seeds_consumed_during_workout = models.CharField(
        max_length=20,
        validators = [CharMinValueValidator(0),CharMaxValueValidator(20)],
        blank = True)

    fasted_during_workout = models.CharField(
        max_length=20,
        choices = YN_NO_WRKOUT_CHOICE,
        blank = True)

    food_ate_before_workout = models.TextField(blank=True)

    calories_consumed_during_workout = models.CharField(max_length=20, blank = True)

    food_ate_during_workout = models.TextField(blank=True)

    workout_enjoyable = models.CharField(
        max_length=20, 
        choices = YN_NO_WRKOUT_CHOICE,
        blank = True)

    general_Workout_Comments = models.TextField(blank=True )

    weight = models.CharField(
        max_length=20,
        validators = [CharMinValueValidator(30),CharMaxValueValidator(300)],
        blank=True, null=True)

    waist_size =models.CharField(
        max_length=20,
        validators = [CharMinValueValidator(20),CharMaxValueValidator(60)],
        blank=True, null=True)

    clothes_size = models.CharField(
        max_length=20,
        validators = [CharMinValueValidator(0),CharMaxValueValidator(16)],
        blank=True, null=True)

    heart_rate_variability = models.CharField(
        max_length=20,
        validators = [CharMinValueValidator(1),CharMaxValueValidator(100)],
        blank=True, null=True)

    sick = models.CharField(
        max_length = 3,
        choices = YN_CHOICE,
        blank=True)

    sickness = models.TextField(blank=True)

    stand_for_three_hours = models.CharField(
        max_length=3,
        choices=YN_CHOICE,
        blank=True)

    percent_breath_nose_last_night = models.CharField(
        max_length=20,
        validators = [CharMinValueValidator(1),CharMaxValueValidator(100)],
        blank = True,null = True)

    percent_breath_nose_all_day_not_exercising = models.CharField(
        max_length=20,
        validators = [CharMinValueValidator(1),CharMaxValueValidator(100)],
        blank = True,null = True)

    type_of_diet_eaten = models.CharField(
        max_length=100,
        blank=True)

    general_comment = models.TextField(blank=True)


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