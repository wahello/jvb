import ast
import json
import requests
import time
from rest_framework.views import APIView
from django.contrib.auth.models import User
from garmin.models import UserGarminDataActivity
from user_input.views.garmin_views import _get_activities_data
from quicklook.calculations.garmin_calculation import get_filtered_activity_stats
from user_input.utils.daily_activity import get_daily_activities_in_base_format

class ActivityWeatherView(APIView):

    def get_weather_info_for_filtered_activities(user, dt):
        date = dt.strftime('%Y-%m-%d')
        activities = get_daily_activities_in_base_format(user, date)
        garmin_list, manually_edited_list = _get_activities_data(user, date)
        manually_edited = {dic['summaryId']:dic for dic in manually_edited_list}

        filtered_activities_list = get_filtered_activity_stats(activities_json=garmin_list,
                            manually_updated_json=manually_edited,
                            userinput_activities=activities)
        weather_data = {} 
        for activity in filtered_activities_list:
            if (activity['activity_weather'] == {}) or ('activity_weather' not in activity):
                epoch_time = activity['startTimeInSeconds']+activity['startTimeOffsetInSeconds']
                if 'startingLatitudeInDegree' in activity:
                    latitude = activity['startingLatitudeInDegree']
                    longitude = activity['startingLongitudeInDegree']
                    weather_info = get_weather_info_using_lat_lng_time(latitude, longitude, epoch_time)
                    activity['activity_weather'].update(
                        {'dewPoint':weather_info['currently']['dewPoint'],
                        'humidity': weather_info['currently']['humidity'],
                        'temperature':weather_info['currently']['temperature'],
                        'wind':weather_info['currently']['windSpeed'],
                        'temperature_feels_like':weather_info['currently']['apparentTemperature']})
                weather_report = get_weather_info_using_garmin_activity(
                                            user, epoch_time, activity['summaryId'])
                weather_data[activity['summaryId']] = {**weather_report}
            weather_report = ast.literal_eval(activity['activity_weather'])
            weather_data[activity['summaryId']] = {**weather_report}
        return weather_data


def get_weather_info_using_garmin_activity(user, epoch_time, summaryId):
    weather_report = {'dewPoint':' ', 'humidity': ' ', 'temperature':' ', 
                        'wind':' ', 'temperature_feels_like': ' '}
    try:
        garmin_activity = UserGarminDataActivity.objects.get(user=user, summary_id=summaryId)
        garmin_activity_data = ast.literal_eval(garmin_activity.data)
        if 'startingLatitudeInDegree' in garmin_activity_data:
            latitude = garmin_activity_data['startingLatitudeInDegree']
            longitude = garmin_activity_data['startingLongitudeInDegree']
            
            weather_info = get_weather_info_using_lat_lng_time(latitude, longitude, epoch_time)
            weather_report.update({'dewPoint':weather_info['currently']['dewPoint'],
                'humidity': weather_info['currently']['humidity'],
                'temperature':weather_info['currently']['temperature'],
                'wind':weather_info['currently']['windSpeed'],
                'temperature_feels_like':weather_info['currently']['apparentTemperature']})
        return weather_report
    except UserGarminDataActivity.DoesNotExist:
        return weather_report


def get_weather_info_using_lat_lng_time(latitude, longitude, epoch_time, unit='si',include_block=['currently']):

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
            KEY, latitude,longitude, epoch_time, ','.join(EXCLUDE_KEYS), UNITS)
    try:
        weather_report = requests.get(url=URL)
        return weather_report.json()
    except:
        return ()
