from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Hrr(models.Model):
	user_hrr = models.ForeignKey(User, on_delete=models.CASCADE)
	created_at = models.DateField()
	updated_at = models.DateTimeField(auto_now=True)


	Did_you_measure_HRR = models.CharField(max_length=3,blank=True,null=True)
	Did_heartrate_reach_99 = models.CharField(max_length=3,blank=True,null=True)
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

	no_fitfile_hrr_reach_99 = models.CharField(max_length=3,blank=True,null=True)
	no_fitfile_hrr_time_reach_99 = models.FloatField(blank=True,null=True)
	time_heart_rate_reached_99 = models.FloatField(blank=True,null=True)
	lowest_hrr_no_fitfile = models.FloatField(blank=True,null=True)
	no_file_beats_recovered = models.FloatField(blank=True,null=True)

	offset = models.FloatField(blank=True,null=True)
 
	def __str__(self):
		return str((self.user_hrr))

	class Meta:
		unique_together = ("user_hrr", "created_at")
		indexes = [
			models.Index(fields=['user_hrr', '-created_at']),
			models.Index(fields=['created_at']),
		]


# class AaCalculations(models.Model):
# 	user_hrr = models.ForeignKey(User, on_delete=models.CASCADE)
# 	created_at = models.DateField()
# 	updated_at = models.DateTimeField(auto_now=True)

	