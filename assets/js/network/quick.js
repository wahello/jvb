import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

axiosRetry(axios, { retries: 4}); 

export function quicksummaryDate(startDate,endDate,successquick, errorquick){  
	  startDate = moment(startDate);
    endDate = moment(endDate);
    const URL = `quicklook/users/data`;
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
       successquick(response,startDate,endDate);
     }).catch(function (error){
       errorquick(error);
    });
  }

	export function userInputDate(startDate,endDate,userInputFetchSuccess, userInputFetchfailure){
    startDate = moment(startDate);
    endDate = moment(endDate);
    const URL = `users/daily_input/`;
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
       userInputFetchSuccess(response,startDate,endDate);
     }).catch(function (error){
       userInputFetchfailure(error);
    });
  }

  export function createQuicklook(startDate, endDate,
                                  successCallback=undefined,
                                  errorCallback=undefined){

    startDate = moment(startDate);
    endDate = moment(endDate);
    const URL = `/quicklook/users/ql_calculation`;
    const config = {
      method: "post",
      data:{
        from_date: startDate.format('YYYY-MM-DD'),
        to_date: endDate.format('YYYY-MM-DD')
      },
      url: URL,
      withCredentials: true
    };
     axios(config).then((response) => {
       if(successCallback !== undefined)
         successCallback(response,startDate,endDate);
       else
        console.log("Quicklook is created successfully")
     }).catch(function (error){
       if(errorCallback !== undefined)
         errorCallback(error);
       else
         console.log("Creating Quicklook failed: "+error.message);
    });
  }

export default function movementConcictency(successmovement,errormovement){   
  console.log('suresh'); 
  return function(dispatch){
      const URL=`/quicklook/users/movement_consistency`;
      const config={
       method:"get",
       url:URL,
       withCredentials: true
      };
      axios(config).then((response)=>{
       successmovement(response);
      }).catch(function(error){
                errormovement(error);
      });

  }
}
export function movementDate(from_date,successmovement,errormovement){

  const URL=`/quicklook/users/movement_consistency`;
  from_date = moment(from_date);
  const config={
    method:"get",
    url:URL,
    params:{
      from_date:from_date.format("YYYY-MM-DD")
    }
  }
    axios(config).then((response)=>{
      successmovement(response);
    }).catch((error) =>{
      errormovement(error);

    })
  

}