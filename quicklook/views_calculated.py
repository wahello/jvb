from datetime import datetime, timedelta, timezone
from collections import OrderedDict
import ast

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from garmin.models import UserGarminDataEpoch,\
		  UserGarminDataSleep,\
		  UserGarminDataBodyComposition,\
		  UserGarminDataDaily,\
		  UserGarminDataActivity,\
		  UserGarminDataManuallyUpdated

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

	def get(self, request, format=None):
		user = request.user
		epochs = [q.data for q in UserGarminDataEpoch.objects.filter(user = request.user)]
		sleeps = [q.data for q in UserGarminDataSleep.objects.filter(user = request.user)]
		dailies = [q.data for q in UserGarminDataDaily.objects.filter(user = request.user)]
		activities =[q.data for q in UserGarminDataActivity.objects.filter(user = request.user)]
		daily_strong = DailyUserInputStrong.objects.filter(user_input__user = user)
		daily_encouraged = DailyUserInputEncouraged.objects.filter(user_input__user = user)
		daily_optional = DailyUserInputOptional.objects.filter(user_input__user = user)

		dailies_json = [ast.literal_eval(dic) for dic in dailies]
		activities_json = [ast.literal_eval(dic) for dic in activities]
		epochs_json = [ast.literal_eval(dic) for dic in epochs]
		sleeps_json = [ast.literal_eval(dic) for dic in sleeps]


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
			'movement_non_exercise_grade':'' ,
			'movement_consistency_grade': '' ,
			'avg_sleep_per_night_grade':'',
			'exercise_consistency_grade':'' ,
			'overall_workout_grade':'',
			'prcnt_non_processed_food_consumed_grade':'',
			'alcoholic_drink_per_week_grade':'' ,
			'penalty':''
		}



		exercise_calculated_data = {
			'workout_easy_hard':[q.work_out_easy_or_hard for q in daily_strong][0],
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
			'effort_level':[int(q.work_out_effort_level) for q in daily_strong][0],
			'dew_point': 0,
			'temperature': 0,
			'humidity': 0,
			'temperature_feels_like': 0,
			'wind': 0,
			'hrr': '',
			'hrr_start_point': 0,
			'hrr_beats_lowered': 0,
			'sleep_resting_hr_last_night': 0,
			'vo2_max': 0,
			'running_cadence':my_sum(activities_json,'averageRunCadenceInStepsPerMinute'),
			'nose_breath_prcnt_workout': 0,
			'water_consumed_workout':[int(q.water_consumed_during_workout) for q in daily_encouraged][0],
			#'water_consumed_workout':0,
			'chia_seeds_consumed_workout':[int(q.chia_seeds_consumed_during_workout) for q in daily_optional][0],
			#'chia_seeds_consumed_workout':0,
			'fast_before_workout': [q.fasted_during_workout for q in daily_optional][0],
			'pain': [q.pains_twings_during_or_after_your_workout for q in daily_encouraged][0],
			'pain_area': [q.pain_area for q in daily_encouraged][0],
			'stress_level':[q.stress_level_yesterday for q in daily_encouraged][0],
			'sick': [q.sick for q in daily_optional][0],
			'drug_consumed': '',
			'drug': '',
			'medication':[q.medications_or_controlled_substances_yesterday for q in daily_strong][0],
			'smoke_substance':[q.smoke_any_substances_whatsoever for q in daily_strong][0],
			'exercise_fifteen_more': '',
			'workout_elapsed_time': '',
			'timewatch_paused_workout': '',
			'exercise_consistency':0,
			'workout_duration_grade': '',
			'workout_effortlvl_grade': '',
			'avg_heartrate_grade': '',
			'overall_workout_grade': '',
			'heartrate_variability_grade': '',
			'workout_comment':[q.general_Workout_Comments for q in daily_optional][0]
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
			 'total_steps': my_sum(dailies_json,'steps')+my_sum(activities_json,'steps')+my_sum(epochs_json,'steps'),
			 'floor_climed': my_sum(dailies_json,'floorsClimbed'),
			 'floor_decended':0,
			 'movement_consistency': 0,
		}

		sleeps_calculated_data = {
			'sleep_per_wearable': '',
			'sleep_per_user_input':'',
			#'sleep_per_user_input': [q.sleep_time_excluding_awake_time for q in input_from_third_source][0],
			'sleep_aid': [q.sleep_aids_last_night for q in daily_strong][0],
			'sleep_bed_time': '',
			'sleep_awake_time': '',
			'deep_sleep': my_sum(sleeps_json,'deepSleepDurationInSeconds'),
			'light_sleep': my_sum(sleeps_json,'lightSleepDurationInSeconds'),
			'awake_time': my_sum(sleeps_json,'awakeDurationInSeconds'),

		}

		food_calculated_data = {
			'prcnt_non_processed_food':0,
			'prcnt_non_processed_food_grade': '',
			'non_processed_food': [int(q.unprocessed_food_consumed_yesterday) for q in daily_strong][0],
			#'non_processed_food':0,
			'diet_type':'',
		}

		alcohol_calculated_data = {
			'alcohol_day': [int(q.number_of_alcohol_consumed_yesterday) for q in daily_strong][0],
			#'alcohol_day':0,
			'alcohol_week': 0
		}

		#Calculation of grades

		#Average sleep per night grade claculation



		user_ql = UserQuickLook.objects.create(user = request.user)
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
                      record_date_in_seconds__gte=startDateTimeInSeconds-14400,
                      record_date_in_seconds__lte=startDateTimeInSeconds+86400-14400)]

		epochs_json = [ast.literal_eval(dic) for dic in epochs_json]

		movement_consistency = OrderedDict()

		if epochs_json:
			epochs_json = sorted(epochs_json, key=lambda x: int(x.get('startTimeInSeconds')))
			for data in epochs_json:
				if data.get('activityType') == 'WALKING': 
					start_time = data.get('startTimeInSeconds')-14400

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