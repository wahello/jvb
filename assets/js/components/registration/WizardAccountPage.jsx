import React from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container} from 'reactstrap';

import renderField from './fieldRenderer';
import { account_validate } from './validation';

const WizardAccountPage = (props) => {
	const { handleSubmit, onSubmit } = props;
	
	return(
		<Form onSubmit={handleSubmit(onSubmit)} >
			<Row>
				<Col className="form-item">
					<FormGroup>
						<Label>Username</Label>
						<Field
							name = "username"
							type = "text"
							label = "Username"
							placeholder = "john"
							component = {renderField}
						/>
					</FormGroup>

					<FormGroup>
						<Label>Email</Label>
						<Field
							name = "email"
							type = "email"
							label = "Email"
							placeholder = "example@address.com"
							component = {renderField}
						/>
					</FormGroup>

					<FormGroup>
						<Label>Password</Label>
						<Field
							name = "password"
							type = "password"
							label = "Password"
							placeholder = ""
							component = {renderField}
						/>
					</FormGroup>

					<FormGroup>
						<Label>Repeat Password</Label>
						<Field
							name = "re_password"
							type = "password"
							label = "re_password"
							placeholder = ""
							component = {renderField}
						/>
					</FormGroup>

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
