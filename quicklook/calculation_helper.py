import time

def cal_average_sleep_grade(sleep_duration,sleep_aid_taken):

	_to_time_obj = lambda x : time.strptime(x,"%I:%M")
	_tobj = {
		"6:00":_to_time_obj("6:00"),
		"6:29":_to_time_obj("6:29"),
		"6:30":_to_time_obj("6:30"),
		"7:00":_to_time_obj("7:00"),
		"7:29":_to_time_obj("7:29"),
		"7:30":_to_time_obj("7:30"),
		"10:00":_to_time_obj("10:00"),
		"10:01":_to_time_obj("10:01"),
		"10:30":_to_time_obj("10:30"),
		"10:31":_to_time_obj("10:31"),
		"11:00":_to_time_obj("11:00"),
		"11:30":_to_time_obj("11:30"),
		"12:00":_to_time_obj("12:00"),
	}

	GRADES = {0:"F",1:"D",2:"C",3:"B",4:"A"}

	sleep_duration = _to_time_obj(sleep_duration)
	points = 0

	if sleep_duration < _tobj["6:00"] or sleep_duration > _tobj["12:00"]:
		points = 0

	elif sleep_duration >= _tobj["7:30"] and sleep_duration <= _tobj["10:00"]:
	   points = 4

	elif ((sleep_duration >= _tobj["7:00"] and sleep_duration <= _tobj["7:29"]) or \
		(sleep_duration >= _tobj["10:01"] and sleep_duration <= _tobj["10:30"])) :
		points = 3

	elif ((sleep_duration >= _tobj["6:30"] and sleep_duration <= _tobj["7:29"]) or \
		(sleep_duration >= _tobj["10:31"] and sleep_duration <= _tobj["11:00"])) :
	   	points = 2

	elif ((sleep_duration >= _tobj["6:00"] and sleep_duration <= _tobj["6:29"]) or \
		(sleep_duration >= _tobj["11:30"] and sleep_duration <= _tobj["12:00"])) :
	   	points = 1

	if sleep_aid_taken == "yes":
		if points >= 2:
			points -= 2
		else:
			points = 0

	return GRADES[points]
 
def cal_unprocessed_food_grade(prcnt_food):
 	prcnt_food = int(prcnt_food)
 	grade = ''

 	if (prcnt_food >= 80 and prcnt_food <= 100):
 		grade = 'A'

 	elif (prcnt_food >= 70 and prcnt_food <= 79):
 		grade = 'B'

 	elif (prcnt_food >= 60 and prcnt_food <= 69):
 		grade = 'C'

 	elif (prcnt_food >= 50 and prcnt_food <= 59):
 		grade = 'D'

 	elif (prcnt_food < 50):
 		grade = 'F'

 	return grade

def cal_alcohol_drink_grade(alcohol_drank_past_week, gender):
	drink_avg = sum(map(int,alcohol_drank_past_week))\
				/len(alcohol_drank_past_week)

	grade = ''

	if gender == 'M':
		if (drink_avg >= 0 and drink_avg <= 4):
			grade = 'A'

		elif (drink_avg >= 4.01 and drink_avg <= 7):
			grade = 'B'

		elif (drink_avg >= 7.01 and drink_avg <= 10):
			grade = 'C'

		elif (drink_avg >= 10.01 and drink_avg <= 13.99):
			grade = 'D'

		elif (drink_avg >= 14):
			grade = 'F'

		return grade

	else:
		if (drink_avg >= 0 and drink_avg <= 2):
			grade = 'A'

		elif (drink_avg >= 2.01 and drink_avg <= 4):
			grade = 'B'

		elif (drink_avg >= 4.01 and drink_avg <= 5):
			grade = 'C'

		elif (drink_avg >= 5.01 and drink_avg <= 6.99):
			grade = 'D'

		elif (drink_avg >= 7):
			grade = 'F'

		return grade