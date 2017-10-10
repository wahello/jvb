import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class WorkoutEffortModal extends Component{

	constructor(props){
		super(props);
		const effort = this.props.workout_effort_hard_portion;
		const is_workout_hard = effort !== '' ? 'yes' : 'no';
		this.state = {
			modal:true,
			is_workout_hard:is_workout_hard,
			workout_effort_hard_portion:effort
		};
		this.modalToggle = this.modalToggle.bind(this);
		this.handleRadioChange = this.handleRadioChange.bind(this);
		this.handleChangeHardWorkoutEffort = this.handleChangeHardWorkoutEffort.bind(this);
		this.onModalSubmit = this.onModalSubmit.bind(this);

	}

	handleChangeHardWorkoutEffort(event){
		const value = event.target.value;
		this.setState({
			workout_effort_hard_portion:value
		});
	}

	handleRadioChange(event){
		const value=event.target.value;
	    this.setState({
	    	is_workout_hard: value
	    });
	}

	modalToggle(){
		this.setState({
			modal:!this.state.modal
		});
	}

	onModalSubmit(){
		this.props.updateState(this.state.workout_effort_hard_portion);
		this.modalToggle();
	}

	render(){
		return(
			<div>
				<Modal isOpen={this.state.modal} toggle={this.modalToggle}>
					<ModalBody>
						<h5>Hi, if any portion of workout was hard?</h5>
						<FormGroup check>
							<Label check>
								<Input type="radio" name="is_workout_hard"
									value="yes"
								 	checked={this.state.is_workout_hard === 'yes'}
								 	onChange={this.handleRadioChange}/>{' '}
								Yes
							</Label>
							{' '}
							<Label check>
								<Input type="radio" name="is_workout_hard" 
									value="no"
									checked={this.state.is_workout_hard === 'no'}
									onChange={this.handleRadioChange}/>{' '}
								No
							</Label>
						</FormGroup>

						<Collapse isOpen={this.state.is_workout_hard === 'yes'}>
							<FormGroup>
								<Label>Hard workout effort level</Label>
								<Input 
	                            type="select" 
	                            className="form-control custom-select" 
	                            value={this.state.workout_effort_hard_portion}
	                            onChange={this.handleChangeHardWorkoutEffort} >
	                                  <option value="select">select</option>
	                                  <option value="1">1</option>
	                                  <option value="2">2</option>
	                                  <option value="3">3</option>
	                                  <option value="4">4</option>
	                                  <option value="5">5</option>
	                                  <option value="6">6</option>
	                                  <option value="7">7</option>
	                                  <option value="8">8</option>
	                                  <option value="9">9</option>
	                                  <option value="10">10</option>
	                                  <option value="no workout today">No workout today</option>
	                            </Input>
							</FormGroup>
						</Collapse>

					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={this.onModalSubmit}>Save</Button>{' '}
						<Button color="danger" onClick={this.modalToggle}>Cancel</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}