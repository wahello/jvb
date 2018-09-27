from decouple import Csv, config
from dj_database_url import parse as db_url
from celery.schedules import crontab

from .base import *  # noqa


DEBUG = False
SECRET_KEY = config('SECRET_KEY')

DATABASES = {
    'default': config('DATABASE_URL', cast=db_url),
}
DATABASES['default']['ATOMIC_REQUESTS'] = True

ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static/'

MEDIA_ROOT = 'mediafiles'
MEDIA_URL = '/media/'

SERVER_EMAIL = 'foo@example.com'

#Email (Mailjet)

EMAIL_USE_TLS = True
EMAIL_HOST = 'in-v3.mailjet.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = '1e89aa631a866963a84781409f047bd8'
EMAIL_HOST_PASSWORD = 'd56ac074ee9e0bac840bf70f7ffc4165'
DEFAULT_FROM_EMAIL = 'info@jvbwellness.com'


# Security
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
CSRF_COOKIE_HTTPONLY = True

# Webpack
WEBPACK_LOADER['DEFAULT']['CACHE'] = True

# Celery
CELERY_BROKER_URL = 'redis://ec2-52-3-232-117.compute-1.amazonaws.com:6379'
CELERY_RESULT_BACKEND = 'redis://ec2-52-3-232-117.compute-1.amazonaws.com:6379'
CELERY_SEND_TASK_ERROR_EMAILS = True
CELERY_TIMEZONE = 'America/New_York'
CELERY_BEAT_SCHEDULE = {
    #execute every day at 1:00 AM EST (America/New_york)
    'create-cumulative-sum':{
        'task':'progress_analyzer.generate_cumulative_instances',
        'schedule':crontab(minute=0, hour=1)
    },
    #execute every quarter to hour. Ex 10:45, 9:45 etc.
    'update-obsolete-progress-analyzer-report':{
        'task':'progress_analyzer.update_obsolete_pa_reports',
        'schedule':crontab(minute=45, hour='*/1')
    },
    #execute every day at 3:00 AM EST (America/New_york)
    'retry-failed-ping-notifications':{
        'task':'garmin.retry_failed_ping_notification',
        'schedule':crontab(minute=0, hour=3)
    },
     #execute every one hour UTC time zone
    'generate-log-for-incorrect-pa':{
        'task':'progress_analyzer.generate_log_incorrect_pa',
        'schedule':crontab(minute=0, hour='*/1')
    },
    #execute every day at 4:00 AM EST (America/New_york)
    "validate-garmin-health-token":{
        'task':'garmin.validate_garmin_health_token',
        'schedule':crontab(minute=0, hour=4)
    }
    #execute everyday at 10:00 pm EST (America/New_york)
    "remind_selected_users_submit_input":{
        'task':'userinputs.submit_userinput_reminder',
        'schedule':crontab(minute=0, hour=22)
    },
}

# Whitenoise
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MIDDLEWARE.insert(  # insert WhiteNoiseMiddleware right after SecurityMiddleware
    MIDDLEWARE.index('django.middleware.security.SecurityMiddleware') + 1,
    'whitenoise.middleware.WhiteNoiseMiddleware')

# django-log-request-id
MIDDLEWARE.insert(  # insert RequestIDMiddleware on the top
    0, 'log_request_id.middleware.RequestIDMiddleware')

# MIDDLEWARE.insert(  # insert RequestIDMiddleware on the top
#     0, 'django.middleware.cache.UpdateCacheMiddleware')

# MIDDLEWARE.insert(  # insert WhiteNoiseMiddleware right after SecurityMiddleware
#     MIDDLEWARE.index('django.middleware.clickjacking.XFrameOptionsMiddleware') + 1,
#     'django.middleware.cache.FetchFromCacheMiddleware')



LOG_REQUEST_ID_HEADER = 'HTTP_X_REQUEST_ID'
LOG_REQUESTS = True

# Opbeat
# INSTALLED_APPS += ['opbeat.contrib.django']
# MIDDLEWARE.insert(  # insert OpbeatAPMMiddleware on the top
#     0, 'opbeat.contrib.django.middleware.OpbeatAPMMiddleware')


SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'  

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        },
        'request_id': {
            '()': 'log_request_id.filters.RequestIDFilter'
        },
    },
    'formatters': {
        'standard': {
            'format': '%(levelname)-8s [%(asctime)s] [%(request_id)s] %(name)s: %(message)s'
        },
    },
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'filters': ['require_debug_false'],
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'filters': ['request_id'],
            'formatter': 'standard',
        },
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'INFO'
        },
        'django.security.DisallowedHost': {
            'handlers': ['null'],
            'propagate': False,
        },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'log_request_id.middleware': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    }
}


CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://ec2-52-3-232-117.compute-1.amazonaws.com:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient"
        },
        "KEY_PREFIX": "app"
    }
}

# Elastic APM settings
INSTALLED_APPS.insert(0,"elasticapm.contrib.django")
MIDDLEWARE.insert(0,'elasticapm.contrib.django.middleware.TracingMiddleware')
ELASTIC_APM = {
    # allowed characters in SERVICE_NAME: a-z, A-Z, 0-9, -, _, and space
    'SERVICE_NAME': 'JVB-Production',
    'SECRET_TOKEN': 'health',
    'SERVER_URL': 'http://13.232.104.156:8200',
    'DEBUG': True,
}