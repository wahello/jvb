import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { Link,withRouter } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NavbarMenu from '../navbar';
import {haveDeviceToken} from "../../network/dashboard";

//import Aadashboard from '../components/Aadashboard';


class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			 shouldShowPopup:true,
			 linked_devices:true,
			 have_garmin_connect_token:false,
    		 have_garmin_health_token:false,
    		 have_fitbit_token:false,
		};
		this.noDeviceLinkedModel = this.noDeviceLinkedModel.bind(this);
		this.successToken = this.successToken.bind(this);
		this.errorToken = this.errorToken.bind(this);
		this.toggle = this.toggle.bind(this);

	}

	successToken(data){
		this.setState({
			linked_devices:data.data.linked_devices,
			have_garmin_connect_token:data.data.have_garmin_connect_token,
			have_garmin_health_token:data.data.have_garmin_health_token,
			have_fitbit_token:data.data.have_fitbit_token
		});
	}

	errorToken(error){
		console.log(error.message);
	}

	toggle() {
	    this.setState({
	      shouldShowPopup: !this.state.shouldShowPopup
	    });
  	}

  	/* If user haven't linked any device yet, then show this popup to remind user to link atleast one device*/
	noDeviceLinkedModel(){
		let isMissingOneGarminLink = ((!this.state.have_garmin_health_token && this.state.have_garmin_connect_token)
									  || (this.state.have_garmin_health_token && !this.state.have_garmin_connect_token));
		
		let shouldShowPopup = (!this.state.linked_devices || isMissingOneGarminLink) && this.state.shouldShowPopup;
		let message = `We noticed that you have not linked any wearable device yet.
				       Click the links below to link devices supported by us
				       so we can provide you with lots of cool reporting, grades from your
				       data and analysis from your workouts!`; 

		if(isMissingOneGarminLink){
			message = `We noticed that you have not linked one of the Garmin API.
                       Click the link below to connect it so we can provide you with
                       lots of cool reporting, grades from your data and analysis
                       from your workouts!`;
		}
		let modal =  <Modal isOpen={shouldShowPopup} 
						  toggle = {this.toggle} 
						  className={this.props.className}>
				          <ModalHeader>Link wearable device(s)</ModalHeader>
				          <ModalBody>
				          	<p>{message}</p>
				            <div style={{display:'flex',justifyContent:'space-between'}}>
				            	{!this.state.have_garmin_health_token && 
						            <a href='/users/request_token' 
					          	    	className = "garminlink">
					          	    	<Button color="primary" style = {{fontSize:"13px"}}>Garmin Health<br/></Button>
					          	    </a>
				          	   	}
				          	   	{!this.state.have_garmin_connect_token &&
									<a href='/users/connect_request_token' 
										className = "garminlink">
										<Button color="primary" style = {{fontSize:"13px"}}>Garmin Connect<br/></Button>
									</a>
								}
								{!this.state.have_fitbit_token && !isMissingOneGarminLink &&
									<a href='/fitbit/request_token_fitbit' 
										className = "garminlink">
										<Button color="primary" style = {{fontSize:"13px"}}>Fitbit<br/></Button>
									</a>
								}
							</div>
				          </ModalBody>
				          <ModalFooter>
				            	<Button color="primary" onClick={this.toggle} style = {{fontSize:"13px"}}>OK</Button>
				          </ModalFooter>
			        </Modal>
        return modal;
	}

	componentDidMount(){
		haveDeviceToken(this.successToken,this.errorToken);
	}

	render(){
		return (
			
			       
  
			   	<div className = "container">
      			<NavbarMenu fix={true}/>
				<div>
					  <div className="row">
						<div className="col-sm-6 col-sm-offset-3 social-login" style={{marginTop:"80px"}}>
						    <h3 id="link_style">User Inputs</h3>
						    <div className="social-login-buttons">



							 <Link to='/userinputs'>User Inputs Daily Form</Link><br/>
							 <h3 id="link_style">Leaderboards</h3>
							  <Link to='/movement_leaderboard'>Movement Leaderboard</Link><br/>
							  <Link to='/overall_hrr_rank'>HRR Leaderboard</Link><br/>		  
							 <h3 id="link_style">Dashboards</h3>
						      <Link to='/aadashboard'>AA dashboard</Link><br /> 
				  		 	  <Link to='/movement_dashboard'>Movement Dashboard</Link><br/>
				  		 	  <Link to='/grades_dashboard'>Grades Dashboard</Link><br/>
				  		 	  <Link to = '/progressanalyzer_dashboard'>Progress Analyzer Dashboard</Link><br/>
				  		 	  <Link to='/mcs_dashboard'>Movement Consistency Score (MCS) Dashboard</Link><br />
				  		 	  <Link to='/weekly_workout_summary'>Weekly Workout Summary Report</Link><br/>
				  		 	  <Link to='/active_dahsboard'>Time Moving / Active Dashboard</Link><br/>
							 {/*<Link to='/activity_type'>Activities</Link><br/>*/}
							 {/*<Link to='/nes'>NES Graph</Link><br/>*/}
							  {/*<Link to='/sleep'>Sleeping Graph</Link><br/>*/}
							  {/*<Link to='/overallgrade'>Over All Grade</Link><br/>*/}
							  {/*<Link to='/weeklygrade'>Weekly Grade</Link><br/>*/}
							  {/*<Link to='/breakdown'>Break Down Grade</Link><br/>*/}
							  {/*<Link to='/weeklysummary'>Weekly Summary</Link><br/>*/}
							  <h3 id="link_style">Heart Rate Recovery (HRR)</h3>
							  <Link to='/hrr_summary_dashboard'>HRR Dashboard</Link><br/>
							  <Link to='/hrr_recovery'>HRR Daily Summary Details</Link><br/>

							  <h3 id="link_style">Reporting</h3>
							  <Link to='/progressanalyzer'>Progress Analyzer</Link><br/>
							  <Link to='/leaderboard'>My Rankings</Link><br/>
							   <Link to='/heartrate'>Heartrate Aerobic/Anaerobic Ranges</Link><br/>
							   <Link to='/heartrate_zone'>Time in Heart-Rate Zones Chart</Link><br/>
								{/*<Link to='/workout_stats'>Heartrate Workout</Link><br/>*/}
							  
							  <h3 id="link_style">Raw Data</h3>		  
							  <Link to='/rawdata'>Raw Data</Link><br/>
							  <Link to='/rawdata?rtype=mc'>Movement Consistency</Link><br/>
							  <Link to='/rawdata#grades'>Grades</Link><br/>
							  <a target="_blank" href = "/static/quicklook/grades_key.pdf">Grades Key</a><br/>
							  {/*<Link to='/movement_consistency'>movement Consistency</Link><br/>*/}
							{(!this.state.have_garmin_connect_token 
								&& !this.state.have_garmin_health_token)
								&& <div>
									  <h3 id="link_style">Set up Links to Garmin</h3>
									  <a href='/users/request_token'>Garmin Health Connect</a><br/>
									  <a href='/users/connect_request_token'>Garmin Connect</a><br/>
							  	   </div>
							}
							{(this.state.have_garmin_connect_token 
								&& !this.state.have_garmin_health_token)
								&& <div>
									  <h3 id="link_style">Set up Links to Garmin</h3>
									  <a href='/users/request_token'>Garmin Health Connect</a><br/>
							  	   </div>
							}
							{(!this.state.have_garmin_connect_token 
								&& this.state.have_garmin_health_token)
								&&<div>
									  <h3 id="link_style">Set up Links to Garmin</h3>
									  <a href='/users/connect_request_token'>Garmin Connect</a><br/>
							  	  </div>
							}

							{!this.state.have_fitbit_token &&
							  <div>
							  <h3 id="link_style">Set up Link to Fitbit</h3>
							  <a href='/fitbit/request_token_fitbit'>Connect to Fitbit</a><br/>
							  </div>
							}
							  {/*<h3 id="link_style">Other</h3>
							  <Link to='/raw/garmin'>Garmin Pull Down</Link><br/>
							  <Link to='/raw/fitbit'>Fitbit Pull Down</Link><br/>*/}

							<h3 id="link_style">Data Backfill Request</h3>
							<Link to='/backfill'>Historical Data Backfill Request</Link><br/>
                          


						  </div>
						</div>
					</div>
				</div>
				{this.noDeviceLinkedModel()}

				
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