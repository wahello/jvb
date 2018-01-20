import axiosRetry from 'axios-retry';
import axios from 'axios';
import {saveLocalState,loadLocalState} from '../components/localStorage';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axiosRetry(axios, { retries: 3}); 

export function acceptTermsCondition(terms_condition_accepted=false,succesCallback=undefined, errorCallback=undefined){
	const URL = 'api/users/termsconditions/';
	const config = {
		url:URL,
		method:'post',
		withCredentials:true,
		data:{
			terms_conditions:terms_condition_accepted
		}
	};
	axios(config).then(function(response){
		let local_state = loadLocalState();
		const updated_state = {
			...local_state,
			terms_accepted: true
		};
		saveLocalState(updated_state);
		if(succesCallback != undefined)
			succesCallback(response);
	}).catch((error) => {
		if(errorCallback != undefined)
			errorCallback(error);
	})
}