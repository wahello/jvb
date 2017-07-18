#!/usr/bin/env python
<<<<<<< HEAD
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        # The above import may fail for some other reason. Ensure that the
        # issue is really that Django is missing to avoid masking other
        # exceptions on Python 2.
        try:
            import django
        except ImportError:
            raise ImportError(
                "Couldn't import Django. Are you sure it's installed and "
                "available on your PYTHONPATH environment variable? Did you "
                "forget to activate a virtual environment?"
            )
        raise
=======


import os
import sys

from decouple import config


if __name__ == "__main__":
    settings_module = config('DJANGO_SETTINGS_MODULE', default=None)
    print(settings_module)

    if sys.argv[1] == 'test':
        if settings_module:
            print("Ignoring config('DJANGO_SETTINGS_MODULE') because it's test. "
                  "Using 'jvbhealthwellness.settings.test'")
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "jvbhealthwellness.settings.test")
    else:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

    from django.core.management import execute_from_command_line
>>>>>>> d042e6150b53849199f4007ecdeaf8f5a6b49b9e
    execute_from_command_line(sys.argv)
