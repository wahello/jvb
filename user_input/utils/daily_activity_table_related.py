import ast
from user_input.models import DailyActivity


def get_activities_old_format(user, date):
    activities = DailyActivity.objects.filter(
            user=user, created_at=date).values()
    activities_data = {}
    for activity in activities:
        activity_data  = activity['activity_data']
        activity_data_dict = ast.literal_eval(activity_data)
        activity_weather = activity["activity_weather"]
        activity_weather_dict = ast.literal_eval(activity_weather)
        activity_id = activity['activity_id']
        del (activity['activity_data'], activity['user_id'], \
            activity['id'], (activity['created_at']),  \
                activity["activity_weather"], activity['activity_id'])
        activities_data[activity_id] = {**activity_data_dict, **activity, 'activity_weather':activity_weather_dict}
    return activities_data
