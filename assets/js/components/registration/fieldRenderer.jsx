import React from 'react';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container} from 'reactstrap';

export function renderFieldFormGroup(field){
	const { meta: {touched, error} } = field;
	const className = `${ touched && error ? 'has-danger' : '' }`;
	const label = field.label != "" ? <Label>{field.label}</Label> : ""
	return(
		<FormGroup className={className}>
			{label}
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

function createDropdown(start_num , end_num, step=1){
	let elements = [];
	let i = start_num;
	while(i<=end_num){
		elements.push(<option key={i} value={i}>{i}</option>);
		i=i+step;
	}
	return elements;
}

export function renderSelectFeet(field){
	const { meta: {touched, error} } = field;
	return(
			<Input 
				type={field.type} 
				name={field.name} 
				{...field.input}>
				<option>Feet</option> 
				{createDropdown(1,9)}
			</Input>
	);
}

export function renderSelectInches(field){
	const { meta: {touched, error} } = field;
	return(
			<Input 
				type={field.type} 
				name={field.name} 
				{...field.input}>
				<option>Inches</option> 
				{createDropdown(1,12)}
			</Input>
	);
}