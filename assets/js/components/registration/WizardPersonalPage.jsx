import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {Field,change,formValueSelector,reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Modal, ModalHeader, ModalBody,ModalFooter, Container,InputGroup} from 'reactstrap';

import TermsAndConditions from './TermsAndConditions';
import {renderFieldFormGroup,
	renderSelectFeet,
	renderSelectInches,
	renderSelectPounds,
	renderSelectMonth,
	renderSelectDate,
	renderSelectYear,
	renderSelectAge} from './fieldRenderer';
import { personal_validate } from './validation';

const selector = formValueSelector('register')

class WizardPersonalPage extends Component{

	constructor(props){
		super(props);
		this.state = {
            'monthError':' ',
            'dateError':' ',
            'yearError':' ',
            modal: false,
			nestedModal: false,
		}
		this.monthError = this.monthError.bind(this);
		this.dateError = this.dateError.bind(this);
		this.yearError = this.yearError.bind(this);
		this.toggle = this.toggle.bind(this);
		this.toggleNested = this.toggleNested.bind(this);
		this.onDisagreeTerms =this.onDisagreeTerms.bind(this);
	}

	toggle() {
	    this.setState({
	      modal: !this.state.modal
	    });
	}
	toggleNested() {
		this.setState({
		  nestedModal: !this.state.nestedModal,
		  closeAll: false
		});
	}
	onDisagreeTerms(){
			this.props.history.push("/");
	}
	monthError(err_msg){
		this.setState({
			monthError:err_msg !== undefined ? err_msg : ' '
		});
	}

	dateError(err_msg){
		this.setState({
			dateError:err_msg !== undefined ? err_msg : ' '
		});
	}

	yearError(err_msg){
		this.setState({
			yearError:err_msg !== undefined ? err_msg : ' '
		});
	}

	onDOBChange = () => {
		// Calculate the age of the user and auto populate the 
		// age in question "How old are you today?"

		let day = this.props.day_dob;
		if(day === 'Date')
			day = null;
		let month = this.props.month_dob;
		if(month === 'Month')
			month = null;
		let year = this.props.year_dob;
		if(year === 'Year')
			year = null;
		
		if(day && month && year){
			let today = new Date();
		    let birthDate = new Date(year,month-1,day);
		    let age = today.getFullYear() - birthDate.getFullYear();
		    let m = today.getMonth() - birthDate.getMonth();
		    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		        age--;
		    }
			this.props.updateAge(age);
		}
	}



	render(){
		const { handleSubmit, previousPage, onSubmit,isRegistrationInProgress} = this.props;
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

						
						<FormGroup>
							<Label>Date of Birth</Label>
							<InputGroup>
								<Field
									name = "dob_year"
									type = "select"
									component = {renderSelectYear}	
									err_callback = {this.yearError}
									onDOBChange = {this.onDOBChange}
								/>
								&nbsp;
								
								<Field
									name = "dob_month"
									type = "select"
									component = {renderSelectMonth}
									err_callback = {this.monthError}
									onDOBChange = {this.onDOBChange}
								/>
								&nbsp;
								
								<Field
									name = "dob_day"
									type = "select"
									component = {renderSelectDate}	
									err_callback = {this.dateError}
									onDOBChange = {this.onDOBChange}
								/>
							</InputGroup>
							<div style={{color:"red"}}>
								{this.state.monthError+" "+this.state.dateError+" "+this.state.yearError}
							</div>

						</FormGroup>

						<Field
							name = "user_age"
							type = "select"
							label = "How old are you today?"
							component = {renderSelectAge}
						/>

						<FormGroup>
					          <Label className="custom-control custom-radio">
					            	<Field 
					            		className="custom-control-input custom-radio custom-control-indicator"
					            		name="gender" 
					            		component="input" 
					            		type="radio" 
					            		value="M"
					            	required 
					            	/>
					            	<span className="custom-control-indicator custom-radio custom-control-indicator"></span>
					            	<span className="custom-control-description">Male</span>
					          </Label>
					          <Label className="custom-control custom-radio">
					            	<Field 
					            		className="custom-control-input custom-radio custom-control-indicator"
					            		name="gender" 
					            		component="input" 
					            		type="radio" 
					            		value="F" 
					            	/>
					            	<span className="custom-control-indicator custom-radio custom-control-indicator"></span>
					            	<span className="custom-control-description">Female</span>
					          </Label>
				        </FormGroup>
				        <div className="f-footer">
							<Button outline color="primary" onClick={previousPage}>
								Previous
							</Button>
							<Button outline  color="primary" id="submit2" onClick={this.toggle} style={{float:'right'}} disabled={!this.props.valid}>
								Submit
							</Button>
						</div>
					</Col>
				</Row>
				<TermsAndConditions 
					isOpen = {this.state.modal}
					backdrop = {'static'}
					toggle = {this.toggle}
					nestedModelIsOpen = {this.state.nestedModal}
					nestedToggle = {this.toggleNested} 
					closeAll = {this.state.closeAll}
					onDisagreeTerms = {this.onDisagreeTerms}
					handleSubmit = {handleSubmit}
					onSubmit = {onSubmit}
					isRegistrationInProgress = {isRegistrationInProgress}
				/>
			</Form>
			
		);
	}
}

const mapStateToProps = state => {
	return {
		day_dob:selector(state,'dob_day'),
		month_dob:selector(state,'dob_month'),
		year_dob:selector(state,'dob_year')
	}
} 

const mapDispatchToProps = (dispatch) => {
	return {
		updateAge: (age) => dispatch(change('register','user_age',age))
	}
}

export default reduxForm({
	form: 'register',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate: personal_validate
})(
	connect(mapStateToProps,mapDispatchToProps)(withRouter(WizardPersonalPage))
);