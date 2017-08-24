from django.conf.urls import url
from django.conf.urls import include
from rest_framework.urlpatterns import format_suffix_patterns
from registration import views

urlpatterns = [
    # url(r'^registration/$', views.UserInputList.as_view()),
    # url(r'^registration/(?P<pk>[0-9]+)/$', views.UserInputDetail.as_view()),
    # url(r'^registration/(?P<pk>[0-9]+)/highlight/$', views.UserInputHighlight.as_view()),
    # url(r'^users/$', views.UserList.as_view()),
    # url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'api/users/', views.UserCreate.as_view(), name='registration-create'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
