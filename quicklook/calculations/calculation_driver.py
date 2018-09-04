from .garmin_calculation import create_garmin_quick_look
from .fitbit_calculation import create_fitbit_quick_look

def which_device(user):
	if hasattr(user,"garmin_token"):
		return "garmin"
	elif hasattr(user,"fitbit_refresh_token"):
		return "fitbit"
	else:
		return None

def create_quick_look(user,from_date,to_date):
	device = which_device(user)
	if device and device == 'garmin':
		return create_garmin_quick_look(user,from_date,to_date)
	elif device and device == 'fitbit':
		return create_fitbit_quick_look(user, from_date, to_date)
	else:
		return {}