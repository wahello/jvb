import json
import datetime
import base64
import requests
import webbrowser
import pprint
from datetime import datetime, timedelta , date
import ast

from django.shortcuts import render
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from django.http import HttpResponse

from rauth import OAuth2Service, OAuth2Session

from .models import FitbitConnectToken,\
					UserFitbitDataSleep,\
					UserFitbitDataHeartRate,\
					UserFitbitDataActivities



# Create your views here.
def request_token_fitbit(request):
	service = OAuth2Service(
					 client_id='22CN2D',
					 client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b',
					 access_token_url='https://api.fitbit.com/oauth2/token',
					 authorize_url='https://www.fitbit.com/oauth2/authorize',
					 base_url='https://fitbit.com/api')  

	params = {
		'redirect_uri':'https://app.jvbwellness.com/callbacks/fitbit',
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
			'redirect_uri':'https://app.jvbwellness.com/callbacks/fitbit',
			'code':authorization_code
		}
		r = requests.post(access_token_url,headers=headers,data=data)
		
		a = r.json()
		# print(print(a))

		try:
			token = FitbitConnectToken.objects.get(user = request.user)
			#print(token)
			if token:
				setattr(token, "refresh_token", a['refresh_token'])
				setattr(token, "access_token", a['access_token'])
				setattr(token, "user_id_fitbit", a['user_id'])
				token.save()
		except FitbitConnectToken.DoesNotExist:
			FitbitConnectToken.objects.create(user=request.user,refresh_token=a['refresh_token'],access_token=a['access_token'],user_id_fitbit=a['user_id'])
		return redirect('/service_connect_fitbit')

def fetching_data_fitbit(request):
	start_date = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date, "%m-%d-%Y").date()
	service = OAuth2Service(
					 client_id='22CN2D',
					 client_secret='e83ed7f9b5c3d49c89d6bdd0b4671b2b',
					 access_token_url='https://api.fitbit.com/oauth2/token',
					 authorize_url='https://www.fitbit.com/oauth2/authorize',
					 base_url='https://fitbit.com/api')
	tokens = FitbitConnectToken.objects.get(user = request.user)
	access_token = tokens.access_token
	session = service.get_session(access_token)

	date_fitbit = start_date
	sleep_fitbit = session.get("https://api.fitbit.com/1.2/user/-/sleep/date/{}.json".format(date_fitbit))
	activity_fitbit = session.get("https://api.fitbit.com/1/user/-/activities/date/{}.json".format(date_fitbit))
	heartrate_fitbit = session.get("https://api.fitbit.com/1/user/-/activities/heart/date/{}/1d.json".format(date_fitbit))
	# checking status
	statuscode = sleep_fitbit.status_code
	#converting str to dict
	sleep_fitbit = sleep_fitbit.json()
	activity_fitbit = activity_fitbit.json()
	heartrate_fitbit = heartrate_fitbit.json()

	try:
		if sleep_fitbit:
			date_of_sleep = sleep_fitbit['sleep'][0]['dateOfSleep']
			UserFitbitDataSleep.objects.update_or_create(user=request.user,
				date_of_sleep=date_of_sleep,sleep_data=sleep_fitbit)
	except (KeyError, IndexError):
		pass

	try:
		if heartrate_fitbit:
			date_of_heartrate = heartrate_fitbit['activities-heart'][0]['dateTime']
			UserFitbitDataHeartRate.objects.update_or_create(user=request.user,
				date_of_heartrate=date_of_heartrate,heartrate_data=heartrate_fitbit)
	except (KeyError, IndexError):
		pass

	# try:
	# 	if activity_fitbit:
	# 		date_of_sleep = sleep_fitbit['sleep'][0]['dateOfSleep']
	# 		UserFitbitDataActivities.objects.update_or_create(user=request.user,
	#data=activity_fitbit)
	# except (KeyError, IndexError):
	# 	pass

	print(pprint.pprint(sleep_fitbit))
	# print(pprint.pprint(activity_fitbit))
	# print(pprint.pprint(heartrate_fitbit))

	if statuscode == 401:
		if sleep_fitbit['errors'][0]['errorType'] == 'expired_token':
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
			c = r.json()
			# print(pprint.pprint(c))
			FitbitConnectToken.objects.filter(user=request.user).update(refresh_token=c['refresh_token'],access_token=c['access_token'])
			fetching_data_fitbit(request)

	fitbit_data = {"sleep_fitbit":sleep_fitbit
					,"activity_fitbit":activity_fitbit
					,"heartrate_fitbit":heartrate_fitbit}
	data = json.dumps(fitbit_data)
	return HttpResponse(data,content_type='application/json')

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


'''
	jvb 
		client id 		---- 22CN2D
		client secret   ---- e83ed7f9b5c3d49c89d6bdd0b4671b2b
		redirect url    ---- https://app.jvbwellness.com/callbacks/fitbit
	test
		client id 		---- 22CN46
		client secret   ---- 94d717c6ec36c270ed59cc8b5564166f
		redirect url    ---- http://127.0.0.1:8000/callbacks/fitbit
'''		 