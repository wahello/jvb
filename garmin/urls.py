from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'users/data/epoch$',views.UserGarminDataEpochView.as_view(), name="epoch_data"),
	url(r'users/data/sleep$',views.UserGarminDataSleepView.as_view(), name="sleep_data"),
	url(r'users/data/body_composition$',views.UserGarminDataBodyCompositionView.as_view(),
	    name="body_composition_data"),
	url(r'users/data/daily$',views.UserGarminDataDailyView.as_view(), name="daily_data"),
	url(r'users/data/activity$',views.UserGarminDataActivityView.as_view(), name="activity_data"),
	url(r'users/data/manually_updated$',views.UserGarminDataManuallyUpdatedView.as_view(),
	    name="manually_updated_data"),
	url(r'users/data/backfill$',views.fetchGarminBackFillData.as_view(),
	    name="backfill_api"),
]
