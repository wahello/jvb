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

# from quicklook.views import export_users_xls
	
class ProgressReportView(APIView):
	'''Generate Progress Analyzer Reports on the fly'''

	permission_classes = (IsAuthenticated,)
	def get(self, request, format="json"):
		DATA = ProgressReport(request.user, request.query_params).get_progress_report()
		#print(pprint.pprint(DATA))
		return Response(DATA,status=status.HTTP_200_OK)

def progress_excel_export(request):
	#to_date1 = request.GET.get('to_date',None)
	#from_date1 = request.GET.get('from_date', None)

	#to_date = datetime.strptime(to_date1, "%m-%d-%Y").date()
	#from_date = datetime.strptime(from_date1, "%m-%d-%Y").date()

	date2 = request.GET.get('date',None)
	crs = request.GET.get('custom_ranges',None)
	a = crs.split(",")
	
	date = datetime.strptime(date2,'%Y-%m-%d').date()
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
	# sheet10.set_column('L:L',45)
	# sheet10.set_column('K:K',1)
	# sheet10.set_column('C:E',13)
	# sheet10.set_column('F:G',10)
	# sheet10.set_column('M:O',13)
	# sheet10.set_column('P:Q',10)


	# sheet10.set_column('R:T',15)
	# sheet10.set_column('H:J',15)
	

	sheet10.set_row(0,45)
	
	sheet10.set_landscape()

	format = book.add_format({'bold': True})
	format.set_text_wrap()
	format_align = book.add_format({'align':'left'})

	#Headings
	bold = book.add_format({'bold': True})
	sheet10.write(0,1,'Summary Dashboard',bold)
	sheet10.write(2,1,'Overall Health Grade',bold)
	sheet10.write(9,1,'Sleep Per Night (excluding awake time)',bold)
	sheet10.write(17,1,'Exercise Consistency',bold)
	sheet10.write(23,1,'Exercise Stats',bold)
	sheet10.write(30,1,'Other Stats',bold)
	# sheet10.write(2,11,'Non Exercise Steps',bold)
	# sheet10.write(9,11,'Movement Consistency',bold)
	# sheet10.write(17,11,'Nutrition',bold)
	# sheet10.write(23,11,'Alcohol',bold)
	# sheet10.write(0,11,'Summary Dashboard',bold)

	#table borders
	border_format=book.add_format({
                            'border':1,
                            'align':'left',
                            'font_size':10
                           })
	
	
	# sheet10.conditional_format('B4:J7', {'type': 'no_errors',
 #                                          'format': border_format})
	# sheet10.conditional_format('B11:J16', {'type': 'no_errors',
 #                                          'format': border_format})
	# sheet10.conditional_format('B19:J22', {'type': 'no_errors',
 #                                          'format': border_format})
	# sheet10.conditional_format('B25:J27', {'type': 'no_errors',
 #                                          'format': border_format})
	# sheet10.conditional_format('B32:J37', {'type': 'no_errors',
 #                                          'format': border_format})
	# sheet10.conditional_format('L4:T8', {'type': 'no_errors',
 #                                          'format': border_format})
	# sheet10.conditional_format('L11:T14', {'type': 'no_errors',
 #                                          'format': border_format})
	# sheet10.conditional_format('L19:T22', {'type': 'no_errors',
 #                                          'format': border_format})
	# sheet10.conditional_format('L25:T28', {'type': 'no_errors',
 #                                          'format': border_format})
	
	year = date.year
	year1 = '{}-{}'.format(year,'01-01')
	today= date.today()
	yesterday=date-timedelta(days=1)
	week = date-timedelta(days = 7)
	month = date-timedelta(days=30)
	avg_week = '{} to {}'.format(week,date)
	avg_month ='{} to {}'.format(month,date)
	avg_year = '{} to {}'.format(year1,date)
	date1='{}'.format(today)

	today1 ='{}\n{}'.format('Today',date)
	yesterday1 = '{}\n{}'.format('Yesterday',yesterday)
	week1 = '{}\n{}'.format('Avg Last 7 days',avg_week)
	month1 = '{}\n{}'.format('Avg Last 30 days',avg_month)
	year1 = '{}\n{}'.format('Avg Year to Date',avg_year)

	
	duration = [today1,yesterday1,week1,month1,year1]

	# Row headers
	columns1=['Total GPA Points','Overall Health GPA','Rank against other users','Overall Health GPA Grade']
	row=2
	for i in range(len(columns1)):
		row=row+1
		sheet10.write(row,1,columns1[i])

	sleep_per_night=['Total Sleep in hours:minutes','Rank against other users','Average Sleep Grade','# of Days Sleep Aid Taken in Period','%  of Days Sleep Aid Taken in Period','Overall Sleep GPA']
	row=9
	for i in range(len(sleep_per_night)):
		row=row+1
		sheet10.write(row,1,sleep_per_night[i])

	exercise_consistency=['Avg # of Days Exercised/Week','Rank against other users','Exercise Consistency Grade','Exercise Consistency GPA']
	row=17
	for i in range(len(exercise_consistency)):
		row=row+1
		sheet10.write(row,1,exercise_consistency[i])

	exercise_stats=['Workout Duration (hours:minutes)','Workout Effort Level','Average Exercise Heart Rate','VO2 Max']
	row=23
	for i in range(len(exercise_stats)):
		row=row+1
		sheet10.write(row,1,exercise_stats[i])

	other_stats=['Resting Heart Rate(RHR)','HRR (time to 99)','HRR (heart beats lowered in 1st minute)','HRR (highest heart rate in 1st minute)','HRR (lowest heart rate point)','Floors Climbed']
	row=30
	for i in range(len(other_stats)):
		row=row+1
		sheet10.write(row,1,other_stats[i])

	# Non_Exercise_Steps=['Non Eercise Steps','Rank against other users','Movement-Non Exercise steps Grade','Non Exercise Steps GPA','Total Steps']
	# row=2
	# for i in range(len(Non_Exercise_Steps)):
	# 	row=row+1
	# 	sheet10.write(row,11,Non_Exercise_Steps[i])

	# Movement_consistency=['Movement Consistency Score','Rank against other users','Movement Consistency Grade','Movement Consistency GPA']
	# row=9
	# for i in range(len(Movement_consistency)):
	# 	row=row+1
	# 	sheet10.write(row,11,Movement_consistency[i])

	# Nutrition=['% Unprocessed Food of the volume of food consumed','Rank against other users','% Non Processed Food Consumed Grade','% Non Processedd Food Consumed GPA']
	# row=17
	# for i in range(len(Nutrition)):
	# 	row=row+1
	# 	sheet10.write(row,11,Nutrition[i])

	# alcohol=['# of Drinks Consumed per week(7days)','Rank against other users','Alcoholic drinks per week Grade','Alcoholic drinks per week GPA']
	# row=23
	# for i in range(len(alcohol)):
	# 	row = row+1
	# 	sheet10.write(row,11,alcohol[i])

	# Total = ['Total Exercise time(hours:minutes) in','Total time(hours:minutes) in anaerobic Zone last 7 days','Total time (hours:minutes) below Aerobic Zone last 7 days',
	# 'Total Exercise time (hours:minutes) the last 7 days',
	# 'Exercise % Time in Aerobic Zone','Exercise % Time in Anaerobic zone','Exercise % Time below aerobic zone']
	# row=30
	# for i in range(len(Total)):
	# 	row = row+1
	# 	sheet10.write(row,11,Total[i])

  

	nutri=['prcnt_unprocessed_volume_of_food','rank','prcnt_unprocessed_food_grade','prcnt_unprocessed_food_gpa']
	non_exe=['non_exercise_steps','rank','movement_non_exercise_step_grade','non_exericse_steps_gpa','total_steps']
	mc=['movement_consistency_score','rank','movement_consistency_grade','movement_consistency_gpa',]
	Alc=['avg_drink_per_week','rank','alcoholic_drinks_per_week_grade','alcoholic_drinks_per_week_gpa']
	Ohg=['total_gpa_point','overall_health_gpa','rank','overall_health_gpa_grade']
	slept=['total_sleep_in_hours_min','rank','average_sleep_grade','num_days_sleep_aid_taken_in_period','prcnt_days_sleep_aid_taken_in_period','overall_sleep_gpa']
	Ec=['avg_no_of_days_exercises_per_week','rank','exercise_consistency_grade','exercise_consistency_gpa']
	Es=['workout_duration_hours_min','workout_effort_level','avg_exercise_heart_rate','vo2_max']
	other1=['resting_hr','hrr_time_to_99','hrr_beats_lowered_in_first_min','hrr_highest_hr_in_first_min','hrr_lowest_hr_point','floors_climbed']

	#conditions for custom_ranges
	if (len(a) == 2):
		custom_ranges1_start = datetime.strptime(a[0], "%Y-%m-%d").date()
		custom_ranges1_end = datetime.strptime(a[1], "%Y-%m-%d").date()
		custom_range1='{} to {}'.format(custom_ranges1_start,custom_ranges1_end)
		sheet10.write(0,2,custom_range1,format)
		sheet10.write(0,10,custom_range1,format)
		cr1 = '{},{}'.format(custom_ranges1_start,custom_ranges1_end)
		sheet10.set_column('J:J',45)
		sheet10.set_column('I:I',1)
		sheet10.set_column('C:E',13)
		sheet10.set_column('K:M',13)
		sheet10.set_column('N:P',17)
		sheet10.set_column('F:H',17)

		sheet10.write(0,9,'Summary Dashboard',bold)
		sheet10.write(2,9,'Non Exercise Steps',bold)
		sheet10.write(9,9,'Movement Consistency',bold)
		sheet10.write(17,9,'Nutrition',bold)
		sheet10.write(23,9,'Alcohol',bold)
		


		sheet10.conditional_format('B4:H7', {'type': 'no_errors',
                                          'format': border_format})
		sheet10.conditional_format('B11:H16', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B19:H22', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B25:H27', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B32:H37', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('J4:P8', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('J11:P14', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('J19:P22', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('J25:P28', {'type': 'no_errors',
	                                          'format': border_format})

		c = 2
		for i in range(len(duration)):
			c = c+1
			sheet10.write(0,c,duration[i],format)
			sheet10.write(0,c+8,duration[i],format)

		Non_Exercise_Steps=['Non Eercise Steps','Rank against other users','Movement-Non Exercise Steps Grade','Non Exercise Steps GPA','Total Steps']
		row=2
		for i in range(len(Non_Exercise_Steps)):
			row=row+1
			sheet10.write(row,9,Non_Exercise_Steps[i])

		Movement_consistency=['Movement Consistency Score','Rank against other users','Movement Consistency Grade','Movement Consistency GPA']
		row=9
		for i in range(len(Movement_consistency)):
			row=row+1
			sheet10.write(row,9,Movement_consistency[i])

		Nutrition=['% Unprocessed Food Consumed','Rank against other users','% Non Processed Food Consumed Grade','% Non Processedd Food Consumed GPA']
		row=17
		for i in range(len(Nutrition)):
			row=row+1
			sheet10.write(row,9,Nutrition[i])

		alcohol=['Average Drinks Per Week(7Days)','Rank against other users','Alcoholic drinks per week Grade','Alcoholic drinks per week GPA']
		row=23
		for i in range(len(alcohol)):
			row = row+1
			sheet10.write(row,9,alcohol[i])

		# Total = ['Total Exercise time(hours:minutes) in','Total time(hours:minutes) in anaerobic Zone last 7 days','Total time (hours:minutes) below Aerobic Zone last 7 days',
		# 'Total Exercise time (hours:minutes) the last 7 days',
		# 'Exercise % Time in Aerobic Zone','Exercise % Time in Anaerobic zone','Exercise % Time below aerobic zone']
		# row=30
		# for i in range(len(Total)):
		# 	row = row+1
		# 	sheet10.write(row,9,Total[i])


		query_params = {
		"date":date2,
		"duration":"today,yesterday,week,month,year",
		"custom_ranges":cr1,
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other"
		}
		DATA = ProgressReport(request.user,query_params).get_progress_report()
		#print(pprint.pprint(DATA))
		c=1
		for i in range(1):
			c = c + 1
			r=2
			for n in range(len(nutri)):
				r= r+1
				sheet10.write(r+15,c+8,DATA['summary']['nutrition'][nutri[n]]['custom_range'][custom_range1]['data'],format_align)
			r=2
			for n in range(len(non_exe)):
				r= r+1	
				sheet10.write(r,c+8,DATA['summary']['non_exercise'][non_exe[n]]['custom_range'][custom_range1]['data'],format_align)

			r=9
			for n in range(len(mc)):
				r= r+1	
				sheet10.write(r,c+8,DATA['summary']['mc'][mc[n]]['custom_range'][custom_range1]['data'],format_align)	
			r=23
			for n in range(len(Alc)):
				r= r+1	
				sheet10.write(r,c+8,DATA['summary']['alcohol'][Alc[n]]['custom_range'][custom_range1]['data'],format_align)

			r=2
			for n in range(len(Ohg)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['overall_health'][Ohg[n]]['custom_range'][custom_range1]['data'],format_align)
			r=9
			for n in range(len(slept)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['sleep'][slept[n]]['custom_range'][custom_range1]['data'],format_align)
			r=17
			for n in range(len(Ec)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['ec'][Ec[n]]['custom_range'][custom_range1]['data'],format_align)
			
			r=23
			for n in range(len(Es)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['exercise'][Es[n]]['custom_range'][custom_range1]['data'],format_align)

			r=30
			for n in range(len(other1)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['other'][other1[n]]['custom_range'][custom_range1]['data'],format_align)
		query_params = {
		"date":date2,
		"duration":"today,yesterday,week,month,year",
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other"
		}
		DATA = ProgressReport(request.user,query_params).get_progress_report()


		time1=['today','yesterday','week','month','year']
		
		c = 2
		for i in range(len(time1)):
			c = c+1
			sheet10.write(3,c,DATA['summary']['overall_health']['total_gpa_point'][time1[i]],format_align)																
			sheet10.write(4,c,DATA['summary']['overall_health']['overall_health_gpa'][time1[i]],format_align)																
			sheet10.write(5,c,DATA['summary']['overall_health']['rank'][time1[i]],format_align)
			sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],format_align)
			sheet10.write(10,c,DATA['summary']['sleep']['total_sleep_in_hours_min'][time1[i]],format_align)
			sheet10.write(11,c,DATA['summary']['sleep']['rank'][time1[i]],format_align)
			sheet10.write(12,c,DATA['summary']['sleep']['average_sleep_grade'][time1[i]],format_align)
			sheet10.write(13,c,DATA['summary']['sleep']['num_days_sleep_aid_taken_in_period'][time1[i]],format_align)
			sheet10.write(14,c,DATA['summary']['sleep']['prcnt_days_sleep_aid_taken_in_period'][time1[i]],format_align)
			sheet10.write(15,c,DATA['summary']['sleep']['overall_sleep_gpa'][time1[i]],format_align)
			sheet10.write(18,c,DATA['summary']['ec']['avg_no_of_days_exercises_per_week'][time1[i]],format_align)
			sheet10.write(19,c,DATA['summary']['ec']['rank'][time1[i]],format_align)
			sheet10.write(20,c,DATA['summary']['ec']['exercise_consistency_grade'][time1[i]],format_align)
			sheet10.write(21,c,DATA['summary']['ec']['exercise_consistency_gpa'][time1[i]],format_align)
			sheet10.write(24,c,DATA['summary']['exercise']['workout_duration_hours_min'][time1[i]],format_align)
			sheet10.write(25,c,DATA['summary']['exercise']['workout_effort_level'][time1[i]],format_align)
			sheet10.write(26,c,DATA['summary']['exercise']['avg_exercise_heart_rate'][time1[i]],format_align)
			sheet10.write(27,c,DATA['summary']['exercise']['vo2_max'][time1[i]],format_align)
			sheet10.write(31,c,DATA['summary']['other']['resting_hr'][time1[i]],format_align)
			sheet10.write(32,c,DATA['summary']['other']['hrr_time_to_99'][time1[i]],format_align)
			sheet10.write(33,c,DATA['summary']['other']['hrr_beats_lowered_in_first_min'][time1[i]],format_align)
			sheet10.write(35,c,DATA['summary']['other']['hrr_lowest_hr_point'][time1[i]],format_align)
			sheet10.write(34,c,DATA['summary']['other']['hrr_highest_hr_in_first_min'][time1[i]],format_align)
			sheet10.write(36,c,DATA['summary']['other']['floors_climbed'][time1[i]],format_align)

			sheet10.write(3,c+8,DATA['summary']['non_exercise']['non_exercise_steps'][time1[i]],format_align)
			sheet10.write(5,c+8,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],format_align)
			sheet10.write(6,c+8,DATA['summary']['non_exercise']['non_exericse_steps_gpa'][time1[i]],format_align)
			sheet10.write(7,c+8,DATA['summary']['non_exercise']['total_steps'][time1[i]],format_align)
			sheet10.write(10,c+8,DATA['summary']['mc']['movement_consistency_score'][time1[i]],format_align)
			sheet10.write(11,c+8,DATA['summary']['mc']['rank'][time1[i]],format_align)
			sheet10.write(12,c+8,DATA['summary']['mc']['movement_consistency_grade'][time1[i]],format_align)
			sheet10.write(13,c+8,DATA['summary']['mc']['movement_consistency_gpa'][time1[i]])
			sheet10.write(18,c+8,DATA['summary']['nutrition']['prcnt_unprocessed_volume_of_food'][time1[i]],format_align)
			sheet10.write(19,c+8,DATA['summary']['nutrition']['rank'][time1[i]],format_align)
			sheet10.write(20,c+8,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],format_align)
			sheet10.write(21,c+8,DATA['summary']['nutrition']['prcnt_unprocessed_food_gpa'][time1[i]],format_align)
			sheet10.write(24,c+8,DATA['summary']['alcohol']['avg_drink_per_week'][time1[i]],format_align)
			sheet10.write(25,c+8,DATA['summary']['alcohol']['rank'][time1[i]],format_align)
			sheet10.write(26,c+8,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],format_align)
			sheet10.write(27,c+8,DATA['summary']['alcohol']['alcoholic_drinks_per_week_gpa'][time1[i]],format_align)
			
	elif (len(a) == 4):
		custom_ranges1_start = datetime.strptime(a[0], "%Y-%m-%d").date()
		custom_ranges1_end = datetime.strptime(a[1], "%Y-%m-%d").date()
		custom_ranges2_start = datetime.strptime(a[2], "%Y-%m-%d").date()
		custom_ranges2_end = datetime.strptime(a[3], "%Y-%m-%d").date()
		cr1='{},{}'.format(custom_ranges1_start,custom_ranges1_end)
		cr2='{},{}'.format(custom_ranges2_start,custom_ranges2_end)
		crs1 ='{},{}'.format(cr1,cr2)
		custom_range1='{} to {}'.format(custom_ranges1_start,custom_ranges1_end)
		custom_range2='{} to {}'.format(custom_ranges2_start,custom_ranges2_end)

		sheet10.set_column('K:K',45)
		sheet10.set_column('J:J',1)
		sheet10.set_column('C:F',13)
		sheet10.set_column('L:O',13)
		sheet10.set_column('P:R',17)
		sheet10.set_column('G:I',17)

		sheet10.write(0,10,'Summary Dashboard',bold)
		sheet10.write(2,10,'Non Exercise Steps',bold)
		sheet10.write(9,10,'Movement Consistency',bold)
		sheet10.write(17,10,'Nutrition',bold)
		sheet10.write(23,10,'Alcohol',bold)
		

		sheet10.conditional_format('B4:I7', {'type': 'no_errors',
                                          'format': border_format})
		sheet10.conditional_format('B11:I16', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B19:I22', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B25:I27', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B32:I37', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('K4:R8', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('K11:R14', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('K19:R22', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('K25:R28', {'type': 'no_errors',
	                                          'format': border_format})

		list1=[custom_range1,custom_range2]
		c = 1
		for i in range(len(list1)):
			c = c+1
			sheet10.write(0,c,list1[i],format)
			sheet10.write(0,c+9,list1[i],format)

		c = 3
		for i in range(len(duration)):
			c = c+1
			sheet10.write(0,c,duration[i],format)
			sheet10.write(0,c+9,duration[i],format)

		Non_Exercise_Steps=['Non Eercise Steps','Rank against other users','Movement-Non Exercise steps Grade','Non Exercise Steps GPA','Total Steps']
		row=2
		for i in range(len(Non_Exercise_Steps)):
			row=row+1
			sheet10.write(row,10,Non_Exercise_Steps[i])

		Movement_consistency=['Movement Consistency Score','Rank against other users','Movement Consistency Grade','Movement Consistency GPA']
		row=9
		for i in range(len(Movement_consistency)):
			row=row+1
			sheet10.write(row,10,Movement_consistency[i])

		Nutrition=['% Unprocessed Food of the volume of food consumed','Rank against other users','% Non Processed Food Consumed Grade','% Non Processedd Food Consumed GPA']
		row=17
		for i in range(len(Nutrition)):
			row=row+1
			sheet10.write(row,10,Nutrition[i])

		alcohol=['# of Drinks Consumed per week(7days)','Rank against other users','Alcoholic drinks per week Grade','Alcoholic drinks per week GPA']
		row=23
		for i in range(len(alcohol)):
			row = row+1
			sheet10.write(row,10,alcohol[i])

		# Total = ['Total Exercise time(hours:minutes) in','Total time(hours:minutes) in anaerobic Zone last 7 days','Total time (hours:minutes) below Aerobic Zone last 7 days',
		# 'Total Exercise time (hours:minutes) the last 7 days',
		# 'Exercise % Time in Aerobic Zone','Exercise % Time in Anaerobic zone','Exercise % Time below aerobic zone']
		# row=30
		# for i in range(len(Total)):
		# 	row = row+1
		# 	sheet10.write(row,10,Total[i])


		query_params = {
		"date":date2,
		"duration":"today,yesterday,week,month,year",
		"custom_ranges":crs1,
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other"
		}
		DATA = ProgressReport(request.user,query_params).get_progress_report()
		#print(pprint.pprint(DATA))

		c=1
		for i in range(len(list1)):
			c = c + 1
			r=2
			for n in range(len(nutri)):
				r= r+1
				sheet10.write(r+15,c+9,DATA['summary']['nutrition'][nutri[n]]['custom_range'][list1[i]]['data'],format_align)
			r=2
			for n in range(len(non_exe)):
				r= r+1	
				sheet10.write(r,c+9,DATA['summary']['non_exercise'][non_exe[n]]['custom_range'][list1[i]]['data'],format_align)

			r=9
			for n in range(len(mc)):
				r= r+1	
				sheet10.write(r,c+9,DATA['summary']['mc'][mc[n]]['custom_range'][list1[i]]['data'],format_align)	
			r=23
			for n in range(len(Alc)):
				r= r+1	
				sheet10.write(r,c+9,DATA['summary']['alcohol'][Alc[n]]['custom_range'][list1[i]]['data'],format_align)

			r=2
			for n in range(len(Ohg)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['overall_health'][Ohg[n]]['custom_range'][list1[i]]['data'],format_align)
			r=9
			for n in range(len(slept)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['sleep'][slept[n]]['custom_range'][list1[i]]['data'],format_align)
			r=17
			for n in range(len(Ec)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['ec'][Ec[n]]['custom_range'][list1[i]]['data'],format_align)
			
			r=23
			for n in range(len(Es)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['exercise'][Es[n]]['custom_range'][list1[i]]['data'],format_align)

			r=30
			for n in range(len(other1)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['other'][other1[n]]['custom_range'][list1[i]]['data'],format_align)
		
		query_params = {
		"date":date2,
		"duration":"today,yesterday,week,month,year",
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other"
		}
		DATA = ProgressReport(request.user,query_params).get_progress_report()

		time1=['today','yesterday','week','month','year']
		c = 3
		for i in range(len(time1)):
			c = c+1
			sheet10.write(3,c,DATA['summary']['overall_health']['total_gpa_point'][time1[i]],format_align)																
			sheet10.write(4,c,DATA['summary']['overall_health']['overall_health_gpa'][time1[i]],format_align)																
			sheet10.write(5,c,DATA['summary']['overall_health']['rank'][time1[i]],format_align)
			sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],format_align)
			sheet10.write(10,c,DATA['summary']['sleep']['total_sleep_in_hours_min'][time1[i]],format_align)
			sheet10.write(11,c,DATA['summary']['sleep']['rank'][time1[i]],format_align)
			sheet10.write(12,c,DATA['summary']['sleep']['average_sleep_grade'][time1[i]],format_align)
			sheet10.write(13,c,DATA['summary']['sleep']['num_days_sleep_aid_taken_in_period'][time1[i]],format_align)
			sheet10.write(14,c,DATA['summary']['sleep']['prcnt_days_sleep_aid_taken_in_period'][time1[i]],format_align)
			sheet10.write(15,c,DATA['summary']['sleep']['overall_sleep_gpa'][time1[i]],format_align)
			sheet10.write(18,c,DATA['summary']['ec']['avg_no_of_days_exercises_per_week'][time1[i]],format_align)
			sheet10.write(19,c,DATA['summary']['ec']['rank'][time1[i]],format_align)
			sheet10.write(20,c,DATA['summary']['ec']['exercise_consistency_grade'][time1[i]],format_align)
			sheet10.write(21,c,DATA['summary']['ec']['exercise_consistency_gpa'][time1[i]],format_align)
			sheet10.write(24,c,DATA['summary']['exercise']['workout_duration_hours_min'][time1[i]],format_align)
			sheet10.write(25,c,DATA['summary']['exercise']['workout_effort_level'][time1[i]],format_align)
			sheet10.write(26,c,DATA['summary']['exercise']['avg_exercise_heart_rate'][time1[i]],format_align)
			sheet10.write(27,c,DATA['summary']['exercise']['vo2_max'][time1[i]],format_align)
			sheet10.write(31,c,DATA['summary']['other']['resting_hr'][time1[i]],format_align)
			sheet10.write(32,c,DATA['summary']['other']['hrr_time_to_99'][time1[i]],format_align)
			sheet10.write(33,c,DATA['summary']['other']['hrr_beats_lowered_in_first_min'][time1[i]],format_align)
			sheet10.write(35,c,DATA['summary']['other']['hrr_lowest_hr_point'][time1[i]],format_align)
			sheet10.write(34,c,DATA['summary']['other']['hrr_highest_hr_in_first_min'][time1[i]],format_align)
			sheet10.write(36,c,DATA['summary']['other']['floors_climbed'][time1[i]],format_align)

			sheet10.write(3,c+9,DATA['summary']['non_exercise']['non_exercise_steps'][time1[i]],format_align)
			sheet10.write(5,c+9,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],format_align)
			sheet10.write(6,c+9,DATA['summary']['non_exercise']['non_exericse_steps_gpa'][time1[i]],format_align)
			sheet10.write(7,c+9,DATA['summary']['non_exercise']['total_steps'][time1[i]],format_align)
			sheet10.write(10,c+9,DATA['summary']['mc']['movement_consistency_score'][time1[i]],format_align)
			sheet10.write(11,c+9,DATA['summary']['mc']['rank'][time1[i]],format_align)
			sheet10.write(12,c+9,DATA['summary']['mc']['movement_consistency_grade'][time1[i]],format_align)
			sheet10.write(13,c+9,DATA['summary']['mc']['movement_consistency_gpa'][time1[i]])
			sheet10.write(18,c+9,DATA['summary']['nutrition']['prcnt_unprocessed_volume_of_food'][time1[i]],format_align)
			sheet10.write(19,c+9,DATA['summary']['nutrition']['rank'][time1[i]],format_align)
			sheet10.write(20,c+9,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],format_align)
			sheet10.write(21,c+9,DATA['summary']['nutrition']['prcnt_unprocessed_food_gpa'][time1[i]],format_align)
			sheet10.write(24,c+9,DATA['summary']['alcohol']['avg_drink_per_week'][time1[i]],format_align)
			sheet10.write(25,c+9,DATA['summary']['alcohol']['rank'][time1[i]],format_align)
			sheet10.write(26,c+9,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],format_align)
			sheet10.write(27,c+9,DATA['summary']['alcohol']['alcoholic_drinks_per_week_gpa'][time1[i]],format_align)
			
			

	elif (len(a) == 6):
		custom_ranges1_start = datetime.strptime(a[0], "%Y-%m-%d").date()
		custom_ranges1_end = datetime.strptime(a[1], "%Y-%m-%d").date()
		custom_ranges2_start = datetime.strptime(a[2], "%Y-%m-%d").date()
		custom_ranges2_end = datetime.strptime(a[3], "%Y-%m-%d").date()
		custom_ranges3_start = datetime.strptime(a[4], "%Y-%m-%d").date()
		custom_ranges3_end = datetime.strptime(a[5], "%Y-%m-%d").date()

		cr1='{},{}'.format(custom_ranges1_start,custom_ranges1_end)
		cr2='{},{}'.format(custom_ranges2_start,custom_ranges2_end)
		cr3='{},{}'.format(custom_ranges3_start,custom_ranges3_end)
		crs2 = '{},{},{}'.format(cr1,cr2,cr3)
		custom_range1='{} to {}'.format(custom_ranges1_start,custom_ranges1_end)
		custom_range2='{} to {}'.format(custom_ranges2_start,custom_ranges2_end)
		custom_range3='{} to {}'.format(custom_ranges3_start,custom_ranges3_end)
		
		sheet10.set_column('L:L',45)
		sheet10.set_column('K:K',1)
		sheet10.set_column('C:G',13)
		sheet10.set_column('M:Q',13)
		sheet10.set_column('R:T',17)
		sheet10.set_column('H:J',17)

		sheet10.write(0,11,'Summary Dashboard',bold)
		sheet10.write(2,11,'Non Exercise Steps',bold)
		sheet10.write(9,11,'Movement Consistency',bold)
		sheet10.write(17,11,'Nutrition',bold)
		sheet10.write(23,11,'Alcohol',bold)

		sheet10.conditional_format('B4:J7', {'type': 'no_errors',
                                          'format': border_format})
		sheet10.conditional_format('B11:J16', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B19:J22', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B25:J27', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B32:J37', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('L4:T8', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('L11:T14', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('L19:T22', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('L25:T28', {'type': 'no_errors',
	                                          'format': border_format})

		list2=[custom_range1,custom_range2,custom_range3]
		c = 1
		for i in range(len(list2)):
			c = c+1
			sheet10.write(0,c,list2[i],format)
			sheet10.write(0,c+10,list2[i],format)

		c = 4
		for i in range(len(duration)):
			c = c+1
			sheet10.write(0,c,duration[i],format)
			sheet10.write(0,c+10,duration[i],format)

		Non_Exercise_Steps=['Non Eercise Steps','Rank against other users','Movement-Non Exercise steps Grade','Non Exercise Steps GPA','Total Steps']
		row=2
		for i in range(len(Non_Exercise_Steps)):
			row=row+1
			sheet10.write(row,11,Non_Exercise_Steps[i])

		Movement_consistency=['Movement Consistency Score','Rank against other users','Movement Consistency Grade','Movement Consistency GPA']
		row=9
		for i in range(len(Movement_consistency)):
			row=row+1
			sheet10.write(row,11,Movement_consistency[i])

		Nutrition=['% Unprocessed Food of the volume of food consumed','Rank against other users','% Non Processed Food Consumed Grade','% Non Processedd Food Consumed GPA']
		row=17
		for i in range(len(Nutrition)):
			row=row+1
			sheet10.write(row,11,Nutrition[i])

		alcohol=['# of Drinks Consumed per week(7days)','Rank against other users','Alcoholic drinks per week Grade','Alcoholic drinks per week GPA']
		row=23
		for i in range(len(alcohol)):
			row = row+1
			sheet10.write(row,11,alcohol[i])

		# Total = ['Total Exercise time(hours:minutes) in','Total time(hours:minutes) in anaerobic Zone last 7 days','Total time (hours:minutes) below Aerobic Zone last 7 days',
		# 'Total Exercise time (hours:minutes) the last 7 days',
		# 'Exercise % Time in Aerobic Zone','Exercise % Time in Anaerobic zone','Exercise % Time below aerobic zone']
		# row=30
		# for i in range(len(Total)):
		# 	row = row+1
		# 	sheet10.write(row,11,Total[i])


		query_params = {
		"date":date2,
		"duration":"today,yesterday,week,month,year",
		"custom_ranges":crs2,
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other"
		}
		DATA = ProgressReport(request.user,query_params).get_progress_report()
		#print(pprint.pprint(DATA))

		c=1
		for i in range(len(list2)):
			c = c + 1
			r=2
			for n in range(len(nutri)):
				r= r+1
				sheet10.write(r+15,c+10,DATA['summary']['nutrition'][nutri[n]]['custom_range'][list2[i]]['data'],format_align)
			r=2
			for n in range(len(non_exe)):
				r= r+1	
				sheet10.write(r,c+10,DATA['summary']['non_exercise'][non_exe[n]]['custom_range'][list2[i]]['data'],format_align)

			r=9
			for n in range(len(mc)):
				r= r+1	
				sheet10.write(r,c+10,DATA['summary']['mc'][mc[n]]['custom_range'][list2[i]]['data'],format_align)	
			r=23
			for n in range(len(Alc)):
				r= r+1	
				sheet10.write(r,c+10,DATA['summary']['alcohol'][Alc[n]]['custom_range'][list2[i]]['data'],format_align)

			r=2
			for n in range(len(Ohg)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['overall_health'][Ohg[n]]['custom_range'][list2[i]]['data'],format_align)
			r=9
			for n in range(len(slept)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['sleep'][slept[n]]['custom_range'][list2[i]]['data'],format_align)
			r=17
			for n in range(len(Ec)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['ec'][Ec[n]]['custom_range'][list2[i]]['data'],format_align)
			
			r=23
			for n in range(len(Es)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['exercise'][Es[n]]['custom_range'][list2[i]]['data'],format_align)

			r=30
			for n in range(len(other1)):
				r= r+1
				sheet10.write(r,c,DATA['summary']['other'][other1[n]]['custom_range'][list2[i]]['data'],format_align)

	
	
		query_params = {
		"date":date2,
		"duration":"today,yesterday,week,month,year",
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other"
		}
		DATA = ProgressReport(request.user,query_params).get_progress_report()
		#print(pprint.pprint(DATA))
		#print(query_params['custom_ranges'])
		#sheet10.write(6,2,json_cum1['summary']['nutrition']['prcnt_unprocessed_food_gpa']['custom_range']['2018-02-12 to 2018-02-18']['to_dt'])
		
		time1=['today','yesterday','week','month','year']
		
		c = 4
		for i in range(len(time1)):
			c = c+1
			sheet10.write(3,c,DATA['summary']['overall_health']['total_gpa_point'][time1[i]],format_align)																
			sheet10.write(4,c,DATA['summary']['overall_health']['overall_health_gpa'][time1[i]],format_align)																
			sheet10.write(5,c,DATA['summary']['overall_health']['rank'][time1[i]],format_align)
			sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],format_align)
			sheet10.write(10,c,DATA['summary']['sleep']['total_sleep_in_hours_min'][time1[i]],format_align)
			sheet10.write(11,c,DATA['summary']['sleep']['rank'][time1[i]],format_align)
			sheet10.write(12,c,DATA['summary']['sleep']['average_sleep_grade'][time1[i]],format_align)
			sheet10.write(13,c,DATA['summary']['sleep']['num_days_sleep_aid_taken_in_period'][time1[i]],format_align)
			sheet10.write(14,c,DATA['summary']['sleep']['prcnt_days_sleep_aid_taken_in_period'][time1[i]],format_align)
			sheet10.write(15,c,DATA['summary']['sleep']['overall_sleep_gpa'][time1[i]],format_align)
			sheet10.write(18,c,DATA['summary']['ec']['avg_no_of_days_exercises_per_week'][time1[i]],format_align)
			sheet10.write(19,c,DATA['summary']['ec']['rank'][time1[i]],format_align)
			sheet10.write(20,c,DATA['summary']['ec']['exercise_consistency_grade'][time1[i]],format_align)
			sheet10.write(21,c,DATA['summary']['ec']['exercise_consistency_gpa'][time1[i]],format_align)
			sheet10.write(24,c,DATA['summary']['exercise']['workout_duration_hours_min'][time1[i]],format_align)
			sheet10.write(25,c,DATA['summary']['exercise']['workout_effort_level'][time1[i]],format_align)
			sheet10.write(26,c,DATA['summary']['exercise']['avg_exercise_heart_rate'][time1[i]],format_align)
			sheet10.write(27,c,DATA['summary']['exercise']['vo2_max'][time1[i]],format_align)
			sheet10.write(31,c,DATA['summary']['other']['resting_hr'][time1[i]],format_align)
			sheet10.write(32,c,DATA['summary']['other']['hrr_time_to_99'][time1[i]],format_align)
			sheet10.write(33,c,DATA['summary']['other']['hrr_beats_lowered_in_first_min'][time1[i]],format_align)
			sheet10.write(35,c,DATA['summary']['other']['hrr_lowest_hr_point'][time1[i]],format_align)
			sheet10.write(34,c,DATA['summary']['other']['hrr_highest_hr_in_first_min'][time1[i]],format_align)
			sheet10.write(36,c,DATA['summary']['other']['floors_climbed'][time1[i]],format_align)

			sheet10.write(3,c+10,DATA['summary']['non_exercise']['non_exercise_steps'][time1[i]],format_align)
			sheet10.write(5,c+10,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],format_align)
			sheet10.write(6,c+10,DATA['summary']['non_exercise']['non_exericse_steps_gpa'][time1[i]],format_align)
			sheet10.write(7,c+10,DATA['summary']['non_exercise']['total_steps'][time1[i]],format_align)
			sheet10.write(10,c+10,DATA['summary']['mc']['movement_consistency_score'][time1[i]],format_align)
			sheet10.write(11,c+10,DATA['summary']['mc']['rank'][time1[i]],format_align)
			sheet10.write(12,c+10,DATA['summary']['mc']['movement_consistency_grade'][time1[i]],format_align)
			sheet10.write(13,c+10,DATA['summary']['mc']['movement_consistency_gpa'][time1[i]])
			sheet10.write(18,c+10,DATA['summary']['nutrition']['prcnt_unprocessed_volume_of_food'][time1[i]],format_align)
			sheet10.write(19,c+10,DATA['summary']['nutrition']['rank'][time1[i]],format_align)
			sheet10.write(20,c+10,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],format_align)
			sheet10.write(21,c+10,DATA['summary']['nutrition']['prcnt_unprocessed_food_gpa'][time1[i]],format_align)
			sheet10.write(24,c+10,DATA['summary']['alcohol']['avg_drink_per_week'][time1[i]],format_align)
			sheet10.write(25,c+10,DATA['summary']['alcohol']['rank'][time1[i]],format_align)
			sheet10.write(26,c+10,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],format_align)
			sheet10.write(27,c+10,DATA['summary']['alcohol']['alcoholic_drinks_per_week_gpa'][time1[i]],format_align)
		
			
	else:
		sheet10.set_column('I:I',45)
		sheet10.set_column('H:H',1)
		sheet10.set_column('C:G',16)
		sheet10.set_column('J:O',16)

		sheet10.write(0,8,'Summary Dashboard',bold)
		sheet10.write(2,8,'Non Exercise Steps',bold)
		sheet10.write(9,8,'Movement Consistency',bold)
		sheet10.write(17,8,'Nutrition',bold)
		sheet10.write(23,8,'Alcohol',bold)

		sheet10.conditional_format('B4:G7', {'type': 'no_errors',
                                          'format': border_format})
		sheet10.conditional_format('B11:G16', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B19:G22', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B25:G27', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('B32:G37', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('I4:N8', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('I11:N14', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('I19:N22', {'type': 'no_errors',
	                                          'format': border_format})
		sheet10.conditional_format('I25:N28', {'type': 'no_errors',
	                                          'format': border_format})

		c = 1
		for i in range(len(duration)):
			c = c+1
			sheet10.write(0,c,duration[i],format)
			sheet10.write(0,c+7,duration[i],format)

		Non_Exercise_Steps=['Non Eercise Steps','Rank against other users','Movement-Non Exercise steps Grade','Non Exercise Steps GPA','Total Steps']
		row=2
		for i in range(len(Non_Exercise_Steps)):
			row=row+1
			sheet10.write(row,8,Non_Exercise_Steps[i])

		Movement_consistency=['Movement Consistency Score','Rank against other users','Movement Consistency Grade','Movement Consistency GPA']
		row=9
		for i in range(len(Movement_consistency)):
			row=row+1
			sheet10.write(row,8,Movement_consistency[i])

		Nutrition=['% Unprocessed Food of the volume of food consumed','Rank against other users','% Non Processed Food Consumed Grade','% Non Processedd Food Consumed GPA']
		row=17
		for i in range(len(Nutrition)):
			row=row+1
			sheet10.write(row,8,Nutrition[i])

		alcohol=['# of Drinks Consumed per week(7days)','Rank against other users','Alcoholic drinks per week Grade','Alcoholic drinks per week GPA']
		row=23
		for i in range(len(alcohol)):
			row = row+1
			sheet10.write(row,8,alcohol[i])

		# Total = ['Total Exercise time(hours:minutes) in','Total time(hours:minutes) in anaerobic Zone last 7 days','Total time (hours:minutes) below Aerobic Zone last 7 days',
		# 'Total Exercise time (hours:minutes) the last 7 days',
		# 'Exercise % Time in Aerobic Zone','Exercise % Time in Anaerobic zone','Exercise % Time below aerobic zone']
		# row=30
		# for i in range(len(Total)):
		# 	row = row+1
		# 	sheet10.write(row,8,Total[i])


		query_params = {
		"date":date2,
		"duration":"today,yesterday,week,month,year",
		"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other"
		}
		DATA = ProgressReport(request.user,query_params).get_progress_report()
		print(pprint.pprint(DATA))

		time1=['today','yesterday','week','month','year']
		
		c = 1
		for i in range(len(time1)):
			c = c+1
			sheet10.write(3,c,DATA['summary']['overall_health']['total_gpa_point'][time1[i]],format_align)																
			sheet10.write(4,c,DATA['summary']['overall_health']['overall_health_gpa'][time1[i]],format_align)																
			sheet10.write(5,c,DATA['summary']['overall_health']['rank'][time1[i]],format_align)
			sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],format_align)
			sheet10.write(10,c,DATA['summary']['sleep']['total_sleep_in_hours_min'][time1[i]],format_align)
			sheet10.write(11,c,DATA['summary']['sleep']['rank'][time1[i]],format_align)
			sheet10.write(12,c,DATA['summary']['sleep']['average_sleep_grade'][time1[i]],format_align)
			sheet10.write(13,c,DATA['summary']['sleep']['num_days_sleep_aid_taken_in_period'][time1[i]],format_align)
			sheet10.write(14,c,DATA['summary']['sleep']['prcnt_days_sleep_aid_taken_in_period'][time1[i]],format_align)
			sheet10.write(15,c,DATA['summary']['sleep']['overall_sleep_gpa'][time1[i]],format_align)
			sheet10.write(18,c,DATA['summary']['ec']['avg_no_of_days_exercises_per_week'][time1[i]],format_align)
			sheet10.write(19,c,DATA['summary']['ec']['rank'][time1[i]],format_align)
			sheet10.write(20,c,DATA['summary']['ec']['exercise_consistency_grade'][time1[i]],format_align)
			sheet10.write(21,c,DATA['summary']['ec']['exercise_consistency_gpa'][time1[i]],format_align)
			sheet10.write(24,c,DATA['summary']['exercise']['workout_duration_hours_min'][time1[i]],format_align)
			sheet10.write(25,c,DATA['summary']['exercise']['workout_effort_level'][time1[i]],format_align)
			sheet10.write(26,c,DATA['summary']['exercise']['avg_exercise_heart_rate'][time1[i]],format_align)
			sheet10.write(27,c,DATA['summary']['exercise']['vo2_max'][time1[i]],format_align)
			sheet10.write(31,c,DATA['summary']['other']['resting_hr'][time1[i]],format_align)
			sheet10.write(32,c,DATA['summary']['other']['hrr_time_to_99'][time1[i]],format_align)
			sheet10.write(33,c,DATA['summary']['other']['hrr_beats_lowered_in_first_min'][time1[i]],format_align)
			sheet10.write(35,c,DATA['summary']['other']['hrr_lowest_hr_point'][time1[i]],format_align)
			sheet10.write(34,c,DATA['summary']['other']['hrr_highest_hr_in_first_min'][time1[i]],format_align)
			sheet10.write(36,c,DATA['summary']['other']['floors_climbed'][time1[i]],format_align)

			sheet10.write(3,c+7,DATA['summary']['non_exercise']['non_exercise_steps'][time1[i]],format_align)
			sheet10.write(5,c+7,DATA['summary']['non_exercise']['movement_non_exercise_step_grade'][time1[i]],format_align)
			sheet10.write(6,c+7,DATA['summary']['non_exercise']['non_exericse_steps_gpa'][time1[i]],format_align)
			sheet10.write(7,c+7,DATA['summary']['non_exercise']['total_steps'][time1[i]],format_align)
			sheet10.write(10,c+7,DATA['summary']['mc']['movement_consistency_score'][time1[i]],format_align)
			sheet10.write(11,c+7,DATA['summary']['mc']['rank'][time1[i]],format_align)
			sheet10.write(12,c+7,DATA['summary']['mc']['movement_consistency_grade'][time1[i]],format_align)
			sheet10.write(13,c+7,DATA['summary']['mc']['movement_consistency_gpa'][time1[i]])
			sheet10.write(18,c+7,DATA['summary']['nutrition']['prcnt_unprocessed_volume_of_food'][time1[i]],format_align)
			sheet10.write(19,c+7,DATA['summary']['nutrition']['rank'][time1[i]],format_align)
			sheet10.write(20,c+7,DATA['summary']['nutrition']['prcnt_unprocessed_food_grade'][time1[i]],format_align)
			sheet10.write(21,c+7,DATA['summary']['nutrition']['prcnt_unprocessed_food_gpa'][time1[i]],format_align)
			sheet10.write(24,c+7,DATA['summary']['alcohol']['avg_drink_per_week'][time1[i]],format_align)
			sheet10.write(25,c+7,DATA['summary']['alcohol']['rank'][time1[i]],format_align)
			sheet10.write(26,c+7,DATA['summary']['alcohol']['alcoholic_drinks_per_week_grade'][time1[i]],format_align)
			sheet10.write(27,c+7,DATA['summary']['alcohol']['alcoholic_drinks_per_week_gpa'][time1[i]],format_align)
			
	green = book.add_format({'align':'left', 'bg_color': 'green'})
	yellow = book.add_format({'align':'left', 'bg_color': 'yellow'})
	red = book.add_format({'align':'left', 'bg_color': 'red'})
	orange = book.add_format({'align':'left', 'bg_color': 'orange'})

	sheet10.conditional_format('A1:T50', {'type':'cell', 
												'criteria':'==', 
												'value': '"A"', 
												'format': green})

	sheet10.conditional_format('A1:T50', {'type':'cell', 
												'criteria':'==', 
												'value': '"B"', 
												'format': green})

	sheet10.conditional_format('A1:T50', {'type':'cell', 
												'criteria':'==', 
												'value': '"C"', 
												'format': yellow})

	sheet10.conditional_format('A1:T50', {'type':'cell', 
												'criteria':'==', 
												'value': '"D"', 
												'format': orange})

	sheet10.conditional_format('A1:T50', {'type':'cell', 
												'criteria':'==', 
												'value': '"F"', 
												'format': red})	

	num_fmt = book.add_format({'num_format': '#,###'})

	sheet10.conditional_format('A1:T50', {'type':'cell', 
													'criteria':'>=', 
													'value': '100', 
													'format': num_fmt},)


	book.close()
	return response



