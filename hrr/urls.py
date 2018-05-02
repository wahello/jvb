from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^hrr_calculations$',views.hrr_calculations,
								  name="hrr"),
	]