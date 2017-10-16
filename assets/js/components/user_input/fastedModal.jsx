import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className,Collapse} from 'reactstrap';

export default class FastedModal extends Component{

	constructor(props){
		super(props);
		const food_ate_before_workout = this.props.food_ate_before_workout;
		this.state = {
			food_ate_before_workout:food_ate_before_workout,
			collapse: true,	
		};
		
		this.handleChange = this.handleChange.bind(this);
		

	}

	handleChange(event){
		const value = event.target.value;
	    this.setState({
	    	food_ate_before_workout: value,
	    },()=>{
	    	this.props.updateState(this.state.food_ate_before_workout);
	    });
	}


	render(){
		return(
			<div>
			
					<Collapse isOpen={this.state.collapse}>			
						<FormGroup>   
                            <Label>9.1) What Food Eaten Before Workout?</Label>
                            <Input 
	                            type="textarea" 
	                            className="custom-select form-control" 
	                            value={this.state.food_ate_before_workout}
	                            onChange={this.handleChange}
	                            placeholder="Apple, riceballs..." /> 
                          </FormGroup> 
					</Collapse>		
				
			</div>
		);
	}
}