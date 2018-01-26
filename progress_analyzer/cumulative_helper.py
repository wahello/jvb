from datetime import datetime,timedelta

from django.conf import settings

from quicklook.models import UserQuickLook
from progress_analyzer.models import CumulativeSum 

def _str_to_datetime(str_date):
	y,m,d = map(int,str_date.split('-'))
	return datetime(y,m,d,0,0,0)

def _get_model_related_fields_names(model):
	related_fields_names = [f.name for f in model._meta.get_fields()
		if (f.one_to_many or f.one_to_one)
		and f.auto_created and not f.concrete]
	return related_fields_names

def _get_quicklook_queryset(from_dt, to_dt):
	related_fields = _get_model_related_fields_names(UserQuickLook)
	qs = UserQuickLook.object.select_related(*related_fields).filter(
		created_at__range = (from_dt.date(),to_dt.date()))
	return qs

def create_cumulative_instance(user, from_dt=None, to_dt=None):
	USER_MODEL = settings.AUTH_USER_MODEL

	from_dt = _str_to_datetime(from_dt)
	to_dt = _str_to_datetime(to_dt)
	quick_look_datewise_data = {q.strftime('%Y-%m-%d'):q for q in _get_quicklook_queryset}
	current_date = from_dt
	while current_date <= to_dt:

		current_date += timedelta(days = 1)