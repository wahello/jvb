from datetime import datetime, timedelta, date
import time
from decimal import Decimal, ROUND_HALF_UP
import calendar
import ast
import json
import logging

from django.http import JsonResponse  
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from xlsxwriter.workbook import Workbook
from fitparse import FitFile
from garmin.models import GarminFitFiles,\
						  UserGarminDataActivity,\
						  UserLastSynced

from registration.models import Profile

from user_input.models import DailyUserInputOptional,\
							  DailyUserInputEncouraged,\
							  DailyUserInputStrong

from .serializers import UserQuickLookSerializer,\
							GradesSerializer,\
							StepsSerializer,\
							SleepSerializer


from .models import UserQuickLook,\
					Grades,\
					Sleep,\
					Steps,\
					SwimStats,\
					BikeStats,\
					Food,\
					Alcohol,\
					ExerciseAndReporting

from progress_analyzer.models import OverallHealthGradeCumulative, \
									 NonExerciseStepsCumulative,\
									 SleepPerNightCumulative,\
									 MovementConsistencyCumulative,\
									 ExerciseConsistencyCumulative,\
									 NutritionCumulative,\
									 ExerciseStatsCumulative,\
									 AlcoholCumulative,\
									 OtherStatsCumulative


from progress_analyzer.helpers.helper_classes import ProgressReport
from leaderboard.helpers.leaderboard_helper_classes import LeaderboardOverview
from hrr.models import Hrr
# from .calculation_helper import *
from hrr.views import weekly_workout_helper
from hrr.calculation_helper import week_date 

class UserQuickLookView(generics.ListCreateAPIView):
	'''
		- Create the quick look instance
		- List all the quick look instance
		- If query parameters "to" and "from" are provided
		  then filter the quick look data for provided date interval
		  and return the list
	'''
	permission_classes = (IsAuthenticated,)
	serializer_class = UserQuickLookSerializer

	def get_queryset(self):
		user = self.request.user

		end_dt = self.request.query_params.get('to',None)
		start_dt = self.request.query_params.get('from', None)

		if start_dt and end_dt:
			queryset = UserQuickLook.objects.filter(Q(created_at__gte=start_dt)&
							  Q(created_at__lte=end_dt),
							  user=user)
		else:
			queryset = UserQuickLook.objects.all()

		return queryset

class UserQuickLookItemView(generics.RetrieveUpdateDestroyAPIView):
	'''
		GET for getting particular model instance
		PUT for updating particular model instance
		DELETE for deleting particular model instance
		
		-displays only current user data not others (for now)
		-search item based on provided date
	'''
	permission_classes = (IsAuthenticated,)
	serializer_class = UserQuickLookSerializer

	def get_queryset(self):
		user = self.request.user
		qs = UserQuickLook.objects.filter(user=user)
		return qs

	def get_object(self):
		qs = self.get_queryset()
		d = int(self.kwargs.get('day'))
		m = int(self.kwargs.get('month'))
		y = int(self.kwargs.get('year'))
		dt = datetime.date(y,m,d)
		obj = get_object_or_404(qs,created_at=dt)
		return obj


class GradeItemView(generics.RetrieveUpdateDestroyAPIView):
	'''
		GET for getting particular model instance
		PUT for updating particular model instance
		DELETE for deleting particular model instance
		
		-displays only current user data not others (for now)
		-search item based on created date (for now)
	'''
	permission_classes = (IsAuthenticated,)
	serializer_class = GradesSerializer

	def get_queryset(self):
		user = self.request.user
		qs = Grades.objects.filter(user_ql__user=user)
		return qs

	def get_object(self):
		qs = self.get_queryset()
		d = int(self.kwargs.get('day'))
		m = int(self.kwargs.get('month'))
		y = int(self.kwargs.get('year'))
		dt = datetime.date(y,m,d)
		obj = get_object_or_404(qs,user_ql__created_at=dt)
		return obj

class GradeWeeklyListView(generics.ListAPIView):
	'''
		Return list of grades from last sunday to provided date
		Week start at Sunday and ends at Saturday
	'''
	permission_classes = (IsAuthenticated,)
	serializer_class = GradesSerializer

	def get_queryset(self):
		user = self.request.user
		d = int(self.kwargs.get('day'))
		m = int(self.kwargs.get('month'))
		y = int(self.kwargs.get('year'))
		current_dt = datetime.date(y,m,d)

		if not current_dt.weekday() == 6:
			week_start_dt = current_dt - datetime.timedelta(current_dt.weekday()+1)
		else:
			week_start_dt = current_dt
		
		qs = Grades.objects.filter(Q(user_ql__created_at__gte=week_start_dt)&
								   Q(user_ql__created_at__lte=current_dt),
								   user_ql__user=user,)
		return qs

class GradeListView(generics.ListCreateAPIView):
	permission_classes = (IsAuthenticated,)
	queryset = Grades.objects.all()
	serializer_class = GradesSerializer

class StepsItemView(generics.RetrieveUpdateDestroyAPIView):
	'''
		GET for getting particular model instance
		PUT for updating particular model instance
		DELETE for deleting particular model instance
		
		-displays only current user data not others (for now)
		-search item based on created date (for now)
	'''
	permission_classes = (IsAuthenticated,)
	serializer_class = StepsSerializer

	def get_queryset(self):
		user = self.request.user
		qs = Steps.objects.filter(user_ql__user=user)
		return qs

	def get_object(self):
		qs = self.get_queryset()
		d = int(self.kwargs.get('day'))
		m = int(self.kwargs.get('month'))
		y = int(self.kwargs.get('year'))
		dt = datetime.date(y,m,d)
		obj = get_object_or_404(qs,user_ql__created_at=dt)
		return obj

class StepListView(generics.ListCreateAPIView):
	permission_classes = (IsAuthenticated,)
	queryset = Steps.objects.all()
	serializer_class = StepsSerializer

class SleepItemView(generics.RetrieveUpdateDestroyAPIView):
	'''
		GET for getting particular model instance
		PUT for updating particular model instance
		DELETE for deleting particular model instance
		
		-displays only current user data not others (for now)
		-search item based on created date (for now)
	'''
	permission_classes = (IsAuthenticated,)
	serializer_class = SleepSerializer

	def get_queryset(self):
		user = self.request.user
		qs = Sleep.objects.filter(user_ql__user=user)
		return qs

	def get_object(self):
		qs = self.get_queryset()
		d = int(self.kwargs.get('day'))
		m = int(self.kwargs.get('month'))
		y = int(self.kwargs.get('year'))
		dt = datetime.date(y,m,d)
		obj = get_object_or_404(qs,user_ql__created_at=dt)
		return obj

class SleepListView(generics.ListCreateAPIView):
	permission_classes = (IsAuthenticated,)
	queryset = Sleep.objects.all()
	serializer_class = SleepSerializer

def aa_calculations(request):
	start_date = request.GET.get('start_date',None)
	start_date = datetime.strptime(start_date, "%Y-%m-%d").date()

	start = start_date
	end = start_date + timedelta(days=7)
	start_date_str = start_date.strftime('%Y-%m-%d')
	
	obj_start_year = int(start_date_str.split('-')[0])
	obj_start_month = int(start_date_str.split('-')[1])
	obj_start_date = int(start_date_str.split('-')[2])
	obj_end_date = obj_start_date + 1
 
	start_date_timestamp = int(time.mktime(datetime.strptime(start_date_str, "%Y-%m-%d").timetuple()))
	end_date_timestamp = start_date_timestamp+86400
	activity_files_qs=UserGarminDataActivity.objects.filter(user=request.user,start_time_in_seconds__range=[start_date_timestamp,end_date_timestamp])
	activity_files = [pr.data for pr in activity_files_qs]
	offset_value = 0
	if activity_files:
		one_activity_file_dict =  ast.literal_eval(activity_files[0])
		offset_value = one_activity_file_dict['startTimeOffsetInSeconds']
		
	a1=GarminFitFiles.objects.filter(user=request.user,created_at__range=[start,end])
	profile = Profile.objects.filter(user=request.user)
	for tmp_profile in profile:
		user_dob = tmp_profile.date_of_birth
	user_age = (date.today() - user_dob) // timedelta(days=365.2425)

	heartrate_complete = []
	timestamp_complete = []
	data = {"total_time":"",
				"aerobic_zone":"",
				"anaerobic_range":"",
				"below_aerobic_zone":"",
				"aerobic_range":"",
				"anaerobic_range":"",
				"below_aerobic_range":"",
				"percent_aerobic":"",
				"percent_below_aerobic":"",
				"percent_anaerobic":"",
				"total_percent":""}
	if a1:
		x = [(FitFile(x.fit_file)).get_messages('record') for x in a1]
		for record in x:
			for record_data in record:
				for ss in record_data:
					if(ss.name=='heart_rate'):
						b = ss.value
						heartrate_complete.extend([b])

					if(ss.name=='timestamp'):
						c = ss.value
						cc = c.strftime('%Y-%m-%d')
						timestamp_complete.extend([c])
		
		# for x in a1:
		# 	fitfile = FitFile(x.fit_file)
		# 	for record in fitfile.get_messages('record'):
		# 		for record_data in record:
		# print(heartrate_complete)
		heartrate_selected_date = []
		timestamp_selected_date = []
		start_date_obj = datetime(obj_start_year,obj_start_month,obj_start_date,0,0,0)
		end_date_obj = datetime(obj_start_year,obj_start_month,obj_end_date,0,0,0)

		for heart,timeheart in zip(heartrate_complete,timestamp_complete):
			timeheart_str = timeheart.strftime("%Y-%m-%d %H:%M:%S")
			timeheart_utc = int(time.mktime(datetime.strptime(timeheart_str, "%Y-%m-%d %H:%M:%S").timetuple()))+offset_value
			timeheart_utc = datetime.utcfromtimestamp(timeheart_utc)
			if timeheart_utc >= start_date_obj and timeheart_utc <= end_date_obj:
				heartrate_selected_date.extend([heart])
				timestamp_selected_date.extend([timeheart])

		
		to_timestamp = []
		for i,k in enumerate(timestamp_selected_date):
			dtt = k.timetuple()
			ts = time.mktime(dtt)
			ts = ts+offset_value
			to_timestamp.extend([ts])
		
		timestamp_difference = []
		for i,k in enumerate(to_timestamp):
			try:
				dif_tim = to_timestamp[i+1] - to_timestamp[i]
				timestamp_difference.extend([dif_tim])
			except IndexError:
				timestamp_difference.extend([1])

		final_heartrate = []
		final_timestamp = []

		for i,k in zip(heartrate_selected_date,timestamp_difference):
			if (k < 60) and (k >= 0):
				final_heartrate.extend([i])
				final_timestamp.extend([k]) 


		below_aerobic_value = 180-user_age-30
		anaerobic_value = 180-user_age+5

		aerobic_range = '{}-{}'.format(below_aerobic_value,anaerobic_value)
		anaerobic_range = '{} or above'.format(anaerobic_value+1)
		below_aerobic_range = 'below {}'.format(below_aerobic_value	)
		
		anaerobic_range_list = []
		below_aerobic_list = []
		aerobic_list = []

		# low_end_values = [-61,-60,-55,-50,-45,-40,-35,-30,-25,-20,-15,-10,+1,6,10,14,19,24,
		# 					29,34,39,44,49,54,59]
		# high_end_values = [-56,-51,-46,-41,-36,-31,-26,-21,-16,-21,-16,-11,0,5,10,13,18,23,28,
		# 					33,38,43,48,53,58,63]
		# low_end_heart = [180-40+tmp for tmp in low_end_values]
		# high_end_heart = [180-40+tmp for tmp in high_end_values]


		for a, b in zip(final_heartrate,final_timestamp):
			if a > anaerobic_value:
				anaerobic_range_list.extend([b])
			elif a < below_aerobic_value:
				below_aerobic_list.extend([b])
			else:
				aerobic_list.extend([b])

		time_in_aerobic = sum(aerobic_list)
		time_in_below_aerobic = sum(below_aerobic_list)
		time_in_anaerobic = sum(anaerobic_range_list)
		
		total_time = time_in_aerobic+time_in_below_aerobic+time_in_anaerobic
		try:
			percent_anaerobic = (time_in_anaerobic/total_time)*100
			percent_anaerobic = int(Decimal(percent_anaerobic).quantize(0,ROUND_HALF_UP))

			percent_below_aerobic = (time_in_below_aerobic/total_time)*100
			percent_below_aerobic = int(Decimal(percent_below_aerobic).quantize(0,ROUND_HALF_UP))

			percent_aerobic = (time_in_aerobic/total_time)*100
			percent_aerobic = int(Decimal(percent_aerobic).quantize(0,ROUND_HALF_UP))

			total_percent = 100
		except ZeroDivisionError:
			percent_anaerobic=''
			percent_below_aerobic=''
			percent_aerobic=''
			total_percent=''
			
		data = {"total_time":total_time,
				"aerobic_zone":time_in_aerobic,
				"anaerobic_zone":time_in_anaerobic,
				"below_aerobic_zone":time_in_below_aerobic,
				"aerobic_range":aerobic_range,
				"anaerobic_range":anaerobic_range,
				"below_aerobic_range":below_aerobic_range,
				"percent_aerobic":percent_aerobic,
				"percent_below_aerobic":percent_below_aerobic,
				"percent_anaerobic":percent_anaerobic,
				"total_percent":total_percent}

	return JsonResponse(data)

def mcs_excel(to_date,from_date,book,user,response,excel_type,
			bold,format_orange,format_green,format_red_con,format_purple,format_yellow,
			format_exercise,format_grey,format_cream,format_darkcyan,date_format,format):
	#movement consistenct
	columns4 = ['movement_consistency','non_exercise_steps', 'exercise_steps', 'total_steps', 'floor_climed']
	grades_qs = Grades.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = user).order_by('-user_ql__created_at')
	grades_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in grades_qs}

	steps_qs = Steps.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = user).order_by('-user_ql__created_at')

	steps_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in steps_qs }

	sheet11 = book.add_worksheet('Movement Consistency')
	sheet11.set_landscape()
	sheet11.fit_to_pages(1, 1)
	sheet11.set_zoom(58)
	sheet11.write(0,0,"Movement Consistency Historical Data",bold)
	sheet11.write(0,10,"Sleeping",format_orange)
	sheet11.write(0,11,"Active",format_green)
	sheet11.write(0,12,"Inactive",format_red_con)
	sheet11.write(0,13,"Strength",format_purple)
	sheet11.write(0,14,"Exercise",format_exercise)
	sheet11.write(0,15,"No Data Yet",format_grey)
	sheet11.write(0,16,"Time Zone",format_cream)
	sheet11.write(0,17,"Nap",format_darkcyan)
	sheet11.write(2,0,"Hour")
	sheet11.write(3,0,"Date",bold)
	format2 = book.add_format({'bold':True})
	format2.set_align('bottom')
	format2.set_text_wrap()
	format3 = book.add_format({'bold':True,'align':'center'})
	format3.set_align('bottom')
	format3.set_text_wrap()
	format4 = book.add_format({'bold':True})
	format4.set_num_format("0%") 
	sheet11.set_column('D:AA',8)
	sheet11.freeze_panes(4,3)
	sheet11.set_column(1,1,15)
	sheet11.write(5,0,'% of Days User Gets 300  in the hour*',bold)
	# format2.set_shrink()
	sheet11.write(3,1,"Daily Movement Consistency Score",format3)
	hours_range = ["Total Daily Steps","12:00 - 12:59 AM","01:00 - 01:59 AM","02:00 - 02:59 AM","03:00 - 03:59 AM","04:00 - 04:59 AM",
	"05:00 - 05:59 AM","06:00 - 06:59 AM","07:00 - 07:59 AM","08:00 - 08:59 AM","09:00 - 09:59 AM","10:00 - 10:59 AM","11:00 - 11:59 AM",
	"12:00 - 12:59 PM","01:00 - 01:59 PM","02:00 - 02:59 PM","03:00 - 03:59 PM","04:00 - 04:59 PM","05:00 - 05:59 PM",
	"06:00 - 06:59 PM","07:00 - 07:59 PM","08:00 - 08:59 PM","09:00 - 09:59 PM","10:00 - 10:59 PM","11:00 - 11:59 PM","Sleeping Hours",
	"Nap Hours","Active Hours","Inactive Hours","Strength Hours","Exercise Hours","No Data Yet Hours","Time Zone Hours"]
	hours_range1 = ["total_steps","12:00 AM to 12:59 AM","01:00 AM to 01:59 AM","02:00 AM to 02:59 AM","03:00 AM to 03:59 AM","04:00 AM to 04:59 AM",
	"05:00 AM to 05:59 AM","06:00 AM to 06:59 AM","07:00 AM to 07:59 AM","08:00 AM to 08:59 AM","09:00 AM to 09:59 AM","10:00 AM to 10:59 AM","11:00 AM to 11:59 AM",
	"12:00 PM to 12:59 PM","01:00 PM to 01:59 PM","02:00 PM to 02:59 PM","03:00 PM to 03:59 PM","04:00 PM to 04:59 PM","05:00 PM to 05:59 PM",
	"06:00 PM to 06:59 PM","07:00 PM to 07:59 PM","08:00 PM to 08:59 PM","09:00 PM to 09:59 PM","10:00 PM to 10:59 PM","11:00 PM to 11:59 PM","sleeping_hours",
	"active_hours","inactive_hours"]
	days_count = {"12:00 AM to 12:59 AM":0,"01:00 AM to 01:59 AM":0,"02:00 AM to 02:59 AM":0,"03:00 AM to 03:59 AM":0,"04:00 AM to 04:59 AM":0,
	"05:00 AM to 05:59 AM":0,"06:00 AM to 06:59 AM":0,"07:00 AM to 07:59 AM":0,"08:00 AM to 08:59 AM":0,"09:00 AM to 09:59 AM":0,"10:00 AM to 10:59 AM":0,"11:00 AM to 11:59 AM":0,
	"12:00 PM to 12:59 PM":0,"01:00 PM to 01:59 PM":0,"02:00 PM to 02:59 PM":0,"03:00 PM to 03:59 PM":0,"04:00 PM to 04:59 PM":0,"05:00 PM to 05:59 PM":0,
	"06:00 PM to 06:59 PM":0,"07:00 PM to 07:59 PM":0,"08:00 PM to 08:59 PM":0,"09:00 PM to 09:59 PM":0,"10:00 PM to 10:59 PM":0,"11:00 PM to 11:59 PM":0}
	columns = ['movement_consistency']
	current_date = to_date
	r = 6
	total_days = (to_date-from_date).days+1

	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			sheet11.write(r,0,current_date,date_format)
			current_date -= timedelta(days = 1)
	sheet11.set_row(3,45)
	col_num = 2
	start_num = 12
	start_digit =':01'
	end_digit = ':59'
	for hour in range(1,25,1):
		col_num += 1
		sheet11.write(2,col_num,hour)
	col_num1 = 1
	for col_num in range(len(hours_range)):
		col_num1 += 1
		sheet11.write(3,col_num1,hours_range[col_num],format2)
	current_date = to_date
	row_num = 4
	row = 6
	row_per = 5
	col = 2
	while (current_date >= from_date):
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if steps_data:
			steps_data = steps_data.__dict__
			grades_data = grades_data.__dict__
			# logic
			row += 1
			for i,key in enumerate(columns4):
				
				if i == 0 and grades_data['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and steps_data[key]:
					sheet11.write(row,col-1,ast.literal_eval(steps_data[key])['inactive_hours'], format_green)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and steps_data[key]:
					sheet11.write(row,col-1, ast.literal_eval(steps_data[key])['inactive_hours'], format_green)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and steps_data[key]:
					sheet11.write(row,col-1, ast.literal_eval(steps_data[key])['inactive_hours'], format_yellow)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and steps_data[key]:
					sheet11.write(row,col-1, ast.literal_eval(steps_data[key])['inactive_hours'], format_yellow)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and steps_data[key]:
					sheet11.write(row,col-1,ast.literal_eval(steps_data[key])['inactive_hours'], format_red_con)
			hours_list = ["12:00 AM to 12:59 AM","01:00 AM to 01:59 AM","02:00 AM to 02:59 AM",
			"03:00 AM to 03:59 AM", "04:00 AM to 04:59 AM","05:00 AM to 05:59 AM",
			"06:00 AM to 06:59 AM","07:00 AM to 07:59 AM","08:00 AM to 08:59 AM",
			"09:00 AM to 09:59 AM","10:00 AM to 10:59 AM","11:00 AM to 11:59 AM",
			"12:00 PM to 12:59 PM","01:00 PM to 01:59 PM","02:00 PM to 02:59 PM",
			"03:00 PM to 03:59 PM","04:00 PM to 04:59 PM","05:00 PM to 05:59 PM",
			"06:00 PM to 06:59 PM","07:00 PM to 07:59 PM","08:00 PM to 08:59 PM",
			"09:00 PM to 09:59 PM","10:00 PM to 10:59 PM","11:00 PM to 11:59 PM"]
			for x,key in enumerate(columns):
				steps_string = steps_data['movement_consistency']
				if steps_string:
					json1_data = json.loads(steps_string)
					sheet11.write(row,col+x,json1_data['total_steps'],format)
					for i,hour in enumerate(hours_list):
						if json1_data[hour]["status"] == "sleeping":
							sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_orange)
							if json1_data[hour]['steps'] >= 300:
								days_count[hour] += 1
						elif json1_data[hour]["status"] == "active":
							sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_green)
							if json1_data[hour]['steps'] >= 300:
								days_count[hour] += 1
						elif json1_data[hour]["status"] == "inactive":
							sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_red_con)
							if json1_data[hour]['steps'] >= 300:
								days_count[hour] += 1
						elif json1_data[hour]["status"] == "exercise":
							sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_exercise)
							if json1_data[hour]['steps'] >= 300:
								days_count[hour] += 1
						elif json1_data[hour]["status"] == "no data yet":
							sheet11.write(row,col+x+1+i,"No Data Yet",format_grey)
						elif json1_data[hour]["status"] == "time zone change":
							sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_cream)
						elif json1_data[hour]["status"] == "nap":
							sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_darkcyan)
						else:
							sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_purple)

					def format_active_prcnt(days_count,time_slot,total_days):
						if total_days:
							prcnt = round((days_count.get(time_slot,0) / total_days) * 100,2)
							return str(prcnt) + " %"
						return str(0)+" %"

					sheet11.write(row,col+x+25,json1_data['sleeping_hours'])
					sheet11.write(row,col+x+26,json1_data.get('nap_hours',0))
					sheet11.write(row,col+x+27,json1_data['active_hours'])
					sheet11.write(row,col+x+28,json1_data['inactive_hours'])
					sheet11.write(row,col+x+29,json1_data.get('strength_hours',0))
					sheet11.write(row,col+x+30,json1_data.get('exercise_hours',0))
					sheet11.write(row,col+x+31,json1_data.get('no_data_hours',0))
					sheet11.write(row,col+x+32,json1_data.get('timezone_change_hours',0))
					sheet11.write(5,2+1,str(round(((days_count["12:00 AM to 12:59 AM"]/total_days))*100,2))+" %",bold)
					# print(((days_count["12:00 AM to 12:59 AM"]/total_days))*100)
					sheet11.write(5,2+2,format_active_prcnt(days_count,'01:00 AM to 01:59 AM',total_days),bold)
					sheet11.write(5,2+3,str(round(((days_count["02:00 AM to 02:59 AM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+4,str(round(((days_count["03:00 AM to 03:59 AM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+5,str(round(((days_count["04:00 AM to 04:59 AM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+6,str(round(((days_count["05:00 AM to 05:59 AM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+7,str(round(((days_count["06:00 AM to 06:59 AM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+8,str(round(((days_count["07:00 AM to 07:59 AM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+9,str(round(((days_count["08:00 AM to 08:59 AM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+10,str(round(((days_count["09:00 AM to 09:59 AM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+11,str(round(((days_count["10:00 AM to 10:59 AM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+12,str(round(((days_count["11:00 AM to 11:59 AM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+13,str(round(((days_count["12:00 PM to 12:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+14,str(round(((days_count["01:00 PM to 01:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+15,str(round(((days_count["02:00 PM to 02:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+16,str(round(((days_count["03:00 PM to 03:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+17,str(round(((days_count["04:00 PM to 04:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+18,str(round(((days_count["05:00 PM to 05:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+19,str(round(((days_count["06:00 PM to 06:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+20,str(round(((days_count["07:00 PM to 07:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+21,str(round(((days_count["08:00 PM to 08:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+22,str(round(((days_count["09:00 PM to 09:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+23,str(round(((days_count["10:00 PM to 10:59 PM"]/total_days))*100,2))+" %",bold)
					sheet11.write(5,2+24,str(round(((days_count["11:00 PM to 11:59 PM"]/total_days))*100,2))+" %",bold)

		else:
			row += 1
			sheet11.write(row,col,'')
		current_date -= timedelta(days=1)

def export_users_xls(request):
	to_date1 = request.GET.get('to_date',None)
	from_date1 = request.GET.get('from_date', None)
	excel_type = request.GET.get('type')
	to_date = datetime.strptime(to_date1, "%m-%d-%Y").date()
	from_date = datetime.strptime(from_date1, "%m-%d-%Y").date()

	x= to_date.strftime('%m-%d-%y')
	y= x.split("-")
	z = str(int(y[0]))+'-'+str(int(y[1]))+'-'+str(int(y[2]))

	filename = '{}_raw_data_{}_to_{}.xlsx'.format(request.user.username,
		from_date.strftime('%b_%d_%Y'),to_date.strftime('%b_%d_%Y'))
	response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
	response['Content-Disposition'] = "attachment; filename={}".format(filename) 
	book = Workbook(response,{'in_memory': True})
	user_id = request.GET.get('user_id')
	same_user = False
	if not user_id:
		user_id = request.user
		same_user = True
	else:
		try:
			user_id = User.objects.get(id=int(user_id))
			if user_id == request.user:
				same_user = True
		except:
			logging.exception("message")

	if (excel_type == 'all_stats' or not excel_type) and (same_user): 
		sheet1 = book.add_worksheet('Grades')
		sheet10 = book.add_worksheet('Progress Analyzer')
		sheet2 = book.add_worksheet('Steps')
		sheet3 = book.add_worksheet('Sleep')
		sheet4 = book.add_worksheet('Food')
		sheet5 = book.add_worksheet('Alcohol')
		sheet6 = book.add_worksheet('Exercise Reporting')
		weekly_workout_sheet = book.add_worksheet('Weekly Workout Summary')
		hrr_sheet = book.add_worksheet('HRR')
		sheet7 = book.add_worksheet('Swim Stats')
		sheet8 = book.add_worksheet('Bike Stats')
		sheet9 = book.add_worksheet('All Stats')
		
		sheet1.set_column(1,1000,11)
		sheet2.set_column(1,1000,11)
		sheet3.set_column(1,1000,11)
		sheet4.set_column(1,1000,11)
		sheet5.set_column(1,1000,11)
		sheet6.set_column(1,1000,11)
		sheet7.set_column(1,1000,11)
		sheet8.set_column(1,1000,11)
		sheet9.set_column(1,1000,11)
		sheet10.set_column(2,1000,11)
		hrr_sheet.set_column(1,1000,11)
		weekly_workout_sheet.set_column(1,1000,11)
		sheet1.freeze_panes(1, 1)
		sheet1.set_column('A:A',40)
		sheet2.freeze_panes(1, 1)
		sheet2.set_column('A:A',35)
		sheet3.freeze_panes(1, 1)
		sheet3.set_column('A:A',35)
		sheet4.freeze_panes(1, 1)
		sheet4.set_column('A:A',40)
		sheet5.freeze_panes(1, 1)
		sheet5.set_column('A:A',35)
		sheet6.freeze_panes(1, 1)
		sheet6.set_column('A:A',35)
		sheet7.freeze_panes(1, 1)
		sheet7.set_column('A:A',35)
		sheet8.freeze_panes(1, 1)
		sheet8.set_column('A:A',35)
		sheet9.freeze_panes(1, 1)
		sheet9.set_column('A:A',35)
		sheet9.repeat_rows(0)
		sheet9.repeat_columns(0)
		sheet9.set_row(33, 150)
		sheet9.set_landscape()
		sheet9.set_row(0,30)
		hrr_sheet.freeze_panes(1, 1)
		hrr_sheet.set_column('A:A',40)

	bold = book.add_format({'bold': True})
	date_format = book.add_format({'num_format': 'm-d-yy'})
	current_date = to_date
	format_week = book.add_format()
	format_week.set_align('top')
	format_week.set_text_wrap()
	format_week.set_shrink()

	format_red = book.add_format({'align':'left', 'bg_color': 'red','num_format': '#,##0'})
	format_red_con = book.add_format({'align':'left', 'bg_color': 'red','num_format': '#,##0','font_color': 'white'})
	format_green = book.add_format({'align':'left', 'bg_color': 'green','num_format': '#,##0','font_color': 'white'})
	format_limegreen = book.add_format({'align':'left', 'bg_color': '#32CD32','num_format': '#,##0','font_color': 'black'})
	format_yellow = book.add_format({'align':'left', 'bg_color': 'yellow','num_format': '#,##0'})

	format_orange = book.add_format({'align':'left', 'bg_color': '#00B0EC','num_format': '#,##0'})
	format_orange_grades = book.add_format({'align':'left', 'bg_color': '#FF8C00','num_format': '#,##0'})
	format_purple = book.add_format({'align':'left', 'bg_color': 'pink','num_format': '#,##0','font_color': 'white'})
	format = book.add_format({'align':'left','num_format': '#,##0'})
	format1 = book.add_format({'align':'left','num_format': '0.00'})
	format_grey = book.add_format({'align':'left','bg_color': '#A5A7A5'})
	format_cream = book.add_format({'align':'left','bg_color': '#FEE9B9','num_format': '#,##0'})
	format_darkcyan = book.add_format({'align':'left','bg_color': '#007DA8','num_format': '#,##0','font_color': 'white'})
	format_exercise = book.add_format({'align':'left', 'bg_color': '#FD9A44','num_format': '#,##0'})
	format_exe = book.add_format({'align':'left','num_format': '0.0'})
	format_red_a = book.add_format({'align':'left', 'bg_color': 'red','num_format': '0.0'})
	format_green_a = book.add_format({'align':'left', 'bg_color': 'green','num_format': '0.0','font_color': 'white'})
	format_limegreen_a = book.add_format({'align':'left', 'bg_color': '#32CD32','num_format': '0.0','font_color': 'black'})
	format_yellow_a= book.add_format({'align':'left', 'bg_color': 'yellow','num_format': '0.0'})
	format_orange_a= book.add_format({'align':'left', 'bg_color': '#FF8C00','num_format': '0.0'})
	format_red_overall = book.add_format({'align':'left', 'bg_color': 'red','num_format': '0.00'})
	format_green_overall = book.add_format({'align':'left', 'bg_color': 'green','num_format': '0.00','font_color': 'white'})
	format_limegreen_overall = book.add_format({'align':'left', 'bg_color': '#32CD32','num_format': '0.00','font_color': 'black'})
	format_yellow_overall= book.add_format({'align':'left', 'bg_color': 'yellow','num_format': '0.00'})
	format_orange_overall= book.add_format({'align':'left', 'bg_color': '#FF8C00','num_format': '0.00'})
	format_green_hrr = book.add_format({'align':'left', 'bg_color': 'green','font_color': 'white'})
	format_points= book.add_format({'align':'left','num_format': '0.00'})

	if excel_type == 'all_stats' or not excel_type:
		mcs_excel(to_date,from_date,book,user_id,response,excel_type,
				bold,format_orange,format_green,format_red_con,format_purple,format_yellow,
				format_exercise,format_grey,format_cream,format_darkcyan,date_format,format)
	elif excel_type == 'only_mcs':
		mcs_excel(to_date,from_date,book,user_id,response,excel_type,
				bold,format_orange,format_green,format_red_con,format_purple,format_yellow,
				format_exercise,format_grey,format_cream,format_darkcyan,date_format,format)
		book.close()
		return response

	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			result = [current_date_string]
			sheet9.write_rich_string(0,r,weekday1,'\n',current_date_string,format_week)
			# sheet9.write(0, r, current_date,date_format)
			current_date -= timedelta(days = 1)

	# Grades
	columns = ['overall_health_grade','overall_health_gpa','movement_non_exercise_steps_grade','non_exercise_steps',
			   'movement_consistency_grade','movement_consistency','avg_sleep_per_night_grade','sleep_per_wearable','exercise_consistency_grade',
			   'did_workout','exercise_consistency_score','prcnt_unprocessed_food_consumed_grade','prcnt_non_processed_food','alcoholic_drink_per_week_grade','alcohol_week',
			   'sleep_aid_penalty','ctrl_subs_penalty','smoke_penalty','overall_gpa_without_penalties']
	columnsw = ['Overall Health Grade','Overall Health Gpa','Non Exercise Steps Grade','Non Exercise Steps',
			   'Movement Consistency Grade','Movement Consistency Score','Avg Sleep Per Night Grade','Average Sleep Per Night',
			   'Exercise Consistency Grade',"Did you Workout Today",'Exercise Consistency Score','Percentage of Unprocessed Food Consumed Grade',
			   'Percentage of Unprocessed Food Consumed','Alcohol Drinks Consumed Per Last 7 Days Grade','Alcohol Drinks Consumed Per Last 7 Days'
			   ,'Sleep Aid Penalty','Controlled Substance Penalty','Smoking Penalty','Overall Health Grade Before Penalties','Did You Report Your Inputs Today?']

	colunn_work = ['workout']
	grades_qs = Grades.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')
	grades_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in grades_qs}

	steps_qs = Steps.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	steps_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in steps_qs }
	sleep_qs = Sleep.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	sleep_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in sleep_qs }

	exercise_qs = ExerciseAndReporting.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	exercise_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in exercise_qs }

	food_qs = Food.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	food_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in food_qs }
	alcohol_qs = Alcohol.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	options_user = DailyUserInputOptional.objects.filter(
		user_input__created_at__range=(from_date, to_date),
		user_input__user = request.user).order_by('-user_input__created_at')

	options_datewise = {q.user_input.created_at.strftime("%Y-%m-%d"):q
		 for q in options_user }

	alcohol_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in alcohol_qs}
	options_user_input = DailyUserInputEncouraged.objects.filter(
		user_input__created_at__range=(from_date, to_date),
		user_input__user = request.user).order_by('-user_input__created_at')
	options_user_input_datewise = {q.user_input.created_at.strftime("%Y-%m-%d"):q
		 for q in options_user_input }


	user_input_strong = DailyUserInputStrong.objects.filter(
		user_input__created_at__range=(from_date, to_date),
		user_input__user = request.user).order_by('-user_input__created_at')
	user_input_strong_datewise = {q.user_input.created_at.strftime("%Y-%m-%d"):q
		 for q in user_input_strong }

	health_grade_cum = OverallHealthGradeCumulative.objects.filter(
		user_cum__created_at__range=(from_date, to_date),
		user_cum__user = request.user).order_by('-user_cum__created_at')
	health_grade_cum_datewise = {q.user_cum.created_at.strftime("%Y-%m-%d"):q
		 for q in health_grade_cum }

	hrr = Hrr.objects.filter(created_at__range=(from_date, to_date),
		user_hrr = request.user).order_by('-created_at')

	hrr_datewise = {q.created_at.strftime("%Y-%m-%d"):q
		 for q in hrr }

	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			# sheet2.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet9.write(0, 0, "All Stats(month-day-year)",bold)
	sheet9.write(1, 0, "Grades",bold)
	sheet9.write(2, 0, "OVERALL HEALTH GRADES",bold)
	col_num1 = 2
	row_num = 0
	for col_num in range(len(columnsw)):
		col_num1 = col_num1 + 1
		sheet9.write(col_num1, row_num, columnsw[col_num])

	current_date = to_date
	i = 0
	while (current_date >= from_date):
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		sleep_data = sleep_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		food_data = food_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		alcohol_data = alcohol_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		user_input_strong_data = user_input_strong_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		health_grade_cum = health_grade_cum_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		# print(health_grade_cum)
		if steps_data and grades_data and exercise_data and food_data and alcohol_data and sleep_data:
			if user_input_strong_data:
				user_input_strong_data = user_input_strong_data.__dict__
			steps_data = steps_data.__dict__
			grades_data = grades_data.__dict__
			sleep_data = sleep_data.__dict__
			exercise_data = exercise_data.__dict__
			alcohol_data = alcohol_data.__dict__
			food_data = food_data.__dict__
			# health_grade_cum = health_grade_cum.__dict__
			# logic
			# print(health_grade_cum)
			row_num += 1
			for i,key in enumerate(columns):
		
				if key != 'non_exercise_steps' and key != 'movement_consistency' and key != 'sleep_per_wearable' and key != 'prcnt_non_processed_food' and key != 'alcohol_week' and key != 'did_workout' and key != 'overall_gpa_without_penalties':
					if grades_data[key] == 'A':
						sheet9.write(i+3,row_num, grades_data[key],format_green)
					elif grades_data[key] == 'B':
						sheet9.write(i+3,row_num, grades_data[key],format_limegreen)
					elif grades_data[key] == 'C':
						sheet9.write(i+3,row_num, grades_data[key],format_yellow)
					elif grades_data[key] == 'D':
						sheet9.write(i+3,row_num, grades_data[key],format_orange_grades)
					elif grades_data[key] == 'F':
						sheet9.write(i+3,row_num, grades_data[key],format_red)
					elif grades_data[key] == 'N/A':
						sheet9.write(i+3,row_num, grades_data[key],format1)
					elif i == 10:
						sheet9.write(i+3,row_num, grades_data[key],format_exe)
					elif key == 'sleep_aid_penalty' or key == 'ctrl_subs_penalty' or key == 'smoke_penalty':
						if grades_data[key] == 0:
							sheet9.write(i+3,row_num, 'NO',format1)
						else:	
							sheet9.write(i+3,row_num, 'YES',format_red)
					elif i == 1:
						sheet9.write(i+3,row_num, grades_data[key],format1)
					elif grades_data[key] == '':
						sheet9.write(i+3,row_num,"Not Reported")

				elif key == '':
					sheet9.write(i+3,row_num, 'Not Reported',format1)
				elif i == 3:
					sheet9.write(i+3,row_num, steps_data[key],format)
				elif i == 5 and key == 'movement_consistency' and steps_data[key]:
					sheet9.write(i+3,row_num, ast.literal_eval(steps_data[key])['inactive_hours'],format)
				elif i == 7:
					if user_input_strong_data:
						avg_sleep = user_input_strong_data['sleep_time_excluding_awake_time']
						if avg_sleep and avg_sleep != ":":
							sheet9.write(i+3,row_num, user_input_strong_data['sleep_time_excluding_awake_time'],format1)
						else:
							sheet9.write(i+3,row_num, sleep_data[key],format1)
					else:
						sheet9.write(i+3,row_num, sleep_data[key],format1)
					# if user_input_strong_data:
					# 	print("exists")
					# else:
					# 	print("Does not exits")
				elif key == 'did_workout' and i == 9:
					if exercise_data[key]:
						sheet9.write(i+3, row_num, exercise_data[key],format)
						# if key == 19:
						# 	sheet9.write(i+3,row_num,"Yes")
						# else:
						# 	sheet9.write(i+3,row_num,"No",format_red)
					else:
						sheet9.write(i+3, row_num,"Not Reported",format)
				elif i == 12:
					if food_data[key] == '':
						
						sheet9.write(i+3,row_num, '')
					else:
						sheet9.write(i+3,row_num, str(int(food_data[key])) + '%')
				elif i == 14:
					sheet9.write(i+3,row_num, alcohol_data[key],format_exe)
				elif i == 18:
					grade_point = {"A":4,"B":3,"C":2,"D":1,"F":0,"":0,None:0}
					# overall_workout_gpa_cal = grades_data['overall_health_gpa']
					# sleep_aid_penalty_cal = grades_data['sleep_aid_penalty']
					# ctrl_subs_penalty_cal = grades_data['ctrl_subs_penalty']
					# smoke_penalty_cal = grades_data['smoke_penalty']
					# grades_steps = grades_data['movement_non_exercise_steps_grade']
					# grades_consistency = grades_data['movement_consistency_grade']
					# grades_sleep = grades_data['avg_sleep_per_night_grade']
					# grades_consistency_exe = grades_data['exercise_consistency_grade']
					# grades_food = grades_data['prcnt_unprocessed_food_consumed_grade']
					# grades_alcohol = grades_data['alcoholic_drink_per_week_grade']
					
					unprocessed_gpa = grades_data['prcnt_unprocessed_food_consumed_gpa'] if grades_data['prcnt_unprocessed_food_consumed_gpa'] else 0
					steps_gpa = grades_data['movement_non_exercise_steps_gpa'] if grades_data['movement_non_exercise_steps_gpa'] else 0
					alcoho_gpa = grades_data['alcoholic_drink_per_week_gpa'] if grades_data['alcoholic_drink_per_week_gpa'] else 0
					overall_workout_gpa_without_penalty = round((steps_gpa +
						grade_point[grades_data['movement_consistency_grade']] +
						grades_data['avg_sleep_per_night_gpa'] + abs(grades_data["sleep_aid_penalty"]) +
						grade_point[grades_data['exercise_consistency_grade']] +
						unprocessed_gpa +
						alcoho_gpa)/6,2)

					if overall_workout_gpa_without_penalty >= 3:
						sheet9.write(i+3,row_num,overall_workout_gpa_without_penalty,format_green_overall)
					elif overall_workout_gpa_without_penalty >= 1 and overall_workout_gpa_without_penalty < 3:
						sheet9.write(i+3,row_num,overall_workout_gpa_without_penalty,format_yellow_overall)
					elif overall_workout_gpa_without_penalty < 1:
						sheet9.write(i+3,row_num,overall_workout_gpa_without_penalty,format_red_overall)


					# overall_workout_gpa_without_penalty = overall_workout_gpa_cal+sleep_aid_penalty_cal+ctrl_subs_penalty_cal+smoke_penalty_cal
					# sheet9.write(i+3,row_num,overall_workout_gpa_without_penalty,format1)

				else:
					sheet9.write(i+3,row_num, 'Not Reported')
				# if key == 19:
				# 	sheet9.write(i+3,row_num,"Yes")
				# else:
				# 	sheet9.write(i+3,row_num,"No",format_red)
			for i,key in enumerate(colunn_work):
				if user_input_strong_data:
					sheet9.write(22,row_num,"Yes")
				else:
					sheet9.write(22,row_num,"No",format_red)


		else:
			row_num += 1
			sheet9.write(i+3,row_num, '')
		current_date -= timedelta(days=1)

	# columnsg2 = ['Resting Heart Rate','Stress Level','Did you Stand for 3 hours or more above and beyond your exercise yesterday?']
	# col = ['sleep_resting_hr_last_night','stress_level','stand_for_three_hours']
	# sheet1.write(21, 0, "NOT GRADED CATEGORIES",bold)
	# col_num2 = 21
	# num_10 = row_num
	# len_gra = len(rows_of_grades)
	# for col_num in range(len(columnsg2)):
	# 	 col_num2 = col_num2 + 1
	# 	 sheet1.write(col_num2,row_num - num_10, columnsg2[col_num])


	# current_date = to_date
	# while (current_date >= from_date):
	# 	options_data = options_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	if options_data and exercise_data:
	# 		options_data = options_data.__dict__
	# 		exercise_data = exercise_data.__dict__
	# 		# logic
	# 		row_num += 1
	# 		for i, key in enumerate(col):
	# 			if key == 'stand_for_three_hours':
	# 				sheet1.write(col_num2+i-2, row_num - num_10, options_data[key],format)
	# 			else:
	# 				sheet1.write(col_num2+i-2, row_num - num_10, exercise_data[key],format)
	# 	else:
	# 		# print("no data")
	# 		row_num += 1
	# 		sheet1.write(col_num2+i-2, row_num - num_10, '')
	# 	current_date -= timedelta(days=1)
	
	# sheet1.write(26, 0, "PERFORMANCE ASSESSMENT",bold)
	# columnsg3 = ['Overall Workout Grade ','Overall Workout Score (points)','Workout Duration Grade','Workout Duration'
	# ,'Workout Effort Level Grade','Workout Effort Level','Average Exercise Heart Rate Grade ','Average Exercise Heart Rate'
	# ,'Heart Rate Recovery (HRR) - time to 99','Heart Rate Recovery (HRR) - heart beats lowered in the first minute '
	# ,'VO2 Max','Floors Climbed ']
	# columnsg4 = ['overall_workout_grade','overall_workout_gpa','workout_duration_grade','workout_duration',
	# 'workout_effortlvl_grade','workout_effortlvl_gpa','avg_exercise_hr_grade','avg_exercise_hr_gpa','time_to_99',
	# 'lowest_hr_first_minute','vo2_max','floor_climed']
	# col_num2 = 26
	# len_gra1 = len(rows_of_grades) + len(exec1) 
	# num_1 = row_num
	# for col_num in range(len(columnsg3)):
	# 	 col_num2 = col_num2 + 1
	# 	 sheet1.write(col_num2,row_num - num_1, columnsg3[col_num])
	# l2 = 26
	# num_2 = row_num


	# current_date = to_date
	# while (current_date >= from_date):
	# 	options_user_data = options_user_input_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	if exercise_data and grades_data and steps_data:
	# 		if options_user_data:
	# 			options_user_data = options_user_data.__dict__
	# 		exercise_data = exercise_data.__dict__
	# 		grades_data = grades_data.__dict__
	# 		steps_data = steps_data.__dict__
	# 		# logic
	# 		row_num += 1
	# 		for i, key in enumerate(columnsg4):
	# 			if key != 'workout_duration' and key != 'floor_climed' and key != 'vo2_max' and key != 'lowest_hr_first_minute' and key != 'time_to_99':
	# 				if grades_data[key] == 'A':
	# 					sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format_green)
	# 				elif grades_data[key] == 'B':
	# 					sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format_green)
	# 				elif grades_data[key] == 'C':
	# 					sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format_yellow)
	# 				elif grades_data[key] == 'D':
	# 					sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format_yellow)
	# 				elif grades_data[key] == 'F':
	# 					sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format_red)
	# 				elif grades_data[key] == 'N/A':
	# 					sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format1)
	# 				elif grades_data[key] == '':
	# 					sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format1)
	# 				else:
	# 					sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format1)
	# 			elif key == 'workout_duration':
	# 				sheet1.write(l2+i+1, row_num-num_2, exercise_data[key],format)
	# 			elif key == 'floor_climed':
	# 				sheet1.write(l2+i+1, row_num-num_2, steps_data[key],format)
	# 			elif key == 'vo2_max':
	# 				sheet1.write(l2+i+1, row_num-num_2, exercise_data[key],format)
	# 			elif key == 'lowest_hr_first_minute':
	# 				if options_user_data:
	# 					sheet1.write(l2+i+1, row_num-num_2, options_user_data[key],format)
	# 				else:
	# 					sheet1.write(l2+i+1, row_num-num_2," ",format)
	# 			elif key == 'time_to_99':
	# 				if options_user_data:
	# 					sheet1.write(l2+i+1, row_num-num_2, options_user_data[key],format)
	# 				else:
	# 					sheet1.write(l2+i+1, row_num-num_2," ",format)
	# 			else:
	# 				sheet1.write(l2+i+1,row_num-num_2, 'YES',format_red)
	# 	else:
	# 		row_num += 1
	# 		sheet1.write(col_num2+i-2, row_num - num_2, '')
	# 	current_date -= timedelta(days=1)

	
	
	# Steps
	num_3 = row_num
	columns4 = ['movement_consistency','non_exercise_steps', 'exercise_steps', 'total_steps', 'floor_climed']
	columns4W = ['Movement Consistency','Non Exercise Steps', 'Exercise Steps', 'Total Steps', 'Floors Climed','Weight']
	col_weight = ['weight']
	sheet9.write(24, 0, "Steps",bold)
	col_num2 = 24
	# a = len(rows_of_grades)
	for col_num in range(len(columns4W)):
		 col_num2 = col_num2 + 1
		 sheet9.write(col_num2,row_num - num_3, columns4W[col_num])
	# i1 = 40
	# a = len(rows_of_grades)
	num_3 = row_num

	steps_qs = Steps.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	steps_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in steps_qs }


	current_date = to_date
	i1 = 24
	while (current_date >= from_date):
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		options_data = options_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if steps_data and grades_data:
			if options_data:
				options_data = options_data.__dict__
			steps_data = steps_data.__dict__
			grades_data = grades_data.__dict__
			# logic
			i1 = 24
			row_num += 1
			for i,key in enumerate(columns4):
				if i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'A':
					sheet9.write(i1+i+1,row_num - num_3, steps_data[key], format_green)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'B':
					sheet9.write(i1+i+1,row_num - num_3, steps_data[key], format_limegreen)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'C':
					sheet9.write(i1+i+1,row_num - num_3, steps_data[key], format_yellow)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'D':
					sheet9.write(i1+i+1,row_num - num_3, steps_data[key], format_orange_grades)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'F':
					sheet9.write(i1+i+1,row_num - num_3, steps_data[key], format_red)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and steps_data[key]:
					sheet9.write(i1+i+1,row_num - num_3, ast.literal_eval(steps_data[key])['inactive_hours'], format_green)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and steps_data[key]:
					sheet9.write(i1+i+1,row_num - num_3, ast.literal_eval(steps_data[key])['inactive_hours'], format_limegreen)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and steps_data[key]:
					sheet9.write(i1+i+1,row_num - num_3, ast.literal_eval(steps_data[key])['inactive_hours'], format_yellow)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and steps_data[key]:
					sheet9.write(i1+i+1,row_num - num_3, ast.literal_eval(steps_data[key])['inactive_hours'], format_orange_grades)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and steps_data[key]:
					sheet9.write(i1+i+1,row_num - num_3,ast.literal_eval(steps_data[key])['inactive_hours'], format_red)
				else:
					sheet9.write(i1+i+1,row_num - num_3, steps_data[key], format)
			for i,key in enumerate(col_weight):
				if options_data:
					sheet9.write(i1+i+6,row_num - num_3, options_data[key])
				else:
					sheet9.write(i1+i+6,row_num - num_3,"Not Measured")
		else:
			row_num += 1
			sheet9.write(i1+i+1,row_num - num_3, '')
		current_date -= timedelta(days=1)



	#Sleep

	columns5 = ['sleep_per_wearable','sleep_comments','sleep_aid','resting_hr_last_night','sleep_per_wearable', 'sleep_bed_time', 
	'sleep_awake_time','deep_sleep','light_sleep','awake_time','rem_sleep','heartrate_variability_stress']
	columns5W = ['Sleep Per User Input (excluding awake time)','Sleep Comments', 'Sleep Aid taken?', 
	'Resting Heart Rate (RHR)','Sleep per Wearable (excluding awake time)',
	'Sleep Bed Time', 'Sleep Awake Time','Deep Sleep','Light Sleep','Awake Time','REM Sleep','Garmin Stress Level']

	# exercise_qs = ExerciseAndReporting.objects.filter(
	# 	user_ql__created_at__range=(from_date, to_date),
	# 	user_ql__user = request.user).order_by('-user_ql__created_at')

	# exercise_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
	# 	 for q in exercise_qs }

	sheet9.write(31, 0, "Sleep",bold)
	col_num2 = 31
	num_4 = row_num
	# a = len(rows_of_grades) + len(rows3)
	for col_num in range(len(columns5W)):
		col_num2 = col_num2 + 1
		sheet9.write(col_num2, row_num - num_4 , columns5W[col_num])
	
	# rows4hr = ExerciseAndReporting.objects.filter(
	# 	user_ql__created_at__range=(from_date, to_date),
	# 	user_ql__user = request.user).order_by('-user_ql__created_at').values()
	# i1 = 47
	format2 = book.add_format()
	format2.set_align('top')
	format2.set_text_wrap()
	format2.set_shrink()
	
	current_date = to_date
		
	while (current_date >= from_date):
		sleep_data = sleep_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		user_input_strong_data = user_input_strong_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if sleep_data and exercise_data and grades_data:
			if user_input_strong_data:
				user_input_strong_data = user_input_strong_data.__dict__
			sleep_data = sleep_data.__dict__
			grades_data = grades_data.__dict__
			exercise_data = exercise_data.__dict__
			# logic
			i1 = 31
			row_num += 1
			# for i, key in enumerate(columns5):
			# 	if user_input_strong_data:
			# 		if i == 0 and grades_data['avg_sleep_per_night_grade'] == 'A':
			# 			sheet9.write(i1 + i + 1, row_num - num_4, user_input_strong_data['sleep_time_excluding_awake_time'], format_green)
			# 		elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'B':
			# 			sheet9.write(i1 + i + 1, row_num - num_4, user_input_strong_data['sleep_time_excluding_awake_time'], format_green)
			# 		elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'C':
			# 			sheet9.write(i1 + i + 1, row_num - num_4, user_input_strong_data['sleep_time_excluding_awake_time'], format_yellow)
			# 		elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'D':
			# 			sheet9.write(i1 + i + 1, row_num - num_4, user_input_strong_data['sleep_time_excluding_awake_time'], format_yellow)
			# 		elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'F':
			# 			sheet9.write(i1 + i + 1, row_num - num_4, user_input_strong_data['sleep_time_excluding_awake_time'], format_red)
			# 	elif i == 1:
			# 		sheet9.write(i1 + i + 1, row_num - num_4, sleep_data[key], format2)
			# 	elif i == 3:
			# 		if exercise_data[key] >= 76:
			# 			sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_red)
			# 		if exercise_data[key] >= 63 and exercise_data[key] <= 75:
			# 			sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_yellow)
			# 		if exercise_data[key] > 30 and exercise_data[key] <= 62:
			# 			sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_green)
			# 		if exercise_data[key] <= 30:
			# 			sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_red)
			# 	elif i != 0:
			# 		sheet9.write(i1 + i + 1, row_num - num_4, sleep_data[key], format)
			for i, key in enumerate(columns5):
				if user_input_strong_data:
					
					if i == 0 and grades_data['avg_sleep_per_night_grade'] == 'A':
						sheet9.write(i1 + i + 1, row_num - num_4, user_input_strong_data['sleep_time_excluding_awake_time'], format_green)
					elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'B':
						sheet9.write(i1 + i + 1, row_num - num_4, user_input_strong_data['sleep_time_excluding_awake_time'], format_limegreen)
					elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'C':
						sheet9.write(i1 + i + 1, row_num - num_4, user_input_strong_data['sleep_time_excluding_awake_time'], format_yellow)
					elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'D':
						sheet9.write(i1 + i + 1, row_num - num_4,user_input_strong_data['sleep_time_excluding_awake_time'], format_orange_grades)
					elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'F':
						sheet9.write(i1 + i + 1, row_num - num_4,user_input_strong_data['sleep_time_excluding_awake_time'], format_red)
					elif i == 3:
						if exercise_data[key] >= 76:
							sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_red)
						if exercise_data[key] >= 63 and exercise_data[key] <= 75:
							sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_yellow)
						if exercise_data[key] > 30 and exercise_data[key] <= 62:
							sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_green)
						if exercise_data[key] <= 30:
							sheet9.write(i + 2, row_num, exercise_data[key], format_red)
				elif i == 1:
					sheet9.write(i1 + i + 1, row_num - num_4, sleep_data[key], format2)
				
				elif i == 3:
					if exercise_data[key] >= 76:
						sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_red)
					if exercise_data[key] >= 63 and exercise_data[key] <= 75:
						sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_yellow)
					if exercise_data[key] > 30 and exercise_data[key] <= 62:
						sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_green)
					if exercise_data[key] <= 30:
						sheet9.write(i1 + i + 1, row_num - num_4, exercise_data[key], format_red)

				if i == 11 and key == 'heartrate_variability_stress':
					if exercise_data.get(key) == 0:
						sheet9.write(i1 + i + 1, row_num - num_4, '', format)
					else:
						sheet9.write(i1 + i + 1, row_num - num_4, exercise_data.get(key),format)
					
				if i != 0 and i != 3 and i != 11:
					sheet9.write(i1 + i + 1, row_num - num_4, sleep_data.get(key), format)


		else:
			row_num += 1
			sheet9.write(i1+i+1,row_num - num_4, '')
		current_date -= timedelta(days=1)
	#Food
	num_5 = row_num
	columns6 = ['prcnt_non_processed_food','processed_food','non_processed_food', 'diet_type']
	columns6W = ['% of Unprocessed Food','Processed Food Consumed', 'Non Processed Food', 'Diet Type']
	sheet9.write(44, 0, "Food",bold)
	col_num2 = 44
	# a = len(rows_of_grades) + len(rows3) + len(rows4)
	for col_num in range(len(columns6W)):
		col_num2 = col_num2 + 1
		sheet9.write(col_num2, row_num - num_5, columns6W[col_num])

	# food_qs = Food.objects.filter(
	# 	user_ql__created_at__range=(from_date, to_date),
	# 	user_ql__user = request.user).order_by('-user_ql__created_at')

	# food_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
	# 	 for q in food_qs }


	current_date = to_date
	while (current_date >= from_date):
		food_data = food_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if food_data and grades_data:
			food_data = food_data.__dict__
			grades_data = grades_data.__dict__
			# logic
			i1 = 44
			row_num += 1
			for i, key in enumerate(columns6):
				if grades_data['prcnt_unprocessed_food_consumed_grade'] == 'A' and i == 0:
					sheet9.write(i1 + i + 1, row_num - num_5,str(int(food_data[key])) + '%' ,format_green)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'B' and i == 0:
					sheet9.write(i1 + i + 1, row_num - num_5, str(int(food_data[key])) + '%' ,format_limegreen)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'C' and i == 0:
					sheet9.write(i1 + i + 1, row_num - num_5,str(int(food_data[key])) + '%' ,format_yellow)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'D' and i == 0:
					sheet9.write(i1 + i + 1, row_num - num_5, str(int(food_data[key])) + '%' ,format_orange_grades)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'F' and i == 0:
					sheet9.write(i1 + i + 1, row_num - num_5,str(int(food_data[key])) + '%' ,format_red)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == '':
					sheet9.write(i1 + i + 1, row_num - num_5,'',)
				else:
					sheet9.write(i1 + i + 1, row_num - num_5, food_data[key], format)
		else:
	
			row_num += 1
			sheet9.write(i1+i+1,row_num - num_5, '')
		current_date -= timedelta(days=1)


	#Alcohol
	num_6 = row_num
	columns7 = ['alcohol_day', 'alcohol_week']
	columns7W = ['# of Alcohol Drinks Consumed Yesterday', '# of Alcohol Drinks Consumed over last  7 Days']
	sheet9.write(49, 0, "Alcohol",bold)
	col_num2 = 49
	# a = len(rows_of_grades) + len(rows3) + len(rows4) + len(rows5)
	for col_num in range(len(columns7W)):
		   col_num2 = col_num2 + 1
		   sheet9.write(col_num2, row_num - num_6, columns7W[col_num])

	# alcohol_qs = Alcohol.objects.filter(
	# 	user_ql__created_at__range=(from_date, to_date),
	# 	user_ql__user = request.user).order_by('-user_ql__created_at')

	# grades_qs = Grades.objects.filter(
	# 	user_ql__created_at__range=(from_date, to_date),
	# 	user_ql__user = request.user).order_by('-user_ql__created_at')

	alcohol_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in alcohol_qs}	
	grades_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in grades_qs}	

	current_date = to_date
	while (current_date >= from_date):
		alcohol_data = alcohol_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if alcohol_data and grades_data:
			alcohol_data = alcohol_data.__dict__
			grades_data = grades_data.__dict__
			# logic
			i1 = 49
			row_num += 1
			for i, key in enumerate(columns7):
				if i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'A':
					sheet9.write(i1 + i + 1, row_num - num_6, alcohol_data[key], format_green)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'B':
					sheet9.write(i1 + i + 1, row_num - num_6, alcohol_data[key], format_limegreen)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'C':
					sheet9.write(i1 + i + 1, row_num - num_6, alcohol_data[key], format_yellow)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'D':
					sheet9.write(i1 + i + 1, row_num - num_6, alcohol_data[key], format_orange_grades)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'F':
					sheet9.write(i1 + i + 1, row_num - num_6, alcohol_data[key], format_red)
				else:
					sheet9.write(i1 + i + 1, row_num - num_6, alcohol_data[key],format)
		else:
			
			row_num += 1
			sheet9.write(i1+i+1,row_num - num_6, '')
		current_date -= timedelta(days=1)

	# Exercise Reporting

	columns_of_exercise = ["workout_easy_hard","workout_type","workout_time", "workout_location","workout_duration","maximum_elevation_workout","minutes_walked_before_workout",
	"distance_run","distance_bike","distance_swim","distance_other","pace","avg_heartrate","avg_heartrate","avg_heartrate","avg_heartrate",'avg_exercise_heartrate',
	"elevation_gain","elevation_loss","effort_level","dew_point","temperature","humidity",
	"temperature_feels_like","wind","hrr_time_to_99","hrr_starting_point","hrr_beats_lowered_first_minute","resting_hr_last_night","vo2_max","running_cadence",
	"nose_breath_prcnt_workout","water_consumed_workout","chia_seeds_consumed_workout","fast_before_workout","pain","pain_area","stress_level","sick","drug_consumed",
	"drug","medication","smoke_substance","exercise_fifteen_more","workout_elapsed_time","timewatch_paused_workout","exercise_consistency",
	"heartrate_variability_stress","fitness_age","workout_comment"]
	columns8w = ['Workout Easy Hard','Workout Type', 'Workout Time','Workout Location','Workout Duration (hh:mm:ss)','Maximum Elevation Workout','Minutes Walked Before Workout','Distance (In Miles) - Run', 
	'Distance (in Miles) - Bike', 'Distance (in yards) - Swim', 'Distance (in Miles) - Other','Pace (minutes:seconds) (Running)','Average Heartrate RUNNING','Average Heartrate ELLIPTICAL','Average Heartrate WALKING','Average Heartrate OTHER','Overall Average Exercise Heart Rate','Elevation Gain(feet)','Elevation Loss(feet)', 
	'Effort Level','Dew Point (in °F)','Temperature (in °F)','Humidity (in %)',  'Temperature Feels Like (in °F)', 'Wind (in miles per hour)','HRR - Time to 99 (mm:ss)','HRR Start Point',  'HRR Beats Lowered','Sleep Resting Hr Last Night',
	'Vo2 Max','Running Cadence','Percent Breath through Nose During Workout','Water Consumed during Workout','Chia Seeds consumed during Workout','Fast Before Workout', 'Pain','Pain Area','Stress Level','Sick ', 'Drug Consumed',
	'Drug','Medication','Smoke Substance', 'Exercise Fifteen More','Workout Elapsed Time','TimeWatch Paused Workout','Exercise Consistency','Heart Rate Variability Stress (Garmin)','Fitness Age','Workout Comment']
	
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			# sheet9.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	num_11 = row_num
	sheet9.write(53, 0, "Exercise Reporting",bold)
	col_num1 = 53
	for col_num in range(len(columns8w)):
		col_num1 = col_num1 + 1
		sheet9.write(col_num1, row_num-num_11, columns8w[col_num])
	i1 = 53
	current_date = to_date
	while (current_date >= from_date):
		# logic
		data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if data:
			data = data.__dict__
			row_num += 1
			# for i,key in enumerate(columns_of_exercise):
			# 	if data[key] == None:
			# 		sheet9.write(i1+i+1,row_num - num_11,'Not Reported',format)
			# 	else:
			# 		sheet9.write(i1+i+1,row_num - num_11, data[key],format)
			for i,key in enumerate(columns_of_exercise):
				avg_heart_rate_string = data['avg_heartrate']
				json2_data = json.loads(avg_heart_rate_string)
				
				if i == 12:
					if 'RUNNING' in json2_data:
						sheet9.write(i1+i+1,row_num - num_11,json2_data['RUNNING'],format)
					else:
						sheet9.write(i1+i+1,row_num - num_11,"",format)
				elif i == 13:
					if 'ELLIPTICAL' in json2_data:
						sheet9.write(i1+i+1,row_num - num_11,json2_data['ELLIPTICAL'],format)
					else:
						sheet9.write(i1+i+1,row_num - num_11,"",format)
				elif i == 14:
					if 'WALKING' in json2_data:
						sheet9.write(i1+i+1,row_num - num_11,json2_data['WALKING'],format)
					else:
						sheet9.write(i1+i+1,row_num - num_11,"",format)
				elif i == 15:
					if 'OTHER' in json2_data:
						sheet9.write(i1+i+1,row_num - num_11,json2_data['OTHER'],format)
					else:
						sheet9.write(i1+i+1,row_num - num_11,"",format)			
				elif i == 4:
					if data[key] == "0:00:00":
						sheet9.write(i1+i+1,row_num - num_11,'No Workout')
					else:
						sheet9.write(i1+i+1,row_num - num_11,data[key])
				elif i == 19:
					if data[key] == 0:
						sheet9.write(i1+i+1,row_num - num_11,'No Workout')
					else:
						sheet9.write(i1+i+1,row_num - num_11,data[key])
				elif i == 29:
					if data[key] == 0:
						sheet9.write(i1+i+1,row_num - num_11,'Not provided')
					else:
						sheet9.write(i1+i+1,row_num - num_11,data[key])
				elif i == 25:
					if json2_data:
						if data[key] == '':
							sheet9.write(i1+i+1,row_num - num_11,'Not Recorded')
						else:
							sheet9.write(i1+i+1,row_num - num_11,data[key])
					else:
						sheet9.write(i1+i+1,row_num - num_11,'No Workout')
				elif i == 26:
					if json2_data:
						if data[key] == 0:
							sheet9.write(i1+i+1,row_num - num_11,'Not Recorded')
						else:
							sheet9.write(i1+i+1,row_num - num_11,data[key])
					else:
						sheet9.write(i1+i+1,row_num - num_11,'No Workout')
				elif i == 27:
					if json2_data:
						if data[key] == 0:
							sheet9.write(i1+i+1,row_num - num_11,'Not Recorded')
						else:
							sheet9.write(i1+i+1,row_num - num_11,data[key])
					else:
						sheet9.write(i1+i+1,row_num - num_11,'No Workout')


				elif data[key] == None:
					sheet9.write(i1+i+1,row_num - num_11,'Not Reported')
				elif key != 'avg_heartrate':
					sheet9.write(i1+i+1,row_num - num_11,data[key],format)
		else:
			row_num += 1
			sheet9.write(i1+i+1,row_num - num_11, '')
		current_date -= timedelta(days=1)


	# Swim status
	num_7 = row_num
	columns1 = ['pace_per_100_yard','total_strokes']

	columns1W = ['Pace Per 100 Yard','Total Strokes']
	sheet9.write(103, 0, "Swim Stats",bold)
	col_num2 = 103
	# a = len(rows_of_grades) + len(rows3) + len(rows4) + len(rows5) + len(rows6)
	for col_num1 in range(len(columns1W)):
			col_num2 = col_num2 + 1
			sheet9.write(col_num2 , row_num - num_7  , columns1W[col_num1],format)
	swim_qs = SwimStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	swim_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in swim_qs }

	current_date = to_date
	for row in swim_qs.values():
		
		while (current_date >= from_date):
			data = swim_datewise.get(current_date.strftime("%Y-%m-%d"),None)
			if data:
				# logic
				i1 = 103
				row_num += 1
				for i,key in enumerate(columns1):
					sheet9.write(i1+i+1,row_num - num_7, row[key],format)
			else:
				row_num += 1
				sheet9.write(i1+i+1,row_num - num_7, '')
			current_date -= timedelta(days=1)

	# Bike
	num_8 = row_num
	columns3 = ['avg_speed', 'avg_power','avg_speed_per_mile','avg_cadence']
	columns3W = ['Avg Speed (MPH) Bike', 'Avg Power Bike','Avg_Speed Per Mile','Avg Cadence Bike']
	sheet9.write(107, 0, "Bike Stats",bold)
	col_num2 = 107
	# a = len(rows_of_grades) + len(rows3) + len(rows4) + len(rows5) + len(rows6) + len(rows1)
	for col_num in range(len(columns3W)):
		col_num2 = col_num2 + 1
		sheet9.write(col_num2, row_num - num_8, columns3W[col_num],format)

	bike_qs = BikeStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	bike_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in bike_qs }

		
	current_date = to_date
	for row in bike_qs.values():

		while (current_date >= from_date):
			# logic
			data = bike_datewise.get(current_date.strftime("%Y-%m-%d"),None)
			if data:
				i1 = 107
			# for row in bike_qs.values():
				row_num += 1
				for i,key in enumerate(columns3):
					sheet9.write(i1+i+1,row_num - num_8, row[key],format)
			else:
				row_num += 1
				sheet9.write(i1+i+1,row_num - num_8, '')
			current_date -= timedelta(days=1)

	#Grades sheet
	sheet1.repeat_rows(0)
	sheet1.repeat_columns(0)
	sheet1.set_landscape()
	format2 = book.add_format()
	format2.set_align('top')
	format2.set_text_wrap()
	format2.set_shrink()
	sheet1.set_row(0, 30)
	# columns = ['overall_health_grade','overall_health_gpa','movement_non_exercise_steps_grade','non_exercise_steps',
	# 		   'movement_consistency_grade','movement_consistency','avg_sleep_per_night_grade','sleep_per_wearable','exercise_consistency_grade',
	# 		   'workout','exercise_consistency_score','prcnt_unprocessed_food_consumed_grade','prcnt_non_processed_food','alcoholic_drink_per_week_grade','alcohol_week',
	# 		   'sleep_aid_penalty','ctrl_subs_penalty','smoke_penalty']
	# columnsw = ['Overall Health Grade','Overall Health Gpa','Non Exercise Steps Grade','Non Exercise Steps',
	# 		   'Movement Consistency Grade','Movement Consistency Score','Avg Sleep Per Night Grade','Average Sleep Per Night',
	# 		   'Exercise Consistency Grade','Did you Workout Today','Exercise Consistency Score','Percentage of Unprocessed Food Consumed Grade',
	# 		   'Percentage of Unprocessed Food Consumed','Alcohol Drinks Consumed Per Last 7 Days Grade','Alcohol Drinks Consumed Per Last 7 Days'
	# 		   ,'Sleep Aid Penalty','Controlled Substance Penalty','Smoking Penalty']

	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			result = [current_date_string]
			sheet1.write_rich_string(0,r,weekday1,'\n',current_date_string,format_week)
			# sheet1.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	
	last_sycn_obj = UserLastSynced.objects.filter(user = request.user)
	if last_sycn_obj:
		last_sycn = [tmp.last_synced for tmp in last_sycn_obj]
		last_sycn_offset = [tmp.offset for tmp in last_sycn_obj]
		import time
		unixtime = time.mktime(last_sycn[0].timetuple())
		local_time = unixtime + last_sycn_offset[0]
		value_last_sycn = datetime.fromtimestamp(local_time).strftime('%b %d,%Y @ %I:%M %p')
		matter = 'Wearable Device Last Synced on'
		sheet1.write_rich_string(0,0,matter,'\n',value_last_sycn)
	sheet1.write(1, 0, "Grades",bold)
	sheet1.write(2, 0, "OVERALL HEALTH GRADES",bold)
	col_num1 = 2
	row_num = 0
	for col_num in range(len(columnsw)):
		col_num1 = col_num1 + 1
		sheet1.write(col_num1, row_num, columnsw[col_num])
	sheet1.write(col_num1+2, row_num, "Points",bold)
	sheet1.write(col_num1+3, row_num, "Non Exercise Steps Points")
	sheet1.write(col_num1+4, row_num, "Movement Consistency Points")
	sheet1.write(col_num1+5, row_num, "Avg Sleep Per Night Points")
	sheet1.write(col_num1+6, row_num, "Exercise Consistency Points")
	sheet1.write(col_num1+7, row_num, "% of Unprocessed Food Consumed Points")
	sheet1.write(col_num1+8, row_num, "Alcohol Drinks Consumed Per Last 7 Days Points")
	sheet1.write(col_num1+9, row_num, "Sleep Aid Penalty Points")
	sheet1.write(col_num1+10, row_num, "Controlled Substance Penalty Points")
	sheet1.write(col_num1+11, row_num, "Smoking Penalty Points")
	sheet1.write(col_num1+12, row_num, "Total Points")

	current_date = to_date
	i = 0
	while (current_date >= from_date):
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		sleep_data = sleep_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		food_data = food_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		alcohol_data = alcohol_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		user_input_strong_data = user_input_strong_datewise.get(current_date.strftime("%Y-%m-%d"),None)

		if steps_data and grades_data and exercise_data and food_data and alcohol_data and sleep_data:
			if user_input_strong_data:
				user_input_strong_data = user_input_strong_data.__dict__
			steps_data = steps_data.__dict__
			grades_data = grades_data.__dict__
			sleep_data = sleep_data.__dict__
			exercise_data = exercise_data.__dict__
			alcohol_data = alcohol_data.__dict__
			food_data = food_data.__dict__
			# logic
			grade_point = {"A":4,"B":3,"C":2,"D":1,"F":0,"":0,None:0}
			row_num += 1
			for i,key in enumerate(columns):
			
				if key != 'non_exercise_steps' and key != 'movement_consistency' and key != 'sleep_per_wearable' and key != 'prcnt_non_processed_food' and key != 'alcohol_week' and key != 'did_workout' and key != 'overall_gpa_without_penalties':
					if grades_data[key] == 'A':
						sheet1.write(i+3,row_num, grades_data[key],format_green)
					elif grades_data[key] == 'B':
						sheet1.write(i+3,row_num, grades_data[key],format_limegreen)
					elif grades_data[key] == 'C':
						sheet1.write(i+3,row_num, grades_data[key],format_yellow)
					elif grades_data[key] == 'D':
						sheet1.write(i+3,row_num, grades_data[key],format_orange_grades)
					elif grades_data[key] == 'F':
						sheet1.write(i+3,row_num, grades_data[key],format_red)
					elif grades_data[key] == 'N/A':
						sheet1.write(i+3,row_num, grades_data[key],format1)
					elif i == 10:
						sheet1.write(i+3,row_num, grades_data[key],format_exe)
					elif key == 'sleep_aid_penalty' or key == 'ctrl_subs_penalty' or key == 'smoke_penalty':
						if grades_data[key] == 0:
							sheet1.write(i+3,row_num, 'NO',format1)
						else:	
							sheet1.write(i+3,row_num, 'YES',format_red)
					elif i == 1:
						sheet1.write(i+3,row_num, grades_data[key],format1)
					else:
						sheet1.write(i+3,row_num, 'Not Reported',format1)
				elif i == 3:
					sheet1.write(i+3,row_num, steps_data[key],format)
				elif i == 5 and key == 'movement_consistency' and steps_data[key]:
					sheet1.write(i+3,row_num, ast.literal_eval(steps_data[key])['inactive_hours'],format)
				elif i == 7:
					if user_input_strong_data:
						avg_sleep = user_input_strong_data['sleep_time_excluding_awake_time']
						if avg_sleep and avg_sleep != ":":
							sheet1.write(i+3,row_num, user_input_strong_data['sleep_time_excluding_awake_time'],format1)
						else:
							sheet1.write(i+3,row_num, sleep_data[key],format1)
					else:
						sheet1.write(i+3,row_num, sleep_data[key],format1)
				elif key == 'did_workout':
					if exercise_data[key]:
						sheet1.write(i+3, row_num, exercise_data[key],format)
					else:
						sheet1.write(i+3, row_num,"Not Reported",format)
				elif i == 12:
					if food_data[key] == '':
						
						sheet1.write(i+3,row_num, '')
					else:
						sheet1.write(i+3,row_num, str(int(food_data[key])) + '%')
				elif i == 14:
					sheet1.write(i+3,row_num, alcohol_data[key],format_exe)
				elif i == 18:
					# grade_point = {"A":4,"B":3,"C":2,"D":1,"F":0,"":0,None:0}
					# overall_workout_gpa_cal = grades_data['overall_health_gpa']
					# sleep_aid_penalty_cal = grades_data['sleep_aid_penalty']
					# ctrl_subs_penalty_cal = grades_data['ctrl_subs_penalty']
					# smoke_penalty_cal = grades_data['smoke_penalty']
					# grades_steps = grades_data['movement_non_exercise_steps_grade']
					# grades_consistency = grades_data['movement_consistency_grade']
					# grades_sleep = grades_data['avg_sleep_per_night_grade']
					# grades_consistency_exe = grades_data['exercise_consistency_grade']
					# grades_food = grades_data['prcnt_unprocessed_food_consumed_grade']
					# grades_alcohol = grades_data['alcoholic_drink_per_week_grade']
					unprocessed_gpa = grades_data['prcnt_unprocessed_food_consumed_gpa'] if grades_data['prcnt_unprocessed_food_consumed_gpa'] else 0
					steps_gpa = grades_data['movement_non_exercise_steps_gpa'] if grades_data['movement_non_exercise_steps_gpa'] else 0

					overall_workout_gpa_without_penalty = round((steps_gpa +
						grade_point[grades_data['movement_consistency_grade']] +
						grades_data['avg_sleep_per_night_gpa'] + abs(grades_data["sleep_aid_penalty"]) +
						grade_point[grades_data['exercise_consistency_grade']] +
						unprocessed_gpa +
						grade_point[grades_data['alcoholic_drink_per_week_grade']])/6,2)
					if overall_workout_gpa_without_penalty >= 3:
						sheet1.write(i+3,row_num,overall_workout_gpa_without_penalty,format_green_overall)
					elif overall_workout_gpa_without_penalty >= 1 and overall_workout_gpa_without_penalty < 3:
						sheet1.write(i+3,row_num,overall_workout_gpa_without_penalty,format_yellow_overall)
					elif overall_workout_gpa_without_penalty < 1:
						sheet1.write(i+3,row_num,overall_workout_gpa_without_penalty,format_red_overall)
					# overall_workout_gpa_without_penalty = overall_workout_gpa_cal+sleep_aid_penalty_cal+ctrl_subs_penalty_cal+smoke_penalty_cal
					# sheet1.write(i+3,row_num,overall_workout_gpa_without_penalty,format1)
				else:
					sheet1.write(i+3,row_num,'Not Reported')

				
				steps_gpa = grades_data['movement_non_exercise_steps_gpa'] if grades_data['movement_non_exercise_steps_gpa'] else 0
				# if grades_data['movement_non_exercise_steps_gpa'] = None:
				# 	alcohol_points = 0
				# else:
				# 	alcohol_points = grades_data['movement_non_exercise_steps_gpa']

				alcohol_points = grades_data['alcoholic_drink_per_week_gpa'] if grades_data['alcoholic_drink_per_week_gpa'] else 0
				food_points = grades_data['prcnt_unprocessed_food_consumed_gpa'] if grades_data['prcnt_unprocessed_food_consumed_gpa'] else 0
				mc_points = grade_point[grades_data['movement_consistency_grade']]
				ec_points = grade_point[grades_data['exercise_consistency_grade']]
				sleep_points = grades_data['avg_sleep_per_night_gpa']
				sp_points = grades_data['sleep_aid_penalty']
				cs_points = grades_data['ctrl_subs_penalty']
				smoke_points = grades_data['smoke_penalty']
				
				if sleep_points:
					sleep_points += abs(sp_points)
				#ec_points = grades_data['exercise_consistency_score']
				#food_points = grades_data['prcnt_unprocessed_food_consumed_gpa']
				#alcohol_points = grades_data['alcoholic_drink_per_week_gpa']
				#print(current_date,steps_gpa,mc_points,sleep_points,ec_points,food_points,alcohol_points,sp_points,cs_points,smoke_points)

				total_points = steps_gpa+mc_points+sleep_points+ec_points+food_points+alcohol_points+sp_points+cs_points+smoke_points

				#print(current_date,steps_gpa,mc_points,sleep_points,ec_points,food_points,alcohol_points,sp_points,cs_points,smoke_points)
				sheet1.write(25,row_num,steps_gpa,format_points)
				sheet1.write(26,row_num,mc_points,format_points)
				sheet1.write(27,row_num,sleep_points,format_points)
				sheet1.write(28,row_num,ec_points,format_points)
				sheet1.write(29,row_num,food_points,format_points)
				sheet1.write(30,row_num,alcohol_points,format_points)
				sheet1.write(31,row_num,grades_data['sleep_aid_penalty'],format_points)
				sheet1.write(32,row_num,grades_data['ctrl_subs_penalty'],format_points)
				sheet1.write(33,row_num,grades_data['smoke_penalty'],format_points)
				sheet1.write(34,row_num,total_points,format_points)
			for i,key in enumerate(colunn_work):
				if user_input_strong_data:
					sheet1.write(22,row_num,"Yes")
				else:
					sheet1.write(22,row_num,"No",format_red)

		else:
			row_num += 1
			sheet1.write(i+3,row_num, '')
		current_date -= timedelta(days=1)

	# columnsg2 = ['Resting Heart Rate','Stress Level','Did you Stand for 3 hours or more above and beyond your exercise yesterday?']
	# col = ['sleep_resting_hr_last_night','stress_level','stand_for_three_hours']
	# sheet2.write(21, 0, "NOT GRADED CATEGORIES",bold)
	# col_num2 = 21
	# num_10 = row_num
	# len_gra = len(rows_of_grades)
	# for col_num in range(len(columnsg2)):
	# 	 col_num2 = col_num2 + 1
	# 	 sheet2.write(col_num2,row_num - num_10, columnsg2[col_num])

	# current_date = to_date
	# while (current_date >= from_date):
	# 	options_data = options_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	if options_data and exercise_data:
	# 		options_data = options_data.__dict__
	# 		exercise_data = exercise_data.__dict__
	# 		# logic
	# 		row_num += 1
	# 		for i, key in enumerate(col):
	# 			if key == 'stand_for_three_hours':
	# 				sheet2.write(col_num2+i-2, row_num - num_10, options_data[key],format)
	# 			else:
	# 				sheet2.write(col_num2+i-2, row_num - num_10, exercise_data[key],format)
	# 	else:
	
	# 		row_num += 1
	# 		sheet2.write(col_num2+i-2, row_num - num_10, '')
	# 	current_date -= timedelta(days=1)
	
	# sheet2.write(26, 0, "PERFORMANCE ASSESSMENT",bold)
	# columnsg3 = ['Overall Workout Grade ','Overall Workout Score (points)','Workout Duration Grade','Workout Duration'
	# ,'Workout Effort Level Grade','Workout Effort Level','Average Exercise Heart Rate Grade ','Average Exercise Heart Rate'
	# ,'Heart Rate Recovery (HRR) - time to 99','Heart Rate Recovery (HRR) - heart beats lowered in the first minute '
	# ,'VO2 Max','Floors Climbed ']
	# columnsg4 = ['overall_workout_grade','overall_workout_gpa','workout_duration_grade','workout_duration',
	# 'workout_effortlvl_grade','workout_effortlvl_gpa','avg_exercise_hr_grade','avg_exercise_hr_gpa','time_to_99',
	# 'lowest_hr_first_minute','vo2_max','floor_climed']
	# col_num2 = 26
	# len_gra1 = len(rows_of_grades) + len(exec1) 
	# num_1 = row_num
	# for col_num in range(len(columnsg3)):
	# 	 col_num2 = col_num2 + 1
	# 	 sheet2.write(col_num2,row_num - num_1, columnsg3[col_num])
	# l2 = 26
	# num_2 = row_num

	# current_date = to_date
	# while (current_date >= from_date):
	# 	options_user_data = options_user_input_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	if options_user_data and exercise_data and grades_data and steps_data:
	# 		options_user_data = options_user_data.__dict__
	# 		exercise_data = exercise_data.__dict__
	# 		grades_data = grades_data.__dict__
	# 		steps_data = steps_data.__dict__
	# 		# logic
		
	# 		row_num += 1
	# 		for i, key in enumerate(columnsg4):
	# 			if key != 'workout_duration' and key != 'floor_climed' and key != 'vo2_max' and key != 'lowest_hr_first_minute' and key != 'time_to_99':
	# 				if grades_data[key] == 'A':
	# 					sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format_green)
	# 				elif grades_data[key] == 'B':
	# 					sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format_green)
	# 				elif grades_data[key] == 'C':
	# 					sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format_yellow)
	# 				elif grades_data[key] == 'D':
	# 					sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format_yellow)
	# 				elif grades_data[key] == 'F':
	# 					sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format_red)
	# 				elif grades_data[key] == 'N/A':
	# 					sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format1)
	# 				elif grades_data[key] == '':
	# 					sheet2.write(l2+i+1,row_num-num_2, '',format1)
	# 				else:
	# 					sheet2.write(l2+i+1,row_num-num_2,grades_data[key] ,format1)

	# 			elif key == 'workout_duration':
	# 				sheet2.write(l2+i+1, row_num-num_2, exercise_data[key],format)
	# 			elif key == 'floor_climed':
	# 				sheet2.write(l2+i+1, row_num-num_2, steps_data[key],format)
	# 			elif key == 'vo2_max':
	# 				sheet2.write(l2+i+1, row_num-num_2, exercise_data[key],format)
	# 			elif key == 'lowest_hr_first_minute':
	# 				sheet2.write(l2+i+1, row_num-num_2, options_user_data[key],format)
	# 			elif key == 'time_to_99':
	# 				sheet2.write(l2+i+1, row_num-num_2, options_user_data[key],format)
	# 			else:
	# 				sheet2.write(l2+i+1,row_num-num_2, 'YES',format_red)
	# 	else:

	# 		row_num += 1
	# 		sheet2.write(col_num2+i-2, row_num - num_10, '')
	# 	current_date -= timedelta(days=1)



	#Swim Stats sheet
	sheet7.set_landscape()
	sheet7.repeat_rows(0)
	sheet7.repeat_columns(0)
	sheet7.set_row(0,30)
	columns = ['pace_per_100_yard', 'total_strokes']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			sheet7.write_rich_string(0,r,weekday1,'\n',current_date_string,format_week)
			# sheet7.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet7.write(0, 0, "Swim Stats",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns1W)):
		col_num1 = col_num1 + 1
		sheet7.write(col_num1, row_num, columns1W[col_num])



	current_date = to_date
	for row in swim_qs.values():
		
		while (current_date >= from_date):
			data = swim_datewise.get(current_date.strftime("%Y-%m-%d"),None)
			if data:
				# logic
				row_num += 1
				for i,key in enumerate(columns):
					sheet7.write(i + 2, row_num, row[key],format)
			else:
				row_num += 1
				sheet7.write(i + 2, row_num, '')
			current_date -= timedelta(days=1)
	# Bike stats sheet
	sheet8.set_landscape()
	sheet8.repeat_rows(0)
	sheet8.repeat_columns(0)
	sheet8.set_row(0,30)
	columns = ['avg_speed', 'avg_power','avg_speed_per_mile','avg_cadence']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			sheet8.write_rich_string(0,r,weekday1,'\n',current_date_string,format_week)
			# sheet8.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet8.write(0, 0, "Bike Stats",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns3W)):
		col_num1 = col_num1 + 1
		sheet8.write(col_num1, row_num, columns3W[col_num])

	
	current_date = to_date
	for row in bike_qs.values():

		while (current_date >= from_date):
			# logic
			data = bike_datewise.get(current_date.strftime("%Y-%m-%d"),None)
			if data:
				row_num += 1
				for i,key in enumerate(columns):
					sheet8.write(i + 2, row_num, row[key],format)
			else:
				row_num += 1
				sheet8.write(i + 2, row_num, '')
			current_date -= timedelta(days=1)

	# steps stats sheet
	sheet2.set_landscape()
	sheet2.repeat_rows(0)
	sheet2.repeat_columns(0)
	sheet2.set_row(0,30)
	columns = ['movement_consistency','non_exercise_steps', 'exercise_steps', 'total_steps', 'floor_climed']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			sheet2.write_rich_string(0,r,weekday1,'\n',current_date_string,format_week)
			
			# sheet2.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet2.write(0, 0, "Steps",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns4W)):
		col_num1 = col_num1 + 1
		sheet2.write(col_num1, row_num, columns4W[col_num])



	current_date = to_date

	while (current_date >= from_date):
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		options_data = options_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if steps_data and grades_data:
			if options_data:
				options_data = options_data.__dict__
			steps_data = steps_data.__dict__
			grades_data = grades_data.__dict__
			# logic

			row_num += 1
			for i,key in enumerate(columns4):
				if i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'A':
					sheet2.write(i + 2, row_num, steps_data[key], format_green)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'B':
					sheet2.write(i + 2, row_num,steps_data[key], format_limegreen)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'C':
					sheet2.write(i + 2, row_num, steps_data[key], format_yellow)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'D':
					sheet2.write(i + 2, row_num, steps_data[key], format_orange_grades)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'F':
					sheet2.write(i + 2, row_num, steps_data[key], format_red)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and steps_data[key]:
					sheet2.write(i + 2, row_num, ast.literal_eval(steps_data[key])['inactive_hours'], format_green)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and steps_data[key]:
					sheet2.write(i + 2, row_num, ast.literal_eval(steps_data[key])['inactive_hours'],format_limegreen)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and steps_data[key]:
					sheet2.write(i + 2, row_num, ast.literal_eval(steps_data[key])['inactive_hours'], format_yellow)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and steps_data[key]:
					sheet2.write(i + 2, row_num, ast.literal_eval(steps_data[key])['inactive_hours'], format_orange_grades)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and steps_data[key]:
					sheet2.write(i + 2, row_num,ast.literal_eval(steps_data[key])['inactive_hours'], format_red)
				else:
					sheet2.write(i + 2, row_num, steps_data[key], format)
			for i,key in enumerate(col_weight):
				if options_data:
					sheet2.write(i + 7, row_num, options_data[key])
				else:
					sheet2.write(i + 7, row_num,"Not Measured")
		else:
			row_num += 1
			sheet2.write(i + 2, row_num,'')
		current_date -= timedelta(days=1)

	# sleep stats sheet
	sheet3.set_landscape()
	sheet3.repeat_rows(0)
	sheet3.repeat_columns(0)
	sheet3.set_row(0,30)
	columns = ['sleep_per_user_input','sleep_comments',  'sleep_aid','sleep_per_wearable', 'sleep_bed_time', 'sleep_awake_time',
			   'deep_sleep','light_sleep','awake_time','rem_sleep','heartrate_variability_stress']

	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			sheet3.write_rich_string(0,r,weekday1,'\n',current_date_string,format_week)
			# sheet3.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet3.write(0, 0, "Sleep",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns5W)):
		col_num1 = col_num1 + 1
		sheet3.write(col_num1, row_num, columns5W[col_num])

	format2 = book.add_format()
	format2.set_align('top')
	format2.set_text_wrap()

	format2.set_shrink()
	# wrap = book.add_format({'text_wrap': True})
	sheet3.set_row(3, 150)
	

	current_date = to_date
		
	while (current_date >= from_date):
		sleep_data = sleep_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		user_input_strong_data = user_input_strong_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if sleep_data and exercise_data and grades_data:
			if user_input_strong_data:
				user_input_strong_data = user_input_strong_data.__dict__
			sleep_data = sleep_data.__dict__
			grades_data = grades_data.__dict__
			exercise_data = exercise_data.__dict__
			# logic
			row_num += 1
			for i, key in enumerate(columns5):
				if user_input_strong_data:
					
					if i == 0 and grades_data['avg_sleep_per_night_grade'] == 'A':
						sheet3.write(i + 2, row_num, user_input_strong_data['sleep_time_excluding_awake_time'], format_green)
					elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'B':
						sheet3.write(i + 2, row_num, user_input_strong_data['sleep_time_excluding_awake_time'], format_limegreen)
					elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'C':
						sheet3.write(i + 2, row_num, user_input_strong_data['sleep_time_excluding_awake_time'], format_yellow)
					elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'D':
						sheet3.write(i + 2, row_num,user_input_strong_data['sleep_time_excluding_awake_time'], format_orange_grades)
					elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'F':
						sheet3.write(i + 2, row_num,user_input_strong_data['sleep_time_excluding_awake_time'], format_red)
					elif i == 3:
						if exercise_data[key] >= 76:
							sheet3.write(i + 2, row_num, exercise_data[key], format_red)
						if exercise_data[key] >= 63 and exercise_data[key] <= 75:
							sheet3.write(i + 2, row_num, exercise_data[key], format_yellow)
						if exercise_data[key] > 30 and exercise_data[key] <= 62:
							sheet3.write(i + 2, row_num, exercise_data[key], format_green)
						if exercise_data[key] <= 30:
							sheet3.write(i + 2, row_num, exercise_data[key], format_red)
				elif i == 1:
					sheet3.write(i + 2, row_num,sleep_data[key], format2)
				
				elif i == 3:
					if exercise_data[key] >= 76:
						sheet3.write(i + 2, row_num, exercise_data[key], format_red)
					if exercise_data[key] >= 63 and exercise_data[key] <= 75:
						sheet3.write(i + 2, row_num, exercise_data[key], format_yellow)
					if exercise_data[key] > 30 and exercise_data[key] <= 62:
						sheet3.write(i + 2, row_num, exercise_data[key], format_green)
					if exercise_data[key] <= 30:
						sheet3.write(i + 2, row_num, exercise_data[key], format_red)

				if i == 11 and key == 'heartrate_variability_stress':
					if exercise_data.get(key) == -1:
						sheet3.write(i + 2, row_num, exercise_data.get(key), format)
					elif exercise_data.get(key) == 0:
						sheet3.write(i + 2, row_num, '', format)
					else:
						sheet3.write(i + 2, row_num, exercise_data.get(key), format)
					
				
				if i != 0 and i != 3 and i != 11:
					sheet3.write(i + 2, row_num, sleep_data.get(key), format)
		else:
			row_num += 1
			sheet3.write(i + 2, row_num, '')
		current_date -= timedelta(days=1)
	# Food sheet
	sheet4.set_landscape()
	sheet4.repeat_rows(0)
	sheet4.repeat_columns(0)
	sheet4.set_row(0,30)
	columns = ['prcnt_non_processed_food','processed_food','non_processed_food', 'diet_type']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			sheet4.write_rich_string(0,r,weekday1,'\n',current_date_string,format_week)
			# sheet4.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet4.write(0, 0, "Food",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns6W)):
		col_num1 = col_num1 + 1
		sheet4.write(col_num1, row_num, columns6W[col_num])

	format2 = book.add_format()
	format2.set_align('fill')

	current_date = to_date
	while (current_date >= from_date):
		food_data = food_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if food_data and grades_data:
			food_data = food_data.__dict__
			grades_data = grades_data.__dict__
			# logic
			row_num += 1
			for i, key in enumerate(columns):
				if grades_data['prcnt_unprocessed_food_consumed_grade'] == 'A' and i == 0:
					sheet4.write(i + 2, row_num,str(int(food_data[key])) + '%' ,format_green)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'B' and i == 0:
					sheet4.write(i + 2, row_num, str(int(food_data[key])) + '%' ,format_limegreen)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'C' and i == 0:
					sheet4.write(i + 2, row_num,str(int(food_data[key])) + '%' ,format_yellow)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'D' and i == 0:
					sheet4.write(i + 2, row_num,str(int(food_data[key])) + '%' ,format_orange_grades)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'F' and i == 0:
					sheet4.write(i + 2, row_num,str(int(food_data[key])) + '%' ,format_red)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == '':
					sheet4.write(i + 2, row_num,'Not Reported',)
				else:
					sheet4.write(i + 2, row_num, food_data[key], format)
		else:
			
			row_num += 1
			sheet4.write(i + 2, row_num, '')
		current_date -= timedelta(days=1)
	# Alcohol sheet
	sheet5.set_landscape()
	sheet5.repeat_rows(0)
	sheet5.repeat_columns(0)
	sheet5.set_row(0,30)
	columns = ['alcohol_day', 'alcohol_week']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			sheet5.write_rich_string(0,r,weekday1,'\n',current_date_string,format_week)
			# sheet5.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet5.write(0, 0, "Alcohol",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns7W)):
		col_num1 = col_num1 + 1
		sheet5.write(col_num1, row_num, columns7W[col_num])
	current_date = to_date
	while (current_date >= from_date):
		alcohol_data = alcohol_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if alcohol_data and grades_data:
			alcohol_data = alcohol_data.__dict__
			grades_data = grades_data.__dict__
			# logic
			row_num += 1
			for i, key in enumerate(columns):
				# float_val = map
				# x = float(alcohol_data[key])
				if i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'A':
					sheet5.write(i + 2, row_num, alcohol_data[key], format_green_a)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'B':
					sheet5.write(i + 2, row_num, alcohol_data[key], format_limegreen_a)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'C':
					sheet5.write(i + 2, row_num, alcohol_data[key], format_yellow_a)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'D':
					sheet5.write(i + 2, row_num, alcohol_data[key], format_orange_a)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'F':
					sheet5.write(i + 2, row_num, alcohol_data[key], format_red_a)
				else:
					if alcohol_data[key] == '':
						sheet5.write(i + 2, row_num, 'Not Reported',format_exe)
					elif alcohol_data[key] == '20+':
						sheet5.write(i + 2, row_num, '20+')
					else:
						sheet5.write(i + 2, row_num, float(str(alcohol_data[key])),format_exe)
		else:
		
			row_num += 1
			sheet5.write(i + 2, row_num, '')
		current_date -= timedelta(days=1)


	#exercise reporting
	sheet6.set_landscape()
	sheet6.repeat_rows(0)
	sheet6.repeat_columns(0)
	sheet6.set_row(0,30)
	columns = ["workout_easy_hard","workout_type","workout_time", "workout_location","workout_duration","maximum_elevation_workout","minutes_walked_before_workout",
	"distance_run","distance_bike","distance_swim","distance_other","pace"]

	columns_1 = ["avg_exercise_heartrate","elevation_gain","elevation_loss","effort_level","dew_point","temperature","humidity",
	"temperature_feels_like","wind","hrr_time_to_99","hrr_starting_point","lowest_hr_during_hrr","hrr_beats_lowered_first_minute","resting_hr_last_night","vo2_max","running_cadence",
	"nose_breath_prcnt_workout","water_consumed_workout","chia_seeds_consumed_workout","fast_before_workout","pain","pain_area","stress_level","sick","drug_consumed",
	"drug","medication","smoke_substance","exercise_fifteen_more","workout_elapsed_time","timewatch_paused_workout","exercise_consistency",
	"heartrate_variability_stress","fitness_age","workout_comment"]
	
	columns8w = ['Workout Easy Hard','Workout Type', 'Workout Time','Workout Location','Workout Duration (hh:mm:ss)',
	'Maximum Elevation Workout','Minutes Walked Before Workout','Distance (In Miles) - Run', 'Distance (in Miles) - Bike', 
	'Distance (in yards) - Swim', 'Distance (in Miles) - Other','Pace (minutes:seconds) (Running)']

	rem_columns = ['Overall Average Exercise Heart Rate','Elevation Gain(feet)','Elevation Loss(feet)','Effort Level','Dew Point (in °F)','Temperature (in °F)',
	'Humidity (in %)',  'Temperature Feels Like (in °F)', 'Wind (in miles per hour)','HRR - Time to 99 (mm:ss)','HRR Start Point',"HRR (lowest heart rate point) in 1st min",
	'HRR Beats Lowered','Sleep Resting Hr Last Night','Vo2 Max','Running Cadence','Percent Breath through Nose During Workout',
	'Water Consumed during Workout','Chia Seeds consumed during Workout','Fast Before Workout', 'Pain','Pain Area','Stress Level','Sick ',
	'Drug Consumed','Drug','Medication','Smoke Substance', 'Exercise Fifteen More','Workout Elapsed Time','TimeWatch Paused Workout',
	'Exercise Consistency','Heart Rate Variability Stress (Garmin)','Fitness Age','Workout Comment']


	Avg_Heart = ['avg_heartrate']
	
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			sheet6.write_rich_string(0,r,weekday1,'\n',current_date_string,format_week)
			current_date -= timedelta(days=1)
	sheet6.write(0, 0, "Exercise Reporting",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns8w)):
		col_num1 = col_num1 + 1
		sheet6.write(col_num1, row_num, columns8w[col_num])
	current_date = to_date
	Activities_list = []
	while (current_date >= from_date):
		data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if data:
			data = data.__dict__
			for i,key in enumerate(Avg_Heart):
				avg_heart_rate_string = data[key]
				json2_data = json.loads(avg_heart_rate_string)
				Activities_key = list(json2_data.keys())
				Activities_list.extend(Activities_key)
		current_date -= timedelta(days=1)
	
	Activities_list_unique = list(set(Activities_list))
	len_activity = len(Activities_list_unique)
	
	for col_num in range(len(Activities_list_unique)):
		col_num1 = col_num1 + 1
		sheet6.write(col_num1, row_num,"Average Heartrate"+' '+Activities_list_unique[col_num])

	
	current_date = to_date
	while (current_date >= from_date):
		data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if data:
			data = data.__dict__
			row_num += 1
			for i,key in enumerate(columns):
				if i == 4:
					if data[key] == "0:00:00":
						sheet6.write(i + 2, row_num,'No Workout')
					else:
						sheet6.write(i + 2, row_num,data[key])
				else:
					sheet6.write(i + 2, row_num,data[key],format)
		else:
			row_num += 1
			sheet6.write(i + 2, row_num, '')
		current_date -= timedelta(days=1)
	
	
	row_avg_heart = i+1
	column_no = row_num
	current_date = to_date
	while (current_date >= from_date):
		data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if data:
			data = data.__dict__
			avg_heart_rate_string = data['avg_heartrate']
			json2_data = json.loads(avg_heart_rate_string)
			row_num += 1
			for k,key in enumerate(Activities_list_unique):

				if json2_data:
					try:
						sheet6.write(row_avg_heart+2+k,row_num - column_no,json2_data[key],format)
					except KeyError:
						sheet6.write(row_avg_heart+2+k,row_num - column_no,' ')
				else:
					sheet6.write(row_avg_heart+2+k,row_num - column_no,' ')
		else:
			row_num += 1
			sheet6.write(i + 2, row_num, '')
		current_date -= timedelta(days=1)

	no_days = (to_date-from_date).days

	for col_num in range(len(rem_columns)):
		col_num1 = col_num1 + 1
		sheet6.write(col_num1, row_num - column_no - no_days -1, rem_columns[col_num])


	current_date = to_date
	# if data:
	rem_row = i+len_activity-1
	# else:
	# 	rem_row = i
	while (current_date >= from_date):
		# logic
		data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if data:
			data = data.__dict__
			avg_heart_rate_string = data['avg_heartrate']
			json2_data = json.loads(avg_heart_rate_string)
			row_num += 1
			for j,key in enumerate(columns_1):
				
				if j == 0:
					if data[key] == 0:
						sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,' ')
					else:
						sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,data[key],format)
				elif j == 3:
					if data[key] == 0:
						sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'No Workout')
					else:
						sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,data[key],format)
				elif j == 14:
					if data[key] == 0:
						sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'Not provided')
					else:
						sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,data[key])
				elif j == 9:
					if json2_data:
						if data[key] == '' or data[key] == ':':
							sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'Not Recorded')
						else:
							sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,data[key],format)
					else:
						sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'No Workout')
				elif j == 10:
					if json2_data:
						if data[key] == 0:
							sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'Not Recorded')
						else:
							sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,data[key],format)
					else:
						sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'No Workout')
				elif j == 11:
					if json2_data:
						if data[key] == 0:
							sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'Not Recorded')
						else:
							sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,data[key],format)
					else:
						sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'No Workout')
				elif j == 12:
					if json2_data:
						if data[key] == 0:
							sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'Not Recorded')
						else:
							sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,data[key],format)
					else:
						sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'No Workout')

				elif data[key] == None:
					sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,'Not provided')
				else:
					sheet6.write(rem_row+4+j, row_num - column_no - no_days - 1,data[key],format)


		else:
			row_num += 1
			sheet6.write(rem_row+4+i, row_num - column_no - no_days - 1,'')
		current_date -= timedelta(days=1)
	
	#HRR
	hrr_sheet.set_landscape()
	hrr_sheet.repeat_rows(0)
	hrr_sheet.repeat_columns(0)
	hrr_sheet.set_row(0,30)

	date_formats = ('hh:mm:ss AM/PM')
	timestamp_todata = book.add_format({'num_format': date_formats,'align': 'left'})
	hrr_available = ["Did you create an activity file to measure your HRR after today’s aerobic workout?",
	"Did your heart rate go down to 99 beats per minute or lower?",
	"Duration (mm:ss) for Heart Rate Time to Reach 99","HRR File Starting Heart Rate",
	"Lowest Heart Rate Level in the 1st Minute",
	"Number of heart beats recovered in the first minute",
	"End Time of Activity(hh:mm:ss)","Difference Between Activity End time and Hrr Start time(mm:ss)",
	"Hrr Start Time(hh:mm:ss)","Heart Rate End Time Activity",
	"Heart rate beats your heart rate went down/(up) from end of workout file to start of HRR file",
	"Pure 1 Minute HRR Beats Lowered","Pure 1 Minute time to 99"]

	hrr_not_available = ["End Time of Activity(hh:mm:ss)",
	"Did you measure your heart rate recovery (HRR) after today’s aerobic workout?",
	"Did your heart rate go down to 99 beats per minute or lower?",
	"Duration (mm:ss) for Heart Rate Time to Reach 99",
	"Time Heart Rate Reached 99 (hh:mm:ss)",
	"HRR File Starting Heart Rate","Lowest Heart Rate Level in the 1st Minute",
	"Number of heart beats recovered in the first minute"]

	hrr_available_keys = ["Did_you_measure_HRR","Did_heartrate_reach_99","time_99","HRR_start_beat","lowest_hrr_1min",
	"No_beats_recovered","end_time_activity","diff_actity_hrr","HRR_activity_start_time",
	"end_heartrate_activity","heart_rate_down_up","pure_1min_heart_beats","pure_time_99"]

	hrr_not_available_keys = ["end_time_activity","Did_you_measure_HRR","no_fitfile_hrr_reach_99",
	"no_fitfile_hrr_time_reach_99","time_heart_rate_reached_99","end_heartrate_activity",
	"lowest_hrr_no_fitfile","no_file_beats_recovered"]

	hrr_all_fields = ["Did you create an activity file to measure your HRR after today’s aerobic workout?",
	"Did your heart rate go down to 99 beats per minute or lower?",
	"Duration (mm:ss) for Heart Rate Time to Reach 99","HRR File Starting Heart Rate",
	"Lowest Heart Rate Level in the 1st Minute",
	"Number of heart beats recovered in the first minute",
	"End Time of Activity(hh:mm:ss)","Difference Between Activity End time and Hrr Start time(mm:ss)",
	"Hrr Start Time(hh:mm:ss)","Heart Rate End Time Activity",
	"Heart rate beats your heart rate went down/(up) from end of workout file to start of HRR file",
	"Pure 1 Minute HRR Beats Lowered","Pure 1 Minute time to 99",
	"Duration (mm:ss) for Heart Rate Time to Reach 99",
	"Time Heart Rate Reached 99 (hh:mm:ss)",
	"HRR File Starting Heart Rate","Lowest Heart Rate Level in the 1st Minute",
	"Number of heart beats recovered in the first minute"]

	hrr_all_keys = ["Did_you_measure_HRR","Did_heartrate_reach_99","time_99","HRR_start_beat",
	"lowest_hrr_1min","No_beats_recovered","end_time_activity","diff_actity_hrr",
	"HRR_activity_start_time","end_heartrate_activity","heart_rate_down_up","pure_1min_heart_beats",
	"pure_time_99","no_fitfile_hrr_time_reach_99","time_heart_rate_reached_99","end_heartrate_activity",
	"lowest_hrr_no_fitfile","no_file_beats_recovered"]


	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			hrr_sheet.write_rich_string(0,r,weekday1,'\n',current_date_string,format_week)
			current_date -= timedelta(days=1)
	hrr_sheet.write(0,0,"Heart Rate Recovery (HRR)",bold) #(row,column,matter to be shown,styling)

	user_age = request.user.profile.age()
	aerobic_value = 180-user_age+4+10

	len_hrr = len(hrr_datewise)
	hrr_recorded = 0
	hrr_not_recorded = 0
	current_date = to_date
	while (current_date >= from_date):
		data = hrr_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if data:
			data = data.__dict__
			count = 0
			if (data.get("Did_you_measure_HRR",None)) == 'yes':
				hrr_recorded = hrr_recorded + 1
			elif ((data.get("Did_you_measure_HRR",None)) == 'no' or 
			(data.get("Did_you_measure_HRR",None)) == 'Heart Rate Data Not Provided'):
				hrr_not_recorded = hrr_not_recorded + 1
		else:
			pass
		current_date -= timedelta(days=1)
	# print(len_hrr,hrr_recorded,hrr_not_recorded)
	if len_hrr == hrr_recorded and len_hrr != 0:
		hrr_sheet.set_row(2,30)
		wrapped_text_colour = book.add_format({'text_wrap': 1, 'valign': 'top',"align":'left','bg_color': '#D3D3D3'})
		wrapped_text = book.add_format({'text_wrap': 1, 'valign': 'top'})
		hrr_sheet.set_row(3,30)
		hrr_sheet.set_row(4,30)
		hrr_sheet.set_row(7,30)
		hrr_sheet.set_row(9,30)
		hrr_sheet.set_row(12,30)
		# gray_colour = book.add_format({'bg_color': '#C0C0C0','text_wrap': 1, 'valign': 'top',})
		# hrr_sheet.set_row(3, cell_format=wrapped_text)
		# hrr_sheet.set_text_wrap()
		col_num1 = 1
		row_num = 0
		for col_num in range(len(hrr_available)):
			col_num1 = col_num1 + 1

			if (col_num1%2) == 0:
				hrr_sheet.write(col_num1, row_num, hrr_available[col_num],wrapped_text)
			else:
				hrr_sheet.write(col_num1, row_num, hrr_available[col_num],wrapped_text_colour)
		current_date = to_date
		while (current_date >= from_date):
			data = hrr_datewise.get(current_date.strftime("%Y-%m-%d"),None)
			if data:
				data = data.__dict__
				row_num += 1
				for i,key in enumerate(hrr_available_keys):
					end_heartrate_activity = data['end_heartrate_activity']
					if (i%2) == 0:
						if key == 'end_time_activity' or key == 'HRR_activity_start_time':
							offset = data['offset']
							value = datetime.fromtimestamp(data[key]+offset)
							hrr_sheet.write(i + 2, row_num,value,timestamp_todata)
						elif key == 'time_99' or key == 'diff_actity_hrr' or key == 'pure_time_99': 
							if data[key]:
								time = data[key]
								minutes = time // 60
								sec = time % 60
								if sec >= 10:
									hrr_time = str(int(minutes)),':',str(int(sec))
									hrr_time_99 = ''.join(hrr_time)
								else:
									hrr_time = str(int(minutes)),':','0',str(int(sec))
									hrr_time_99 = ''.join(hrr_time)
								if key == 'time_99' or key == 'pure_time_99':
									if end_heartrate_activity < aerobic_value:
										if data[key] <= 120: # Green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
										elif data[key] < 180 and data[key] > 121: # light green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
										elif data[key] < 480 and data[key] > 181: # yellow
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
										elif data[key] < 600 and data[key] > 481: # orange
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
										elif data[key] > 601: # red
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
										
									elif end_heartrate_activity > aerobic_value and end_heartrate_activity < aerobic_value + 15:
										if data[key] <= 240: # Green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
										elif data[key] < 360 and data[key] > 241: # light green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
										elif data[key] < 600 and data[key] > 361: # yellow
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
										elif data[key] < 720 and data[key] > 601: # orange
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
										elif data[key] > 721: # red
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
									elif end_heartrate_activity > aerobic_value + 15:
										if data[key] <= 360: # Green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
										elif data[key] < 480 and data[key] > 361: # light green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
										elif data[key] < 720 and data[key] > 481: # yellow
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
										elif data[key] < 1800 and data[key] > 721: # orange
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
										elif data[key] > 1801: # red
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
								elif key == 'diff_actity_hrr':
									if sec >= 10:
										hrr_sheet.write_rich_string(i + 2, row_num,str(int(minutes)),':',str(int(sec)),wrapped_text_colour)
									else:
										hrr_sheet.write_rich_string(i + 2, row_num,str(int(minutes)),':','0',str(int(sec)),wrapped_text_colour)
						elif key == "Did_you_measure_HRR" or key == "Did_heartrate_reach_99":
							if key == "Did_you_measure_HRR":
								hrr_sheet.write(i + 2, row_num,"Yes")
							elif data["Did_heartrate_reach_99"] == "yes":
								hrr_sheet.write(i + 2, row_num,"Yes")
							else:
								hrr_sheet.write(i + 2, row_num,"No")
						elif key == "No_beats_recovered" or key == "pure_1min_heart_beats":
							if data[key] >= 20.0:
								hrr_sheet.write(i + 2, row_num,data[key],format_green)
							elif data[key] > 19.0 and data[key] <= 12.0:
								hrr_sheet.write(i + 2, row_num,data[key],format_yellow)
							elif data[key] < 12.0:
								hrr_sheet.write(i + 2, row_num,data[key],format_red)
						else:
							hrr_sheet.write(i + 2, row_num,data[key],format)
					else:
						if key == 'end_time_activity' or key == 'HRR_activity_start_time':
							offset = data['offset']
							value = datetime.fromtimestamp(data[key]+offset)
							hrr_sheet.write(i + 2, row_num,value,timestamp_todata)
						elif key == 'time_99' or key == 'diff_actity_hrr' or key == 'pure_time_99': 
							if data[key]:
								time = data[key]
								minutes = time // 60
								sec = time % 60
								if sec >= 10:
									hrr_sheet.write_rich_string(i + 2, row_num,str(int(minutes)),':',str(int(sec)),wrapped_text_colour)
								else:
									hrr_sheet.write_rich_string(i + 2, row_num,str(int(minutes)),':','0',str(int(sec)),wrapped_text_colour)
						elif key == "Did_you_measure_HRR" or key == "Did_heartrate_reach_99":
							if key == "Did_you_measure_HRR":
								hrr_sheet.write(i + 2, row_num,"Yes",wrapped_text_colour)
							elif data["Did_heartrate_reach_99"] == "yes":
								hrr_sheet.write(i + 2, row_num,"Yes",wrapped_text_colour)
							else:
								hrr_sheet.write(i + 2, row_num,"No",wrapped_text_colour)
						elif key == "No_beats_recovered" or key == "pure_1min_heart_beats":
							if data[key] >= 20.0:
								hrr_sheet.write(i + 2, row_num,data[key],format_green)
							elif data[key] > 19.0 and data[key] <= 12.0:
								hrr_sheet.write(i + 2, row_num,data[key],format_yellow)
							elif data[key] < 12.0:
								hrr_sheet.write(i + 2, row_num,data[key],format_red)
						else:
							hrr_sheet.write(i + 2, row_num,data[key],wrapped_text_colour)
			else:	
				row_num += 1
				hrr_sheet.write(i + 2, row_num, '')
			current_date -= timedelta(days=1)

	elif len_hrr == hrr_not_recorded and len_hrr != 0:
		hrr_sheet.set_row(3,30)
		wrapped_text = book.add_format({'text_wrap': 1, 'valign': 'top'})
		wrapped_text_colour = book.add_format({'text_wrap': 1, 'valign': 'top','align':'left','bg_color': '#D3D3D3'})
		hrr_sheet.set_row(4,30)
		hrr_sheet.set_row(5,30)
		hrr_sheet.set_row(9,30)
		col_num1 = 1
		row_num = 0
		for col_num in range(len(hrr_not_available)):
			col_num1 = col_num1 + 1
			if (col_num1%2) == 0:
				hrr_sheet.write(col_num1, row_num, hrr_not_available[col_num],wrapped_text)
			else:
				hrr_sheet.write(col_num1, row_num, hrr_not_available[col_num],wrapped_text_colour)
		current_date = to_date
		while (current_date >= from_date):
			data = hrr_datewise.get(current_date.strftime("%Y-%m-%d"),None)
			if data:
				data = data.__dict__
				row_num += 1
				for i,key in enumerate(hrr_not_available_keys):
					end_heartrate_activity = data['end_heartrate_activity']
					if (i%2) == 0:
						if key == 'end_time_activity' or key == 'time_heart_rate_reached_99':
							if data[key]:
								offset = data['offset']
								value = datetime.fromtimestamp(data[key]+offset)
								hrr_sheet.write(i + 2, row_num,value,timestamp_todata)
						elif key == 'no_fitfile_hrr_time_reach_99':
							if data[key]:
								time = data[key]
								minutes = time // 60
								sec = time % 60
								if sec >= 10:
									hrr_sheet.write_rich_string(i + 2, row_num,str(int(minutes)),':',str(int(sec)),format)
								else:
									hrr_sheet.write_rich_string(i + 2, row_num,str(int(minutes)),':','0',str(int(sec)),format)
						elif key == "Did_you_measure_HRR" or key == "no_fitfile_hrr_reach_99":
							if data["Did_you_measure_HRR"] == 'no':
								hrr_sheet.write(i + 2, row_num,"No",format)
							elif data["Did_you_measure_HRR"] == "Heart Rate Data Not Provided":
								hrr_sheet.write(i + 2, row_num,"Heart Rate Data Not Provided",format)
							elif data["no_fitfile_hrr_reach_99"] == "yes":
								hrr_sheet.write(i + 2, row_num,"Yes",format)
							else:
								hrr_sheet.write(i + 2, row_num,"No",format)
						else:
							hrr_sheet.write(i + 2, row_num,data[key],format)
					else:
						if key == 'end_time_activity' or key == 'time_heart_rate_reached_99':
							if data[key]:
								offset = data['offset']
								value = datetime.fromtimestamp(data[key]+offset)
								hrr_sheet.write(i + 2, row_num,value,timestamp_todata)
						elif key == 'no_fitfile_hrr_time_reach_99':
							if data[key]:
								time = data[key]
								minutes = time // 60
								sec = time % 60
								if sec >= 10:
									hrr_time = str(int(minutes)),':',str(int(sec))
									hrr_time_99 = ''.join(hrr_time)
								else:
									hrr_time = str(int(minutes)),':','0',str(int(sec))
									hrr_time_99 = ''.join(hrr_time)
			
								if end_heartrate_activity < aerobic_value:
									if data[key] <= 120: # Green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
									elif data[key] < 180 and data[key] > 121: # light green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
									elif data[key] < 480 and data[key] > 181: # yellow
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
									elif data[key] < 600 and data[key] > 481: # orange
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
									elif data[key] > 601: # red
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
									
								elif end_heartrate_activity > aerobic_value and end_heartrate_activity < aerobic_value + 15:
									if data[key] <= 240: # Green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
									elif data[key] < 360 and data[key] > 241: # light green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
									elif data[key] < 600 and data[key] > 361: # yellow
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
									elif data[key] < 720 and data[key] > 601: # orange
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
									elif data[key] > 721: # red
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
								elif end_heartrate_activity > aerobic_value + 15:
									if data[key] <= 360: # Green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
									elif data[key] < 480 and data[key] > 361: # light green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
									elif data[key] < 720 and data[key] > 481: # yellow
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
									elif data[key] < 1800 and data[key] > 721: # orange
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
									elif data[key] > 1801: # red
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
						elif key == "Did_you_measure_HRR" or key == "no_fitfile_hrr_reach_99":
							if data["Did_you_measure_HRR"] == 'no':
								hrr_sheet.write(i + 2, row_num,"No",wrapped_text_colour)
							elif data["Did_you_measure_HRR"] == "Heart Rate Data Not Provided":
								hrr_sheet.write(i + 2, row_num,"Heart Rate Data Not Provided",wrapped_text_colour)
							elif data["no_fitfile_hrr_reach_99"] == "yes":
								hrr_sheet.write(i + 2, row_num,"Yes",wrapped_text_colour)
							else:
								hrr_sheet.write(i + 2, row_num,"No",wrapped_text_colour)
						else:
							hrr_sheet.write(i + 2, row_num,data[key],wrapped_text_colour)
			else:
				row_num += 1
				hrr_sheet.write(i + 2, row_num, '')
			current_date -= timedelta(days=1)

	elif len_hrr != 0:
		hrr_sheet.set_row(2,30)
		wrapped_text = book.add_format({'text_wrap': 1, 'valign': 'top'})
		wrapped_text_colour = book.add_format({'text_wrap': 1, 'valign': 'top','align':'left','bg_color': '#D3D3D3'})
		hrr_sheet.set_row(3,30)
		hrr_sheet.set_row(4,30)
		hrr_sheet.set_row(7,30)
		hrr_sheet.set_row(9,30)
		hrr_sheet.set_row(12,30)
		hrr_sheet.set_row(15,30)
		hrr_sheet.set_row(19,30)
		col_num1 = 1
		row_num = 0
		for col_num in range(len(hrr_all_fields)):
			col_num1 = col_num1 + 1
			if (col_num1%2) == 0: 
				hrr_sheet.write(col_num1, row_num, hrr_all_fields[col_num],wrapped_text)
			else:
				hrr_sheet.write(col_num1, row_num, hrr_all_fields[col_num],wrapped_text_colour)
		current_date = to_date
		while (current_date >= from_date):
			data = hrr_datewise.get(current_date.strftime("%Y-%m-%d"),None)
			if data:
				data = data.__dict__
				row_num += 1
				for i,key in enumerate(hrr_all_keys):
					end_heartrate_activity = data['end_heartrate_activity']
					if (i%2) == 0:
						if key == 'end_time_activity' or key == 'HRR_activity_start_time' or key == 'time_heart_rate_reached_99':
							if data[key]:
								offset = data['offset']
								
								value = datetime.fromtimestamp(data[key]+offset)
								hrr_sheet.write(i + 2, row_num,value,timestamp_todata)
						elif key == 'time_99' or key == 'diff_actity_hrr' or key == 'pure_time_99': 
							if data[key]:
								time = data[key]
								minutes = time // 60
								sec = time % 60
								if sec >= 10:
									hrr_time = str(int(minutes)),':',str(int(sec))
									hrr_time_99 = ''.join(hrr_time)
								else:
									hrr_time = str(int(minutes)),':','0',str(int(sec))
									hrr_time_99 = ''.join(hrr_time)
								if key == 'time_99' or key == 'pure_time_99':
									if end_heartrate_activity < aerobic_value:
										if data[key] <= 120: # Green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
										elif data[key] < 180 and data[key] > 121: # light green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
										elif data[key] < 480 and data[key] > 181: # yellow
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
										elif data[key] < 600 and data[key] > 481: # orange
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
										elif data[key] > 601: # red
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
										
									elif end_heartrate_activity > aerobic_value and end_heartrate_activity < aerobic_value + 15:
										if data[key] <= 240: # Green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
										elif data[key] < 360 and data[key] > 241: # light green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
										elif data[key] < 600 and data[key] > 361: # yellow
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
										elif data[key] < 720 and data[key] > 601: # orange
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
										elif data[key] > 721: # red
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
									elif end_heartrate_activity > aerobic_value + 15:
										if data[key] <= 360: # Green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
										elif data[key] < 480 and data[key] > 361: # light green
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
										elif data[key] < 720 and data[key] > 481: # yellow
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
										elif data[key] < 1800 and data[key] > 721: # orange
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
										elif data[key] > 1801: # red
											hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
								elif key == 'diff_actity_hrr':
									if sec >= 10:
										hrr_sheet.write_rich_string(i + 2, row_num,str(int(minutes)),':',str(int(sec)),wrapped_text_colour)
									else:
										hrr_sheet.write_rich_string(i + 2, row_num,str(int(minutes)),':','0',str(int(sec)),wrapped_text_colour)		
						elif key == "Did_you_measure_HRR":
							if data["Did_you_measure_HRR"] == "yes":
								hrr_sheet.write(i + 2, row_num,"Yes",format)
							elif data["Did_you_measure_HRR"] == "Heart Rate Data Not Provided":
								hrr_sheet.write(i + 2, row_num,"Heart Rate Data Not Provided",format)
							elif data["Did_you_measure_HRR"] == "no":
								hrr_sheet.write(i + 2, row_num,"No",format)
						elif key == "no_fitfile_hrr_reach_99":
							if data["no_fitfile_hrr_reach_99"] == "yes":
								hrr_sheet.write(i + 2, row_num,"Yes",format)
							elif data["no_fitfile_hrr_reach_99"] == "no":
								hrr_sheet.write(i + 2, row_num,"No",format)
						elif key == "Did_heartrate_reach_99":
							if data["Did_heartrate_reach_99"] == "yes":
								hrr_sheet.write(i + 2, row_num,"Yes",format)
							elif data["Did_heartrate_reach_99"] == "no":
								hrr_sheet.write(i + 2, row_num,"No",format)
						elif key == "No_beats_recovered" or key == "pure_1min_heart_beats":
							if data[key]:
								if data[key] >= 20.0:
									hrr_sheet.write(i + 2, row_num,data[key],format_green)
								elif data[key] > 19.0 and data[key] <= 12.0:
									hrr_sheet.write(i + 2, row_num,data[key],format_yellow)
								elif data[key] < 12.0:
									hrr_sheet.write(i + 2, row_num,data[key],format_red)
						else:
							hrr_sheet.write(i + 2, row_num,data[key],format)
					else:
						if key == 'end_time_activity' or key == 'HRR_activity_start_time' or key == 'time_heart_rate_reached_99':
							if data[key]:
								offset = data['offset']
								
								value = datetime.fromtimestamp(data[key]+offset)
								hrr_sheet.write(i + 2, row_num,value,timestamp_todata)
						elif key == 'no_fitfile_hrr_time_reach_99':
							if data[key]:
								time = data[key]
								minutes = time // 60
								sec = time % 60
								if sec >= 10:
									hrr_time = str(int(minutes)),':',str(int(sec))
									hrr_time_99 = ''.join(hrr_time)
								else:
									hrr_time = str(int(minutes)),':','0',str(int(sec))
									hrr_time_99 = ''.join(hrr_time)
			
								if end_heartrate_activity < aerobic_value:
									if data[key] <= 120: # Green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
									elif data[key] < 180 and data[key] > 121: # light green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
									elif data[key] < 480 and data[key] > 181: # yellow
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
									elif data[key] < 600 and data[key] > 481: # orange
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
									elif data[key] > 601: # red
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
									
								elif end_heartrate_activity > aerobic_value and end_heartrate_activity < aerobic_value + 15:
									if data[key] <= 240: # Green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
									elif data[key] < 360 and data[key] > 241: # light green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
									elif data[key] < 600 and data[key] > 361: # yellow
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
									elif data[key] < 720 and data[key] > 601: # orange
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
									elif data[key] > 721: # red
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)
								elif end_heartrate_activity > aerobic_value + 15:
									if data[key] <= 360: # Green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_green_hrr)
									elif data[key] < 480 and data[key] > 361: # light green
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_limegreen)
									elif data[key] < 720 and data[key] > 481: # yellow
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_yellow)
									elif data[key] < 1800 and data[key] > 721: # orange
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_orange)
									elif data[key] > 1801: # red
										hrr_sheet.write_rich_string(i + 2, row_num,hrr_time_99,format_red)		
						elif key == "Did_you_measure_HRR":
							if data["Did_you_measure_HRR"] == "yes":
								hrr_sheet.write(i + 2, row_num,"Yes",wrapped_text_colour)
							elif data["Did_you_measure_HRR"] == "Heart Rate Data Not Provided":
								hrr_sheet.write(i + 2, row_num,"Heart Rate Data Not Provided",wrapped_text_colour)
							elif data["Did_you_measure_HRR"] == "no":
								hrr_sheet.write(i + 2, row_num,"No",wrapped_text_colour)
						elif key == "no_fitfile_hrr_reach_99":
							if data["no_fitfile_hrr_reach_99"] == "yes":
								hrr_sheet.write(i + 2, row_num,"Yes",wrapped_text_colour)
							elif data["no_fitfile_hrr_reach_99"] == "no":
								hrr_sheet.write(i + 2, row_num,"No",wrapped_text_colour)
						elif key == "Did_heartrate_reach_99":
							if data["Did_heartrate_reach_99"] == "yes":
								hrr_sheet.write(i + 2, row_num,"Yes",wrapped_text_colour)
							elif data["Did_heartrate_reach_99"] == "no":
								hrr_sheet.write(i + 2, row_num,"No",wrapped_text_colour)
						elif key == "No_beats_recovered" or key == "pure_1min_heart_beats":
							if data[key]:
								if data[key] >= 20.0:
									hrr_sheet.write(i + 2, row_num,data[key],format_green)
								elif data[key] > 19.0 and data[key] <= 12.0:
									hrr_sheet.write(i + 2, row_num,data[key],format_yellow)
								elif data[key] < 12.0:
									hrr_sheet.write(i + 2, row_num,data[key],format_red)
						else:
							hrr_sheet.write(i + 2, row_num,data[key],wrapped_text_colour)
			else:
				row_num += 1
				hrr_sheet.write(i + 2, row_num, '')
			current_date -= timedelta(days=1)

	def convert_sec_to_hhmm(seconds):
		'''
			Make seconds to hours and minutes
		'''
		min,sec = divmod(seconds,60)
		hours,minutes = divmod(min,60)
		if minutes < 10:
			minutes = "0"+str(int(minutes))
		else:
			minutes = str(int(minutes))
		if hours < 10:
			hours = "0"+str(int(hours))
		else:
			hours = str(int(hours))
		return hours,minutes

	def round_percentage(percent_value):
		'''
			Make decimals to round number
		'''
		rounded_percent = int(Decimal(percent_value).quantize(0,ROUND_HALF_UP))
		return rounded_percent
	
	def show_values(value,new_row,new_column2,workout_type,to_date,total_activities=None):

		'''
			Print the values in Excel
		'''
	

		workout_copy = workout_type
		workout_keys = ["days_with_activity","percent_of_days","duration",
		"workout_duration_percent","average_heart_rate","duration_in_aerobic_range",
		"percent_aerobic","duration_in_anaerobic_range","percent_anaerobic",
		"duration_below_aerobic_range","percent_below_aerobic",
		"duration_hrr_not_recorded","percent_hrr_not_recorded","dates"]

		

		for key,values in enumerate(workout_keys):
			if values == 'duration':
				new_column2 = new_column2 + 1

				duration = value[values]
				hours,minutes = convert_sec_to_hhmm(duration)
				workout_duration_percent = value['workout_duration_percent']
				workout_duration_percent_value = str(int(workout_duration_percent))
				weekly_workout_sheet.write(new_row,new_column2,str(hours)+':'+str(minutes)+'('+workout_duration_percent_value+'%'+')',innercell_format)
			elif values == 'duration_in_aerobic_range':
				new_column2 = new_column2 + 1
				aerobic = "Aerobic"
				if value.get("duration_in_aerobic_range") and value.get('percent_aerobic') !=0:
					aerobic_range_duration = value['duration_in_aerobic_range']
					hours,minutes = convert_sec_to_hhmm(aerobic_range_duration)
					percent_aerobic = value['percent_aerobic']
					aerobic_value = str(int(percent_aerobic))
					weekly_workout_sheet.write_rich_string(
					new_row,new_column2,aerobic+'\n'+str(hours)+':'+str(minutes)+'('+aerobic_value+'%'+')',innercell_format)
				else:
					weekly_workout_sheet.write_rich_string(
					new_row,new_column2,aerobic+'\n'+'00'+':'+'00'+'('+'0' + '%'+')',innercell_format)

			elif values == 'duration_in_anaerobic_range':
				new_column2 = new_column2 + 1
				if value.get("duration_in_anaerobic_range") and value.get('percent_anaerobic') !=0:
					seconds = value[values]
					hours,minutes = convert_sec_to_hhmm(seconds)
					anaerobic_percentage = value['percent_anaerobic']
					anaerobic_percentage_value = str(int(anaerobic_percentage))
					anaerobic = "Anaerobic"
					weekly_workout_sheet.write_rich_string(
					new_row,new_column2,anaerobic+'\n'+str(hours)+':'+str(minutes)+'('+anaerobic_percentage_value+'%'+')',innercell_format)
				else:
					weekly_workout_sheet.write_rich_string(
					new_row,new_column2,'Anaerobic'+'\n'+'00'+':'+'00'+'('+'0' + '%'+')',innercell_format)
			elif values == 'dates':                               
				#new_column2 = new_column2 + 1
				dates = value[values]
				current_date = week_end_date
				
				for keys , values in dates.items():
					dates = values['workout_date']
					date_convertion  = datetime.strptime(dates, "%d-%b-%y").date()
					diff_of_dates = date_convertion - current_date
					
					repeated = values['repeated']
					duration = values['duration']
					hours,minutes = convert_sec_to_hhmm(duration)
					x = str(hours)+':'+str(minutes)
					y = "(" + str(int(repeated)) + ")"
					new_column2 = 5+ diff_of_dates.days

					weekly_workout_sheet.write_rich_string(new_row-1,new_column2+6,x + y,innercell_format)

			elif values == "duration_below_aerobic_range":
				new_row = new_row +1
				if value.get("duration_below_aerobic_range") and value.get('percent_below_aerobic') !=0:
					below_aerobic_range = value['duration_below_aerobic_range']
					hours,minutes = convert_sec_to_hhmm(below_aerobic_range)
					percent_below_aerobic = value['percent_below_aerobic']
					Workout_type = str(int(percent_below_aerobic))
					weekly_workout_sheet.write_rich_string(
					new_row,new_column2-1,'Below'+'\n'+'Aerobic'+'\n'+str(hours)+':'+str(minutes)+'('+Workout_type + '%'+')',innercell_format)
				else:
					weekly_workout_sheet.write_rich_string(
					new_row,new_column2-1,'Below'+'\n'+'Aerobic'+'\n'+'00'+':'+'00'+'('+'0' + '%'+')',innercell_format)

			elif values == "duration_hrr_not_recorded":
				new_column2 = new_column2 + 1
				if value.get("duration_hrr_not_recorded") and value.get('percent_hrr_not_recorded') !=0:
					below_aerobic_range = value['duration_hrr_not_recorded']
					hours,minutes = convert_sec_to_hhmm(below_aerobic_range)
					percent_below_aerobic = value['percent_hrr_not_recorded']
					Workout_type = str(int(percent_below_aerobic))
					
					weekly_workout_sheet.write_rich_string(
					new_row,new_column2-1,'Not'+'\n'+'Recorded'+'\n'+str(hours)+':'+str(minutes)+'('+Workout_type + '%'+')',innercell_format)
				else:
					weekly_workout_sheet.write_rich_string(
					new_row,new_column2-1,'Not'+'\n'+'Recorded'+'\n'+'00'+':'+'00'+'('+'0'+ '%'+')',innercell_format)
			elif values == 'days_with_activity':
				new_row = new_row
				if value.get("days_with_activity"):
					x = value['days_with_activity']
					y = str(int(x))
					weekly_workout_sheet.write_rich_string(new_row,4,y,innercell_format)
				else:
					weekly_workout_sheet.write_rich_string(new_row,4,'0',innercell_format)



	def workout_totals_miles(value,new_row,new_column2,total_activities):
		'''
			Print the Distance of activities
		'''
		col_num1 = 10
		avg_dis = 0
		for i,k in enumerate(total_activities):
			k_distance = k.lower()+"_distance"
			if value.get(k_distance):
				weekly_workout_sheet.write(
				new_row,12,round((value[k_distance]['value']*0.000621371),2))
				avg_dis = avg_dis +	round((value[k_distance]['value']*0.000621371),2)
				weekly_workout_sheet.write(new_row+2,12,avg_dis)


	# Weekly Workout Summary
	weekly_workout_sheet.set_row(2,50)
	weekly_workout_sheet.set_row(3,40)
	weekly_workout_sheet.set_row(1,20)
	weekly_workout_sheet.set_default_row(40)
	weekly_workout_sheet.set_zoom(77)

	cell_format_bg_color = book.add_format({'bold': True, 'bg_color': '#D3D3D3'})


	cell_format = book.add_format({'bold': True})
	innercell_format = book.add_format({'align': 'center'})

	headers = ["Workout Type","Avg # Of Days With Activity","% of Days","Avg. Workout Duration (hh:mm)",
	"% of Total Duration","Avg Heart Rate","Avg Aerobic Duration (hh:mm)","Avg % Aerobic","Avg Anaerobic Duration (hh:mm)",
	"Avg % Anaerobic","Avg Below Aerobic Duration (hh:mm)","Avg % Below Aerobic","Avg HR Not Recorded Duration (hh:mm)",
	"Avg % HR Not Recorded"]
	
	cell_format.set_text_wrap()
	col_num = 0
	row_num1 = 2
	weekly_workout_sheet.set_column('A:A', 17)
	format_week = book.add_format({'bold': True})
	format_week.set_align('center')
	format_week.set_text_wrap()
	format_week.set_shrink()
	head_bold = book.add_format({'bold': True})
	
	week_start_date, week_end_date = week_date(to_date)
	current_date = week_start_date
	to_date_wss = to_date
	new_row = 2
	new_column = 0
	new_row_distance = 2
	while current_date >from_date:
		headline_row = new_row -1 
		weekly_workout_sheet.write(headline_row, new_column,'Weekly Workout Summary Report For The Week Ended : '+ str(week_end_date),head_bold)
		for single_header2 in headers:
			if single_header2 =="Workout Type":
				weekly_workout_sheet.write(new_row,new_column,single_header2+'\n'+'(# Workouts)',cell_format)
			elif single_header2 == "% of Total Duration":
				new_column = new_column
				duration_header = 'Total' 
				duration= 'Duration'
				weekly_workout_sheet.write(new_row,new_column,duration_header+'\n'+duration+'\n'+'  (%)',cell_format)
			elif single_header2 == "Avg % Aerobic":
				new_column = new_column +1
				weekly_workout_sheet.write(new_row,new_column,'Aerobic',cell_format)
			elif single_header2 =="Avg % Anaerobic":
				new_column = new_column +1
				weekly_workout_sheet.write(new_row,new_column,'Anaerobic',cell_format)
			elif single_header2 == "Avg % Below Aerobic":
				new_row = new_row +1
				weekly_workout_sheet.write(new_row,new_column-1,'   Below'+'\n'+' Aerobic',cell_format)
			elif single_header2 == "Avg HR Not Recorded Duration (hh:mm)":
				new_column = new_column +1
				weekly_workout_sheet.write(new_row,new_column-1 ,'  Not'+'\n'+'Recorded',cell_format)
			elif single_header2 == "Avg # Of Days With Activity" :
				new_column = new_column +1
				weekly_workout_sheet.write(new_row,4,single_header2,cell_format)
		new_row = new_row +1
		while (current_date <= week_end_date):
			new_column = new_column+1
			weekday1 = calendar.day_name[current_date.weekday()]
			x= current_date.strftime('%m-%d-%y')
			current_date_split= x.split("-")
			current_date_string = str(int(current_date_split[0]))+'-'+str(int(current_date_split[1]))+'-'+str(current_date_split[2])
			current_date_string = str(current_date_string)
			weekly_workout_sheet.write_rich_string(new_row-2,new_column,weekday1,'\n',current_date_string,format_week)
			current_date += timedelta(days=1)
		weekly_workout_sheet.write(
				new_row-2,new_column+1,"*Distance",cell_format)

		# print(week_end_date,"week_end_date")
		# print(week_end_date-timedelta(days=6),"week_end_date-timedelta(days=7)")
		data = weekly_workout_helper(request.user,to_date_wss)
		new_column2 = 0
		total_activities = []
		for key,value in data.items():
			if key != 'Totals' and key != 'extra' and key!= 'heartrate_ranges':
				total_activities.append(key)
				x = value['no_activity_in_week']
				y = key +"(" + str(int(x)) + ")"
				Workout_type= ''.join((y))			
				weekly_workout_sheet.write(new_row,new_column2,Workout_type,)
				show_values(value,new_row,new_column2,to_date_wss,total_activities)
				new_row = new_row + 2
		avg_dis = 0
		for key,value in data.items():
			if key != 'Totals' and key != 'extra' and key!= 'heartrate_ranges':
				new_row_distance = new_row_distance + 2
				workout_totals_miles(value,new_row_distance,12,total_activities)
				for key1,value1 in value.items():
					if value1 in total_activities:
						k_distance = value1.lower()+"_distance"
						avg_dis = avg_dis +	round((value[k_distance]['value']*0.000621371),2)
		if data:
			weekly_workout_sheet.write(new_row_distance+2,12,avg_dis)
			new_row_distance = new_row_distance + 6
		else:
			new_row_distance = new_row_distance + 2
		for key,value in data.items():
			if key == 'Totals':
				weekly_workout_sheet.write(new_row,new_column2,key)
				show_values(value,new_row,new_column2,key,to_date_wss)
				# workout_totals_miles(value,new_row,new_column2,total_activities)
				new_row = new_row + 2
		for key,value in data.items():
			if key == 'extra':
				number_of_days = value['days_no_activity']
				activity_number_of_days = "(" + str(int(number_of_days)) + ")"
				weekly_workout_sheet.write(new_row,new_column2,'No Activity'+activity_number_of_days,innercell_format)
				new_column2 = new_column2 + 1
				rounded_percent = int(Decimal(value['percent_days_no_activity']).quantize(0,ROUND_HALF_UP))
				weekly_workout_sheet.write(
				new_row,new_column2,"{}{}".format(rounded_percent,"%"),innercell_format)
				new_row = new_row + 2
		current_date2, week_end_date2 = week_date(week_end_date-timedelta(days=7))
		current_date = current_date2
		week_end_date = week_end_date2
		to_date_wss = week_end_date
		#weekly_workout_sheet.write(new_row,new_column2,'Weekly Workout Summary Report For The Week Ended : '+ str(week_end_date),head_bold)
		new_column = 0
		if current_date == from_date:
			break
	

	#movement consistenct
	# sheet11 = book.add_worksheet('Movement Consistency')
	# sheet11.set_landscape()
	# sheet11.fit_to_pages(1, 1)
	# sheet11.set_zoom(73)
	# sheet11.write(0,0,"Movement Consistency Historical Data",bold)
	# sheet11.write(0,10,"Sleeping",format_orange)
	# sheet11.write(0,11,"Active",format_green)
	# sheet11.write(0,12,"Inactive",format_red_con)
	# sheet11.write(0,13,"Strength",format_purple)
	# sheet11.write(0,14,"Exercise",format_exercise)
	# sheet11.write(0,15,"No Data Yet",format_grey)
	# sheet11.write(0,16,"Time Zone",format_cream)
	# sheet11.write(0,17,"Nap",format_darkcyan)
	# sheet11.write(2,0,"Hour")
	# sheet11.write(3,0,"Date",bold)
	# format2 = book.add_format({'bold':True})
	# format2.set_align('bottom')
	# format2.set_text_wrap()
	# format3 = book.add_format({'bold':True,'align':'center'})
	# format3.set_align('bottom')
	# format3.set_text_wrap()
	# format4 = book.add_format({'bold':True})
	# format4.set_num_format("0%") 
	# sheet11.set_column('D:AA',8)
	# sheet11.freeze_panes(4,3)
	# sheet11.set_column(1,1,15)
	# sheet11.write(5,0,'% of Days User Gets 300  in the hour*',bold)
	# # format2.set_shrink()
	# sheet11.write(3,1,"Daily Movement Consistency Score",format3)
	# hours_range = ["Total Daily Steps","12:00 - 12:59 AM","01:00 - 01:59 AM","02:00 - 02:59 AM","03:00 - 03:59 AM","04:00 - 04:59 AM",
	# "05:00 - 05:59 AM","06:00 - 06:59 AM","07:00 - 07:59 AM","08:00 - 08:59 AM","09:00 - 09:59 AM","10:00 - 10:59 AM","11:00 - 11:59 AM",
	# "12:00 - 12:59 PM","01:00 - 01:59 PM","02:00 - 02:59 PM","03:00 - 03:59 PM","04:00 - 04:59 PM","05:00 - 05:59 PM",
	# "06:00 - 06:59 PM","07:00 - 07:59 PM","08:00 - 08:59 PM","09:00 - 09:59 PM","10:00 - 10:59 PM","11:00 - 11:59 PM","Sleeping Hours",
	# "Nap Hours","Active Hours","Inactive Hours","Strength Hours","Exercise Hours","No Data Yet Hours","Time Zone Hours"]
	# hours_range1 = ["total_steps","12:00 AM to 12:59 AM","01:00 AM to 01:59 AM","02:00 AM to 02:59 AM","03:00 AM to 03:59 AM","04:00 AM to 04:59 AM",
	# "05:00 AM to 05:59 AM","06:00 AM to 06:59 AM","07:00 AM to 07:59 AM","08:00 AM to 08:59 AM","09:00 AM to 09:59 AM","10:00 AM to 10:59 AM","11:00 AM to 11:59 AM",
	# "12:00 PM to 12:59 PM","01:00 PM to 01:59 PM","02:00 PM to 02:59 PM","03:00 PM to 03:59 PM","04:00 PM to 04:59 PM","05:00 PM to 05:59 PM",
	# "06:00 PM to 06:59 PM","07:00 PM to 07:59 PM","08:00 PM to 08:59 PM","09:00 PM to 09:59 PM","10:00 PM to 10:59 PM","11:00 PM to 11:59 PM","sleeping_hours",
	# "active_hours","inactive_hours"]
	# days_count = {"12:00 AM to 12:59 AM":0,"01:00 AM to 01:59 AM":0,"02:00 AM to 02:59 AM":0,"03:00 AM to 03:59 AM":0,"04:00 AM to 04:59 AM":0,
	# "05:00 AM to 05:59 AM":0,"06:00 AM to 06:59 AM":0,"07:00 AM to 07:59 AM":0,"08:00 AM to 08:59 AM":0,"09:00 AM to 09:59 AM":0,"10:00 AM to 10:59 AM":0,"11:00 AM to 11:59 AM":0,
	# "12:00 PM to 12:59 PM":0,"01:00 PM to 01:59 PM":0,"02:00 PM to 02:59 PM":0,"03:00 PM to 03:59 PM":0,"04:00 PM to 04:59 PM":0,"05:00 PM to 05:59 PM":0,
	# "06:00 PM to 06:59 PM":0,"07:00 PM to 07:59 PM":0,"08:00 PM to 08:59 PM":0,"09:00 PM to 09:59 PM":0,"10:00 PM to 10:59 PM":0,"11:00 PM to 11:59 PM":0}
	# columns = ['movement_consistency']
	# current_date = to_date
	# r = 6
	# total_days = (to_date-from_date).days+1

	# if to_date and from_date:
	# 	while (current_date >= from_date):
	# 		r = r + 1
	# 		sheet11.write(r,0,current_date,date_format)
	# 		current_date -= timedelta(days = 1)
	# sheet11.set_row(3,45)
	# col_num = 2
	# start_num = 12
	# start_digit =':01'
	# end_digit = ':59'
	# for hour in range(1,25,1):
	# 	col_num += 1
	# 	sheet11.write(2,col_num,hour)
	# col_num1 = 1
	# for col_num in range(len(hours_range)):
	# 	col_num1 += 1
	# 	sheet11.write(3,col_num1,hours_range[col_num],format2)
	# current_date = to_date
	# row_num = 4
	# row = 6
	# row_per = 5
	# col = 2
	# while (current_date >= from_date):
	# 	steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	if steps_data:
	# 		steps_data = steps_data.__dict__
	# 		grades_data = grades_data.__dict__
	# 		# logic
	# 		row += 1
	# 		for i,key in enumerate(columns4):
				
	# 			if i == 0 and grades_data['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and steps_data[key]:
	# 				sheet11.write(row,col-1,ast.literal_eval(steps_data[key])['inactive_hours'], format_green)
	# 			elif i == 0 and grades_data['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and steps_data[key]:
	# 				sheet11.write(row,col-1, ast.literal_eval(steps_data[key])['inactive_hours'], format_green)
	# 			elif i == 0 and grades_data['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and steps_data[key]:
	# 				sheet11.write(row,col-1, ast.literal_eval(steps_data[key])['inactive_hours'], format_yellow)
	# 			elif i == 0 and grades_data['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and steps_data[key]:
	# 				sheet11.write(row,col-1, ast.literal_eval(steps_data[key])['inactive_hours'], format_yellow)
	# 			elif i == 0 and grades_data['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and steps_data[key]:
	# 				sheet11.write(row,col-1,ast.literal_eval(steps_data[key])['inactive_hours'], format_red_con)
	# 		hours_list = ["12:00 AM to 12:59 AM","01:00 AM to 01:59 AM","02:00 AM to 02:59 AM",
	# 		"03:00 AM to 03:59 AM", "04:00 AM to 04:59 AM","05:00 AM to 05:59 AM",
	# 		"06:00 AM to 06:59 AM","07:00 AM to 07:59 AM","08:00 AM to 08:59 AM",
	# 		"09:00 AM to 09:59 AM","10:00 AM to 10:59 AM","11:00 AM to 11:59 AM",
	# 		"12:00 PM to 12:59 PM","01:00 PM to 01:59 PM","02:00 PM to 02:59 PM",
	# 		"03:00 PM to 03:59 PM","04:00 PM to 04:59 PM","05:00 PM to 05:59 PM",
	# 		"06:00 PM to 06:59 PM","07:00 PM to 07:59 PM","08:00 PM to 08:59 PM",
	# 		"09:00 PM to 09:59 PM","10:00 PM to 10:59 PM","11:00 PM to 11:59 PM"]
	# 		for x,key in enumerate(columns):
	# 			steps_string = steps_data['movement_consistency']
	# 			if steps_string:
	# 				json1_data = json.loads(steps_string)
	# 				sheet11.write(row,col+x,json1_data['total_steps'],format)
	# 				for i,hour in enumerate(hours_list):
	# 					if json1_data[hour]["status"] == "sleeping":
	# 						sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_orange)
	# 						if json1_data[hour]['steps'] >= 300:
	# 							days_count[hour] += 1
	# 					elif json1_data[hour]["status"] == "active":
	# 						sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_green)
	# 						if json1_data[hour]['steps'] >= 300:
	# 							days_count[hour] += 1
	# 					elif json1_data[hour]["status"] == "inactive":
	# 						sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_red_con)
	# 						if json1_data[hour]['steps'] >= 300:
	# 							days_count[hour] += 1
	# 					elif json1_data[hour]["status"] == "exercise":
	# 						sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_exercise)
	# 						if json1_data[hour]['steps'] >= 300:
	# 							days_count[hour] += 1
	# 					elif json1_data[hour]["status"] == "no data yet":
	# 						sheet11.write(row,col+x+1+i,"No Data Yet",format_grey)
	# 					elif json1_data[hour]["status"] == "time zone change":
	# 						sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_cream)
	# 					elif json1_data[hour]["status"] == "nap":
	# 						sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_darkcyan)
	# 					else:
	# 						sheet11.write(row,col+x+1+i,json1_data[hour]['steps'],format_purple)

	# 				def format_active_prcnt(days_count,time_slot,total_days):
	# 					if total_days:
	# 						prcnt = round((days_count.get(time_slot,0) / total_days) * 100,2)
	# 						return str(prcnt) + " %"
	# 					return str(0)+" %"

	# 				sheet11.write(row,col+x+25,json1_data['sleeping_hours'])
	# 				sheet11.write(row,col+x+26,json1_data.get('nap_hours',0))
	# 				sheet11.write(row,col+x+27,json1_data['active_hours'])
	# 				sheet11.write(row,col+x+28,json1_data['inactive_hours'])
	# 				sheet11.write(row,col+x+29,json1_data.get('strength_hours',0))
	# 				sheet11.write(row,col+x+30,json1_data.get('exercise_hours',0))
	# 				sheet11.write(row,col+x+31,json1_data.get('no_data_hours',0))
	# 				sheet11.write(row,col+x+32,json1_data.get('timezone_change_hours',0))
	# 				sheet11.write(5,2+1,str(round(((days_count["12:00 AM to 12:59 AM"]/total_days))*100,2))+" %",bold)
	# 				# print(((days_count["12:00 AM to 12:59 AM"]/total_days))*100)
	# 				sheet11.write(5,2+2,format_active_prcnt(days_count,'01:00 AM to 01:59 AM',total_days),bold)
	# 				sheet11.write(5,2+3,str(round(((days_count["02:00 AM to 02:59 AM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+4,str(round(((days_count["03:00 AM to 03:59 AM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+5,str(round(((days_count["04:00 AM to 04:59 AM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+6,str(round(((days_count["05:00 AM to 05:59 AM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+7,str(round(((days_count["06:00 AM to 06:59 AM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+8,str(round(((days_count["07:00 AM to 07:59 AM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+9,str(round(((days_count["08:00 AM to 08:59 AM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+10,str(round(((days_count["09:00 AM to 09:59 AM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+11,str(round(((days_count["10:00 AM to 10:59 AM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+12,str(round(((days_count["11:00 AM to 11:59 AM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+13,str(round(((days_count["12:00 PM to 12:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+14,str(round(((days_count["01:00 PM to 01:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+15,str(round(((days_count["02:00 PM to 02:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+16,str(round(((days_count["03:00 PM to 03:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+17,str(round(((days_count["04:00 PM to 04:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+18,str(round(((days_count["05:00 PM to 05:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+19,str(round(((days_count["06:00 PM to 06:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+20,str(round(((days_count["07:00 PM to 07:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+21,str(round(((days_count["08:00 PM to 08:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+22,str(round(((days_count["09:00 PM to 09:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+23,str(round(((days_count["10:00 PM to 10:59 PM"]/total_days))*100,2))+" %",bold)
	# 				sheet11.write(5,2+24,str(round(((days_count["11:00 PM to 11:59 PM"]/total_days))*100,2))+" %",bold)

	# 	else:
	# 		row += 1
	# 		sheet11.write(row,col,'')
	# 	current_date -= timedelta(days=1)


	#Progress Analyzer
	sheet10.freeze_panes(1,1)
	sheet10.set_column('A:A',1)
	sheet10.set_column('B:B',35)
	sheet10.set_column('C:D',13)
	sheet10.set_column('D:G',16)
	sheet10.set_row(0,45)
	sheet10.set_landscape()

	format = book.add_format({'bold': True})
	format.set_text_wrap()
	format_align1 = book.add_format({'align':'left','num_format': '0.00'})
	format_align = book.add_format({'align':'left'})

	green = book.add_format({'align':'left', 'bg_color': 'green','font_color': 'white'})
	lawn_green=book.add_format({'align':'left','bg_color':'#32d358'})
	yellow = book.add_format({'align':'left', 'bg_color': 'yellow'})
	red = book.add_format({'align':'left', 'bg_color': 'red'})
	orange = book.add_format({'align':'left', 'bg_color': 'orange'})
	num_format = book.add_format({'align':'left','num_format': '#,##0'})

	border_format=book.add_format({
							'border':1,
							'align':'left',
							'font_size':10
						   })

	#Headings
	bold = book.add_format({'bold': True})
	sheet10.write(0,1,'Summary Dashboard',bold)
	sheet10.write(2,1,'Overall Health Grade',bold)
	sheet10.write(8,1,'Movement Consistency',bold)
	sheet10.write(14,1,'Non Exercise Steps',bold)
	sheet10.write(21,1,'Nutrition',bold)
	sheet10.write(27,1,'Alcohol',bold)
	sheet10.write(34,1,'Exercise Consistency',bold)
	sheet10.write(40,1,'Exercise Stats',bold)
	sheet10.write(46,1,'Other Stats',bold)
	sheet10.write(54,1,'Sleep Per Night (excluding awake time)',bold)
	sheet10.write(61,1,'Sick',bold)
	sheet10.write(69,1,'stress Level',bold)
	sheet10.write(78,1,'Standing',bold)
	sheet10.write(84,1,'Travel',bold)
	
	to_date1 ='{}'.format(to_date)
	
	query_params = {
		"date":to_date1,
		"duration":"today,yesterday,week,month,year",
		#"custom_ranges":cr1,
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other"
		}
	DATA = ProgressReport(request.user,query_params).get_progress_report()
	rank_data = LeaderboardOverview(request.user,query_params).get_leaderboard()
	#print(pprint.pprint(rank_data))
	#columns headings
	report_date= DATA['report_date']
	rdate1=datetime.strptime(report_date,"%Y-%m-%d").date()
	rdate='{}'.format(rdate1)
	#print(rdate)
	
	today = DATA['duration_date']['today']
	t1=datetime.strptime(today,"%Y-%m-%d")
	today1=t1.strftime("%b %d,%Y")

	yesterday=DATA['duration_date']['yesterday']
	to1=datetime.strptime(yesterday,"%Y-%m-%d")
	yesterday1=to1.strftime("%b %d,%Y")

	week = DATA['duration_date']['week']
	yest=[x.strip() for x in week.split('to')]
	yest1=datetime.strptime(yest[0],"%Y-%m-%d")
	yest2=datetime.strptime(yest[1],"%Y-%m-%d")
	ys1=yest1.strftime("%b %d,%Y")
	ys2=yest2.strftime("%b %d,%Y")
	week1='{} to {}'.format(ys1,ys2)

	month = DATA['duration_date']['month']
	m1=[x.strip() for x in month.split('to')]
	mon1=datetime.strptime(m1[0],"%Y-%m-%d")
	mon2=datetime.strptime(m1[1],"%Y-%m-%d")
	ms1=mon1.strftime("%b %d,%Y")
	ms2=mon2.strftime("%b %d,%Y")
	month1='{} to {}'.format(ms1,ms2)


	today1 ='{}\n{}'.format('Today',today1)
	yesterday1 = '{}\n{}'.format('Yesterday',yesterday1)
	week1 = '{}\n{}'.format('Avg Last 7 days',week1)
	month1 = '{}\n{}'.format('Avg Last 30 days',month1)
	

	y1= DATA['duration_date']['year']
	y2=[x.strip() for x in y1.split('to')]
	#print(y2) 
	y=datetime.strptime(y2[1],"%Y-%m-%d")
	x=datetime.strptime(y2[0],"%Y-%m-%d")
	x1=x.strftime("%b %d,%Y")
	y1=y.strftime("%b %d,%Y")
	yearformat='{} to {}'.format(x1,y1)
	year1 = '{}\n{}'.format('Avg Year to Date',yearformat)
	duration = [today1,yesterday1,week1,month1,year1]

	c = 1
	for i in range(len(duration)):
		c = c+1
		sheet10.write(0,c,duration[i],format)
		
	# Row headers
	columns1=['Total GPA Points','Overall Health GPA','Rank against other users','Overall Health GPA Grade']
	row=2
	for i in range(len(columns1)):
		row=row+1
		sheet10.write(row,1,columns1[i])

	Movement_consistency=['Movement Consistency Score','Rank against other users','Movement Consistency Grade','Movement Consistency GPA']
	row=8
	for i in range(len(Movement_consistency)):
		row=row+1
		sheet10.write(row,1,Movement_consistency[i])
	
	Non_Exercise_Steps=['Non Eercise Steps','Rank against other users','Movement-Non Exercise Steps Grade','Non Exercise Steps GPA','Total Steps']
	row=14
	for i in range(len(Non_Exercise_Steps)):
		row=row+1
		sheet10.write(row,1,Non_Exercise_Steps[i])
	
	Nutrition=['% Unprocessed Food Consumed','Rank against other users','% Non Processed Food Consumed Grade','% Non Processedd Food Consumed GPA']
	row=21
	for i in range(len(Nutrition)):
		row=row+1
		sheet10.write(row,1,Nutrition[i])
	
	alcohol=['Average Drinks Per Week(7Days)','Rank against other users','Alcoholic drinks per week Grade','Alcoholic drinks per week GPA','% of days alcohol consumption reported']
	row=27
	for i in range(len(alcohol)):
		row = row+1
		sheet10.write(row,1,alcohol[i])
	
	exercise_consistency=['Avg # of Days Exercised/Week','Rank against other users','Exercise Consistency Grade','Exercise Consistency GPA']
	row=34
	for i in range(len(exercise_consistency)):
		row=row+1
		sheet10.write(row,1,exercise_consistency[i])
	
	exercise_stats=['Workout Duration (hours:minutes)','Workout Effort Level','Average Exercise Heart Rate','VO2 Max']
	row=40
	for i in range(len(exercise_stats)):
		row=row+1
		sheet10.write(row,1,exercise_stats[i])

	other_stats=['Resting Heart Rate(RHR)','HRR (time to 99)','HRR (heart beats lowered in 1st minute)','HRR (highest heart rate in 1st minute)','HRR (lowest heart rate point)','Floors Climbed']
	row=46
	for i in range(len(other_stats)):
		row=row+1
		sheet10.write(row,1,other_stats[i])

	
	sleep_per_night=['Total Sleep in hours:minutes','Rank against other users','Average Sleep Grade','# of Days Sleep Aid Taken in Period','%  of Days Sleep Aid Taken in Period']
	row=54
	for i in range(len(sleep_per_night)):
		row=row+1
		sheet10.write(row,1,sleep_per_night[i])

	sick = ['# of Days Not Sick','% of Days Not Sick','# of Days Sick','% of Days Sick',' # Days Sick/Not Sick Reported']
	row=61
	for i in range(len(sick)):
		row=row+1
		sheet10.write(row,1,sick[i])

	stresslevel = ['# of Days Low Stress Reported','% of Days Low Stress','# of Days Medium Stress Reported','% of Days Medium Stress','# of Days High Stress Reported','% of Days High Stress','# Days Stress Level Reported']
	row=69
	for i in range(len(stresslevel)):
		row=row+1
		sheet10.write(row,1,stresslevel[i])

	standing = ['# of Days Stood more than 3 hours','% of Days Stood More Than 3 Hours', '# of Days Reported Standing/Not Standing more than 3 hours'] 
	row=78
	for i in range(len(standing)):
		row=row+1
		sheet10.write(row,1,standing[i])

	travel=['# of Days you Traveled/Stayed Away From Home?','% of Days you Traveled/Stayed Away From Home?']
	row=84
	for i in range(len(travel)):
		row=row+1
		sheet10.write(row,1,travel[i])

	Ohg=['total_gpa_point','overall_health_gpa','overall_health_gpa_grade']
	mc=['movement_consistency_score','movement_consistency_grade','movement_consistency_gpa']
	non_exe=['non_exercise_steps','movement_non_exercise_step_grade','non_exericse_steps_gpa','total_steps']
	nutri=['prcnt_unprocessed_volume_of_food','prcnt_unprocessed_food_grade','prcnt_unprocessed_food_gpa']
	Alc=['avg_drink_per_week','alcoholic_drinks_per_week_grade','alcoholic_drinks_per_week_gpa','prcnt_alcohol_consumption_reported']
	Ec=['avg_no_of_days_exercises_per_week','exercise_consistency_grade','exercise_consistency_gpa']
	Es=['workout_duration_hours_min','workout_effort_level','avg_exercise_heart_rate','vo2_max']
	other1=['resting_hr','hrr_time_to_99','hrr_beats_lowered_in_first_min','hrr_highest_hr_in_first_min','hrr_lowest_hr_point','floors_climbed']
	slept=['total_sleep_in_hours_min','average_sleep_grade','num_days_sleep_aid_taken_in_period','prcnt_days_sleep_aid_taken_in_period']
	sick1=['number_of_days_not_sick','prcnt_of_days_not_sick','number_of_days_sick','prcnt_of_days_sick','days_sick_not_sick_reported']
	stress1=['number_of_days_low_stress_reported','prcnt_of_days_low_stress','number_of_days_medium_stress_reported','prcnt_of_days_medium_stress',
			'number_of_days_high_stress_reported','prcnt_of_days_high_stress','days_stress_level_reported']	
	standing1=['number_days_stood_three_hours','prcnt_days_stood_three_hours','number_days_reported_stood_not_stood_three_hours']
	travel1=['number_days_travel_away_from_home','prcnt_days_travel_away_from_home']

	query_params = {
	"date":rdate,
	"duration":"today,yesterday,week,month,year",
	"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other,sick,stress,standing,travel"
	}
	DATA = ProgressReport(request.user,query_params).get_progress_report()
	#print(pprint.pprint(DATA))
	time1=['today','yesterday','week','month','year']
	c = 1
	for i in range(len(time1)):
		c = c+1
		sheet10.write(3,c,DATA['summary']['overall_health']['total_gpa_point'][time1[i]],format_align)																
		sheet10.write(4,c,DATA['summary']['overall_health']['overall_health_gpa'][time1[i]],format_align1)																
		sheet10.write(5,c,rank_data['oh_gpa'][time1[i]]['user_rank']['rank'],format_align)
		sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],format_align)
		
		sheet10.write(9,c,DATA['summary']['mc']['movement_consistency_score'][time1[i]],format_align)
		sheet10.write(10,c,rank_data['mc'][time1[i]]['user_rank']['rank'],format_align)
		sheet10.write(11,c,DATA['summary']['mc']['movement_consistency_grade'][time1[i]],format_align)
		sheet10.write(12,c,DATA['summary']['mc']['movement_consistency_gpa'][time1[i]],format_align1)
		
		sheet10.write(15,c,DATA['summary']['non_exercise']['non_exercise_steps'][time1[i]],num_format)
		sheet10.write(16,c,rank_data['total_steps'][time1[i]]['user_rank']['rank'],format_align)
		sheet10.write(17,c,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],format_align)
		sheet10.write(18,c,DATA['summary']['non_exercise']['non_exericse_steps_gpa'][time1[i]],format_align1)
		sheet10.write(19,c,DATA['summary']['non_exercise']['total_steps'][time1[i]],num_format)
		
		sheet10.write(22,c,DATA['summary']['nutrition']['prcnt_unprocessed_volume_of_food'][time1[i]],format_align)
		sheet10.write(23,c,rank_data['prcnt_uf'][time1[i]]['user_rank']['rank'],format_align)
		sheet10.write(24,c,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],format_align)
		sheet10.write(25,c,DATA['summary']['nutrition']['prcnt_unprocessed_food_gpa'][time1[i]],format_align1)
		
		sheet10.write(28,c,DATA['summary']['alcohol']['avg_drink_per_week'][time1[i]],format_align)
		sheet10.write(29,c,rank_data['alcohol'][time1[i]]['user_rank']['rank'],format_align)
		sheet10.write(30,c,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],format_align)
		sheet10.write(31,c,DATA['summary']['alcohol']['alcoholic_drinks_per_week_gpa'][time1[i]],format_align1)
		sheet10.write(32,c,DATA['summary']['alcohol']['prcnt_alcohol_consumption_reported'][time1[i]],format_align)

		sheet10.write(35,c,DATA['summary']['ec']['avg_no_of_days_exercises_per_week'][time1[i]],format_align)
		sheet10.write(36,c,rank_data['ec'][time1[i]]['user_rank']['rank'],format_align)
		sheet10.write(37,c,DATA['summary']['ec']['exercise_consistency_grade'][time1[i]],format_align)
		sheet10.write(38,c,DATA['summary']['ec']['exercise_consistency_gpa'][time1[i]],format_align1)
		
		# sheet10.write(42,c,DATA['summary']['exercise']['workout_duration_hours_min'][time1[i]],format_align)
		# sheet10.write(43,c,DATA['summary']['exercise']['workout_effort_level'][time1[i]],format_align)
		# sheet10.write(44,c,DATA['summary']['exercise']['avg_exercise_heart_rate'][time1[i]],format_align)
		# sheet10.write(45,c,DATA['summary']['exercise']['vo2_max'][time1[i]],format_align)
		
		sheet10.write(47,c,DATA['summary']['other']['resting_hr'][time1[i]],format_align)
		# sheet10.write(48,c,DATA['summary']['other']['hrr_time_to_99'][time1[i]],format_align)
		# sheet10.write(49,c,DATA['summary']['other']['hrr_beats_lowered_in_first_min'][time1[i]],format_align)
		# sheet10.write(50,c,DATA['summary']['other']['hrr_highest_hr_in_first_min'][time1[i]],format_align)
		sheet10.write(51,c,DATA['summary']['other']['hrr_lowest_hr_point'][time1[i]],format_align)
		sheet10.write(52,c,DATA['summary']['other']['floors_climbed'][time1[i]],format_align)

		
		sheet10.write(55,c,DATA['summary']['sleep']['total_sleep_in_hours_min'][time1[i]],format_align)
		sheet10.write(56,c,rank_data['avg_sleep'][time1[i]]['user_rank']['rank'],format_align)
		sheet10.write(57,c,DATA['summary']['sleep']['average_sleep_grade'][time1[i]],format_align)
		sheet10.write(58,c,DATA['summary']['sleep']['num_days_sleep_aid_taken_in_period'][time1[i]],format_align)
		sheet10.write(59,c,DATA['summary']['sleep']['prcnt_days_sleep_aid_taken_in_period'][time1[i]],format_align)
		
		# row=61
		# for i in range(len(sick1)):
		# 	row=row+1
		sheet10.write(62,c,DATA['summary']['sick'][sick1[0]][time1[i]],format_align)
		sheet10.write(63,c,DATA['summary']['sick'][sick1[1]][time1[i]],format_align)
		sheet10.write(64,c,DATA['summary']['sick'][sick1[2]][time1[i]],format_align)
		sheet10.write(65,c,DATA['summary']['sick'][sick1[3]][time1[i]],format_align)
		sheet10.write(66,c,DATA['summary']['sick'][sick1[4]][time1[i]],format_align)


		# row=69
		# for i in range(len(stress1)):
		# 	row=row+1
		sheet10.write(70,c,DATA['summary']['stress'][stress1[0]][time1[i]],format_align)
		sheet10.write(71,c,DATA['summary']['stress'][stress1[1]][time1[i]],format_align)
		sheet10.write(72,c,DATA['summary']['stress'][stress1[2]][time1[i]],format_align)
		sheet10.write(73,c,DATA['summary']['stress'][stress1[3]][time1[i]],format_align)
		sheet10.write(74,c,DATA['summary']['stress'][stress1[4]][time1[i]],format_align)
		sheet10.write(75,c,DATA['summary']['stress'][stress1[5]][time1[i]],format_align)
		sheet10.write(76,c,DATA['summary']['stress'][stress1[6]][time1[i]],format_align)

		# row=78
		# for i in range(len(standing1)):
		# 	row=row+1
		sheet10.write(79,c,DATA['summary']['standing'][standing1[0]][time1[i]],format_align)
		sheet10.write(80,c,DATA['summary']['standing'][standing1[1]][time1[i]],format_align)
		sheet10.write(81,c,DATA['summary']['standing'][standing1[2]][time1[i]],format_align)

		# row=84
		# for i in range(len(travel1)):
		# 	row=row+1
		sheet10.write(85,c,DATA['summary']['travel'][travel1[0]][time1[i]],format_align)
		sheet10.write(86,c,DATA['summary']['travel'][travel1[1]][time1[i]],format_align)
		
		if (DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]]=='A'):
			sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],green)
		elif(DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]]=='B'):
			sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],lawn_green)
		elif (DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]]=='C'):
			sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],yellow)
		elif(DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]]=='D'):
			sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],orange)
		elif(DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]]=='F'):
			sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],red)

		if (DATA['summary']['mc']['movement_consistency_grade'][time1[i]]=='A'):
			sheet10.write(11,c,DATA['summary']['mc']['movement_consistency_grade'][time1[i]],green)
		elif (DATA['summary']['mc']['movement_consistency_grade'][time1[i]]=='B'):
			sheet10.write(11,c,DATA['summary']['mc']['movement_consistency_grade'][time1[i]],lawn_green)
		elif (DATA['summary']['mc']['movement_consistency_grade'][time1[i]]=='C'):
			sheet10.write(11,c,DATA['summary']['mc']['movement_consistency_grade'][time1[i]],yellow)
		elif (DATA['summary']['mc']['movement_consistency_grade'][time1[i]]=='D'):
			sheet10.write(11,c,DATA['summary']['mc']['movement_consistency_grade'][time1[i]],orange)
		elif (DATA['summary']['mc']['movement_consistency_grade'][time1[i]]=='F'):
			sheet10.write(11,c,DATA['summary']['mc']['movement_consistency_grade'][time1[i]],red)
		
		if (DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]]=='A'):
			sheet10.write(17,c,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],green)
		elif (DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]]=='B'):
			sheet10.write(17,c,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],lawn_green)
		elif (DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]]=='C'):
			sheet10.write(17,c,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],yellow)
		elif (DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]]=='D'):
			sheet10.write(17,c,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],orange)
		elif (DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]]=='F'):
			sheet10.write(17,c,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],red)
		
		if (DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]]=='A'):
			sheet10.write(24,c,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],green)
		elif (DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]]=='B'):
			sheet10.write(24,c,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],lawn_green)
		elif (DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]]=='C'):
			sheet10.write(24,c,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],yellow)
		elif (DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]]=='D'):
			sheet10.write(24,c,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],orange)
		elif (DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]]=='F'):
			sheet10.write(24,c,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],red)
		
		if (DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]]=='A'):	
			sheet10.write(30,c,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],green)
		elif (DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]]=='B'):	
			sheet10.write(30,c,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],lawn_green)
		elif (DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]]=='C'):	
			sheet10.write(30,c,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],yellow)
		elif (DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]]=='D'):	
			sheet10.write(30,c,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],orange)
		elif (DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]]=='F'):	
			sheet10.write(30,c,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],red)
		
		if (DATA['summary']['ec']['exercise_consistency_grade'][time1[i]]=='A'):
			sheet10.write(37,c,DATA['summary']['ec']['exercise_consistency_grade'][time1[i]],green)
		elif (DATA['summary']['ec']['exercise_consistency_grade'][time1[i]]=='B'):
			sheet10.write(37,c,DATA['summary']['ec']['exercise_consistency_grade'][time1[i]],lawn_green)
		elif (DATA['summary']['ec']['exercise_consistency_grade'][time1[i]]=='C'):
			sheet10.write(37,c,DATA['summary']['ec']['exercise_consistency_grade'][time1[i]],yellow)
		elif (DATA['summary']['ec']['exercise_consistency_grade'][time1[i]]=='D'):
			sheet10.write(37,c,DATA['summary']['ec']['exercise_consistency_grade'][time1[i]],orange)
		elif (DATA['summary']['ec']['exercise_consistency_grade'][time1[i]]=='F'):
			sheet10.write(37,c,DATA['summary']['ec']['exercise_consistency_grade'][time1[i]],red)

		if (DATA['summary']['sleep']['average_sleep_grade'][time1[i]]=='A'):
			sheet10.write(57,c,DATA['summary']['sleep']['average_sleep_grade'][time1[i]],green)
		elif (DATA['summary']['sleep']['average_sleep_grade'][time1[i]]=='B'):
			sheet10.write(57,c,DATA['summary']['sleep']['average_sleep_grade'][time1[i]],lawn_green)
		elif (DATA['summary']['sleep']['average_sleep_grade'][time1[i]]=='C'):
			sheet10.write(57,c,DATA['summary']['sleep']['average_sleep_grade'][time1[i]],yellow)
		elif (DATA['summary']['sleep']['average_sleep_grade'][time1[i]]=='D'):
			sheet10.write(57,c,DATA['summary']['sleep']['average_sleep_grade'][time1[i]],orange)
		elif (DATA['summary']['sleep']['average_sleep_grade'][time1[i]]=='F'):
			sheet10.write(57,c,DATA['summary']['sleep']['average_sleep_grade'][time1[i]],red)

		if (DATA['summary']['sleep']['total_sleep_in_hours_min'][time1[i]]=='00:00'):
			sheet10.write(55,c,'No Workout',format_align)
		else:
			sheet10.write(55,c,DATA['summary']['sleep']['total_sleep_in_hours_min'][time1[i]],format_align)
			
		if (DATA['summary']['exercise']['avg_exercise_heart_rate'][time1[i]]==0):
			sheet10.write(43,c,'No Workout',format_align)
		else:
			sheet10.write(43,c,DATA['summary']['exercise']['avg_exercise_heart_rate'][time1[i]],format_align)
		
		if (DATA['summary']['exercise']['workout_effort_level'][time1[i]]==0):
			sheet10.write(42,c,'No Workout',format_align)
		else:
			sheet10.write(42,c,DATA['summary']['exercise']['workout_effort_level'][time1[i]],format_align)

		if (DATA['summary']['exercise']['vo2_max'][time1[i]]==0):
			sheet10.write(44,c,'Not provided',format_align)
		else:
			sheet10.write(44,c,DATA['summary']['exercise']['vo2_max'][time1[i]],format_align)
			
		if (DATA['summary']['exercise']['workout_duration_hours_min'][time1[i]]!='00:00'):
			if (DATA['summary']['other']['hrr_time_to_99'][time1[i]]=='00:00'):
				sheet10.write(48,c,'Not Recorded',format_align)
			else:
				sheet10.write(48,c,DATA['summary']['other']['hrr_time_to_99'][time1[i]],format_align)
		else:
			sheet10.write(48,c,'No Workout',format_align)
		
		if (DATA['summary']['exercise']['workout_duration_hours_min'][time1[i]]!='00:00'):
			if (DATA['summary']['other']['hrr_beats_lowered_in_first_min'][time1[i]]==0):
				sheet10.write(49,c,'Not Recorded',format_align)
			else:
				sheet10.write(49,c,DATA['summary']['other']['hrr_beats_lowered_in_first_min'][time1[i]],format_align)
		else:
			sheet10.write(49,c,'No Workout',format_align)
		
		if (DATA['summary']['exercise']['workout_duration_hours_min'][time1[i]]!='00:00'):	
			if (DATA['summary']['other']['hrr_highest_hr_in_first_min'][time1[i]]==0):
				sheet10.write(50,c,'Not Recorded',format_align)
			else:
				sheet10.write(50,c,DATA['summary']['other']['hrr_highest_hr_in_first_min'][time1[i]],format_align)
		else:
			sheet10.write(50,c,'No Workout',format_align)


		if (DATA['summary']['exercise']['workout_duration_hours_min'][time1[i]]=='00:00'):
			sheet10.write(41,c,"No Workout",format_align)
		else:
			sheet10.write(41,c,DATA['summary']['exercise']['workout_duration_hours_min'][time1[i]],format_align)


		# row=61
		# for i in range(len(sick1)):
		# 	row=row+1
		# 	sheet10.write(row,c,DATA['summary']['sick'][sick1[i]][time1[i]],format_align)
		
		# row=69
		# for i in range(len(stress1)):
		# 	row=row+1
		# 	sheet10.write(row,c,DATA['summary']['stress'][stress1[i]][time1[i]],format_align)
		
		# row=78
		# for i in range(len(standing1)):
		# 	row=row+1
		# 	sheet10.write(row,c,DATA['summary']['standing'][standing1[i]][time1[i]],format_align)
		
		# row=84
		# for i in range(len(travel1)):
		# 	row=row+1
		# 	sheet10.write(row,c,DATA['summary']['travel'][travel1[i]][time1[i]],format_align)
		
		num_fmt = book.add_format({'num_format': '#,###'})

		sheet10.conditional_format('A1:T50', {'type':'cell', 
												'criteria':'>=', 
												'value': '100', 
												'format': num_fmt})
												
	

# draef export_movement_consistency_xls(request):
# 	to_date = request.GET.get('to_date',None)
# 	from_date = request.GET.get('from_date', None)

# 	to_date = datetime.strptime(to_date, "%m-%d-%Y").date()
# 	from_date = datetime.strptime(from_date, "%m-%d-%Y").date()
# 	filename = '{}_Movemenr_Consistency_data.xlsx'.format(request.user.username)
# 	response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
# 	response['Content-Disposition'] = "attachment; filename={}".format(filename)
# 	book = Workbook(response,{'in_memory': True})
# 	sheet11 = book.add_worksheet('Movement Consistency')
# 	date_format = book.add_format({'num_format': 'm-d-yy'})
# 	# steps_qs = Steps.objects.filter(
# 	# 	user_ql__created_at__range=(from_date, to_date),
# 	# 	user_ql__user = request.user).order_by('-user_ql__created_at')

# 	# steps_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
# 	# 	 for q in steps_qs }
# 	current_date = to_date
# 	r = 4
# 	# ?from_date=01-31-2018&to_date=01-05-2018
# 	if to_date and from_date:
# 		while (current_date >= from_date):
# 			r = r + 1
# 			sheet11.write(r,0,current_date,date_format)
# 			current_date -= timedelta(days = 1)
# 	sheet11.set_row(3,45)
# 	steps_qs = Steps.objects.filter(
# 		user_ql__created_at__range=(from_date, to_date),
# 		user_ql__user = request.user).order_by('-user_ql__created_at')

# 	steps_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
# 		 for q in steps_qs }
# 	sheet11.write(2,0,"Hour")
# 	sheet11.write(3,0,"Date")
# 	sheet11.write(3,1,"Daily Movement Consistency Score")
# 	hours_range = ["Total Daily Steps","12:00 AM to 12:59 AM","01:00 AM to 01:59 AM","02:00 AM to 02:59 AM","03:00 AM to 03:59 AM","04:00 AM to 04:59 AM",
# 	"05:00 AM to 05:59 AM","06:00 AM to 06:59 AM","07:00 AM to 07:59 AM","08:00 AM to 08:59 AM","09:00 AM to 09:59 AM","10:00 AM to 10:59 AM","11:00 AM to 11:59 AM",
# 	"12:00 PM to 12:59 PM","01:00 PM to 01:59 PM","02:00 PM to 02:59 PM","03:00 PM to 03:59 PM","04:00 PM to 04:59 PM","05:00 PM to 05:59 PM",
# 	"06:00 PM to 06:59 PM","07:00 PM to 07:59 PM","08:00 PM to 08:59 PM","09:00 PM to 09:59 PM","10:00 PM to 10:59 PM","11:00 PM to 11:59 PM","Sleeping Hours",
# 	"Active Hours","Inactive Hours","Strength Hours"]
# 	hours_range1 = ["total_steps","12:00 AM to 12:59 AM","01:00 AM to 01:59 AM","02:00 AM to 02:59 AM","03:00 AM to 03:59 AM","04:00 AM to 04:59 AM",
# 	"05:00 AM to 05:59 AM","06:00 AM to 06:59 AM","07:00 AM to 07:59 AM","08:00 AM to 08:59 AM","09:00 AM to 09:59 AM","10:00 AM to 10:59 AM","11:00 AM to 11:59 AM",
# 	"12:00 PM to 12:59 PM","01:00 PM to 01:59 PM","02:00 PM to 02:59 PM","03:00 PM to 03:59 PM","04:00 PM to 04:59 PM","05:00 PM to 05:59 PM",
# 	"06:00 PM to 06:59 PM","07:00 PM to 07:59 PM","08:00 PM to 08:59 PM","09:00 PM to 09:59 PM","10:00 PM to 10:59 PM","11:00 PM to 11:59 PM","sleeping_hours",
# 	"active_hours","inactive_hours"]
# 	columns = ['movement_consistency']
# 	col_num = 2
# 	start_num = 12
# 	start_digit =':01'
# 	end_digit = ':59'
# 	for hour in range(1,25,1):
# 		col_num += 1
# 		sheet11.write(2,col_num,hour)
# 	col_num1 = 1
# 	for col_num in range(len(hours_range)):
# 		col_num1 += 1
# 		sheet11.write(3,col_num1,hours_range[col_num])
# 	current_date = to_date
# 	row_num = 4
# 	row = 4
# 	col = 2
# 	while (current_date >= from_date):
# 		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
# 		if steps_data:
# 			steps_data = steps_data.__dict__
# 			# logic
# 			row += 1
# 			# print(steps_data)
# 			for x,key in enumerate(columns):
# 				steps_string = steps_data['movement_consistency']
# 				if steps_string:
# 					json1_data = json.loads(steps_string)
# 					# print (json1_data)
# 					# print(json1_data.keys())
# 					# if json1_data['12:00 AM to 12:59 AM']
# 					# row += 1
# 					sheet11.write(row,col+x,json1_data['total_steps'])
# 					sheet11.write(row,col+x+1,json1_data['12:00 AM to 12:59 AM']['steps'])
# 					sheet11.write(row,col+x+2,json1_data['01:00 AM to 01:59 AM']['steps'])
# 					sheet11.write(row,col+x+3,json1_data['02:00 AM to 02:59 AM']['steps'])
# 					sheet11.write(row,col+x+4,json1_data['03:00 AM to 03:59 AM']['steps'])
# 					sheet11.write(row,col+x+5,json1_data['04:00 AM to 04:59 AM']['steps'])
# 					sheet11.write(row,col+x+6,json1_data['05:00 AM to 05:59 AM']['steps'])
# 					sheet11.write(row,col+x+7,json1_data['06:00 AM to 06:59 AM']['steps'])
# 					sheet11.write(row,col+x+8,json1_data['07:00 AM to 07:59 AM']['steps'])
# 					sheet11.write(row,col+x+9,json1_data['08:00 AM to 08:59 AM']['steps'])
# 					sheet11.write(row,col+x+10,json1_data['09:00 AM to 09:59 AM']['steps'])
# 					sheet11.write(row,col+x+11,json1_data['10:00 AM to 10:59 AM']['steps'])
# 					sheet11.write(row,col+x+12,json1_data['11:00 AM to 11:59 AM']['steps'])
# 					sheet11.write(row,col+x+13,json1_data['12:00 PM to 12:59 PM']['steps'])
# 					sheet11.write(row,col+x+14,json1_data['01:00 PM to 01:59 PM']['steps'])
# 					sheet11.write(row,col+x+15,json1_data['02:00 PM to 02:59 PM']['steps'])
# 					sheet11.write(row,col+x+16,json1_data['03:00 PM to 03:59 PM']['steps'])
# 					sheet11.write(row,col+x+17,json1_data['04:00 PM to 04:59 PM']['steps'])
# 					sheet11.write(row,col+x+18,json1_data['05:00 PM to 05:59 PM']['steps'])
# 					sheet11.write(row,col+x+19,json1_data['06:00 PM to 06:59 PM']['steps'])
# 					sheet11.write(row,col+x+20,json1_data['07:00 PM to 07:59 PM']['steps'])
# 					sheet11.write(row,col+x+21,json1_data['08:00 PM to 08:59 PM']['steps'])
# 					sheet11.write(row,col+x+22,json1_data['09:00 PM to 09:59 PM']['steps'])
# 					sheet11.write(row,col+x+23,json1_data['10:00 PM to 10:59 PM']['steps'])
# 					sheet11.write(row,col+x+24,json1_data['11:00 PM to 11:59 PM']['steps'])
# 					sheet11.write(row,col+x+25,json1_data['sleeping_hours'])
# 					sheet11.write(row,col+x+26,json1_data['active_hours'])
# 					sheet11.write(row,col+x+27,json1_data['inactive_hours'])
# 					sheet11.write(row,col+x+28,json1_data.get['strength_hours',0])


# 			# for x,key1 in enumerate(hours_range1):
# 			# 	if json1_data[key1]['status'] == 'active':
# 			# 		sheet11.write.(row,column,json1_data[key1]['steps'])
# 			# 	else:
# 			# 		sheet11.write.(row,column,json1_data[key1]['steps'])


# 		else:
# 			row += 1
# 			sheet11.write(row,col,'')
# 		current_date -= timedelta(days=1)
	
	book.close()
	return response