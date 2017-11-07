from .custom_signals import user_input_post_save
from django.dispatch import receiver
from .serializers import UserDailyInputSerializer
from quicklook.views_calculated import QuicklookCalculationView

@receiver(user_input_post_save, sender=UserDailyInputSerializer)
def create_or_update_quicklook(sender, **kwargs):
	request = kwargs.get('request')
	dt = kwargs.get('dt').strftime("%Y-%m-%d")
	QuicklookCalculationView.as_view()(request,dt)