import axios from 'axios';
import axiosRetry from 'axios-retry';


axiosRetry(axios, { retries: 4}); 


export default function fetchWeeklyGrade(successcallback,errorcallback){
console.log('suresh');
	//const URL = '';
		//const config = {
			//method: "get",
			//url: URL,
			//withCredentials: true
		//};
		//axios(config).then ((response) => {
			//successcallback(response);
		//}).catch((error) => {
			//errorcallback(error);
		//});


}

export function weeklygradeDate(date,successcallback,errorcallback){
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