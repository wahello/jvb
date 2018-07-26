import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchWeeklyWorkoutData(successHrrData,errorHrrData,selectedDate){
  selectedDate = moment(selectedDate);
  const URL=`/`;
  const config={
   method:"get",
   params:{
   start_date: selectedDate.format('YYYY-MM-DD')
 	},
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successHrrData(response);
  }).catch(function(error){
    errorHrrData(error);
  });

}