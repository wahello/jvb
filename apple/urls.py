from django.conf.urls import url
from apple import views

urlpatterns = [
    url(r'^users/datasteps$',views.UserAppleDataStepsView.as_view(), 
    	name="apple_data_steps"),
    url(r'^users/dataactivities$',views.UserAppleDataActivitiesView.as_view(), 
    	name="apple_data_activities"),
    url(r'^users/appledata$',views.AplpleUserView.as_view(),name="apple_data"),
]