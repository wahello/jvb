from datetime import datetime

from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication 

from .serializers import UserDailyInputSerializer

from .models import UserDailyInput

# https://stackoverflow.com/questions/30871033/django-rest-framework-remove-csrf
class CsrfExemptSessionAuthentication(SessionAuthentication):
	def enforce_csrf(self, request):
		return

class UserDailyInputView(generics.ListCreateAPIView):
	authentication_classes = (CsrfExemptSessionAuthentication,)
	permission_classes = (IsAuthenticated,)
	queryset = UserDailyInput.objects.all()
	serializer_class = UserDailyInputSerializer

class UserDailyInputItemView(generics.RetrieveUpdateDestroyAPIView):
	'''
		GET for getting particular model instance
		PUT for updating particular model instance
		DELETE for deleting particular model instance
		
		-displays only current user data not others (for now)
		-search item based on provided date
	'''
	permission_classes = (IsAuthenticated,)
	serializer_class = UserDailyInputSerializer

	def get_queryset(self):
		user = self.request.user
		qs = UserDailyInput.objects.filter(user=user)
		return qs

	def get_object(self):
		qs = self.get_queryset()
		if self.request.method == 'GET':
			dt = self.request.GET.get('created_at')
		if self.request.method == 'PUT':
			dt = self.request.data.get('created_at')
		print(dt)
		obj = get_object_or_404(qs,created_at=dt)
		return obj