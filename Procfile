web: waitress-serve --port=$PORT jvbhealthwellness.wsgi:application
worker: celery worker --app=jvbhealthwellness --loglevel=info
beat:celery --app=jvbhealthwellness beat
