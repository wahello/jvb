from django import forms
from django.contrib.auth.models import User
from user_input.models import Daily_User_Input_Strong,Daily_User_Input_Encouraged,Daily_User_Input_Optional,Inputs_Changes_from_Third_Sources,Goals


class Daily_User_Input_StrongForm(forms.ModelForm):
    class Meta():
        model = Daily_User_Input_Strong
        fields = ('work_out_Easy_or_hard','work_out_effort_level','unprocessed_food_consumed_yesterday','Number_of_alcohol_consumed_yesterday','sleep_aids_last_night',
        'prescription_or_non_prescription_sleep_aids_last_night','smoke_any_substances_whatsoever','medications_or_controlled_substances_yesterday')

class Daily_User_Input_EncouragedForm(forms.ModelForm):
    class Meta():
        model = Daily_User_Input_Encouraged
        fields = ('stress_level_yesterday','pains_twings_during_or_after_your_workout','water_consumed_during_workout','workout_that_user_breathed_through_nose')


class Daily_User_Input_OptionalForm(forms.ModelForm):
    class Meta():
        model = Daily_User_Input_Optional
        fields = ('List_of_processed_food_consumed_yesterday','Chia_seeds_consumed_during_workout','fasted_during_workout','General_Workout_Comments','weight','waist_size','clothes_size','Heart_Rate_Variability')
class Inputs_Changes_from_Third_SourcesForm(forms.ModelForm):
    class Meta():
        model = Inputs_Changes_from_Third_Sources
        fields = ('Resting_Heart_Rate','Sleep_time_excluding_awake_time','Other','TBD')
class Goals_Form(forms.ModelForm):
    class Meta():

        model = Goals
        fields = ('goals',)
