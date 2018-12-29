from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics

from .serializers import UserSerializer, UserProfileSerializer
from .models import Profile,\
	TermsConditions,\
	TermsConditionsText,\
	Invitation
from .custom_signals import post_registration_notify
from .decorators import invitation_required

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
			return Response({"user_status":user.is_authenticated(),
			"terms_conditions":user.profile.terms_conditions}, status=status.HTTP_200_OK)
		else:
			return Response(status=status.HTTP_401_UNAUTHORIZED)


class Logout(APIView):
	def get(self,request,format="json"):
		logout(request)
		return Response(status=status.HTTP_200_OK)

@method_decorator(invitation_required, name="dispatch")
class UserCreate(APIView):
	def post(self, request, format="json"):
		serializer = UserProfileSerializer(data=request.data)
		if serializer.is_valid():
			user = serializer.save()
			if user:
				user = authenticate(request,
					username = request.data['username'],
					password = request.data['password']
				)
				login(request,user)
				post_registration_notify.send(
					sender = self.__class__,
					email_address = user.email,
					username = user.username,
					first_name = user.first_name
				)
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

class IsUserLoggedIn(APIView):
	def get(self, request, format="json"):
		if request.user.is_anonymous():
			terms_conditions = False
		else:
			terms_conditions = request.user.profile.terms_conditions
		return Response({"user_status":request.user.is_authenticated(),
			"terms_conditions":terms_conditions
			},status=status.HTTP_200_OK)

class AccepteTermsCondition(APIView):
	def post(self, request, format="json"):
		if request.data.get("terms_conditions",None):
			request.user.profile.terms_conditions = True
			request.user.profile.save()
			terms = TermsConditionsText.objects.get(version='1.0')
			TermsConditions.objects.create(user=request.user,
					terms_conditions_version=terms)
			return Response(status=status.HTTP_200_OK)
		else:
			return Response(status=status.HTTP_401_UNAUTHORIZED)

class IsUserInvited(APIView):
	'''
	Check if user is invited to register
	'''
	def get(self, request, format="json"):
		email = request.query_params.get('email')
		res = {"email":email}
		try:
			Invitation.objects.get(email=email)
			res['is_invited'] = True
		except Invitation.DoesNotExist as e:
			res['is_invited'] = False

		return Response(res,status=status.HTTP_200_OK)