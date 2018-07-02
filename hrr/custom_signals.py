from django.dispatch import Signal

fitfile_signal = Signal(providing_args=["date","user"])
