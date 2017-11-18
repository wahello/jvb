import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

axiosRetry(axios, { retries: 4}); 

export function quicksummaryDate(startDate,endDate,successquick, errorquick){  
	  // startDate and endDate are moment objects
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
    // startDate and endDate are moment objects
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
     // startDate and endDate are moment objects
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
