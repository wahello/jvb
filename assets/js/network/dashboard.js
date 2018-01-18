import axiosRetry from 'axios-retry';
import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axiosRetry(axios, { retries: 3}); 

export function getTermsConditionStatus(succesCallback=undefined, errorCallback=undefined){
	const URL = '/api/users/statusofterms/';
	const config = {
		url:URL,
		method:'get',
		withCredentials:true
	};
	axios(config).then(function(response){
		if(succesCallback != undefined)
			succesCallback(response);
	}).catch((error) => {
		if(succesCallback != undefined)
			errorCallback(error);
	})
}

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
		if(succesCallback != undefined)
			succesCallback(response);
	}).catch((error) => {
		if(succesCallback != undefined)
			errorCallback(error);
	})
}