import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Collapse} from 'reactstrap';

export default class DietType extends Component{

	constructor(props){
		super(props);
		const diet_type = this.props.diet_type;
		this.state = {
			diet_type:diet_type,
			collapse:diet_type !== '' ? true : false,	
		}

		this.handleChangeDiet = this.handleChangeDiet.bind(this);
		this.handleOnBlurDiet = this.handleOnBlurDiet.bind(this);
		
	}

	handleChangeDiet(event){
		const value = event.target.value;  
		this.setState({
			diet_type:value
		});
	}

	handleOnBlurDiet(event){
		this.props.updateState(this.state.diet_type);
	}

	render(){
		return(
			<div>
				<Collapse isOpen={this.state.collapse}>
				
							<FormGroup>
							    <Label>23.1 Hi, What Did You Take?</Label>
							    	<div className="input1">
										<Input 
			                            type="FormText" 
			                            className="form-control" 
			                            value={this.state.diet_type}
				                          onChange={this.handleChangeDiet}
				                          onBlur = {this.handleOnBlurDiet} >	                      
			                            </Input>
			                        </div>
							</FormGroup>	

				</Collapse>
			</div>
		);
	}
}