import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container} from 'reactstrap';

import {renderFieldFormGroup} from './fieldRenderer';
import { account_validate } from './validation';
import PasswordMask from 'react-password-mask';



class WizardAccountPage extends Component{
	

constructor(props){
		super(props);
		 this.state = {
		 	  password_type: 'password',
		 	  re_password_type: 'password'
    };
	 this.showHidePassword = this.showHidePassword.bind(this);
	 this.showHideRePassword = this.showHideRePassword.bind(this);
	}



 showHidePassword(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      password_type: this.state.password_type === 'password' ? 'input' : 'password'
    })  
  }
   showHideRePassword(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      re_password_type: this.state.re_password_type === 'password' ? 'input' : 'password'
    })  
  }
  
	render(){
	const { handleSubmit, onSubmit } = this.props;
	
	return(
		<Form onSubmit={handleSubmit(onSubmit)} >
			<Row>
				<Col className="form-item">

					<Field
						name = "username"
						type = "text"
						label = "Username"
						placeholder = "john"
						component = {renderFieldFormGroup}
					/>


					<Field
						name = "email"
						type = "email"
						label = "Email"
						placeholder = "example@address.com"
						component = {renderFieldFormGroup}
					/>


                    <FormGroup >

                 
                     <Row >
                     <Col xs="12" sm="12">
                    <Field 
                    	style={{borderRadius:"0px",position:"relative"}}

						name = "password"
						type={this.state.password_type}
						label="Password"
						placeholder = " "
						component = {renderFieldFormGroup}
					/>
                      <a onClick={this.showHidePassword} color="link" style={{ color:"#535559" , position:"absolute", top:"40px", right:"30px"}}>
								{this.state.password_type === 'input' ?
								 <span ><i  className="fa fa-eye-slash" aria-hidden="true"></i></span> :
								 <i className="fa fa-eye" aria-hidden="true"></i>}
							</a>  

                   </Col> 
			</Row>	
				</FormGroup>
				
					<div className="f-footer">
						<Button type="submit" outline color="primary">Next</Button>
					</div>
				</Col>
			</Row>
		</Form>
	);
	}
}

export default reduxForm({
	form: 'register',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate: account_validate
})(
	connect(null,{})(WizardAccountPage)
);
