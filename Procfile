web: gunicorn jvbhealthwellness.wsgi --limit-request-line 8188 --log-file -
worker: celery worker --app=jvbhealthwellness --loglevel=info
