import React from 'react';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container} from 'reactstrap';

function renderField(field){
	const { meta: {touched, error} } = field;
	const className = `${ touched && error ? 'has-danger' : '' }`;
	return(
		<FormGroup className={className}>
			<Label className="sr-only">{field.label}</Label>
			<Input 
				type={field.type} 
				name={field.name} 
				placeholder={field.placeholder} 
				value={field.value}
				{...field.input}
			/>
			<div className="form-control-feedback">
				{touched ? error : ''}
			</div>
		</FormGroup>
	);
}

export default renderField;