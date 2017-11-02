import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container} from 'reactstrap';

import { goals_validate } from './validation';
import {renderFieldFormGroup} from './fieldRenderer';

const WizardGoalsPage = (props) => {
	const { handleSubmit, previousPage, onSubmit } = props;
	return(
		<Form onSubmit={handleSubmit(onSubmit)} >
			<Row>
				<Col className="form-item">

					<div>
						<h3>Tell us your goals</h3>
						<Label className="custom-control custom-checkbox">
							  <Field 
								  	className="custom-control-input"
								  	name="goals"
								  	type="checkbox"
								  	value="Maintain overall health"
								  	required
								  	component="input" 
							   />
							  <span className="custom-control-indicator"></span>
							  <span className="custom-control-description">Maintain Overall health</span>
						</Label>
					</div><br />

					<Field
						name = "sleep_goal"
						type = "number"
						label = "Daily Sleep Goals (in hours)"
						placeholder = "7"
						value=""
						component = {renderFieldFormGroup}
					/>

					<div className="f-footer">
						<Button outline color="primary" onClick={previousPage}>
							Previous
						</Button>
						<Button type="submit" outline color="primary" style={{float:'right'}}>
							Submit
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
	forceUnregisterOnMount: true,
	validate: goals_validate
})(
	connect(null,{})(WizardGoalsPage)
);