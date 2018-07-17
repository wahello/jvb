import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchGradesData(successGradesData,errorGradesData,selectedDate){   
  selectedDate = moment(selectedDate);
  const URL=`/dashboard/grades`;
  const config={
   method:"get",
   params:{
      date: selectedDate.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successGradesData(response);
  }).catch(function(error){
    errorGradesData(error);
  });

}