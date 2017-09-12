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

class GradesInline(admin.TabularInline):
	model = Grades

class ExerciseAndReportingInline(admin.TabularInline):
	model = ExerciseAndReporting

class SwimStatsInline(admin.TabularInline):
	model = SwimStats

class BikeStatsInline(admin.TabularInline):
	model = BikeStats

class StepsInline(admin.TabularInline):
	model = Steps

class SleepInline(admin.TabularInline):
	model = Sleep

class FoodInline(admin.TabularInline):
	model = Food 

class AlcoholInline(admin.TabularInline):
	model = Alcohol

class UserQuickLookAdmin(admin.ModelAdmin):
	list_display=('user','created_at', 'updated_at')
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