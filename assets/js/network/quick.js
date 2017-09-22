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

export function quicksummaryDate(date,successquick, errorquick){
	const d = date.getDate();
    const m = date.getMonth()+1;
    const y = date.getFullYear();
    const URL = `quicklook/users/data/${y}/${m}/${d}`;
    const config = {
      method: "get",
      url: URL,
      withCredentials: true
    };
     axios(config).then((response) => {
       successquick(response);
     }).catch(function (error){
       errorquick(error);
    });
  }

	