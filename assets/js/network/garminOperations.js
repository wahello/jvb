import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3}); 

function fetchGarminData(successCallback, errorCallback){
	const URL = 'users/garmin/fetch/';
	const config = {
		method: "get",
		url: URL
	};
	axios(config).then ((response) => {
		successCallback(response);
	}).catch((error) => {
		errorCallback(error);
	});

}