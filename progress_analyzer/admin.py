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
	PenaltyCumulative

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

class PenaltyCumulativeInline(admin.StackedInline):
	model = PenaltyCumulative

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
		PenaltyCumulativeInline

	]