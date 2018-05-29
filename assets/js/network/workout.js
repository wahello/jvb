import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export function fetchWorkoutData(successWorkout,errorWorkout,selectedDate){
  {/*selectedDate = moment(selectedDate);
  const URL=`/hrr/aa_workout_calculations`;
  const config={
   method:"get",
   params:{
   start_date: selectedDate.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successWorkout(response);
  }).catch(function(error){
    errorWorkout(error);
  });*/}

}
export  function fetchAaWorkoutData(successWorkout1,errorWorkout,selectedDate){
 {/* selectedDate = moment(selectedDate);
  const URL=`/hrr/daily_aa_calculations`;
  const config={
   method:"get",
   params:{
   start_date: selectedDate.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successWorkout1(response);
  }).catch(function(error){
    errorWorkout(error);
  });*/}

}