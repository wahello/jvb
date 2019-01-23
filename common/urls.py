from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'users/last_synced', views.UserLastSyncedItemview.as_view(), name="User Last sync time"),
	url(r'users/have_tokens', views.HaveTokens.as_view(), name="have_tokens"),
	url(r'users/userrequestbackfill/', views.UserRequestView.as_view(),name="user_request")
]

