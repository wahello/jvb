import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';


axiosRetry(axios, { retries: 3}); 

export default function fetchFitBitData(successFitBit, errorFitBit,selectedDate){
	selectedDate = moment(selectedDate);
	console.log(selectedDate.format('MM-DD-YYYY'));
	const URL = `/fitbit/fetching_data_fitbit`;
	const config = {
		method: "get",
		params:{
				start_date: selectedDate.format('MM-DD-YYYY'),
			},
		url: URL,
		withCredentials: true
      
	};
	axios(config).then ((response) => {
		successFitBit(response);
	}).catch((error) => {
		errorFitBit(error);
	});
}