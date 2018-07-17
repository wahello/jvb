import json
from datetime import datetime,timedelta

from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from quicklook.models import UserQuickLook
from garmin.models import UserLastSynced
from user_input.models import UserDailyInput

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
            if step_data.movement_consistency:
                movement_consistency = json.loads(step_data.movement_consistency)
            else:
                movement_consistency = None
            grades_data["overall_health_gpa"] = grade_data.overall_health_gpa
            grades_data["exercise_consistency_score"] = grade_data.exercise_consistency_score
            grades_data["unprocessed_food_grade"] = food_data.prcnt_non_processed_food
            grades_data["alcoholic_drinks_per_week_grade"] = grade_data.alcoholic_drink_per_week_gpa
            grades_data["sleep_aids_penalty"] = grade_data.sleep_aid_penalty
            grades_data["controlled_subtances_penalty"] = grade_data.ctrl_subs_penalty
            grades_data["smoking_penalty"] = grade_data.smoke_penalty
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