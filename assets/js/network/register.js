import axios from 'axios';
import axiosRetry from 'axios-retry';

import {loadLocalState,saveLocalState} from '../components/localStorage';

axiosRetry(axios, { retries: 3}); 

class RegisterNetwork {

	register(post_data, callback=undefined, err_callback=undefined){
		post_data['height'] = post_data['feet']+"'"+post_data['inches']+"\"";
		post_data['sleep_goals'] = post_data['sleep_hours']+":"+post_data['sleep_minutes'];
		
		delete post_data['feet'];
		delete post_data['inches'];
		delete post_data['sleep_hours'];
		delete post_data['sleep_minutes'];
		delete post_data['goals'];

		const URL = "/api/users/";
		var config = {
			method: 'post',
			url: URL,
			data:post_data
		};
		axios(config).then(function(response){
			const auth_state = {
					authenticated: true
				};
			saveLocalState(auth_state);
			if (callback != undefined) callback(response);
		})
		.catch(function(error){
			if (err_callback != undefined) err_callback(error);
		});
	}
}

export default RegisterNetwork;