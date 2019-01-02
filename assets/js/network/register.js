import axios from 'axios';
import axiosRetry from 'axios-retry';

import {loadLocalState,saveLocalState} from '../components/localStorage';

axiosRetry(axios, { retries: 3}); 

class RegisterNetwork {

	register(post_data, callback=undefined, err_callback=undefined){
		post_data['terms_conditions'] = true;
		let new_date_of_birth = post_data['dob_year']+"-"+post_data['dob_month']+"-"+post_data['dob_day'];
		post_data['date_of_birth']=new_date_of_birth;
		delete post_data['dob_day'];
		delete post_data['dob_month'];
		delete post_data['dob_year'];
		const URL = "/api/users/";
		var config = {
			method: 'post',
			url: URL,
			data:post_data
		};
		axios(config).then(function(response){
			const auth_state = {
					authenticated: true,
					terms_accepted:true
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

export const CheckInvitation = (email,onSuccess) => {
	const URL = "/api/users/isinvited/";
	let config = {
		method:"get",
		url:URL,
		params:{
			email:email
		}
	}
	axios(config).then((response)=>{
		onSuccess(response.data);
	})
	.catch((error) => {
		console.log(error);
	})
} 