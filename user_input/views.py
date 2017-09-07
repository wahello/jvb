from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .serializers import UserDailyInputSerializer

from .models import UserDailyInput

class UserDailyInputView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserDailyInput.objects.all()
    serializer_class = UserDailyInputSerializer