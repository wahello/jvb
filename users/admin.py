from django.contrib import admin
from .models import GarminToken

class GarminTokenAdmin(admin.ModelAdmin):
	pass

admin.site.register(GarminToken, GarminTokenAdmin)
