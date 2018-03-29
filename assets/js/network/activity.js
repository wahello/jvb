import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import 'moment-timezone';
axiosRetry(axios, { retries: 4}); 

export default function fetchActivity(date,successActivity=undefined,errorActivity=undefined){ 
	date = moment(date); 
	const URL = 'users/daily_input/garmin_data/';
	const config = {
		url : URL,
		method: 'get',
		params:{
			"date":date.format('YYYY-MM-DD')
		},
		withCredentials: true
	};
	axios(config).then(function(response){
		if(successActivity != undefined){
			successActivity(response);
		}
	}).catch((error) => {
		if(errorActivity != undefined){
			errorActivity(error);
		}
	});
}