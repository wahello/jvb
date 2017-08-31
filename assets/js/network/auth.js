import axiosRetry from 'axios-retry';
import axios from 'axios';
import Cookies from 'universal-cookie'; 

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

export function loginUser(data, callback){
	return function (dispatch){
		const URL = '/api/users/obtain-auth-token/';
		const config = {
			method: 'post',
			url: URL,
			data: data,
		};

		axios(config).then((response) => {
			const cookie = new Cookies();
			cookie.set('auth_token', response.data.token, {path:'/'});
			dispatch({
				type: AUTH_USER,
			});
			callback();
		}).catch((error) => {
			errorHandler(dispatch, error, AUTH_ERROR);
		});
	}
}

export function logoutUser(){
	return function(dispatch){
		dispatch({
			type: UNAUTH_USER
		});
		cookie.remove('auth_token', {path: '/'});
		window.location.href = '/';
	}
} 

export function getGarminToken(){
	return function(dispatch){
		const URL = '/users/garmin_token/';
		const cookie = new Cookies();
		const config = {
			method: 'get',
			url: URL,
			headers: {
				'Authorization': 'Token '+cookie.get('auth_token')
			}
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
