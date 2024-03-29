from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
	url(r'^refresh/hrr_calculations$',views.hrr_calculations,
								  name="hrr"),
	#url(r'^aa_calculations$',views.aa_calculations,
	#							  name="aa"),
	#url(r'^aa_workout_calculations$',views.aa_workout_calculations,
	#							  name="aa_workout"),
	#url(r'^daily_aa_calculations$',views.daily_aa_calculations,
	#							  name="daily_aa"),
	#url(r'^aa_low_high_calculations$',views.aa_low_high_end_calculations,
	#								name="aa_classification chart"),	
	url(r'^user/weekly_aa_data$',views.UserAaView.as_view(),name="weekly_aa_api"),
	url(r'^user/heartzone_data$',views.UserheartzoneView.as_view(),name="hearzone_api"),

	url(r'^weekly_workout_summary$',views.weekly_workout_summary,
									name="Weekly workout summary"),
	url(r'^hrr_calculations$',views.UserHrrView.as_view(),
								  name="hrr_api"),
	#url(r'^update/hrr_calculations/(?P<id>[0-9]+)/$',views.UpdateHrr.as_view(),
	#							  name="hrr_update"),
	url(r'^update/hrr_calculations$',views.UpdateHrr.as_view(),
								  name="hrr_update"),
	url(r'^raw_data/hrr_calculations$',views.UserHrrViewRawData.as_view(),
								  name="hrr_api_raw_data"),
	url(r'^aa_calculations$',views.UserAA.as_view(),
								  name="aa_database"),
	url(r'^aa_workout_calculations$',views.UserAA_workout.as_view(),
								  name="aa_workout_databse"),
	url(r'^daily_aa_calculations$',views.UserAA_daily.as_view(),
								  name="daily_aa"),
	url(r'^aa_low_high_calculations$',views.UserAA_low_high_values.as_view(),
									name="aa_classification chart"),
	url(r'^aa_twentyfour_hour_calculations$',views.UserAA_twentyfour_hour.as_view(),
								  name="aa_whole_day_database"),
	url(r'^aa_twentyfour_hour_low_high_calculations$',views.UserAA_twentyfour_hour_low_high_values.as_view(),
								  name="aa_whole_day_database"),
	url(r'^aa_ranges$',views.aa_ranges_api,name="aa ranges api"),
	url(r'^aa_dashboard/table$',views.UserAAdashboadTable.as_view(),name="aa dashboard table"),


]