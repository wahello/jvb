from django.conf.urls import url
from . import views

urlpatterns = [
	
	url(r'users/have_tokens', views.HaveTokens.as_view(), name="have_tokens"),
]