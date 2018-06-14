#!/bin/bash
npm run build
source venv/bin/activate
pip3 install -r requirements.txt
python3 manage.py runserver 0.0.0.0:8000
exec "$@"
