import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchLeaderBoard(successLeaderBoard,errorLeaderBoard,
                                         selectedDate,custom_ranges=undefined,
                                         custom_range=undefined,
                                         lbcategories=undefined){

  // see 'categories' in 'leaderboard_helper_classes.py' for full list 
  let defaultLeaderboardToRequest = ['oh_gpa','nes','mc','avg_sleep','ec','prcnt_uf',
                                 'alcohol','total_steps','floor_climbed','resting_hr',
                                 'deep_sleep','awake_time','time_99',"pure_time_99",
                                 'beat_lowered','pure_beat_lowered','overall_hrr',
                                 'active_min_total','active_min_exclude_sleep',
                                 'active_min_exclude_sleep_exercise'];
  selectedDate = moment(selectedDate);
  const URL=`/leaderboard/`;
  const config={
   method:"get",
   params:{
   date: selectedDate.format('YYYY-MM-DD'),
   custom_ranges:(custom_ranges && custom_ranges.length) ? custom_ranges.toString():null,
   category: (lbcategories && lbcategories.length) ? lbcategories.toString():defaultLeaderboardToRequest.toString()
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
    if(custom_range!=undefined)
      successLeaderBoard(response,custom_range);
    else
      successLeaderBoard(response);
  }).catch(function(error){
    errorLeaderBoard(error);
  });

}

export function fetchMcsSnapshot(successMcsSnapshot,errorMcsSnapshot,selectedDate){   
  selectedDate = moment(selectedDate);
  const URL=`/leaderboard/mcs_snapshot`;
  const config={
   method:"get",
   params:{
   start_date: selectedDate.format('YYYY-MM-DD'),
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successMcsSnapshot(response);
  }).catch(function(error){
    errorMcsSnapshot(error);
  });

}