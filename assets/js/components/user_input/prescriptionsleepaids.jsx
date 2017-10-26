import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Collapse} from 'reactstrap';

export default class PrescriptionSleepAids extends Component{

	constructor(props){
		super(props);
		const sleep_aid_taken = this.props.sleep_aid_taken;
		this.state = {
			sleep_aid_taken:sleep_aid_taken,
			collapse:true
		}
		this.handleChangePrescriptionSleep = this.handleChangePrescriptionSleep.bind(this);
	}

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.sleep_aid_taken !== this.props.sleep_aid_taken) {
    	  	this.setState({
    	  		sleep_aid_taken:nextProps.sleep_aid_taken
    	  	});
    	}
  	}
  	
	handleChangePrescriptionSleep(event){
		const value = event.target.value;
		this.setState({
			sleep_aid_taken:value
		},()=>{
			this.props.updateState(this.state.sleep_aid_taken);
		});
	}
	

	render(){
		return(
			<div>
				
					<Collapse isOpen={this.state.collapse}>
							<FormGroup>
							<Label>4.1 What Did You Take?</Label>
							  {this.props.editable &&
								  <div className="input1">
									<Input 
		                            type="textarea" 
		                            className="form-control"
		                            rows="5" cols="5" 
		                            value={this.state.sleep_aid_taken}
		                          onChange={this.handleChangePrescriptionSleep} >	                           
		                            </Input>
		                          </div>
		                       }
		                       {
	                              !this.props.editable &&
	                              <div className="input">
	                                <p>{this.state.sleep_aid_taken}</p>
	                              </div>
	                           }
							</FormGroup>
					</Collapse>
					
			</div>
		);
	}
}