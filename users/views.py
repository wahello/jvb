from django.shortcuts import render  # noqa
from rauth import OAuth1Service
import webbrowser 
from django.shortcuts import redirect

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions

# In state=1 the next request should include an oauth_token.
#If it doesn't go back to 0

from django.views.decorators.clickjacking import xframe_options_exempt




class UserCreate(APIView):
    """ 
    Creates the user. 
    """

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)

@xframe_options_exempt
def request_token(request):
    req_url = 'http://connectapitest.garmin.com/oauth-service-1.0/oauth/request_token'
    authurl = 'http://connecttest.garmin.com/oauthConfirm'
    acc_url = 'http://connectapitest.garmin.com/oauth-service-1.0/oauth/access_token'
    conskey = '38226ca8-88be-4641-a788-353894e5dbc0';
    conssec = 'k9KRDdmiMQtLMG43QTtl4LmDo0SohR9OtZi';
    session = request.session
    if not 'auth_token' in session and ('state' in session and session['state'])==1:
        session['state'] = 0; 
    # try:

    service = OAuth1Service(
          # name = 'etrade',
          consumer_key = conskey,
          consumer_secret = conssec,
          request_token_url = req_url,
          access_token_url = acc_url,
          authorize_url = authurl, 
          # base_url = 'https://etws.etrade.com'
          )

    # Get request token and secret    
    # $oauth = new OAuth($conskey,$conssec,OAUTH_SIG_METHOD_HMACSHA1,OAUTH_AUTH_TYPE_URI)
    # $oauth->enableDebug()

    session = request.session
    request_token, request_token_secret = service.get_request_token()               
    # $request_token_info = $oauth->getRequestToken($req_url)
    session['request_token'] = request_token
    session['request_token_secret'] = request_token_secret
    session['state'] = 1
    return redirect(authurl + '?oauth_token={0}&oauth_callback=app.jvbwellness.com/service_connect'.format(request_token))
    

  #   if not 'oauth_token' in session and not 'state' in session:
  #       # request_token, request_token_secret = service.get_request_token(params = 
  # #                     {'oauth_callback': 'oob', 
  # #                      'format': 'json'})

        # request_token, request_token_secret = service.get_request_token()               
        # # $request_token_info = $oauth->getRequestToken($req_url)
        # session['request_token'] = request_token
        # session['request_token_secret'] = request_token_secret
        # session['state'] = 1
        # return redirect(authurl + '?oauth_token={0}'.format(request_token))
  #   elif 'state' in session and session['state'] ==1:
  #       #oauth token already exists
  #       #determine access token temporaily for work  
  #       #continue
  #       access_token, access_token_secret = service.get_access_token(session['request_token'],
  #           session['request_token_secret'])

  #       # need to validate that the token still works.... not done
  #       session['state'] = 2
  #       session['access_token'] = access_token
  #       session['access_secret'] = access_token_secret
  #       return redirect('/')
    # except Exception, e:
    #     print(e)
    
def receive_token(request):
    print(request)
    # $json = json_decode($_POST['uploadMetaData']);
    # $tmp_name = $_FILES['file']['tmp_name'];
    # $file_name = $_FILES['file']['name']; 
    # move_uploaded_file($tmp_name, YOUR_FILE_PATH); 
    # header('Location: YOUR_URL_FOR_THE_SAVED_FILE', true, 201);
