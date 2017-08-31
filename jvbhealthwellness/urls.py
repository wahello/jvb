
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from users import views as userViews
from user_input import urls as userInputUrls

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^djangojs/', include('djangojs.urls')),
    url(r'^callbacks/garmin$', userViews.receive_token, name='receive_token'),
    url(r'^users/request_token$',userViews.request_token,name='request_token'),
    # url(r'^users/garmin_token/$',userViews.GetGarminToken.as_view(), name='garmin_token'),
    url(r'users/garmin/fetch/$',userViews.fetchGarminData.as_view(),name='garmin_data'),
    url(r'^users/',include(userInputUrls)),
    url(r'^$', TemplateView.as_view(template_name='exampleapp/reg.html'), name='home'),
    url(r'^register$', TemplateView.as_view(template_name='exampleapp/reg.html'), name='home'),
    url(r'^service_connect$', TemplateView.as_view(template_name='exampleapp/reg.html'), name='home'),
    url(r'^',include('registration.urls')),
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
]
