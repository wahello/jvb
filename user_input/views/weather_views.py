import ast
import json
import requests
from rest_framework.views import APIView
from user_input.models import DailyActivity
from garmin.models import UserGarminDataActivity

def weather_data(user, time, summaryId):
    # activity_weather should contain humidity, dewpoint, temperature, wind\
    # temperature_feels_like, max_temp, min_temp

    '''
        Function will return the weather_report for an activity if the user_input actvity present 
        in the garmin activities along with starting latitude and starting longitude 

        Either the starting latitude and starting longitude not present in garmin activities or 
        user_input activity is manually created then the activity_weather data will be null 
        (because we don't have latitude and longitude to caliculate weather report) 
    '''
    weather_report = {}
    try:
        garmin_activity = UserGarminDataActivity.objects.get(user=user, summary_id=summaryId)
        garmin_activity_data = ast.literal_eval(garmin_activity.data)
        if 'startingLatitudeInDegree' in garmin_activity_data:
            latitude = garmin_activity_data['startingLatitudeInDegree']
            longitude = garmin_activity_data['startingLongitudeInDegree']
            weather_info = get_weather_information(latitude, longitude, time)
            weather_report.update({'dewPoint':weather_info['currently']['dewPoint'],
                'humidity': weather_info['currently']['humidity'],
                'temperature':weather_info['currently']['temperature'],
                'wind':weather_info['currently']['windSpeed'],
                'description':weather_info['currently']['icon']})
        return weather_report
    except UserGarminDataActivity.DoesNotExist:
        return weather_report

def get_weather_information(latitude, longitude, time, unit='si',include_block=['currently']):

    KEY = '52871e89c8acb84e7c8b8bc8ac5ba307'
    POSSIBLE_DATA_BLOCK = ['currently', 'minutely','hourly', 'daily', 'alerts','flags'] 
    UNITS = ['si', 'auto', 'ca', 'uk2', 'us']

    if include_block == []:
        include_block.append('currently')
    else:
        for item in include_block:
            if item not in POSSIBLE_DATA_BLOCK:
                raise ValueError ('Given {} is not present in include_block'.format(item))

    if unit == '':
        unit = 'si'
    elif unit not in UNITS:
        raise ValueError ('Given {} is not present in UNITS'.format(unit))
    
    EXCLUDE_KEYS = set(POSSIBLE_DATA_BLOCK)-set(include_block)
    URL = 'https://api.darksky.net/forecast/{}/{},{},{}?exclude={}&unit={}'.format(
            KEY, latitude,longitude, time, ','.join(EXCLUDE_KEYS), UNITS)
    try:
        weather_report = requests.get(url=URL)
        return weather_report.json()
    except:
        return ()