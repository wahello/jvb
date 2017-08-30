# http://blog.slatepeak.com/build-a-react-redux-app-with-json-web-token-jwt-authentication/

from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token

from registration import views

urlpatterns = [
    # url(r'^registration/$', views.UserInputList.as_view()),
    # url(r'^registration/(?P<pk>[0-9]+)/$', views.UserInputDetail.as_view()),
    # url(r'^registration/(?P<pk>[0-9]+)/highlight/$', views.UserInputHighlight.as_view()),
    # url(r'^users/$', views.UserList.as_view()),
    # url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'api/users/$', views.UserCreate.as_view(), name='registration-create'),
    url(r'api/users/obtain-auth-token/$', obtain_auth_token),
]

urlpatterns = format_suffix_patterns(urlpatterns)
