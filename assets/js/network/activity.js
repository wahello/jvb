import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 4}); 

export default function fetchAcivity(date,successActivity,errorActivity){   
	console.log(date); 
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