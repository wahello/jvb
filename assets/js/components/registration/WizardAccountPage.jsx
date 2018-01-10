import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container} from 'reactstrap';

import {renderFieldFormGroup} from './fieldRenderer';
import { account_validate } from './validation';




class WizardAccountPage extends Component{
	

constructor(props){
		super(props);
		 this.state = {
		 	 
		 	  type: 'password'
     
    };



 this.showHide = this.showHide.bind(this);
    this.passwordStrength = this.passwordStrength.bind(this); 

	}



 showHide(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'password' ? 'input' : 'password'
    })  
  }
  
  passwordStrength(e){
    if(e.target.value === ''){
      this.setState({
        score: 'null'
      })
    }
    else{
      var pw = XYZ(e.target.value);
      this.setState({
        score: pw.score
      });      
    }

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



                     <Col xs="12" sm="9">
                    <Field 
                    	style={{borderRadius:"0px"}}

						name = "password"
						 type={this.state.type}
						label="Password"
						placeholder = " "
						onChange={this.passwordStrength}
						component = {renderFieldFormGroup}
					/>

            </Col>
              <Col xs="12" sm="3" style={{marginTop:'10%',marginLeft:"-78px"}}>
                       <Button onClick={this.showHide} style={{padding:"12px 15px",borderRadius:"0px"}}>
								{this.state.type === 'input' ? <span ><i  className="fa fa-eye-slash" aria-hidden="true"></i></span> : <i className="fa fa-eye" aria-hidden="true"></i>}
							</Button>


 </Col>
                    
			</Row>		</FormGroup>
					<Field
						name = "re_password"
						type = "password"
						label = "Re-Password"
						placeholder = ""
						component = {renderFieldFormGroup}
					/>

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
