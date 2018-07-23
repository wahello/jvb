from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'movement$',views.MovementDashboardView.as_view(), name="movement"),
    url(r'grades$',views.GradesDashboardView.as_view(), name="grades"),                      
]
