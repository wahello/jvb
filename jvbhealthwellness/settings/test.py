from .base import *  # noqa


SECRET_KEY = 'test'

ALLOWED_HOSTS = ['*']

DATABASES = {
  'default': {
      'ENGINE': 'django.db.backends.postgresql',
      'NAME': 'jvbhealth',
      'USER': 'jvbhealth',
      'PASSWORD': 'Health2112',
      'HOST': 'jvb-staging.c2iyrd4ofjox.us-east-1.rds.amazonaws.com', # set in docker-compose.yml
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


