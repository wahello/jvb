from datetime import datetime, timezone, time
from decimal import Decimal, ROUND_HALF_UP

import quicklook.calculations.garmin_calculation
from quicklook.calculations.converter.fitbit_to_garmin_converter import timestring_to_datetime


def apple_steps_minutly_to_quartly(summary_date,steps):
	quaterly_data_list = []
	if steps:
		quarterly_data = {}
		for step in steps:
			start_time = step['Start date'][11:]
			start_time_in_seconds = timestring_to_datetime(summary_date,start_time)
			# print(start_time_in_seconds,"start_time_in_second")
			hour = start_time_in_seconds.hour
			quarter = quicklook.calculations.garmin_calculation.\
				which_quarter(start_time_in_seconds)
			if not quarterly_data.get(hour,None):
				quarter1 = "{}:00:00".format(hour)
				quarter2 = "{}:15:00".format(hour)
				quarter3 = "{}:30:00".format(hour)
				quarter4 = "{}:45:00".format(hour)
				quarterly_data[hour] = {
					0:{"time":quarter1, "value":0, "activeSeconds":0},
					1:{"time":quarter2, "value":0, "activeSeconds":0},
					2:{"time":quarter3, "value":0, "activeSeconds":0},
					3:{"time":quarter4, "value":0, "activeSeconds":0}
				}
			active_seconds = 0
			if(step.get('steps',0)):
				active_seconds = 60
			steps_per_minute = round(step.get('steps',0.0))
			quarterly_data[hour][quarter]["value"] += steps_per_minute
			quarterly_data[hour][quarter]["activeSeconds"] += active_seconds

		quaterly_data_list = [quaterly for hour in quarterly_data.values()
								   	   for quaterly in hour.values()]

	return quaterly_data_list
