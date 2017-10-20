import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

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
								<Label>18.1 Hi, What Did You Take?</Label>
									<div className="input1">
										<Input 
			                            type="FormText" 
			                            className="form-control" 
			                            value={this.state.medications_taken_list}
			                          onChange={this.handleChangeMedications} >			                           
			                            </Input>
			                        </div>    
							</FormGroup>
					</Collapse>
					
			</div>
		);
	}
}