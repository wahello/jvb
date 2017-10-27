import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Collapse} from 'reactstrap';

export default class UnprocesedFoodModal extends Component{

	constructor(props){
		super(props);
		const unprocessed_food_list = this.props.unprocessed_food_list;
		this.state = {
			collapse:true,
			unprocessed_food_list:unprocessed_food_list
		};
		
		this.handleChange = this.handleChange.bind(this);
		
	}

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.unprocessed_food_list !== this.props.unprocessed_food_list) {
    	  	this.setState({
    	  		unprocessed_food_list:nextProps.unprocessed_food_list
    	  	});
    	}
  	}

	handleChange(event){
		const value = event.target.value;
	    this.setState({
	    	unprocessed_food_list: value,
	    },()=>{
	    	this.props.updateState(this.state.unprocessed_food_list)
	    });
	}



	render(){
		return(
			<div>
				<Collapse isOpen={this.state.collapse}>				
						<FormGroup>   
                            <Label>5.1 What Unprocessed Food Were Consumed?</Label>

                            	{this.props.editable &&
									<div className="input1">
			                            <Input 
				                            type="textarea" 
				                            className="form-control" 
				                            value={this.state.unprocessed_food_list}
				                            rows="5" cols="5"
				                            onChange={this.handleChange}
				                            placeholder="dairy,cheese,pasta,bread,white rice,etc..." />
			                        </div> 
			                    }
			                    {
	                              !this.props.editable &&
	                              <div className="input">
	                                <p>{this.state.unprocessed_food_list}</p>
	                              </div>
	                            }
                          </FormGroup> 			
				</Collapse>
			</div>
		);
	}
}