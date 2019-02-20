from django.contrib import admin
from apple.models import (UserAppleDataSteps,
						   ApplePingNotification)
# Register your models here.

class UserAppleDataStepsAdmin(admin.ModelAdmin):
	list_display = ['user','created_at','belong_to']
	search_fields = ('user__username',)

class ApplePingNotificationAdmin(admin.ModelAdmin):
	list_display = ['user','created_at','updated_at','upload_start_time_seconds',
		'summary_type','state']
	ordering = ('-created_at',)
	search_fields = ('user__username','user__email','user__first_name',
		'user__last_name')

admin.site.register(UserAppleDataSteps,UserAppleDataStepsAdmin)
admin.site.register(ApplePingNotification,ApplePingNotificationAdmin)