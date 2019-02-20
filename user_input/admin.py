import ast

from django.contrib import admin
from user_input.models import DailyUserInputEncouraged,\
							  DailyUserInputStrong,\
							  DailyUserInputOptional,\
							  InputsChangesFromThirdSources,\
							  UserDailyInput,\
							  Goals,\
							  DailyActivity

class DailyUserInputStrongInline(admin.StackedInline):
	model = DailyUserInputStrong

class DailyUserInputEncouragedInline(admin.StackedInline):
	model = DailyUserInputEncouraged

class DailyUserInputOptionalInline(admin.StackedInline):
	model = DailyUserInputOptional

class InputsChangesFromThirdSourcesInline(admin.StackedInline):
	model = InputsChangesFromThirdSources

class GoalsInline(admin.StackedInline):
	model = Goals

class UserInputAdmin(admin.ModelAdmin):
	list_display=('user','report_type','created_at', 'updated_at')
	list_filter = ('created_at','updated_at',)
	save_on_top = True
	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)
	inlines = [
		DailyUserInputStrongInline,
		DailyUserInputEncouragedInline,
		DailyUserInputOptionalInline,
		InputsChangesFromThirdSourcesInline,
		GoalsInline
	]

class DailyActivityAdmin(admin.ModelAdmin):
	list_display = ('user','activity_name','created_at','duplicate','deleted')
	list_filter = ('created_at',)
	save_on_top = True
	search_fields = ('user__username', 'created_at',)
	def activity_name(self,obj):
		activity_data = ast.literal_eval(obj.activity_data)
		activity_name = activity_data.get('activityType','-')
		return activity_name.lower()

admin.site.register(UserDailyInput,UserInputAdmin)
admin.site.register(DailyActivity, DailyActivityAdmin)
