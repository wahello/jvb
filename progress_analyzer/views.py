import pprint
import xlsxwriter
from xlsxwriter.workbook import Workbook
from datetime import datetime, timedelta , date
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from progress_analyzer.helpers.helper_classes import ProgressReport
from leaderboard.helpers.leaderboard_helper_classes import LeaderboardOverview

class LeaderBoardAPIView(APIView):
	permission_classes = (IsAuthenticated,)

	def get(self, request, format="Json"):
		# query_params = {
		#  	"date":date2,
		#  	"custom_ranges":"2018-02-12,2018-02-16,2018-02-13,2018-02-18",
		#  	"duration":"today,yesterday,week,month,year"
		# }
		rank_data = LeaderboardOverview(request.user,query_params).get_leaderboard()
		return Response(rank_data,status=status.HTTP_200_OK)

class ProgressReportView(APIView):
	'''Generate Progress Analyzer Reports on the fly'''

	permission_classes = (IsAuthenticated,)
	def get(self, request, format="json"):
		DATA = ProgressReport(request.user, request.query_params).get_progress_report()
		#print(pprint.pprint(DATA))
		return Response(DATA,status=status.HTTP_200_OK)


def progress_excel_export(request):
	date2 = request.GET.get('date',None)
	crs = request.GET.get('custom_ranges',None)
	a = crs.split(",")
	
	date = datetime.strptime(date2,'%Y-%m-%d').date()

	query_params = {
		"date":date2,
		"duration":"today,yesterday,week,month,year",
		#"custom_ranges":cr1,
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other,travel"
		}
	DATA = ProgressReport(request.user,query_params).get_progress_report()
	#print(pprint.pprint(DATA))

	rank_data = LeaderboardOverview(request.user,query_params).get_leaderboard()
	#print(pprint.pprint(rank_data))	
	#print(pprint.pprint(DATA))
	#custom_ranges1_start = datetime.strptime(a[0], "%Y-%m-%d").date()
	#custom_ranges1_end = datetime.strptime(a[1], "%Y-%m-%d").date()
	#custom_ranges2_start = datetime.strptime(a[2], "%Y-%m-%d").date()
	#custom_ranges2_end = datetime.strptime(a[3], "%Y-%m-%d").date()
	#custom_ranges3_start = datetime.strptime(a[4], "%Y-%m-%d").date()
	#custom_ranges3_end = datetime.strptime(a[5], "%Y-%m-%d").date()

	#custom_ranges_list = [custom_ranges1_start,custom_ranges1_end,custom_ranges2_start,custom_ranges2_end,custom_ranges3_start,custom_ranges3_end]
	
	filename = '{}_Progress_Analyzer_data.xlsx'.format(request.user.username)
	response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
	response['Content-Disposition'] = "attachment; filename={}".format(filename) 
	book = Workbook(response,{'in_memory': True})
	sheet10 = book.add_worksheet('Progress Analyzer')

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

	green = book.add_format({'align':'left', 'bg_color': 'green'})
	lawn_green=book.add_format({'align':'left','bg_color':'#32d358'})
	yellow = book.add_format({'align':'left', 'bg_color': 'yellow'})
	red = book.add_format({'align':'left', 'bg_color': 'red'})
	orange = book.add_format({'align':'left', 'bg_color': 'orange'})

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

	sick = ['# of Days Not Sick','% of Days Not Sick','# of Days Sick','% of Days Sick',' # Days Sick/Not Sick Reported',]
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
	rank_data = LeaderboardOverview(request.user,query_params).get_leaderboard()
	print(pprint.pprint(DATA))
	#print(pprint.pprint(rank_data))
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
		
		sheet10.write(15,c,DATA['summary']['non_exercise']['non_exercise_steps'][time1[i]],format_align)
		sheet10.write(16,c,rank_data['total_steps'][time1[i]]['user_rank']['rank'],format_align)
		sheet10.write(17,c,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],format_align)
		sheet10.write(18,c,DATA['summary']['non_exercise']['non_exericse_steps_gpa'][time1[i]],format_align1)
		sheet10.write(19,c,DATA['summary']['non_exercise']['total_steps'][time1[i]],format_align)
		
		sheet10.write(22,c,DATA['summary']['nutrition']['prcnt_unprocessed_volume_of_food'][time1[i]],format_align)
		sheet10.write(23,c,rank_data['prcnt_uf'][time1[i]]['user_rank']['rank'],format_align)
		sheet10.write(24,c,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],format_align)
		sheet10.write(25,c,DATA['summary']['nutrition']['prcnt_unprocessed_food_gpa'][time1[i]],format_align1)
		

		sheet10.write(28,c,DATA['summary']['alcohol']['avg_drink_per_week'][time1[i]],format_align)
		sheet10.write(29,c,rank_data['alcohol_drink'][time1[i]]['user_rank']['rank'],format_align)
		sheet10.write(30,c,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],format_align)
		sheet10.write(31,c,DATA['summary']['alcohol']['alcoholic_drinks_per_week_gpa'][time1[i]],format_align1)
		sheet10.write(32,c,DATA['summary']['alcohol']['prcnt_alcohol_consumption_reported'][time1[i]],format_align1)

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


		

	#conditions for custom_ranges
	if (len(a) == 2):
		custom_ranges1_start = datetime.strptime(a[0], "%Y-%m-%d").date()
		custom_ranges1_end = datetime.strptime(a[1], "%Y-%m-%d").date()
		crsf1 = custom_ranges1_start.strftime('%b %d,%Y')
		cref1= custom_ranges1_end.strftime('%b %d,%Y')
		custom_range1='{} to {}'.format(custom_ranges1_start,custom_ranges1_end)
		crf1 = '{} to {}'.format(crsf1,cref1)
		sheet10.write(0,7,crf1,format)
		cr1 = '{},{}'.format(custom_ranges1_start,custom_ranges1_end)
		sheet10.set_column('H:H',16)
		
		
		# sheet10.conditional_format('B4:H7', {'type': 'no_errors',
                                          # 'format': border_format})
		# sheet10.conditional_format('B11:H15', {'type': 'no_errors',
	 #                                          'format': border_format})
		# sheet10.conditional_format('B19:H22', {'type': 'no_errors',
	 #                                          'format': border_format})
		# sheet10.conditional_format('B25:H27', {'type': 'no_errors',
	 #                                          'format': border_format})
		# sheet10.conditional_format('B32:H37', {'type': 'no_errors',
	 #                                          'format': border_format})
		# sheet10.conditional_format('J4:P8', {'type': 'no_errors',
	 #                                          'format': border_format})
		# sheet10.conditional_format('J11:P14', {'type': 'no_errors',
	 #                                          'format': border_format})
		# sheet10.conditional_format('J19:P22', {'type': 'no_errors',
	 #                                          'format': border_format})
		# sheet10.conditional_format('J25:P28', {'type': 'no_errors',
	 #                                          'format': border_format})

		
		query_params = {
		"date":rdate,
		"duration":"today,yesterday,week,month,year",
		"custom_ranges":cr1,
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other,sick,stress,standing,travel"
		}
		DATA = ProgressReport(request.user,query_params).get_progress_report()
		#print(pprint.pprint(DATA))
		
		query_params = {
		"date":rdate,
		"duration":"today,yesterday,week,month,year",
		"custom_ranges":cr1
		}
		rank_data = LeaderboardOverview(request.user,query_params).get_leaderboard()
		#print(pprint.pprint(rank_data))
		
		c=6
		for i in range(1):
			c = c + 1
			# r=2
			# for n in range(len(Ohg)):
			# 	r= r+1
			sheet10.write(3,c,DATA['summary']['overall_health'][Ohg[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(5,c,rank_data['oh_gpa']['custom_range'][custom_range1]['user_rank']['rank'],format_align)
			sheet10.write(4,c,DATA['summary']['overall_health'][Ohg[1]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[2]]['custom_range'][custom_range1]['data'],format_align)

			# r=8
			# for n in range(len(mc)):
			# 	r= r+1	
			sheet10.write(9,c,DATA['summary']['mc'][mc[0]]['custom_range'][custom_range1]['data'],format_align)	
			sheet10.write(10,c,rank_data['mc']['custom_range'][custom_range1]['user_rank']['rank'],format_align)
			sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data'],format_align)	
			sheet10.write(12,c,DATA['summary']['mc'][mc[2]]['custom_range'][custom_range1]['data'],format_align1)	
			
			# r=14
			# for n in range(len(non_exe)):
			# 	r= r+1	
			sheet10.write(15,c,DATA['summary']['non_exercise'][non_exe[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(16,c,rank_data['total_steps']['custom_range'][custom_range1]['user_rank']['rank'],format_align)
			sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data'],format_align1)
			sheet10.write(18,c,DATA['summary']['non_exercise'][non_exe[2]]['custom_range'][custom_range1]['data'],format_align1)
			sheet10.write(19,c,DATA['summary']['non_exercise'][non_exe[3]]['custom_range'][custom_range1]['data'],format_align1)

			# r=21
			# for n in range(len(nutri)):
			# 	r= r+1
			sheet10.write(22,c,DATA['summary']['nutrition'][nutri[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(23,c,rank_data['prcnt_uf']['custom_range'][custom_range1]['user_rank']['rank'],format_align)
			sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(25,c,DATA['summary']['nutrition'][nutri[-1]]['custom_range'][custom_range1]['data'],format_align1)

			# r=27
			# for n in range(len(Alc)):
			# 	r= r+1	
			sheet10.write(28,c,DATA['summary']['alcohol'][Alc[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(29,c,rank_data['alcohol_drink']['custom_range'][custom_range1]['user_rank']['rank'],format_align)
			sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(31,c,DATA['summary']['alcohol'][Alc[-2]]['custom_range'][custom_range1]['data'],format_align1)
			sheet10.write(32,c,DATA['summary']['alcohol'][Alc[-1]]['custom_range'][custom_range1]['data'],format_align)

			# r=33
			# for n in range(len(Ec)):
			# 	r= r+1
			sheet10.write(35,c,DATA['summary']['ec'][Ec[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(36,c,rank_data['ec']['custom_range'][custom_range1]['user_rank']['rank'],format_align)
			sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(38,c,DATA['summary']['ec'][Ec[-1]]['custom_range'][custom_range1]['data'],format_align1)

			# r=40
			# for n in range(len(Es)):
			# 	r= r+1
			sheet10.write(41,c,DATA['summary']['exercise'][Es[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(42,c,DATA['summary']['exercise'][Es[1]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(43,c,DATA['summary']['exercise'][Es[2]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(44,c,DATA['summary']['exercise'][Es[3]]['custom_range'][custom_range1]['data'],format_align)

			# r=45
			# for n in range(len(other1)):
			# 	r= r+1
			sheet10.write(47,c,DATA['summary']['other'][other1[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(48,c,DATA['summary']['other'][other1[1]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(49,c,DATA['summary']['other'][other1[2]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(50,c,DATA['summary']['other'][other1[3]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(51,c,DATA['summary']['other'][other1[4]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(52,c,DATA['summary']['other'][other1[5]]['custom_range'][custom_range1]['data'],format_align)

			# r=53
			# for n in range(len(slept)):
			# 	r= r+1
			sheet10.write(55,c,DATA['summary']['sleep'][slept[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(56,c,rank_data['avg_sleep']['custom_range'][custom_range1]['user_rank']['rank'],format_align)
			sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(58,c,DATA['summary']['sleep'][slept[2]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(59,c,DATA['summary']['sleep'][slept[3]]['custom_range'][custom_range1]['data'],format_align)

			# row=61
			# for i in range(len(sick1)):
			# 	row=row+1
			sheet10.write(62,c,DATA['summary']['sick'][sick1[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(63,c,DATA['summary']['sick'][sick1[1]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(64,c,DATA['summary']['sick'][sick1[2]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(65,c,DATA['summary']['sick'][sick1[3]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(66,c,DATA['summary']['sick'][sick1[4]]['custom_range'][custom_range1]['data'],format_align)


			# row=69
			# for i in range(len(stress1)):
			# 	row=row+1
			sheet10.write(70,c,DATA['summary']['stress'][stress1[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(71,c,DATA['summary']['stress'][stress1[1]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(72,c,DATA['summary']['stress'][stress1[2]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(73,c,DATA['summary']['stress'][stress1[3]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(74,c,DATA['summary']['stress'][stress1[4]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(75,c,DATA['summary']['stress'][stress1[5]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(76,c,DATA['summary']['stress'][stress1[6]]['custom_range'][custom_range1]['data'],format_align)

			# row=78
			# for i in range(len(standing1)):
			# 	row=row+1
			sheet10.write(79,c,DATA['summary']['standing'][standing1[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(80,c,DATA['summary']['standing'][standing1[1]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(81,c,DATA['summary']['standing'][standing1[2]]['custom_range'][custom_range1]['data'],format_align)

			# row=84
			# for i in range(len(travel1)):
			# 	row=row+1
			sheet10.write(85,c,DATA['summary']['travel'][travel1[0]]['custom_range'][custom_range1]['data'],format_align)
			sheet10.write(86,c,DATA['summary']['travel'][travel1[1]]['custom_range'][custom_range1]['data'],format_align)

		
			
			if (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][custom_range1]['data']=='A'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][custom_range1]['data'],green)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][custom_range1]['data']=='B'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][custom_range1]['data'],lawn_green)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][custom_range1]['data']=='C'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][custom_range1]['data'],yellow)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][custom_range1]['data']=='D'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][custom_range1]['data'],orange)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][custom_range1]['data']=='F'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][custom_range1]['data'],red)
			
			if (DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data']=='A'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data'],green)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data']=='B'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data'],lawn_green)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data']=='C'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data'],yellow)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data']=='D'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data'],orange)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data']=='F'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][custom_range1]['data'],red)
			
			if (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data']=='A'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data'],green)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data']=='B'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data'],lawn_green)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data']=='C'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data'],yellow)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data']=='D'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data'],orange)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data']=='F'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][custom_range1]['data'],red)
				
			if (DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data']=='A'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data'],green)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data']=='B'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data'],lawn_green)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data']=='C'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data'],yellow)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data']=='D'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data'],orange)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data']=='F'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][custom_range1]['data'],red)

			if (DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data']=='A'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data'],green)
			elif (DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data']=='B'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data'],lawn_green)
			elif (DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data']=='C'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data'],yellow)
			elif (DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data']=='D'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data'],orange)
			if (DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data']=='F'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][custom_range1]['data'],red)

			if (DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data']=='A'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data'],green)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data']=='B'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data'],lawn_green)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data']=='C'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data'],yellow)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data']=='D'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data'],orange)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data']=='F'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][custom_range1]['data'],red)

			if (DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data']=='A'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data'],green)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data']=='B'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data'],lawn_green)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data']=='C'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data'],yellow)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data']=='D'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data'],orange)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data']=='F'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][custom_range1]['data'],red)
			
			if (DATA['summary']['exercise'][Es[0]]['custom_range'][custom_range1]['data']=='00:00'):
				sheet10.write(41,c,'No Workout',format_align)
			else:
				sheet10.write(41,c,DATA['summary']['exercise'][Es[0]]['custom_range'][custom_range1]['data'],format_align)

			if (DATA['summary']['exercise'][Es[1]]['custom_range'][custom_range1]['data']==0):
				sheet10.write(42,c,'No Workout',format_align)
			else:
				sheet10.write(42,c,DATA['summary']['exercise'][Es[1]]['custom_range'][custom_range1]['data'],format_align)
			
			if (DATA['summary']['exercise'][Es[2]]['custom_range'][custom_range1]['data']==0):
				sheet10.write(43,c,'No Workout',format_align)
			else:
				sheet10.write(43,c,DATA['summary']['exercise'][Es[2]]['custom_range'][custom_range1]['data'],format_align)

			if (DATA['summary']['exercise'][Es[3]]['custom_range'][custom_range1]['data']==0):
				sheet10.write(44,c,'Not provided',format_align)
			else:
				sheet10.write(44,c,DATA['summary']['exercise'][Es[3]]['custom_range'][custom_range1]['data'],format_align)
			
			if (DATA['summary']['exercise'][Es[0]]['custom_range'][custom_range1]['data']!='00:00'):
				if (DATA['summary']['other'][other1[1]]['custom_range'][custom_range1]['data']=='00:00'):
					sheet10.write(48,c,'Not Recorded',format_align)
				else:
					sheet10.write(48,c,DATA['summary']['other'][other1[1]]['custom_range'][custom_range1]['data'],format_align)
			else:
				sheet10.write(48,c,'No Workout',format_align)

			if (DATA['summary']['exercise'][Es[0]]['custom_range'][custom_range1]['data']!='00:00'):
				if (DATA['summary']['other'][other1[2]]['custom_range'][custom_range1]['data']==0):
					sheet10.write(49,c,'Not Recorded',format_align)
				else:
					sheet10.write(49,c,DATA['summary']['other'][other1[2]]['custom_range'][custom_range1]['data'],format_align)
			else:
				sheet10.write(49,c,'No Workout',format_align)

			if (DATA['summary']['exercise'][Es[0]]['custom_range'][custom_range1]['data']!='00:00'):
				if (DATA['summary']['other'][other1[3]]['custom_range'][custom_range1]['data']==0):
					sheet10.write(50,c,'Not Recorded',format_align)
				else:
					sheet10.write(50,c,DATA['summary']['other'][other1[3]]['custom_range'][custom_range1]['data'],format_align)
			else:
				sheet10.write(50,c,'No Workout',format_align)

			if (DATA['summary']['sleep'][slept[0]]['custom_range'][custom_range1]['data']=='00:00'):
				sheet10.write(55,c,'Not provided')
			else:
				sheet10.write(55,c,DATA['summary']['sleep'][slept[0]]['custom_range'][custom_range1]['data'],format_align)
	

	elif (len(a) == 4):
		custom_ranges1_start = datetime.strptime(a[0], "%Y-%m-%d").date()
		custom_ranges1_end = datetime.strptime(a[1], "%Y-%m-%d").date()
		custom_ranges2_start = datetime.strptime(a[2], "%Y-%m-%d").date()
		custom_ranges2_end = datetime.strptime(a[3], "%Y-%m-%d").date()
		crsf1 = custom_ranges1_start.strftime('%b %d,%Y')
		cref1= custom_ranges1_end.strftime('%b %d,%Y')
		crsf2 = custom_ranges2_start.strftime('%b %d,%Y')
		cref2= custom_ranges2_end.strftime('%b %d,%Y')
		crf1 = '{} to {}'.format(crsf1,cref1)
		crf2 = '{} to {}'.format(crsf2,cref2)

		cr1='{},{}'.format(custom_ranges1_start,custom_ranges1_end)
		cr2='{},{}'.format(custom_ranges2_start,custom_ranges2_end)
		crs1 ='{},{}'.format(cr1,cr2)
		custom_range1='{} to {}'.format(custom_ranges1_start,custom_ranges1_end)
		custom_range2='{} to {}'.format(custom_ranges2_start,custom_ranges2_end)

		sheet10.set_column('H:H',16)
		sheet10.set_column('I:I',16)

		list1=[custom_range1,custom_range2]
		range1 = [crf1,crf2]
		c = 6
		for i in range(len(range1)):
			c = c+1
			sheet10.write(0,c,range1[i],format)
	

	
		query_params = {
		"date":rdate,
		"duration":"today,yesterday,week,month,year",
		"custom_ranges":crs1,
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other,sick,stress,standing,travel"
		}
		DATA = ProgressReport(request.user,query_params).get_progress_report()
		rank_data = LeaderboardOverview(request.user,query_params).get_leaderboard()
		#print(pprint.pprint(DATA))

		c=6
		for i in range(len(list1)):
			c = c + 1
			sheet10.write(3,c,DATA['summary']['overall_health'][Ohg[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(5,c,rank_data['oh_gpa']['custom_range'][list1[i]]['user_rank']['rank'],format_align)
			sheet10.write(4,c,DATA['summary']['overall_health'][Ohg[1]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[2]]['custom_range'][list1[i]]['data'],format_align)

			sheet10.write(9,c,DATA['summary']['mc'][mc[0]]['custom_range'][list1[i]]['data'],format_align)	
			sheet10.write(10,c,rank_data['mc']['custom_range'][list1[i]]['user_rank']['rank'],format_align)
			sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data'],format_align)	
			sheet10.write(12,c,DATA['summary']['mc'][mc[2]]['custom_range'][list1[i]]['data'],format_align1)	
			
			sheet10.write(15,c,DATA['summary']['non_exercise'][non_exe[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(16,c,rank_data['total_steps']['custom_range'][list1[i]]['user_rank']['rank'],format_align)
			sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data'],format_align1)
			sheet10.write(18,c,DATA['summary']['non_exercise'][non_exe[2]]['custom_range'][list1[i]]['data'],format_align1)
			sheet10.write(19,c,DATA['summary']['non_exercise'][non_exe[3]]['custom_range'][list1[i]]['data'],format_align1)

			sheet10.write(22,c,DATA['summary']['nutrition'][nutri[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(23,c,rank_data['prcnt_uf']['custom_range'][list1[i]]['user_rank']['rank'],format_align)
			sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(25,c,DATA['summary']['nutrition'][nutri[-1]]['custom_range'][list1[i]]['data'],format_align1)

			sheet10.write(28,c,DATA['summary']['alcohol'][Alc[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(29,c,rank_data['alcohol_drink']['custom_range'][list1[i]]['user_rank']['rank'],format_align)
			sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(31,c,DATA['summary']['alcohol'][Alc[-2]]['custom_range'][list1[i]]['data'],format_align1)
			sheet10.write(32,c,DATA['summary']['alcohol'][Alc[-1]]['custom_range'][list1[i]]['data'],format_align)

			sheet10.write(35,c,DATA['summary']['ec'][Ec[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(36,c,rank_data['ec']['custom_range'][list1[i]]['user_rank']['rank'],format_align)
			sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(38,c,DATA['summary']['ec'][Ec[-1]]['custom_range'][list1[i]]['data'],format_align1)

			sheet10.write(41,c,DATA['summary']['exercise'][Es[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(42,c,DATA['summary']['exercise'][Es[1]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(43,c,DATA['summary']['exercise'][Es[2]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(44,c,DATA['summary']['exercise'][Es[3]]['custom_range'][list1[i]]['data'],format_align)

			sheet10.write(47,c,DATA['summary']['other'][other1[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(48,c,DATA['summary']['other'][other1[1]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(49,c,DATA['summary']['other'][other1[2]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(50,c,DATA['summary']['other'][other1[3]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(51,c,DATA['summary']['other'][other1[4]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(52,c,DATA['summary']['other'][other1[5]]['custom_range'][list1[i]]['data'],format_align)

			sheet10.write(55,c,DATA['summary']['sleep'][slept[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(56,c,rank_data['avg_sleep']['custom_range'][list1[i]]['user_rank']['rank'],format_align)
			sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(58,c,DATA['summary']['sleep'][slept[2]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(59,c,DATA['summary']['sleep'][slept[3]]['custom_range'][list1[i]]['data'],format_align)

			# row=61
			# for i in range(len(sick1)):
			# 	row=row+1
			sheet10.write(62,c,DATA['summary']['sick'][sick1[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(63,c,DATA['summary']['sick'][sick1[1]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(64,c,DATA['summary']['sick'][sick1[2]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(65,c,DATA['summary']['sick'][sick1[3]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(66,c,DATA['summary']['sick'][sick1[4]]['custom_range'][list1[i]]['data'],format_align)


			# row=69
			# for i in range(len(stress1)):
			# 	row=row+1
			sheet10.write(70,c,DATA['summary']['stress'][stress1[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(71,c,DATA['summary']['stress'][stress1[1]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(72,c,DATA['summary']['stress'][stress1[2]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(73,c,DATA['summary']['stress'][stress1[3]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(74,c,DATA['summary']['stress'][stress1[4]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(75,c,DATA['summary']['stress'][stress1[5]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(76,c,DATA['summary']['stress'][stress1[6]]['custom_range'][list1[i]]['data'],format_align)

			# row=78
			# for i in range(len(standing1)):
			# 	row=row+1
			sheet10.write(79,c,DATA['summary']['standing'][standing1[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(80,c,DATA['summary']['standing'][standing1[1]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(81,c,DATA['summary']['standing'][standing1[2]]['custom_range'][list1[i]]['data'],format_align)

			# row=84
			# for i in range(len(travel1)):
			# 	row=row+1
			sheet10.write(85,c,DATA['summary']['travel'][travel1[0]]['custom_range'][list1[i]]['data'],format_align)
			sheet10.write(86,c,DATA['summary']['travel'][travel1[1]]['custom_range'][list1[i]]['data'],format_align)

		
			
			if (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list1[i]]['data']=='A'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list1[i]]['data'],green)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list1[i]]['data']=='B'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list1[i]]['data'],lawn_green)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list1[i]]['data']=='C'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list1[i]]['data'],yellow)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list1[i]]['data']=='D'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list1[i]]['data'],orange)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list1[i]]['data']=='F'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list1[i]]['data'],red)
			
			if (DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data']=='A'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data'],green)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data']=='B'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data'],lawn_green)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data']=='C'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data'],yellow)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data']=='D'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data'],orange)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data']=='F'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list1[i]]['data'],red)
			
			if (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data']=='A'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data'],green)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data']=='B'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data'],lawn_green)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data']=='C'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data'],yellow)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data']=='D'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data'],orange)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data']=='F'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list1[i]]['data'],red)
				
			if (DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data']=='A'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data'],green)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data']=='B'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data'],lawn_green)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data']=='C'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data'],yellow)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data']=='D'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data'],orange)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data']=='F'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list1[i]]['data'],red)

			if (DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data']=='A'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data'],green)
			elif (DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data']=='B'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data'],lawn_green)
			elif (DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data']=='C'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data'],yellow)
			elif (DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data']=='D'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data'],orange)
			if (DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data']=='F'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list1[i]]['data'],red)

			if (DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data']=='A'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data'],green)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data']=='B'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data'],lawn_green)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data']=='C'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data'],yellow)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data']=='D'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data'],orange)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data']=='F'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list1[i]]['data'],red)

			if (DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data']=='A'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data'],green)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data']=='B'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data'],lawn_green)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data']=='C'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data'],yellow)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data']=='D'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data'],orange)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data']=='F'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list1[i]]['data'],red)
			
			if (DATA['summary']['exercise'][Es[0]]['custom_range'][list1[i]]['data']=='00:00'):
				sheet10.write(41,c,'No Workout',format_align)
			else:
				sheet10.write(41,c,DATA['summary']['exercise'][Es[0]]['custom_range'][list1[i]]['data'],format_align)

			if (DATA['summary']['exercise'][Es[1]]['custom_range'][list1[i]]['data']==0):
				sheet10.write(42,c,'No Workout',format_align)
			else:
				sheet10.write(42,c,DATA['summary']['exercise'][Es[1]]['custom_range'][list1[i]]['data'],format_align)
			
			if (DATA['summary']['exercise'][Es[2]]['custom_range'][list1[i]]['data']==0):
				sheet10.write(43,c,'No Workout',format_align)
			else:
				sheet10.write(43,c,DATA['summary']['exercise'][Es[2]]['custom_range'][list1[i]]['data'],format_align)

			if (DATA['summary']['exercise'][Es[3]]['custom_range'][list1[i]]['data']==0):
				sheet10.write(44,c,'Not provided',format_align)
			else:
				sheet10.write(44,c,DATA['summary']['exercise'][Es[3]]['custom_range'][list1[i]]['data'],format_align)
			
			if (DATA['summary']['exercise'][Es[0]]['custom_range'][list1[i]]['data']!='00:00'):
				if (DATA['summary']['other'][other1[1]]['custom_range'][list1[i]]['data']=='00:00'):
					sheet10.write(48,c,'Not Recorded',format_align)
				else:
					sheet10.write(48,c,DATA['summary']['other'][other1[1]]['custom_range'][list1[i]]['data'],format_align)
			else:
				sheet10.write(48,c,'No Workout',format_align)

			if (DATA['summary']['exercise'][Es[0]]['custom_range'][list1[i]]['data']!='00:00'):
				if (DATA['summary']['other'][other1[2]]['custom_range'][list1[i]]['data']==0):
					sheet10.write(49,c,'Not Recorded',format_align)
				else:
					sheet10.write(49,c,DATA['summary']['other'][other1[2]]['custom_range'][list1[i]]['data'],format_align)
			else:
				sheet10.write(49,c,'No Workout',format_align)

			if (DATA['summary']['exercise'][Es[0]]['custom_range'][list1[i]]['data']!='00:00'):
				if (DATA['summary']['other'][other1[3]]['custom_range'][list1[i]]['data']==0):
					sheet10.write(50,c,'Not Recorded',format_align)
				else:
					sheet10.write(50,c,DATA['summary']['other'][other1[3]]['custom_range'][list1[i]]['data'],format_align)
			else:
				sheet10.write(50,c,'No Workout',format_align)

			if (DATA['summary']['sleep'][slept[0]]['custom_range'][list1[i]]['data']=='00:00'):
				sheet10.write(55,c,'Not provided')
			else:
				sheet10.write(55,c,DATA['summary']['sleep'][slept[0]]['custom_range'][list1[i]]['data'],format_align)
			
	elif (len(a) == 6):
		custom_ranges1_start = datetime.strptime(a[0], "%Y-%m-%d").date()
		custom_ranges1_end = datetime.strptime(a[1], "%Y-%m-%d").date()
		custom_ranges2_start = datetime.strptime(a[2], "%Y-%m-%d").date()
		custom_ranges2_end = datetime.strptime(a[3], "%Y-%m-%d").date()
		custom_ranges3_start = datetime.strptime(a[4], "%Y-%m-%d").date()
		custom_ranges3_end = datetime.strptime(a[5], "%Y-%m-%d").date()

		crsf1 = custom_ranges1_start.strftime('%b %d,%Y')
		cref1 = custom_ranges1_end.strftime('%b %d,%Y')
		crsf2 = custom_ranges2_start.strftime('%b %d,%Y')
		cref2 = custom_ranges2_end.strftime('%b %d,%Y')
		crsf3 = custom_ranges3_start.strftime('%b %d,%Y')
		cref3 = custom_ranges3_end.strftime('%b %d,%Y')
		crf1 = '{} to {}'.format(crsf1,cref1)
		crf2 = '{} to {}'.format(crsf2,cref2)
		crf3 = '{} to {}'.format(crsf3,cref3)

		cr1='{},{}'.format(custom_ranges1_start,custom_ranges1_end)
		cr2='{},{}'.format(custom_ranges2_start,custom_ranges2_end)
		cr3='{},{}'.format(custom_ranges3_start,custom_ranges3_end)
		crs2 = '{},{},{}'.format(cr1,cr2,cr3)
		custom_range1='{} to {}'.format(custom_ranges1_start,custom_ranges1_end)
		custom_range2='{} to {}'.format(custom_ranges2_start,custom_ranges2_end)
		custom_range3='{} to {}'.format(custom_ranges3_start,custom_ranges3_end)
		
		sheet10.set_column('H:H',16)
		sheet10.set_column('I:I',16)
		sheet10.set_column('J:J',16)

		list2=[custom_range1,custom_range2,custom_range3]
		range2=[crf1,crf2,crf3]
		c = 6
		for i in range(len(range2)):
			c = c+1
			sheet10.write(0,c,range2[i],format)
	
		query_params = {
		"date":rdate,
		"duration":"today,yesterday,week,month,year",
		"custom_ranges":crs2,
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other,sick,stress,standing,travel"
		}
		DATA = ProgressReport(request.user,query_params).get_progress_report()
		rank_data = LeaderboardOverview(request.user,query_params).get_leaderboard()
		#print(pprint.pprint(DATA))

		c=6
		for i in range(len(list2)):
			c = c + 1
			sheet10.write(3,c,DATA['summary']['overall_health'][Ohg[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(5,c,rank_data['oh_gpa']['custom_range'][list2[i]]['user_rank']['rank'],format_align)
			sheet10.write(4,c,DATA['summary']['overall_health'][Ohg[1]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[2]]['custom_range'][list2[i]]['data'],format_align)

			sheet10.write(9,c,DATA['summary']['mc'][mc[0]]['custom_range'][list2[i]]['data'],format_align)	
			sheet10.write(10,c,rank_data['mc']['custom_range'][list2[i]]['user_rank']['rank'],format_align)
			sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data'],format_align)	
			sheet10.write(12,c,DATA['summary']['mc'][mc[2]]['custom_range'][list2[i]]['data'],format_align1)	
				
			sheet10.write(15,c,DATA['summary']['non_exercise'][non_exe[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(16,c,rank_data['total_steps']['custom_range'][list2[i]]['user_rank']['rank'],format_align)
			sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data'],format_align1)
			sheet10.write(18,c,DATA['summary']['non_exercise'][non_exe[2]]['custom_range'][list2[i]]['data'],format_align1)
			sheet10.write(19,c,DATA['summary']['non_exercise'][non_exe[3]]['custom_range'][list2[i]]['data'],format_align1)

			sheet10.write(22,c,DATA['summary']['nutrition'][nutri[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(23,c,rank_data['prcnt_uf']['custom_range'][list2[i]]['user_rank']['rank'],format_align)
			sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(25,c,DATA['summary']['nutrition'][nutri[-1]]['custom_range'][list2[i]]['data'],format_align1)

			sheet10.write(28,c,DATA['summary']['alcohol'][Alc[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(29,c,rank_data['alcohol_drink']['custom_range'][list2[i]]['user_rank']['rank'],format_align)
			sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(31,c,DATA['summary']['alcohol'][Alc[-2]]['custom_range'][list2[i]]['data'],format_align1)
			sheet10.write(32,c,DATA['summary']['alcohol'][Alc[-1]]['custom_range'][list2[i]]['data'],format_align)

			sheet10.write(35,c,DATA['summary']['ec'][Ec[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(36,c,rank_data['ec']['custom_range'][list2[i]]['user_rank']['rank'],format_align)
			sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(38,c,DATA['summary']['ec'][Ec[-1]]['custom_range'][list2[i]]['data'],format_align1)

			sheet10.write(41,c,DATA['summary']['exercise'][Es[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(42,c,DATA['summary']['exercise'][Es[1]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(43,c,DATA['summary']['exercise'][Es[2]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(44,c,DATA['summary']['exercise'][Es[3]]['custom_range'][list2[i]]['data'],format_align)

			sheet10.write(47,c,DATA['summary']['other'][other1[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(48,c,DATA['summary']['other'][other1[1]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(49,c,DATA['summary']['other'][other1[2]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(50,c,DATA['summary']['other'][other1[3]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(51,c,DATA['summary']['other'][other1[4]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(52,c,DATA['summary']['other'][other1[5]]['custom_range'][list2[i]]['data'],format_align)

			sheet10.write(55,c,DATA['summary']['sleep'][slept[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(56,c,rank_data['avg_sleep']['custom_range'][list2[i]]['user_rank']['rank'],format_align)
			sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(58,c,DATA['summary']['sleep'][slept[2]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(59,c,DATA['summary']['sleep'][slept[3]]['custom_range'][list2[i]]['data'],format_align)

			# row=61
			# for i in range(len(sick1)):
			# 	row=row+1
			sheet10.write(62,c,DATA['summary']['sick'][sick1[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(63,c,DATA['summary']['sick'][sick1[1]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(64,c,DATA['summary']['sick'][sick1[2]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(65,c,DATA['summary']['sick'][sick1[3]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(66,c,DATA['summary']['sick'][sick1[4]]['custom_range'][list2[i]]['data'],format_align)


			# row=69
			# for i in range(len(stress1)):
			# 	row=row+1
			sheet10.write(70,c,DATA['summary']['stress'][stress1[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(71,c,DATA['summary']['stress'][stress1[1]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(72,c,DATA['summary']['stress'][stress1[2]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(73,c,DATA['summary']['stress'][stress1[3]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(74,c,DATA['summary']['stress'][stress1[4]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(75,c,DATA['summary']['stress'][stress1[5]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(76,c,DATA['summary']['stress'][stress1[6]]['custom_range'][list2[i]]['data'],format_align)

			# row=78
			# for i in range(len(standing1)):
			# 	row=row+1
			sheet10.write(79,c,DATA['summary']['standing'][standing1[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(80,c,DATA['summary']['standing'][standing1[1]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(81,c,DATA['summary']['standing'][standing1[2]]['custom_range'][list2[i]]['data'],format_align)

			# row=84
			# for i in range(len(travel1)):
			# 	row=row+1
			sheet10.write(85,c,DATA['summary']['travel'][travel1[0]]['custom_range'][list2[i]]['data'],format_align)
			sheet10.write(86,c,DATA['summary']['travel'][travel1[1]]['custom_range'][list2[i]]['data'],format_align)

			
			if (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list2[i]]['data']=='A'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list2[i]]['data'],green)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list2[i]]['data']=='B'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list2[i]]['data'],lawn_green)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list2[i]]['data']=='C'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list2[i]]['data'],yellow)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list2[i]]['data']=='D'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list2[i]]['data'],orange)
			elif (DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list2[i]]['data']=='F'):
				sheet10.write(6,c,DATA['summary']['overall_health'][Ohg[-1]]['custom_range'][list2[i]]['data'],red)
			
			if (DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data']=='A'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data'],green)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data']=='B'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data'],lawn_green)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data']=='C'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data'],yellow)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data']=='D'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data'],orange)
			elif (DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data']=='F'):
				sheet10.write(11,c,DATA['summary']['mc'][mc[1]]['custom_range'][list2[i]]['data'],red)
			
			if (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data']=='A'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data'],green)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data']=='B'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data'],lawn_green)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data']=='C'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data'],yellow)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data']=='D'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data'],orange)
			elif (DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data']=='F'):
				sheet10.write(17,c,DATA['summary']['non_exercise'][non_exe[1]]['custom_range'][list2[i]]['data'],red)
				
			if (DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data']=='A'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data'],green)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data']=='B'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data'],lawn_green)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data']=='C'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data'],yellow)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data']=='D'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data'],orange)
			elif (DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data']=='F'):
				sheet10.write(24,c,DATA['summary']['nutrition'][nutri[1]]['custom_range'][list2[i]]['data'],red)

			if (DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data']=='A'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data'],green)
			elif (DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data']=='B'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data'],lawn_green)
			elif (DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data']=='C'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data'],yellow)
			elif (DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data']=='D'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data'],orange)
			if (DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data']=='F'):	
				sheet10.write(30,c,DATA['summary']['alcohol'][Alc[1]]['custom_range'][list2[i]]['data'],red)

			if (DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data']=='A'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data'],green)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data']=='B'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data'],lawn_green)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data']=='C'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data'],yellow)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data']=='D'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data'],orange)
			elif (DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data']=='F'):
				sheet10.write(37,c,DATA['summary']['ec'][Ec[1]]['custom_range'][list2[i]]['data'],red)

			if (DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data']=='A'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data'],green)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data']=='B'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data'],lawn_green)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data']=='C'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data'],yellow)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data']=='D'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data'],orange)
			elif (DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data']=='F'):
				sheet10.write(57,c,DATA['summary']['sleep'][slept[1]]['custom_range'][list2[i]]['data'],red)
			
			if (DATA['summary']['exercise'][Es[0]]['custom_range'][list2[i]]['data']=='00:00'):
				sheet10.write(41,c,'No Workout',format_align)
			else:
				sheet10.write(41,c,DATA['summary']['exercise'][Es[0]]['custom_range'][list2[i]]['data'],format_align)

			if (DATA['summary']['exercise'][Es[1]]['custom_range'][list2[i]]['data']==0):
				sheet10.write(42,c,'No Workout',format_align)
			else:
				sheet10.write(42,c,DATA['summary']['exercise'][Es[1]]['custom_range'][list2[i]]['data'],format_align)
			
			if (DATA['summary']['exercise'][Es[2]]['custom_range'][list2[i]]['data']==0):
				sheet10.write(43,c,'No Workout',format_align)
			else:
				sheet10.write(43,c,DATA['summary']['exercise'][Es[2]]['custom_range'][list2[i]]['data'],format_align)

			if (DATA['summary']['exercise'][Es[3]]['custom_range'][list2[i]]['data']==0):
				sheet10.write(44,c,'Not provided',format_align)
			else:
				sheet10.write(44,c,DATA['summary']['exercise'][Es[3]]['custom_range'][list2[i]]['data'],format_align)
			
			if (DATA['summary']['exercise'][Es[0]]['custom_range'][list2[i]]['data']!='00:00'):
				if (DATA['summary']['other'][other1[1]]['custom_range'][list2[i]]['data']=='00:00'):
					sheet10.write(48,c,'Not Recorded',format_align)
				else:
					sheet10.write(48,c,DATA['summary']['other'][other1[1]]['custom_range'][list2[i]]['data'],format_align)
			else:
				sheet10.write(48,c,'No Workout',format_align)

			if (DATA['summary']['exercise'][Es[0]]['custom_range'][list2[i]]['data']!='00:00'):
				if (DATA['summary']['other'][other1[2]]['custom_range'][list2[i]]['data']==0):
					sheet10.write(49,c,'Not Recorded',format_align)
				else:
					sheet10.write(49,c,DATA['summary']['other'][other1[2]]['custom_range'][list2[i]]['data'],format_align)
			else:
				sheet10.write(49,c,'No Workout',format_align)

			if (DATA['summary']['exercise'][Es[0]]['custom_range'][list2[i]]['data']!='00:00'):
				if (DATA['summary']['other'][other1[3]]['custom_range'][list2[i]]['data']==0):
					sheet10.write(50,c,'Not Recorded',format_align)
				else:
					sheet10.write(50,c,DATA['summary']['other'][other1[3]]['custom_range'][list2[i]]['data'],format_align)
			else:
				sheet10.write(50,c,'No Workout',format_align)

			if (DATA['summary']['sleep'][slept[0]]['custom_range'][list2[i]]['data']=='00:00'):
				sheet10.write(55,c,'Not provided')
			else:
				sheet10.write(55,c,DATA['summary']['sleep'][slept[0]]['custom_range'][list2[i]]['data'],format_align)
			
	
	num_fmt = book.add_format({'num_format': '#,###'})

	sheet10.conditional_format('A1:T50', {'type':'cell', 
												'criteria':'>=', 
												'value': '100', 
												'format': num_fmt})
	

	# from garmin.models import GarminFitFiles

	# start = "2018-03-27"
	# end = "2018-04-28"
	# a1=GarminFitFiles.objects.filter(user=request.user,created_at__range=[start,end])
	# for x in a1:
	# 	#print(x)
	# 	from fitparse import FitFile        
	# 	fitfile = FitFile(x.fit_file)
	# 	import pprint
	# 	dic={}
	# 	dic1={}
	# 	for record in fitfile.get_messages('record'):
	# 		for record_data in record:
	# 			if(record_data.name=='timestamp'):
	# 				a=record_data.value
	# 				#print(record_data.name,record_data.value)
	# 			if(record_data.name=='heart_rate'):
	# 	  			#print(record_data.name,record_data.value)
	# 	  			b= record_data.value
			
	# 		dic[a]=b
	# 		ls=[]
	# 		ls1=[]
	# 		ls2=[]
	# 		for keys in dic.keys():
	# 			pass
	# 			age=40
	# 			if (180-age-30)<dic[keys]<(180-age+5):
	# 				#print('aerobic')
	# 				#print(keys)
	# 				ls.append(keys)

	# 			elif (dic[keys]>(180-age+5)):
	# 				#print('anaerobic')
	# 				#print(keys)
	# 				ls1.append(keys)
	# 			elif(dic[keys]<(180-age-30)):
	# 				#print('below aerobic')
	# 				#print(keys)
	# 				ls2.append(keys)

	# 	#print(pprint.pprint(dic))
	# 	x=max(ls)-min(ls)
	# 	dic1['aerobic']=x
	# 	# y=max(ls1)-min(ls1)
	# 	# dic1['anaerobic']=y
	# 	z=max(ls2)-min(ls2)
	# 	dic1['below aerobic']=z
	# 	print(pprint.pprint(dic1))
	
	book.close()
	return response

                 

