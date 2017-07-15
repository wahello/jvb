from django.conf.urls import url
from Summary import views

urlpatterns = [
    url(r'^summary/$', views.summary_list),
]
