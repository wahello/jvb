from django.db import models

# Create your models here.
class FitbitConnectToken(models.Model):

	user = models.OneToOneField('auth.User',related_name="fitbit_refresh_token")
	refresh_token = models.CharField(max_length=250)
	access_token = models.CharField(max_length=250,null=True)
	user_id_fitbit = models.CharField(max_length=250,null=True)
	
	def __str__(self):
		return "%s"%(self.user.username)