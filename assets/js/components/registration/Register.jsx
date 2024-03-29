import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { Container, Row, Col, Card,CardTitle, 
		 CardHeader, CardBody, CardText, Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import RegisterNetwork,{CheckInvitation} from '../../network/register';
import NavbarMenu from '../navbar';
import WizardAccountPage from './WizardAccountPage';
import WizardPersonalPage from './WizardPersonalPage';
import UserNotInvited from './UserNotInvited';

import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem } from 'reactstrap';

class Register extends Component {

	constructor(props){
		super(props);
		this.nextPage = this.nextPage.bind(this);
		this.previousPage = this.previousPage.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onRegisterSuccess = this.onRegisterSuccess.bind(this);
		this.toggle = this.toggle.bind(this);
		this.state = {
			page:1,
			progress:20,
			isOpen: false,
			checkingInvitation:false,
			isUserInvited:false,
			isRegistrationInProgress:false
		};
	}

	toggle() {
	    this.setState({
	      isOpen: !this.state.isOpen
	    });
	}

	onRegisterSuccess(response){
		this.setState({
			progress: this.state.progress + 50,
			isRegistrationInProgress:false
		});

		//show success message and redirect to user newly created profile
		toast.info(
		"User Account created successfully!",{
          className:"dark"
        });
        this.props.history.push("/users/dashboard");
	}

	onRegisterFailure(error){
		this.setState({
			isRegistrationInProgress:false
		})
		console.log('Error: ',error);
	}

	onSubmit(values){
		this.setState({
			isRegistrationInProgress:true
		},() => {
			var reg = new RegisterNetwork();
			reg.register(values,this.onRegisterSuccess,this.onRegisterFailure);
		})
	}

	nextPage() {
		this.setState({
			page: this.state.page + 1,
			progress: this.state.progress + 50
		});
	}

	nextPageWithInvitationCheck = data => {
		if(data.is_invited){
			this.setState({
				isUserInvited:true,
				checkingInvitation:false,
			});
			this.nextPage()
		}else{
			this.setState({
				page:0
			})
		}
	}

	isUserInvited = (values) => {
		let email = values['email'];
		if(!this.state.isUserInvited){
			this.setState({
				checkingInvitation:true
			},()=>{
				CheckInvitation(email,this.nextPageWithInvitationCheck);
			})
		}else{
			this.nextPage()
		}
	}

	previousPage(){
		this.setState({
			page: this.state.page - 1,
			progress: this.state.progress - 50
		});
	}

	render(){
		const { page } = this.state;
		const class_account = `f-cp-icon ${page === 1 ? 'active':''}`;
		const class_personal = `f-cp-icon ${page === 2 ? 'active':''}`;

		let regForm = (
			<div className="form-container" id="form_margin">
				<Container className="h-100" id="reg-form">
					<Row className="justify-content-center align-items-center h-100">
						<Col md="6" className="h-100">
							<Card className="form-card">
								<CardHeader className="text-center">
									
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
									</div>
								</CardHeader>
								<CardBody>
									{page === 1 && 
										<WizardAccountPage
										checkingInvitation = {this.state.checkingInvitation} 
										onSubmit = {this.isUserInvited} 
									/>}
									{page === 2 &&
									 <WizardPersonalPage 
											onSubmit = {this.onSubmit}
											previousPage = {this.previousPage}
											isRegistrationInProgress = {this.state.isRegistrationInProgress}
									 />}
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>
				<ToastContainer 
					position="top-center"
					type="success"
					autoClose={5000}
					hideProgressBar={true}
					newestOnTop={false}
					closeOnClick
				/>
			</div>
		)

		if(this.state.page == 0){
			regForm = <UserNotInvited />
		}

		return(
			<div >
				<Navbar color="faded" light expand="md"  >
					<div className="navbar_div" > 
						<div className=" brand" >
							<img className="img-fluid"
								style={{maxWidth:"200px"}}
								src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"
							/>
						</div>
						<div className=" registration" >
							Registration
						</div>
						<div className=" home">
							<Link id="logout"className="nav-link color_home" to='/'>Home</Link>
						</div>
					</div>
				</Navbar>
				{regForm}
			</div>
		);
	}
}

export default withRouter(Register);