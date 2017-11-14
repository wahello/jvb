from .custom_signals import user_input_post_save
from django.dispatch import receiver
from .serializers import UserDailyInputSerializer
from quicklook.calculation_helper import create_quick_look

@receiver(user_input_post_save, sender=UserDailyInputSerializer)
def create_or_update_quicklook(sender, **kwargs):
	request = kwargs.get('request')
	dt = kwargs.get('dt').strftime("%Y-%m-%d")
	# create_quick_look(request.user, dt)