from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import Profile,TermsConditionsText,TermsConditions

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id','username','email','first_name','last_name')

class UserProfileSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')
	email = serializers.EmailField(source='user.email')
	password = serializers.CharField(source='user.password')
	first_name = serializers.CharField(source='user.first_name')
	last_name  = serializers.CharField(source='user.last_name')

	def validate_username(self,username):
	   '''
		Make a case insensitive check to determine uniqueness of username
	   '''
	   UserModel = get_user_model()
	   case_insensitive_username_field = "{}__iexact".format(UserModel.USERNAME_FIELD)
	   if (username and UserModel._default_manager.filter(
			**{case_insensitive_username_field:username}).exists()):
	   		raise serializers.ValidationError("Username already exist")
	   return username

	class Meta:
		model = Profile
		fields = ('id','username','email','password','first_name','last_name',
				  'gender','height','weight','date_of_birth','sleep_goals','goals',
				  'created_at','updated_at','terms_conditions')
		extra_kwargs = {
			'password': {'write_only': True}
		}
	def create(self,validated_data):
		user_data = validated_data.pop('user')
		user = User.objects.create_user(**user_data)
		validated_data['goals'] = Profile.GOALS_CHOICE[0][1]
		profile = Profile.objects.create(user=user,**validated_data)
		if validated_data['terms_conditions']:
			terms = TermsConditionsText.objects.get(version='1.0')
			TermsConditions.objects.create(user=user,
		  		terms_conditions_version=terms)
		return profile

	def update(self, instance, validated_data):
		user = instance.user
		user.email = validated_data.get('email',user.email)
		user.save()
		instance.first_name = validated_data.get('first_name', user.first_name)
		instance.last_name = validated_data.get('last_name', user.first_name)
		instance.gender = validated_data.get('gender',instance.gender)
		instance.height = validated_data.get('height', instance.height)
		instance.weight = validated_data.get('weight', instance.weight)
		instance.date_of_birth = validated_data.get('date_of_birth',instance.date_of_birth)
		instance.sleep_goals = validated_data.get('sleep_goals',instance.sleep_goals)
		instance.goals = validated_data.get('goals',instance.goals)
		instance.save()
		return instance
		
	def linktotc(self,validated_data):
		user_data = validated_data.pop('user')
		user = User.objects.create_user(**user_data)
		termsconditions = TermsConditions.objects.create(user=user,**validated_data)
		return termsconditions