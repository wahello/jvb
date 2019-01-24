import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchData(successFetch,errorFetch,start_date,end_date,selected_date){   
  selected_date = moment(selected_date);
  start_date = moment(start_date);
  end_date = moment(end_date);
  const URL= URL;
  const config={
   method:"get",
   params:{
   start_date: selected_date.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successFetch(response);
  }).catch(function(error){
    errorFetch(error);
  });

}

// export function fetchDataGarmin(successFetch,errorFetch,start_date,end_date,selected_date){   
//   selected_date = moment(selected_date);
//   start_date = moment(start_date);
//   end_date = moment(end_date);
//   const URL= URL;
//   const config={
//    method:"get",
//    params:{
//    start_date: selected_date.format('YYYY-MM-DD')
//  },
//    url:URL,
//    withCredentials: true
//   };
//   axios(config).then((response)=>{
//    successFetch(response);
//   }).catch(function(error){
//     errorFetch(error);
//   });

// }