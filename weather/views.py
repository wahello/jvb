import ast
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from garmin.models import UserGarminDataActivity
from user_input.views.garmin_views import _get_activities_data
from quicklook.calculations.garmin_calculation import get_filtered_activity_stats
from user_input.utils.daily_activity import get_daily_activities_in_base_format
from weather.utils.weather_helper import weather_report_dict
from django.conf import settings
class ActivityWeatherView(APIView):

    def get(self, request):
        user = self.request.user
        start_dt = self.request.query_params.get('start_date',None)
        weather_report = self.get_weather_info_for_filtered_activities(user, start_dt)
        return weather_report

    def get_weather_info_for_filtered_activities(self, user, date):
        activities = get_daily_activities_in_base_format(user, date)
        garmin_list, manually_edited_list = _get_activities_data(user, date)
        manually_edited = {dic['summaryId']:dic for dic in manually_edited_list}

        filtered_activities_list = get_filtered_activity_stats(
                            activities_json=garmin_list,
                            user_age = user.profile.age(),
                            manually_updated_json=manually_edited,
                            userinput_activities=activities)
        weather_data = {}
        for activity in filtered_activities_list:
            epoch_time = activity['startTimeInSeconds']+activity['startTimeOffsetInSeconds']
            if not has_weather_data(activity):
                if 'startingLatitudeInDegree' in activity:
                    latitude = activity['startingLatitudeInDegree']
                    longitude = activity['startingLongitudeInDegree']

                    activity_weather = get_weather_response_as_required(
                                            latitude, longitude, epoch_time)

                    weather_data[activity['summaryId']] = {**activity_weather}
                else:
                    weather_data[activity['summaryId']] = weather_report_dict()
            else:
                weather = weather_report_dict()
                weather_keys = list(weather.keys())
                for key in weather_keys:
                    if(key == 'weather_condition'):
                         weather[key] = activity.get(key)
                    else:
                        weather[key]['value'] = activity.get(key)
                weather_data[activity['summaryId']] = weather
        return Response(weather_data)


def get_weather_info_using_garmin_activity(user, epoch_time, summaryId):
    weather_report =  weather_report_dict()
    try:
        garmin_activity = UserGarminDataActivity.objects.get(user=user, summary_id=summaryId)
        garmin_activity_data = ast.literal_eval(garmin_activity.data)
        if 'startingLatitudeInDegree' in garmin_activity_data:
            latitude = garmin_activity_data['startingLatitudeInDegree']
            longitude = garmin_activity_data['startingLongitudeInDegree']

            activity_weather = get_weather_response_as_required(
                                    latitude, longitude, epoch_time)
            weather_report.update({**activity_weather})
        return weather_report
    except UserGarminDataActivity.DoesNotExist:
        return weather_report

def get_weather_response_as_required(latitude, longitude, epoch_time):
    weather_info = get_weather_info_using_lat_lng_time(latitude, longitude, epoch_time)
    dewPoint_value = round((weather_info['currently']['dewPoint'] * 9/5)+ 32)
    temperature_value = round((weather_info['currently']['temperature'] * 9/5)+ 32)
    temperature_feels_like_value = round((weather_info['currently']['apparentTemperature'] * 9/5)+ 32)
    humidity_value = round(float(weather_info['currently']['humidity']*100))
    wind_value = round(weather_info['currently']['windSpeed']*2.237)
    weather_info = {'dewPoint': dewPoint_value,
                'humidity': humidity_value,
                'temperature': temperature_value,
                'wind': wind_value,
                'temperature_feels_like': temperature_feels_like_value,
                'weather_condition': weather_info['currently']['icon']}
    activity_weather = weather_report_dict(weather_info)
    return activity_weather


def get_weather_info_using_lat_lng_time(latitude, longitude,
    epoch_time, unit='si',include_block=['currently']):

    KEY = settings.WEATHER_KEY
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
    URL = 'https://api.darksky.net/forecast/{}/{},{},{}?exclude={}&units={}'.format(
            KEY, latitude,longitude, epoch_time, ','.join(EXCLUDE_KEYS), unit)
    try:
        weather_report = requests.get(url=URL)
        return weather_report.json()
    except:
        return ()

def has_weather_data(activity):
    '''
    Check if activity has weather information or not 
    Returns True if activity has any one of the 
    weather information othewise False
    '''
    dictfilt = lambda x, y: dict([(i, x[i]) for i in x if i in set(y)])
    weather_keys = list(weather_report_dict().keys())
    weather_keys_values = dictfilt(activity, weather_keys)
    return False if all(
        value == None for value in weather_keys_values.values()) else True
