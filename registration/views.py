from django.shortcuts import render
from rest_framework import generics
from .models import Registration_Input
from regitration.forms import Registration_InputForm,GoalsForm,Caluculated_FieldsForms
# Create your views here.
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required



class CreateView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Registration_Input.objects.all()
    forms_class = Registration_InputForm

    def perform_create(self, forms):
        """Save the post data when creating a new bucketlist."""
        forms.save()
def index(request):
    return render(request,'user_input/index.html')

def special(request):
    return HttpResponse("You are logged in ,Nice!")
@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

def register(request):

    registered = False

    if request.method == "POST":
        Registration_Input_form = Registration_InputForm(data = request.POST)
        Goals_form = GoalsForm(data = request.POST)
        Caluculated_Fields_forms = Caluculated_FieldsForms(data = request.POST)

        if Registration_Input_form.is_valid() and Goals_form.is_valid() and Caluculated_Fields_forms.is_valid():

            registation = Registration_Input_form.save()
            registration.set_password(registration.password)
            registration.save()

            goals = Goals_form.save(commit = False)
            goals.registration = registration

            caluculatedfields = Caluculated_Fields_forms(commit = False)
            caluculatedfields.registration = registration


        else:

            print(Registration_Input_form.errors,Goals_form.errors,Caluculated_Fields_forms.errors)
    else:
        Registration_Input_form = Registration_InputForm()
        Goals_form = GoalsForm()
        Caluculated_Fields_forms =Caluculated_FieldsForms()

    return render(request,{'Registration_Input_form':Registration_Input_form,
                                                        'Goals_form':Goals_form,
                                                        'Caluculated_Fields_forms':Caluculated_Fields_forms})
