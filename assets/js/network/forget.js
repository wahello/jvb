import axios from 'axios';
import axiosRetry from 'axios-retry';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

axiosRetry(axios, { retries: 4}); 

export function fetchForgetPassword(){
	//return function(dispatch){
		//const URL = '';
	// 	const config = {
	// 		method: "get",
	// 		url: URL,
	// 		withCredentials: true
	// 	};
	// 	axios(config).then ((response) => {
	// 		sucesssendmail(response);
	// 	}).catch((error) => {
	// 		errorsendmail(error);
	// 	});
	// }
}