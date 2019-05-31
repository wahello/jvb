import ast
from datetime import datetime,time,timezone,timedelta

from django.db.models import Q

import quicklook
from user_input.models import DailyActivity

def get_activity_base_format(activity):
    activity_data  = activity['activity_data']
    activity_data_dict = ast.literal_eval(activity_data)
    activity_weather = activity["activity_weather"]
    activity_weather_dict = ast.literal_eval(activity_weather)
    del (activity['activity_data'], activity['user_id'], \
        activity['id'], (activity['created_at']),  \
            activity["activity_weather"], activity['activity_id'])
    weather_keys = ('temperature_feels_like', 'humidity', 'dewPoint', 'wind',
                    'temperature','indoor_temperature')
    activity_weathers = {}
    for k in weather_keys:
        if activity_weather_dict and activity_weather_dict[k]:
            activity_weathers[k] = activity_weather_dict[k]['value']
    activity_weathers['weather_condition'] = activity_weather_dict['weather_condition']
    # print(activity_data_dict,"activity_data_dict")
    return {**activity_data_dict, **activity, **activity_weathers}

def get_daily_activities_in_base_format(user,from_date,to_date=None,include_all=False):
    '''
    Return the user submitted activities in their 
    base format(flat dictionary)

    Args:
        user(`obj`:User): Django User object
        from_date(datetime.date,string): Date for which activities
            are requested.Could be datetime.date object or string in
            'YYYY-MM-DD' format.
        to_date(datetime.date, string): End Date till when activities
            are requested. Could be datetime.date object or string in
            'YYYY-MM-DD' format. Defaut to None
        include_all(bool): If Ture, return all the activities
            which are submitted on requested date. If False,
            ignore activities which were submitted on requested
            date but activity start time is different date

    Return:
        Dict: Dictionary of activities. Key is activity and value is 
            activity data.

        if to_date is provided then the dictionary will have date
        as key and another dict as value. For example - 

        {
            '2019-02-18':{
                '3387693703':{
                    'summaryId': '3387693703',
                    'averageHeartRateInBeatsPerMinute': 86,
                    ...
                },
                '3387493705':{...}
            },
            '2019-02-19':{...}
            ...
        } 
    '''
    if(type(from_date) is str):
        from_date = datetime.strptime(from_date,'%Y-%m-%d').date()
    if(to_date and type(to_date) is str):
        to_date = datetime.strptime(to_date,'%Y-%m-%d').date()

    from_date_dt = datetime.combine(from_date,time(0))
    from_date_start_epoch = int(from_date_dt.replace(
        tzinfo=timezone.utc).timestamp())

    to_date_end_epoch = from_date_start_epoch + 86400
    if to_date:
        to_date_dt = datetime.combine(to_date,time(23,59))
        to_date_end_epoch = int(to_date_dt.replace(
        tzinfo=timezone.utc).timestamp())

    if include_all:
        activities = DailyActivity.objects.filter(
                Q(created_at=from_date) | 
                Q(start_time_in_seconds__gte = from_date_start_epoch,
                  start_time_in_seconds__lte = to_date_end_epoch),
                user=user).values()
    else:
        activities = DailyActivity.objects.filter(
                user=user,
                start_time_in_seconds__gte = from_date_start_epoch,
                start_time_in_seconds__lte = to_date_end_epoch).values()
    transformed_activities = {}
    # print(from_date,to_date,"fffffffff")
    if to_date:
        while(from_date <= to_date):
            transformed_activities[from_date.strftime('%Y-%m-%d')] = {}
            from_date += timedelta(days=1)
        device_type = quicklook.calculations.calculation_driver.which_device(user)
        if device_type == 'apple':
            transformed_activities[from_date.strftime('%Y-%m-%d')] = {}
        for activity in activities:
            activity_id = activity['activity_id']
            activity_date = activity['created_at'].strftime("%Y-%m-%d")
            try:
                transformed_activities[activity_date][str(activity_id)] = get_activity_base_format(activity)
            except KeyError:
                pass
            #     transformed_activities[activity_date][str(activity_id)] = get_activity_base_format(activity)
    else:
        for activity in activities:
            activity_id = activity['activity_id']
            transformed_activities[activity_id] = get_activity_base_format(
                activity)
    return transformed_activities