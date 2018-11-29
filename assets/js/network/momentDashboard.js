import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchMovemetData(successMovementData,errorMovementData,selectedDate){   
  selectedDate = moment(selectedDate);
  const URL=`/dashboard/movement`;
  const config={
   method:"get",
   params:{
   date: selectedDate.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successMovementData(response);
  }).catch(function(error){
    errorMovementData(error);
  });
}

export function fetchActiveData(successActiveData,errorActiveData,selectedDate){   
  selectedDate = moment(selectedDate);
  const URL=`/dashboard/api/activetime`;
  const config={
   method:"get",
   params:{
   date: selectedDate.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successActiveData(response);
  }).catch(function(error){
    errorActiveData(error);
  });
}
