from django.db import models
from datetime import date
from django.contrib.auth.models import User

class Profile(models.Model):
    MALE = 'M'
    FEMALE = 'F'

    GENDER_CHOICE = (
        (MALE, 'Male'),
        (FEMALE, 'Female')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    gender = models.CharField(default=MALE, max_length=1, choices=GENDER_CHOICE)

    height = models.CharField(max_length=6,null=True, blank=True)

    weight = models.CharField(max_length=3,null=True, blank=True)

    date_of_birth = models.DateField(null=True)

    user_age = models.PositiveIntegerField(null=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    terms_conditions = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    def age(self):
        today = date.today()
        dob = self.date_of_birth
        if dob:
            return (today.year - dob.year
                    - ((today.month, today.day) < (dob.month, dob.day)))
        else:
            self.user_age

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

class TermsConditionsText(models.Model):
    context = models.TextField()
    version = models.CharField(max_length=50,unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.version

class TermsConditions(models.Model):
    user = models.OneToOneField(User,related_name = 'terms')
    terms_conditions_version = models.ForeignKey('TermsConditionsText',on_delete=models.CASCADE)
    accepted_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

class Invitation(models.Model):
    email = models.EmailField()
    invited = models.BooleanField(default=True)
    invited_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('invited_on',)

    def __str__(self):
        return self.email