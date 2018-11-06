from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'movement$',views.MovementDashboardView.as_view(), name="movement"),
    url(r'hrr$',views.HrrSummaryDashboardview.as_view(), name="hrr"),
    url(r'grades$',views.GradesDashboardView.as_view(), name="grades"),
    url(r'activetime$',views.ActiveTimeDashboardView.as_view(), name="activetime")                      
]
