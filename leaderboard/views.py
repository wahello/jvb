import json

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from leaderboard.models import Score

class LeaderboardAPIView(APIView):
	'''
		Generate leaderboard for provided
	'''
	permission_classes = (IsAuthenticated,)

	CATEGORY = {
		"oh_gpa": "Overall Health GPA",
		"mne_gpa": "Movement Non Exercise GPA",
		"mc": "Movement Consistency",
		"avg_sleep": "Average Sleep",
		"ec": "Exercise Consistency",
		"prcnt_uf": "Percent Unprocessed Food",
		"alcohol_drink": "Alcohol Drink",
		"total_steps": "Total Steps",
		"floor_climbed": "Floor Climbed",
		"resting_hr": "Resting Heart Rate",
		"deep_sleep": "Deep Sleep",
		"awake_time": "Awake Time"
	}

	def _hours_to_hours_min(self,hours):
		mins = hours * 60
		hours,mins = divmod(mins,60)
		hours = round(hours)
		mins = round(mins)
		if mins < 10:
			mins = "{:02d}".format(mins) 
		return "{}:{}".format(hours,mins)

	def _serialize_score(self, score_obj):
		score = score_obj.score
		if score_obj.category == "deep_sleep" or score_obj.category == "awake_time":
			# convert hours to hh:mm string
			score = self._hours_to_hours_min(score)

		s = {
				"username":score_obj.user.username,
				"category":self.CATEGORY[score_obj.category],
				"score": score,
				"rank": score_obj.category_rank
			}
		return s

	def _serialize_leaderboard(self,qs,lb_date):
		data = {"created_at":lb_date,"leaderboard":{}}
		for q in qs:
			if not data["leaderboard"].get(q.category,None):
				data["leaderboard"][q.category] = []
			data["leaderboard"][q.category].append(self._serialize_score(q))
		return data

	def get(self, request, format='json'):
		lb_date = request.query_params.get("date",None)
		lb_category = request.query_params.get('category',None)

		response = {
			"status":"success",
			"data":{}
		}

		if lb_date:
			if lb_category:
				response["data"] = self._serialize_leaderboard(Score.leaderboard.generate(lb_date, lb_category),lb_date)
			else:
				response["data"] = self._serialize_leaderboard(Score.leaderboard.generate(lb_date),lb_date)
			return Response(response, status = status.HTTP_200_OK)
		else:
			del response["data"]
			response["status"] = "error"
			response["error"] = {
				"code":400,
				"message":"Missing paramater:'date'"
			}
			return Response(response, status = status.HTTP_400_BAD_REQUEST)