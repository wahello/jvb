from django.conf.urls import url
from . import views
app_name = 'weather'

urlpatterns = [
    url(r'^activity_weather_report/$',views.ActivityWeatherView.as_view()),
]