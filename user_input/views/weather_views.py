import json
import requests

class weather_report(APIView):

    def weather_data(self, user, activity_id, time):
        # activity weather_data should have humidity, dewpoint, \
        # wind, temperature_feels_like, max_temp, min_temp

        # By using user and activity_id  get lat, lng from UserGarminDataActivity model(garmin)
        # if lat, lng present in garmin_activity_data send both along with time to get_weather_data fn. and shape the response as req
        # if lat, lng not present in garmin_activity_datathen request front-end for them and then send to get_weather_data fn.
        if strong_input.humidity:
            DailyActivity.activity_weather = humidity
        else:
            weather_data = get_weather_data(self, latitude, longitude, time)
            DailyActivity.activity_weather = weather_data
        return DailyActivity.activity_weather

    def get_weather_data(self, latitude, longitude, time, unit='si',include_block=['currently']):

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