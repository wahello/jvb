from django.conf.urls import url
from progress_analyzer import views

urlpatterns = [
	url(r'^user/report$',views.ProgressReportView.as_view(),
								  name="progress_analyzer_report"),
]