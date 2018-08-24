from .garmin_calculation import create_garmin_quick_look

def which_device(user):
	return "garmin"

def create_quick_look(user,from_date,to_date):
	device = which_device(user)
	if device == 'garmin':
		return create_garmin_quick_look(user,from_date,to_date)
	elif device == 'fitbit':
		pass