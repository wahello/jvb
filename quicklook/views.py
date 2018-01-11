from datetime import datetime, timedelta
import ast
import xlwt
import time
from xlwt import easyxf
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

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

	file_download_name = '{}_raw_data_{}_to_{}.xls'.format(
		request.user.username,
		from_date.strftime("%b %d, %Y"),
		to_date.strftime("%b %d, %Y")
	)

	response = HttpResponse(content_type='application/ms-excel')
	response['Content-Disposition'] = 'attachment; filename="{}"'.format(file_download_name)
	# date_of_joined = User.objects.values_list(request.user.date_joined)
	# print(date_of_joined)
	aaa = request.user.date_joined
	print(aaa)
	print("Unix Timestamp: ",(time.mktime(aaa.timetuple())))
	wb = xlwt.Workbook(encoding='utf-8')
	ws = wb.add_sheet('All Stats')
	ws1 = wb.add_sheet('Grades')
	ws2 = wb.add_sheet('Swim Stats')
	ws3 = wb.add_sheet('Bike Stats')
	ws4 = wb.add_sheet('Steps')
	ws5 = wb.add_sheet('Sleep')
	ws6 = wb.add_sheet('Food')
	ws7 = wb.add_sheet('Alcohol')


	row_num = 0
	ws.set_panes_frozen(True)
	ws.set_horz_split_pos(1)
	ws.set_vert_split_pos(1)
	ws.col(0).width = int(40 * 260)
	for d in range(1,256,1):
		ws.col(d).width = int(10 * 260)
	font_style = xlwt.XFStyle()
	font_style.font.bold = True
	style = xlwt.XFStyle()
	style.num_format_str = 'MM-D-YY'
	base_style = xlwt.easyxf("align: wrap yes ; alignment: horizontal left")
	# perc_style = xlwt.easyxf("align: wrap yes ; alignment: horizontal left ;num_format_str : '0%'")
	f_style = easyxf("alignment: horizontal left ; pattern: pattern solid, fore_colour red;")
	ab_style = easyxf("alignment: horizontal left ; pattern: pattern solid, fore_colour green;")
	cd_style = easyxf("alignment: horizontal left ; pattern: pattern solid, fore_colour yellow;")

	#All Status
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
	current_date = to_date
	created1 = list(UserQuickLook.objects.filter(created_at__isnull=False).values())
	date2 = []
	# for created2 in created1:
	for i,key3 in enumerate(created1):
			date2.append(key3['created_at'])
	r = 0
	date1 = []
	if to_date and from_date :
		while (current_date >= from_date):
			r = r + 1
			ws.write(0,r,current_date,style)
			date1.append(current_date)
			current_date -= timedelta(days = 1)

	ws.write(0,0,"All Stats(month-day-year)",font_style)
	ws.write(2,0,"Grades",font_style)
	col_num1 = 2
	for col_num in range(len(columnsw)):
		col_num1 = col_num1 + 1
		ws.write(col_num1, row_num, columnsw[col_num], base_style)
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
		if set(date2).intersection(date1):
			count = count + 1
			# row_num += 1
			inv_map = {v: k for k, v in row.items()}
			for i,key in enumerate(columns):
				if row[key] == 'A':
					ws.write(i+3,row_num, row[key],ab_style)
				elif row[key] == 'B':
					ws.write(i+3,row_num, row[key],ab_style)
				elif row[key] == 'C':
					ws.write(i+3,row_num, row[key],cd_style)
				elif row[key] == 'D':
					ws.write(i+3,row_num, row[key],cd_style)
				elif row[key] == 'F':
					ws.write(i+3,row_num, row[key],f_style)
				else:
					ws.write(i+3,row_num, row[key],base_style)
		else:
			ws.write(i+3+count,row_num, 'NO Data',base_style)
			row_num += 1




	# Swim status
	font_style = xlwt.XFStyle()
	font_style.font.bold = True
	columns1 = ['pace_per_100_yard','total_strokes']
	columns1W = ['Pace Per 100 Yard','Total Strokes']
	ws.write(19, 0, "Swim Stats",font_style)
	col_num2 = 19
	a = len(rows)
	for col_num1 in range(len(columns1W)):
			col_num2 = col_num2 + 1
			ws.write(col_num2 , row_num - a  , columns1W[col_num1],base_style)
	rows1 = SwimStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	a = len(rows)
	i1 = 19
	for row in rows1:
		row_num += 1
		for i,key in enumerate(columns1):
			ws.write(i1+i+1,row_num - a, row[key],base_style)

	# Bike
	font_style = xlwt.XFStyle()
	font_style.font.bold = True
	columns3 = ['avg_speed', 'avg_power','avg_speed_per_mile','avg_cadence']
	columns3W = ['Avg Speed (MPH) Bike', 'Avg Power Bike','Avg_Speed Per Mile','Avg Cadence Bike']
	ws.write(23, 0, "Bike Stats",font_style)
	col_num2 = 23
	a = len(rows) + len(rows1)
	for col_num in range(len(columns3W)):
		col_num2 = col_num2 + 1
		ws.write(col_num2, row_num - a, columns3W[col_num],base_style)
	rows2 = BikeStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	a = len(rows) + len(rows1)
	i1 = 23
	for row in rows2:
		row_num += 1
		for i,key in enumerate(columns3):
			ws.write(i1+i+1,row_num - a, row[key],base_style)

	# Steps
	font_style = xlwt.XFStyle()
	font_style.font.bold = True
	font_style1 = xlwt.XFStyle()
	font_style1.num_format_str='#,##0'
	alignment = xlwt.Alignment()
	alignment.horz = xlwt.Alignment.HORZ_LEFT
	font_style1.alignment = alignment
	font_style4 = xlwt.XFStyle()
	font_style.num_format_str='#,##0'
	alignment = xlwt.Alignment()
	alignment.horz = xlwt.Alignment.HORZ_LEFT
	font_style4.alignment = alignment
	pattern = xlwt.Pattern()
	pattern.pattern = xlwt.Pattern.SOLID_PATTERN
	pattern.pattern_fore_colour = 17
	font_style4.pattern = pattern
	font_style1 = xlwt.XFStyle()
	font_style1.num_format_str='#,##0'
	alignment = xlwt.Alignment()
	alignment.horz = xlwt.Alignment.HORZ_LEFT
	font_style1.alignment = alignment
	pattern = xlwt.Pattern()
	pattern.pattern = xlwt.Pattern.SOLID_PATTERN
	pattern.pattern_fore_colour = 5
	font_style1.pattern = pattern
	font_style2 = xlwt.XFStyle()
	font_style2.num_format_str='#,##0'
	alignment = xlwt.Alignment()
	alignment.horz = xlwt.Alignment.HORZ_LEFT
	font_style2.alignment = alignment
	pattern = xlwt.Pattern()
	pattern.pattern = xlwt.Pattern.SOLID_PATTERN
	pattern.pattern_fore_colour = 2
	font_style2.pattern = pattern
	font_style3 = xlwt.XFStyle()
	font_style3.num_format_str='#,##0'
	alignment = xlwt.Alignment()
	alignment.horz = xlwt.Alignment.HORZ_LEFT
	font_style3.alignment = alignment
	columns4 = ['movement_consistency','non_exercise_steps', 'exercise_steps', 'total_steps', 'floor_climed']
	columns4W = ['Movement Consistency','Non Exercise Steps', 'Exercise Steps', 'Total Steps', 'Floors Climed']
	ws.write(29, 0, "Steps",font_style)
	col_num2 = 29
	a = len(rows) + len(rows1) + len(rows2)
	for col_num in range(len(columns4W)):
		 col_num2 = col_num2 + 1
		 ws.write(col_num2,row_num - a, columns4W[col_num], base_style)
	rows3 = Steps.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	i1 = 29
	a = len(rows) + len(rows1) + len(rows2)
	for g,h in zip(rows3,rowsg):
		row_num += 1
		for i,key in enumerate(columns4):
				if i == 1 and h['movement_non_exercise_steps_grade'] == 'A':
					ws.write(i1+i+1,row_num - a, g[key], font_style4)
				elif i == 1 and h['movement_non_exercise_steps_grade'] == 'B':
					ws.write(i1+i+1,row_num - a, g[key], font_style4)
				elif i == 1 and h['movement_non_exercise_steps_grade'] == 'C':
					ws.write(i1+i+1,row_num - a, g[key], font_style1)
				elif i == 1 and h['movement_non_exercise_steps_grade'] == 'D':
					ws.write(i1+i+1,row_num - a, g[key], font_style1)
				elif i == 1 and h['movement_non_exercise_steps_grade'] == 'F':
					ws.write(i1+i+1,row_num - a, g[key], font_style2)
				elif i == 0 and h['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and g[key]:
					ws.write(i1+i+1,row_num - a, ast.literal_eval(g[key])['inactive_hours'], font_style4)
				elif i == 0 and h['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and g[key]:
					ws.write(i1+i+1,row_num - a, ast.literal_eval(g[key])['inactive_hours'], font_style4)
				elif i == 0 and h['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and g[key]:
					ws.write(i1+i+1,row_num - a, ast.literal_eval(g[key])['inactive_hours'], font_style1)
				elif i == 0 and h['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and g[key]:
					ws.write(i1+i+1,row_num - a, ast.literal_eval(g[key])['inactive_hours'], font_style1)
				elif i == 0 and h['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and g[key]:
					ws.write(i1+i+1,row_num - a,ast.literal_eval(g[key])['inactive_hours'], font_style2)
				else:
					ws.write(i1+i+1,row_num - a, g[key], font_style3)
	# Sleep
	font_style = xlwt.XFStyle()
	font_style.font.bold = True
	columns5 = ['sleep_per_wearable','sleep_comments', 'sleep_per_user_input', 'sleep_aid', 'sleep_bed_time', 'sleep_awake_time',
			   'deep_sleep','light_sleep','awake_time']
	columns5W = ['Sleep per Wearable (excluding awake time)','Sleep Comments','Sleep Per User Input (excluding awake time)', 'Sleep Aid', 'Sleep Bed Time', 'Sleep Awake Time',
			   'Deep Sleep','Light Sleep','Awake Time']
	ws.write(36, 0, "Sleep",font_style)
	col_num2 = 36
	a = len(rows) + len(rows1) + len(rows2) + len(rows3)
	for col_num in range(len(columns5W)):
		col_num2 = col_num2 + 1
		ws.write(col_num2, row_num - a , columns5W[col_num], base_style)
	rows4 = Sleep.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	i1 = 36
	# for row in rows4:
	# 	row_num += 1
	# 	for i, key in enumerate(columns5):
	# 	   ws.write(i1 + i + 1, row_num - a, row[key],base_style)
	for m,n in zip(rows4,rowsg):
		row_num += 1
		for i, key in enumerate(columns5):
				if i == 2 and n['avg_sleep_per_night_grade'] == 'A':
					ws.write(i1 + i + 1, row_num - a, m[key], ab_style)
				elif i == 2 and n['avg_sleep_per_night_grade'] == 'B':
					ws.write(i1 + i + 1, row_num - a, m[key], ab_style)
				elif i == 2 and n['avg_sleep_per_night_grade'] == 'C':
					ws.write(i1 + i + 1, row_num - a, m[key], cd_style)
				elif i == 2 and n['avg_sleep_per_night_grade'] == 'D':
					ws.write(i1 + i + 1, row_num - a, m[key], cd_style)
				elif i == 2 and n['avg_sleep_per_night_grade'] == 'F':
					ws.write(i1 + i + 1, row_num - a, m[key], f_style)
				else:
					ws.write(i1 + i + 1, row_num - a, m[key], base_style)
	# Food
	font_style = xlwt.XFStyle()
	font_style.font.bold = True
	columns6 = ['prcnt_non_processed_food', 'non_processed_food', 'diet_type']
	columns6W = ['Percentage of Unprocessed Food', 'Non Processed Food', 'Diet Type']
	ws.write(47, 0, "Food",font_style)
	col_num2 = 47
	a = len(rows) + len(rows1) + len(rows2) + len(rows3) + len(rows4)
	for col_num in range(len(columns6W)):
		col_num2 = col_num2 + 1
		ws.write(col_num2, row_num - a, columns6W[col_num],base_style)
	i1 = 47
	rows5 = Food.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	for row in rows5:
		row_num += 1
		for i, key in enumerate(columns6):
			if key == 'prcnt_non_processed_food':
				ws.write(i1 + i + 1, row_num - a, str(int(row[key]))+ '%')
			else:
				ws.write(i1 + i + 1, row_num - a, row[key],base_style)

	#Alcohol
	font_style = xlwt.XFStyle()
	font_style.font.bold = True
	columns7 = ['alcohol_day', 'alcohol_week']
	columns7W = ['Alcohol Per Day', 'Average Alcohol Consumed per Week']
	ws.write(52, 0, "Alcohol",font_style)
	col_num2 = 52
	a = len(rows) + len(rows1) + len(rows2) + len(rows3) + len(rows4) + len(rows5)
	for col_num in range(len(columns7W)):
		   col_num2 = col_num2 + 1
		   ws.write(col_num2, row_num - a, columns7W[col_num], base_style)
	rows6 = Alcohol.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	i1 = 52
	for e,f in zip(rows6,rowsg):
		row_num += 1
		for i, key in enumerate(columns7):
			if i == 1 and f['alcoholic_drink_per_week_grade'] == 'A':
				ws.write(i1 + i + 1, row_num - a, e[key], ab_style)
			elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'B':
				ws.write(i1 + i + 1, row_num - a, e[key], ab_style)
			elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'C':
				ws.write(i1 + i + 1, row_num - a, e[key], cd_style)
			elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'D':
				ws.write(i1 + i + 1, row_num - a, e[key], cd_style)
			elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'F':
				ws.write(i1 + i + 1, row_num - a, e[key], f_style)
			else:
				ws.write(i1 + i + 1, row_num - a, e[key],base_style)
    #Grades sheet
	ws1.set_panes_frozen(True)
	ws1.set_horz_split_pos(1)
	ws1.set_vert_split_pos(1)
	ws1.col(0).width = int(40 * 260)
	for d in range(1, 256, 1):
		ws1.col(d).width = int(10 * 260)
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
			ws1.write(0, r, current_date, style)
			current_date -= timedelta(days=1)
	ws1.write(0, 0, "Grades",font_style)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columnsw)):
		col_num1 = col_num1 + 1
		ws1.write(col_num1, row_num, columnsw[col_num], base_style)
	rows = Grades.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	for row in rows:
		row_num += 1
		for i,key in enumerate(columns):
				if row[key] == 'A':
					ws1.write(i+2,row_num, row[key],ab_style)
				elif row[key] == 'B':
					ws1.write(i+2,row_num, row[key],ab_style)
				elif row[key] == 'C':
					ws1.write(i+2,row_num, row[key],cd_style)
				elif row[key] == 'D':
					ws1.write(i+2,row_num, row[key],cd_style)
				elif row[key] == 'F':
					ws1.write(i+2,row_num, row[key],f_style)
				else:
					ws1.write(i+2,row_num, row[key],base_style)
	#Swim Stats sheet
	ws2.set_panes_frozen(True)
	ws2.set_horz_split_pos(1)
	ws2.set_vert_split_pos(1)
	ws2.col(0).width = int(40 * 260)
	for d in range(1, 256, 1):
		ws2.col(d).width = int(10 * 260)
	columns = ['pace_per_100_yard', 'total_strokes']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			ws2.write(0, r, current_date, style)
			current_date -= timedelta(days=1)
	ws2.write(0, 0, "Swim Stats",font_style)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns1W)):
		col_num1 = col_num1 + 1
		ws2.write(col_num1, row_num, columns1W[col_num], base_style)
	rows = SwimStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	for row in rows:
		row_num += 1
		for i, key in enumerate(columns):
			ws2.write(i + 2, row_num, row[key], base_style)
	# Bike stats sheet
	ws3.set_panes_frozen(True)
	ws3.set_horz_split_pos(1)
	ws3.set_vert_split_pos(1)
	ws3.col(0).width = int(40 * 260)
	for d in range(1, 256, 1):
		ws3.col(d).width = int(10 * 260)
	columns = ['avg_speed', 'avg_power','avg_speed_per_mile','avg_cadence']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			ws3.write(0, r, current_date, style)
			current_date -= timedelta(days=1)
	ws3.write(0, 0, "Bike Stats",font_style)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns3W)):
		col_num1 = col_num1 + 1
		ws3.write(col_num1, row_num, columns3W[col_num], base_style)
	rows = BikeStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	for row in rows:
		row_num += 1
		for i, key in enumerate(columns):
	 		ws3.write(i + 2, row_num, row[key], base_style)
	# steps stats sheet
	ws4.set_panes_frozen(True)
	ws4.set_horz_split_pos(1)
	ws4.set_vert_split_pos(1)
	ws4.col(0).width = int(40 * 260)
	for d in range(1, 256, 1):
		ws4.col(d).width = int(10 * 260)
	columns = ['movement_consistency','non_exercise_steps', 'exercise_steps', 'total_steps', 'floor_climed']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			ws4.write(0, r, current_date, style)
			current_date -= timedelta(days=1)
	ws4.write(0, 0, "Steps",font_style)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns4W)):
		col_num1 = col_num1 + 1
		ws4.write(col_num1, row_num, columns4W[col_num], base_style)
	rows = Steps.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	font_style4 = xlwt.XFStyle()
	font_style.num_format_str='#,##0'
	alignment = xlwt.Alignment()
	alignment.horz = xlwt.Alignment.HORZ_LEFT
	font_style4.alignment = alignment
	pattern = xlwt.Pattern()
	pattern.pattern = xlwt.Pattern.SOLID_PATTERN
	pattern.pattern_fore_colour = 17
	font_style4.pattern = pattern
	font_style1 = xlwt.XFStyle()
	font_style1.num_format_str='#,##0'
	alignment = xlwt.Alignment()
	alignment.horz = xlwt.Alignment.HORZ_LEFT
	font_style1.alignment = alignment
	pattern = xlwt.Pattern()
	pattern.pattern = xlwt.Pattern.SOLID_PATTERN
	pattern.pattern_fore_colour = 5
	font_style1.pattern = pattern
	font_style2 = xlwt.XFStyle()
	font_style2.num_format_str='#,##0'
	alignment = xlwt.Alignment()
	alignment.horz = xlwt.Alignment.HORZ_LEFT
	font_style2.alignment = alignment
	pattern = xlwt.Pattern()
	pattern.pattern = xlwt.Pattern.SOLID_PATTERN
	pattern.pattern_fore_colour = 2
	font_style2.pattern = pattern
	font_style3 = xlwt.XFStyle()
	font_style3.num_format_str='#,##0'
	alignment = xlwt.Alignment()
	alignment.horz = xlwt.Alignment.HORZ_LEFT
	font_style3.alignment = alignment
	for a1,b1 in zip(rows,rowsg):
		# print (a1,b1)
	# for row in rows:
		row_num += 1
		for i, key in enumerate(columns):
			# if(key == 'movement_consistency' and row[key]):
			# 	ws4.write(i+2,row_num , ast.literal_eval(a1[key])['inactive_hours'],base_style)
			# else:
			# 	ws4.write(i+2,row_num , row[key],base_style)
				if i == 1 and b1['movement_non_exercise_steps_grade'] == 'A':
					ws4.write(i + 2, row_num, a1[key], font_style4)
				elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'B':
					ws4.write(i + 2, row_num, a1[key], font_style4)
				elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'C':
					ws4.write(i + 2, row_num, a1[key], font_style1)
				elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'D':
					ws4.write(i + 2, row_num, a1[key], font_style1)
				elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'F':
					ws4.write(i + 2, row_num, a1[key], font_style2)
				elif i == 0 and b1['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and a1[key]:
					ws4.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], font_style4)
				elif i == 0 and b1['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and a1[key]:
					ws4.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], font_style4)
				elif i == 0 and b1['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and a1[key]:
					ws4.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], font_style1)
				elif i == 0 and b1['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and a1[key]:
					ws4.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], font_style1)
				elif i == 0 and b1['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and a1[key]:
					ws4.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], font_style2)
				else:
					ws4.write(i + 2, row_num, a1[key], font_style3)

	# sleep stats sheet
	ws5.set_panes_frozen(True)
	ws5.set_horz_split_pos(1)
	ws5.set_vert_split_pos(1)
	ws5.col(0).width = int(40 * 260)
	for d in range(1, 256, 1):
		ws5.col(d).width = int(10 * 260)
	columns = ['sleep_per_wearable', 'sleep_comments','sleep_per_user_input', 'sleep_aid', 'sleep_bed_time',
			   'sleep_awake_time','deep_sleep','light_sleep','awake_time']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			ws5.write(0, r, current_date, style)
			current_date -= timedelta(days=1)
	ws5.write(0, 0, "Sleep",font_style)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns5W)):
		col_num1 = col_num1 + 1
		ws5.write(col_num1, row_num, columns5W[col_num], base_style)
	rows = Sleep.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	for a2,b2 in zip (rows,rowsg):
		row_num += 1
		for i, key in enumerate(columns):
				if i == 1 and b2['avg_sleep_per_night_grade'] == 'A':
					ws5.write(i + 2, row_num, a2[key], ab_style)
				elif i == 1 and b2['avg_sleep_per_night_grade'] == 'B':
					ws5.write(i + 2, row_num, a2[key], ab_style)
				elif i == 1 and b2['avg_sleep_per_night_grade'] == 'C':
					ws5.write(i + 2, row_num, a2[key], cd_style)
				elif i == 1 and b2['avg_sleep_per_night_grade'] == 'D':
					ws5.write(i + 2, row_num, a2[key], cd_style)
				elif i == 1 and b2['avg_sleep_per_night_grade'] == 'F':
					ws5.write(i + 2, row_num, a2[key], f_style)
				else:
					ws5.write(i + 2, row_num, a2[key], base_style)
	# Food sheet
	ws6.set_panes_frozen(True)
	ws6.set_horz_split_pos(1)
	ws6.set_vert_split_pos(1)
	ws6.col(0).width = int(40 * 260)
	for d in range(1, 256, 1):
		ws6.col(d).width = int(10 * 260)
	columns = ['prcnt_non_processed_food', 'non_processed_food', 'diet_type']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			ws6.write(0, r, current_date, style)
			current_date -= timedelta(days=1)
	ws6.write(0, 0, "Food",font_style)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns6W)):
		col_num1 = col_num1 + 1
		ws6.write(col_num1, row_num, columns6W[col_num], base_style)
	rows = Food.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	for row in rows:
		row_num += 1
		for i, key in enumerate(columns):
			if key == 'prcnt_non_processed_food':
				ws6.write(i + 2, row_num, str(int(row[key])) + '%')
			else:
				ws6.write(i + 2, row_num, row[key], base_style)
	# Alcohol sheet
	ws7.set_panes_frozen(True)
	ws7.set_horz_split_pos(1)
	ws7.set_vert_split_pos(1)
	ws7.col(0).width = int(40 * 260)
	for d in range(1, 256, 1):
		ws7.col(d).width = int(10 * 260)
	columns = ['alcohol_day', 'alcohol_week']
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			ws7.write(0, r, current_date, style)
			current_date -= timedelta(days=1)
	ws7.write(0, 0, "Alcohol",font_style)
	col_num1 = 1
	row_num = 0
	for col_num in range(len(columns7W)):
		col_num1 = col_num1 + 1
		ws7.write(col_num1, row_num, columns7W[col_num], base_style)
	rows = Alcohol.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user=request.user).order_by('-user_ql__created_at').values()
	for a,b in zip (rows,rowsg):
		row_num += 1
		for i, key in enumerate(columns):
			if i == 1 and b['alcoholic_drink_per_week_grade'] == 'A':
				ws7.write(i + 2, row_num, a[key], ab_style)
			elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'B':
				ws7.write(i + 2, row_num, a[key], ab_style)
			elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'C':
				ws7.write(i + 2, row_num, a[key], cd_style)
			elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'D':
				ws7.write(i + 2, row_num, a[key], cd_style)
			elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'F':
				ws7.write(i + 2, row_num, a[key], f_style)
			else:
				ws7.write(i + 2, row_num, a[key], base_style)
	wb.save(response)
	return response