import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export function fetchWeeklyWorkoutData(successWeeklyWorkoutData,errorWeeklyWorkoutData,selectedDate){
  selectedDate = moment(selectedDate);
  //const URL=`/hrr/aa_workout_calculations`;
 //  const config={
 //   method:"get",
 //   params:{
 //   start_date: selectedDate.format('YYYY-MM-DD')
 // },
 //   url:URL,
 //   withCredentials: true
 //  };
 //  axios(config).then((response)=>{
 //   successWeeklyWorkoutData(response);
 //  }).catch(function(error){
 //    errorWeeklyWorkoutData(error);
 //  });

}