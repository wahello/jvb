from django.db import models
from datetime import date
from django.contrib.auth.models import User
from pygments.formatters.html import HtmlFormatter
from pygments import highlight
# Create your models here.
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
class User_Input(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    gender = models.CharField(blank=True,null =True,default = None,max_length=264)
    height = models.FloatField(max_length=264,blank=True,null =True,default = None)
    weight = models.FloatField(max_length=264,blank=True,null =True,default = None)
    date_of_birth = models.DateField(max_length = 8,blank=True,null =True,default = None)
    first_name =  models.CharField(max_length =264,blank=True,null =True,default = None)
    last_name = models.CharField(max_length=264,blank=True,null =True,default = None)
    garmin_user_name = models.CharField(max_length=264,blank=True,null =True,default = None)
    garmin_password = models.CharField(max_length = 50,blank=True,null =True,default = None)
    email = models.EmailField(max_length=70,blank=True,null =True,default = None,unique=True)
    goals = models.CharField(max_length=264,choices = CHOICE,null=True)
    other = models.CharField(max_length=264,null=True,blank=True)
    age = models.IntegerField(null=True,blank=True)
    aerobic_heart_rate_zone_high_number = models.IntegerField(null=True,blank=True)
    aerobic_heart_rate_zone_low_number = models.IntegerField(null=True,blank=True)
    owner = models.ForeignKey('auth.User', related_name='snippets', on_delete=models.CASCADE ,default= None,null=True,blank=True)
    highlighted = models.TextField(null=True,blank=True)

    class Caluculated_Fields(models.Model):
        def age(date_of_Birth):
            today = date.today()
            return today.year - Date_of_Birth.year - ((today.month, today.day) < (Date_of_Birth.month, Date_of_Birth.day))
        def Aerobic_Heart_Rate_Zone_High_Number(age):
            value = age+5
            return 180-value
        def Aerobic_Heart_Rate_Zone_Low_Number(age):
            value = age-25
            return 180-value

    class Meta:
        ordering = ('created',)

    
