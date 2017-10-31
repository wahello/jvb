import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';
import Textarea from 'react-textarea-autosize';

export default class PrescriptionMedication extends Component{

	constructor(props){
		super(props);
		const medications_taken_list = this.props.medications_taken_list;
		this.state = {			
			medications_taken_list:medications_taken_list,
			collapse:true
		}

		this.handleChangeMedications = this.handleChangeMedications.bind(this);	

	}

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.medications_taken_list !== this.props.medications_taken_list) {
    	  	this.setState({
    	  		medications_taken_list:nextProps.medications_taken_list
    	  	});
    	}
  	}


	handleChangeMedications(event){
		const value = event.target.value;
		this.setState({
			medications_taken_list:value
		},()=>{
			this.props.updateState(this.state.medications_taken_list);
		});
	}

	
	render(){
		return(
			<div>
				
					<Collapse isOpen={this.state.collapse}>
							<FormGroup>
								<Label>8.1 What Did You Take?</Label>
									{this.props.editable &&
										<div className="input1">
											<Textarea 				                           
				                            className="form-control" 
				                            value={this.state.medications_taken_list}
				                            rows="5" cols="5"
				                          onChange={this.handleChangeMedications}>	</Textarea>		                           
				                           
				                        </div>
				                    }
				                    {
	                                  !this.props.editable &&
	                                  <div className="input">
	                                    <p style={{width:"600px",padding:"0px 30px 0px 0px"}}>{this.state.medications_taken_list}</p>
	                                  </div>
	                                }    
							</FormGroup>
					</Collapse>
					
			</div>
		);
	}
}