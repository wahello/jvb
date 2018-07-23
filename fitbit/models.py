from datetime import datetime

from django.db import models

# Create your models here.
class FitbitConnectToken(models.Model):

	user = models.OneToOneField('auth.User',related_name="fitbit_refresh_token")
	updated_at = models.DateTimeField(auto_now=True)
	refresh_token = models.CharField(max_length=250)
	access_token = models.TextField(null=True)
	user_id_fitbit = models.CharField(max_length=250,null=True)
	
	def __str__(self):
		return "%s"%(self.user.username)

class UserFitbitDataSleep(models.Model):
	user = models.ForeignKey('auth.user',on_delete=models.CASCADE, related_name="fitbit_sleep_data")
	created_at = models.DateField(default=datetime.now, blank=True)
	date_of_sleep = models.TextField()
	sleep_data = models.TextField()

	def __str__(self):
		return "%s"%(self.user.username)

class UserFitbitDataHeartRate(models.Model):
	user = models.ForeignKey('auth.user',on_delete=models.CASCADE, related_name="fitbit_heartrate_data")
	created_at = models.DateField(default=datetime.now, blank=True)
	date_of_heartrate = models.TextField()
	heartrate_data = models.TextField()

	def __str__(self):
		return "%s"%(self.user.username)

class UserFitbitDataActivities(models.Model):
	user = models.ForeignKey('auth.user',on_delete=models.CASCADE, related_name="fitbit_activities_data")
	created_at = models.DateField(default=datetime.now, blank=True)
	date_of_activities = models.TextField()
	activities_data = models.TextField(null=True)

	def __str__(self):
		return "%s"%(self.user.username)

class UserFitbitDataSteps(models.Model):
	user = models.ForeignKey('auth.user',on_delete=models.CASCADE, related_name="fitbit_steps_data")
	created_at = models.DateField(default=datetime.now, blank=True)
	date_of_steps = models.TextField()
	steps_data = models.TextField(null=True)

	def __str__(self):
		return "%s"%(self.user.username)

class FitbitNotifications(models.Model):
	PING_STATE_CHOICES = (
		("unprocessed","Unprocessed"),
		("processing","Processing"),
		("processed","Processed"),
		("failed","Failed"),
	)
	COLLECTION_TYPE_CHOICES = (
		("activities","Activities"),
		("body","Body"),
		("foods","Foods"),
		("sleep","Sleeps"),
	)
	user = models.ForeignKey('auth.user',on_delete=models.CASCADE,
	 related_name="fitbit_notification")
	created_at = models.DateTimeField(auto_now_add=True)
	notification_date = models.DateField()
	collection_type = models.CharField(
		choices = COLLECTION_TYPE_CHOICES,
		max_length=100)
	state = models.CharField(
		choices = PING_STATE_CHOICES,
		max_length = 100
	)
	notification = models.TextField()

	def __str__(self):
		return "%s"%(self.user.username)