from django.conf.urls import url
from leaderboard import views

urlpatterns = [
	url(r'^$',views.LeaderBoardAPIView.as_view(), name="leaderboard"),
	url(r'^snapshot$',views.LeaderboardSnapshotAPIView.as_view(),name="leaderboard_snapshot"),
]