from django.contrib import admin

from .models import UserGarminDataEpoch,\
					UserGarminDataSleep,\
					UserGarminDataBodyComposition,\
					UserGarminDataDaily,\
					UserGarminDataActivity,\
					UserGarminDataManuallyUpdated,\
					UserGarminDataStressDetails,\
					UserGarminDataMetrics,\
					UserGarminDataMoveIQ

class UserGarminDataEpochAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

class UserGarminDataSleepAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

class UserGarminDataBodyCompositionAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

class UserGarminDataDailyAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

class UserGarminDataActivityAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

class UserGarminDataManuallyUpdatedAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

class UserGarminDataStressDetailsAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

class UserGarminDataMetricsAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','calendar_date','data',)

class UserGarminDataMoveIQAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

admin.site.register(UserGarminDataEpoch,UserGarminDataEpochAdmin)
admin.site.register(UserGarminDataSleep,UserGarminDataSleepAdmin)
admin.site.register(UserGarminDataBodyComposition,UserGarminDataBodyCompositionAdmin)
admin.site.register(UserGarminDataDaily,UserGarminDataDailyAdmin)
admin.site.register(UserGarminDataActivity,UserGarminDataActivityAdmin)
admin.site.register(UserGarminDataManuallyUpdated,UserGarminDataManuallyUpdatedAdmin)
admin.site.register(UserGarminDataStressDetails,UserGarminDataStressDetailsAdmin)
admin.site.register(UserGarminDataMetrics,UserGarminDataMetricsAdmin)
admin.site.register(UserGarminDataMoveIQ,UserGarminDataMoveIQAdmin)