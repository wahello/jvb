import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchProgress(successProgress,errorProgress,
  selectedDate,custom_ranges=undefined,renderAfterSuccess=undefined){   
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
    if(renderAfterSuccess!=undefined)
      successProgress(response,renderAfterSuccess);
    else
      successProgress(response);
  }).catch(function(error){
    errorProgress(error);
  });

}

export function fetchUserRank(successRank,errorProgress,selectedDate,
  custom_ranges=undefined,renderAfterSuccess=undefined,lbcategories=undefined){ 
  selectedDate = moment(selectedDate);
  // see 'categories' in 'leaderboard_helper_classes.py' for full list 
  let defaultLeaderboardToRequest = ['oh_gpa','nes','mc','avg_sleep','ec','prcnt_uf',
                                 'alcohol','total_steps','floor_climbed','resting_hr',
                                 'deep_sleep','awake_time','time_99',"pure_time_99",
                                 'beat_lowered','pure_beat_lowered','overall_hrr',
                                 'active_min_total','active_min_exclude_sleep',
                                 'active_min_exclude_sleep_exercise'];

  const URL=`/leaderboard/`;
  const config={
   method:"get",
   params:{
   date: selectedDate.format('YYYY-MM-DD'),
   custom_ranges:(custom_ranges && custom_ranges.length) ? custom_ranges.toString(): null,
   category: (lbcategories && lbcategories.length) ? lbcategories.toString():defaultLeaderboardToRequest.toString()
 },
   url:URL,
   withCredentials: true,
  };
  axios(config).then((response)=>{
   if(renderAfterSuccess != undefined){ 
     successRank(response,renderAfterSuccess);
   }
   else{
    successRank(response);
  }
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