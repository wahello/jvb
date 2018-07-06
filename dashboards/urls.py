from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'movement$',views.MovementDashboardView.as_view(), name="movement"),
]
