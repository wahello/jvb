import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3}); 

class RegisterNetwork {

	register(post_data, callback=undefined, err_callback=undefined){
		// const URL = "http://127.0.0.1:8000/api/users/";
		delete post_data['goals'];
		const URL = "/api/users/";
		var config = {
			method: 'post',
			url: URL,
			// data: {
			// 	username : post_data.username,
			// 	email : post_data.email,
			// 	password: post_data.password
			// }
			data:post_data
		};
		axios(config).then(function(response){
			if (callback != undefined) callback(response);
		})
		.catch(function(error){
			if (err_callback != undefined) err_callback(error);
		});
	}
}

export default RegisterNetwork;