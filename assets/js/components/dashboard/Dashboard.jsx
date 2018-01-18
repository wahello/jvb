import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { getTermsConditionStatus } from '../../network/dashboard';
import { Link } from 'react-router-dom';
import NavbarMenu from '../navbar';
import TCPopup from './dashboard_terms_and_conditions';

class Dashboard extends Component {

	constructor(props){
		super(props);
		this.state = {
			terms_condition_accepted:undefined
		};
		this.onTCStatusSuccess = this.onTCStatusSuccess.bind(this);
		this.onTCStatusFailure = this.onTCStatusFailure.bind(this);
		this.renderTCPopup = this.renderTCPopup.bind(this);
	}

	renderTCPopup(){
		if(this.state.terms_condition_accepted == false){
			return(<TCPopup/>)
		}
	}

	onTCStatusSuccess(data){
		this.setState({
			terms_condition_accepted:data.data.terms_conditions
		});
	}

	onTCStatusFailure(error){
		console.log(error.message);
	}

	// componentDidMount(){
	// 	getTermsConditionStatus(this.onTCStatusSuccess, this.onTCStatusFailure)
	// }
	
	render(){
		return (
			<div>
				<NavbarMenu fix={true}/>
				<div>
					  <div className="row">
						<div className="col-sm-6 col-sm-offset-3 social-login" style={{marginTop:"80px"}}>
						  <h3>Links</h3>
						  <div className="social-login-buttons">
	  
							 <Link to='/userinputs'>User Inputs</Link><br/>
							 {/*<Link to='/nes'>NES Graph</Link><br/>*/}
							  {/*<Link to='/sleep'>Sleeping Graph</Link><br/>*/}
							  {/*<Link to='/overallgrade'>Over All Grade</Link><br/>*/}
							  {/*<Link to='/weeklygrade'>Weekly Grade</Link><br/>*/}
							  {/*<Link to='/breakdown'>Break Down Grade</Link><br/>*/}
							  {/*<Link to='/weeklysummary'>Weekly Summary</Link><br/>*/}
							   <Link to='/raw/garmin'>Garmin Pull Down</Link><br/>
							   <a href='/users/request_token'>Garmin Health Connect</a><br/>
							   <a href='/users/connect_request_token'>Garmin Connect</a><br/>
							   <Link to='/quicksummary'>Raw Data</Link><br/>
								<Link to='/dashboard_summary'>Progress Analyzer</Link><br/>
							  {/*<Link to='/movement_consistency'>movement Consistency</Link><br/>*/}
							  {/*this.renderTCPopup()*/}
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

export default connect(mapStateToProps)(Dashboard);