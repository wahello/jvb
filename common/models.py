from django.db import models
from django.contrib.auth.models import User

class UserDataBackfillRequest(models.Model):
	device_choices = (
		('fitbit','Fitbit'),
		('garmin','Garmin'),       
		('apple','Apple')		   
		)
	status_choices = (
		('unprocessed','Unprocessed'),
		('processed','Processed'),
		('processing','Processing'),
		('failed','Failed')
		)
	user = models.ForeignKey(User,on_delete=models.CASCADE)
	device_type = models.CharField(max_length=100,choices=device_choices)
	start_date = models.DateField()
	end_date = models.DateField()
	requested_at = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=100,choices=status_choices,default='unprocessed')