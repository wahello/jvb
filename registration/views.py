import re

from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics

from .serializers import UserProfileSerializer
from .models import Profile,\
	TermsConditions,\
	TermsConditionsText,\
	Invitation
from .custom_signals import post_registration_notify
# from .decorators import invitation_required

# class UserList(generics.ListAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# class UserDetail(generics.RetrieveAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

class Login(APIView):
	def post(self, request, format="json"):
		username = request.data.get('username').strip()
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

# @method_decorator(invitation_required, name="dispatch")
class UserCreate(APIView):
	def post(self, request, format="json"):
		data = request.data
		strip_space_from = ['username','email','first_name','last_name']
		for key,value in data.items():
			if key in strip_space_from:
				data[key] = value.strip()
		serializer = UserProfileSerializer(data=data)
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
		# case_insensitive_email_field = "{}__iexact".format('email')
		res = {"email":email}

		# disabling invite check for time being
		# try:
		# 	Invitation.objects.get(**{case_insensitive_email_field:email})
		# 	res['is_invited'] = True
		# except Invitation.DoesNotExist as e:
		# 	res['is_invited'] = False
		res['is_invited'] = True

		return Response(res,status=status.HTTP_200_OK)

class ValidateEmailUsernameAvailability(APIView):

	def is_valid_login_creds(self,string,allowed_extra_chars=None):
		# encode unicode chars (like emojis) to utf-8 encoding
		string = string.encode('utf-8')
		valid_chars = 'a-zA-Z0-9'
		if(allowed_extra_chars):
			valid_chars += ''.join(allowed_extra_chars)
		pattern = '^[{}]+$'.format(valid_chars)
		byte_pattern = pattern.encode()
		return re.search(byte_pattern,string) is not None

	def get(self, request, format="json"):
		username = request.query_params.get('username',None)
		email = request.query_params.get('email',None)
		response = {
			"status":"success",
			"data":{}
		}

		if username:
			username_status = {
				"message": "",
				"availability": False
			}
			username = username.strip()
			if self.is_valid_login_creds(username):
				user = User.objects.filter(username__iexact = username)
				if user:
					username_status["message"] = "Username already taken"
					username_status["availability"] = False
				else:
					username_status["message"] = "Username is available"
					username_status["availability"] = True

			else:
				username_status["message"] = "Only alphanumeric characters allowed"
				username_status["availability"] = False

			response["data"]["username"] = username_status

		if email:
			email_status = {
				"message": "",
				"availability": False
			}
			email = email.strip()
			if self.is_valid_login_creds(email,['.','@']):
				user = User.objects.filter(email__iexact = email)
				if user:
					email_status["message"] = "Email already exist"
					email_status["availability"] = False
				else:
					email_status["message"] = "Email is available"
					email_status["availability"] = True
			else:
				email_status["message"] = "Only alphanumeric characters allowed"
				email_status["availability"] = False
			response["data"]["email"] = email_status

		return Response(response,status = status.HTTP_200_OK)