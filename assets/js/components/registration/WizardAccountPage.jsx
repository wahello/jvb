import React from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container} from 'reactstrap';

import {renderFieldFormGroup} from './fieldRenderer';
import { account_validate } from './validation';

const WizardAccountPage = (props) => {
	const { handleSubmit, onSubmit, value  } = props;

	
	
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

					<Field
						name = "password"
						type = "password"
						label = "Password"
						placeholder = ""
						value =""
						component = {renderFieldFormGroup}
						
					/>
					<div></div>

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

export default reduxForm({
	form: 'register',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate: account_validate
})(
	connect(null,{})(WizardAccountPage)
);
