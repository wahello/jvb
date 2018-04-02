import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';


axiosRetry(axios, { retries: 3}); 

export default function fetchFitBitData(selectedDate,successCallback, errorCallback){
	selectedDate = moment(selectedDate);
	return function(dispatch){
		const URL = "";
		const config = {
			params:{
   				date: selectedDate.format('YYYY-MM-DD'),
 			},
			method: "get",
			url: URL,
          
		};
		axios(config).then ((response) => {
			successCallback(response);
		}).catch((error) => {
			errorCallback(error);
		});
	}
}