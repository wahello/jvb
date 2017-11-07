from datetime import datetime, timedelta, timezone
from collections import OrderedDict
import ast
import json

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from . import calculation_helper


from garmin.models import UserGarminDataEpoch,\
		  UserGarminDataSleep,\
		  UserGarminDataBodyComposition,\
		  UserGarminDataDaily,\
		  UserGarminDataActivity,\
		  UserGarminDataManuallyUpdated,\
		  UserGarminDataStressDetails,\
          UserGarminDataMetrics,\
          UserGarminDataMoveIQ

from quicklook.serializers import UserQuickLookSerializer,\
						 GradesSerializer,\
						 StepsSerializer,\
						 SleepSerializer,\
						 ExerciseAndReporting,\
						 SwimStats,\
						 BikeStats,\
						 FoodSerializer,\
						 AlcoholSerializer

from quicklook.models import UserQuickLook,\
					Grades,\
					Sleep,\
					Steps,\
					ExerciseAndReporting,\
					SwimStats,\
					BikeStats,\
					Food,\
					Alcohol

from user_input.models import UserDailyInput,\
					DailyUserInputStrong,\
					DailyUserInputEncouraged,\
					DailyUserInputOptional,\
					InputsChangesFromThirdSources

class QuicklookCalculationView(APIView):

	def _safe_get(self,lst,attr,default_val):
		try:
			item = lst[0]
			val = item.__dict__.get(attr)
			if type(default_val) is int:
				if(val == ''):
					return default_val
				return int(val)
			return val
		except:
			return default_val 

	def _safe_get_dict(self,lst,attr,default_val):
		try:
			item = lst[0]
			val = item.get(attr)
			if type(default_val) is int:
				if(val == ''):
					return default_val
				return int(val)
			return val
		except:
			return default_val 


	def get(self, request, format=None):
		user = request.user

		# date for which quicklook is calculated
		dt = self.request.query_params.get('dt',None)
		y,m,d = map(int,dt.split('-'))
		start_date_dt = datetime(y,m,d,0,0,0)
		last_seven_days_date = start_date_dt - timedelta(days=6)
		start_dt = int(start_date_dt.replace(tzinfo=timezone.utc).timestamp())
		end_dt = start_dt + 86400

		epochs = [q.data for q in UserGarminDataEpoch.objects.filter(
			user = user,
			start_time_in_seconds__gte = start_dt,
			start_time_in_seconds__lte = end_dt
			)]

		sleeps = [q.data for q in UserGarminDataSleep.objects.filter(
			user = user,
			start_time_in_seconds__gte = start_dt,
			start_time_in_seconds__lte = end_dt)]

		dailies = [q.data for q in UserGarminDataDaily.objects.filter(
			user = user,
			start_time_in_seconds__gte = start_dt,
			start_time_in_seconds__lte = end_dt).order_by(
			'-start_time_duration_in_seconds'
			)]

		user_metrics = [q.data for q in UserGarminDataMetrics.objects.filter(
				user = user,
				calendar_date = start_date_dt.date()
			)]

		stress = [q.data for q in UserGarminDataStressDetails.objects.filter(
				user = user,
				start_time_in_seconds__gte = start_dt,
				start_time_in_seconds__lte = end_dt
			)]

		activities =[q.data for q in UserGarminDataActivity.objects.filter(
			user = user,
			start_time_in_seconds__gte = start_dt,
			start_time_in_seconds__lte = end_dt)]


		# pull data for past 7 days (incuding today)
		daily_strong = DailyUserInputStrong.objects.filter(
			user_input__user = user,
			user_input__created_at__gte = last_seven_days_date,
			user_input__created_at__lte = start_date_dt)

		daily_encouraged = DailyUserInputEncouraged.objects.filter(
			user_input__user = user,
			user_input__created_at = start_date_dt)

		daily_optional = DailyUserInputOptional.objects.filter(
			user_input__user = user,
			user_input__created_at = start_date_dt)

		dailies_json = [ast.literal_eval(dic) for dic in dailies]
		activities_json = [ast.literal_eval(dic) for dic in activities]
		epochs_json = [ast.literal_eval(dic) for dic in epochs]
		sleeps_json = [ast.literal_eval(dic) for dic in sleeps]
		user_metrics_json = [ast.literal_eval(dic) for dic in user_metrics]
		stress_json = [ast.literal_eval(dic) for dic in stress]

		def my_sum(d, key):
			if(d!=[]):
				return sum([i.get(key,0) for i in d ])
			else:
				return(0)

		def max_values(d,key):
			if(d!=[]):
				seq = [x[key] for x in d]
				return(max(seq))
			else:
				return(0)

		grades_calculated_data = {
			'overall_truth_grade':'',
			'overall_truth_health_gpa':0,
			'movement_non_exercise_steps_grade':'' ,
			'movement_consistency_grade': '' ,
			'avg_sleep_per_night_grade':'',
			'exercise_consistency_grade':'' ,
			'overall_workout_grade':'',
			'prcnt_unprocessed_food_consumed_grade':'',
			'alcoholic_drink_per_week_grade':'' ,
			'penalty':''
		}

		exercise_calculated_data = {
			'workout_easy_hard':self._safe_get(daily_strong, "work_out_easy_or_hard",''),
			'workout_type': '',
			'workout_time': '',
			'workout_location': '',
			'workout_duration': '',
			'maximum_elevation_workout': 0,
			'minutes_walked_before_workout': '',
			'distance': 0,
			'pace': '',
			'avg_heartrate':0,
			'elevation_gain':my_sum(activities_json,'totalElevationGainInMeters'),
			'elevation_loss':my_sum(activities_json,'totalElevationLossInMeters'),
			'effort_level':self._safe_get(daily_strong, "workout_effort_level", 0),

			'dew_point': 0,
			'temperature': 0,
			'humidity': 0,
			'temperature_feels_like': 0,
			'wind': 0,
			'hrr': '',
			'hrr_start_point': 0,
			'hrr_beats_lowered': 0,
			'sleep_resting_hr_last_night': self._safe_get_dict(dailies_json,'restingHeartRateInBeatsPerMinute',0),
			'vo2_max': self._safe_get_dict(user_metrics_json,"vo2Max",0),
			'running_cadence':my_sum(activities_json,'averageRunCadenceInStepsPerMinute'),
			'nose_breath_prcnt_workout': 0,
			'water_consumed_workout':self._safe_get(daily_encouraged,
									"water_consumed_during_workout",0),

			'chia_seeds_consumed_workout':self._safe_get(daily_optional,
										 "chia_seeds_consumed_during_workout",0),

			'fast_before_workout': self._safe_get(daily_optional,
								  "fasted_during_workout",''),

			'pain': self._safe_get(daily_encouraged,
					"pains_twings_during_or_after_your_workout",''),

			'pain_area': self._safe_get(daily_encouraged,"pain_area", ""),
			'stress_level':self._safe_get(daily_encouraged, "stress_level_yesterday", ""),
			'sick': self._safe_get(daily_optional, "sick", ""),
			'drug_consumed': '',
			'drug': '',
			'medication':self._safe_get(daily_strong,
							 "medications_or_controlled_substances_yesterday", ""),

			'smoke_substance':self._safe_get(daily_strong,
							 "smoke_any_substances_whatsoever", ""),

			'exercise_fifteen_more': '',
			'workout_elapsed_time': '',
			'timewatch_paused_workout': '',
			'exercise_consistency':0,
			'workout_duration_grade': '',
			'workout_effortlvl_grade': '',
			'avg_heartrate_grade': '',
			'overall_workout_grade': '',
			'heartrate_variability_grade': '',
			'workout_comment':self._safe_get(daily_optional, "general_Workout_Comments", "")
		}
		swim_calculated_data = {

			'pace_per_100_yard': 0,
			'total_strokes': 0,
		}

		bike_calculated_data = {
			'avg_speed': 0,
			'avg_power': 0,
			'avg_speed_per_mile': 0,
			'avg_cadence': 0,
		}

		steps_calculated_data = {
			 'non_exercise_steps': my_sum(epochs_json,'steps') ,
			 'exercise_steps': my_sum(activities_json,'steps'),
			 'total_steps': my_sum(dailies_json,'steps')+\
			 				my_sum(activities_json,'steps')+\
			 				my_sum(epochs_json,'steps'),

			 'floor_climed': my_sum(dailies_json,'floorsClimbed'),
			 'floor_decended':0,
			 'movement_consistency': '',
		}

		sleeps_calculated_data = {
			'sleep_per_wearable': '',
			'sleep_per_user_input':'',
			'sleep_aid': self._safe_get(daily_strong,
						 "prescription_or_non_prescription_sleep_aids_last_night", ""),
			'sleep_bed_time': '',
			'sleep_awake_time': '',
			'deep_sleep': my_sum(sleeps_json,'deepSleepDurationInSeconds'),
			'light_sleep': my_sum(sleeps_json,'lightSleepDurationInSeconds'),
			'awake_time': my_sum(sleeps_json,'awakeDurationInSeconds'),

		}

		food_calculated_data = {
			'prcnt_non_processed_food':0,
			'prcnt_non_processed_food_grade': '',
			'non_processed_food': self._safe_get(daily_strong,
								 "list_of_unprocessed_food_consumed_yesterday", ""),
			'diet_type':'',
		}

		alcohol_calculated_data = {
			'alcohol_day': self._safe_get(daily_strong,"number_of_alcohol_consumed_yesterday",""),
			'alcohol_week': 0
		}

		# Calculation of grades

		# Average sleep per night grade calculation
		for q in daily_strong:
			if q.user_input.created_at == start_date_dt.date():
				print("Calculating the stuffs")
				grade = calculation_helper.cal_average_sleep_grade(
									  q.sleep_time_excluding_awake_time,
									  q.prescription_or_non_prescription_sleep_aids_last_night)
				grades_calculated_data['avg_sleep_per_night_grade'] = grade

		# Unprocessed food grade calculation 
		for q in daily_strong:
			if q.user_input.created_at == start_date_dt.date():
				grade = calculation_helper.cal_unprocessed_food_grade(
										 q.prcnt_unprocessed_food_consumed_yesterday)

				grades_calculated_data['prcnt_unprocessed_food_consumed_grade'] = grade

		# Alcohol drink consumed grade
		alcohol_grade = calculation_helper.cal_alcohol_drink_grade(
			[q.number_of_alcohol_consumed_yesterday
			if not q.number_of_alcohol_consumed_yesterday in [None,''] else 0
			for q in daily_strong],
			user.profile.gender)

		grades_calculated_data['alcoholic_drink_per_week_grade'] = alcohol_grade

		# Movement consistency and movement consistency grade calculation
		movement_consistency_summary = calculation_helper.cal_movement_consistency_summary(epochs_json)
		if movement_consistency_summary:
			steps_calculated_data['movement_consistency'] = json.dumps(movement_consistency_summary)
			inactive_hours = movement_consistency_summary.get("inactive_hours")
			grade = calculation_helper.cal_movement_consistency_grade(inactive_hours)
			grades_calculated_data['movement_consistency_grade'] = grade


		user_ql = UserQuickLook.objects.create(user = user)
		Grades.objects.create(user_ql=user_ql, **grades_calculated_data)
		ExerciseAndReporting.objects.create(user_ql = user_ql,**exercise_calculated_data)
		SwimStats.objects.create(user_ql=user_ql, **swim_calculated_data)
		BikeStats.objects.create(user_ql = user_ql,**bike_calculated_data)
		Steps.objects.create(user_ql = user_ql,**steps_calculated_data)
		Sleep.objects.create(user_ql = user_ql,**sleeps_calculated_data)
		Food.objects.create(user_ql = user_ql,**food_calculated_data)
		Alcohol.objects.create(user_ql = user_ql,**alcohol_calculated_data)

		return Response({"message":"Successfuly created quicklook"},status = status.HTTP_201_CREATED)


class movementConsistencySummary(APIView):
	permission_classes = (IsAuthenticated,)

	def get(self, request, format="json"):
		y,m,d = map(int,request.GET.get('start_date').split('-'))
		start_date_dt = datetime(y,m,d,0,0,0)
		startDateTimeInSeconds = int(start_date_dt.replace(tzinfo=timezone.utc).timestamp())
		user = request.user

		epochs_json = [q.data for q in UserGarminDataEpoch.objects.filter(
                      user=user,
                      record_date_in_seconds__gte=startDateTimeInSeconds,
                      record_date_in_seconds__lte=startDateTimeInSeconds+86400)]

		epochs_json = [ast.literal_eval(dic) for dic in epochs_json]

		movement_consistency = OrderedDict()

		if epochs_json:
			epochs_json = sorted(epochs_json, key=lambda x: int(x.get('startTimeInSeconds')))
			for data in epochs_json:
				if data.get('activityType') == 'WALKING': 
					start_time = data.get('startTimeInSeconds')+ data.get('startTimeOffsetInSeconds')

					date_of_data = datetime.utcfromtimestamp(start_time).strftime("%Y-%m-%d")
					td = timedelta(hours=1)
					hour_start = datetime.utcfromtimestamp(start_time).strftime("%I %p")
					hour_end = (datetime.utcfromtimestamp(start_time)+td).strftime("%I %p")
					time_interval = hour_start+" to "+hour_end

					if not movement_consistency.get(date_of_data,None):
					  movement_consistency[date_of_data] = OrderedDict()

					if not movement_consistency[date_of_data].get(time_interval,None):
					  movement_consistency[date_of_data][time_interval] = {
						"steps":0,
						"status":"inactive"
					  }

					steps_in_interval = movement_consistency[date_of_data][time_interval].get('steps')
					is_active = True if data.get('steps') + steps_in_interval > 300 else False

					movement_consistency[date_of_data][time_interval]['steps']\
						= steps_in_interval + data.get('steps')

					movement_consistency[date_of_data][time_interval]['status']\
						= 'active' if is_active else 'inactive'

			for dt,data in list(movement_consistency.items()):
				active_hours = 0
				inactive_hours = 0
				for interval,values in list(data.items()):
					if values['status'] == 'active': 
						active_hours += 1 
					else:
						inactive_hours += 1
					movement_consistency[dt]['active_hours'] = active_hours
					movement_consistency[dt]['inactive_hours'] = inactive_hours

		return Response(movement_consistency, status=status.HTTP_200_OK)