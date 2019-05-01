import ast
from datetime import datetime,timedelta
import logging
from django.shortcuts import render
from django.http import Http404,HttpResponse
from django.db.models import Q
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apple.serializers import (UserAppleDataStepsSerializer,
								UserAppleDataActivitiesSerializer)
from apple.models import (UserAppleDataSteps,
							ApplePingNotification,
							UserAppleDataActivities)

def process_notification(user,summary_type,state):
	""" This function will create instance of ping notification
	Args:
		user(instance): user instance
		summary_type(str): which data
		state(str): state of current ping notification
	Return:
		none
	"""

	time=datetime.now().timestamp()
	notification="Steps"
	instance=ApplePingNotification(user_id=user,
		upload_start_time_seconds=time,
		summary_type=summary_type,
		state=state,
		notification=notification)
	instance.save()
	return instance

def update_notification(instance):
	"""This function will update state in instance of ping notification
	Args:
		instance(state): instance
	Return:
		none
	"""

	instance.state='processing'
	instance.save()

def update_notification2(instance):
	"""This function will update state in instance of ping notification
	Args:
		instance(state): instance
	Return:
		none
	"""

	instance.state='processed'
	instance.save()

def error_notification(instance):
	"""This function will update state in instance of ping notification
	Args:
		instance(state): instance
	Return:
		none
	"""

	instance.state='failed'
	instance.save()

def update_steps_data(user_instance,data):
	"""This function will update user's steps data given by user
	Args:
		user_instance:user instance
	Reurn:
		data
	"""
	print(data,"data")
	user_instance.data = data
	user_instance.save()
	return Response("Steps Data Updated in Database Successfully",status=status.HTTP_201_CREATED)


	
class UserAppleDataStepsView(generics.CreateAPIView):
	
	permission_classes = (IsAuthenticated,)
	serializer_class = UserAppleDataStepsSerializer

	def post(self,request):
		print(request,"request")
		user = request.user
		summary_type = "steps"
		state="unprocessed"
		obj_date=request.data.get('belong_to')
		updated_data = request.data.get('data')
		user = request.data.get('user')
		summary_id = request.data.get('summary_id')
		print(obj_date,"obj_date")
		obj_date_str = obj_date[0:10]
		print(obj_date_str,"dateeeeeeee")
		try:
			obj=UserAppleDataSteps.objects.get(user=user,belong_to__contains=obj_date_str)
			return update_steps_data(obj,updated_data)
		except:
			logging.exception("message")
			instance=process_notification(user,summary_type,state)
			# serializer= UserAppleDataStepsSerializer(data= request.data, partial=True)
			UserAppleDataSteps.objects.create(
				user_id=user,belong_to=obj_date_str,summary_id=summary_id,data=updated_data)
			update_notification(instance)
			update_notification2(instance)
			return Response("Steps Data Stored in Database Successfully",status=status.HTTP_201_CREATED)	
			# else:
			# 	error_notification(instance)
			# 	return Response("Data Not Stored in Database",status=status.HTTP_400_BAD_REQUEST)

	
def merge_user_data(user, start_date):
	""" this function will merge the apple steps data based on date
	Args: 
		user: user instance
		start_date: datetime object 
	Return:
		append data in dictionary formate 
	"""
	# print(type(start_date),"start dateeeeeee")
	# date_qs = UserAppleDataSteps.objects.filter(Q(
	# 	belong_to__gte=start_date) & Q(
	# 	belong_to__lt=start_date),user=user)
	date_qs = UserAppleDataSteps.objects.filter(user=user,
		belong_to__range=[start_date,start_date+timedelta(days=1)])
	data = []
	[data.append(ast.literal_eval(single_obj.data)) for single_obj in date_qs]
	# print(data,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
	return data

def update_activities_data(user_instance,data):
	"""This function will update user's activities data given by user
	Args:
		user_instance:user instance
	Reurn:
		data
	"""
	user_instance.data = data
	user_instance.save()
	return Response("Actvities Data Updated in Database Successfully",status=status.HTTP_201_CREATED)

class UserAppleDataActivitiesView(generics.CreateAPIView):
	
	permission_classes = (IsAuthenticated,)
	serializer_class = UserAppleDataActivitiesSerializer
	def post(self,request):
		
		user = request.user
		summary_type = "activities"
		state = "unprocessed"
		obj_date=request.data.get('belong_to')
		updated_data = request.data.get('data')
		user = request.data.get('user')
		obj_date_str = obj_date[0:10]
		try:
			obj=UserAppleDataActivities.objects.get(user=user,belong_to__contains=obj_date_str)
			return update_activities_data(obj,updated_data)	
		except:
			logging.exception("message")
			instance=process_notification(user,summary_type,state)
			# serializer= UserAppleDataActivitiesSerializer(data= request.data, partial=True)
			UserAppleDataActivities.objects.create(
				user_id=user,belong_to=obj_date_str,data=updated_data)
			update_notification(instance)
			update_notification2(instance)
			return Response("Actvities Data Stored in Database Successfully",status=status.HTTP_201_CREATED)
			# else:
			# 	error_notification(instance)
			# 	return Response("Data Not Stored in Database",status=status.HTTP_400_BAD_REQUEST)

