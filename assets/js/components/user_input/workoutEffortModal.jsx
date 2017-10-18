import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className,Collapse} from 'reactstrap';

export default class WorkoutEffortModal extends Component{

	constructor(props){
		super(props);
		const effort = this.props.workout_effort_hard_portion;
		const is_workout_hard = effort !== '' ? 'yes' : 'no';
		this.state = {
			is_workout_hard:is_workout_hard,
			workout_effort_hard_portion:effort
		};
		this.handleRadioChange = this.handleRadioChange.bind(this);
		this.handleChangeHardWorkoutEffort = this.handleChangeHardWorkoutEffort.bind(this);

	}

	handleChangeHardWorkoutEffort(event){
		const value = event.target.value;
		this.setState({
			workout_effort_hard_portion:value
		},()=>{
			this.props.updateState(this.state.workout_effort_hard_portion);
		});
	}

	handleRadioChange(event){
		const value=event.target.value;
	    this.setState({
	    	is_workout_hard: value
	    });
	}

	render(){
		return(
			<div>
					
				<Label>4.1 Was Any Portion Of Your Workout Hard?</Label>
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
						<Label className="padding">4.2 What Was Your Average Effort Level For The Hard Part Of Your Workout?</Label>
						<div className="input1">
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
	                        </Input>
                        </div>
					</FormGroup>
				</Collapse>
			</div>
		);
	}
}