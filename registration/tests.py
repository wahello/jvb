from rest_framework.test import APIClient
from django.test import TestCase
from rest_framework import status
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from regitration.forms import Registration_InputForm
class ModelTestCase(TestCase):
    """This class defines the test suite for the Registration_Input model."""

    def setUp(self):
        """Define the test client and other test variables."""
        self.user = User.objects.create_user(
            email='test@test.com', password='secret', username='tester')


    def test_model_can_create_a_registration_Input(self):
        self.registration_Input_data = {'Gender':'Male','Height':'160','Weight':'50','Date_of_Birth':'1992-10-02',
                                        'First_name':'Jose','Last_name':'Jack','Garmin_User_Name':'admin',
                                        'Garmin_Password':'june2017','Email':'admin@gmail.com'}
        self.response = self.client.post(
                            self.registration_Input_data,
                            format="json")
        """Test the Registration_Input model can create a Registration_Input."""
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)
