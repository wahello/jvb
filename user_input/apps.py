from django.apps import AppConfig


class UserInputConfig(AppConfig):
    name = 'user_input'

    def ready(self):
    	from . import signals