from datetime import datetime
import logging

from django.contrib.auth.models import User

from hrr.views import (store_aa_calculations,
					   store_daily_aa_calculations,
					   store_aa_low_high_end_calculations)
from hrr.models import (AA,
	                   AaCalculations,
	                   TimeHeartZones)

def _get_model_types():
	MODEL_TYPES = {
		"aa":AA,
		"aacalculations":AaCalculations,
		"timeheartzones":TimeHeartZones,
	}
	return MODEL_TYPES

def update_aa_calculation(user_id,from_date):
	'''This function will generate new AA data as per new AA ranges

	Args:
		from_date(str): From which date AA calculations should be upated with new 
						AA ranges
	Return:
		None
	'''
	print("Step5")
	try:
		user = User.objects.get(id=user_id)
	except:
		logging.exception("message")
		pass
	print(user,"userrrrrrrrrrrrrrrr")
	model_type = _get_model_types()
	for key,single_model in model_type.items():
		print(single_model,"single model")
		print("Step 6")
		delete_aa_tables(user,single_model,key)
		print("Step 7")
		create_aa_tables(user,key,from_date)


def delete_aa_tables(user,model_name,key):
	'''This function will delete all the rows for given model

	Args:
		model_name(str)
	Return:
		None
	'''
	print("Step 6-1")
	if key == "aacalculations":
		model_name.objects.filter(user_aa=user).delete()
	else:
		model_name.objects.filter(user=user).delete()

def create_aa_tables(user,model_name,from_date):
	'''This function will create all the rows for given model

	Args:
		model_name(str)
		from_date(str)
	Return:
		None
	'''
	print("Step 7-1")
	to_date = convert_date_datetime_str(datetime.now())

	if model_name == 'aa':
		print("Step 7-2")
		try:
			store_aa_calculations(user,from_date,to_date)
		except:
			logging.exception("message")
	elif model_name == 'aacalculations':
		print("Entered into aa calculations")
		store_daily_aa_calculations(user,from_date,to_date)
	elif model_name == 'timeheartzones':
		print("Entered into the time heart rate zones")
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
