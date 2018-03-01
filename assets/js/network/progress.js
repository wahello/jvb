import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchProgress(successProgress,errorProgress,selectedDate,custom_ranges=undefined){   
  selectedDate = moment(selectedDate);
  if(custom_ranges)
    console.log("*****************",custom_ranges);
  const URL=`/progress/user/report`;
  const config={
   method:"get",
   params:{
   date: selectedDate.format('YYYY-MM-DD'),
   custom_ranges:(custom_ranges && custom_ranges.length) ? custom_ranges.toString(): null
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
