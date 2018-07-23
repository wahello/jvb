from django.contrib import admin

# Register your models here.
from .models import FitbitConnectToken,\
                    UserFitbitDataSleep,\
                    UserFitbitDataHeartRate,\
                    UserFitbitDataActivities,\
                    UserFitbitDataSteps,\
                    FitbitNotifications
# Register your models here.

class FitbitConnectTokenAdmin(admin.ModelAdmin):
	list_display = ('user', 'updated_at')


class UserFitbitSleepAdmin(admin.ModelAdmin):
	list_display = ('user','date_of_sleep','created_at')

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserFitbitHeartratepAdmin(admin.ModelAdmin):
	list_display = ('user','date_of_heartrate','created_at')

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserFitbitActivitiesAdmin(admin.ModelAdmin):
	list_display = ('user','date_of_activities','created_at')

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserFitbitDataStepsAdmin(admin.ModelAdmin):
	list_display = ('user','date_of_steps','created_at')

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class FitbitNotificationsAdmin(admin.ModelAdmin):
	list_display = ('user','created_at', 'collection_type','notification_date','state',)

admin.site.register(FitbitConnectToken,FitbitConnectTokenAdmin)
admin.site.register(FitbitNotifications,FitbitNotificationsAdmin)
admin.site.register(UserFitbitDataSleep,UserFitbitSleepAdmin)
admin.site.register(UserFitbitDataHeartRate,UserFitbitHeartratepAdmin)
admin.site.register(UserFitbitDataActivities,UserFitbitActivitiesAdmin)
admin.site.register(UserFitbitDataSteps,UserFitbitDataStepsAdmin)