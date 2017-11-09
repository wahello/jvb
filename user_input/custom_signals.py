from django.dispatch import Signal

user_input_post_save = Signal(providing_args=["request", "dt"])