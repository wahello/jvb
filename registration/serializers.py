from django.contrib.auth.models import User

from rest_framework import serializers

from .models import Profile

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

    class Meta:
        model = Profile
        fields = ('id','username','email','password','first_name','last_name',
                  'gender','height','weight','date_of_birth','goals','created_at',
                  'updated_at')
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def create(self,validated_data):
        print(validated_data)
        user_data = validated_data.pop('user')
        print(user_data)
        user = User.objects.create_user(**user_data)
        validated_data['goals'] = Profile.GOALS_CHOICE[0][1]
        
        profile = Profile.objects.create(user=user,**validated_data)
        return profile

    def update(self, instance, validated_data):
        user = instance.user
        user.email = validated_data.get('email',user.email)
        instance.first_name = validated_data.get('first_name', user.first_name)
        instance.last_name = validated_data.get('last_name', user.first_name)
        instance.gender = validated_data.get('gender',instance.gender)
        instance.height = validated_data.get('height', instance.height)
        instance.weight = validated_data.get('weight', instance.weight)
        instance.date_of_birth = validated_data.get('date_of_birth',instance.date_of_birth)
        instance.goals = validated_data.get('goals',instance.goals)