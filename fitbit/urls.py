from django.conf.urls import url
from . import views

urlpatterns = [
	
	url(r'users/have_fitbit_tokens', views.HaveFitbitTokens.as_view(), name="have_fitbit_tokens"),
]
