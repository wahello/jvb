// http://azmind.com/demo/bootzard-bootstrap-wizard-template/

import React, { Component } from 'react';
import { Container, Row, Col, Card,CardTitle, 
		 CardHeader, CardBlock, CardText, Progress } from 'reactstrap';
import RegisterNetwork from '../../network/register';

import WizardAccountPage from './WizardAccountPage';
import WizardPersonalPage from './WizardPersonalPage';
import WizardGoalsPage from './WizardGoalsPage';
console.log("test");
class Register extends Component {

	constructor(props){
		super(props);
		this.nextPage = this.nextPage.bind(this);
		this.previousPage = this.previousPage.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onRegisterSuccess = this.onRegisterSuccess.bind(this);
		this.state = {
			page: 1,
			progress:20
		};
	}

	onRegisterSuccess(response){
		this.setState({
			progress: this.state.progress + 33.33
		});

		//redirect to user newly created profile
		alert("Acount created Successfully!");
	}

	onRegisterFailure(error){
		console.log('Error: ',error);
	}

	onSubmit(values){
		console.log(values);
		var reg = new RegisterNetwork();
		reg.register(values,this.onRegisterSuccess,this.onRegisterFailure);
	}

	nextPage() {
		this.setState({
			page: this.state.page + 1,
			progress: this.state.progress + 33.33
		});
	}

	previousPage(){
		this.setState({
			page: this.state.page - 1,
			progress: this.state.progress - 33.33
		});
	}

	render(){
		const { page } = this.state;
		const class_account = `f-cp-icon ${page === 1 ? 'active':''}`;
		const class_personal = `f-cp-icon ${page === 2 ? 'active':''}`;
		const class_goals = `f-cp-icon ${page === 3 ? 'active':''}`;

		return(
			<div className="form-container">
				<Container className="h-100" id="reg-form">
					<Row className="justify-content-center align-items-center h-100">
						<Col md="6" className="h-100">
							<Card className="form-card">
								<CardHeader className="text-center">
									<h3>REGISTER TO OUR APP</h3>
									<p>Fill in the form to get instant access</p>
									<div className="f-progress">
										<Progress 
											className="f-progress-bar" 
											value={this.state.progress}
										/>
										<div className="f-cp">
											<div className={class_account}>
												<i className="fa fa-key" aria-hidden="true"></i>
											</div>
											<p>Account</p>
										</div>
										<div className="f-cp">
											<div className={class_personal}>
												<i className="fa fa-user" aria-hidden="true"></i>
											</div>
											<p>Personal</p>
										</div>
										<div className="f-cp">
											<div className={class_goals}>
												<i className="fa fa-check-circle" aria-hidden="true"></i>
											</div>
											<p>Goals</p>
										</div>
									</div>
								</CardHeader>
								<CardBlock>
									{page === 1 && <WizardAccountPage onSubmit = {this.nextPage} />}
									{page === 2 &&
									 <WizardPersonalPage 
											onSubmit = {this.nextPage}
											previousPage = {this.previousPage}
									 />}
									 {page === 3 &&
									 <WizardGoalsPage 
											onSubmit = {this.onSubmit}
											previousPage = {this.previousPage}
									 />}
								</CardBlock>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Register;