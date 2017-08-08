from rest_framework import serializers
from registration.models import User_Input,CHOICE
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator

class UserInputSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = User_Input
        fields = ('id', 'gender', 'height', 'weight','date_of_birth','first_name','last_name','garmin_user_name','garmin_password','email','goals','other','age','aerobic_heart_rate_zone_high_number','aerobic_heart_rate_zone_low_number','owner')

    def create(self, validated_data):

        return User_Input.objects.create(**validated_data)


    def update(self, instance, validated_data):

        instance.gender = validated_data.get('gender', instance.gender)
        instance.height = validated_data.get('height', instance.height)
        instance.weight = validated_data.get('weight', instance.weight)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.garmin_user_name = validated_data.get('garmin_user_name', instance.garmin_user_name)
        instance.garmin_password = validated_data.get('garmin_password', instance.garmin_password)
        instance.email = validated_data.get('email', instance.email)
        instance.goals = validated_data.get('goals', instance.goals)
        instance.other = validated_data.get('other', instance.other)
        instance.age = validated_data.get('age', instance.age)
        instance.aerobic_heart_rate_zone_high_number = validated_data.get('aerobic_heart_rate_zone_high_number', instance.aerobic_heart_rate_zone_high_numberr)
        instance.aerobic_heart_rate_zone_low_number = validated_data.get('aerobic_heart_rate_zone_low_number', instance.aerobic_heart_rate_zone_low_number)
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(
            max_length=32,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(min_length=8, write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'],
             validated_data['password'])
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
