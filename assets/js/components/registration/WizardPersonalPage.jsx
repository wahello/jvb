import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container,InputGroup} from 'reactstrap';

import {renderFieldFormGroup,renderSelectFeet, renderSelectInches} from './fieldRenderer';
import { personal_validate } from './validation';

const WizardPersonalPage = (props) => {
	const { handleSubmit, previousPage, onSubmit } = props;
	return(
		<Form  onSubmit={handleSubmit(onSubmit)}>
			<Row>
				<Col className="form-item">

					<Field
						name = "first_name"
						type = "input"
						label = "First Name"
						placeholder = "John"
						value=""
						component = {renderFieldFormGroup}
					/>

					<Field
						name = "last_name"
						type = "input"
						label = "Last Name"
						placeholder = "Doe"
						value=""
						component = {renderFieldFormGroup}
					/>

					<Field
						name = "date_of_birth"
						type = "date"
						label = "Date of Birth"
						placeholder = "dd/mm/yyyy"
						value=""
						component = {renderFieldFormGroup}
					/>

					<FormGroup>
						<Label>Height</Label>
						<InputGroup>
							<Field
								name = "feet"
								type = "select"
								component = {renderSelectFeet}	
							/>
							&nbsp;&nbsp;
							<Field
								name = "inches"
								type = "select"
								component = {renderSelectInches}	
							/>
						</InputGroup>
					</FormGroup>

					<Field
						name = "weight"
						type = "number"
						label = " Weight (in pounds)"
						placeholder = "150"
						value=""
						component = {renderFieldFormGroup}
					/>

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