from django.contrib import admin

# Register your models here.
from .models import FitbitConnectToken,\
                    UserFitbitDataSleep,\
                    UserFitbitDataHeartRate,\
                    UserFitbitDataActivities
# Register your models here.
# class UserFitbitTokenAdmin(admin.ModelAdmin):
# 	list_display = ('user')

# 	search_fields = ('user__username','user__email','user__first_name',
# 					 'user__last_name',)

admin.site.register(FitbitConnectToken)
admin.site.register(UserFitbitDataSleep)
admin.site.register(UserFitbitDataHeartRate)
admin.site.register(UserFitbitDataActivities)