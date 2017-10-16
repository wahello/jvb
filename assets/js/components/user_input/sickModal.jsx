import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class SickModal extends Component{

	constructor(props){
		super(props);
		const sickness = this.props.sickness;
		this.state = {
			collapse:true,
			sickness:sickness
		};
		
		this.handleChange = this.handleChange.bind(this);
		
	}

	handleChange(event){
		const value = event.target.value;
	    this.setState({
	    	sickness: value,
	    },()=>{
	    	this.props.updateState(this.state.sickness);
	    });
	}

	
	render(){
		return(
			<div>
				
					<Collapse isOpen={this.state.collapse}>
						<FormGroup>   
                            <Label>20.1) Please Tell Us Your Illness</Label>
                            <Input 
	                            type="textarea" 
	                            className="custom-select form-control" 
	                            value={this.state.sickness}
	                            onChange={this.handleChange}
	                            placeholder="cold, since 1 week..." /> 
                          </FormGroup> 
					</Collapse>
			</div>
		);
	}
}