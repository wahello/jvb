from datetime import datetime, timedelta
import ast
import xlwt
import time
import xlsxwriter	
from xlwt import easyxf
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from xlsxwriter.workbook import Workbook

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
					Alcohol


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

def export_users_xls(request):
	to_date = request.GET.get('to_date',None)
	from_date = request.GET.get('from_date', None)

	to_date = datetime.strptime(to_date, "%m-%d-%Y").date()
	from_date = datetime.strptime(from_date, "%m-%d-%Y").date()

	filename = '{}_raw_data_{}_to_{}.xlsx'.format(request.user.username,
		from_date.strftime('%b_%d_%Y'),to_date.strftime('%b_%d_%Y'))
	response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
	response['Content-Disposition'] = "attachment; filename={}".format(filename) 
	book = Workbook(response,{'in_memory': True})
	sheet1 = book.add_worksheet('All Stats')
	sheet2 = book.add_worksheet('Grades')
	sheet3 = book.add_worksheet('Steps')
	sheet4 = book.add_worksheet('Sleep')
	sheet5 = book.add_worksheet('Food')
	sheet6 = book.add_worksheet('Alcohol')
	sheet7 = book.add_worksheet('All Raw Data')
	sheet8 = book.add_worksheet('Swim Stats')
	sheet9 = book.add_worksheet('Bike Stats')
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
	sheet1.repeat_rows(0)
	sheet1.repeat_columns(0)
	sheet1.set_row(38, 150)

	date_format = book.add_format({'num_format': 'm-d-yy'})
	current_date = to_date
	r = 0
	date1 = []
	if to_date and from_date :
		while (current_date >= from_date):
			r = r + 1
			sheet1.write(0,r,current_date,date_format)
			date1.append(current_date)
			current_date -= timedelta(days = 1)
	format_red = book.add_format({'align':'left', 'bg_color': 'red','num_format': '#,##0'})
	format_green = book.add_format({'align':'left', 'bg_color': 'green','num_format': '#,##0'})
	format_yellow = book.add_format({'align':'left', 'bg_color': 'yellow','num_format': '#,##0'})
	format = book.add_format({'align':'left','num_format': '#,##0'})
	format1 = book.add_format({'align':'left','num_format': '0.00'})
	# Grades
	columns = ['overall_health_grade','overall_health_gpa','movement_non_exercise_steps_grade',
			   'movement_consistency_grade','avg_sleep_per_night_grade','exercise_consistency_grade',
			   'overall_workout_grade','workout_duration_grade','workout_effortlvl_grade',
			   'avg_exercise_hr_grade','prcnt_unprocessed_food_consumed_grade','alcoholic_drink_per_week_grade',
			   'sleep_aid_penalty','ctrl_subs_penalty','smoke_penalty']
	columnsw = ['Overall Health Grade','Overall Health Gpa','Movement Non Exercise Steps Grade',
			   'Movement Consistency Grade','Avg Sleep Per Night Grade','Exercise Consistency Grade',
			   'Overall Workout Grade','Workout Duration Grade','Workout Effort Level Grade',
			   'Average Exercise Heartrate Grade','Percentage of Unprocessed Food Grade','Alcoholic Drink Per Week Grade',
			   'Sleep Aid Penalty','Control Substance Penalty','Smoke Penalty']
	created1 = list(UserQuickLook.objects.filter(created_at__isnull=False).values())
	bold = book.add_format({'bold': True})
	r = 0
	row_num = 0
	sheet1.write(0,0,"All Stats(month-day-year)")
	sheet1.write(2,0,"Grades",bold)
	col_num1 = 2
	for col_num in range(len(columnsw)):
		col_num1 = col_num1 + 1
		sheet1.write(col_num1, row_num, columnsw[col_num])
	rows = Grades.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	rowsg = Grades.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()

	rowss = UserQuickLook.objects.values('created_at')
	count = 0
	i = 0
	for row in rows:
		count = count + 1
		row_num += 1
		inv_map = {v: k for k, v in row.items()}
		for i,key in enumerate(columns):
				if row[key] == 'A':
					sheet1.write(i+3,row_num, row[key],format_green)
				elif row[key] == 'B':
					sheet1.write(i+3,row_num, row[key],format_green)
				elif row[key] == 'C':
					sheet1.write(i+3,row_num, row[key],format_yellow)
				elif row[key] == 'D':
					sheet1.write(i+3,row_num, row[key],format_yellow)
				elif row[key] == 'F':
					sheet1.write(i+3,row_num, row[key],format_red)
				else:
					sheet1.write(i+3,row_num, row[key],format1)

	# Swim status

	columns1 = ['pace_per_100_yard','total_strokes']
	columns1W = ['Pace Per 100 Yard','Total Strokes']
	sheet1.write(19, 0, "Swim Stats",bold)
	col_num2 = 19
	a = len(rows)
	for col_num1 in range(len(columns1W)):
			col_num2 = col_num2 + 1
			sheet1.write(col_num2 , row_num - a  , columns1W[col_num1],format)
	rows1 = SwimStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	a = len(rows)
	i1 = 19
	for row in rows1:
		row_num += 1
		for i,key in enumerate(columns1):
			sheet1.write(i1+i+1,row_num - a, row[key],format)

	# Bike
	columns3 = ['avg_speed', 'avg_power','avg_speed_per_mile','avg_cadence']
	columns3W = ['Avg Speed (MPH) Bike', 'Avg Power Bike','Avg_Speed Per Mile','Avg Cadence Bike']
	sheet1.write(23, 0, "Bike Stats",bold)
	col_num2 = 23
	a = len(rows) + len(rows1)
	for col_num in range(len(columns3W)):
		col_num2 = col_num2 + 1
		sheet1.write(col_num2, row_num - a, columns3W[col_num],format)
	rows2 = BikeStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	a = len(rows) + len(rows1)
	i1 = 23
	for row in rows2:
		row_num += 1
		for i,key in enumerate(columns3):
			sheet1.write(i1+i+1,row_num - a, row[key],format)
	# Steps

	columns4 = ['movement_consistency','non_exercise_steps', 'exercise_steps', 'total_steps', 'floor_climed']
	columns4W = ['Movement Consistency','Non Exercise Steps', 'Exercise Steps', 'Total Steps', 'Floors Climed']
	sheet1.write(29, 0, "Steps",bold)
	col_num2 = 29
	a = len(rows) + len(rows1) + len(rows2)
	for col_num in range(len(columns4W)):
		 col_num2 = col_num2 + 1
		 sheet1.write(col_num2,row_num - a, columns4W[col_num])
	rows3 = Steps.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	i1 = 29
	a = len(rows) + len(rows1) + len(rows2)
	for g,h in zip(rows3,rowsg):
		row_num += 1
		for i,key in enumerate(columns4):
				if i == 1 and h['movement_non_exercise_steps_grade'] == 'A':
					sheet1.write(i1+i+1,row_num - a, g[key], format_green)
				elif i == 1 and h['movement_non_exercise_steps_grade'] == 'B':
					sheet1.write(i1+i+1,row_num - a, g[key], format_green)
				elif i == 1 and h['movement_non_exercise_steps_grade'] == 'C':
					sheet1.write(i1+i+1,row_num - a, g[key], format_yellow)
				elif i == 1 and h['movement_non_exercise_steps_grade'] == 'D':
					sheet1.write(i1+i+1,row_num - a, g[key], format_yellow)
				elif i == 1 and h['movement_non_exercise_steps_grade'] == 'F':
					sheet1.write(i1+i+1,row_num - a, g[key], format_red)
				elif i == 0 and h['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and g[key]:
					sheet1.write(i1+i+1,row_num - a, ast.literal_eval(g[key])['inactive_hours'], format_green)
				elif i == 0 and h['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and g[key]:
					sheet1.write(i1+i+1,row_num - a, ast.literal_eval(g[key])['inactive_hours'], format_green)
				elif i == 0 and h['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and g[key]:
					sheet1.write(i1+i+1,row_num - a, ast.literal_eval(g[key])['inactive_hours'], format_yellow)
				elif i == 0 and h['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and g[key]:
					sheet1.write(i1+i+1,row_num - a, ast.literal_eval(g[key])['inactive_hours'], format_yellow)
				elif i == 0 and h['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and g[key]:
					sheet1.write(i1+i+1,row_num - a,ast.literal_eval(g[key])['inactive_hours'], format_red)
				else:
					sheet1.write(i1+i+1,row_num - a, g[key], format)
	#Sleep

	columns5 = ['sleep_per_user_input','sleep_comments',  'sleep_aid','sleep_per_wearable', 'sleep_bed_time', 'sleep_awake_time',
			   'deep_sleep','light_sleep','awake_time']
	columns5W = ['Sleep Per User Input (excluding awake time)','Sleep Comments', 'Sleep Aid taken?', 'Sleep per Wearable (excluding awake time)',
	'Sleep Bed Time', 'Sleep Awake Time','Deep Sleep (hh:mm)','Light Sleep (hh:mm)','Awake Time (hh:mm)']
	sheet1.write(36, 0, "Sleep",bold)
	col_num2 = 36
	a = len(rows) + len(rows1) + len(rows2) + len(rows3)
	for col_num in range(len(columns5W)):
		col_num2 = col_num2 + 1
		sheet1.write(col_num2, row_num - a , columns5W[col_num])
	rows4 = Sleep.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	i1 = 36
	format2 = book.add_format()
	format2.set_align('top')
	format2.set_text_wrap()

	format2.set_shrink()
	for m,n in zip(rows4,rowsg):
		row_num += 1
		for i, key in enumerate(columns5):
				if i == 3 and n['avg_sleep_per_night_grade'] == 'A':
					sheet1.write(i1 + i + 1, row_num - a, m[key], format_green)
				elif i == 3 and n['avg_sleep_per_night_grade'] == 'B':
					sheet1.write(i1 + i + 1, row_num - a, m[key], format_green)
				elif i == 3 and n['avg_sleep_per_night_grade'] == 'C':
					sheet1.write(i1 + i + 1, row_num - a, m[key], format_yellow)
				elif i == 3 and n['avg_sleep_per_night_grade'] == 'D':
					sheet1.write(i1 + i + 1, row_num - a, m[key], format_yellow)
				elif i == 3 and n['avg_sleep_per_night_grade'] == 'F':
					sheet1.write(i1 + i + 1, row_num - a, m[key], format_red)
				elif i == 1:
					sheet1.write(i1 + i + 1, row_num - a, m[key], format2)
				else:
					sheet1.write(i1 + i + 1, row_num - a, m[key], format)
	# Food

	columns6 = ['prcnt_non_processed_food', 'non_processed_food', 'diet_type']
	columns6W = ['Percentage of Unprocessed Food', 'Non Processed Food', 'Diet Type']
	sheet1.write(47, 0, "Food",bold)
	col_num2 = 47
	a = len(rows) + len(rows1) + len(rows2) + len(rows3) + len(rows4)
	for col_num in range(len(columns6W)):
		col_num2 = col_num2 + 1
		sheet1.write(col_num2, row_num - a, columns6W[col_num])
	i1 = 47
	rows5 = Food.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	for j1,k1 in zip (rows5,rowsg):
		row_num += 1
		for i, key in enumerate(columns6):
			if k1['prcnt_unprocessed_food_consumed_grade'] == 'A' and i == 0:
				sheet1.write(i1 + i + 1, row_num - a,str(int(j1[key])) + '%' ,format_green)
			elif k1['prcnt_unprocessed_food_consumed_grade'] == 'B' and i == 0:
				sheet1.write(i1 + i + 1, row_num - a, str(int(j1[key])) + '%' ,format_green)
			elif k1['prcnt_unprocessed_food_consumed_grade'] == 'C' and i == 0:
				sheet1.write(i1 + i + 1, row_num - a,str(int(j1[key])) + '%' ,format_yellow)
			elif k1['prcnt_unprocessed_food_consumed_grade'] == 'D' and i == 0:
				sheet1.write(i1 + i + 1, row_num - a, str(int(j1[key])) + '%' ,format_yellow)
			elif k1['prcnt_unprocessed_food_consumed_grade'] == 'F' and i == 0:
				sheet1.write(i1 + i + 1, row_num - a,str(int(j1[key])) + '%' ,format_red)
			else:
				sheet1.write(i1 + i + 1, row_num - a, j1[key], format)

	#Alcohol

	columns7 = ['alcohol_day', 'alcohol_week']
	columns7W = ['Alcohol Per Day', 'Average Alcohol Consumed per Week']
	sheet1.write(52, 0, "Alcohol",bold)
	col_num2 = 52
	a = len(rows) + len(rows1) + len(rows2) + len(rows3) + len(rows4) + len(rows5)
	for col_num in range(len(columns7W)):
		   col_num2 = col_num2 + 1
		   sheet1.write(col_num2, row_num - a, columns7W[col_num])
	rows6 = Alcohol.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	i1 = 52
	for e,f in zip(rows6,rowsg):
		row_num += 1
		for i, key in enumerate(columns7):
			if i == 1 and f['alcoholic_drink_per_week_grade'] == 'A':
				sheet1.write(i1 + i + 1, row_num - a, e[key], format_green)
			elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'B':
				sheet1.write(i1 + i + 1, row_num - a, e[key], format_green)
			elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'C':
				sheet1.write(i1 + i + 1, row_num - a, e[key], format_yellow)
			elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'D':
				sheet1.write(i1 + i + 1, row_num - a, e[key], format_yellow)
			elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'F':
				sheet1.write(i1 + i + 1, row_num - a, e[key], format_red)
			else:
				sheet1.write(i1 + i + 1, row_num - a, e[key],format)

	#Grades sheet
	sheet2.repeat_rows(0)
	sheet2.repeat_columns(0)
	columns = ['overall_health_grade','overall_health_gpa','movement_non_exercise_steps_grade',
			   'movement_consistency_grade','avg_sleep_per_night_grade','exercise_consistency_grade',
			   'overall_workout_grade','workout_duration_grade','workout_effortlvl_grade',
			   'avg_exercise_hr_grade','prcnt_unprocessed_food_consumed_grade','alcoholic_drink_per_week_grade',
			   'sleep_aid_penalty','ctrl_subs_penalty','smoke_penalty']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			sheet2	.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet2.write(0, 0, "Grades",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columnsw)):
		col_num1 = col_num1 + 1
		sheet2.write(col_num1, row_num, columnsw[col_num])
	rows = Grades.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	for row in rows:
		row_num += 1
		for i,key in enumerate(columns):
				if row[key] == 'A':
					sheet2.write(i+2,row_num, row[key],format_green)
				elif row[key] == 'B':
					sheet2.write(i+2,row_num, row[key],format_green)
				elif row[key] == 'C':
					sheet2.write(i+2,row_num, row[key],format_yellow)
				elif row[key] == 'D':
					sheet2.write(i+2,row_num, row[key],format_yellow)
				elif row[key] == 'F':
					sheet2.write(i+2,row_num, row[key],format_red)
				else:
					sheet2.write(i+2,row_num, row[key],format)
	#Swim Stats sheet
	sheet8.repeat_rows(0)
	sheet8.repeat_columns(0)
	columns = ['pace_per_100_yard', 'total_strokes']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			sheet8.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet8.write(0, 0, "Swim Stats",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns1W)):
		col_num1 = col_num1 + 1
		sheet8.write(col_num1, row_num, columns1W[col_num])
	rows = SwimStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	for row in rows:
		row_num += 1
		for i, key in enumerate(columns):
			sheet8.write(i + 2, row_num, row[key],format)
	# Bike stats sheet
	sheet9.repeat_rows(0)
	sheet9.repeat_columns(0)
	columns = ['avg_speed', 'avg_power','avg_speed_per_mile','avg_cadence']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			sheet9.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet9.write(0, 0, "Bike Stats",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns3W)):
		col_num1 = col_num1 + 1
		sheet9.write(col_num1, row_num, columns3W[col_num])
	rows = BikeStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	for row in rows:
		row_num += 1
		for i, key in enumerate(columns):
	 		sheet9.write(i + 2, row_num, row[key], format)

	# steps stats sheet
	sheet3.repeat_rows(0)
	sheet3.repeat_columns(0)
	columns = ['movement_consistency','non_exercise_steps', 'exercise_steps', 'total_steps', 'floor_climed']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			sheet3.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet3.write(0, 0, "Steps",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns4W)):
		col_num1 = col_num1 + 1
		sheet3.write(col_num1, row_num, columns4W[col_num])
	rows = Steps.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()

	for a1,b1 in zip(rows,rowsg):
		row_num += 1
		for i, key in enumerate(columns):
				if i == 1 and b1['movement_non_exercise_steps_grade'] == 'A':
					sheet3.write(i + 2, row_num, a1[key], format_green)
				elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'B':
					sheet3.write(i + 2, row_num, a1[key], format_green)
				elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'C':
					sheet3.write(i + 2, row_num, a1[key], format_yellow)
				elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'D':
					sheet3.write(i + 2, row_num, a1[key], format_yellow)
				elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'F':
					sheet3.write(i + 2, row_num, a1[key], format_red)
				elif i == 0 and b1['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and a1[key]:
					sheet3.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], format_green)
				elif i == 0 and b1['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and a1[key]:
					sheet3.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], format_green)
				elif i == 0 and b1['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and a1[key]:
					sheet3.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], format_yellow)
				elif i == 0 and b1['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and a1[key]:
					sheet3.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], format_yellow)
				elif i == 0 and b1['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and a1[key]:
					sheet3.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], format_red)
				else:
					sheet3.write(i + 2, row_num, a1[key], format)

	# sleep stats sheet
	sheet4.repeat_rows(0)
	sheet4.repeat_columns(0)
	columns = ['sleep_per_user_input','sleep_comments',  'sleep_aid','sleep_per_wearable', 'sleep_bed_time', 'sleep_awake_time',
			   'deep_sleep','light_sleep','awake_time']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			sheet4.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet4.write(0, 0, "Sleep",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns5W)):
		col_num1 = col_num1 + 1
		sheet4.write(col_num1, row_num, columns5W[col_num])
	rows = Sleep.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	format2 = book.add_format()
	format2.set_align('top')
	format2.set_text_wrap()

	format2.set_shrink()
	# wrap = book.add_format({'text_wrap': True})
	sheet4.set_row(3, 150)
	
	for a2,b2 in zip (rows,rowsg):
		row_num += 1
		for i, key in enumerate(columns):
				if i == 3 and b2['avg_sleep_per_night_grade'] == 'A':
					sheet4.write(i + 2, row_num, a2[key],format_green)
				elif i == 3 and b2['avg_sleep_per_night_grade'] == 'B':
					sheet4.write(i + 2, row_num, a2[key],format_green)
				elif i == 3 and b2['avg_sleep_per_night_grade'] == 'C':
					sheet4.write(i + 2, row_num, a2[key], format_yellow)
				elif i == 3 and b2['avg_sleep_per_night_grade'] == 'D':
					sheet4.write(i + 2, row_num, a2[key], format_yellow)
				elif i == 3 and b2['avg_sleep_per_night_grade'] == 'F':
					sheet4.write(i + 2, row_num, a2[key], format_red)
				elif i == 1:
					sheet4.write(i + 2, row_num, a2[key],format2)
				else:
					sheet4.write(i + 2, row_num, a2[key],format)
	# Food sheet
	sheet5.repeat_rows(0)
	sheet5.repeat_columns(0)
	columns = ['prcnt_non_processed_food', 'non_processed_food', 'diet_type']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			sheet5.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet5.write(0, 0, "Food",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns6W)):
		col_num1 = col_num1 + 1
		sheet5.write(col_num1, row_num, columns6W[col_num])
	rows = Food.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	format2 = book.add_format()
	format2.set_align('fill')

	for j,k in zip (rows,rowsg):
		row_num += 1
		for i, key in enumerate(columns):
			if k['prcnt_unprocessed_food_consumed_grade'] == 'A' and i == 0:
				sheet5.write(i + 2, row_num, str(int(j[key])) + '%' ,format_green)
			elif k['prcnt_unprocessed_food_consumed_grade'] == 'B' and i == 0:
				sheet5.write(i + 2, row_num, str(int(j[key])) + '%' ,format_green)
			elif k['prcnt_unprocessed_food_consumed_grade'] == 'C' and i == 0:
				sheet5.write(i + 2, row_num, str(int(j[key])) + '%' ,format_yellow)
			elif k['prcnt_unprocessed_food_consumed_grade'] == 'D' and i == 0:
				sheet5.write(i + 2, row_num, str(int(j[key])) + '%' ,format_yellow)
			elif k['prcnt_unprocessed_food_consumed_grade'] == 'F' and i == 0:
				sheet5.write(i + 2, row_num, str(int(j[key])) + '%' ,format_red)
			else:
				sheet5.write(i + 2, row_num, j[key], format2)
	# Alcohol sheet
	sheet6.repeat_rows(0)
	sheet6.repeat_columns(0)
	columns = ['alcohol_day', 'alcohol_week']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			sheet6.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet6.write(0, 0, "Alcohol",bold)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns7W)):
		col_num1 = col_num1 + 1
		sheet6.write(col_num1, row_num, columns7W[col_num])
	rows = Alcohol.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	for a,b in zip (rows,rowsg):
		row_num += 1
		for i, key in enumerate(columns):
			if i == 1 and b['alcoholic_drink_per_week_grade'] == 'A':
				sheet6.write(i + 2, row_num, a[key], format_green)
			elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'B':
				sheet6.write(i + 2, row_num, a[key], format_green)
			elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'C':
				sheet6.write(i + 2, row_num, a[key], format_yellow)
			elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'D':
				sheet6.write(i + 2, row_num, a[key], format_yellow)
			elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'F':
				sheet6.write(i + 2, row_num, a[key], format_red)
			else:
				sheet6.write(i + 2, row_num, a[key], format)

	book.close()
	return response