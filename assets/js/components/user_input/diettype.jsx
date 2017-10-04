import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class DietType extends Component{

	constructor(props){
		super(props);
		const diet_type = this.props.diet_type;
		this.state = {
			modal:true,
			diet_type:diet_type,
		}

		this.modalToggle = this.modalToggle.bind(this);
		this.handleChangeDiet = this.handleChangeDiet.bind(this);
		this.onModalSubmit = this.onModalSubmit.bind(this);

	}

	handleChangeDiet(event){
		const value = event.target.value;
		this.setState({
			diet_type:value
		});
	}

	modalToggle(){
		this.setState({
			modal:!this.state.modal
		});
	}

	onModalSubmit(){
		this.props.updateState(this.state.diet_type);
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
	                            value={this.state.diet_type}
	                          onChange={this.handleChangeDiet} >
	                           
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