from django.conf.urls import url
from . import views
from . import calculation_views

urlpatterns = [
	url(r'^users/data$',views.UserQuickLookView.as_view(),
								  name="quick_look"),

	url(r'^users/data/(?P<year>\d{4})/(?P<month>\d{1,2})/(?P<day>\d{1,2})$',
						views.UserQuickLookItemView.as_view(),name="quicklook_item"),

	url(r'^users/grades$',views.GradeListView.as_view(),
								name="grades_list"),
	url(r'^users/grades/(?P<year>\d{4})/(?P<month>\d{1,2})/(?P<day>\d{1,2})$',
						views.GradeItemView.as_view(),name="grade_item"),

	url(r'^users/grades/weekly/(?P<year>\d{4})/(?P<month>\d{1,2})/(?P<day>\d{1,2})$',
						views.GradeWeeklyListView.as_view(),name="grade_weekly_list"),

	url(r'^users/steps$',views.StepListView.as_view(),
								name="steps_list"),

	url(r'^users/steps/(?P<year>\d{4})/(?P<month>\d{1,2})/(?P<day>\d{1,2})$',
						views.StepsItemView.as_view(),name="step_item"),

	url(r'^users/sleep$',views.SleepListView.as_view(),
								name="sleep_list"),

	url(r'^users/sleep/(?P<year>\d{4})/(?P<month>\d{1,2})/(?P<day>\d{1,2})$',
						views.SleepItemView.as_view(),name="sleep_item"),

	url(r'^users/movement_consistency$', 
		calculation_views.movementConsistencySummary.as_view(),
		name = "movement_consistency"),

	url(r'^users/ql_calculation$',calculation_views.QuicklookCalculationView.as_view(),
		name="quicklookcalculations"),

    url(r'^print/excel$',views.export_users_xls,name="Exceldata"),

    url(r'^aa_calculations$',views.aa_calculations,name="hrr_calculations"),
   
    # url(r'^print/movement_consistency$',views.export_movement_consistency_xls,
    # 	name="Movement_Consistency_data"),
    # url(r'^progressanalyser/$',views.export_progress_analyser_xls,name="progress_analyser"),
]
