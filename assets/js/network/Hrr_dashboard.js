import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchHrrSummaryData(successHrrSummaryData,errorHrrSummaryData,selectedDate){   
  selectedDate = moment(selectedDate);
  const URL=`/dashboard/hrr`;
  const config={
   method:"get",
   params:{
      date: selectedDate.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successHrrSummaryData(response);
  }).catch(function(error){
    errorHrrSummaryData(error);
  });

}