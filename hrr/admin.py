from django.contrib import admin
from .models import Hrr,\
					AaCalculations,\
					TimeHeartZones,\
					AaWorkoutCalculations,\
					AA
# Register your models here.

class HrrAdmin(admin.ModelAdmin):
	list_display = ('user_hrr','created_at','updated_at')

	search_fields = ('user_hrr__username','user_hrr__email','user_hrr__first_name',
					 'user_hrr__last_name',)

class AaCalculationsAdmin(admin.ModelAdmin):
	list_display = ('user_aa','created_at','updated_at')

	search_fields = ('user_aa__username','user_aa__email','user_aa__first_name',
					 'user_aa__last_name',)

class TimeHeartZonesAdmin(admin.ModelAdmin):
	list_display = ('user','created_at','updated_at')

	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)

class AaWorkoutCalculationsAdmin(admin.ModelAdmin):
	list_display = ('user_aa_workout','created_at','updated_at')

	search_fields = ('user_aa_workout__username','user_aa_workout__email',
		'user_aa_workout__first_name','user_aa_workout__last_name',)

class AAAdmin(admin.ModelAdmin):
	list_display = ('user','created_at','updated_at')

	search_fields = ('user__username','user__email',
		'user__first_name','user__last_name',)



admin.site.register(Hrr,HrrAdmin)
admin.site.register(AaCalculations,AaCalculationsAdmin)
admin.site.register(TimeHeartZones,TimeHeartZonesAdmin)
admin.site.register(AaWorkoutCalculations,AaWorkoutCalculationsAdmin)
admin.site.register(AA,AAAdmin)