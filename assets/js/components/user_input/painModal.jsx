import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class PainModal extends Component{

	constructor(props){
		super(props);
		const area = this.props.pain_area;
		this.state = {
			modal:true,
			pain_area:area,
			collapse:false
		};
		this.modalToggle = this.modalToggle.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onModalSubmit = this.onModalSubmit.bind(this);

	}

	handleChange(event){
		const value = event.target.value;
		if (value === 'other'){
		    this.setState({
		    	pain_area: value,
		    	collapse:true
		    });
		}else{
			this.setState({
		    	pain_area: value,
		    });
		}
	}

	modalToggle(){
		this.setState({
			modal:!this.state.modal
		});
	}

	onModalSubmit(){
		this.props.updateState(this.state.pain_area);
		this.modalToggle();
	}

	render(){
		return(
			<div>
				<Modal isOpen={this.state.modal} toggle={this.modalToggle}>
					<ModalBody>
						<FormGroup>   
                            <Label>Where Did You Have Pain/Twinges?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            value={this.state.pain_area}
                            onChange={this.handleChange}>
                                <option value="select">select</option>
                                <option value="right knee">Right knee</option>
                                <option value="left knee">Light knee</option>
                                <option value="right ankle">Right ankle</option>
                                <option value="left ankle">Left ankle</option>
                                <option value="right foot">Right foot</option>
                                <option value="left foot">Left foot</option>
                                <option value="right shins">Right shins</option>
                                <option value="left shins">Left shins</option>
                                <option value="right hip">Right hip</option>
                                <option value="left hip">Left hip</option>
                                <option value="right achilles">Right achilles</option>
                                <option value="left achilles">Left achilles</option>
                                <option value="right calf">Right calf</option>
                                <option value="left calf">Left calf</option>
                                <option value="right toes">Right toes</option>
                                <option value="left toes">Left toes</option>
                                <option value="neck">Neck</option>
                                <option value="upper back">Upper back</option>
                                <option value="mid back">Mid back</option>
                                <option value="lower back">Lower back</option>
                                <option value="other">Other</option>
                            </Input>  
                          </FormGroup> 

						<Collapse isOpen={this.state.collapse}>
							<FormGroup>
								<Label>Please write where you have pain/twinges</Label>
								<Input 
	                            type="textarea" 
	                            className="form-control" 
	                            rows="5" columns="5"
	                            value={this.state.pain_area}
	                            onChange={this.handleChange} />
							</FormGroup>
						</Collapse>

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