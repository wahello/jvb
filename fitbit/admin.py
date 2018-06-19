from django.contrib import admin

# Register your models here.
from .models import FitbitConnectToken,\
                    UserFitbitDataSleep,\
                    UserFitbitDataHeartRate,\
                    UserFitbitDataActivities,\
                    UserFitbitDataSteps
# Register your models here.
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

admin.site.register(FitbitConnectToken)
admin.site.register(UserFitbitDataSleep,UserFitbitSleepAdmin)
admin.site.register(UserFitbitDataHeartRate,UserFitbitHeartratepAdmin)
admin.site.register(UserFitbitDataActivities,UserFitbitActivitiesAdmin)
admin.site.register(UserFitbitDataSteps,UserFitbitDataStepsAdmin)