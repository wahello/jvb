import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { Link,withRouter } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NavbarMenu from '../navbar';
import haveGarminToken from "../../network/dashboard";
class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			 modal: false,
			"have_garmin_connect_token":"",
    		"have_garmin_health_token":""
		};
		this.noGarminTokenModel = this.noGarminTokenModel.bind(this);
		this.successToken = this.successToken.bind(this);
		this.errorToken = this.errorToken.bind(this);
		this.garminHealthModel = this.garminHealthModel.bind(this);
		this.garminConnectModel = this.garminConnectModel.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	successToken(data){
		this.setState({
			modal:true,
			have_garmin_connect_token:data.data.have_garmin_connect_token,
			have_garmin_health_token:data.data.have_garmin_health_token,
		});
	}

	toggle() {
	    this.setState({
	      modal: !this.state.modal
	    });
  	}

  	/* If we don't have two garmin tokents and even single tokent below model functions will be work*/
	noGarminTokenModel(){
			let modal =  <Modal isOpen={this.state.modal} toggle = {this.toggle} className={this.props.className}>
					          <ModalHeader>Connect Garmin Accounts</ModalHeader>
					          <ModalBody>
					            	We noticed that you have not linked your Garmin Health account and Garmin Connect account to us yet.
					            	Click the links below to link your account so we can provide you with lots of cool reporting, grades from your data and analysis from your workouts!
					          </ModalBody>
					          <ModalFooter>
					          	    <a href='/users/request_token' className = "garminlink"><Button color="primary" style = {{fontSize:"13px"}}>Link Garmin Health Data<br/></Button></a>
									<a href='/users/connect_request_token' className = "garminlink"><Button color="primary" style = {{fontSize:"13px"}}> Link Garmin Connect Data<br/></Button></a>
					            	<Button color="primary" onClick={this.toggle} style = {{fontSize:"13px"}}>Ok</Button>
					          </ModalFooter>
				        </Modal>
	        return modal;
	}

	garminHealthModel(){
		let modal =  <Modal isOpen={this.state.modal} toggle = {this.toggle} className={this.props.className}>
				          <ModalHeader>Garmin Health Connect</ModalHeader>
				          <ModalBody>
				            	We noticed that you have not linked your Garmin Health account to us yet.
				            	Click the link below to link your account so we can provide you with lots of cool reporting and grades from your data!
				          </ModalBody>
				          <ModalFooter>
				          		<a href='/users/request_token' className = "garminlink"><Button color="primary"style = {{fontSize:"13px"}} >Link Garmin Health Data<br/></Button></a>
				            	<Button color="primary" onClick={this.toggle} style = {{fontSize:"13px"}}>Ok</Button>
				          </ModalFooter>
			        </Modal>
        return modal;
	}

	garminConnectModel(){
		let modal =  <Modal isOpen={this.state.modal} toggle = {this.toggle} className={this.props.className}>
				          <ModalHeader>Garmin Connect</ModalHeader>
				          <ModalBody>
				          We noticed that you have not linked your Garmin Connect account to us yet.  
				          Click the link below to link your account so we can provide you with lots of cool data and analysis from your workouts!
				          </ModalBody>
				          <ModalFooter>
				          		<a href='/users/connect_request_token' className = "garminlink"><Button color="primary" style = {{fontSize:"13px"}}> Link Garmin Connect Data<br/></Button></a>
				            	<Button color="primary" onClick={this.toggle} style = {{fontSize:"13px"}}>Ok</Button>
				          </ModalFooter>
			        </Modal>
        return modal;
	}

	errorToken(error){
		console.log(error.message);
	}

	componentDidMount(){
		haveGarminToken(this.successToken,this.errorToken);
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
							 {/*<Link to='/activity_type'>Activities</Link><br/>*/}
							 {/*<Link to='/nes'>NES Graph</Link><br/>*/}
							  {/*<Link to='/sleep'>Sleeping Graph</Link><br/>*/}
							  {/*<Link to='/overallgrade'>Over All Grade</Link><br/>*/}
							  {/*<Link to='/weeklygrade'>Weekly Grade</Link><br/>*/}
							  {/*<Link to='/breakdown'>Break Down Grade</Link><br/>*/}
							  {/*<Link to='/weeklysummary'>Weekly Summary</Link><br/>*/}
							  <h3 id="link_style">Reporting</h3>
							  <Link to='/progressanalyzer'>Progress Analyzer</Link><br/>
							  <Link to='/leaderboard'>My Rankings</Link><br/>
							   <Link to='/heartrate'>Heartrate Aerobic/Anaerobic Ranges</Link><br/>
							   <Link to='/hrr_recovery'>Heartrate Recovery</Link><br/>
							   <Link to='/heartrate_zone'>Time in Heart -Rate Zones Chart</Link><br/>
							   {/*<Link to='/workout_stats'>Heartrate Workout</Link><br/>*/}
							   
							  <h3 id="link_style">Raw Data</h3>		  
							  <Link to='/rawdata'>Raw Data</Link><br/>
							  <Link to='/rawdata#movementconsistency'>Movement Consistency</Link><br/>
							  <Link to='/rawdata#grades'>Grades</Link><br/>
							  <a target="_blank" href = "/static/quicklook/grades_key.pdf">Grades Key</a><br/>
							  {/*<Link to='/movement_consistency'>movement Consistency</Link><br/>*/}
							{(this.state.have_garmin_connect_token == false && this.state.have_garmin_health_token == false) &&
							  <div>
								  <h3 id="link_style">Set up Links to Garmin</h3>
								  <a href='/users/request_token'>Garmin Health Connect</a><br/>
								  <a href='/users/connect_request_token'>Garmin Connect</a><br/>
								  {this.noGarminTokenModel()}
							  </div>
							}
							{(this.state.have_garmin_connect_token == true && this.state.have_garmin_health_token == false) &&
							  <div>
								  <h3 id="link_style">Set up Links to Garmin</h3>
								  <a href='/users/request_token'>Garmin Health Connect</a><br/>
								  {this.garminHealthModel()}
							  </div>
							}
							{(this.state.have_garmin_connect_token == false && this.state.have_garmin_health_token == true) &&
							  <div>
								  <h3 id="link_style">Set up Links to Garmin</h3>
								  <a href='/users/connect_request_token'>Garmin Connect</a><br/>
								  {this.garminConnectModel()}
							  </div>
							}
							  <h3 id="link_style">Set up Link to Fitbit</h3>
							  <a href='/fitbit/request_token_fitbit'>Connect to Fitbit</a><br/>
							  <h3 id="link_style">Other</h3>
							  <Link to='/raw/garmin'>Garmin Pull Down</Link><br/>
							  <Link to='/raw/fitbit'>Fitbit Pull Down</Link><br/>							 
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