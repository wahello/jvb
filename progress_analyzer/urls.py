from django.conf.urls import url
from progress_analyzer import views
# from quicklook.views import export_users_xls

urlpatterns = [
	url(r'^user/report$',views.ProgressReportView.as_view(),
								  name="progress_analyzer_report"),
	url(r'^user/report/(?P<year>\d{4})/(?P<month>\d{1,2})/(?P<day>\d{1,2})$$',views.ProgressReportView.as_view(),
								  name="progress_analyzer_report"),


	url(r'^print/progress/excel$',views.progress_excel_export,name="Exceldata"),
	#url(r'^print/progress/excel/(?P<year>\d{4})/(?P<month>\d{1,2})/(?P<day>\d{1,2})$',views.progress_excel_export,name="progress_Exceldata"),
	

]