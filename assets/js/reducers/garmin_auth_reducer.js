import { AUTH_GARMIN_USER, AUTH_GARMIN_ERROR } from '../network/auth';

const INITIAL_STATE = { error: '',
					    message: '',
					    content: '',
						authenticated: false};

function garminAuthReducer(state=INITIAL_STATE, action){
	switch(action.type){

		case AUTH_GARMIN_USER:
			return { ...state, authenticated: true };

		case AUTH_GARMIN_ERROR:
			return { ...state, error: action.payload };
	}
	return state;
}

export default garminAuthReducer;						