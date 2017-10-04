import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class PrescriptionMedication extends Component{

	constructor(props){
		super(props);
		const medications_taken_list = this.props.medications_taken_list;
		this.state = {
			modal:true,
			medications_taken_list:medications_taken_list,
		}

		this.modalToggle = this.modalToggle.bind(this);
		this.handleChangeMedications = this.handleChangeMedications.bind(this);
		this.onModalSubmit = this.onModalSubmit.bind(this);

	}

	handleChangeMedications(event){
		const value = event.target.value;
		this.setState({
			medications_taken_list:value
		});
	}

	modalToggle(){
		this.setState({
			modal:!this.state.modal
		});
	}

	onModalSubmit(){
		this.props.updateState(this.state.medications_taken_list);
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
	                            value={this.state.medications_taken_list}
	                          onChange={this.handleChangeMedications} >
	                           
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