import ast
from datetime import datetime,timedelta

from django.shortcuts import render
from django.http import Http404,HttpResponse
from django.db.models import Q
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apple.serializers import UserAppleDataStepsSerializer
from apple.models import UserAppleDataSteps,ApplePingNotification

def process_notification(user,summary_type,state):
	""" This function will create instance of ping notification
	Args:
		user(instance): user instance
		summary_type(str): which data
		state(str): state of current ping notification
	Return:
		none
	"""
	
	time=datetime.datetime.now().timestamp()
	notification="Steps"
	instance=ApplePingNotification(user=user,
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
	
class UserAppleDataStepsView(generics.CreateAPIView):
	
	permission_classes = (IsAuthenticated,)
	serializer_class = UserAppleDataStepsSerializer
	def post(self,request):
		
		user = request.user
		summary_type = "steps"
		state = "unprocessed"
		instance=process_notification(user,summary_type,state)
		serializer= UserAppleDataStepsSerializer(data= request.data, partial=True)
		update_notification(instance)
		if serializer.is_valid():
			serializer.save()
			update_notification2(instance)
			return Response("Data Stored in Database Successfully",status=status.HTTP_201_CREATED)
		else:
			error_notification(instance)
			return Response("Data Not Stored in Database",status=status.HTTP_400_BAD_REQUEST)


	
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
	date_qs = UserAppleDataSteps.objects.filter(
		belong_to__range=[start_date,start_date+timedelta(days=1)])
	data = []
	[data.append(ast.literal_eval(single_obj.data)) for single_obj in date_qs]
	# print(data,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
	return data

