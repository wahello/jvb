import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { fetchGarminData } from '../../network/garminOperations';

import NavbarMenu from '../navbar';

class Dashboard extends Component {

	constructor(props){
		super(props)
		this.fetchGarminData = this.fetchGarminData.bind(this);
	}
	onFetchSuccess(response){
		if(response.data === 401)
			console.log("Cannot connect to Garmin, app is not authorized!");
		else 
			console.log(response.data);
	}

	onFetchError(error){
		console.log("Cannot fetch data now!");
	}

	fetchGarminData(){
		var data = this.props.fetchGarminData(this.onFetchSuccess,this.onFetchError);
		console.log(data);
	}

	render(){
		return (
			<div>
				<NavbarMenu />
				<div>
				      <div className="row">
                        <div className="col-sm-6 col-sm-offset-3 social-login">
                          <h3>Link's</h3>
                          <div className="social-login-buttons">
                          <Link to='/users/dashboard'>Dashboard</Link><br/>

                          <Link to='register'>Register</Link><br/>
                            <Link to="forgotpassword">Forgot Password</Link><br/>
                             <Link to='userinputs'>userinputs</Link><br/>
                             <Link to='nes'>NES Graph</Link><br/>
                              <Link to='sleep'>Sleeping Graph</Link><br/>
                              <Link to='overallgrade'>Over All Grade</Link><br/>
                               <Link to='weeklygrade'>Weekly Grade</Link><br/>
                               <Link to='breakdown'>Break Down Grade</Link><br/>
                               <Link to='weeklysummary'>Weekly Summary</Link><br/>
                               <Link to='/raw/garmin'>Garmin Pull Down</Link><br/>
                               <a href='users/request_token'>Garmin Connect</a><br/>
                               <Link to='quicksummary'>Quick Summary</Link><br/>

                          </div>
                        </div>
                    </div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state){
  return {
  	have_token: state.garmin_auth.authenticated,
    errorMessage: state.garmin_auth.error,
    message : state.garmin_auth.message,
    is_authorized: state.auth.authenticated
  };
}

export default connect(mapStateToProps,{fetchGarminData})(Dashboard);