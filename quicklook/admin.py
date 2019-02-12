from django.contrib import admin

from .models import ExerciseAndReporting,\
					SwimStats,\
					BikeStats,\
					Steps,\
					Sleep,\
					Food,\
					Alcohol,\
					Grades,\
					UserQuickLook

class GradesInline(admin.StackedInline):
	model = Grades

class ExerciseAndReportingInline(admin.StackedInline):
	model = ExerciseAndReporting

class SwimStatsInline(admin.StackedInline):
	model = SwimStats

class BikeStatsInline(admin.StackedInline):
	model = BikeStats

class StepsInline(admin.StackedInline):
	model = Steps

class SleepInline(admin.StackedInline):
	model = Sleep

class FoodInline(admin.StackedInline):
	model = Food 

class AlcoholInline(admin.StackedInline):
	model = Alcohol


class UserQuickLookAdmin(admin.ModelAdmin):
	list_display=('user','created_at', 'updated_at')
	ordering = ('-created_at',)
	list_filter = ('created_at','updated_at',)
	save_on_top = True
	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)
	inlines = [
		GradesInline,
		ExerciseAndReportingInline,
		SwimStatsInline,
		BikeStatsInline,
		StepsInline,
		SleepInline,
		FoodInline,
		AlcoholInline,
	]

admin.site.register(UserQuickLook,UserQuickLookAdmin)
