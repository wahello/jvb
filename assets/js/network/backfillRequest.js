import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function requestBackfill(successBackfill, errorBackfill, start_date, end_date, device_type, user, status){   
  start_date = moment(start_date);
  end_date = moment(end_date);
  const URL= 'common/users/userrequestbackfill/';
  const config={
    method:"post",
    data:{
        start_date: start_date.format('YYYY-MM-DD'),
        end_date: end_date.format('YYYY-MM-DD'),
        device_type:device_type,
        user:user,
        status: status,
    },
    url:URL,
    withCredentials: true
  };
  axios(config).then((response)=>{
   successBackfill(response);
  }).catch(function(error){
    errorBackfill(error);
  });

}
