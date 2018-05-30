import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function haveGarminToken(successToken,errorToken){   
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