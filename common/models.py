from django.db import models
from django.contrib.auth.models import User
# from .validation import validate

class UserDataBackfillRequest(models.Model):
	device_choices = (
		('fitbit','Fitbit'),
		('garmin','Garmin'),      #The first element in each tuple is the actual value to be set on the model, 
		('apple','Apple')		  #and the second element is the human-readable name. 
		)
	status_choices = (
		('unprocessed','Unprocessed'),
		('processed','Processed'),
		('processing','Processing'),
		('failed','Failed')
		)
	user = models.ForeignKey(User,on_delete=models.CASCADE)
	# user=models.OneToOneField('auth.user', on_delete=models.CASCADE)
	device_type = models.CharField(max_length=100,choices=device_choices)
	start_date = models.DateField()
	end_date = models.DateField()
	requested_at = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=100,choices=status_choices,default='unprocessed')

	# def __str__(self):
	# 	return '{} {} {}'.format(self.device_type,self.requested_at,self.status)

	# class Meta:
	# 	ordering=('-requested_at',)
# models.signals.pre_save.connect(validate, sender=UserDataBackfillRequest)