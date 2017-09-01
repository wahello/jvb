import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3}); 

export function fetchGarminData(successCallback, errorCallback){
	return function(dispatch){
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
}