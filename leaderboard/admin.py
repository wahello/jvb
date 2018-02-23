from django.contrib import admin
from leaderboard.models import Score

@admin.register(Score)
class LeaderBoardAdmin(admin.ModelAdmin):
	list_display=('user',"category","score",'created_at','updated_at')
	ordering = ('-created_at',)
	list_filter = ('category','created_at','updated_at',)
	save_on_top = True
	search_fields = ('user__username','user__email','user__first_name',
					 'user__last_name')