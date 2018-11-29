from django.apps import AppConfig
# from django.utils.translation import ugettext_lazy as _

class HrrConfig(AppConfig):
	name = 'hrr'

	def ready(self):
		from . import signals
