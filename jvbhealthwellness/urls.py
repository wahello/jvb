from django.contrib.auth import views as auth_views
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from users import views as userViews
from user_input import urls as userInputUrls
from garmin import urls as garminUrls
from common import urls as commonUrls
from garmin import views as garmin_views
from quicklook import urls as quicklookUrls
from progress_analyzer import urls as progressUrls
from leaderboard import urls as leaderboardUrls
from fitbit import views as fitbitViews
from hrr import urls as hrrUrls
from fitbit import urls as fitbitUrls
from dashboards import urls as dashboardUrls
from common import urls as commonUrls
from apple import urls as appleUrls

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^su/', include('django_su.urls')),
    url(r'^password_reset/$', auth_views.PasswordResetView.as_view(),
                              name='password_reset'),

    url(r'^password_reset/done/$', auth_views. PasswordResetDoneView.as_view(),
                                   name='password_reset_done'),

    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    url(r'^reset/done/$', auth_views.PasswordResetCompleteView.as_view(), 
                          name='password_reset_complete'),

    url(r'^djangojs/', include('djangojs.urls')),

    url(r'^callbacks/garmin$', userViews.receive_token, name='receive_token'),
    url(r'^callbacks/garminconnect$',garmin_views.connect_receive_token, name='connect_receive_token'),

    url(r'^callbacks/garmin/push$',garmin_views.GarminPing.as_view(), name="garmin_ping"),
    url(r'^callbacks/fitbit/push$',fitbitViews.FitbitPush.as_view(), name="fitbit_push"),
    url(r'^callbacks/garminconnectpush$', garmin_views.GarminConnectPing.as_view(), name="garmin_connect_ping"),
    url(r'^callbacks/fitbit$', fitbitViews.receive_token_fitbit, name='receive_token_fitbit'),

    url(r'^users/request_token$',userViews.request_token,name='request_token'),
    url(r'^users/connect_request_token$', garmin_views.connect_request_token, name='connect_request_token'),

    url(r'^users/garmin/token/$',userViews.GetGarminToken.as_view(), name='garmin_token'),
    url(r'^users/garmin/fetch$',userViews.fetchGarminData.as_view(),name='garmin_data'),

    url(r'^fitbit/request_token_fitbit$',fitbitViews.request_token_fitbit,name='request_token_fitbit'),
    url(r'^fitbit/fetching_data_fitbit$',fitbitViews.fetching_data_fitbit,name='fetching_data_fitbit'),
    
    url(r'^garmin/',include(garminUrls)),
    url(r'^common/',include(commonUrls)),
    url(r'^quicklook/',include(quicklookUrls)),
    url(r'^progress/',include(progressUrls)),
    url(r'^leaderboard/', include(leaderboardUrls)),
    url(r'^hrr/', include(hrrUrls)),
    url(r'^dashboard/', include(dashboardUrls)),
    url(r'^users/',include(userInputUrls)),
    url(r'^fitbit/',include(fitbitUrls)),
    url(r'^common/',include(commonUrls)),
    url(r'^apple/',include(appleUrls)),
    url(r'^$', TemplateView.as_view(template_name='exampleapp/reg.html'), name='home'),
    url(r'^register$', TemplateView.as_view(template_name='exampleapp/reg.html'), name='home'),
    url(r'^service_connect$', TemplateView.as_view(template_name='exampleapp/reg.html'), name='home'),
    url(r'^',include('registration.urls')),
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
    url(r'^(.*)$', TemplateView.as_view(template_name='exampleapp/reg.html'), name='home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    #urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_URL)

