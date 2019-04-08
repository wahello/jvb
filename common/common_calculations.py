from datetime import datetime

from django.contrib.auth.models import User

from hrr.views import (store_garmin_aa1,
					   store_daily_aa_calculations)

def update_aa_calculation(user_id,from_date):
	'''This function will generate new AA data as per new AA ranges

	Args:
		from_date(str): From which date AA calculations should be upated with new 
						AA ranges
	Return:
		None
	'''
	try:
		user = User.objects.get(user_id=user_id)
	except:
		pass

	aa_models = ['AA','AaCalculations','TimeHeartZones']
	for index, aa_model in enumerate(aa_models):
		delete_aa_tables(aa_model)
		create_aa_tables(user,aa_model,from_date)


def delete_aa_tables(model_name):
	'''This function will delete all the rows for given model

	Args:
		model_name(str)
	Return:
		None
	'''
	model_name.objects.all().delete()

def create_aa_tables(user,model_name,from_date):
	'''This function will create all the rows for given model

	Args:
		model_name(str)
		from_date(str)
	Return:
		None
	'''
	from_date = convert_date_str_datetime(from_date)
	to_date = datetime.now()
	if model_name == 'AA':
		store_garmin_aa1(user,from_date,to_date)
	elif model_name == 'AaCalculations':
		store_daily_aa_calculations(user,from_date,to_date)
	elif model_name == 'TimeHeartZones':
		store_aa_low_high_end_calculations(user,from_date,to_date)


def convert_date_datetime_str(create_datetime_obj):
	'''
			Convert the date object to string date
			Args: date(date time object)
			Return: date(in string)
	'''
	date_str = datetime.strftime(create_datetime_obj, '%Y-%m-%d')
	return date_str

def convert_date_str_datetime(date_str):
	'''
			Convert the string date to date time object
			Args: date(in string)
			Return: date(date time object)
	'''
	date_datetime = datetime.strptime(date_str, '%Y-%m-%d')
	return date_datetime
