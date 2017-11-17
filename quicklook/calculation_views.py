from datetime import datetime, timedelta, timezone
from collections import OrderedDict
import ast
import json

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from . import calculation_helper as hlpr


from garmin.models import UserGarminDataEpoch,\
		  UserGarminDataSleep,\
		  UserGarminDataBodyComposition,\
		  UserGarminDataDaily,\
		  UserGarminDataActivity,\
		  UserGarminDataManuallyUpdated,\
		  UserGarminDataStressDetails,\
          UserGarminDataMetrics,\
          UserGarminDataMoveIQ

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

	def post(self, request, format=None):

		user = request.user

		# date range for which quicklook is calculated

		from_dt = hlpr.str_to_datetime(self.request.data.get('from_date',None))
		to_dt = hlpr.str_to_datetime(self.request.data.get('to_date',None))

		current_date = from_dt
		while current_date <= to_dt:
			last_seven_days_date = current_date - timedelta(days=6)
			start_epoch = int(current_date.replace(tzinfo=timezone.utc).timestamp())
			end_epoch = start_epoch + 86400

			weather_data = hlpr.extract_weather_data(
			hlpr.fetch_weather_data(40.730610,-73.935242,start_epoch))

			epochs = [q.data for q in UserGarminDataEpoch.objects.filter(
				user = user,
				start_time_in_seconds__gte = start_epoch,
				start_time_in_seconds__lte = end_epoch
				)]

			sleeps = [q.data for q in UserGarminDataSleep.objects.filter(
				user = user,
				start_time_in_seconds__gte = start_epoch,
				start_time_in_seconds__lte = end_epoch)]

			dailies = [q.data for q in UserGarminDataDaily.objects.filter(
				user = user,
				start_time_in_seconds__gte = start_epoch,
				start_time_in_seconds__lte = end_epoch).order_by(
				'-start_time_duration_in_seconds'
				)]

			user_metrics = [q.data for q in UserGarminDataMetrics.objects.filter(
					user = user,
					calendar_date = current_date.date()
				)]

			stress = [q.data for q in UserGarminDataStressDetails.objects.filter(
					user = user,
					start_time_in_seconds__gte = start_epoch,
					start_time_in_seconds__lte = end_epoch
				)]

			activities =[q.data for q in UserGarminDataActivity.objects.filter(
				user = user,
				start_time_in_seconds__gte = start_epoch,
				start_time_in_seconds__lte = end_epoch)]


			# pull data for past 7 days (incuding today)
			daily_strong = DailyUserInputStrong.objects.filter(
				user_input__user = user,
				user_input__created_at__gte = last_seven_days_date,
				user_input__created_at__lte = current_date)

			todays_daily_strong = list(filter(
					lambda x: x.user_input.created_at == current_date.date(),
					daily_strong))

			daily_encouraged = DailyUserInputEncouraged.objects.filter(
				user_input__user = user,
				user_input__created_at = current_date)

			daily_optional = DailyUserInputOptional.objects.filter(
				user_input__user = user,
				user_input__created_at = current_date)

			dailies_json = [ast.literal_eval(dic) for dic in dailies]
			activities_json = [ast.literal_eval(dic) for dic in activities]
			epochs_json = [ast.literal_eval(dic) for dic in epochs]
			sleeps_json = [ast.literal_eval(dic) for dic in sleeps]
			user_metrics_json = [ast.literal_eval(dic) for dic in user_metrics]
			stress_json = [ast.literal_eval(dic) for dic in stress]

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
				'workout_easy_hard':hlpr.safe_get(todays_daily_strong, "work_out_easy_or_hard",''),
				'workout_type': '',
				'workout_time': '',
				'workout_location': '',
				'workout_duration': '',
				'maximum_elevation_workout': 0,
				'minutes_walked_before_workout': '',
				'distance': 0,
				'pace': '',
				'avg_heartrate':0,
				'elevation_gain':hlpr.safe_sum(activities_json,'totalElevationGainInMeters'),
				'elevation_loss':hlpr.safe_sum(activities_json,'totalElevationLossInMeters'),
				'effort_level':hlpr.safe_get(todays_daily_strong, "workout_effort_level", 0),

				'dew_point': weather_data['dewPoint'],
				'temperature': weather_data['temperature'],
				'humidity': weather_data['humidity'],
				'temperature_feels_like': weather_data['apparentTemperature'],
				'wind': weather_data['windSpeed'],
				'hrr': '',
				'hrr_start_point': 0,
				'hrr_beats_lowered': 0,
				'sleep_resting_hr_last_night': hlpr.safe_get_dict(dailies_json,'restingHeartRateInBeatsPerMinute',0),
				'vo2_max': hlpr.safe_get_dict(user_metrics_json,"vo2Max",0),
				'running_cadence':hlpr.safe_sum(activities_json,'averageRunCadenceInStepsPerMinute'),
				'nose_breath_prcnt_workout': 0,
				'water_consumed_workout':hlpr.safe_get(daily_encouraged,
										"water_consumed_during_workout",0),

				'chia_seeds_consumed_workout':hlpr.safe_get(daily_optional,
											 "chia_seeds_consumed_during_workout",0),

				'fast_before_workout': hlpr.safe_get(daily_optional,
									  "fasted_during_workout",''),

				'pain': hlpr.safe_get(daily_encouraged,
						"pains_twings_during_or_after_your_workout",''),

				'pain_area': hlpr.safe_get(daily_encouraged,"pain_area", ""),
				'stress_level':hlpr.safe_get(daily_encouraged, "stress_level_yesterday", ""),
				'sick': hlpr.safe_get(daily_optional, "sick", ""),
				'drug_consumed': '',
				'drug': '',
				'medication':hlpr.safe_get(todays_daily_strong,
								 "medications_or_controlled_substances_yesterday", ""),

				'smoke_substance':hlpr.safe_get(todays_daily_strong,
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
				'workout_comment':hlpr.safe_get(daily_optional, "general_Workout_Comments", "")
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
				 'non_exercise_steps':0,
				 'exercise_steps': 0,
				 'total_steps': 0,
				 'floor_climed':hlpr.safe_sum(dailies_json,'floorsClimbed'),
				 'floor_decended':0,
				 'movement_consistency': '',
			}

			sleeps_calculated_data = {
				'sleep_per_wearable': '',
				'sleep_per_user_input':'',
				'sleep_aid': hlpr.safe_get(todays_daily_strong,
							 "prescription_or_non_prescription_sleep_aids_last_night", ""),
				'sleep_bed_time': '',
				'sleep_awake_time': '',
				'deep_sleep': hlpr.safe_sum(sleeps_json,'deepSleepDurationInSeconds'),
				'light_sleep': hlpr.safe_sum(sleeps_json,'lightSleepDurationInSeconds'),
				'awake_time': hlpr.safe_sum(sleeps_json,'awakeDurationInSeconds'),

			}

			food_calculated_data = {
				'prcnt_non_processed_food':0,
				'prcnt_non_processed_food_grade': '',
				'non_processed_food': hlpr.safe_get(todays_daily_strong,
									 "list_of_unprocessed_food_consumed_yesterday", ""),
				'diet_type':'',
			}

			alcohol_calculated_data = {
				'alcohol_day': hlpr.safe_get(todays_daily_strong,"number_of_alcohol_consumed_yesterday",""),
				'alcohol_week': 0
			}

			# Calculation of grades

			# Average sleep per night grade calculation
			for q in daily_strong:
				if (q.user_input.created_at == current_date.date() and 
					q.sleep_time_excluding_awake_time != ''):

					grade = hlpr.cal_average_sleep_grade(
										  q.sleep_time_excluding_awake_time,
										  q.prescription_or_non_prescription_sleep_aids_last_night)
					grades_calculated_data['avg_sleep_per_night_grade'] = grade

			# Unprocessed food grade calculation 
			for q in daily_strong:
				if (q.user_input.created_at == current_date.date() and
					q.prcnt_unprocessed_food_consumed_yesterday != ''):
					grade = hlpr.cal_unprocessed_food_grade(
											 q.prcnt_unprocessed_food_consumed_yesterday)

					grades_calculated_data['prcnt_unprocessed_food_consumed_grade'] = grade

			# Alcohol drink consumed grade
			alcohol_grade = hlpr.cal_alcohol_drink_grade(
				[q.number_of_alcohol_consumed_yesterday
				if not q.number_of_alcohol_consumed_yesterday in [None,''] else 0
				for q in daily_strong],
				user.profile.gender)

			grades_calculated_data['alcoholic_drink_per_week_grade'] = alcohol_grade

			# Movement consistency and movement consistency grade calculation
			movement_consistency_summary = hlpr.cal_movement_consistency_summary(epochs_json)
			if movement_consistency_summary:
				steps_calculated_data['movement_consistency'] = json.dumps(movement_consistency_summary)
				inactive_hours = movement_consistency_summary.get("inactive_hours")
				grade = hlpr.cal_movement_consistency_grade(inactive_hours)
				grades_calculated_data['movement_consistency_grade'] = grade

			# Exercise step calculation, Non exercise step calculation and
			# Non-Exercise steps grade calculation
			exercise_steps, total_steps = hlpr.cal_exercise_steps_total_steps(
											  dailies_json,epochs_json)	
			steps_calculated_data['non_exercise_steps'] = total_steps - exercise_steps
			steps_calculated_data['exercise_steps'] = exercise_steps
			steps_calculated_data['total_steps'] = total_steps

			grades_calculated_data['movement_non_exercise_steps_grade'] = \
			hlpr.cal_non_exercise_step_grade(total_steps - exercise_steps)


			# If quick look for provided date exist then update it otherwise
			# create new quicklook instance 
			try:
				user_ql = UserQuickLook.objects.get(user=user,created_at = current_date.date())
				hlpr.update_helper(user_ql.grades_ql,grades_calculated_data)
				hlpr.update_helper(user_ql.exercise_reporting_ql, exercise_calculated_data)
				hlpr.update_helper(user_ql.swim_stats_ql, swim_calculated_data)
				hlpr.update_helper(user_ql.bike_stats_ql, bike_calculated_data)
				hlpr.update_helper(user_ql.steps_ql, steps_calculated_data)
				hlpr.update_helper(user_ql.sleep_ql, sleeps_calculated_data)
				hlpr.update_helper(user_ql.food_ql, food_calculated_data)
				hlpr.update_helper(user_ql.alcohol_ql, alcohol_calculated_data)

			except UserQuickLook.DoesNotExist:
				user_ql = UserQuickLook.objects.create(user = user,created_at=current_date.date())
				Grades.objects.create(user_ql=user_ql, **grades_calculated_data)
				ExerciseAndReporting.objects.create(user_ql = user_ql,**exercise_calculated_data)
				SwimStats.objects.create(user_ql=user_ql, **swim_calculated_data)
				BikeStats.objects.create(user_ql = user_ql,**bike_calculated_data)
				Steps.objects.create(user_ql = user_ql,**steps_calculated_data)
				Sleep.objects.create(user_ql = user_ql,**sleeps_calculated_data)
				Food.objects.create(user_ql = user_ql,**food_calculated_data)
				Alcohol.objects.create(user_ql = user_ql,**alcohol_calculated_data)

			#Add one day to current date
			current_date += timedelta(days=1)

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