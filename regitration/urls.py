from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from .views import CreateView
from . import views
app_name = 'regitration'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^register/',views.register,name='register'),
     url(r'^register_input/$', CreateView.as_view(), name="create"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
