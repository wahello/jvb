import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class SickModal extends Component{

	constructor(props){
		super(props);
		const sickness = this.props.sickness;
		this.state = {
			modal:true,
			sickness:sickness,
		};
		this.modalToggle = this.modalToggle.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onModalSubmit = this.onModalSubmit.bind(this);

	}

	handleChange(event){
		const value = event.target.value;
	    this.setState({
	    	sickness: value,
	    });
	}

	modalToggle(){
		this.setState({
			modal:!this.state.modal
		});
	}

	onModalSubmit(){
		this.props.updateState(this.state.sickness);
		this.modalToggle();
	}

	render(){
		return(
			<div>
				<Modal isOpen={this.state.modal} toggle={this.modalToggle}>
					<ModalBody>
						<FormGroup>   
                            <Label>Please tell us your illness</Label>
                            <Input 
	                            type="textarea" 
	                            className="custom-select form-control" 
	                            value={this.state.sickness}
	                            onChange={this.handleChange}
	                            placeholder="cold, since 1 week..." /> 
                          </FormGroup> 
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