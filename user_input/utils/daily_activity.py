import ast
from datetime import datetime,time,timezone
from user_input.models import DailyActivity

def get_activity_base_format(activity):
    activity_data  = activity['activity_data']
    activity_data_dict = ast.literal_eval(activity_data)
    activity_weather = activity["activity_weather"]
    activity_weather_dict = ast.literal_eval(activity_weather)
    del (activity['activity_data'], activity['user_id'], \
        activity['id'], (activity['created_at']),  \
            activity["activity_weather"], activity['activity_id'])
    return {**activity_data_dict, **activity, 
            'activity_weather':activity_weather_dict}

def get_daily_activities_in_base_format(user,date,include_all=False):
    if include_all:
        current_day_dt = datetime.combine(date,time(0))
        current_day_start_epoch = int(current_day_dt.replace(
            tzinfo=timezone.utc).timestamp())
        current_day_end_epoch = current_day_start_epoch + 86400
        activities = DailyActivity.objects.filter(
                user=user, created_at=date,
                start_time_in_seconds__gte = current_day_start_epoch,
                start_time_in_seconds__lt = current_day_end_epoch).values()
    else:
        activities = DailyActivity.objects.filter(
                user=user, created_at=date).values()
    transformed_activities = {}
    for activity in activities:
        activity_id = activity['activity_id']
        transformed_activities[activity_id] = get_activity_base_format(
            activity)
    return transformed_activities