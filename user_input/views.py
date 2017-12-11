from datetime import datetime

from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication 

from .serializers import UserDailyInputSerializer

from .models import UserDailyInput

# https://stackoverflow.com/questions/30871033/django-rest-framework-remove-csrf
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return

class UserDailyInputView(generics.ListCreateAPIView):

    '''
        - Create the userDailyInput instance
        - List all the userDailyInput instance
        - If query parameters "to" and "from" are provided
          then filter the userDailyInput data for provided date interval
          and return the list
    '''
    authentication_classes = (CsrfExemptSessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserDailyInputSerializer

    def get_queryset(self):
        user = self.request.user
        start_dt = self.request.query_params.get('from',None)
        end_dt = self.request.query_params.get('to',None)

        if start_dt and end_dt:
            return UserDailyInput.objects.filter(Q(created_at__gte=start_dt)&
                                                 Q(created_at__lte=end_dt),
                                                 user = user)
        else:
            return UserDailyInput.objects.all()

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
        try:
            obj = qs.get(created_at=dt)
            return obj
        except UserDailyInput.DoesNotExist:
            return None

    def get(self,request, format=None):
        user_input = self.get_object()
        print("/n/nUSER INPUT:",user_input)
        if user_input:
            serializers = UserDailyInputSerializer(user_input)
            return Response(serializers.data)
        else:
            return Response({})
