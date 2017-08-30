from django.contrib import admin
from user_input.models import DailyUserInputEncouraged,\
							  DailyUserInputStrong,\
							  DailyUserInputOptional,\
							  InputsChangesFromThirdSources,\
							  UserDailyInput,\
							  Goals

class DailyUserInputStrongAdmin(admin.ModelAdmin):
	pass
class DailyUserInputEncouragedAdmin(admin.ModelAdmin):
	pass
class DailyUserInputOptionalAdmin(admin.ModelAdmin):
	pass
class InputsChangesFromThirdSourcesAdmin(admin.ModelAdmin):
	pass
class UserInputAdmin(admin.ModelAdmin):
	pass
class GoalsAdmin(admin.ModelAdmin):
	pass

# Register your models here.
admin.site.register(DailyUserInputStrong,DailyUserInputStrongAdmin)
admin.site.register(DailyUserInputEncouraged,DailyUserInputEncouragedAdmin)
admin.site.register(DailyUserInputOptional,DailyUserInputOptionalAdmin)
admin.site.register(InputsChangesFromThirdSources,
					InputsChangesFromThirdSourcesAdmin)
admin.site.register(UserDailyInput,UserInputAdmin)
admin.site.register(Goals,GoalsAdmin)