import React from 'react';
import ReactDOM from 'react-dom';
import HomePageContainer from '../containers/HomePageContainer';
import Register from '../components/Register';
import Dashboard from '../components/dashboard';
import UserInputs from '../components/UserInputs';
import ServiceConnect from '../components/ServiceConnect';
import { Switch, BrowserRouter, Route, hashHistory } from 'react-router-dom';

// const history = createBrowserHistory();

ReactDOM.render((
  <BrowserRouter>
    <Switch>
        <Route exact path='/' component={HomePageContainer}/>
        <Route path='/register' component={Register} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/UserInputs' component={UserInputs} />
        <Route path='/service_connect' component={ServiceConnect} />
    </Switch>
  </BrowserRouter>
), document.getElementById('react-app'));

//ReactDOM.render(<HomePageContainer />, document.getElementById('react-app'));
