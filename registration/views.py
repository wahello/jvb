from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from rest_framework.authentication import SessionAuthentication


from .serializers import UserSerializer, UserProfileSerializer
from .models import Profile

# class UserList(generics.ListAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# class UserDetail(generics.RetrieveAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

class Login(APIView):
	def post(self, request, format="json"):
		username = request.data.get('username')
		password = request.data.get('password')
		user = authenticate(request,username=username, password=password)
		if user:
			login(request,user)
			return Response(status=status.HTTP_200_OK)
		else:
			return Response(status=status.HTTP_401_UNAUTHORIZED)

class UserCreate(APIView):
    def post(self, request, format="json"):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserItemView(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = UserProfileSerializer
	queryset = Profile.objects.all()

	def get_object(self):
		qs = self.get_queryset()
		print(self.request.user)
		obj = get_object_or_404(qs,user=self.request.user)
		return obj
