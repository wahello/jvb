import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export function haveDeviceToken(successToken,errorToken){   
  const URL=` /common/users/have_tokens`;
  const config={
   method:"get",
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successToken(response);
  }).catch(function(error){
    errorToken(error);
  });

}