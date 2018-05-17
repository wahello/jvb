# -*- coding: utf-8 -*-

import re,json
from datetime import datetime,timedelta
from functools import cmp_to_key
from rauth import OAuth1Service
import pytz

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
    UserLastSynced
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

def create_update_sync_time(user, sync_time_timestamp, offset):
	try:
		# If last sync info is already present, update it
		last_sync_obj = UserLastSynced.objects.get(user=user)
		last_sync_obj.offset = offset if offset else last_sync_obj.offset
		last_sync_timestamp = last_sync_obj.last_synced.timestamp()
		if last_sync_timestamp < sync_time_timestamp:
			last_sync_obj.last_synced = pytz.utc.localize(
				datetime.utcfromtimestamp(sync_time_timestamp)
			)
		last_sync_obj.save()
	except UserLastSynced.DoesNotExist as e:
		# if last sync info for user is not present, create record
		sync_date_time = pytz.utc.localize(
			datetime.utcfromtimestamp(sync_time_timestamp)
		)
		UserLastSynced.objects.create(
			user = user,
			last_synced = sync_date_time,
			offset = offset if offset else 0
		)
	except DatabaseError as e:
		# In case of race conditions which result in unexpected
		# results/errors
		message = """
MESSAGE: User last sync time create/update failed
ERROR: {}  
		"""
		print(message.format(str(e)))

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

def _get_latest_oldest_summary(json_data,data_type):

	def user_metrics_comparator(x,y):
		x_start_date = datetime.strptime(x.get('calendarDate'),"%Y-%m-%d")
		y_start_date = datetime.strptime(y.get('calendarDate'),"%Y-%m-%d")
		if x_start_date < y_start_date:
			return -1
		elif x_start_date == y_start_date:
			return 0
		else:
			return 1

	oldest_record = None
	latest_record = None

	if not data_type in ["bodyComps","userMetrics"]:
		json_data = sorted(
			json_data,
			key = lambda x:x.get('startTimeInSeconds',0)
		)
	elif data_type == "bodyComps":
		json_data = sorted(
			json_data,
			key = lambda x:x.get('measurementTimeInSeconds',0)
		)
		oldest_record = json_data[0]
		latest_record = json_data[-1]

	elif data_type == "userMetrics":
		json_data = sorted(
			json_data, 
			key = cmp_to_key(user_metrics_comparator)
		)
	oldest_record = json_data[0]
	latest_record = json_data[-1]
	return (oldest_record,latest_record)


def _get_data_start_end_time(json_data,data_type):
	'''
	Find the start date from which json_data have data and end date upto
	which json_data have health data.

	Args:
		json_data (list): List of dicts where each dict represent a health
			API summary.
		data_type (str):  summary type of summaries which json_data have.
			eg. sleeps or dailies etc.
	Returns:
		tuple: having start_time as first item and end_time as second
			eg. ('2018-05-10', '2018-05-14') 

	Example:
		If pulled data have data from May 10, 2018 to May 14, 2018 then
			start date will be 2018-05-10 and end date will be 2018-05-14
	'''
	if len(json_data):
		oldest_record,latest_record = _get_latest_oldest_summary(json_data,data_type)
		if not data_type in ["userMetrics","bodyComps","moveIQActivities"]:
			end_time = latest_record.get("startTimeInSeconds")+\
				latest_record.get("startTimeOffsetInSeconds",0)
			start_time = oldest_record.get("startTimeInSeconds")+\
				oldest_record.get("startTimeOffsetInSeconds",0)
			start_time = datetime.utcfromtimestamp(int(start_time)).strftime("%Y-%m-%d")
			end_time = datetime.utcfromtimestamp(int(end_time)).strftime("%Y-%m-%d")
		elif data_type == "moveIQActivities":
			end_time = latest_record.get("startTimeInSeconds")+\
				latest_record.get("offsetInSeconds",0)
			start_time = oldest_record.get("startTimeInSeconds")+\
				oldest_record.get("offsetInSeconds",0)
			start_time = datetime.utcfromtimestamp(int(start_time)).strftime("%Y-%m-%d")
			end_time = datetime.utcfromtimestamp(int(end_time)).strftime("%Y-%m-%d")
		elif data_type == "userMetrics":
			end_time = latest_record.get("calendarDate")
			start_time = oldest_record.get("calendarDate")
		elif data_type == "bodyComps":
			end_time = latest_record.get("measurementTimeInSeconds",0)+\
				latest_record.get("measurementTimeOffsetInSeconds",0)
			start_time = oldest_record.get("measurementTimeInSeconds",0)+\
				oldest_record.get("measurementTimeOffsetInSeconds",0)
			start_time = datetime.utcfromtimestamp(int(start_time)).strftime("%Y-%m-%d")
			end_time = datetime.utcfromtimestamp(int(end_time)).strftime("%Y-%m-%d")
		return (start_time,end_time)

def _get_data_offset(json_data, data_type, default_offset = 0):
	if len(json_data):
		latest_record = json_data[-1]
		if not data_type in ['userMetrics','bodyComps','moveIQActivities']:
			return latest_record.get('startTimeOffsetInSeconds',default_offset)
		elif data_type == "bodyComps":
			return latest_record.get('measurementTimeOffsetInSeconds',default_offset)
		elif data_type == "moveIQActivities":
			return latest_record.get('offsetInSeconds',default_offset)
		elif data_type == "userMetrics":
			return default_offset
		else:
			return default_offset

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

	service = OAuth1Service(
		consumer_key = conskey,
		consumer_secret = conssec,
		request_token_url = req_url,
		access_token_url = acc_url,
		authorize_url = authurl, 
	)

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
					offset = None
					try:
						r = sess.get(callback_url, header_auth=True, params=data)
						obj_list = _createObjectList(user, r.json(), dtype,upload_start_time)
						MODEL_TYPES[dtype].objects.bulk_create(obj_list)
						update_notification_state(ping_notif_obj,"processed")

						# Create or update the latest sync time
						offset = _get_data_offset(r.json(),dtype,default_offset=None)
						create_update_sync_time(user,upload_start_time,offset)
					except DatabaseError as e:
						update_notification_state(ping_notif_obj,"failed")
						print(str(e))
					except Exception as e:
						update_notification_state(ping_notif_obj,"failed")
						print(str(e))

					# Call celery task to calculate/recalculate quick look for date to
					# which received data belongs for the target user
					start_date, end_date = _get_data_start_end_time(r.json(),dtype)
					yesterday = datetime.now() - timedelta(days=1)

					if datetime.strptime(start_date,"%Y-%m-%d").date() == yesterday.date():
						# if receive yesterday data then update the cumulative sums for yesterday
						# as well.  
						chain = (
							generate_quicklook.si(user.id,start_date,end_date)|
						 	generate_cumulative_instances_custom_range.si(
						 		user.id,start_date,start_date
						 	)
						)
						chain.delay()
					elif datetime.strptime(start_date,"%Y-%m-%d").date() != datetime.now().date():
						# if received data is not for today (some historical data) then
						# we have to update all the PA report from that date. So we need to record
						# this date in database and update PA later as a celery task
						generate_quicklook.delay(user.id,start_date,end_date)
						set_pa_report_update_date.delay(
							user.id, 
							start_date
						)
					else:
						generate_quicklook.delay(user.id,start_date,end_date)
		else:
			print('Summary type "{}" is not supported'.format(dtype))