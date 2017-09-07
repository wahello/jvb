from django.db import models

class GarminToken(models.Model):

	user = models.OneToOneField('auth.User',related_name="garmin_token")
	token = models.CharField(max_length=250)
	token_secret = models.CharField(max_length=250)

	def __str__(self):
		return "%s"%(self.user.username)