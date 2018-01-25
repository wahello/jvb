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
from user_input.models import DailyUserInputOptional ,\
                              DailyUserInputEncouraged
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
	# sheet7 = book.add_worksheet('All Raw Data')
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
	# sheet7.freeze_panes(1, 1)
	# sheet7.set_column('A:A',35)
	sheet8.freeze_panes(1, 1)
	sheet8.set_column('A:A',35)
	sheet9.freeze_panes(1, 1)
	sheet9.set_column('A:A',35)
	sheet1.repeat_rows(0)
	sheet1.repeat_columns(0)
	sheet1.set_row(49, 150)
	sheet1.set_landscape()
	bold = book.add_format({'bold': True})
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
	columns = ['overall_health_grade','overall_health_gpa','movement_non_exercise_steps_grade','non_exercise_steps',
			   'movement_consistency_grade','movement_consistency','avg_sleep_per_night_grade','sleep_per_user_input','exercise_consistency_grade',
			   'exercise_consistency','prcnt_unprocessed_food_consumed_grade','prcnt_non_processed_food','alcoholic_drink_per_week_grade','alcohol_week',
			   'sleep_aid_penalty','ctrl_subs_penalty','smoke_penalty']
	columnsw = ['Overall Health Grade','Overall Health Gpa','Movement Non Exercise Steps Grade','Movement Non Exercise Steps',
			   'Movement Consistency Grade','Movement Consistency Score','Avg Sleep Per Night Grade','Average Sleep Per Night',
			   'Exercise Consistency Grade','Exercise Consistency Score','Percentage of Unprocessed Food Consumed Grade',
			   'Percentage of Unprocessed Food Consumed','Alcohol Drinks Consumed Per Last 7 Days Grade','Alcohol Drinks Consumed Per Last 7 Days'
			   ,'Sleep Aid Penalty','Controlled Substance Penalty','Smoking Penalty']
	exec1 = ExerciseAndReporting.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	options_user = DailyUserInputOptional.objects.filter(
		user_input__created_at__range=(from_date, to_date),
		user_input__user = request.user).order_by('-user_input__created_at').values()
	options_user1 = DailyUserInputEncouraged.objects.filter(
		user_input__created_at__range=(from_date, to_date),
		user_input__user = request.user).order_by('-user_input__created_at').values()
	rows_of_grades = Grades.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	rows3 = Steps.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()

	rows4 = Sleep.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()

	rows5 = Food.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()

	rows6 = Alcohol.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()

	rows1 = SwimStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()

	rows2 = BikeStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
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
	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			sheet2.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet1.write(0, 0, "All Stats(month-day-year)",bold)
	sheet1.write(1, 0, "Grades",bold)
	sheet1.write(2, 0, "OVERALL HEALTH GRADES",bold)
	col_num1 = 2
	row_num = 0
	for col_num in range(len(columnsw)):
		col_num1 = col_num1 + 1
		sheet1.write(col_num1, row_num, columnsw[col_num])
	# for grades1,steps1,sleep1,exercise1,food1,alcohol1 in zip(rows_of_grades,rows3,rows4,exec1,rows5,rows6):
		
	# 	row_num += 1
		# for i,key in enumerate(columns):
			
				# if key != 'non_exercise_steps' and key != 'movement_consistency' and key != 'sleep_per_user_input' and key != 'exercise_consistency' and key != 'prcnt_non_processed_food' and key != 'alcohol_week':
				# 	if grades1[key] == 'A':
				# 		sheet1.write(i+3,row_num, grades1[key],format_green)
				# 	elif grades1[key] == 'B':
				# 		sheet1.write(i+3,row_num, grades1[key],format_green)
				# 	elif grades1[key] == 'C':
				# 		sheet1.write(i+3,row_num, grades1[key],format_yellow)
				# 	elif grades1[key] == 'D':
				# 		sheet1.write(i+3,row_num, grades1[key],format_yellow)
				# 	elif grades1[key] == 'F':
				# 		sheet1.write(i+3,row_num, grades1[key],format_red)
				# 	elif grades1[key] == 'N/A':
				# 		sheet1.write(i+3,row_num, grades1[key],format1)
				# 	elif key == 'sleep_aid_penalty' or key == 'ctrl_subs_penalty' or key == 'smoke_penalty':
				# 		if grades1[key] == 0:
				# 			sheet1.write(i+3,row_num, 'NO',format1)
				# 		else:	
				# 			sheet1.write(i+3,row_num, 'YES',format_red)
				# 	elif i == 1:
				# 		sheet1.write(i+3,row_num, grades1[key],format1)
				# elif key == '':
				# 	sheet1.write(i+3,row_num, '',format1)
				# elif i == 3:
				# 	sheet1.write(i+3,row_num, steps1[key],format)
				# elif i == 5 and key == 'movement_consistency' and steps1[key]:
				# 	sheet1.write(i+3,row_num, ast.literal_eval(steps1[key])['inactive_hours'],format1)
				# elif i == 7:
				# 	sheet1.write(i+3,row_num, sleep1[key],format1)
				# elif i == 9:
				# 	sheet1.write(i+3,row_num, exercise1[key],format1)
				# elif i == 11:
				# 	if food1[key] == '':
						
				# 		sheet1.write(i+3,row_num, '')
				# 	else:
				# 		sheet1.write(i+3,row_num, str(int(food1[key])) + '%')
				# elif i == 13:
				# 	sheet1.write(i+3,row_num, alcohol1[key],format1)	
				# else:
				# 	sheet1.write(i+3,row_num, '')
	current_date = to_date
	i = 0
	while (current_date >= from_date):
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		sleep_data = sleep_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		food_data = food_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		alcohol_data = alcohol_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		
		if steps_data and grades_data and exercise_data and food_data and alcohol_data and sleep_data:
			steps_data = steps_data.__dict__
			grades_data = grades_data.__dict__
			sleep_data = sleep_data.__dict__
			exercise_data = exercise_data.__dict__
			alcohol_data = alcohol_data.__dict__
			food_data = food_data.__dict__
			# logic

			row_num += 1
			for i,key in enumerate(columns):
			
				if key != 'non_exercise_steps' and key != 'movement_consistency' and key != 'sleep_per_user_input' and key != 'exercise_consistency' and key != 'prcnt_non_processed_food' and key != 'alcohol_week':
					if grades_data[key] == 'A':
						sheet1.write(i+3,row_num, grades_data[key],format_green)
					elif grades_data[key] == 'B':
						sheet1.write(i+3,row_num, grades_data[key],format_green)
					elif grades_data[key] == 'C':
						sheet1.write(i+3,row_num, grades_data[key],format_yellow)
					elif grades_data[key] == 'D':
						sheet1.write(i+3,row_num, grades_data[key],format_yellow)
					elif grades_data[key] == 'F':
						sheet1.write(i+3,row_num, grades_data[key],format_red)
					elif grades_data[key] == 'N/A':
						sheet1.write(i+3,row_num, grades_data[key],format1)
					elif key == 'sleep_aid_penalty' or key == 'ctrl_subs_penalty' or key == 'smoke_penalty':
						if grades_data[key] == 0:
							sheet1.write(i+3,row_num, 'NO',format1)
						else:	
							sheet1.write(i+3,row_num, 'YES',format_red)
					elif i == 1:
						sheet1.write(i+3,row_num, grades_data[key],format1)
				elif key == '':
					sheet1.write(i+3,row_num, '',format1)
				elif i == 3:
					sheet1.write(i+3,row_num, steps_data[key],format)
				elif i == 5 and key == 'movement_consistency' and steps_data[key]:
					sheet1.write(i+3,row_num, ast.literal_eval(steps_data[key])['inactive_hours'],format1)
				elif i == 7:
					sheet1.write(i+3,row_num, sleep_data[key],format1)
				elif i == 9:
					sheet1.write(i+3,row_num, exercise_data[key],format1)
				elif i == 11:
					if food_data[key] == '':
						
						sheet1.write(i+3,row_num, '')
					else:
						sheet1.write(i+3,row_num, str(int(food_data[key])) + '%')
				elif i == 13:
					sheet1.write(i+3,row_num, alcohol_data[key],format1)	
				else:
					sheet1.write(i+3,row_num, '')
		else:
			row_num += 1
			sheet1.write(i+3,row_num, '')
		current_date -= timedelta(days=1)

	columnsg2 = ['Resting Heart Rate','Stress Level','Did you Stand for 3 hours or more above and beyond your exercise yesterday?']
	col = ['sleep_resting_hr_last_night','stress_level','stand_for_three_hours']
	sheet1.write(21, 0, "NOT GRADED CATEGORIES",bold)
	col_num2 = 21
	num_10 = row_num
	len_gra = len(rows_of_grades)
	for col_num in range(len(columnsg2)):
		 col_num2 = col_num2 + 1
		 sheet1.write(col_num2,row_num - num_10, columnsg2[col_num])

	# for row,user_op in zip(exec1,options_user):
	# 	row_num += 1
	# 	for i, key in enumerate(col):
	# 		if key == 'stand_for_three_hours':
	# 			sheet1.write(col_num2+i-2, row_num - num_10, user_op[key],format)
	# 		else:
	# 			sheet1.write(col_num2+i-2, row_num - num_10, row[key],format)

	current_date = to_date
	while (current_date >= from_date):
		options_data = options_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if options_data and exercise_data:
			options_data = options_data.__dict__
			exercise_data = exercise_data.__dict__
			# logic
			row_num += 1
			for i, key in enumerate(col):
				if key == 'stand_for_three_hours':
					sheet1.write(col_num2+i-2, row_num - num_10, options_data[key],format)
				else:
					sheet1.write(col_num2+i-2, row_num - num_10, exercise_data[key],format)
		else:
			# print("no data")
			row_num += 1
			sheet1.write(col_num2+i-2, row_num - num_10, '')
		current_date -= timedelta(days=1)
	
	sheet1.write(26, 0, "OVERALL PERFORMANCE ASSESSMENT",bold)
	columnsg3 = ['Overall Workout Grade ','Overall Workout Score (points)','Workout Duration Grade','Workout Duration'
	,'Workout Effort Level Grade','Workout Effort Level','Average Exercise Heart Rate Grade ','Average Exercise Heart Rate'
	,'Heart Rate Recovery (HRR) - time to 99','Heart Rate Recovery (HRR) - heart beats lowered in the first minute '
	,'VO2 Max','Floors Climbed ']
	columnsg4 = ['overall_workout_grade','overall_workout_gpa','workout_duration_grade','workout_duration',
	'workout_effortlvl_grade','workout_effortlvl_gpa','avg_exercise_hr_grade','avg_exercise_hr_gpa','time_to_99',
	'lowest_hr_first_minute','vo2_max','floor_climed']
	col_num2 = 26
	len_gra1 = len(rows_of_grades) + len(exec1) 
	num_1 = row_num
	for col_num in range(len(columnsg3)):
		 col_num2 = col_num2 + 1
		 sheet1.write(col_num2,row_num - num_1, columnsg3[col_num])
	l2 = 26
	num_2 = row_num

	# for grades2,excec2,steps2,user_op1 in zip(rows_of_grades,exec1,rows3,options_user1):
	# 	row_num += 1
	# 	for i, key in enumerate(columnsg4):
	# 		if key != 'workout_duration' and key != 'floor_climed' and key != 'vo2_max' and key != 'lowest_hr_first_minute' and key != 'time_to_99':
	# 			if grades2[key] == 'A':
	# 				sheet1.write(l2+i+1,row_num-num_2, grades2[key],format_green)
	# 			elif grades2[key] == 'B':
	# 				sheet1.write(l2+i+1,row_num-num_2, grades2[key],format_green)
	# 			elif grades2[key] == 'C':
	# 				sheet1.write(l2+i+1,row_num-num_2, grades2[key],format_yellow)
	# 			elif grades2[key] == 'D':
	# 				sheet1.write(l2+i+1,row_num-num_2, grades2[key],format_yellow)
	# 			elif grades2[key] == 'F':
	# 				sheet1.write(l2+i+1,row_num-num_2, grades2[key],format_red)
	# 			elif grades2[key] == 'N/A':
	# 				sheet1.write(l2+i+1,row_num-num_2, grades2[key],format1)
	# 			elif grades2[key] == '':
	# 				sheet1.write(l2+i+1,row_num-num_2, '',format1)
	# 		elif key == 'workout_duration':
	# 			sheet1.write(l2+i+1, row_num-num_2, excec2[key],format)
	# 		elif key == 'floor_climed':
	# 			sheet1.write(l2+i+1, row_num-num_2, steps2[key],format)
	# 		elif key == 'vo2_max':
	# 			sheet1.write(l2+i+1, row_num-num_2, excec2[key],format)
	# 		elif key == 'lowest_hr_first_minute':
	# 			sheet1.write(l2+i+1, row_num-num_2, user_op1[key],format)
	# 		elif key == 'time_to_99':
	# 			sheet1.write(l2+i+1, row_num-num_2, user_op1[key],format)
	# 		else:
	# 			sheet1.write(l2+i+1,row_num-num_2, 'YES',format_red)
	current_date = to_date
	while (current_date >= from_date):
		options_user_data = options_user_input_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if options_user_data and exercise_data and grades_data and steps_data:
			options_user_data = options_user_data.__dict__
			exercise_data = exercise_data.__dict__
			grades_data = grades_data.__dict__
			steps_data = steps_data.__dict__
			# logic
			row_num += 1
			for i, key in enumerate(columnsg4):
				if key != 'workout_duration' and key != 'floor_climed' and key != 'vo2_max' and key != 'lowest_hr_first_minute' and key != 'time_to_99':
					if grades_data[key] == 'A':
						sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format_green)
					elif grades_data[key] == 'B':
						sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format_green)
					elif grades_data[key] == 'C':
						sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format_yellow)
					elif grades_data[key] == 'D':
						sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format_yellow)
					elif grades_data[key] == 'F':
						sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format_red)
					elif grades_data[key] == 'N/A':
						sheet1.write(l2+i+1,row_num-num_2, grades_data[key],format1)
					elif grades_data[key] == '':
						sheet1.write(l2+i+1,row_num-num_2, '',format1)
					elif key == 'workout_duration':
						sheet1.write(l2+i+1, row_num-num_2, exercise_data[key],format)
					elif key == 'floor_climed':
						sheet1.write(l2+i+1, row_num-num_2, steps_data[key],format)
					elif key == 'vo2_max':
						sheet1.write(l2+i+1, row_num-num_2, exercise_data[key],format)
					elif key == 'lowest_hr_first_minute':
						sheet1.write(l2+i+1, row_num-num_2, options_user_data[key],format)
					elif key == 'time_to_99':
						sheet1.write(l2+i+1, row_num-num_2, options_user_data[key],format)
					else:
						sheet1.write(l2+i+1,row_num-num_2, 'YES',format_red)
		else:
			# print("no data")
			row_num += 1
			sheet1.write(col_num2+i-2, row_num - num_10, '')
		current_date -= timedelta(days=1)

	
	
	# Steps
	num_3 = row_num
	columns4 = ['movement_consistency','non_exercise_steps', 'exercise_steps', 'total_steps', 'floor_climed']
	columns4W = ['Movement Consistency','Non Exercise Steps', 'Exercise Steps', 'Total Steps', 'Floors Climed']
	sheet1.write(40, 0, "Steps",bold)
	col_num2 = 40
	a = len(rows_of_grades)
	for col_num in range(len(columns4W)):
		 col_num2 = col_num2 + 1
		 sheet1.write(col_num2,row_num - num_3, columns4W[col_num])
	# i1 = 40
	a = len(rows_of_grades)
	num_3 = row_num

	steps_qs = Steps.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	steps_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in steps_qs }
	# for g,h in zip(rows3,rows_of_grades):
	# 	row_num += 1
	# 	for i,key in enumerate(columns4):
	# 			if i == 1 and h['movement_non_exercise_steps_grade'] == 'A':
	# 				sheet1.write(i1+i+1,row_num - num_3, g[key], format_green)
	# 			elif i == 1 and h['movement_non_exercise_steps_grade'] == 'B':
	# 				sheet1.write(i1+i+1,row_num - num_3, g[key], format_green)
	# 			elif i == 1 and h['movement_non_exercise_steps_grade'] == 'C':
	# 				sheet1.write(i1+i+1,row_num - num_3, g[key], format_yellow)
	# 			elif i == 1 and h['movement_non_exercise_steps_grade'] == 'D':
	# 				sheet1.write(i1+i+1,row_num - num_3, g[key], format_yellow)
	# 			elif i == 1 and h['movement_non_exercise_steps_grade'] == 'F':
	# 				sheet1.write(i1+i+1,row_num - num_3, g[key], format_red)
	# 			elif i == 0 and h['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and g[key]:
	# 				sheet1.write(i1+i+1,row_num - num_3, ast.literal_eval(g[key])['inactive_hours'], format_green)
	# 			elif i == 0 and h['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and g[key]:
	# 				sheet1.write(i1+i+1,row_num - num_3, ast.literal_eval(g[key])['inactive_hours'], format_green)
	# 			elif i == 0 and h['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and g[key]:
	# 				sheet1.write(i1+i+1,row_num - num_3, ast.literal_eval(g[key])['inactive_hours'], format_yellow)
	# 			elif i == 0 and h['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and g[key]:
	# 				sheet1.write(i1+i+1,row_num - num_3, ast.literal_eval(g[key])['inactive_hours'], format_yellow)
	# 			elif i == 0 and h['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and g[key]:
	# 				sheet1.write(i1+i+1,row_num - num_3,ast.literal_eval(g[key])['inactive_hours'], format_red)
	# 			else:
	# 				sheet1.write(i1+i+1,row_num - num_3, g[key], format)

	current_date = to_date
	i1 = 40
	while (current_date >= from_date):
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if steps_data and grades_data:
			steps_data = steps_data.__dict__
			grades_data = grades_data.__dict__
			# logic
			i1 = 40
			row_num += 1
			for i,key in enumerate(columns4):
				if i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'A':
					sheet1.write(i1+i+1,row_num - num_3, steps_data[key], format_green)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'B':
					sheet1.write(i1+i+1,row_num - num_3, steps_data[key], format_green)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'C':
					sheet1.write(i1+i+1,row_num - num_3, steps_data[key], format_yellow)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'D':
					sheet1.write(i1+i+1,row_num - num_3, steps_data[key], format_yellow)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'F':
					sheet1.write(i1+i+1,row_num - num_3, steps_data[key], format_red)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and steps_data[key]:
					sheet1.write(i1+i+1,row_num - num_3, ast.literal_eval(steps_data[key])['inactive_hours'], format_green)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and steps_data[key]:
					sheet1.write(i1+i+1,row_num - num_3, ast.literal_eval(steps_data[key])['inactive_hours'], format_green)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and steps_data[key]:
					sheet1.write(i1+i+1,row_num - num_3, ast.literal_eval(steps_data[key])['inactive_hours'], format_yellow)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and steps_data[key]:
					sheet1.write(i1+i+1,row_num - num_3, ast.literal_eval(steps_data[key])['inactive_hours'], format_yellow)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and steps_data[key]:
					sheet1.write(i1+i+1,row_num - num_3,ast.literal_eval(steps_data[key])['inactive_hours'], format_red)
				else:
					sheet1.write(i1+i+1,row_num - num_3, steps_data[key], format)
		else:
			row_num += 1
			sheet1.write(i1+i+1,row_num - num_3, '')
		current_date -= timedelta(days=1)



	#Sleep

	columns5 = ['sleep_per_user_input','sleep_comments',  'sleep_aid','sleep_resting_hr_last_night','sleep_per_wearable', 'sleep_bed_time', 
	'sleep_awake_time','deep_sleep','light_sleep','awake_time']
	columns5W = ['Sleep Per User Input (excluding awake time)','Sleep Comments', 'Sleep Aid taken?', 
	'Resting Heart Rate (RHR)','Sleep per Wearable (excluding awake time)',
	'Sleep Bed Time', 'Sleep Awake Time','Deep Sleep','Light Sleep','Awake Time']
	sheet1.write(47, 0, "Sleep",bold)
	col_num2 = 47
	num_4 = row_num
	a = len(rows_of_grades) + len(rows3)
	for col_num in range(len(columns5W)):
		col_num2 = col_num2 + 1
		sheet1.write(col_num2, row_num - num_4 , columns5W[col_num])
	
	rows4hr = ExerciseAndReporting.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at').values()
	# i1 = 47
	format2 = book.add_format()
	format2.set_align('top')
	format2.set_text_wrap()
	format2.set_shrink()
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

	# for m,n,p in zip(rows4,rows_of_grades,rows4hr):
	# 	row_num += 1
	# 	for i, key in enumerate(columns5):
	# 			if i == 0 and n['avg_sleep_per_night_grade'] == 'A':
	# 				sheet1.write(i1 + i + 1, row_num - num_4, m[key], format_green)
	# 			elif i == 0 and n['avg_sleep_per_night_grade'] == 'B':
	# 				sheet1.write(i1 + i + 1, row_num - num_4, m[key], format_green)
	# 			elif i == 0 and n['avg_sleep_per_night_grade'] == 'C':
	# 				sheet1.write(i1 + i + 1, row_num - num_4, m[key], format_yellow)
	# 			elif i == 0 and n['avg_sleep_per_night_grade'] == 'D':
	# 				sheet1.write(i1 + i + 1, row_num - num_4, m[key], format_yellow)
	# 			elif i == 0 and n['avg_sleep_per_night_grade'] == 'F':
	# 				sheet1.write(i1 + i + 1, row_num - num_4, m[key], format_red)
	# 			elif i == 1:
	# 				sheet1.write(i1 + i + 1, row_num - num_4, m[key], format2)
	# 			elif i == 3:
	# 				sheet1.write(i1 + i + 1, row_num - num_4, p[key], format)
	# 			else:
	# 				sheet1.write(i1 + i + 1, row_num - num_4, m[key], format)

	current_date = to_date
		
	while (current_date >= from_date):
		sleep_data = sleep_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if sleep_data and exercise_data and grades_data:
			sleep_data = sleep_data.__dict__
			grades_data = grades_data.__dict__
			exercise_data = exercise_data.__dict__
			# logic
			i1 = 47
			row_num += 1
			for i, key in enumerate(columns5):
				if i == 0 and grades_data['avg_sleep_per_night_grade'] == 'A':
					sheet1.write(i1 + i + 1, row_num - num_4, sleep_data[key], format_green)
				elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'B':
					sheet1.write(i1 + i + 1, row_num - num_4, sleep_data[key], format_green)
				elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'C':
					sheet1.write(i1 + i + 1, row_num - num_4, sleep_data[key], format_yellow)
				elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'D':
					sheet1.write(i1 + i + 1, row_num - num_4, sleep_data[key], format_yellow)
				elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'F':
					sheet1.write(i1 + i + 1, row_num - num_4, sleep_data[key], format_red)
				elif i == 1:
					sheet1.write(i1 + i + 1, row_num - num_4, sleep_data[key], format2)
				elif i == 3:
					sheet1.write(i1 + i + 1, row_num - num_4, exercise_data[key], format)
				else:
					sheet1.write(i1 + i + 1, row_num - num_4, sleep_data[key], format)
		else:
			row_num += 1
			sheet1.write(i1+i+1,row_num - num_4, '')
		current_date -= timedelta(days=1)
	#Food
	num_5 = row_num
	columns6 = ['prcnt_non_processed_food', 'non_processed_food', 'diet_type']
	columns6W = ['Percentage of Unprocessed Food', 'Non Processed Food', 'Diet Type']
	sheet1.write(59, 0, "Food",bold)
	col_num2 = 59
	a = len(rows_of_grades) + len(rows3) + len(rows4)
	for col_num in range(len(columns6W)):
		col_num2 = col_num2 + 1
		sheet1.write(col_num2, row_num - num_5, columns6W[col_num])

	food_qs = Food.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	food_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in food_qs }
	# print(rows5)
	# i1 = 59
	
	# for j1,k1 in zip (rows5,rows_of_grades):
	# 	row_num += 1
	# 	for i, key in enumerate(columns6):
	# 		if k1['prcnt_unprocessed_food_consumed_grade'] == 'A' and i == 0:
	# 			sheet1.write(i1 + i + 1, row_num - num_5,str(int(j1[key])) + '%' ,format_green)
	# 		elif k1['prcnt_unprocessed_food_consumed_grade'] == 'B' and i == 0:
	# 			sheet1.write(i1 + i + 1, row_num - num_5, str(int(j1[key])) + '%' ,format_green)
	# 		elif k1['prcnt_unprocessed_food_consumed_grade'] == 'C' and i == 0:
	# 			sheet1.write(i1 + i + 1, row_num - num_5,str(int(j1[key])) + '%' ,format_yellow)
	# 		elif k1['prcnt_unprocessed_food_consumed_grade'] == 'D' and i == 0:
	# 			sheet1.write(i1 + i + 1, row_num - num_5, str(int(j1[key])) + '%' ,format_yellow)
	# 		elif k1['prcnt_unprocessed_food_consumed_grade'] == 'F' and i == 0:
	# 			sheet1.write(i1 + i + 1, row_num - num_5,str(int(j1[key])) + '%' ,format_red)
	# 		elif k1['prcnt_unprocessed_food_consumed_grade'] == '':
	# 			sheet1.write(i1 + i + 1, row_num - num_5,'',)
	# 		else:
	# 			sheet1.write(i1 + i + 1, row_num - num_5, j1[key], format)

	current_date = to_date
	while (current_date >= from_date):
		food_data = food_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if food_data and grades_data:
			food_data = food_data.__dict__
			grades_data = grades_data.__dict__
			# logic
			i1 = 59
			row_num += 1
			for i, key in enumerate(columns6):
				if grades_data['prcnt_unprocessed_food_consumed_grade'] == 'A' and i == 0:
					sheet1.write(i1 + i + 1, row_num - num_5,str(int(food_data[key])) + '%' ,format_green)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'B' and i == 0:
					sheet1.write(i1 + i + 1, row_num - num_5, str(int(food_data[key])) + '%' ,format_green)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'C' and i == 0:
					sheet1.write(i1 + i + 1, row_num - num_5,str(int(food_data[key])) + '%' ,format_yellow)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'D' and i == 0:
					sheet1.write(i1 + i + 1, row_num - num_5, str(int(food_data[key])) + '%' ,format_yellow)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'F' and i == 0:
					sheet1.write(i1 + i + 1, row_num - num_5,str(int(food_data[key])) + '%' ,format_red)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == '':
					sheet1.write(i1 + i + 1, row_num - num_5,'',)
				else:
					sheet1.write(i1 + i + 1, row_num - num_5, food_data[key], format)
		else:
			# print("no data")
			row_num += 1
			sheet1.write(i1+i+1,row_num - num_5, '')
		current_date -= timedelta(days=1)


	#Alcohol
	num_6 = row_num
	columns7 = ['alcohol_day', 'alcohol_week']
	columns7W = ['# of Alcohol Drinks Consumed Yesterday', '# of Alcohol Drinks Consumed over last  7 Days']
	sheet1.write(64, 0, "Alcohol",bold)
	col_num2 = 64
	a = len(rows_of_grades) + len(rows3) + len(rows4) + len(rows5)
	for col_num in range(len(columns7W)):
		   col_num2 = col_num2 + 1
		   sheet1.write(col_num2, row_num - num_6, columns7W[col_num])

	alcohol_qs = Alcohol.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	grades_qs = Grades.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	alcohol_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in alcohol_qs}	
	grades_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in grades_qs}	
	# i1 = 64
	# for e,f in zip(rows6,rows_of_grades):
	# 	row_num += 1
	# 	for i, key in enumerate(columns7):
	# 		if i == 1 and f['alcoholic_drink_per_week_grade'] == 'A':
	# 			sheet1.write(i1 + i + 1, row_num - num_6, e[key], format_green)
	# 		elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'B':
	# 			sheet1.write(i1 + i + 1, row_num - num_6, e[key], format_green)
	# 		elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'C':
	# 			sheet1.write(i1 + i + 1, row_num - num_6, e[key], format_yellow)
	# 		elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'D':
	# 			sheet1.write(i1 + i + 1, row_num - num_6, e[key], format_yellow)
	# 		elif i == 1 and f['alcoholic_drink_per_week_grade'] == 'F':
	# 			sheet1.write(i1 + i + 1, row_num - num_6, e[key], format_red)
	# 		else:
	# 			sheet1.write(i1 + i + 1, row_num - num_6, e[key],format)

	current_date = to_date
	while (current_date >= from_date):
		alcohol_data = alcohol_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if alcohol_data and grades_data:
			alcohol_data = alcohol_data.__dict__
			grades_data = grades_data.__dict__
			# logic
			i1 = 64
			row_num += 1
			for i, key in enumerate(columns7):
				if i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'A':
					sheet1.write(i1 + i + 1, row_num - num_6, alcohol_data[key], format_green)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'B':
					sheet1.write(i1 + i + 1, row_num - num_6, alcohol_data[key], format_green)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'C':
					sheet1.write(i1 + i + 1, row_num - num_6, alcohol_data[key], format_yellow)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'D':
					sheet1.write(i1 + i + 1, row_num - num_6, alcohol_data[key], format_yellow)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'F':
					sheet1.write(i1 + i + 1, row_num - num_6, alcohol_data[key], format_red)
				else:
					sheet1.write(i1 + i + 1, row_num - num_6, alcohol_data[key],format)
		else:
			print("no data")
			row_num += 1
			sheet1.write(i1+i+1,row_num - num_6, '')
		current_date -= timedelta(days=1)

	# Swim status
	num_7 = row_num
	columns1 = ['pace_per_100_yard','total_strokes']
	columns1W = ['Pace Per 100 Yard','Total Strokes']
	sheet1.write(68, 0, "Swim Stats",bold)
	col_num2 = 68
	a = len(rows_of_grades) + len(rows3) + len(rows4) + len(rows5) + len(rows6)
	for col_num1 in range(len(columns1W)):
			col_num2 = col_num2 + 1
			sheet1.write(col_num2 , row_num - num_7  , columns1W[col_num1],format)
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
				i1 = 68
				row_num += 1
				for i,key in enumerate(columns1):
					sheet1.write(i1+i+1,row_num - num_7, row[key],format)
			else:
				row_num += 1
				sheet1.write(i1+i+1,row_num - num_7, '')
			current_date -= timedelta(days=1)

	# Bike
	num_8 = row_num
	columns3 = ['avg_speed', 'avg_power','avg_speed_per_mile','avg_cadence']
	columns3W = ['Avg Speed (MPH) Bike', 'Avg Power Bike','Avg_Speed Per Mile','Avg Cadence Bike']
	sheet1.write(72, 0, "Bike Stats",bold)
	col_num2 = 72
	a = len(rows_of_grades) + len(rows3) + len(rows4) + len(rows5) + len(rows6) + len(rows1)
	for col_num in range(len(columns3W)):
		col_num2 = col_num2 + 1
		sheet1.write(col_num2, row_num - num_8, columns3W[col_num],format)

	bike_qs = BikeStats.objects.filter(
		user_ql__created_at__range=(from_date, to_date),
		user_ql__user = request.user).order_by('-user_ql__created_at')

	bike_datewise = {q.user_ql.created_at.strftime("%Y-%m-%d"):q
		 for q in bike_qs }

	# current_date = to_date
	# while (current_date >= from_date):
	# 	# logic
	# 	data = bike_datewise.get(current_date.strftime("%Y-%m-%d"),None)
	# 	if data:
	# 		i1 = 72	
	# 		for row in bike_qs.values():
	# 			row_num += 1
	# 			for i,key in enumerate(columns3):
	# 				sheet1.write(i1+i+1,row_num - num_8, row[key],format)
	# 	else:
	# 		row_num += 1
	# 		sheet1.write(i1+i+1,row_num - num_8, '')
	# 	current_date -= timedelta(days=1)
		
	current_date = to_date
	for row in bike_qs.values():

		while (current_date >= from_date):
			# logic
			data = bike_datewise.get(current_date.strftime("%Y-%m-%d"),None)
			if data:
				i1 = 72	
			# for row in bike_qs.values():
				row_num += 1
				for i,key in enumerate(columns3):
					sheet1.write(i1+i+1,row_num - num_8, row[key],format)
			else:
				row_num += 1
				sheet1.write(i1+i+1,row_num - num_8, '')
			current_date -= timedelta(days=1)


	# rows2 = BikeStats.objects.filter(
	# 	user_ql__created_at__range=(from_date, to_date),
	# 	user_ql__user = request.user).order_by('-user_ql__created_at').values()
		
	# i1 = 72	
	# for row in rows2:
	# 		row_num += 1
	# 		for i,key in enumerate(columns3):
	# 			sheet1.write(i1+i+1,row_num - num_8, row[key],format)
	#Grades sheet
	sheet2.repeat_rows(0)
	sheet2.repeat_columns(0)
	sheet2.set_landscape()
	# columns = ['overall_health_grade','overall_health_gpa','movement_non_exercise_steps_grade','non_exercise_steps',
	# 		   'movement_consistency_grade','movement_consistency','avg_sleep_per_night_grade','sleep_per_user_input','exercise_consistency_grade',
	# 		   'exercise_consistency','prcnt_unprocessed_food_consumed_grade','prcnt_non_processed_food','alcoholic_drink_per_week_grade','alcohol_week',
	# 		   'sleep_aid_penalty','ctrl_subs_penalty','smoke_penalty']
	# columnsw = ['Overall Health Grade','Overall Health Gpa','Movement Non Exercise Steps Grade','Movement Non Exercise Steps',
	# 		   'Movement Consistency Grade','Movement Consistency Score','Avg Sleep Per Night Grade','Average Sleep Per Night',
	# 		   'Exercise Consistency Grade','Exercise Consistency Score','Percentage of Unprocessed Food Consumed Grade',
	# 		   'Percentage of Unprocessed Food Consumed','Alcohol Drinks Consumed Per Last 7 Days Grade','Alcohol Drinks Consumed Per Last 7 Days'
	# 		   ,'Sleep Aid Penalty','Controlled Substance Penalty','Smoking Penalty']
	# exec1 = ExerciseAndReporting.objects.filter(
	# 	user_ql__created_at__range=(from_date, to_date),
	# 	user_ql__user = request.user).order_by('-user_ql__created_at').values()
	# options_user = DailyUserInputOptional.objects.filter(
	# 	user_input__created_at__range=(from_date, to_date),
	# 	user_input__user = request.user).order_by('-user_input__created_at').values()
	# options_user1 = DailyUserInputEncouraged.objects.filter(
	# 	user_input__created_at__range=(from_date, to_date),
	# 	user_input__user = request.user).order_by('-user_input__created_at').values()
	# current_date = to_date
	# r = 0
	# if to_date and from_date:
	# 	while (current_date >= from_date):
	# 		r = r + 1
	# 		sheet2.write(0, r, current_date,date_format)
	# 		current_date -= timedelta(days=1)
	# sheet2.write(0, 0, "Grades",bold)
	# sheet2.write(1, 0, "OVERALL HEALTH GRADES",bold)
	# col_num1 = 1
	# row_num = 0
	# for col_num in range(len(columnsw)):
	# 	col_num1 = col_num1 + 1
	# 	sheet2.write(col_num1, row_num, columnsw[col_num])
	# for grades1,steps1,sleep1,exercise1,food1,alcohol1 in zip(rows_of_grades,rows3,rows4,exec1,rows5,rows6):
		
	# 	row_num += 1
	# 	for i,key in enumerate(columns):
			
	# 			if key != 'non_exercise_steps' and key != 'movement_consistency' and key != 'sleep_per_user_input' and key != 'exercise_consistency' and key != 'prcnt_non_processed_food' and key != 'alcohol_week':
	# 				if grades1[key] == 'A':
	# 					sheet2.write(i+2,row_num, grades1[key],format_green)
	# 				elif grades1[key] == 'B':
	# 					sheet2.write(i+2,row_num, grades1[key],format_green)
	# 				elif grades1[key] == 'C':
	# 					sheet2.write(i+2,row_num, grades1[key],format_yellow)
	# 				elif grades1[key] == 'D':
	# 					sheet2.write(i+2,row_num, grades1[key],format_yellow)
	# 				elif grades1[key] == 'F':
	# 					sheet2.write(i+2,row_num, grades1[key],format_red)
	# 				elif grades1[key] == 'N/A':
	# 					sheet2.write(i+2,row_num, grades1[key],format1)
	# 				elif key == 'sleep_aid_penalty' or key == 'ctrl_subs_penalty' or key == 'smoke_penalty':
	# 					if grades1[key] == 0:
	# 						sheet2.write(i+2,row_num, 'NO',format1)
	# 					else:	
	# 						sheet2.write(i+2,row_num, 'YES',format_red)
	# 				elif i == 1:
	# 					sheet2.write(i+2,row_num, grades1[key],format1)
	# 			elif key == '':
	# 				sheet2.write(i+2,row_num, '',format1)
	# 			elif i == 3:
	# 				sheet2.write(i+2,row_num, steps1[key],format)
	# 			elif i == 5 and key == 'movement_consistency' and steps1[key]:
	# 				sheet2.write(i+2,row_num, ast.literal_eval(steps1[key])['inactive_hours'],format1)
	# 			elif i == 7:
	# 				sheet2.write(i+2,row_num, sleep1[key],format1)
	# 			elif i == 9:
	# 				sheet2.write(i+2,row_num, exercise1[key],format1)
	# 			elif i == 11:
	# 				if food1[key] == '':
	# 					sheet2.write(i+2,row_num, '')
	# 				else:
	# 					sheet2.write(i+2,row_num, str(int(food1[key])) + '%')
	# 			elif i == 13:
	# 				sheet2.write(i+2,row_num, alcohol1[key],format1)	
	# 			else:
	# 				sheet2.write(i+2,row_num, '')
	
	# columnsg2 = ['Resting Heart Rate','Stress Level','Did you Stand for 3 hours or more above and beyond your exercise yesterday?']
	# col = ['sleep_resting_hr_last_night','stress_level','stand_for_three_hours']
	# sheet2.write(20, 0, "OVERALL HEALTH GRADES",bold)
	# col_num2 = 20
	# len_gra = len(rows_of_grades)
	# for col_num in range(len(columnsg2)):
	# 	 col_num2 = col_num2 + 1
	# 	 sheet2.write(col_num2,row_num - len_gra, columnsg2[col_num])

	# for row,user_op in zip(exec1,options_user):
	# 	row_num += 1
	# 	for i, key in enumerate(col):
	# 		if key == 'stand_for_three_hours':
	# 			sheet2.write(col_num2+i-2, row_num - len_gra, user_op[key],format)
	# 		else:
	# 			sheet2.write(col_num2+i-2, row_num - len_gra, row[key],format)

	# sheet2.write(25, 0, "OVERALL PERFORMANCE ASSESSMENT",bold)
	# columnsg3 = ['Overall Workout Grade ','Overall Workout Score (points)','Workout Duration Grade','Workout Duration'
	# ,'Workout Effort Level Grade','Workout Effort Level','Average Exercise Heart Rate Grade ','Average Exercise Heart Rate'
	# ,'Heart Rate Recovery (HRR) - time to 99','Heart Rate Recovery (HRR) - heart beats lowered in the first minute '
	# ,'VO2 Max','Floors Climbed ']
	# columnsg4 = ['overall_workout_grade','overall_workout_gpa','workout_duration_grade','workout_duration',
	# 'workout_effortlvl_grade','workout_effortlvl_gpa','avg_exercise_hr_grade','avg_exercise_hr_gpa','time_to_99',
	# 'lowest_hr_first_minute','vo2_max','floor_climed']
	# col_num2 = 25
	# len_gra1 = len(rows_of_grades) + len(exec1) 
	# num_1 = row_num
	# for col_num in range(len(columnsg3)):
	# 	 col_num2 = col_num2 + 1
	# 	 sheet2.write(col_num2,row_num - num_1, columnsg3[col_num])
	# l2 = 25
	# num_2 = row_num
	
	# for grades2,excec2,steps2,user_op1 in zip(rows_of_grades,exec1,rows3,options_user1):
	# 	row_num += 1
	# 	for i, key in enumerate(columnsg4):
	# 		if key != 'workout_duration' and key != 'floor_climed' and key != 'vo2_max' and key != 'lowest_hr_first_minute' and key != 'time_to_99':
	# 			if grades2[key] == 'A':
	# 				sheet2.write(l2+i+1,row_num-num_2, grades2[key],format_green)
	# 			elif grades2[key] == 'B':
	# 				sheet2.write(l2+i+1,row_num-num_2, grades2[key],format_green)
	# 			elif grades2[key] == 'C':
	# 				sheet2.write(l2+i+1,row_num-num_2, grades2[key],format_yellow)
	# 			elif grades2[key] == 'D':
	# 				sheet2.write(l2+i+1,row_num-num_2, grades2[key],format_yellow)
	# 			elif grades2[key] == 'F':
	# 				sheet2.write(l2+i+1,row_num-num_2, grades2[key],format_red)
	# 			elif grades2[key] == 'N/A':
	# 				sheet2.write(l2+i+1,row_num-num_2, grades2[key],format1)
	# 			elif grades2[key] == '':
	# 				sheet2.write(l2+i+1,row_num-num_2, '',format1)
	# 		elif key == 'workout_duration':
	# 			sheet2.write(l2+i+1, row_num-num_2, excec2[key],format)
	# 		elif key == 'floor_climed':
	# 			sheet2.write(l2+i+1, row_num-num_2, steps2[key],format)
	# 		elif key == 'vo2_max':
	# 			sheet2.write(l2+i+1, row_num-num_2, excec2[key],format)
	# 		elif key == 'lowest_hr_first_minute':
	# 			sheet2.write(l2+i+1, row_num-num_2, user_op1[key],format)
	# 		elif key == 'time_to_99':
	# 			sheet2.write(l2+i+1, row_num-num_2, user_op1[key],format)
	# 		else:
	# 			sheet2.write(l2+i+1,row_num-num_2, 'YES',format_red)

	columns = ['overall_health_grade','overall_health_gpa','movement_non_exercise_steps_grade','non_exercise_steps',
			   'movement_consistency_grade','movement_consistency','avg_sleep_per_night_grade','sleep_per_user_input','exercise_consistency_grade',
			   'exercise_consistency','prcnt_unprocessed_food_consumed_grade','prcnt_non_processed_food','alcoholic_drink_per_week_grade','alcohol_week',
			   'sleep_aid_penalty','ctrl_subs_penalty','smoke_penalty']
	columnsw = ['Overall Health Grade','Overall Health Gpa','Movement Non Exercise Steps Grade','Movement Non Exercise Steps',
			   'Movement Consistency Grade','Movement Consistency Score','Avg Sleep Per Night Grade','Average Sleep Per Night',
			   'Exercise Consistency Grade','Exercise Consistency Score','Percentage of Unprocessed Food Consumed Grade',
			   'Percentage of Unprocessed Food Consumed','Alcohol Drinks Consumed Per Last 7 Days Grade','Alcohol Drinks Consumed Per Last 7 Days'
			   ,'Sleep Aid Penalty','Controlled Substance Penalty','Smoking Penalty']

	current_date = to_date
	r = 0
	if to_date and from_date:
		while (current_date >= from_date):
			r = r + 1
			sheet2.write(0, r, current_date,date_format)
			current_date -= timedelta(days=1)
	sheet2.write(1, 0, "Grades",bold)
	sheet2.write(2, 0, "OVERALL HEALTH GRADES",bold)
	col_num1 = 2
	row_num = 0
	for col_num in range(len(columnsw)):
		col_num1 = col_num1 + 1
		sheet2.write(col_num1, row_num, columnsw[col_num])
	current_date = to_date
	i = 0
	while (current_date >= from_date):
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		sleep_data = sleep_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		food_data = food_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		alcohol_data = alcohol_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		
		if steps_data and grades_data and exercise_data and food_data and alcohol_data and sleep_data:
			steps_data = steps_data.__dict__
			grades_data = grades_data.__dict__
			sleep_data = sleep_data.__dict__
			exercise_data = exercise_data.__dict__
			alcohol_data = alcohol_data.__dict__
			food_data = food_data.__dict__
			# logic

			row_num += 1
			for i,key in enumerate(columns):
			
				if key != 'non_exercise_steps' and key != 'movement_consistency' and key != 'sleep_per_user_input' and key != 'exercise_consistency' and key != 'prcnt_non_processed_food' and key != 'alcohol_week':
					if grades_data[key] == 'A':
						sheet2.write(i+3,row_num, grades_data[key],format_green)
					elif grades_data[key] == 'B':
						sheet2.write(i+3,row_num, grades_data[key],format_green)
					elif grades_data[key] == 'C':
						sheet2.write(i+3,row_num, grades_data[key],format_yellow)
					elif grades_data[key] == 'D':
						sheet2.write(i+3,row_num, grades_data[key],format_yellow)
					elif grades_data[key] == 'F':
						sheet2.write(i+3,row_num, grades_data[key],format_red)
					elif grades_data[key] == 'N/A':
						sheet2.write(i+3,row_num, grades_data[key],format1)
					elif key == 'sleep_aid_penalty' or key == 'ctrl_subs_penalty' or key == 'smoke_penalty':
						if grades_data[key] == 0:
							sheet2.write(i+3,row_num, 'NO',format1)
						else:	
							sheet2.write(i+3,row_num, 'YES',format_red)
					elif i == 1:
						sheet2.write(i+3,row_num, grades_data[key],format1)
				elif key == '':
					sheet2.write(i+3,row_num, '',format1)
				elif i == 3:
					sheet2.write(i+3,row_num, steps_data[key],format)
				elif i == 5 and key == 'movement_consistency' and steps_data[key]:
					sheet2.write(i+3,row_num, ast.literal_eval(steps_data[key])['inactive_hours'],format1)
				elif i == 7:
					sheet2.write(i+3,row_num, sleep_data[key],format1)
				elif i == 9:
					sheet2.write(i+3,row_num, exercise_data[key],format1)
				elif i == 11:
					if food_data[key] == '':
						
						sheet2.write(i+3,row_num, '')
					else:
						sheet2.write(i+3,row_num, str(int(food_data[key])) + '%')
				elif i == 13:
					sheet2.write(i+3,row_num, alcohol_data[key],format1)	
				else:
					sheet2.write(i+3,row_num, '')
		else:
			row_num += 1
			sheet2.write(i+3,row_num, '')
		current_date -= timedelta(days=1)

	columnsg2 = ['Resting Heart Rate','Stress Level','Did you Stand for 3 hours or more above and beyond your exercise yesterday?']
	col = ['sleep_resting_hr_last_night','stress_level','stand_for_three_hours']
	sheet2.write(21, 0, "NOT GRADED CATEGORIES",bold)
	col_num2 = 21
	num_10 = row_num
	len_gra = len(rows_of_grades)
	for col_num in range(len(columnsg2)):
		 col_num2 = col_num2 + 1
		 sheet2.write(col_num2,row_num - num_10, columnsg2[col_num])

	current_date = to_date
	while (current_date >= from_date):
		options_data = options_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if options_data and exercise_data:
			options_data = options_data.__dict__
			exercise_data = exercise_data.__dict__
			# logic
			row_num += 1
			for i, key in enumerate(col):
				if key == 'stand_for_three_hours':
					sheet2.write(col_num2+i-2, row_num - num_10, options_data[key],format)
				else:
					sheet2.write(col_num2+i-2, row_num - num_10, exercise_data[key],format)
		else:
			# print("no data")
			row_num += 1
			sheet2.write(col_num2+i-2, row_num - num_10, '')
		current_date -= timedelta(days=1)
	
	sheet1.write(26, 0, "OVERALL PERFORMANCE ASSESSMENT",bold)
	columnsg3 = ['Overall Workout Grade ','Overall Workout Score (points)','Workout Duration Grade','Workout Duration'
	,'Workout Effort Level Grade','Workout Effort Level','Average Exercise Heart Rate Grade ','Average Exercise Heart Rate'
	,'Heart Rate Recovery (HRR) - time to 99','Heart Rate Recovery (HRR) - heart beats lowered in the first minute '
	,'VO2 Max','Floors Climbed ']
	columnsg4 = ['overall_workout_grade','overall_workout_gpa','workout_duration_grade','workout_duration',
	'workout_effortlvl_grade','workout_effortlvl_gpa','avg_exercise_hr_grade','avg_exercise_hr_gpa','time_to_99',
	'lowest_hr_first_minute','vo2_max','floor_climed']
	col_num2 = 26
	len_gra1 = len(rows_of_grades) + len(exec1) 
	num_1 = row_num
	for col_num in range(len(columnsg3)):
		 col_num2 = col_num2 + 1
		 sheet2.write(col_num2,row_num - num_1, columnsg3[col_num])
	l2 = 26
	num_2 = row_num

	current_date = to_date
	while (current_date >= from_date):
		options_user_data = options_user_input_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if options_user_data and exercise_data and grades_data and steps_data:
			options_user_data = options_user_data.__dict__
			exercise_data = exercise_data.__dict__
			grades_data = grades_data.__dict__
			steps_data = steps_data.__dict__
			# logic
			row_num += 1
			for i, key in enumerate(columnsg4):
				if key != 'workout_duration' and key != 'floor_climed' and key != 'vo2_max' and key != 'lowest_hr_first_minute' and key != 'time_to_99':
					if grades_data[key] == 'A':
						sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format_green)
					elif grades_data[key] == 'B':
						sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format_green)
					elif grades_data[key] == 'C':
						sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format_yellow)
					elif grades_data[key] == 'D':
						sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format_yellow)
					elif grades_data[key] == 'F':
						sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format_red)
					elif grades_data[key] == 'N/A':
						sheet2.write(l2+i+1,row_num-num_2, grades_data[key],format1)
					elif grades_data[key] == '':
						sheet2.write(l2+i+1,row_num-num_2, '',format1)
					elif key == 'workout_duration':
						sheet2.write(l2+i+1, row_num-num_2, exercise_data[key],format)
					elif key == 'floor_climed':
						sheet2.write(l2+i+1, row_num-num_2, steps_data[key],format)
					elif key == 'vo2_max':
						sheet.write(l2+i+1, row_num-num_2, exercise_data[key],format)
					elif key == 'lowest_hr_first_minute':
						sheet2.write(l2+i+1, row_num-num_2, options_user_data[key],format)
					elif key == 'time_to_99':
						sheet.write(l2+i+1, row_num-num_2, options_user_data[key],format)
					else:
						sheet2.write(l2+i+1,row_num-num_2, 'YES',format_red)
		else:
			# print("no data")
			row_num += 1
			sheet2.write(col_num2+i-2, row_num - num_10, '')
		current_date -= timedelta(days=1)



	#Swim Stats sheet
	sheet8.set_landscape()
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

	# for row in rows1:
	# 	row_num += 1
	# 	for i, key in enumerate(columns):
	# 		sheet8.write(i + 2, row_num, row[key],format)

	current_date = to_date
	for row in swim_qs.values():
		
		while (current_date >= from_date):
			data = swim_datewise.get(current_date.strftime("%Y-%m-%d"),None)
			if data:
				# logic
				row_num += 1
				for i,key in enumerate(columns):
					sheet8.write(i + 2, row_num, row[key],format)
			else:
				row_num += 1
				sheet8.write(i + 2, row_num, '')
			current_date -= timedelta(days=1)
	# Bike stats sheet
	sheet9.set_landscape()
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

	# for row in rows2:
	# 	row_num += 1
	# 	for i, key in enumerate(columns):
	#  		sheet9.write(i + 2, row_num, row[key], format)
	current_date = to_date
	for row in bike_qs.values():

		while (current_date >= from_date):
			# logic
			data = bike_datewise.get(current_date.strftime("%Y-%m-%d"),None)
			if data:
				row_num += 1
				for i,key in enumerate(columns):
					sheet9.write(i + 2, row_num, row[key],format)
			else:
				row_num += 1
				sheet9.write(i + 2, row_num, '')
			current_date -= timedelta(days=1)

	# steps stats sheet
	sheet3.set_landscape()
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


	# for a1,b1 in zip(rows3,rows_of_grades):
	# 	row_num += 1
	# 	for i, key in enumerate(columns):
	# 			if i == 1 and b1['movement_non_exercise_steps_grade'] == 'A':
	# 				sheet3.write(i + 2, row_num, a1[key], format_green)
	# 			elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'B':
	# 				sheet3.write(i + 2, row_num, a1[key], format_green)
	# 			elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'C':
	# 				sheet3.write(i + 2, row_num, a1[key], format_yellow)
	# 			elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'D':
	# 				sheet3.write(i + 2, row_num, a1[key], format_yellow)
	# 			elif i == 1 and b1['movement_non_exercise_steps_grade'] == 'F':
	# 				sheet3.write(i + 2, row_num, a1[key], format_red)
	# 			elif i == 0 and b1['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and a1[key]:
	# 				sheet3.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], format_green)
	# 			elif i == 0 and b1['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and a1[key]:
	# 				sheet3.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], format_green)
	# 			elif i == 0 and b1['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and a1[key]:
	# 				sheet3.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], format_yellow)
	# 			elif i == 0 and b1['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and a1[key]:
	# 				sheet3.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], format_yellow)
	# 			elif i == 0 and b1['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and a1[key]:
	# 				sheet3.write(i + 2, row_num, ast.literal_eval(a1[key])['inactive_hours'], format_red)
	# 			else:
	# 				sheet3.write(i + 2, row_num, a1[key], format)

	current_date = to_date

	while (current_date >= from_date):
		steps_data = steps_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if steps_data and grades_data:
			steps_data = steps_data.__dict__
			grades_data = grades_data.__dict__
			# logic

			row_num += 1
			for i,key in enumerate(columns4):
				if i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'A':
					sheet3.write(i + 2, row_num, steps_data[key], format_green)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'B':
					sheet3.write(i + 2, row_num,steps_data[key], format_green)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'C':
					sheet3.write(i + 2, row_num, steps_data[key], format_yellow)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'D':
					sheet3.write(i + 2, row_num, steps_data[key], format_yellow)
				elif i == 1 and grades_data['movement_non_exercise_steps_grade'] == 'F':
					sheet3.write(i + 2, row_num, steps_data[key], format_red)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'A' and key == 'movement_consistency' and steps_data[key]:
					sheet3.write(i + 2, row_num, ast.literal_eval(steps_data[key])['inactive_hours'], format_green)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'B' and key == 'movement_consistency' and steps_data[key]:
					sheet3.write(i + 2, row_num, ast.literal_eval(steps_data[key])['inactive_hours'], format_green)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'C' and key == 'movement_consistency' and steps_data[key]:
					sheet3.write(i + 2, row_num, ast.literal_eval(steps_data[key])['inactive_hours'], format_yellow)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'D' and key == 'movement_consistency' and steps_data[key]:
					sheet3.write(i + 2, row_num, ast.literal_eval(steps_data[key])['inactive_hours'], format_yellow)
				elif i == 0 and grades_data['movement_consistency_grade'] == 'F' and key == 'movement_consistency' and steps_data[key]:
					sheet3.write(i + 2, row_num,ast.literal_eval(steps_data[key])['inactive_hours'], format_red)
				else:
					sheet3.write(i + 2, row_num, steps_data[key], format)
		else:
			row_num += 1
			sheet3.write(i + 2, row_num,'')
		current_date -= timedelta(days=1)

	# sleep stats sheet
	sheet4.set_landscape()
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

	format2 = book.add_format()
	format2.set_align('top')
	format2.set_text_wrap()

	format2.set_shrink()
	# wrap = book.add_format({'text_wrap': True})
	sheet4.set_row(3, 150)
	
	# for a2,b2 in zip (rows4,rows_of_grades):
	# 	row_num += 1
	# 	for i, key in enumerate(columns):
	# 			if i == 0 and b2['avg_sleep_per_night_grade'] == 'A':
	# 				sheet4.write(i + 2, row_num, a2[key],format_green)
	# 			elif i == 0 and b2['avg_sleep_per_night_grade'] == 'B':
	# 				sheet4.write(i + 2, row_num, a2[key],format_green)
	# 			elif i == 0 and b2['avg_sleep_per_night_grade'] == 'C':
	# 				sheet4.write(i + 2, row_num, a2[key], format_yellow)
	# 			elif i == 0 and b2['avg_sleep_per_night_grade'] == 'D':
	# 				sheet4.write(i + 2, row_num, a2[key], format_yellow)
	# 			elif i == 0 and b2['avg_sleep_per_night_grade'] == 'F':
	# 				sheet4.write(i + 2, row_num, a2[key], format_red)
	# 			elif i == 1:
	# 				sheet4.write(i + 2, row_num, a2[key],format2)
	# 			else:
	# 				sheet4.write(i + 2, row_num, a2[key],format)
	current_date = to_date
		
	while (current_date >= from_date):
		sleep_data = sleep_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		exercise_data = exercise_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		grades_data = grades_datewise.get(current_date.strftime("%Y-%m-%d"),None)
		if sleep_data and exercise_data and grades_data:
			sleep_data = sleep_data.__dict__
			grades_data = grades_data.__dict__
			exercise_data = exercise_data.__dict__
			# logic
			row_num += 1
			for i, key in enumerate(columns5):
				if i == 0 and grades_data['avg_sleep_per_night_grade'] == 'A':
					sheet4.write(i + 2, row_num, sleep_data[key], format_green)
				elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'B':
					sheet4.write(i + 2, row_num, sleep_data[key], format_green)
				elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'C':
					sheet4.write(i + 2, row_num, sleep_data[key], format_yellow)
				elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'D':
					sheet4.write(i + 2, row_num,sleep_data[key], format_yellow)
				elif i == 0 and grades_data['avg_sleep_per_night_grade'] == 'F':
					sheet4.write(i + 2, row_num, sleep_data[key], format_red)
				elif i == 1:
					sheet4.write(i + 2, row_num,sleep_data[key], format2)
				elif i == 3:
					sheet4.write(i + 2, row_num, exercise_data[key], format)
				else:
					sheet4.write(i + 2, row_num, sleep_data[key], format)
		else:
			row_num += 1
			sheet4.write(i + 2, row_num, '')
		current_date -= timedelta(days=1)
	# Food sheet
	sheet5.set_landscape()
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

	format2 = book.add_format()
	format2.set_align('fill')

	# for j,k in zip (rows5,rows_of_grades):
	# 	row_num += 1
	# 	for i, key in enumerate(columns):
	# 		if k['prcnt_unprocessed_food_consumed_grade'] == 'A' and i == 0:
	# 			sheet5.write(i + 2, row_num, str(int(j[key])) + '%' ,format_green)
	# 		elif k['prcnt_unprocessed_food_consumed_grade'] == 'B' and i == 0:
	# 			sheet5.write(i + 2, row_num, str(int(j[key])) + '%' ,format_green)
	# 		elif k['prcnt_unprocessed_food_consumed_grade'] == 'C' and i == 0:
	# 			sheet5.write(i + 2, row_num, str(int(j[key])) + '%' ,format_yellow)
	# 		elif k['prcnt_unprocessed_food_consumed_grade'] == 'D' and i == 0:
	# 			sheet5.write(i + 2, row_num, str(int(j[key])) + '%' ,format_yellow)
	# 		elif k['prcnt_unprocessed_food_consumed_grade'] == 'F' and i == 0:
	# 			sheet5.write(i + 2, row_num, str(int(j[key])) + '%' ,format_red)
	# 		elif k['prcnt_unprocessed_food_consumed_grade'] == '' and i == 0:
	# 			sheet5.write(i + 2, row_num, ' ',format2)
	# 		else:
	# 			sheet5.write(i + 2, row_num, j[key], format2)

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
					sheet5.write(i + 2, row_num,str(int(food_data[key])) + '%' ,format_green)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'B' and i == 0:
					sheet5.write(i + 2, row_num, str(int(food_data[key])) + '%' ,format_green)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'C' and i == 0:
					sheet5.write(i + 2, row_num,str(int(food_data[key])) + '%' ,format_yellow)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'D' and i == 0:
					sheet5.write(i + 2, row_num,str(int(food_data[key])) + '%' ,format_yellow)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == 'F' and i == 0:
					sheet5.write(i + 2, row_num,str(int(food_data[key])) + '%' ,format_red)
				elif grades_data['prcnt_unprocessed_food_consumed_grade'] == '':
					sheet5.write(i + 2, row_num,'',)
				else:
					sheet5.write(i + 2, row_num, food_data[key], format)
		else:
			# print("no data")
			row_num += 1
			sheet5.write(i + 2, row_num, '')
		current_date -= timedelta(days=1)
	# Alcohol sheet
	sheet6.set_landscape()
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

	# for a,b in zip (rows6,rows_of_grades):
	# 	row_num += 1
	# 	for i, key in enumerate(columns):
	# 		if i == 1 and b['alcoholic_drink_per_week_grade'] == 'A':
	# 			sheet6.write(i + 2, row_num, a[key], format_green)
	# 		elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'B':
	# 			sheet6.write(i + 2, row_num, a[key], format_green)
	# 		elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'C':
	# 			sheet6.write(i + 2, row_num, a[key], format_yellow)
	# 		elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'D':
	# 			sheet6.write(i + 2, row_num, a[key], format_yellow)
	# 		elif i == 1 and b['alcoholic_drink_per_week_grade'] == 'F':
	# 			sheet6.write(i + 2, row_num, a[key], format_red)
	# 		else:
	# 			sheet6.write(i + 2, row_num, a[key], format)

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
				if i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'A':
					sheet6.write(i + 2, row_num, alcohol_data[key], format_green)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'B':
					sheet6.write(i + 2, row_num, alcohol_data[key], format_green)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'C':
					sheet6.write(i + 2, row_num, alcohol_data[key], format_yellow)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'D':
					sheet6.write(i + 2, row_num, alcohol_data[key], format_yellow)
				elif i == 1 and grades_data['alcoholic_drink_per_week_grade'] == 'F':
					sheet6.write(i + 2, row_num, alcohol_data[key], format_red)
				else:
					sheet6.write(i + 2, row_num, alcohol_data[key],format)
		else:
			print("no data")
			row_num += 1
			sheet6.write(i + 2, row_num, '')
		current_date -= timedelta(days=1)

	book.close()
	return response