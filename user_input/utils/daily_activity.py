import ast
from datetime import datetime,time,timezone

from django.db.models import Q

from user_input.models import DailyActivity

def get_activity_base_format(activity):
    activity_data  = activity['activity_data']
    activity_data_dict = ast.literal_eval(activity_data)
    activity_weather = activity["activity_weather"]
    activity_weather_dict = ast.literal_eval(activity_weather)
    del (activity['activity_data'], activity['user_id'], \
        activity['id'], (activity['created_at']),  \
            activity["activity_weather"], activity['activity_id'])
    weather_keys = ('temperature_feels_like', 'weather_condition', 'humidity', 'dewPoint', 'wind', 'temperature')
    activity_weathers = {}
    for k  in weather_keys:
        if activity_weather_dict and activity_weather_dict[k]:
            # if activity_weather_dict[k]:
            activity_weathers[k] = activity_weather_dict[k]['value']
    return {**activity_data_dict, **activity, **activity_weathers}

def get_daily_activities_in_base_format(user,date,include_all=False):
    '''
    Return the user submitted activities in their 
    base format(flat dictionary)

    Args:
        user(`obj`:User): Django User object
        date(datetime.date,string): Date for which activities are requested.
            Could be datetime.date object or string in 'YYYY-MM-DD'
            format. 
        include_all(bool): If Ture, return all the activities
            which are submitted on requested date. If False,
            ignore activities which were submitted on requested
            date but activity start time is different date
    '''
    if(type(date) is str):
        date = datetime.strptime(date,'%Y-%m-%d').date()
    current_day_dt = datetime.combine(date,time(0))
    current_day_start_epoch = int(current_day_dt.replace(
        tzinfo=timezone.utc).timestamp())
    current_day_end_epoch = current_day_start_epoch + 86400
    if include_all:
        activities = DailyActivity.objects.filter(
                Q(created_at=date) | 
                Q(start_time_in_seconds__gte = current_day_start_epoch,
                  start_time_in_seconds__lt = current_day_end_epoch),
                user=user).values()
    else:
        activities = DailyActivity.objects.filter(
                user=user,
                start_time_in_seconds__gte = current_day_start_epoch,
                start_time_in_seconds__lt = current_day_end_epoch).values()
    transformed_activities = {}
    for activity in activities:
        activity_id = activity['activity_id']
        transformed_activities[activity_id] = get_activity_base_format(
            activity)
    return transformed_activities