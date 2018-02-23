web: waitress-serve --port=$PORT jvbhealthwellness.wsgi:application
worker: celery worker --app=jvbhealthwellness --loglevel=info
celery_beat: celery --app=jvbhealthwellness beat --loglevel=info
