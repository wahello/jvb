from datetime import datetime

from django.db.models.signals import post_save
from django.dispatch import receiver

from garmin.views import GarminConnectPing
from hrr.views import hrr_calculations,\
						store_hhr,\
						store_daily_aa_calculations,\
						store_aa_low_high_end_calculations
from hrr.custom_signals import fitfile_signal

@receiver(fitfile_signal, sender=GarminConnectPing)
def create_hrrdata(sender,**kwargs):
	start_date = datetime(2018,7,1,0,0,0)
	start_date = start_date.strftime("%Y-%m-%d")
	user = kwargs.get('user')
	store_hhr(start_date,user)
	store_daily_aa_calculations(user,start_date)
	store_aa_low_high_end_calculations(user,start_date)
# @receiver(post_save, sender=GarminFitFiles)
# def save_profile(sender, instance, **kwargs):
# 	date = datetime.now()
# 	date_str = date.strftime("%Y-%m-%d")
# 	store_hhr(date_str)