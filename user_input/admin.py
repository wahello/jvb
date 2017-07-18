from django.contrib import admin
from user_input.models import Daily_User_Input_Encouraged,Daily_User_Input_Strong,Daily_User_Input_Optional,Inputs_Changes_from_Third_Sources,Goals


# Register your models here.
admin.site.register(Daily_User_Input_Strong)
admin.site.register(Daily_User_Input_Encouraged)
admin.site.register(Daily_User_Input_Optional)
admin.site.register(Inputs_Changes_from_Third_Sources)
admin.site.register(Goals)
