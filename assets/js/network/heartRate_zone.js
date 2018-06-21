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
export function fetchHrrWeeklyData(startDate,endDate,successHeartrateZone, errorHeartrateZone){  
    startDate = moment(startDate);
    endDate = moment(endDate);
    const URL = `/hrr/user/heartzone_data`;
    const config = {
      method: "get",
      params:{
        to: endDate.format('YYYY-MM-DD'),
        from: startDate.format('YYYY-MM-DD') 
      },
      url: URL,
      withCredentials: true
    };
     axios(config).then((response) => {
       successHeartrateZone(response,startDate,endDate);
     }).catch(function (error){
       errorHeartrateZone(error);
    });
  }