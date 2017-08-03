import React from 'react';
import ReactDOM from 'react-dom';
import HomePageContainer from '../containers/HomePageContainer';
import Register from '../components/Register';
import Forgotpassword from '../components/ForgotPassword';
import UserInputs from '../components/UserInputs';
<<<<<<< HEAD
import ServiceConnect from '../components/ServiceConnect';
=======
import Nes from '../components/nes';
import Overallgrade from '../components/OverAllGrade';
import Weeklygrade from '../components/WeeklyGrade'; 
import Breakdown from '../components/BreakDown';
import Weeklysummary from '../components/WeeklySummary';
import Sleepgraph from '../components/sleep';
>>>>>>> origin/changes
import { Switch, BrowserRouter, Route, hashHistory } from 'react-router-dom';
// require('../sass/style.scss');

// const history = createBrowserHistory();

ReactDOM.render((
  <BrowserRouter>
<<<<<<< HEAD
    <Switch>
        <Route exact path='/' component={HomePageContainer}/>
        <Route path='/register' component={Register} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/UserInputs' component={UserInputs} />
        <Route path='/service_connect' component={ServiceConnect} />
=======
  	<Switch>
    	    <Route exact path='/' component={HomePageContainer}/>
        	<Route path='/register' component={Register} />
			<Route path='/ForgotPassword' component={Forgotpassword} />
			<Route path='/UserInputs' component={UserInputs} />
			<Route path='/nes' component={Nes} />
			<Route path='/OverAllGrade' component={Overallgrade} />
			<Route path='/WeeklyGrade' component={Weeklygrade} />
			<Route path='/BreakDown' component={Breakdown} />
			<Route path='/WeeklySummary' component={Weeklysummary} />
			<Route path='/sleep' component={Sleepgraph} />
>>>>>>> origin/changes
    </Switch>
  </BrowserRouter>
), document.getElementById('react-app'));

//ReactDOM.render(<HomePageContainer />, document.getElementById('react-app'));
