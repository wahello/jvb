from django.contrib import admin
from user_input.models import DailyUserInputEncouraged,\
							  DailyUserInputStrong,\
							  DailyUserInputOptional,\
							  InputsChangesFromThirdSources,\
							  UserDailyInput,\
							  Goals

class DailyUserInputStrongInline(admin.TabularInline):
	model = DailyUserInputStrong

class DailyUserInputEncouragedInline(admin.TabularInline):
	model = DailyUserInputEncouraged

class DailyUserInputOptionalInline(admin.TabularInline):
	model = DailyUserInputOptional

class InputsChangesFromThirdSourcesInline(admin.TabularInline):
	model = InputsChangesFromThirdSources

class GoalsInline(admin.TabularInline):
	model = Goals

class UserInputAdmin(admin.ModelAdmin):
	list_display=('user','created_at', 'updated_at')
	inlines = [
		DailyUserInputStrongInline,
		DailyUserInputEncouragedInline,
		DailyUserInputOptionalInline,
		InputsChangesFromThirdSourcesInline,
		GoalsInline
	]

# Register your models here.

admin.site.register(UserDailyInput,UserInputAdmin)