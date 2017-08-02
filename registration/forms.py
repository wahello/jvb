from django import forms
from regitration.models import Registration_Input,Goals,Caluculated_Fields


class Registration_InputForm(forms.ModelForm):
    class Meta():
        model = Registration_Input
        fields = ('Gender','Height','Weight','Date_of_Birth','First_name','Last_name','Garmin_User_Name','Garmin_Password','Email')

class GoalsForm(forms.ModelForm):
    class Meta():
        model = Goals
        fields = ('goals','other')

class Caluculated_FieldsForms(forms.ModelForm):
    class Meta():
        model = Caluculated_Fields
        fields = ('Date_of_Birth',)
