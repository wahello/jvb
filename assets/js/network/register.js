import axios from 'axios';
import axiosRetry from 'axios-retry';

import {loadLocalState,saveLocalState} from '../components/localStorage';

axiosRetry(axios, { retries: 3}); 

class RegisterNetwork {

	register(post_data, callback=undefined, err_callback=undefined){
		post_data['terms_conditions'] = true;
		if( (post_data['dob_day'] && post_data['dob_day'] !== "Day")
			&& (post_data['dob_month'] && post_data['dob_month'] !== "Month")
			&& (post_data['dob_year'] && post_data['dob_year'] !== "Year") ){
			let new_date_of_birth = post_data['dob_year']+"-"+post_data['dob_month']+"-"+post_data['dob_day'];
			post_data['date_of_birth']=new_date_of_birth;
		}else{
			post_data['date_of_birth']=null;
		}
		post_data['user_age'] = parseInt(post_data['user_age']);
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

export const AsyncValidateUsernameEmail = (values) => {
	const URL = "/api/users/validate_email_username/";
	let config = {
		method:"get",
		url:URL,
		params:{
			email:values.email,
			username:values.username
		}
	}
	return axios(config).then((response)=>{
		let data = response.data.data;
		let isUsernameAvailable = data.username.availability;
		let isEmailAvailable = data.email.availability;
		let thowErrorMessages = null
		if(!isUsernameAvailable){
			if(thowErrorMessages === null)
				thowErrorMessages = {'username':data.username.message}
			else
				thowErrorMessages['username'] = data.username.message
		}
		if(!isEmailAvailable){
			if(thowErrorMessages === null)
				thowErrorMessages = {'email':data.email.message}
			else
				thowErrorMessages['email'] = data.email.message
		}
		if(thowErrorMessages)
			throw thowErrorMessages;
	})
}