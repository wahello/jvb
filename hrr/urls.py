from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^hrr_calculations_api$',views.hrr_calculations_api,
								  name="hrr"),
	url(r'^aa_calculations$',views.aa_calculations,
								  name="aa"),
	url(r'^aa_workout_calculations$',views.aa_workout_calculations,
								  name="aa_workout"),
	url(r'^daily_aa_calculations$',views.daily_aa_calculations,
								  name="daily_aa"),
	# url(r'^weekly_aerobic_anaerobic_summary$',views.weekly_aerobic_anaerobic_summary,
	# 								name="weekly_a/a")
	]