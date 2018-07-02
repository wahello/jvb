import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export function haveGarminToken(successToken,errorToken){   
  const URL=` /garmin/users/have_tokens`;
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
export function haveFitBitToken(successFitBitToken,errorFitBitToken){   
  const URL=`/fitbit/users/have_fitbit_tokens`;
  const config={
   method:"get",
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successFitBitToken(response);
  }).catch(function(error){
    errorFitBitToken(error);
  });

}