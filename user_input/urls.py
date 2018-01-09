from django.conf.urls import url
from .views import views
app_name = 'user_input'

urlpatterns = [
    url(r'^daily_input/$',views.UserDailyInputView.as_view(),
    	name='user_daily_input'),
    url(r'^daily_input/item/$',views.UserDailyInputItemView.as_view(),
    	name='user_daily_input_item'),
    url(r'^daily_input/item/recent/$', views.UserDailyInputLatestItemView.as_view()),
]