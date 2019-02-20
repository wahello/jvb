from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import Http404

from .serializers import UserAppleDataStepsSerializer

from .models import UserAppleDataSteps

class UserAppleDataStepsView(generics.CreateAPIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = UserAppleDataStepsSerializer

	def post(self,request):
		serializer= UserAppleDataStepsSerializer(data= request.data, partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data,status=status.HTTP_201_CREATED)
		return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
 