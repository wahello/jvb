import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 4}); 

export default function fetchWeeklySummary(successweeklysummary,errorweeklysummary){
	console.log('suresh');
	// return function(dispatch){
 //      const URL='';
 //      const config={
 //      	method:"get",
 //      	url:URL,
 //      	withCredentials: true
 //      };
 //      axios(config).then((response)=>{
 //      	successweeklysummary(response);
 //      }).catch(function(error){
 //                errorweeklysummary(error);
 //      });

	// }
}
export function weeklysummaryDate(date,successcallback,errorcallback){
	console.log(date);
	// const URL='	';
	// const config={
		// method:"get",
		//url:URL,
		//params:{
			//date:date
		//}
	//}
		//axios(config).then((response)=>{
			//successcallback(response);
		//}).catch((error) =>{
			//errorcallback(error);

		//})
	

}