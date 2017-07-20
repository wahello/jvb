
import axiosRetry from 'axios-retry';
import axios from 'axios'

axiosRetry(axios, { retries: 3}); 

class RegisterNetwork{


	register(data, callback=undefined, error_callback=undefined){
		var DEBUG = true; 
		console.log('about to send register call');
		var url = '/api/v1/register'
		var config = {
			method: 'post',
			url: url,
			data: data 
		}
		// move axios into a standard call config
		axios(config).then(function (response){
			if (DEBUG) {
				console.log(url + 'returned');
				console.log(response)
			}
			if (callback != undefined) callback(response);
		}).catch(function (error){  // may run on the first request only, not the last
			
			if (DEBUG) console.log(error);
			if (error_callback != undefined){
				error_callback(error, data, url)
			}
		});
	}
}

export default RegisterNetwork; 
