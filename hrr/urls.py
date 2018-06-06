from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^hrr_calculations$',views.hrr_calculations,
								  name="hrr"),
	url(r'^aa_calculations$',views.aa_calculations,
								  name="aa"),
	url(r'^aa_workout_calculations$',views.aa_workout_calculations,
								  name="aa_workout"),
	url(r'^daily_aa_calculations$',views.daily_aa_calculations,
								  name="daily_aa"),
	url(r'^aa_low_high_calculations$',views.aa_low_high_end_calculations,
									name="aa_classification chart")
	]