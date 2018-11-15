from django.conf.urls import url
from . import views

urlpatterns = [
	
	url(r'users/last_synced', 
		views.UserLastSyncedItemview.as_view(), name="User Last sync time"),
]
