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
				name={field.input.name} 
				placeholder={field.placeholder} 
				value={field.value}
				required
				{...field.input}
			/>
			<div style={{color:"red"}}className="form-control-feedback">
				{touched ? error : ''}
			</div>
		</FormGroup>
	);
}

function createDropdown(start_num , end_num, mins=false, step=1){
	let elements = [];
	let i = start_num;
	while(i<=end_num){
		let j = (mins && i < 10) ? "0"+i : i;
		elements.push(<option key={j} value={j}>{j}</option>);
		i=i+step;
	}
	return elements;
}

export function renderSelectFeet(field){
	const { meta: {touched, error} } = field;
	const className = `form-group ${ touched && error ? 'has-danger' : '' }`;
	return(
			<Input 
				type={field.type} 
				name={field.input.name} 
				required
				{...field.input}>
				<option value="Feet">Feet</option> 
				{createDropdown(1,9)}
				{touched ? field.err_callback(error) : field.err_callback('')}
			</Input>
	);
}

export function renderSelectInches(field){
	const { meta: {touched, error} } = field;
	const className = `form-group ${ touched && error ? 'has-danger' : '' }`;
	return(
			<Input 
				type={field.type} 
				name={field.input.name}
				required 
				{...field.input}>
				<option value="Inches">Inches</option> 
				{createDropdown(0,12)}
				{touched ? field.err_callback(error) : field.err_callback('')}
			</Input>
	);
}

export function renderSelectPounds(field){
	const { meta: {touched, error} } = field;
	const className = `form-group ${ touched && error ? 'has-danger' : '' }`;
	return(
			<Input 
				type={field.type} 
				name={field.input.name}
				required 
				{...field.input}>
				<option value="Weight">Weight</option> 
				{createDropdown(40,500)}
				{touched ? field.err_callback(error) : field.err_callback('')}
			</Input>
	);
}
export function renderSelectHours(field){
	const { meta: {touched, error} } = field;
	const className = `form-group ${ touched && error ? 'has-danger' : '' }`;
	return(
			<Input 
				type={field.type} 
				name={field.input.name}
				required 
				{...field.input}>
				<option value="Hours">Hours</option> 
				{createDropdown(0,24)}
				{touched ? field.err_callback(error) : field.err_callback('')}
			</Input>
	);
}
export function renderSelectMinutes(field){
	const { meta: {touched, error} } = field;
	const className = `form-group ${ touched && error ? 'has-danger' : '' }`;
	return(
			<Input 
				type={field.type} 
				name={field.input.name}
				required 
				{...field.input}>
				<option value="Minutes">Minutes</option> 
				{createDropdown(0,59,true)}
				{touched ? field.err_callback(error) : field.err_callback('')}
			</Input>
	);
}

export function renderSelectMonth(field){
	const { meta: {touched, error} } = field;
	const className = `form-group ${ touched && error ? 'has-danger' : '' }`;
	return(
			<Input 
				type={field.type} 
				name={field.input.name} 
				required
				{...field.input}>
				<option value="Month">Month</option> 
				{createDropdown(1,12)}
				{touched ? field.err_callback(error) : field.err_callback('')}
				{field.onDOBChange()}
			</Input>
	);
}
export function renderSelectDate(field){
	const { meta: {touched, error} } = field;
	const className = `form-group ${ touched && error ? 'has-danger' : '' }`;
	return(
			<Input 
				type={field.type} 
				name={field.input.name} 
				required
				{...field.input}>
				<option value="Date">Date</option> 
				{createDropdown(1,31)}
				{touched ? field.err_callback(error) : field.err_callback('')}
				{field.onDOBChange()}
			</Input>
	);
}
export function renderSelectYear(field){
	const yearEnd = new Date().getFullYear()
	const { meta: {touched, error} } = field;
	const className = `form-group ${ touched && error ? 'has-danger' : '' }`;
	return(
			<Input 
				type={field.type} 
				name={field.input.name} 
				required
				{...field.input}>
				<option value="Year">Year</option> 
				{createDropdown(1930,yearEnd)}
				{touched ? field.err_callback(error) : field.err_callback('')}
				{field.onDOBChange()}
			</Input>
	);
}

export function renderSelectAge(field){
	const { meta: {touched, error} } = field;
	const className = `form-group ${ touched && error ? 'has-danger' : '' }`;
	const label = field.label != "" ? <Label>{field.label}</Label> : ""
	return(
			<FormGroup>
				{label}
				<Input 
					type={field.type} 
					name={field.input.name}
					required 
					{...field.input}
				>
					<option value="select_age">Select Age</option> 
					{createDropdown(13,120)}
				</Input>
				<div style={{color:"red"}}className="form-control-feedback">
					{touched ? error : ''}
				</div>
			</FormGroup>
	);
}