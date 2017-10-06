import axios from 'axios';
import axiosRetry from 'axios-retry';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

axiosRetry(axios, { retries: 4}); 

export function userForgetPassword(data, callback=undefined){
	// this function will send the data to the api 
	const URL = '';
	const config = {
		url : URL,
		data : data,
		method : 'post',
		withCredentials: true,
	};
	axios(config).then(function(response){
		alert("User setpassword link send successfully!");
		if(callback != undefined){
			callback();
		}
	}.bind(this)).catch((error) => {
		console.log(error.message);
	});
}
