from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics


from .serializers import UserSerializer, UserProfileSerializer

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
		user = authenticate(username=username, password=password)
		print(user)
		if user:
			login(request,user)
			return Response(status=status.HTTP_200_OK)
		else:
			print('in the unauthorized area')
			return Response(status=status.HTTP_401_UNAUTHORIZED)

class UserCreate(APIView):

    def post(self, request, format="json"):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)