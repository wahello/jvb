from datetime import datetime, timedelta
import xlwt
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

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
    to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
    from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
    response = HttpResponse(content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachment; filename="users.xls"'
    wb = xlwt.Workbook(encoding='utf-8')
    ws = wb.add_sheet('Users')
    row_num = 0
    ws.col(0).width = int(40 * 260)
    base_style = xlwt.easyxf('align: wrap yes ; alignment: horizontal left')
    font_style = xlwt.XFStyle()
    font_style.font.bold = True
    style = xlwt.XFStyle()
    style.num_format_str = 'YYYY-MM-D'
    columns = ['overall_health_grade','overall_health_gpa','movement_non_exercise_steps_grade',
			   'movement_consistency_grade','avg_sleep_per_night_grade','exercise_consistency_grade',
			   'overall_workout_grade','workout_duration_grade','workout_effortlvl_grade',
			   'avg_exercise_hr_grade','prcnt_unprocessed_food_consumed_grade','alcoholic_drink_per_week_grade',
			   'penalty']
    current_date = to_date
    r = 0
    if to_date and from_date:
     while(current_date >= from_date):
         r = r + 1
         ws.write(0,r,current_date,style)
         current_date -= timedelta(days = 1)
    ws.write(0,0,"Raw_Data")
    ws.write(2,0,"Grades")
    col_num1 = 2
    for col_num in range(len(columns)):
        col_num1 = col_num1 + 1
        ws.write(col_num1, row_num, columns[col_num], font_style)
    rows = Grades.objects.filter(user_ql__created_at__range=(from_date, to_date)).values()
    for row in rows:
        row_num += 1
        for i,key in enumerate(columns):
        	ws.write(i+3,row_num+1, row[key],base_style)

    font_style = xlwt.XFStyle()
    font_style.font.bold = True
    columns1 = ['pace_per_100_yard','total_strokes']
    ws.write(17, 0, "Swim_Status")
    col_num2 = 17
    a = len(rows)
    for col_num1 in range(len(columns1)):
		    col_num2 = col_num2 + 1
		    ws.write(col_num2 , row_num - a  , columns1[col_num1],font_style)
    rows1 = SwimStats.objects.filter(user_ql__created_at__range=(from_date, to_date)).values()
    a = len(rows)
    print(a)
    i1 = 17
    for row in rows1:
        row_num += 1
        for i,key in enumerate(columns1):
        	ws.write(i1+i+1,row_num - a+1, row[key],base_style)

    font_style = xlwt.XFStyle()
    font_style.font.bold = True
    columns3 = ['avg_speed', 'avg_power','avg_speed_per_mile','avg_cadence']
    ws.write(21, 0, "Bike_Status")
    col_num2 = 21
    a = len(rows) + len(rows1)
    for col_num in range(len(columns3)):
        col_num2 = col_num2 + 1
        ws.write(col_num2, row_num - a, columns3[col_num],font_style)
    rows2 = BikeStats.objects.filter(user_ql__created_at__range=(from_date, to_date)).values()
    a = len(rows) + len(rows1)
    i1 = 21
    for row in rows2:
        row_num += 1
        for i,key in enumerate(columns3):
        	ws.write(i1+i+1,row_num - a+1, row[key],base_style)

    font_style = xlwt.XFStyle()
    font_style.font.bold = True
    columns4 = ['non_exercise_steps', 'exercise_steps', 'total_steps', 'floor_climed','floor_decended','movement_consistency']
    ws.write(27, 0, "Steps")
    col_num2 = 27
    a = len(rows) + len(rows1) + len(rows2)
    for col_num in range(len(columns4)):
         col_num2 = col_num2 + 1
         ws.write(col_num2,row_num - a, columns4[col_num], font_style)
    rows3 = Steps.objects.filter(user_ql__created_at__range=(from_date, to_date)).values()
    i1 = 27
    a = len(rows) + len(rows1) + len(rows2)
    for row in rows3:
        row_num += 1
        for i,key in enumerate(columns4):
        	ws.write(i1+i+1,row_num - a+1, row[key],base_style)

    font_style = xlwt.XFStyle()
    font_style.font.bold = True
    columns5 = ['sleep_per_wearable', 'sleep_per_user_input', 'sleep_aid', 'sleep_bed_time', 'sleep_awake_time',
			   'deep_sleep','light_sleep','awake_time']
    ws.write(35, 0, "Sleep")
    col_num2 = 35
    a = len(rows) + len(rows1) + len(rows2) + len(rows3)
    for col_num in range(len(columns5)):
        col_num2 = col_num2 + 1
        ws.write(col_num2, row_num - a , columns5[col_num], font_style)
    rows4 = Sleep.objects.filter(user_ql__created_at__range=(from_date, to_date)).values()
    i1 = 35
    for row in rows4:
        row_num += 1
        for i, key in enumerate(columns5):
           ws.write(i1 + i + 1, row_num - a + 1, row[key],base_style)

    font_style = xlwt.XFStyle()
    font_style.font.bold = True
    columns6 = ['prcnt_non_processed_food', 'non_processed_food', 'diet_type']
    ws.write(45, 0, "Food")
    col_num2 = 45
    a = len(rows) + len(rows1) + len(rows2) + len(rows3) + len(rows4)
    for col_num in range(len(columns6)):
        col_num2 = col_num2 + 1
        ws.write(col_num2, row_num - a, columns6[col_num],font_style)
    i1 = 45
    rows5 = Food.objects.filter(user_ql__created_at__range=(from_date, to_date)).values()
    for row in rows5:
        row_num += 1
        for i, key in enumerate(columns6):
            ws.write(i1 + i + 1, row_num - a + 1, row[key],base_style)
			
    font_style = xlwt.XFStyle()
    font_style.font.bold = True
    columns7 = ['alcohol_day', 'alcohol_week']
    ws.write(50, 0, "Alcohol")
    col_num2 = 50
    a = len(rows) + len(rows1) + len(rows2) + len(rows3) + len(rows4) + len(rows5)
    for col_num in range(len(columns7)):
           col_num2 = col_num2 + 1
           ws.write(col_num2, row_num - a, columns7[col_num], font_style)
    rows6 = Alcohol.objects.filter(user_ql__created_at__range=(from_date, to_date)).values()
    i1 = 50
    for row in rows6:
        row_num += 1
        for i, key in enumerate(columns7):
            ws.write(i1 + i + 1, row_num - a + 1, row[key],base_style)
    wb.save(response)
    return response
