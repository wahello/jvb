from django.dispatch import Signal

post_registration_notify = Signal(providing_args=["email_address","username","first_name"])