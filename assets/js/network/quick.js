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
  export function hrrDate(startDate,endDate,hrrFetchSuccess, hrrFetchFailure){
    startDate = moment(startDate);
    endDate = moment(endDate);
    const URL = `hrr/raw_data/hrr_calculations`;
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
       hrrFetchSuccess(response,startDate,endDate);
     }).catch(function (error){
       hrrFetchFailure(error);
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

export function fetchMovementConsistency(fromDate, successmovement,errormovement, toDate=null,uid=null){   
  fromDate = moment(fromDate);
  toDate = toDate !== null?moment(toDate):null
  const URL=`/quicklook/users/movement_consistency`;
  const config={
   method:"get",
   params:{
    from_date: fromDate.format('YYYY-MM-DD'),
    to_date: toDate !== null ? toDate.format('YYYY-MM-DD'):null,
    uid:uid
   },
   url:URL,
   withCredentials: true
  };
  axios(config).then((response)=>{
   successmovement(response);
  }).catch(function(error){
    errormovement(error);
  });
}

export function downloadExcel(startDate,endDate,successPrint=undefined, errorPrint=undefined){
	startDate = moment(startDate);
    endDate = moment(endDate);
    const URL = `/quicklook/print/excel`;
    const config = {
      method: "get",
      params:{
        to_date: endDate.format('MM-DD-YYYY'),
        from_date: startDate.format('MM-DD-YYYY')
      },
      url: URL,
      withCredentials: true
    };
     axios(config).then((response) => {
       if(successPrint !== undefined)
            successPrint(response);
       else
          console.log("file is ready to download");
     }).catch(function (error){
       if(errorPrint !== undefined)
            errorPrint(error);
       else
          console.log(error.message);
    });
  }
export  function fetchLastSync(successLastSync,errorquick){
  const URL = `common/users/last_synced`;
    const config = {
      method: "get",
      url: URL,
      withCredentials: true
    };
    axios(config).then ((response) => {
      successLastSync(response);
    }).catch((error) => {
      errorquick(error);
    });


}
