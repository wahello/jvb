import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Collapse} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
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

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.diet_type !== this.props.diet_type) {

    	  	this.setState({
    	  		diet_type:nextProps.diet_type,
				collapse:nextProps.diet_type !== '' ? true : false,	
    	  	});
    	}
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
							    <Label>13.1 What Did You Take?</Label>
							    	{ this.props.editable &&
								    	<div className="input1">
											<Textarea				                          
				                            className="form-control" 
				                            value={this.state.diet_type}
					                          onChange={this.handleChangeDiet}
					                          onBlur = {this.handleOnBlurDiet} />	                      
				                           
				                        </div>
			                    	}
			                    	{
	                                  !this.props.editable &&
	                                  <div className="input">
	                                    <p>{this.state.diet_type}</p>
	                                  </div>
	                                }
							</FormGroup>	

				</Collapse>
			</div>
		);
	}
}