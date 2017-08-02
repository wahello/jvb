import React from 'react';
import ReactDOM from 'react-dom';
import HomePageContainer from '../containers/HomePageContainer';
import Register from '../components/Register';
import Forgotpassword from '../components/ForgotPassword';
import UserInputs from '../components/UserInputs';
import Nes from '../components/nes';
import Overallgrade from '../components/OverAllGrade';
import Weeklygrade from '../components/WeeklyGrade'; 
import Breakdown from '../components/BreakDown';
import Weeklysummary from '../components/WeeklySummary';
import Sleepgraph from '../components/sleep';
import { Switch, BrowserRouter, Route, hashHistory } from 'react-router-dom';

// const history = createBrowserHistory();

ReactDOM.render((
  <BrowserRouter>
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
    </Switch>
  </BrowserRouter>
), document.getElementById('react-app'));

//ReactDOM.render(<HomePageContainer />, document.getElementById('react-app'));
