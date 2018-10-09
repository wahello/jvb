import ast
import json
import requests
from rest_framework.views import APIView
from user_input.models import DailyActivity
from django.contrib.auth.models import User
from garmin.models import UserGarminDataActivity, UserGarminDataManuallyUpdated
# from quicklook.calculations.garmin_calculation import get_filtered_activity_stats

def get_weather_data(user, time, summaryId, activities):
    filtered_activities_files = quicklook.calculations.garmin_calculation\
        .get_filtered_activity_stats(activities_json=garmin_list,
                                    manually_updated_json=manually_edited_dic,
                                    userinput_activities=activities_dic)
    print ('$$$$$$$$$$$$$$$$$$$$$$$$$$', filtered_activities_files)

    weather_report = {'dewPoint':' ','humidity':' ','temperature':' ','wind':' ','description': ' '}
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

# def get_weather_info_for_garmin_activities():
#     all_users = User.objects.all()
#     for user in all_users:
#         print (user)
#         queryset = UserGarminDataActivity.objects.filter(user=user)
#         for garmin_activity in queryset:
#             garmin_activity_data = ast.literal_eval(garmin_activity.data)
#             weather_report = {}
#             if 'startingLatitudeInDegree' in garmin_activity_data:
#                 latitude = garmin_activity_data['startingLatitudeInDegree']
#                 longitude = garmin_activity_data['startingLongitudeInDegree']
#                 time = garmin_activity_data['startTimeInSeconds'] + garmin_activity_data['startTimeOffsetInSeconds']
#                 weather_info = get_weather_information(latitude, longitude, time)
#                 weather_report.update({'dewPoint':weather_info['currently']['dewPoint'],
#                     'humidity': weather_info['currently']['humidity'],
#                     'temperature':weather_info['currently']['temperature'],
#                     'wind':weather_info['currently']['windSpeed'],
#                     'description':weather_info['currently']['icon']})
#             return {'activity_weather': weather_report}

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