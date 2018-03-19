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
						  <h3 id="link_style">User Inputs</h3>
						  <div className="social-login-buttons">
	  
							 <Link to='/userinputs'>User Inputs Daily Form</Link><br/>
							 {/*<Link to='/nes'>NES Graph</Link><br/>*/}
							  {/*<Link to='/sleep'>Sleeping Graph</Link><br/>*/}
							  {/*<Link to='/overallgrade'>Over All Grade</Link><br/>*/}
							  {/*<Link to='/weeklygrade'>Weekly Grade</Link><br/>*/}
							  {/*<Link to='/breakdown'>Break Down Grade</Link><br/>*/}
							  {/*<Link to='/weeklysummary'>Weekly Summary</Link><br/>*/}
							  <h3 id="link_style">Reporting</h3>
							  <Link to='/progressanalyzer'>Progress Analyzer</Link><br/>
							   	<h3 id="link_style">Raw Data</h3>		  
							   <Link to='/rawdata'>Raw Data</Link><br/>
							   <Link to='/rawdata#movementconsistency'>Movement Consistency</Link><br/>
							   <Link to='/rawdata#grades'>Grades</Link><br/>
							   <a target="_blank" href = "https://s3.amazonaws.com/prod.tracker2/resource/87874259/Grades%20Key%202-7-18.pdf?response-content-disposition=inline&response-content-type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJJBSFJ4TCVKKGAIA%2F20180319%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180319T065352Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=b31f5e2328c5f7e2c9604e708b85f968f87615f73ff8e8afa4864c701e106e9f">Grades Key</a><br/>
								{/*<Link to='/gradeskey'>Grades Key 1</Link><br/>*/}
							  {/*<Link to='/movement_consistency'>movement Consistency</Link><br/>*/}
							  <h3 id="link_style">Set up Links to Garmin</h3>
							  <a href='/users/request_token'>Garmin Health Connect</a><br/>
							  <a href='/users/connect_request_token'>Garmin Connect</a><br/>
							  <h3 id="link_style">Set up Link to Fitbit</h3>
							   <a href='/fitbit/request_token_fitbit'>Connect to Fitbit</a><br/>
							  <h3 id="link_style">Other</h3>
							  <Link to='/raw/garmin'>Garmin Pull Down</Link><br/>							 
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