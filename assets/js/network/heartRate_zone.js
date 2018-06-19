import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchHeartrateZoneData(successHeartrateZone,errorHeartrateZone,selectedDate){   
  selectedDate = moment(selectedDate);
  const URL=`/hrr/aa_low_high_calculations`;
  const config={
   method:"get",
   params:{
   start_date: selectedDate.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successHeartrateZone(response);
  }).catch(function(error){
    errorHeartrateZone(error);
  });

}