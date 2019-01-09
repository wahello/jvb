import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchHeartRateData(successHeartRate,errorHeartRate,selectedDate){   
  selectedDate = moment(selectedDate);
  const URL=`/hrr/aa_calculations`;
  const config={
   method:"get",
   params:{
   start_date: selectedDate.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successHeartRate(response);
  }).catch(function(error){
    errorHeartRate(error);
  });

}

export function fetchHeartRateData_fitbit(successHeartRate_fitbit,errorHeartRate_fitbit,selectedDate_fitbit){   
  selectedDate = moment(selectedDate);
  const URL=`/hrr/aa_twentyfour_hour_calculations`;
  const config={
   method:"get",
   params:{
   start_date: selectedDate.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successHeartRate_fitbit(response);
  }).catch(function(error){
    errorHeartRate_fitbit(error);
  });

}