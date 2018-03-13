import json
import datetime
import base64
import requests
import webbrowser
import pprint

from django.shortcuts import render
from django.core.mail import EmailMessage
from django.shortcuts import redirect

from rauth import OAuth2Service, OAuth2Session

from .models import FitbitConnectToken

# Create your views here.
def request_token_fitbit(request):
  service = OAuth2Service(
           client_id='22CN2D',
           client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b',
           access_token_url='https://api.fitbit.com/oauth2/token',
           authorize_url='https://www.fitbit.com/oauth2/authorize',
           base_url='https://fitbit.com/api')  

  params = {
    'redirect_uri':'http://127.0.0.1:8000/callbacks/fitbit',
    'response_type':'code',
    'scope':' '.join(['activity','nutrition','heartrate','location',
             'profile','settings','sleep','social','weight'])
  }
  url = service.get_authorize_url(**params) 


  return redirect(url)


def receive_token_fitbit(request):
  client_id='22CN2D'
  client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b'
  access_token_url='https://api.fitbit.com/oauth2/token'
  authorize_url='https://www.fitbit.com/oauth2/authorize'
  base_url='https://fitbit.com/api'

  authorization_code = request.GET.get('code',None)
  if authorization_code:
    client_id_secret = '{}:{}'.format(client_id,client_secret).encode()
    headers = {
      'Authorization':'Basic'+' '+base64.b64encode(client_id_secret).decode('utf-8'),
      'Content-Type':'application/x-www-form-urlencoded'
    }
    data = {
      'clientId':client_id,
      'grant_type':'authorization_code',
      'redirect_uri':'http://127.0.0.1:8000/callbacks/fitbit',
      'code':authorization_code
    }
    r = requests.post(access_token_url,headers=headers,data=data)
    
    a = r.json()
    print(type(a))

    try:
      token = FitbitConnectToken.objects.get(user = request.user)
      if token:
        setattr(token, "refresh_token", a['refresh_token'])
        setattr(token, "access_token", a['access_token'])
        setattr(token, "user_id_fitbit", a['user_id'])
        token.save()
    except FitbitConnectToken.DoesNotExist:
      FitbitConnectToken.objects.create(user=request.user,refresh_token=a['refresh_token'],
                                 access_token=a['access_token'],user_id_fitbit=a['user_id'])
    return redirect('/service_connect_fitbit')

def fetching_data_fitbit(request):
	service = OAuth2Service(
           client_id='22CN2D',
           client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b',
           access_token_url='https://api.fitbit.com/oauth2/token',
           authorize_url='https://www.fitbit.com/oauth2/authorize',
           base_url='https://fitbit.com/api')
	tokens = FitbitConnectToken.objects.get(user = request.user)
	# print(tokens)
	access_token = tokens.access_token
	session = service.get_session(access_token)
	#The date in the format yyyy-MM-dd
	date = '2018-03-07'
	user_id = tokens.user_id_fitbit
	esponse = session.get("https://api.fitbit.com/1/user/-/activities/date/2018-03-07.json")
	a = esponse.json()
	print(pprint.pprint(a))

	# mail = EmailMessage()
	# mail.subject = ""
	# mail.body = str(a)
	# mail.to = ['dileepk@s7inc.co']
	# mail.send()

	return redirect('/')

