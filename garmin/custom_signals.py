from django.dispatch import Signal

garmin_post_save = Signal(providing_args=["user","date"])