import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchProgress(successProgress,errorProgress,selectedDate,custom_ranges=undefined){   
  selectedDate = moment(selectedDate);
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

export function fetchUserRank(successRank,errorProgress,selectedDate,custom_ranges=undefined){   
  selectedDate = moment(selectedDate);
  const URL=`/leaderboard/`;
  // const URL = `https://app.jvbwellness.com/leaderboard`;
  const config={
   method:"get",
   params:{
   date: selectedDate.format('YYYY-MM-DD'),
   custom_ranges:(custom_ranges && custom_ranges.length) ? custom_ranges.toString(): null
 },
   url:URL,
   withCredentials: true,
  };
  axios(config).then((response)=>{
   successRank(response);
  }).catch(function(error){
    errorProgress(error);
  });

}
export function progressAnalyzerUpdateTime(successUpdateTime,errorUpdateTime){   
  const URL=`/progress/user/report/update_schedule`;
  const config={
   method:"get",
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successUpdateTime(response);
  }).catch(function(error){
    errorUpdateTime(error);
  });

}