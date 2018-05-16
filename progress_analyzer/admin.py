from django.contrib import admin
from progress_analyzer.models import CumulativeSum,\
	OverallHealthGradeCumulative,\
	NonExerciseStepsCumulative,\
	SleepPerNightCumulative,\
	MovementConsistencyCumulative,\
	ExerciseConsistencyCumulative,\
	NutritionCumulative,\
	ExerciseStatsCumulative,\
	AlcoholCumulative,\
	OtherStatsCumulative,\
	SickCumulative,\
	StandingCumulative,\
	TravelCumulative,\
	StressCumulative,\
	MetaCumulative,\
	ProgressReportUpdateMeta
	
class OverallHealthGradeCumulativeInline(admin.StackedInline):
	model = OverallHealthGradeCumulative

class NonExerciseStepsCumulativeInline(admin.StackedInline):
	model = NonExerciseStepsCumulative

class SleepPerNightCumulativeInline(admin.StackedInline):
	model = SleepPerNightCumulative

class MovementConsistencyCumulativeInline(admin.StackedInline):
	model = MovementConsistencyCumulative

class ExerciseConsistencyCumulativeInline(admin.StackedInline):
	model = ExerciseConsistencyCumulative

class NutritionCumulativeInline(admin.StackedInline):
	model = NutritionCumulative

class ExerciseStatsCumulativeInline(admin.StackedInline):
	model = ExerciseStatsCumulative 

class AlcoholCumulativeInline(admin.StackedInline):
	model = AlcoholCumulative

class OtherStatsCumulativeInline(admin.StackedInline):
	model = OtherStatsCumulative

class SickCumulativeInline(admin.StackedInline):
	model = SickCumulative

class StandingCumulativeInline(admin.StackedInline):
	model = StandingCumulative

class TravelCumulativeInline(admin.StackedInline):
	model = TravelCumulative

class StressCumulativeInline(admin.StackedInline):
	model = StressCumulative

class MetaCumulativeInline(admin.StackedInline):
	model = MetaCumulative


@admin.register(CumulativeSum)
class CumulativeSumManager(admin.ModelAdmin):
	list_display=('user','created_at', 'updated_at')
	ordering = ('-created_at',)
	list_filter = ('created_at','updated_at',)
	save_on_top = True
	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name',)
	inlines = [
		OverallHealthGradeCumulativeInline,
		NonExerciseStepsCumulativeInline,
		SleepPerNightCumulativeInline,
		MovementConsistencyCumulativeInline,
		ExerciseConsistencyCumulativeInline,
		NutritionCumulativeInline,
		ExerciseStatsCumulativeInline,
		AlcoholCumulativeInline,
		SickCumulativeInline,
		StandingCumulativeInline,
		TravelCumulativeInline,
		StressCumulativeInline,
		OtherStatsCumulativeInline,
		MetaCumulativeInline
	]

@admin.register(ProgressReportUpdateMeta)
class ProgressReportUpdateMetaAdmin(admin.ModelAdmin):
	list_display = ['user','requires_update_from']
	ordering = ('-requires_update_from',)
	search_fields = ('user__username','user__email','user__first_name',
		'user__last_name')