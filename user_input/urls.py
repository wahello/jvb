from django.conf.urls import url
from . import views
app_name = 'user_input'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^user/$',views.user,name='user'),
]
