from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'users/last_synced', views.UserLastSyncedItemview.as_view(), name="User Last sync time"),
	url(r'users/have_tokens', views.HaveTokens.as_view(), name="have_tokens"),
	url(r'users/userrequestbackfill', views.UserBackfillRequestView.as_view(),name="user_backfill_request"),
	url(r'users/aa_custom_ranges', views.AACustomRangesView.as_view(),name="user_aa_custom_ranges"),
	url(r'users/id',views.get_user_id,name="user_id"),
]