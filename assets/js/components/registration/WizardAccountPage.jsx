import React from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container} from 'reactstrap';

import renderField from './fieldRenderer';
import { account_validate } from './validation';

import RegisterNetwork from '../../network/register';


const WizardAccountPage = (props) => {
	const { handleSubmit, onSubmit } = props;
	
	return(
		<Form onSubmit={handleSubmit(onSubmit)} >
			<Row>
				<Col className="form-item">
					<Field
						name = "username"
						type = "text"
						label = "Username"
						placeholder = "username"
						component = {renderField}
					/>
					<Field
						name = "email"
						type = "email"
						label = "Email"
						placeholder = "Email"
						component = {renderField}
					/>
					<Field
						name = "password"
						type = "password"
						label = "Password"
						placeholder = "Password"
						component = {renderField}
					/>
					<Field
						name = "re_password"
						type = "password"
						label = "re_password"
						placeholder = "Repeat password"
						component = {renderField}
					/>
					<div className="f-footer">
						<Button type="submit" outline color="primary">Next</Button>
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
	validate: account_validate
})(
	connect(null,{})(WizardAccountPage)
);
