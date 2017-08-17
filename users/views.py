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
import urllib
import logging
import requests 

try:
    import http.client as http_client
except ImportError:
    # Python 2
    import httplib as http_client
http_client.HTTPConnection.debuglevel = 1

logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
requests_log = logging.getLogger("requests.packages.urllib3")
requests_log.setLevel(logging.DEBUG)
requests_log.propagate = True





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

def request_token(request):
    req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
    authurl = 'http://connect.garmin.com/oauthConfirm'
    acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
    conskey = '6c1a770b-60b9-4d7e-83a2-3726080f5556';
    conssec = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9';
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
          # base_url = 'http://etws.etrade.com'
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
    callback_string = urllib.parse.quote('http://app.jvbwellness.com/callbacks/garmin')
    return redirect(authurl + '?oauth_token={0}&oauth_callback={1}'.format(request_token,callback_string))
    

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
    req_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/request_token'
    authurl = 'http://connect.garmin.com/oauthConfirm'
    acc_url = 'http://connectapi.garmin.com/oauth-service-1.0/oauth/access_token'
    conskey = '6c1a770b-60b9-4d7e-83a2-3726080f5556';
    conssec = '9Mic4bUkfqFRKNYfM3Sy6i0Ovc9Pu2G4ws9';
    session = request.session

    oauth_token = request.GET['oauth_token'] 
    oauth_verifier = request.GET['oauth_verifier']

    encoded_verifier = urllib.parse.quote(oauth_verifier)
    # xacc_url = '{0}?oauth_verifier={1}'.format(acc_url,encoded_verifier)    
    



    from requests_oauthlib import OAuth1, OAuth1Session
    s = requests.Session()
    auth = OAuth1(conskey, conssec, verifier=oauth_verifier)
    s.auth = auth
    s.headers.update({'oauth_verifier': oauth_verifier,
        'oauth_token': oauth_token,
        'oauth_token_secret': session['request_token_secret'] })

    print(s.headers)

    data = {'oauth_verifier': oauth_verifier,
        'oauth_token': oauth_token,
        'oauth_token_secret': session['request_token_secret'], 
        'oauth_timestamp': s.headers['oauth_timestamp'],
        'oauth_nonce': s.headers['oauth_nonce'],
        'oauth_signature_method': s.headers['oauth_signature_method']
    }


    r = s.get(acc_url)
    print(r.text)
    print(r.json())

    # service = OAuth1Service(
    #       # name = 'etrade',
    #       consumer_key = conskey,
    #       consumer_secret = conssec,
    #       request_token_url = req_url,
    #       access_token_url = acc_url,
    #       authorize_url = authurl, 
    #       # base_url = 'http://etws.etrade.com'
    #       )

    # #oauth_token=d37f1145-59b1-4f85-bc18-9a25e5697445&oauth_verifier=d9lZlU521B

    # print('oauth_token_secret')
    # access_token, access_token_secret = service.get_access_token(session['request_token'], session['request_token_secret'],method='GET', header_auth=True)

    # # need to validate that the token still works.... not done
    # session['state'] = 2
    # session['access_token'] = access_token
    # session['access_secret'] = access_token_secret
    # print('access token')
    # print(access_token)
    # print('access_token_secret')
    # print(access_token_secret)
    # session = service.get_auth_session(access_token,access_token_secret,method='POST',data=data)
    
    # data = {
    #   'uploadStartTimeInSeconds': 1452470400,
    #   'uploadEndTimeInSeconds': 1502150488
    # }
    # session.headers.update({'access-token': access_token})
    # r = session.request('GET','https://healthapi.garmin.com/wellness-api/rest/dailies', header_auth=True, data=data)
    # print(r.json())

    return redirect('/service_connect')
    
    # print(request)
    # $json = json_decode($_POST['uploadMetaData']);
    # $tmp_name = $_FILES['file']['tmp_name'];
    # $file_name = $_FILES['file']['name']; 
    # move_uploaded_file($tmp_name, YOUR_FILE_PATH); 
    # header('Location: YOUR_URL_FOR_THE_SAVED_FILE', true, 201);
