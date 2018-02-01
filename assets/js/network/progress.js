import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchProgress(fromDate, successProgress,errorProgress){   
  fromDate = moment(fromDate);
  const URL="";
  const config={
   method:"get",
   params:{
    from_date: fromDate.format('YYYY-MM-DD') 
   },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successProgress(response);
  }).catch(function(error){
    errorProgress(error);
  });
}
