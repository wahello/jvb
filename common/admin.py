from django.contrib import admin
from .models import UserDataBackfillRequest

class AdminUserRequest(admin.ModelAdmin):
	list_display = ('user','device_type','requested_at','start_date','end_date','status')

admin.site.register(UserDataBackfillRequest,AdminUserRequest)