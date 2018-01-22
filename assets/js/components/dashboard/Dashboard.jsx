import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { Link,withRouter } from 'react-router-dom';
import NavbarMenu from '../navbar';

class Dashboard extends Component {

	constructor(props){
		super(props);
	}

	render(){
		return (
			<div>
				<NavbarMenu fix={true}/>
				<div>
					  <div className="row">
						<div className="col-sm-6 col-sm-offset-3 social-login" style={{marginTop:"80px"}}>
						  <h3 id="link_style">Links</h3>
						  <div className="social-login-buttons">
	  
							 <Link to='/userinputs'>User Inputs</Link><br/>
							 {/*<Link to='/nes'>NES Graph</Link><br/>*/}
							  {/*<Link to='/sleep'>Sleeping Graph</Link><br/>*/}
							  {/*<Link to='/overallgrade'>Over All Grade</Link><br/>*/}
							  {/*<Link to='/weeklygrade'>Weekly Grade</Link><br/>*/}
							  {/*<Link to='/breakdown'>Break Down Grade</Link><br/>*/}
							  {/*<Link to='/weeklysummary'>Weekly Summary</Link><br/>*/}
							   <Link to='/raw/garmin'>Garmin Pull Down</Link><br/>				  
							   <Link to='/quicksummary'>Raw Data</Link><br/>
								<Link to='/dashboard_summary'>Progress Analyzer</Link><br/>
							  {/*<Link to='/movement_consistency'>movement Consistency</Link><br/>*/}
							  <h3 id="link_style">Set up Links to Garmin</h3>
							  <a href='/users/request_token'>Garmin Health Connect</a><br/>
							  <a href='/users/connect_request_token'>Garmin Connect</a><br/>
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

export default withRouter(connect(mapStateToProps)(Dashboard));