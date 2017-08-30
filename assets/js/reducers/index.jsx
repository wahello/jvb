import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './auth_reducer';
import garminAuthReducer from './garmin_auth_reducer';

const rootReducer = combineReducers({
  form : formReducer,
  auth : authReducer,
  garmin_auth: garminAuthReducer
});

export default rootReducer;