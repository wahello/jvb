import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchProgress(successProgress,errorProgress,selectedDate,fromDate = null,toDate = null){   
  selectedDate = moment(selectedDate);
  if(fromDate)
    fromDate = moment(fromDate).format('YYYY-MM-DD');
   console.log(fromDate);

  if(toDate)
    toDate = moment(toDate).format('YYYY-MM-DD');
  console.log(toDate);

  const URL=`/progress/user/report`;
  const config={
   method:"get",
   params:{
    date: selectedDate.format('YYYY-MM-DD'),
    from:fromDate,
    to:toDate
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
