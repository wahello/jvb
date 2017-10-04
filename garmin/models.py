import datetime

from django.db import models
from django.contrib.postgres.fields import JSONField

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
