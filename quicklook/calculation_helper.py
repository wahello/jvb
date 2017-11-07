from datetime import datetime, timedelta
from collections import OrderedDict

def cal_movement_consistency_summary(epochs_json):
	movement_consistency = OrderedDict()

	if epochs_json:
		epochs_json = sorted(epochs_json, key=lambda x: int(x.get('startTimeInSeconds')))
		for data in epochs_json:
			if data.get('activityType') == 'WALKING': 
				start_time = data.get('startTimeInSeconds')+ data.get('startTimeOffsetInSeconds')

				td = timedelta(hours=1)
				hour_start = datetime.utcfromtimestamp(start_time).strftime("%I %p")
				hour_end = (datetime.utcfromtimestamp(start_time)+td).strftime("%I %p")
				time_interval = hour_start+" to "+hour_end

				if not movement_consistency.get(time_interval,None):
				  movement_consistency[time_interval] = {
					"steps":0,
					"status":"inactive"
				  }

				steps_in_interval = movement_consistency[time_interval].get('steps')
				is_active = True if data.get('steps') + steps_in_interval > 300 else False

				movement_consistency[time_interval]['steps']\
					= steps_in_interval + data.get('steps')

				movement_consistency[time_interval]['status']\
					= 'active' if is_active else 'inactive'

		active_hours = 0
		inactive_hours = 0
		for interval,values in list(movement_consistency.items()):
			if values['status'] == 'active': 
				active_hours += 1 
			else:
				inactive_hours += 1
			movement_consistency['active_hours'] = active_hours
			movement_consistency['inactive_hours'] = inactive_hours

		return movement_consistency

def cal_average_sleep_grade(sleep_duration,sleep_aid_taken):
	print("calculation sleep grade")
	_to_sec = lambda x : int(x.split(":")[0]) * 3600 + int(x.split(":")[1]) * 60

	_tobj = {
		"6:00":_to_sec("6:00"),
		"6:29":_to_sec("6:29"),
		"6:30":_to_sec("6:30"),
		"7:00":_to_sec("7:00"),
		"7:29":_to_sec("7:29"),
		"7:30":_to_sec("7:30"),
		"10:00":_to_sec("10:00"),
		"10:01":_to_sec("10:01"),
		"10:30":_to_sec("10:30"),
		"10:31":_to_sec("10:31"),
		"11:00":_to_sec("11:00"),
		"11:30":_to_sec("11:30"),
		"12:00":_to_sec("12:00"),
	}

	GRADES = {0:"F",1:"D",2:"C",3:"B",4:"A"}

	sleep_duration = _to_sec(sleep_duration)
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
 	
 	if (prcnt_food >= 80 and prcnt_food <= 100):
 		return 'A'
 	elif (prcnt_food >= 70 and prcnt_food <= 79):
 		return 'B'
 	elif (prcnt_food >= 60 and prcnt_food <= 69):
 		return 'C'
 	elif (prcnt_food >= 50 and prcnt_food <= 59):
 		return 'D'
 	elif (prcnt_food < 50):
 		return 'F'

def cal_alcohol_drink_grade(alcohol_drank_past_week, gender):
	alcohol_drank_past_week = ['21' if x == '20+' else x
								for x in alcohol_drank_past_week]
								
	drink_avg = sum(map(float,alcohol_drank_past_week))\
				/len(alcohol_drank_past_week)

	if gender == 'M':
		if (drink_avg >= 0 and drink_avg <= 4):
			return 'A'
		elif (drink_avg >= 4.01 and drink_avg <= 7):
			return 'B'
		elif (drink_avg >= 7.01 and drink_avg <= 10):
			return 'C'
		elif (drink_avg >= 10.01 and drink_avg <= 13.99):
			return 'D'
		elif (drink_avg >= 14):
			return 'F'

	else:
		if (drink_avg >= 0 and drink_avg <= 2):
			return 'A'
		elif (drink_avg >= 2.01 and drink_avg <= 4):
			return 'B'
		elif (drink_avg >= 4.01 and drink_avg <= 5):
			return 'C'
		elif (drink_avg >= 5.01 and drink_avg <= 6.99):
			return 'D'
		elif (drink_avg >= 7):
			return 'F'

def cal_non_exercise_step_grade(steps):
	if steps >= 10000:
		return 'A'
	elif (steps <= 9999 and steps >= 7500):
		return 'B'
	elif (steps <= 7499 and steps >= 5000):
		return 'C'
	elif (steps <= 4999 and steps >= 3500):
		return 'D'
	elif steps < 3500:
		return 'F'

def cal_movement_consistency_grade(hours_inactive):
	if hours_inactive <= 4.5:
		return 'A'
	elif hours_inactive > 4.5 and hours_inactive <= 6:
		return 'B'
	elif hours_inactive > 6 and hours_inactive <= 7:
		return 'C'
	elif hours_inactive > 7 and hours_inactive <= 10:
		return 'D'
	elif hours_inactive > 10 :
		return 'F'