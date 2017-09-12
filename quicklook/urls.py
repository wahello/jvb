from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^users/data$',views.UserQuickLookView.as_view(),
								  name="quick_look"),
]