from django.conf.urls import url
from apple import views

urlpatterns = [
    url(r'^users/datasteps$',views.UserAppleDataStepsView.as_view(), name="apple_data_steps"),
]