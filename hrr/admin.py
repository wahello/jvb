from django.contrib import admin
from .models import Hrr
# Register your models here.

class HrrAdmin(admin.ModelAdmin):
	list_display = ('user_hrr','created_at','updated_at')

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

admin.site.register(Hrr,HrrAdmin)