from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^users/data$',views.UserQuickLookView.as_view(),
								  name="quick_look"),
	url(r'^users/grades$',views.GradeListView.as_view(),
								name="grades_list"),
	url(r'^users/grades/(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})$',
						views.GradeItemView.as_view(),name="grade_item"),

	url(r'^users/grades/weekly/(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})$',
						views.GradeWeeklyListView.as_view(),name="grade_weekly_list"),

	url(r'^users/steps$',views.StepListView.as_view(),
								name="steps_list"),

	url(r'^users/steps/(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})$',
						views.StepsItemView.as_view(),name="step_item"),

	url(r'^users/sleep$',views.SleepListView.as_view(),
								name="sleep_list"),

	url(r'^users/sleep/(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})$',
						views.SleepItemView.as_view(),name="sleep_item"),
]