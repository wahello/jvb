import json
from datetime import datetime,timedelta,time

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from quicklook.models import UserQuickLook
from garmin.models import UserLastSynced
from hrr.models import Hrr
from user_input.models import UserDailyInput
from leaderboard.helpers.leaderboard_helper_classes import calculate_t99_points

from quicklook.calculations.garmin_calculation import str_to_datetime
from quicklook.models import Steps
import ast

def sec_to_min_sec(secs):
    if secs or secs is not None:
        mins,secs = divmod(secs,60)
        mins = round(mins)
        secs = round(secs)
        if secs < 10:
            mins = "{:02d}".format(secs) 
        return "{}:{}".format(mins,secs)
    return None 

class MovementDashboardView(APIView):       
    '''
    API for Movement Dashboard 
    '''
    permission_classes = (IsAuthenticated,)

    def get_user_localtime(self):
        '''
        Return the current local time of user.
        If offset value for user's timezone is not present 
        then default offset which is 0 is taken

        Return:
            date time: Return a naive date time object representing 
                the users current local time
        '''
        user = self.request.user
        try: 
            user_last_synced = UserLastSynced.objects.get(user=user)
            offset = user_last_synced.offset
        except UserLastSynced.DoesNotExist as e:
            offset = 0

        utc_time_now = datetime.utcnow()
        user_local_time = utc_time_now + timedelta(seconds = offset)
        return user_local_time

    def dt_to_hour_range(self, dt):
        '''
        Generate a string from the date time object's hour which
        represent a hourly interval. Example - If date time object
        represents July 2, 2018 18:17 pm then the hourly interval will 
        be "6:00 PM to 6:59 PM" (hours will be in 12 hour system).

        Args:
            dt (obj:`date time`): A date time object

        Return:
            str: String representing hourly time interval  
        '''
        hour_str = dt.strftime("%I:00 %p") + " to " + dt.strftime("%I:59 %p")
        return hour_str

    def get(self,request,format=None):
        user = request.user
        date = request.query_params.get('date')
        try:
            user_ql = UserQuickLook.objects.get(user=user,created_at=date)
        except UserQuickLook.DoesNotExist as e:
            user_ql = None
        movement_data = {}
        if user_ql:
            step_data = user_ql.steps_ql
            user_local_time = self.get_user_localtime()
            if step_data.movement_consistency:
                movement_consistency = json.loads(step_data.movement_consistency)
            else:
                movement_consistency = None
            movement_data["non_exercise_steps"] = step_data.non_exercise_steps
            movement_data["exercise_steps"] = step_data.exercise_steps
            movement_data["total_steps"] = step_data.total_steps

            if movement_consistency:
                movement_data["mcs_score"] = movement_consistency["inactive_hours"]

                this_hour_range = self.dt_to_hour_range(user_local_time)
                step_this_hour = movement_consistency[this_hour_range]['steps']
                movement_data["steps_this_hour"] = step_this_hour
            else:
                movement_data["mcs_score"] = None
                movement_data["steps_this_hour"] = None
        return Response(movement_data,status=status.HTTP_200_OK) 

class HrrSummaryDashboardview(APIView):

    def get(self,request,format=None):
        user = request.user
        date = request.query_params.get('date')
        try:
            userhrr = Hrr.objects.get(user_hrr = user, created_at = date)
        except Hrr.DoesNotExist as e:
            userhrr = None
        hrr_data = {}
        if userhrr:
            time99_point,pure_time99_point = self._calculate_time99_points(userhrr)
            hrr_data["time_to_99"] = {"time99":userhrr.time_99,
                "points":time99_point}
            hrr_data["pure_time_to_99"] = {"pure_time99":userhrr.pure_time_99,
                "points":pure_time99_point}
            hrr_data["pure_heart_beats_lowered_in_1st_min"] = userhrr.pure_1min_heart_beats
            hrr_data["heart_beats_lowest_1st_minute"] = userhrr.No_beats_recovered

        return Response(hrr_data,status=status.HTTP_200_OK)

    def _calculate_time99_points(self,userhrr):
        user = self.request.user
        if hasattr(user,'profile'):
            aerobic_hr_zone_max = 180 - user.profile.age() + 5
        else:
            aerobic_hr_zone_max = 0
        activity_end_hr = userhrr.end_heartrate_activity
        time99_point = -1
        pure_time99_point = -1
        time99 = userhrr.time_99
        pure_time99 = userhrr.pure_time_99
        if aerobic_hr_zone_max and activity_end_hr and time99 is not None:
            time99 = sec_to_min_sec(time99)
            time99_point = calculate_t99_points(aerobic_hr_zone_max,
                activity_end_hr,time99)
        if aerobic_hr_zone_max and activity_end_hr and pure_time99 is not None:
            if pure_time99 == -1:
                pure_time99_point = 0
            else:
                pure_time99 = sec_to_min_sec(pure_time99)
                pure_time99_point = calculate_t99_points(aerobic_hr_zone_max,
                    activity_end_hr,pure_time99)
        return (time99_point, pure_time99_point)


class GradesDashboardView(APIView):

    '''
    API of Grades Dashboard

    '''
    def get_user_inputs(self, date):

        '''
        Return the user input of user for provided date.

        Args:
            date(string): string representing current user date.

        Return:
         user_input: it will return current user (user_input_data).
        
        '''
        try:
            user = self.request.user
            user_input = UserDailyInput.objects.get(user = user, created_at = date)
        except UserDailyInput.DoesNotExist as e:
            user_input = None
        return user_input


    def get(self,request, format=None):
        user = request.user
        date = request.query_params.get('date')

        try:
            user_ql = UserQuickLook.objects.get(user=user,created_at=date)
        except UserQuickLook.DoesNotExist as e:
            user_ql = None
        grades_data = {}
        if user_ql:
            user_input = self.get_user_inputs(date)
            grade_data = user_ql.grades_ql
            sleep_data = user_ql.sleep_ql
            step_data = user_ql.steps_ql
            food_data = user_ql.food_ql
            exercise_data = user_ql.exercise_reporting_ql
            alcohol_data = user_ql.alcohol_ql
            if step_data.movement_consistency:
                movement_consistency = json.loads(step_data.movement_consistency)
            else:
                movement_consistency = None
            grades_data["overall_health_gpa"] = grade_data.overall_health_gpa
            grades_data["exercise_consistency_score"] = grade_data.exercise_consistency_score
            grades_data["unprocessed_food_grade"] = food_data.prcnt_non_processed_food
            grades_data["alcoholic_drinks_per_week_grade"] = alcohol_data.alcohol_week
            grades_data["alcohol_drinks_yesterday"] = alcohol_data.alcohol_day
            grades_data["sleep_aids_penalty"] = grade_data.sleep_aid_penalty
            grades_data["controlled_subtances_penalty"] = grade_data.ctrl_subs_penalty
            grades_data["smoking_penalty"] = grade_data.smoke_penalty
            grades_data["did_you_workout"] = exercise_data.did_workout
            grades_data["non_exercise_steps"] = step_data.non_exercise_steps

            if user_input:
                grades_data["report_inputs_today"] = "yes"
            else:
                grades_data["report_inputs_today"] = "no"
            
            if sleep_data.sleep_per_user_input:
                grades_data["sleep_per_night"] = sleep_data.sleep_per_user_input
            elif sleep_data.sleep_per_wearable:
                grades_data["sleep_per_night"] = sleep_data.sleep_per_wearable
            else:
                grades_data["sleep_per_night"] = None

            if step_data.movement_consistency:
                grades_data["mcs_score"] = movement_consistency["inactive_hours"]
            else:
                grades_data["mcs_score"] = None
                
        return Response(grades_data,status.HTTP_200_OK)

class ActiveTimeDashboardView(APIView):

    def get(self, request):
        user = self.request.user
        target_date = request.query_params.get('date',None)
        current_date = str_to_datetime(target_date)
        moment_obj = None
        moment_obj = Steps.objects.filter(user_ql__user = user,user_ql__created_at = current_date).values(
            'movement_consistency')
        if moment_obj[0].get('movement_consistency'):
            moment_obj = ast.literal_eval(moment_obj[0].get('movement_consistency'))
            sleeping_active_minutes = 0
            exercise_active_minutes = 0
            sleep_hours = 0
            exercise_hours = 0
            for key,value in moment_obj.items():
                try:
                    if value['status'] == 'sleeping':
                        sleeping_active_minutes += value['active_duration']['duration']
                        sleep_hours += 1
                    elif value['status'] == 'exercise':
                        exercise_active_minutes += value['active_duration']['duration']
                        exercise_hours += 1
                except TypeError as e:
                    pass
            sleep_hour_prcnt = round((sleeping_active_minutes / (sleep_hours*60)) * 100)
            exercise_hour_prcnt = round((exercise_active_minutes / (exercise_hours*60)) * 100)
            excluded_sleep = moment_obj['total_active_minutes'] - sleeping_active_minutes
            excluded_sleep_exercise = excluded_sleep - exercise_active_minutes
            sleeping_active_time = [sleeping_active_minutes//60,sleeping_active_minutes%60]
            exercise_active_time = [exercise_active_minutes//60,exercise_active_minutes%60]
            excluded_sleep_time = [excluded_sleep//60,excluded_sleep%60]
            excluded_sleep_exercise_time = [excluded_sleep_exercise//60,excluded_sleep_exercise%60]
            active_time = {}
            total_hours = 24
            excluded_sleep_hours = total_hours-sleep_hours
            excluded_sleep_prcnt = round((excluded_sleep / (excluded_sleep_hours*60)) * 100)
            excluded_sleep_exercise_hours = excluded_sleep_hours - exercise_hours
            excluded_sleep_exercise_prcnt = round((excluded_sleep_exercise / (excluded_sleep_exercise_hours*60)) * 100)
            active_time['total_active_time']=time(moment_obj['total_active_minutes']//60,\
                moment_obj['total_active_minutes']%60).strftime('%I:%M')

            active_time['total_hours'] = '{}:{}'.format(total_hours,'00')

            active_time['sleeping_active_time'] = '{}:{}'.format(sleeping_active_time[0],\
                "%02d" % sleeping_active_time[1])

            active_time['total_sleeping_hours'] = '{}:{}'.format(sleep_hours,'00')

            active_time['sleep_hour_prcnt'] = '{}%'.format(sleep_hour_prcnt)

            active_time['exercise_active_time'] = '{}:{}'.format(exercise_active_time[0],\
               "%02d" % exercise_active_time[1])

            active_time['total_exercise_hours'] = '{}:{}'.format(exercise_hours,'00')

            active_time['exercise_hour_prcnt'] = '{}%'.format(exercise_hour_prcnt)

            active_time['excluded_sleep']= '{}:{}'.format(excluded_sleep_time[0],\
               "%02d" % excluded_sleep_time[1])

            active_time['excluded_sleep_hours'] = '{}:{}'.format(total_hours-sleep_hours,'00')

            active_time['excluded_sleep_prcnt'] = '{}%'.format(excluded_sleep_prcnt)

            active_time['excluded_sleep_exercise']= '{}:{}'.format(excluded_sleep_exercise_time[0],\
               "%02d" % excluded_sleep_exercise_time[1])

            active_time['excluded_sleep_exercise_hours'] = '{}:{}'.format(total_hours-sleep_hours-exercise_hours,'00')

            active_time['excluded_sleep_exercise_prcnt'] = '{}%'.format(excluded_sleep_exercise_prcnt)

            active_time['total_active_prcnt']='{}%'.format(moment_obj['total_active_prcnt'])
            return Response(active_time,status.HTTP_200_OK)

        else:
            active_time = {}
            return Response(active_time,status.HTTP_200_OK)

