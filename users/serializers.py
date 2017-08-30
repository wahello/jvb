from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from rauth import OAuth1Service

from .models import GarminToken



class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(min_length=8)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'],
             validated_data['password'])
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

class GarminTokenSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only = True)

    def create(self,validated_data):
        user = self.context['request'].user
        token = GarminToken.objects.create(user=user,**validated_data)
        return token

    def update(self,instance,validated_data):
        instance.token = validated_data.get('token',instance.token)
        instance.token_secret = validated_data.get('token_secret', instance.token_secret)
        instance.save()

    class Meta:
        model = GarminToken
        fields = ('__all__')

