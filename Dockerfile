FROM ubuntu:16.04
ADD requirements.txt /requirements.txt
RUN mkdir /code/
WORKDIR /code/
ADD . /code/
RUN apt-get update && apt-get -y upgrade
RUN apt-get -qq -y install curl
RUN apt-get -y install sudo
RUN sudo apt install default-jdk -y
RUN sudo apt install default-jre
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt-get install --yes build-essential
RUN sudo apt-get install -y nodejs
RUN npm install
RUN apt-get install -y software-properties-common vim
RUN add-apt-repository ppa:jonathonf/python-3.5
RUN apt-get install -y build-essential python3.5 python3.5-dev python3-pip python3.5-venv
RUN sudo apt-get install python3-pip -y
#RUN apt-get install -y python3 python-pip
RUN apt-get install -y python3-dev -y
RUN apt-get install -y libmysqlclient-dev
RUN sudo apt-get install gcc-4.9 -y
RUN sudo apt-get install make
RUN sudo apt-get install libc-dev
RUN sudo apt-get install zlib1g-dev
#RUN sudo apt-get install zlib-dev
RUN apt-get install libpcre3
RUN apt-get install libpcre3-dev -y
RUN sudo apt-get install musl-dev -y
#RUN sudo apt-get install linux-headers 
#RUN sudo apt-get install pcre-dev 
#RUN sudo apt-get install postgresql-dev
RUN apt-get install -y vim
RUN apt-get install redis-server -y
RUN pip3 install redis
RUN pip3 install virtualenv 
RUN virtualenv venv
RUN /bin/bash -c "virtualenv -p python3 venv"
RUN /bin/bash -c "source /code/venv/bin/activate"
RUN sudo apt-get install python-setuptools -y
RUN pip3 install https://github.com/mozilla/unicode-slugify/tarball/master
RUN pip3 install unidecode
RUN sudo apt-get -y install locales
RUN sudo locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
RUN pip3 install psycopg2 \
  && pip3 install python-decouple==3.0 \
  && pip3 install django_su==0.6.0 \
  && pip3 install django.js \
  && pip3 install django-webpack-loader==0.5.0 \
  && pip3 install django-cors-headers==2.1.0 \
  && pip3 install djangorestframework \
  && pip3 install django-naomi \
  && pip3 install XlsxWriter \
  && pip3 install rauth \
  && pip3 install fixmydjango \
  && pip3 install django-model-utils \
  && pip3 install django==1.11.2 \
  && pip3 install celery \
  && pip3 install fitparse \
  && pip3 install django-guardian>=1.4.6
RUN /bin/bash -c "/code/venv/bin/pip3 install -r /requirements.txt"
# uWSGI will listen on this port
# Add any custom, static environment variables needed by Django or your settings file here:
ENV DJANGO_SETTINGS_MODULE=jvbhealthwellness.settings.test
# uWSGI configuration (customize as needed):
ENV UWSGI_VIRTUALENV=/venv UWSGI_WSGI_FILE=jvbhealthwellness/wsgi.py UWSGI_HTTP=:8000 UWSGI_MASTER=1 UWSGI_WORKERS=2 UWSGI_THREADS=8 UWSGI_UID=1000 UWSGI_GID=2000 UWSGI_LAZY_APPS=1 UWSGI_WSGI_ENV_BEHAVIOR=holy
# Call collectstatic (customize the following line with the minimal environment variables needed for manage.py to run):
RUN DATABASE_URL=none /code/venv/bin/python3 manage.py collectstatic --noinput
RUN /code/venv/bin/python3 manage.py migrate
RUN ["chmod", "+x", "/code/docker-entrypoint.sh"]
ENTRYPOINT ["/code/docker-entrypoint.sh"]
