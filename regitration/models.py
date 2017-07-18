from django.db import models
from datetime import date
from django.contrib.auth.models import User
# Create your models here.

class Registration_Input(models.Model):

    Gender = models.CharField(max_length=264)
    Height = models.FloatField(max_length=264,blank=True,null =True,default = None,)
    Weight = models.FloatField(max_length=264,blank=True,null =True,default = None,)
    Date_of_Birth = models.DateField(max_length = 8)
    First_name =  models.CharField(max_length =264)
    Last_name = models.CharField(max_length=264)
    Garmin_User_Name = models.CharField(max_length=264)
    Garmin_Password = models.CharField(max_length = 50)
    Email = models.EmailField(max_length=70)
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
    goals = models.CharField(max_length=264,choices = CHOICE,null=True)
    other = models.CharField(max_length=264,null=True,blank=True)
class Caluculated_Fields(models.Model):
    Date_of_Birth = models.ForeignKey(Registration_Input,null=True)
    def age(Date_of_Birth):
        today = date.today()
        return today.year - Date_of_Birth.year - ((today.month, today.day) < (Date_of_Birth.month, Date_of_Birth.day))
    def Aerobic_Heart_Rate_Zone_High_Number(age):
        value = age+5
        return 180-value
    def Aerobic_Heart_Rate_Zone_Low_Number(age):
        value = age-25
        return 180-value
