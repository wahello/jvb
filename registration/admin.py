from django.contrib import admin
from .models import Profile,TermsConditions,TermsConditionsText

admin.site.register(Profile)

class TermsConditionsTextAdmin (admin.ModelAdmin):
	list_display = ('version','created_at','updated_at')
admin.site.register(TermsConditionsText,TermsConditionsTextAdmin)

class TermsConditionsAdmin(admin.ModelAdmin):
	list_display = ('user','terms_conditions_version', 'accepted_at')
	list_filter = ('terms_conditions_version',)
admin.site.register(TermsConditions,TermsConditionsAdmin)