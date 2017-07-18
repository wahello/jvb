from django.shortcuts import render
from user_input.forms import Daily_User_Input_StrongForm,Daily_User_Input_EncouragedForm,Daily_User_Input_OptionalForm,Inputs_Changes_from_Third_SourcesForm,Goals_Form
# Create your views here.
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
def index(request):
    return render(request,'user_input/index.html')

def special(request):
    return HttpResponse("You are logged in ,Nice!")
@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

def user(request):

    user = False

    if request.method == "POST":
        Daily_User_Input_Strong_form = Daily_User_Input_StrongForm(data = request.POST)
        Daily_User_Input_Encourage_form = Daily_User_Input_EncouragedForm(data = request.POST)
        Daily_User_Input_Optional_form = Daily_User_Input_OptionalForm(data = request.POST)
        Inputs_Changes_from_Third_Sources_forms = Inputs_Changes_from_Third_SourcesForm(data = request.POST)
        Goals_forms = Goals_Form(data = request.POST)

        if Daily_User_Input_Strong_form.is_valid() and Daily_User_Input_Encourage_form.is_valid() and Daily_User_Input_Optional.is_valid() and Inputs_Changes_from_Third_Sources.is_valid() and  Goals_form.is_valid():

            user_input = Daily_User_Input_Strong_form.save()
            user_input.set_password(user_input.password)
            user_input.save()

            encourage = Daily_User_Input_Encourage_form.save(commit = False)
            encourage.user_input = user_input

            optional =  Daily_User_Input_Optional_form.save(commit = False)
            optional.user_input =user_input

            inputs = Inputs_Changes_from_Third_Sources_forms.save(commit =  False)
            inputs.user_input = user_input

            goals = Goals_form.save(commit = False)
            goals.registration = registration


        else:

            print(Daily._User_Input_Strong_form.errors,Daily_User_Input_Encourage_form.errors,Daily_User_Input_Optional_form.errors,Inputs_Changes_from_Third_Sources_forms.errors,Goals_form.errors)
    else:
        Daily_User_Input_Strong_form = Daily_User_Input_StrongForm()
        Daily_User_Input_Encourage_form = Daily_User_Input_EncouragedForm()
        Daily_User_Input_Optional_form =Daily_User_Input_OptionalForm()
        Inputs_Changes_from_Third_Sources_forms = Inputs_Changes_from_Third_SourcesForm()
        Goals_forms = Goals_Form()


    return render(request,{'Daily_User_Input_Strong_form':Daily_User_Input_Strong_form,
                           'Daily_User_Input_Encourage_form':Daily_User_Input_Encourage_form,
                            'Daily_User_Input_Optional_form':Daily_User_Input_Optional_form,
                            'Inputs_Changes_from_Third_Sources_forms':Inputs_Changes_from_Third_Sources_forms,
                            'Goals_forms':Goals_forms})
