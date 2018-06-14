from .base import *  # noqa


SECRET_KEY = 'test'

ALLOWED_HOSTS = ['*']

DATABASES = {
  'default': {
      'ENGINE': 'django.db.backends.postgresql',
      'NAME': 'jvbhealthapptest',
      'USER': 'u5cbtl3seu12pf',
      'PASSWORD': 'jvbhealth',
      'HOST': 'jvb-health-app.c7lti9kc1dov.ap-south-1.rds.amazonaws.com', # set in docker-compose.yml
      'PORT': 5432 # default postgres port
  }
}


STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static/'

MEDIA_ROOT = 'mediafiles'
MEDIA_URL = '/media/'

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Celery
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True


