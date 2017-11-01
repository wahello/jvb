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

	export function userInputDate(startDate,endDate,successquick, errorquick){
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
