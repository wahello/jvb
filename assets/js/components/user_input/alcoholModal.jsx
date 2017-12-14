import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Collapse} from 'reactstrap';
import Textarea from 'react-textarea-autosize';

export default class AlcoholModal extends Component{

	constructor(props){
		super(props);
		const alcohol_drink_consumed_list = this.props.alcohol_drink_consumed_list;
		this.state = {
			collapse:true,
			alcohol_drink_consumed_list:alcohol_drink_consumed_list
		};
		
		this.handleChange = this.handleChange.bind(this);
		
	}

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.alcohol_drink_consumed_list !== this.props.alcohol_drink_consumed_list) {
    	  	this.setState({
    	  		alcohol_drink_consumed_list:nextProps.alcohol_drink_consumed_list
    	  	});
    	}
  	}

	handleChange(event){
		const value = event.target.value;
	    this.setState({
	    	alcohol_drink_consumed_list: value,
	    },()=>{
	    	this.props.updateState(this.state.alcohol_drink_consumed_list)
	    });
	}



	render(){
		return(
			<div>
				<Collapse isOpen={this.state.collapse}>				
						<FormGroup>   
                            <Label className="LAbel">6.1 What Did You Drink (Optional)?</Label>

                            	{this.props.editable &&
									<div className="input1">
			                            <Textarea 
			                            	id="placeholder"				                            
				                            className="form-control" 
				                            value={this.state.alcohol_drink_consumed_list}
				                            rows="5" cols="5"
				                            onChange={this.handleChange}
				                            placeholder="Write in ..." ></Textarea>
			                        </div> 
			                    }
			                    {
	                              !this.props.editable &&
	                              <div className="input">
	                                <p >{this.state.alcohol_drink_consumed_list}</p>
	                              </div>
	                            }
                          </FormGroup> 			
				</Collapse>
			</div>
		);
	}
}