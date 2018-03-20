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
					 client_id='22CN46',
					 client_secret='94d717c6ec36c270ed59cc8b5564166f',
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
	client_id='22CN46'
	client_secret='94d717c6ec36c270ed59cc8b5564166f'
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
		#print(print(a))

		try:
			token = FitbitConnectToken.objects.get(user = request.user)
			#print(token)
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
					 client_id='22CN46',
					 client_secret='94d717c6ec36c270ed59cc8b5564166f',
					 access_token_url='https://api.fitbit.com/oauth2/token',
					 authorize_url='https://www.fitbit.com/oauth2/authorize',
					 base_url='https://fitbit.com/api')
	tokens = FitbitConnectToken.objects.get(user = request.user)
	#print(tokens)
	access_token = tokens.access_token
	#print(access_token)
	session = service.get_session(access_token)
	#The date in the format yyyy-MM-dd
	date_fitbit = '2018-03-15'
	# user_id = tokens.user_id_fitbit
	sleep_fitbit = session.get("https://api.fitbit.com/1.2/user/-/sleep/date/{}.json".format(date_fitbit))
	# activity_fitbit = session.get("https://api.fitbit.com/1/user/-/activities/date/{}.json".format(date_fitbit))
	# body_fitbit = session.get("https://api.fitbit.com/1/user/-/body/log/fat/date/{}.json".format(date_fitbit))
	# food_fitbit = session.get("https://api.fitbit.com/1/user/-/foods/log/date/{}.json".format(date_fitbit))
	# hrr_fitbit = session.get("https://api.fitbit.com/1/user/-/activities/heart/date/{}/1d.json".format(date_fitbit))
	steps_fitbit = session.get("https://api.fitbit.com/1/user/-/activities/steps/date/{}/1m.json".format(date_fitbit))
	# try:
	# 	esponse = session.get("https://api.fitbit.com/1.2/user/-/sleep/date/2018-02-11.json")
	# 	a = esponse.json()
	# except HTTPError:
	# 	print("Dileep")
	# a = esponse.json()
	b = sleep_fitbit.status_code
	# sleep_fitbit = sleep_fitbit.json()
	# activity_fitbit = activity_fitbit.json()
	# body_fitbit = body_fitbit.json()
	# food_fitbit = food_fitbit.json()
	# hrr_fitbit = hrr_fitbit.json()
	steps_fitbit = steps_fitbit.json()
	# print(pprint.pprint(sleep_fitbit))
	# print(pprint.pprint(activity_fitbit))
	# print(pprint.pprint(body_fitbit))
	# print(pprint.pprint(food_fitbit))
	# print(pprint.pprint(hrr_fitbit))
	print(pprint.pprint(steps_fitbit))
	if b == 401:
		if a['errors'][0]['errorType'] == 'expired_token':
			client_id='22CN46'
			client_secret='94d717c6ec36c270ed59cc8b5564166f'
			access_token_url='https://api.fitbit.com/oauth2/token'
			token = FitbitConnectToken.objects.get(user = request.user)
			refresh_token_acc = token.refresh_token
			client_id_secret = '{}:{}'.format(client_id,client_secret).encode()
			headers = {
				'Authorization':'Basic'+' '+base64.b64encode(client_id_secret).decode('utf-8'),
				'Content-Type':'application/x-www-form-urlencoded'
			}
			data = {
				'grant_type' : 'refresh_token',
				'refresh_token': refresh_token_acc,
			}
			r = requests.post(access_token_url,headers=headers,data=data)
			c = r.json()
			print(pprint.pprint(c))
	# else:
	# 	pass
	# print(pprint.pprint(a))
	# print(pprint.pprint(a))
	# print(a['errors'][0]['errorType	'])
	# mail = EmailMessage()
	# mail.subject = ""
	# mail.body = str(a)
	# mail.to = ['dileepk@s7inc.co']
	# mail.send()

	return redirect('/')

def refresh_token_fitbit(request):
	client_id='22CN2D'
	client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b'
	access_token_url='https://api.fitbit.com/oauth2/token'
	token = FitbitConnectToken.objects.get(user = request.user)
	refresh_token_acc = token.refresh_token
	client_id_secret = '{}:{}'.format(client_id,client_secret).encode()
	headers = {
		'Authorization':'Basic'+' '+base64.b64encode(client_id_secret).decode('utf-8'),
		'Content-Type':'application/x-www-form-urlencoded'
	}
	data = {
		'grant_type' : 'refresh_token',
		'refresh_token': refresh_token_acc,
	}
	r = requests.post(access_token_url,headers=headers,data=data)
	a = r.json()
	#print(type(a))


