from django.db import models
from django.utils import timezone
from django.conf import settings

# Create your models here.
class UserAppleDataSteps(models.Model):
	user       = models.ForeignKey('auth.user',on_delete=models.CASCADE, related_name="apple_steps_data")
	summary_id = models.CharField(max_length=100,db_index=True)
	created_at = models.DateTimeField(default=timezone.now)
	belong_to  = models.DateTimeField(default=timezone.now)
	data       = models.TextField(null=True,blank=True)

	def __str__(self):
		return "%s"%(self.user.username)

class ApplePingNotification(models.Model):
	SUMMARY_TYPE_CHOICE = (
		("activities","Activities"),
		("sleeps","Sleeps"),
		("heart_rate","Heart rate"),
		("steps","Steps"),
	)

	PING_STATE_CHOICES = (
		("unprocessed","Unprocessed"),
		("processing","Processing"),
		("processed","Processed"),
		("failed","Failed"),
	)

	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE
	)
	created_at   = models.DateTimeField(auto_now_add = True)
	updated_at   = models.DateTimeField(auto_now = True)
	upload_start_time_seconds = models.IntegerField(null=True, blank=True)
	summary_type = models.CharField(
		choices  = SUMMARY_TYPE_CHOICE,
		max_length=100
	)
	state = models.CharField(
		max_length = 100, 
		choices    = PING_STATE_CHOICES,
		default    = "unprocessed"
	) 
	notification = models.TextField()
	def __str__(self):
		dtime = self.created_at.strftime("%Y-%m-%d %I:%M %p")
		return "{}-{}".format(self.user.username,dtime)
		
	class Meta:
		indexes = [
			models.Index(fields=['user','upload_start_time_seconds']),
			models.Index(fields=['-created_at']),
			models.Index(fields=['upload_start_time_seconds'])
		]

class UserAppleDataActivities(models.Model):
	user       = models.ForeignKey('auth.user',on_delete=models.CASCADE, related_name="apple_activities_data")
	created_at = models.DateTimeField(default=timezone.now)
	belong_to  = models.DateTimeField(default=timezone.now)
	data       = models.TextField(null=True,blank=True)

	def __str__(self):
		return "%s"%(self.user.username)

class AppleUser(models.Model):
	user       = models.ForeignKey('auth.user',on_delete=models.CASCADE, related_name="apple_status")
	status     = models.BooleanField(default=False)