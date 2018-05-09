# -*- coding: utf-8 -*-

import re,json
from datetime import datetime,timedelta
from rauth import OAuth1Service

from django.contrib.auth.models import User
from django.db import DatabaseError

from .models import (
	UserGarminDataEpoch,
    UserGarminDataSleep,
    UserGarminDataBodyComposition,
    UserGarminDataDaily,
    UserGarminDataActivity,
    UserGarminDataManuallyUpdated,
    UserGarminDataStressDetails,
    UserGarminDataMetrics,
    UserGarminDataMoveIQ,
    GarminPingNotification,
    # GarminConnectToken
)

from quicklook.tasks import generate_quicklook
from progress_analyzer.tasks import (
	generate_cumulative_instances_custom_range,
	set_pa_report_update_date
)

def _get_model_types():
	MODEL_TYPES = {
		"dailies":UserGarminDataDaily,
		"activities":UserGarminDataActivity,
		"manuallyUpdatedActivities":UserGarminDataManuallyUpdated,
		"epochs":UserGarminDataEpoch,
		"sleeps":UserGarminDataSleep,
		"bodyComps":UserGarminDataBodyComposition,
		"stressDetails":UserGarminDataStressDetails,
		"moveIQActivities":UserGarminDataMoveIQ,
		"userMetrics":UserGarminDataMetrics
	}
	return MODEL_TYPES

def get_ping_summary_types():
	return [
		"dailies", "activities", "manuallyUpdatedActivities",
		"epochs", "sleeps", "bodyComps", "stressDetails",
		"moveIQActivities", "userMetrics", "deregistration"
	]

def _safe_get(data,attr,default):
		data_item = data.get(attr,None)
		if not data_item:
			return default
		return data_item

def store_ping_notifications(obj,dtype,user):
	callback_url = obj.get('callbackURL')
	upload_start_time = None
	if dtype != "deregistration":
		upload_start_time = int(
			re.search('uploadStartTimeInSeconds=(\d+)*',callback_url).group(1)
		)
	obj = GarminPingNotification.objects.create(
		user = user,
		summary_type = dtype,
		upload_start_time_seconds = upload_start_time,
		notification = json.dumps(obj)
	)
	return obj

def update_notification_state(instance,state="unprocessed"):
	valid_states = [x[0] for x in GarminPingNotification.PING_STATE_CHOICES]
	if state and state in valid_states:
		instance.state = state
	else:
		instance.state = 'unprocessed'

	instance.save()

def _createObjectList(user,json_data,dtype,record_dt):
	'''
		Helper method to create instance of model
	'''
	if len(json_data):
		model = _get_model_types()[dtype]
		record_date = record_dt
		if not dtype in ["bodyComps","userMetrics"]:
			objects = [
				model(user=user,
					  summary_id=obj.get("summaryId"),
					  record_date_in_seconds=record_date,
					  start_time_in_seconds=obj.get("startTimeInSeconds")+\
											_safe_get(obj,"startTimeOffsetInSeconds",0),
					  start_time_duration_in_seconds=obj.get("durationInSeconds"),
					  data = obj)
				for obj in json_data
			]
		if dtype == "bodyComps":
			objects = [
				model(  user=user,
						summary_id=obj.get("summaryId"),
						record_date_in_seconds=record_date,
						start_time_in_seconds=obj.get("measurementTimeInSeconds")+\
											  _safe_get(obj,"measurementTimeOffsetInSeconds",0),
						start_time_duration_in_seconds=obj.get("durationInSeconds"),
						data = obj)
				for obj in json_data
			]
		if dtype == "userMetrics":
			objects = [
				model(  user=user,
						summary_id=obj.get("summaryId"),
						record_date_in_seconds=record_date,
						calendar_date=obj.get("calendarDate"),
						data=obj)
				for obj in json_data
			]

		return objects

def _get_data_start_time(json_data,data_type):
	if len(json_data):
		obj = json_data[0]
		if not data_type in ["userMetrics","bodyComps"]:
			start_time = obj.get("startTimeInSeconds")+_safe_get(obj,"startTimeOffsetInSeconds",0)
			start_time = datetime.utcfromtimestamp(int(start_time)).strftime("%Y-%m-%d")
		elif data_type == "userMetrics":
			start_time = obj.get("calendarDate")
		elif data_type == "bodyComps":
			start_time = obj.get("measurementTimeInSeconds",0)+_safe_get(obj,"measurementTimeOffsetInSeconds",0)
			start_time = datetime.utcfromtimestamp(int(start_time)).strftime("%Y-%m-%d")
		return start_time

def store_garmin_health_push(notifications,ping_notif_obj=None):

	'''
	Receive Health PING notification, pull Health Data store in database.
	Generate/update raw data report as well. Update PA reports as per need. 
	
	Args:
		notification (dict): A ping notification
		ping_notif_obj (:obj:`GarminPingNotification`, optional): A GarminPingNotification
			object. If provided then do not create a new object for ping notification
			instead use this object and update it's state. Default to None

	'''
	req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
	authurl = 'http://connect.garmin.com/oauthConfirm'
	acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
	conskey = '6c1a770b-60b9-4d7e-83a2-3726080f5556';
	conssec = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9';
	print(notifications)

	MODEL_TYPES = _get_model_types()
	for dtype in notifications.keys():
		if dtype in get_ping_summary_types():
			for obj in notifications.get(dtype):
				user_key = obj.get('userAccessToken')
				try:
					user = User.objects.get(garmin_token__token = user_key)
				except User.DoesNotExist:
					user = None
					
				if user:
					# Store ping notification in database and update state to processing
					# if ping_notif_obj is None
					if not ping_notif_obj:
						ping_notif_obj = store_ping_notifications(obj,dtype,user)
					update_notification_state(ping_notif_obj,"processing")
					callback_url = obj.get('callbackURL')

					access_token = user.garmin_token.token
					access_token_secret = user.garmin_token.token_secret

					service = OAuth1Service(
						consumer_key = conskey,
						consumer_secret = conssec,
						request_token_url = req_url,
						access_token_url = acc_url,
						authorize_url = authurl, 
					)
					
					upload_start_time = int(re.search('uploadStartTimeInSeconds=(\d+)*',
										callback_url).group(1))

					upload_end_time = int(re.search('uploadEndTimeInSeconds=(\d+)*',
										callback_url).group(1))

					callback_url = callback_url.split('?')[0]

					data = {
						'uploadStartTimeInSeconds': upload_start_time,
						'uploadEndTimeInSeconds':upload_end_time
					}

					sess = service.get_session((access_token, access_token_secret))
					
					try:
						r = sess.get(callback_url, header_auth=True, params=data)
						obj_list = _createObjectList(user, r.json(), dtype,upload_start_time)
						MODEL_TYPES[dtype].objects.bulk_create(obj_list)
						update_notification_state(ping_notif_obj,"processed")
					except DatabaseError as e:
						update_notification_state(ping_notif_obj,"failed")
						print(str(e))
					except Exception as e:
						update_notification_state(ping_notif_obj,"failed")
						print(str(e))

					# Call celery task to calculate/recalculate quick look for date to
					# which received data belongs for the target user
					date = _get_data_start_time(r.json(),dtype)
					yesterday = datetime.now() - timedelta(days=1)

					if datetime.strptime(date,"%Y-%m-%d").date() == yesterday.date():
						# if receive yesterday data then update the cumulative sums for yesterday
						# as well.  
						yesterday = yesterday.strftime("%Y-%m-%d")
						chain = (
							generate_quicklook.si(user.id,date,date)|
						 	generate_cumulative_instances_custom_range.si(user.id,date,date)
						)
						chain.delay()
					elif datetime.strptime(date,"%Y-%m-%d").date() != datetime.now().date():
						# if received data is not for today (some historical data) then
						# we have to update all the PA report from that date. So we need to record
						# this date in database and update PA later as a celery task
						generate_quicklook.delay(user.id,date,date)
						set_pa_report_update_date.delay(
							user.id, 
							date
						)
					else:
						generate_quicklook.delay(user.id,date,date)
		else:
			print('Summary type "{}" is not supported'.format(dtype))