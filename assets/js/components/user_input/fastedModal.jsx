import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class FastedModal extends Component{

	constructor(props){
		super(props);
		const food_ate_before_workout = this.props.food_ate_before_workout;
		this.state = {
			modal:true,
			food_ate_before_workout:food_ate_before_workout,
		};
		this.modalToggle = this.modalToggle.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onModalSubmit = this.onModalSubmit.bind(this);

	}

	handleChange(event){
		const value = event.target.value;
	    this.setState({
	    	food_ate_before_workout: value,
	    });
	}

	modalToggle(){
		this.setState({
			modal:!this.state.modal
		});
	}

	onModalSubmit(){
		this.props.updateState(this.state.food_ate_before_workout);
		this.modalToggle();
	}

	render(){
		return(
			<div>
				<Modal isOpen={this.state.modal} toggle={this.modalToggle}>
					<ModalBody>
						<FormGroup>   
                            <Label>What food eaten before workout?</Label>
                            <Input 
	                            type="textarea" 
	                            className="custom-select form-control" 
	                            value={this.state.food_ate_before_workout}
	                            onChange={this.handleChange}
	                            placeholder="Apple, riceballs..." /> 
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