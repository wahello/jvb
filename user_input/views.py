from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .serializers import UserDailyInputSerializer

from .models import UserDailyInput

@method_decorator(csrf_exempt, name='dispatch')
class UserDailyInputView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserDailyInput.objects.all()
    serializer_class = UserDailyInputSerializer