from .base import *  # noqa


DEBUG = True

HOST = 'http://localhost:8000'

SECRET_KEY = 'secret'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': base_dir_join('db.sqlite3'),
    }
}

STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static/'

MEDIA_ROOT = 'mediafiles'
MEDIA_URL = '/media/'

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

AUTH_PASSWORD_VALIDATORS = []  # allow easy passwords only on local

# Celery
CELERY_TASK_ALWAYS_EAGER = True
CELERY_BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'

# Email
INSTALLED_APPS += ('naomi',)
# EMAIL_BACKEND = 'naomi.mail.backends.naomi.NaomiBackend'
# EMAIL_FILE_PATH = base_dir_join('tmp_email')

#Email (Mailjet)
EMAIL_USE_TLS = True
EMAIL_HOST = 'in-v3.mailjet.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = '1e89aa631a866963a84781409f047bd8'
EMAIL_HOST_PASSWORD = 'd56ac074ee9e0bac840bf70f7ffc4165'
DEFAULT_FROM_EMAIL = 'info@jvbwellness.com'

# Fix My Django
INSTALLED_APPS += ('fixmydjango',)
FIX_MY_DJANGO_ADMIN_MODE = True

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(levelname)-8s [%(asctime)s] %(name)s: %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'INFO'
        },
        'celery': {
            'handlers': ['console'],
            'level': 'INFO'
        }
    }
}

# CORS 
CORS_ORIGIN_ALLOW_ALL = True

# Cache configuration
SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
        "KEY_PREFIX": "app"
    }
}
