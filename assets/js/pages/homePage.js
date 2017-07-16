import React from 'react';
import ReactDOM from 'react-dom';
import HomePageContainer from '../containers/HomePageContainer';
import Register from '../components/Register';
import { Switch, BrowserRouter, Route, hashHistory } from 'react-router-dom';

ReactDOM.render((
  <BrowserRouter>
  	<Switch>
    	<Route path='/' component={HomePageContainer}/>
    	<Route path='/register' component={Register}/>
    </Switch>
  </BrowserRouter>


), document.getElementById('react-app'));

//ReactDOM.render(<HomePageContainer />, document.getElementById('react-app'));
