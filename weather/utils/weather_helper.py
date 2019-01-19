def weather_report_dict(weather_data = None):
    weather_report = {
    	'dewPoint':{
    		'value':None if weather_data == None else weather_data['dewPoint'],
    		'units':'fahrenheit'
    	},
     	'humidity':{
     		'value': None if weather_data == None  else weather_data['humidity'],
     		'units': 'percentage'
     	},
     	'temperature':{
     		'value': None if weather_data == None  else weather_data['temperature'],
     		'units': 'fahrenheit'
     	},
     	'wind':{
     		'value': None if weather_data == None  else weather_data['wind'],
     		'units': 'miles/hour'
     	},
     	'temperature_feels_like':{
     		'value': None if weather_data == None  else weather_data['temperature_feels_like'],
     		'units': 'fahrenheit'
     	},
     	'weather_condition': None if weather_data == None  else weather_data['weather_condition']
     }
    return weather_report