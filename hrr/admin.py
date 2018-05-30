from django.contrib import admin
from .models import Hrr
# Register your models here.

class HrrAdmin(admin.ModelAdmin):
	list_display = ('user_hrr','created_at','updated_at')

	search_fields = ('user_hrr__username','user_hrr__email','user_hrr__first_name',
					 'user_hrr__last_name',)

admin.site.register(Hrr,HrrAdmin)