from django.dispatch import receiver
from .custom_signals import garmin_post_save
from quicklook.tasks import generate_quicklook

@receiver(garmin_post_save,sender=None)
def create_or_update_quicklook(sender, **kwargs):
	user = kwargs.get('user')
	from_date = kwargs.get('date').strftime("%Y-%m-%d")
	to_date = kwargs.get('date').strftime("%Y-%m-%d")
	generate_quicklook.delay(user,from_date,to_date)