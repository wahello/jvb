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
		# pprint(pprint.pprint(DATA))
		return Response(DATA,status=status.HTTP_200_OK)


def progress_excel_export(request):
	to_date1 = request.GET.get('to_date',None)
	from_date1 = request.GET.get('from_date', None)

	to_date = datetime.strptime(to_date1, "%m-%d-%Y").date()
	from_date = datetime.strptime(from_date1, "%m-%d-%Y").date()

	x= to_date.strftime('%m-%d-%y')
	# print(type(x))
	y= x.split("-")
	z = str(int(y[0]))+'-'+str(int(y[1]))+'-'+str(int(y[2]))
	# date_format_month = str(to_date.month)+'-'+str(to_date.day)+'-'+str(to_date.year)
	# print (date_format_month)

	filename = '{}_raw_data_{}_to_{}.xlsx'.format(request.user.username,
		from_date.strftime('%b_%d_%Y'),to_date.strftime('%b_%d_%Y'))
	response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
	response['Content-Disposition'] = "attachment; filename={}".format(filename) 
	book = Workbook(response,{'in_memory': True})
	sheet10 = book.add_worksheet('Progress Analyzer')






	sheet10.freeze_panes(1,1)
	sheet10.set_column('A:A',1)
	sheet10.set_column('B:B',35)
	sheet10.set_column('L:L',45)
	sheet10.set_column('K:K',1)
	sheet10.set_column('C:I',10)
	sheet10.set_column('M:T',10)
	sheet10.set_row(0,40)
	
	sheet10.set_landscape()

	#Headings
	bold = book.add_format({'bold': True})
	sheet10.write(0,1,'Summary Dashboard',bold)
	sheet10.write(0,11,'Summary Dashboard',bold)
	sheet10.write(2,1,'Overall Health Grade',bold)
	sheet10.write(9,1,'Sleep Per Night (excluding awake time)',bold)
	sheet10.write(17,1,'Exercise Consistency',bold)
	sheet10.write(23,1,'Exercise Stats',bold)
	sheet10.write(30,1,'other stats',bold)
	sheet10.write(2,11,'Non Exercise Steps',bold)
	sheet10.write(9,11,'Movement Consistency',bold)
	sheet10.write(17,11,'Nutrition',bold)
	sheet10.write(23,11,'Alcohol',bold)

	#table borders

	
	border_format=book.add_format({
                            'border':1,
                            'align':'left',
                            'font_size':10
                           })
	
	
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
  
	#column headings
	date_format1 = book.add_format({'num_format': 'mm-dd-yyyy','bold':True})
	today= date.today()
	yesterday=date.today()-timedelta(days=1)
	custom_range_len= ['from date','to date','data']
	c = 1
	for i in range(len(custom_range_len)):
		c = c+1
		sheet10.write(0,c,custom_range_len[i],bold)
		sheet10.write(0,c+10,custom_range_len[i],bold)

	
	#sheet10.write(0,5,today,date_format1)
	#sheet10.write(0,6,yesterday,date_format1)
	#sheet10.write(0,15,today,date_format1)
	#sheet10.write(0,16,yesterday,date_format1)
	format = book.add_format({'bold': True})
	format.set_text_wrap()
	format_align = book.add_format({'align':'left'})

	#print(from_date)
	#sheet10.write(0,2,custom_range,format)
	
	duration=['Today','yesterday','Avg Last 7 days','Avg Last 30 days','Avg Year to Date']
	c=4
	for i in range(len(duration)):
		c=c+1
		sheet10.write(0,c,duration[i],format)
		sheet10.write(0,c+10,duration[i],format)

	# Row headers
	columns1=['Total GPA Points','Rank against other users','Overall Health GPA grade','overall_health_gpa']
	row=2
	for i in range(len(columns1)):
		row=row+1
		sheet10.write(row,1,columns1[i])

	sleep_per_night=['Total Sleep in hours:minutes','Rank against other users','Average Sleep Grade','# of Days Sleep Aid Taken in Period','% of Days Sleep Aid Taken in Period','Overall Sleep GPA']
	row=9
	for i in range(len(sleep_per_night)):
		row=row+1
		sheet10.write(row,1,sleep_per_night[i])

	exercise_consistency=['Avg # of Days Exercised/Week','Rank against other users','Exercise Consistency Grade','Exercise Consistency GPA']
	row=17
	for i in range(len(exercise_consistency)):
		row=row+1
		sheet10.write(row,1,exercise_consistency[i])

	exercise_stats=['Workout Effort Level','Average Exercise Heart Rate','VO2 Max']
	row=23
	for i in range(len(exercise_stats)):
		row=row+1
		sheet10.write(row,1,exercise_stats[i])

	other_stats=['Resting heart Rate(RHR)','HRR (time to 99)','HRR (heart beats lowered in 1st minute)','HRR (highest heart rate in 1st minute)','HRR (lowest heart rate point)','Floors Climbed']
	row=30
	for i in range(len(other_stats)):
		row=row+1
		sheet10.write(row,1,other_stats[i])

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

	Total = ['Total Exercise time(hours:minutes) in','Total time(hours:minutes) in anaerobic Zone last 7 days','Total time (hours:minutes) below Aerobic Zone last 7 days',
	'Total Exercise time (hours:minutes) the last 7 days',
	'Exercise % Time in Aerobic Zone','Exercise % Time in Anaerobic zone','Exercise % Time below aerobic zone']
	row=30
	for i in range(len(Total)):
		row = row+1
		sheet10.write(row,11,Total[i])

	#Transferring Json data
	#json_cum = open('/home/normsoftware/Downloads/pa_dummy.json')
	#json_cum_str = json_cum.read()
	#json_cum1 = json.loads(json_cum_str)
	
	#print(custom_range)
	#print(from_date,to_date)
	#print(date1)

	custom_range='{},{}'.format(from_date,to_date)
	date1='{}'.format(today)
	
	query_params = {
	"date":date1,
	"duration":"today,yesterday,week,month,year",
	"custom_ranges":custom_range,
	"summary":"overall_health,non_exercise,sleep,mc,ec,nutrition,exercise,alcohol,other"
	}
	DATA = ProgressReport(request.user,query_params).get_progress_report()
	print(pprint.pprint(DATA))
	#print(query_params['custom_ranges'])
	#sheet10.write(6,2,json_cum1['summary']['nutrition']['prcnt_unprocessed_food_gpa']['custom_range']['2018-02-12 to 2018-02-18']['to_dt'])
	
	time1=['today','yesterday','week','month','year']
	
	c = 4
	for i in range(len(time1)):
		c = c+1
		sheet10.write(3,c,DATA['summary']['overall_health']['total_gpa_point'][time1[i]],format_align)																
		sheet10.write(4,c,DATA['summary']['overall_health']['rank'][time1[i]],format_align)																
		sheet10.write(5,c,DATA['summary']['overall_health']['overall_health_gpa_grade'][time1[i]],format_align)
		sheet10.write(6,c,DATA['summary']['overall_health']['overall_health_gpa'][time1[i]],format_align)
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
		sheet10.write(24,c,DATA['summary']['exercise']['workout_effort_level'][time1[i]],format_align)
		sheet10.write(25,c,DATA['summary']['exercise']['avg_exercise_heart_rate'][time1[i]],format_align)
		sheet10.write(26,c,DATA['summary']['exercise']['vo2_max'][time1[i]],format_align)
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
	
	#custom_range=[from_date,to_date,'data']
	nutri=['prcnt_unprocessed_volume_of_food','rank','prcnt_unprocessed_food_grade','prcnt_unprocessed_food_gpa']
	non_exe=['non_exercise_steps','rank','movement_non_exercise_step_grade','non_exericse_steps_gpa','total_steps']
	mc=['movement_consistency_score','rank','movement_consistency_grade','movement_consistency_gpa',]
	Alc=['avg_drink_per_week','rank','alcoholic_drinks_per_week_grade','alcoholic_drinks_per_week_gpa']
	Ohg=['total_gpa_point','rank','overall_health_gpa_grade','overall_health_gpa']
	slept=['total_sleep_in_hours_min','rank','average_sleep_grade','num_days_sleep_aid_taken_in_period','prcnt_days_sleep_aid_taken_in_period','overall_sleep_gpa']
	Ec=['avg_no_of_days_exercises_per_week','rank','exercise_consistency_grade','exercise_consistency_gpa']
	Es=['workout_effort_level','avg_exercise_heart_rate','vo2_max']
	other1=['resting_hr','hrr_time_to_99','hrr_beats_lowered_in_first_min','hrr_highest_hr_in_first_min','hrr_lowest_hr_point','floors_climbed']

	range1='{} to {}'.format(from_date,to_date)
	keys = ['from_dt','to_dt','data']

	c=1
	for i in range(len(keys)):
		c = c + 1
		r=2
		for n in range(len(nutri)):
			r= r+1
			sheet10.write(r+15,c+10,DATA['summary']['nutrition'][nutri[n]]['custom_range'][range1][keys[i]],format_align)
		r=2
		for n in range(len(non_exe)):
			r= r+1	
			sheet10.write(r,c+10,DATA['summary']['non_exercise'][non_exe[n]]['custom_range'][range1][keys[i]],format_align)

		r=9
		for n in range(len(mc)):
			r= r+1	
			sheet10.write(r,c+10,DATA['summary']['mc'][mc[n]]['custom_range'][range1][keys[i]],format_align)	
		r=23
		for n in range(len(Alc)):
			r= r+1	
			sheet10.write(r,c+10,DATA['summary']['alcohol'][Alc[n]]['custom_range'][range1][keys[i]],format_align)

		r=2
		for n in range(len(Ohg)):
			r= r+1
			sheet10.write(r,c,DATA['summary']['overall_health'][Ohg[n]]['custom_range'][range1][keys[i]],format_align)
		r=9
		for n in range(len(slept)):
			r= r+1
			sheet10.write(r,c,DATA['summary']['sleep'][slept[n]]['custom_range'][range1][keys[i]],format_align)
		r=17
		for n in range(len(Ec)):
			r= r+1
			sheet10.write(r,c,DATA['summary']['ec'][Ec[n]]['custom_range'][range1][keys[i]],format_align)
		
		r=23
		for n in range(len(Es)):
			r= r+1
			sheet10.write(r,c,DATA['summary']['exercise'][Es[n]]['custom_range'][range1][keys[i]],format_align)

		r=30
		for n in range(len(other1)):
			r= r+1
			sheet10.write(r,c,DATA['summary']['other'][other1[n]]['custom_range'][range1][keys[i]],format_align)
		
		# color formatting based on grades
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
												'format': red},
												)

	book.close()
	return response