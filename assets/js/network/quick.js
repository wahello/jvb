import axios from 'axios';
import axiosRetry from 'axios-retry';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

axiosRetry(axios, { retries: 4}); 

export function fetchQuickLook(successquick, errorquick){
	return function(dispatch){
		const URL = 'quicklook/users/data';
		const config = {
			method: "get",
			url: URL,
			withCredentials: true
		};
		axios(config).then ((response) => {
			successquick(response);
		}).catch((error) => {
			errorquick(error);
		});
	}
}

export function quicksummaryDate(date,successCallback, errorCallback){
	console.log(date);
    //  const URL = 'quicklook/users/data';
    //  const config = {
    //   method: "get",
    //   url: URL,
    //    params: {
    //      date: date
    //     },

    // };
    //  axios(config).then((response) => {
    //    successCallback(response);
    //  }).catch((error) => {
    //    errorCallback(error);
    // });
  }

	