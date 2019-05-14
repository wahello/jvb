import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axiosRetry(axios, { retries: 4}); 

export default function fetchHeartData(successHeart,errorHeart,selectedDate){   
  selectedDate = moment(selectedDate);
  const URL=`/hrr/hrr_calculations`;
  const config={
   method:"get",
   params:{
   start_date: selectedDate.format('YYYY-MM-DD')
 },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successHeart(response);
  }).catch(function(error){
    errorHeart(error);
  });

}

export function updateHeartData(data, selectedDate, successHeart, errorHeart){
  const URL = 'hrr/update/hrr_calculations';
  selectedDate = moment(selectedDate);
  //let date = data.fetched_user_input_created_at;
  data['created_at'] = selectedDate.format('YYYY-MM-DD');
  //console.log(data);
  const config = {
    url : URL,
    data:data,
    method: 'put',
    params:{
     start_date: selectedDate.format('YYYY-MM-DD')
   },
    withCredentials: true
  };
  axios(config).then((response)=>{
   successHeart(response);
  }).catch(function(error){
    console.log("ERROR:: "+error);
    errorHeart(error);
  });
}

export function createHRRStats(data,successCallback, errorCallback){
  const URL = 'hrr/raw_data/hrr_calculations';
  const config = {
    url : URL,
    data: data,
    method: 'post',
    withCredentials: true
  };
  axios(config).then((response)=>{
   successCallback(response);
  }).catch(function(error){
    errorCallback(error);
  });
}