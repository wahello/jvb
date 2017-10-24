import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container} from 'reactstrap';

import renderField from './fieldRenderer';
import { personal_validate } from './validation';

const WizardPersonalPage = (props) => {
	const { handleSubmit, previousPage, onSubmit } = props;
	return(
		<Form  onSubmit={handleSubmit(onSubmit)}>
			<Row>
				<Col className="form-item">

					<FormGroup>
						<Label>First Name</Label>
						<Field
							name = "first_name"
							type = "input"
							label = "First Name"
							placeholder = "John"
							value=""
							component = {renderField}
						/>
					</FormGroup>

					<FormGroup>
						<Label>Last Name </Label>
						<Field
							name = "last_name"
							type = "input"
							label = "Last Name"
							placeholder = "Doe"
							value=""
							component = {renderField}
						/>
					</FormGroup>

					<FormGroup>
						<Label> Date of Birth </Label>
						<Field
							name = "date_of_birth"
							type = "date"
							label = "Birthday"
							placeholder = "dd/mm/yyyy"
							value=""
							component = {renderField}
						/>
					</FormGroup>

					<FormGroup>
						<Label>Height</Label>
						<Field
							name = "height"
							type = "input"
							label = "Height"
							placeholder = "5'11"
							value=""
							component = {renderField}
						/>
					</FormGroup>

					<FormGroup>
						<Label> Weight (in pounds)</Label>
						<Field
							name = "weight"
							type = "number"
							label = "Weight"
							placeholder = "150"
							value=""
							component = {renderField}
						/>
					</FormGroup>


					 <FormGroup>
				          <Label className="custom-control custom-radio">
				            	<Field 
				            		className="custom-control-input"
				            		name="gender" 
				            		component="input" 
				            		type="radio" 
				            		value="M" 
				            	/>
				            	<span className="custom-control-indicator"></span>
				            	<span className="custom-control-description">Male</span>
				          </Label>
				          <Label className="custom-control custom-radio">
				            	<Field 
				            		className="custom-control-input"
				            		name="gender" 
				            		component="input" 
				            		type="radio" 
				            		value="F" 
				            	/>
				            	<span className="custom-control-indicator"></span>
				            	<span className="custom-control-description">Female</span>
				          </Label>
			        </FormGroup>
			        <div className="f-footer">
						<Button outline color="primary" onClick={previousPage}>
							Previous
						</Button>
						<Button type="submit" outline color="primary" style={{float:'right'}}>
							Next
						</Button>
					</div>
				</Col>
			</Row>
		</Form>
	);
}

export default reduxForm({
	form: 'register',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate: personal_validate
})(
	connect(null,{})(WizardPersonalPage)
);