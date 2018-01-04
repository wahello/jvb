import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import thunk from "redux-thunk"
import { createStore, applyMiddleware } from "redux";
import reducers from "../reducers";
import promise from 'redux-promise';

import RequireAuth from '../components/require_auth';
import HomePageContainer from '../containers/HomePageContainer';
import Register from '../components/registration/Register';
import Forgotpassword from '../components/ForgotPassword';
import UserInputs from '../components/user_input/UserInputs';
import Dashboard from '../components/dashboard/Dashboard';
import ServiceConnect from '../components/ServiceConnect';
import Nes from '../components/nes';
import Overallgrade from '../components/OverAllGrade';
import Weeklygrade from '../components/WeeklyGrade'; 
import Breakdown from '../components/BreakDown';
import Weeklysummary from '../components/WeeklySummary';
import Sleepgraph from '../components/sleep';
import GarminDataPage from '../components/GarminData';
import { Switch, BrowserRouter, Route, hashHistory } from 'react-router-dom';
import Quicklook from '../components/quicksummary/quicksummary';
import Movement from '../components/movement_consistency';
import DashboardSummary from '../components/dashboard_summary';

import {loadLocalState,saveLocalState} from '../components/localStorage';
import {isLoggedIn} from '../network/auth';

const createStoreWithMiddleware = applyMiddleware(promise,thunk)(createStore);

// reconcile the user state, ie. Authenticated or not with server
// and maintain this in local state "persisted_state"

function initializeLocalState(){
	let state = {authenticated:false};
	const onSuccess = (data) => {
		 state.authenticated = data.data.user_status
		 saveLocalState(state);
		 ReactDOM.render((
			<Provider store={createStoreWithMiddleware(reducers)}> 
			  <BrowserRouter>
			    <Switch>
			        <Route exact path='/' component={HomePageContainer}/>
			        <Route path='/users/dashboard' component={RequireAuth(Dashboard)} />
			        <Route path='/raw/garmin' component={RequireAuth(GarminDataPage)} />
			        <Route path='/register' component={Register} />
			        <Route path='/UserInputs' component={RequireAuth(UserInputs)} />
			        <Route path='/service_connect' component={RequireAuth(ServiceConnect)} />
					{/*<Route path='/forgotpassword/' component={Forgotpassword} />*/}
					{/*<Route path='/nes' component={RequireAuth(Nes)} /> */}
					{/*<Route path='/OverAllGrade' component={RequireAuth(Overallgrade)} /> */}
					{/*<Route path='/WeeklyGrade' component={RequireAuth(Weeklygrade)} /> */}
					{/*<Route path='/BreakDown' component={RequireAuth(Breakdown)} /> */}
					<Route path='/WeeklySummary' component={RequireAuth(Weeklysummary)} /> 
					{/*<Route path='/sleep' component={RequireAuth(Sleepgraph)} />*/}
					<Route path='/quicksummary' component={RequireAuth(Quicklook)} />
					<Route path='/dashboard_summary' component={RequireAuth(DashboardSummary)} />					
					{/*<Route path='/movement_consistency' component={RequireAuth(Movement)}/>*/}

			    </Switch>
			  </BrowserRouter>
			</Provider> 
		), document.getElementById('react-app'));	
	};

	const onFailure = (error) => {
		console.log(error.message);
	};

	isLoggedIn(onSuccess,onFailure);
}

initializeLocalState();