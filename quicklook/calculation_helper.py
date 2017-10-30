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
 