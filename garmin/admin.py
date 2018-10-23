from django.contrib import admin

from .models import UserGarminDataEpoch,\
					UserGarminDataSleep,\
					UserGarminDataBodyComposition,\
					UserGarminDataDaily,\
					UserGarminDataActivity,\
					UserGarminDataManuallyUpdated,\
					UserGarminDataStressDetails,\
					UserGarminDataMetrics,\
					UserGarminDataMoveIQ, \
					GarminConnectToken, \
					GarminFitFiles,\
					GarminPingNotification,\
					UserLastSynced

class UserGarminDataEpochAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserGarminDataSleepAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserGarminDataBodyCompositionAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserGarminDataDailyAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserGarminDataActivityAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserGarminDataManuallyUpdatedAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserGarminDataStressDetailsAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserGarminDataMetricsAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','calendar_date','data',)

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class UserGarminDataMoveIQAdmin(admin.ModelAdmin):
	list_display = ('user','summary_id','record_date_in_seconds','start_time_in_seconds',
					'start_time_duration_in_seconds','data',)

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

@admin.register(GarminConnectToken)
class GarminConnectTokenAdmin(admin.ModelAdmin):
	list_display = ('user','token','token_secret',)
	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)
class GarminFitFilesAdmin(admin.ModelAdmin):
	list_display = ('user','created_at','fit_file_belong_date','meta_data_fitfile',)
	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

admin.site.register(UserGarminDataEpoch,UserGarminDataEpochAdmin)
admin.site.register(UserGarminDataSleep,UserGarminDataSleepAdmin)
admin.site.register(UserGarminDataBodyComposition,UserGarminDataBodyCompositionAdmin)
admin.site.register(UserGarminDataDaily,UserGarminDataDailyAdmin)
admin.site.register(UserGarminDataActivity,UserGarminDataActivityAdmin)
admin.site.register(UserGarminDataManuallyUpdated,UserGarminDataManuallyUpdatedAdmin)
admin.site.register(UserGarminDataStressDetails,UserGarminDataStressDetailsAdmin)
admin.site.register(UserGarminDataMetrics,UserGarminDataMetricsAdmin)
admin.site.register(UserGarminDataMoveIQ,UserGarminDataMoveIQAdmin)
admin.site.register(GarminFitFiles,GarminFitFilesAdmin)

@admin.register(GarminPingNotification)
class GarminPingNotificationAdmin(admin.ModelAdmin):
	list_display = ['user','created_at','updated_at','upload_start_time_seconds',
		'summary_type','state']
	ordering = ('-created_at',)
	search_fields = ('user__username','user__email','user__first_name',
		'user__last_name')

@admin.register(UserLastSynced)
class UserLastSyncedAdmin(admin.ModelAdmin):
	list_display = ['user','last_synced','offset']
	ordering = ('-last_synced',)
	search_fields = ('user__username','user__email','user__first_name',
		'user__last_name')