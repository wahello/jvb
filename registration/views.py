from registration.models import User_Input
from registration.serializers import UserInputSerializer,UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework import permissions
from registration.permissions import IsOwnerOrReadOnly
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import renderers
from rest_framework.views import APIView
from rest_framework import status


class UserInputHighlight(generics.GenericAPIView):
    queryset = User_Input.objects.all()
    renderer_classes = (renderers.StaticHTMLRenderer,)

    def get(self, request, *args, **kwargs):
        snippet = self.get_object()
        return Response(snippet.highlighted)
# Create your views here.
class UserInputList(generics.ListCreateAPIView):
    queryset = User_Input.objects.all()
    serializer_class = UserInputSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class UserInputDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User_Input.objects.all()
    serializer_class = UserInputSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                      IsOwnerOrReadOnly,)

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserCreate(APIView):
    """
    Creates the user.
    """

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
