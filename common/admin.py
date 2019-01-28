from django.contrib import admin
from .models import UserDataBackfillRequest

class AdminUserRequest(admin.ModelAdmin):
	list_display = ('device_type','requested_at','status')

admin.site.register(UserDataBackfillRequest,AdminUserRequest)