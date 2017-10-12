import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class UnprocesedFoodModal extends Component{

	constructor(props){
		super(props);
		const unprocessed_food_list = this.props.unprocessed_food_list;
		this.state = {
			modal:true,
			unprocessed_food_list:unprocessed_food_list
		};
		this.modalToggle = this.modalToggle.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onModalSubmit = this.onModalSubmit.bind(this);

	}

	handleChange(event){
		const value = event.target.value;
	    this.setState({
	    	unprocessed_food_list: value,
	    });
	}

	modalToggle(){
		this.setState({
			modal:!this.state.modal
		});
	}

	onModalSubmit(){
		this.props.updateState(this.state.unprocessed_food_list);
		this.modalToggle();
	}

	render(){
		return(
			<div>
				<Modal isOpen={this.state.modal} toggle={this.modalToggle}>
					<ModalBody>
						<FormGroup>   
                            <Label>What unprocessed food were consumed?</Label>
                            <Input 
	                            type="textarea" 
	                            className="custom-select form-control" 
	                            value={this.state.unprocessed_food_list}
	                            onChange={this.handleChange}
	                            placeholder="dairy,cheese,pasta,bread,white rice,etc..." /> 
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