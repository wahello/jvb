import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchLeaderBoard(successLeaderBoard,errorLeaderBoard,selectedDate,custom_ranges=undefined){   
  selectedDate = moment(selectedDate);
  const URL=`/leaderboard/`;
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
   successLeaderBoard(response);
  }).catch(function(error){
    errorLeaderBoard(error);
  });

}