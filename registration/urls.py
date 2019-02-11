# http://blog.slatepeak.com/build-a-react-redux-app-with-json-web-token-jwt-authentication/

from django.conf.urls import url
from django.contrib.auth import views as auth_view

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
    url(r'api/users/login/$',views.Login.as_view(), name='login'),
    url(r'api/users/logout/$',views.Logout.as_view(), name='logout'),
    url(r'api/users/profile/$',views.UserItemView.as_view(), name="user_profile"),
    url(r'api/users/status/$',views.IsUserLoggedIn.as_view(), name="user_logged_status"),
    url(r'api/users/termsconditions/$',views.AccepteTermsCondition.as_view(), name="terms_and conditions"),
    url(r'api/users/isinvited/$',views.IsUserInvited.as_view(), name="is_user_invited"),
    url(r'api/users/validate_email_username/$', views.ValidateEmailUsernameAvailability.as_view(),
        name = "validate_email_username"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
