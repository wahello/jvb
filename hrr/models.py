from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Hrr(models.Model):
	user_hrr = models.ForeignKey(User, on_delete=models.CASCADE)
	created_at = models.DateField()
	updated_at = models.DateTimeField(auto_now=True)


	Did_you_measure_HRR = models.CharField(max_length=100,blank=True,null=True)
	Did_heartrate_reach_99 = models.CharField(max_length=100,blank=True,null=True)
	time_99 = models.FloatField(blank=True,null=True)
	HRR_start_beat = models.FloatField(blank=True,null=True)
	lowest_hrr_1min = models.FloatField(blank=True,null=True)
	No_beats_recovered = models.FloatField(blank=True,null=True)

	end_time_activity = models.FloatField(blank=True,null=True)
	diff_actity_hrr = models.FloatField(blank=True,null=True)
	HRR_activity_start_time = models.FloatField(blank=True,null=True)
	end_heartrate_activity = models.FloatField(blank=True,null=True)
	heart_rate_down_up = models.FloatField(blank=True,null=True)
	pure_1min_heart_beats = models.FloatField(blank=True,null=True)
	pure_time_99 = models.FloatField(blank=True,null=True)

	no_fitfile_hrr_reach_99 = models.CharField(max_length=100,blank=True,null=True)
	no_fitfile_hrr_time_reach_99 = models.FloatField(blank=True,null=True)
	time_heart_rate_reached_99 = models.FloatField(blank=True,null=True)
	lowest_hrr_no_fitfile = models.FloatField(blank=True,null=True)
	no_file_beats_recovered = models.FloatField(blank=True,null=True)

	offset = models.FloatField(blank=True,null=True)

	include_hrr = models.BooleanField(default=True)
	use_updated_hrr = models.BooleanField(default=False)
 
	def __str__(self):
		return str((self.user_hrr))

	class Meta:
		unique_together = ("user_hrr", "created_at")
		indexes = [
			models.Index(fields=['user_hrr', '-created_at']),
			models.Index(fields=['created_at']),
		]

class AaCalculations(models.Model):
	user_aa = models.ForeignKey(User, on_delete=models.CASCADE)
	created_at = models.DateField()
	updated_at = models.DateTimeField(auto_now=True)
	data = models.TextField(blank=True,null=True)

	def __str__(self):
		return str((self.user_aa))

	class Meta:
		unique_together = ("user_aa", "created_at")
		indexes = [
			models.Index(fields=['user_aa', '-created_at']),
			models.Index(fields=['created_at']),
		]


class TimeHeartZones(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	created_at = models.DateField()
	updated_at = models.DateTimeField(auto_now=True)
	data = models.TextField(blank=True,null=True)

	def __str__(self):
		return str((self.user))

	class Meta:
		unique_together = ("user", "created_at")
		indexes = [
			models.Index(fields=['user', '-created_at']),
			models.Index(fields=['created_at']),
		]

class AaWorkoutCalculations(models.Model):
	user_aa_workout = models.ForeignKey(User, on_delete=models.CASCADE)
	created_at = models.DateField()
	updated_at = models.DateTimeField(auto_now=True)
	data = models.TextField(blank=True,null=True)

	def __str__(self):
		return str((self.user_aa_workout))

	class Meta:
		unique_together = ("user_aa_workout", "created_at")
		indexes = [
			models.Index(fields=['user_aa_workout', '-created_at']),
			models.Index(fields=['created_at']),
		]

class AA(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	created_at = models.DateField()
	updated_at = models.DateTimeField(auto_now=True)

	total_time = models.FloatField(blank=True,null=True)
	aerobic_zone = models.FloatField(blank=True,null=True)
	anaerobic_zone = models.FloatField(blank=True,null=True)
	below_aerobic_zone = models.FloatField(blank=True,null=True)
	aerobic_range = models.CharField(max_length=20,blank=True,null=True)
	anaerobic_range = models.CharField(max_length=20,blank=True,null=True)
	below_aerobic_range = models.CharField(max_length=20,blank=True,null=True)
	hrr_not_recorded = models.FloatField(blank=True,null=True)
	percent_hrr_not_recorded = models.FloatField(blank=True,null=True)
	percent_aerobic = models.FloatField(blank=True,null=True)
	percent_below_aerobic = models.FloatField(blank=True,null=True)
	percent_anaerobic = models.FloatField(blank=True,null=True)
	total_percent = models.FloatField(blank=True,null=True)

 
	def __str__(self):
		return str((self.user))

	class Meta:
		unique_together = ("user", "created_at")
		indexes = [
			models.Index(fields=['user', '-created_at']),
			models.Index(fields=['created_at']),
		]

