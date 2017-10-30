import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className,Collapse} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
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

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.food_ate_before_workout !== this.props.food_ate_before_workout) {

    	  	this.setState({
    	  		food_ate_before_workout:nextProps.food_ate_before_workout
    	  	});
    	}
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
                            <Label>1.9.1 What Food Did You Eat Before Your Workout?</Label>
                            	{this.props.editable &&
	                            	<div className="input1">
			                            <Textarea 				                           
				                            className=" form-control" 
				                            placeholder="dairy, cheese, pasta, bread, white rice etc..."
				                            rows={5} cols={5}
				                            value={this.state.food_ate_before_workout}
				                            onChange={this.handleChange}
				                             /> 
				                    </div>
				                 }
				                 {
		                              !this.props.editable &&
		                              <div className="input">
		                                <p>{this.state.food_ate_before_workout}</p>
		                              </div>
		                         }        	
                          </FormGroup> 
					</Collapse>		
				
			</div>
		);
	}
}