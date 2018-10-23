# import datetime
import base64

from django.db import models
from django.conf import settings
# from django.contrib.postgres.fields import JSONField

class UserGarminDataEpoch(models.Model):
	user = models.ForeignKey('auth.user',on_delete=models.CASCADE, related_name="epoch_data")
	summary_id = models.CharField(max_length=100,db_index=True)
	record_date_in_seconds = models.IntegerField()
	start_time_in_seconds = models.IntegerField(blank=True,null=True)
	start_time_duration_in_seconds = models.IntegerField(blank=True,null=True)

	# only in case of postgres db
	#data = JSONField()
	# data = models.CharField(max_length=2000)
	data = models.TextField()

class UserGarminDataSleep(models.Model):
	user = models.ForeignKey('auth.user',on_delete=models.CASCADE, related_name="sleep_data")
	summary_id = models.CharField(max_length=100,db_index=True)
	record_date_in_seconds = models.IntegerField()
	start_time_in_seconds = models.IntegerField(blank=True,null=True)
	start_time_duration_in_seconds = models.IntegerField(blank=True,null=True)
	
	# only in case of postgres db
	#data = JSONField()
	# data = models.CharField(max_length=2000)
	data = models.TextField()

class UserGarminDataBodyComposition(models.Model):
	user = models.ForeignKey('auth.user', on_delete=models.CASCADE, related_name="body_composition_data")
	summary_id = models.CharField(max_length=100,db_index=True)
	record_date_in_seconds = models.IntegerField()
	start_time_in_seconds = models.IntegerField(blank=True,null=True)
	start_time_duration_in_seconds = models.IntegerField(blank=True,null=True)

	# only in case of postgres db
	#data = JSONField()
	# data = models.CharField(max_length=2000)
	data = models.TextField()

class UserGarminDataDaily(models.Model):
	user = models.ForeignKey('auth.user', on_delete=models.CASCADE, related_name="daily_data")
	summary_id = models.CharField(max_length=100,db_index=True)
	record_date_in_seconds = models.IntegerField()
	start_time_in_seconds = models.IntegerField(blank=True,null=True)
	start_time_duration_in_seconds = models.IntegerField(blank=True,null=True)

	# only in case of postgres db
	#data = JSONField()
	# data = models.CharField(max_length=2000)
	data = models.TextField()

class UserGarminDataActivity(models.Model):
	user = models.ForeignKey('auth.user', on_delete=models.CASCADE, related_name="activity_data")
	summary_id = models.CharField(max_length=100,db_index=True)
	record_date_in_seconds = models.IntegerField()
	start_time_in_seconds = models.IntegerField(blank=True,null=True)
	start_time_duration_in_seconds = models.IntegerField(blank=True,null=True)

	# only in case of postgres db
	#data = JSONField()
	# data = models.CharField(max_length=2000)
	data = models.TextField()

class UserGarminDataManuallyUpdated(models.Model):
	user = models.ForeignKey('auth.user', on_delete=models.CASCADE, related_name="manually_updated_data")
	summary_id = models.CharField(max_length=100,db_index=True)
	record_date_in_seconds = models.IntegerField()
	start_time_in_seconds = models.IntegerField(blank=True,null=True)
	start_time_duration_in_seconds = models.IntegerField(blank=True,null=True)

	# only in case of postgres db
	#data = JSONField()
	# data = models.CharField(max_length=2000)
	data = models.TextField()

class UserGarminDataStressDetails(models.Model):
	user = models.ForeignKey('auth.user', on_delete=models.CASCADE, related_name="stress_detail_data")
	summary_id = models.CharField(max_length=100,db_index=True)
	record_date_in_seconds = models.IntegerField()
	start_time_in_seconds = models.IntegerField(blank=True,null=True)
	start_time_duration_in_seconds = models.IntegerField(blank=True,null=True)

	# only in case of postgres db
	#data = JSONField()
	# data = models.CharField(max_length=2000)
	data = models.TextField()

class UserGarminDataMetrics(models.Model):
	user = models.ForeignKey('auth.user', on_delete=models.CASCADE, related_name="metrics_data")
	summary_id = models.CharField(max_length=100,db_index=True)
	record_date_in_seconds = models.IntegerField()
	calendar_date = models.DateField()

	# only in case of postgres db
	#data = JSONField()
	# data = models.CharField(max_length=2000)
	data = models.TextField()

class UserGarminDataMoveIQ(models.Model):
	user = models.ForeignKey('auth.user', on_delete=models.CASCADE, related_name="moveiq_data")
	summary_id = models.CharField(max_length=100,db_index=True)
	record_date_in_seconds = models.IntegerField()
	start_time_in_seconds = models.IntegerField(blank=True,null=True)
	start_time_duration_in_seconds = models.IntegerField(blank=True,null=True)

	# only in case of postgres db
	#data = JSONField()
	# data = models.CharField(max_length=2000)
	data = models.TextField()

class GarminConnectToken(models.Model):

	user = models.OneToOneField('auth.User',related_name="garmin_connect_token")
	token = models.CharField(max_length=250)
	token_secret = models.CharField(max_length=250)

	def __str__(self):
		return "%s"%(self.user.username)

class GarminFitFiles(models.Model):
	user = models.ForeignKey('auth.user', on_delete=models.CASCADE, related_name="garmin_fit_files")
	created_at = models.DateTimeField(auto_now=True)
	fit_file_belong_date = models.DateField(default=None,null=True)
	fit_file = models.BinaryField(blank=True)
	meta_data_fitfile = models.TextField()

class GarminPingNotification(models.Model):
	SUMMARY_TYPE_CHOICE = (
		("dailies","Dailies"),
		("activities","Activities"),
		("manuallyUpdatedActivities","Manually Updated Activities"),
		("epochs","Epochs"),
		("sleeps","Sleeps"),
		("bodyComps","Body Composition"),
		("stressDetails","Stress Details"),
		("moveIQActivities","Move IQ Activities"),
		("userMetrics","User Metrics"),
		("deregistrations","Deregistration"),
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
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)
	upload_start_time_seconds = models.IntegerField(null=True, blank=True)
	summary_type = models.CharField(
		choices = SUMMARY_TYPE_CHOICE,
		max_length=100
	)
	state = models.CharField(
		max_length = 100, 
		choices = PING_STATE_CHOICES,
		default = "unprocessed"
	) 
	notification = models.TextField()
	def __str__(self):
		dtime = self.created_at.strftime("%Y-%m-%d %I:%M %p")
		return "{}-{}".format(self.user.username,dtime)
		
	class Meta:
		indexes = [
			models.Index(fields=['user', 'upload_start_time_seconds']),
			models.Index(fields=['-created_at']),
			models.Index(fields=['upload_start_time_seconds'])
		]

class UserLastSynced(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		related_name='last_synced'
	)
	last_synced = models.DateTimeField()
	offset = models.IntegerField()

	def __str__(self):
		sync_time_str = self.last_synced.strftime("%Y-%m-%d %H:%M:%S")
		return "{}-{}".format(self.user.username,sync_time_str)