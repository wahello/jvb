from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .serializers import UserQuickLookSerializer

from .models import UserQuickLook

class UserQuickLookView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserQuickLook.objects.all()
    serializer_class = UserQuickLookSerializer