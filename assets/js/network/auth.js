import axiosRetry from 'axios-retry';
import axios from 'axios';
import Cookies from 'universal-cookie'; 

import {saveLocalState,destroyLocalState} from '../components/localStorage';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

axiosRetry(axios, { retries: 3}); 

export const AUTH_USER = 'auth_user',  
	   UNAUTH_USER = 'unauth_user',
	   AUTH_ERROR = 'auth_error',
	   AUTH_GARMIN = 'auth_garmin',
	   AUTH_GARMIN_ERROR = 'auth_garmin_error';

export function errorHandler(dispatch, error, type){
	console.log("Error log: ",error);
	let errorMessage = '';

	if(error.response) {
		errorMessage = error.message;
	}else if (error.request) {
		errorMessage = error.request;
	}else{
		errorMessage = error.response.data;
	}

	if (error.response.status === 401) {
		logoutUser();
		dispatch({
			type: type,
			payload: `You are not authorized to do this,
			          Please login and try again`
		});
	}else{
		dispatch({
			type: type,
			payload: errorMessage
		});
	}
}

export function loginUser(data, successCallback=undefined, errorCallback=undefined){
	return function (dispatch){
		const URL = '/api/users/login/';
		const config = {
			method: 'post',
			url: URL,
			data: data,
			withCredentials: true
		};

		axios(config).then((response) => {
			const auth_state = {
					authenticated: true,
					terms_accepted: response.data.terms_conditions
				};

			saveLocalState(auth_state);
			dispatch({
				type: AUTH_USER,
			});

			if(successCallback !== undefined){
				successCallback();
			}else{
				console.log("Successfully logged in!");
			}
		}).catch((error) => {
			const auth_state = {
					authenticated: false,
					terms_accepted:false
				};
			saveLocalState(auth_state);
			
			if(errorCallback !== undefined){
				errorCallback(error);
			}else{
				console.log(error.message);
			}
		});
	}
}

export function logoutUser(succesCallback=undefined,errorCallback=undefined){
	return function(dispatch){
		const URL = '/api/users/logout/';
		const config = {
			method: 'get',
			url: URL,
			withCredentials: true
		};
		axios(config).then((response) => {
			const auth_state = {
					authenticated: false,
					terms_accepted:  false
				};
			saveLocalState(auth_state);
			dispatch({
				type: UNAUTH_USER
			});
			if(succesCallback !== undefined){
				succesCallback(response);
			}else{
				window.location.href = '/';
			}
		}).catch((error) => {
			if(errorCallback !== undefined){
				errorCallback(error);
			}else{
				console.log(error);
			}
		});
	}
} 

export function getGarminToken(){
	return function(dispatch){
		const URL = '/users/garmin_token/';
		const config = {
			method: 'get',
			url: URL,
		};

		axios(config).then((response) => {
			dispatch({
				type:AUTH_GARMIN
			});
		}).catch((error) => {
			errorHandler(dispatch,error,AUTH_GARMIN_ERROR);
		});

	}
}

export function getUserProfile(succesCallback=undefined){
	const URL = '/api/users/profile/';
	const config = {
		url:URL,
		method:'get',
		withCredentials:true
	};
	axios(config).then(function(response){
		if(succesCallback != undefined){
			succesCallback(response);
		}
	}).catch((error) => {
		console.log(error.message);
	})
}

export function isLoggedIn(succesCallback=undefined,errorCallback=undefined){
	const URL = '/api/users/status/';
	const config = {
		url:URL,
		method:'get',
		withCredentials:true
	};
	axios(config).then(function(response){
		if(succesCallback !== undefined){
			succesCallback(response);
		}
	}).catch((error) => {
		if(errorCallback !== undefined){
			errorCallback(error);
		}else{
			console.log(error.message);
		}
	});
}