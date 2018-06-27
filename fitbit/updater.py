import time
import schedule

from .views import call_push_api

schedule.every(2).minutes.do(call_push_api)

while 1:
	print("startes")
    schedule.run_pending()
    time.sleep(1)