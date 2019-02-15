from django.conf.urls import url
from leaderboard import views

urlpatterns = [
	url(r'^$',views.LeaderBoardAPIView.as_view(), name="leaderboard"),
	url(r'^mcs_snapshot', views.MovementLeaderboardMCSAPIView.as_view(),name="movementlb_mcs_snapshot"),
	url(r'^snapshot$',views.LeaderboardSnapshotAPIView.as_view(),name="leaderboard_snapshot"),
]