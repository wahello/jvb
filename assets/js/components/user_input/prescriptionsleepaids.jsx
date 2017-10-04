import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class PrescriptionSleepAids extends Component{

	constructor(props){
		super(props);
		const sleep_aid_taken = this.props.sleep_aid_taken;
		this.state = {
			modal:true,
			sleep_aid_taken:sleep_aid_taken,
		}

		this.modalToggle = this.modalToggle.bind(this);
		this.handleChangePrescriptionSleep = this.handleChangePrescriptionSleep.bind(this);
		this.onModalSubmit = this.onModalSubmit.bind(this);

	}

	handleChangePrescriptionSleep(event){
		const value = event.target.value;
		this.setState({
			sleep_aid_taken:value
		});
	}

	modalToggle(){
		this.setState({
			modal:!this.state.modal
		});
	}

	onModalSubmit(){
		this.props.updateState(this.state.sleep_aid_taken);
		this.modalToggle();
	}

	render(){
		return(
			<div>
				<Modal isOpen={this.state.modal} toggle={this.modalToggle}>
					<ModalBody>
							<FormGroup>
								<h5>Hi, What did you take?</h5>
								<Input 
	                            type="FormText" 
	                            className="form-control" 
	                            value={this.state.sleep_aid_taken}
	                          onChange={this.handleChangePrescriptionSleep} >
	                           
	                            </Input>
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