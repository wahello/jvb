from datetime import datetime,timedelta
import json

from rest_framework.views import APIView
from rest_framework import status,generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from leaderboard.models import Score
from leaderboard.helpers.leaderboard_helper_classes import LeaderboardOverview

from quicklook.models import Steps

# Pagination not working on RawQuerySet
# from leaderboard.pagination import LeaderboardPageNumberPagination,CustomPaginationMixin

def hours_to_hours_min(hours):
	mins = hours * 60
	hours,mins = divmod(mins,60)
	hours = round(hours)
	mins = round(mins)
	if mins < 10:
		mins = "{:02d}".format(mins) 
	return "{}:{}".format(hours,mins)

class LeaderboardSnapshotAPIView(APIView):
	'''
		Generate leaderboard for provided date and category
		Works for only single date
	'''
	permission_classes = (IsAuthenticated,)
	# pagination_class = LeaderboardPageNumberPagination

	def serialize_score(self,score_obj):
		CATEGORY = {
			"oh_gpa": "Overall Health GPA","mne_gpa": "Movement Non Exercise GPA",
			"mc": "Movement Consistency","avg_sleep": "Average Sleep",
			"ec": "Exercise Consistency","prcnt_uf": "Percent Unprocessed Food",
			"alcohol_drink": "Alcohol Drink","total_steps": "Total Steps",
			"floor_climbed": "Floor Climbed","resting_hr": "Resting Heart Rate",
			"deep_sleep": "Deep Sleep","awake_time": "Awake Time"
		}
		score = score_obj.score
		if score_obj.category == "deep_sleep" or score_obj.category == "awake_time":
			# convert hours to hh:mm string
			score = hours_to_hours_min(score)

		s = {
				"username":score_obj.user.username,
				"category":CATEGORY[score_obj.category],
				"score": score,
				"rank": score_obj.category_rank
			}
		return s

	def serialize_leaderboard(self,qs,lb_date):
		data = {"created_at":lb_date,"leaderboard":{}}
		for q in qs:
			if not data["leaderboard"].get(q.category,None):
				data["leaderboard"][q.category] = []
			data["leaderboard"][q.category].append(self.serialize_score(q))
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
				# page = self.paginate_queryset(Score.leaderboard.generate(lb_date, lb_category))
				# if page is not None:
				# 	response["data"] = serialize_leaderboard(page,lb_date)
				response["data"] = self.serialize_leaderboard(Score.leaderboard.generate(lb_date, lb_category),lb_date)
			else:
				# page = self.paginate_queryset(Score.leaderboard.generate(lb_date))
				# if page is not None:
				# 	response["data"] = serialize_leaderboard(page,lb_date)
				response["data"] = self.serialize_leaderboard(Score.leaderboard.generate(lb_date),lb_date)
			return Response(response, status = status.HTTP_200_OK)
		else:
			del response["data"]
			response["status"] = "error"
			response["error"] = {
				"code":400,
				"message":"Missing paramater:'date'"
			}
			return Response(response, status = status.HTTP_400_BAD_REQUEST)

class LeaderBoardAPIView(APIView):
	permission_classes = (IsAuthenticated, )

	def get(self, request, format="Json"):
		# query_params = {
		# 	"date":"2018-02-19",
		# 	"custom_ranges":"2018-02-12,2018-02-16,2018-02-13,2018-02-18",
		# 	"duration":"today,yesterday,year"
		# }
		r = LeaderboardOverview(request.user,request.query_params).get_leaderboard()
		return Response(r, status=status.HTTP_200_OK)


class MovementLeaderboardMCSAPIView(generics.ListAPIView):
	'''
	Provide the hourly mcs status of all users for the requested date
	and day before requested date
	'''
	permissions_classes = (IsAuthenticated, )

	def get_queryset(self):
		y,m,d = map(int,self.request.query_params.get('start_date').split('-'))
		start_date = datetime(y,m,d,0,0,0)
		day_before_start_date = start_date - timedelta(days=1)
		qs = Steps.objects.filter(
			user_ql__created_at__range = (
				day_before_start_date.date(),start_date.date()))
		return qs

	def get(self, request, format="json"):
		y,m,d = map(int,self.request.query_params.get('start_date').split('-'))
		start_date = datetime(y,m,d,0,0,0)
		day_before_start_date = start_date - timedelta(days=1)
		qs = self.get_queryset()
		mcs_date_wise = {
			start_date.strftime("%Y-%m-%d"):{},
			day_before_start_date.strftime("%Y-%m-%d"):{}
		}

		for steps_data in qs:
			mcs = steps_data.movement_consistency
			if mcs:
				mcs = json.loads(mcs) 
				user_id = steps_data.user_ql.user.id
				dt = steps_data.user_ql.created_at.strftime("%Y-%m-%d")
				mcs = self.get_mcs_hourly_status(mcs)
				mcs_date_wise[dt][user_id] = mcs # Key is user id			

		return Response(mcs_date_wise,status=status.HTTP_200_OK)

	def get_mcs_hourly_status(self,mcs):
		'''
		Return mcs data with hourly status only
		'''
		processed_mcs = {}
		NON_INTERVAL_KEYS = ['total_active_minutes','total_active_prcnt',
			'active_hours','inactive_hours','sleeping_hours','strength_hours',
			'exercise_hours','nap_hours','no_data_hours','timezone_change_hours',
			'total_steps']
		for key,value in mcs.items():
			if key not in NON_INTERVAL_KEYS:
				processed_mcs[key] = value['status']
		return processed_mcs