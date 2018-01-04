from django.db import models
from datetime import date
from django.contrib.auth.models import User

class Profile(models.Model):
    MAINTAIN_OVERALL_HEALTH = 'maintain_overall_health'
    IMPROVE_HEALTH = 'improve_health'
    IMPROVE_ENERGY_LEVELS = 'improve_energy_levels'
    IMPROVE_BLOOD_WORK_LEVELS = 'improve_blood_work_levels'
    WEIGHT_LOSS_WAIST_SIZE_REDUCTION = 'weight_loss/waist_size_reduction'
    REDUCE_STRESS_ANXIETY = 'reduce_stress/anxiety'
    TRAIN_FOR_A_RUNNING_RACE = 'train_for a running race'
    TRAIN_FOR_A_TRIATHLON = 'Train for a triathlon'
    GET_FASTER_AS_AN_ATHLETE = 'Get faster as an athlete'
    QUALIFY_FOR_THE_BOSTON_MARATHON = 'Qualify for the Boston marathon'
    QUALIFY_IRONMAN_WORLD_CHAMPIONSHIPS = 'Qualify for a world level triathlon_ironman kona_half ironman world championships'
    COMPLETELY_TRANSFORM_MY_LIFE = 'Completely transform my life'
    BE_PROUD_TO_LOOK_IN_THE_MIRROR_AGAIN = 'Be proud to look in the mirror again'
    OTHER = 'other'

    GOALS_CHOICE = (
        (MAINTAIN_OVERALL_HEALTH, 'Maintain_overall_health'),
        (IMPROVE_HEALTH, 'improve health'),
        (IMPROVE_ENERGY_LEVELS, 'improve energy levels'),
        (IMPROVE_BLOOD_WORK_LEVELS, 'improve blood work levels'),
        (WEIGHT_LOSS_WAIST_SIZE_REDUCTION, 'weight loss/waist size reduction'),
        (REDUCE_STRESS_ANXIETY, 'reduce stress/anxiety'),
        (TRAIN_FOR_A_RUNNING_RACE, 'train for a running race'),
        (TRAIN_FOR_A_TRIATHLON, 'train for a triathlon'),
        (GET_FASTER_AS_AN_ATHLETE, 'get faster as an athlete'),
        (QUALIFY_FOR_THE_BOSTON_MARATHON, 'qualify for the Boston marathon'),
        (QUALIFY_IRONMAN_WORLD_CHAMPIONSHIPS,
         'qualify for a world level triathlon(ironman kona/half ironman world championships)'),
        (COMPLETELY_TRANSFORM_MY_LIFE, 'completely transform my life'),
        (BE_PROUD_TO_LOOK_IN_THE_MIRROR_AGAIN,
         'be proud to look in the mirror again'),
        (OTHER, 'other'),
    )

    MALE = 'M'
    FEMALE = 'F'

    GENDER_CHOICE = (
        (MALE, 'Male'),
        (FEMALE, 'Female')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    gender = models.CharField(default=MALE, max_length=1, choices=GENDER_CHOICE)

    height = models.CharField(max_length=6)

    weight = models.CharField(max_length=3)

    date_of_birth = models.DateField()

    sleep_goals = models.CharField(max_length=10)

    goals = models.CharField(max_length=250, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

    def age(self):
        today = date.today()
        dob = self.date_of_birth
        return (today.year - dob.year
                - ((today.month, today.day) < (dob.month, dob.day)))

    def Aerobic_Heart_Rate_Zone_High_Number(self):
        age = self.age()
        value = age + 5
        return 180 - value

    def Aerobic_Heart_Rate_Zone_Low_Number(self):
        age = self.age()
        value = age - 25
        return 180 - value

    class Meta:
        ordering = ('created_at',)