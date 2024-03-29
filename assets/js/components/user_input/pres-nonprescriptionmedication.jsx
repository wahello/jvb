import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';
import Textarea from 'react-textarea-autosize';

export default class PrescriptionMedication extends Component{

	constructor(props){
		super(props);
		const medications_taken_list = this.props.medications_taken_list;
		const controlled_uncontrolled_substance = this.props.controlled_uncontrolled_substance;
		this.state = {			
			medications_taken_list:medications_taken_list,
			collapse:true,
			controlled_uncontrolled_substance:controlled_uncontrolled_substance
		}

		this.handleChangeMedications = this.handleChangeMedications.bind(this);
		this.handleChange=this.handleChange.bind(this);	

	}

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.medications_taken_list !== this.props.medications_taken_list || 
  	  	nextProps.controlled_uncontrolled_substance !== this.props.controlled_uncontrolled_substance) {
    	  	this.setState({
    	  		medications_taken_list:nextProps.medications_taken_list,
    	  		controlled_uncontrolled_substance:nextProps.controlled_uncontrolled_substance
    	  	});
    	}
  	}


	handleChangeMedications(event){
		const value = event.target.value;
		this.setState({
			medications_taken_list:value
		},()=>{
			this.props.updateStateMedication(this.state.medications_taken_list);
		});
	}

	 handleChange(event){
	  const value = event.target.value;
	  if(value === 'yes'){
		  this.setState({
			controlled_uncontrolled_substance: value
		  },()=>{
		  	this.props.updateStateCtrlSubs(this.state.controlled_uncontrolled_substance);
		  });
	   }
	   else{
   			this.setState({
					controlled_uncontrolled_substance: value,
					medications_taken_list:''
			  	},()=>{
			  	this.props.updateStateCtrlSubs(this.state.controlled_uncontrolled_substance);
		  	});
	   }
}
	
	render(){
		return(
			<div>
				
					<Collapse isOpen={this.state.collapse}>
	
					<FormGroup>
								{(this.props.report_type == 'full') &&
								<Label className="LAbel">8.1 What Did You Take?</Label>}
									{((this.props.editable) &&  (this.props.report_type == 'full')) &&
										<div className="input1">
											<Textarea
											id="placeholder" 				                           
				                            className="form-control" 
				                            name="medications_taken_list"
				                            value={this.state.medications_taken_list}
				                            rows="5" cols="5"
				                          onChange={this.handleChangeMedications}>	</Textarea>		                           
				                           
				                        </div>
				                    }
				                    {
	                                  (!this.props.editable && this.props.report_type == 'full') && 
	                                  <div className="input">
	                                    <p >{this.state.medications_taken_list}</p>
	                                  </div>
	                                }    
							</FormGroup>
					
					<FormGroup check>

					<Label className="LAbel">8.2 Did you take a controlled or uncontrolled 
					substance today (marijuana is not considered either)</Label>				
					{this.props.editable &&
						<div className="work_hard">
							<Label check className="btn  radio1">
								<Input type="radio" name="controlled_uncontrolled_substance"
									value="yes"
									id="controlled_yes"
								 	checked={this.state.controlled_uncontrolled_substance === 'yes'}
								 	onChange={this.handleChange}/> &nbsp;
								Yes
							</Label>
							&nbsp;
							<Label check className="btn  radio1">
								<Input type="radio" name="controlled_uncontrolled_substance" 
									value="no"
									id="controlled_no"
									checked={this.state.controlled_uncontrolled_substance === 'no'}
									onChange={this.handleChange}/> &nbsp;
								No
							</Label>
							<Label check className="btn radio1">
								<Input type="radio" name="controlled_uncontrolled_substance" 
									value="decline"
									id="controlled_decline"
									checked={this.state.controlled_uncontrolled_substance === 'decline'}
									onChange={this.handleChange}/> &nbsp;
								I Decline to Answer This Question
							</Label>
						</div>
					}
					{
                      !this.props.editable &&
                      <div className="input">
                        <p>
	                        {this.state.controlled_uncontrolled_substance === 'decline' ?
	                    	"I Decline to Answer This Question" : this.state.controlled_uncontrolled_substance}
                    	</p>
                      </div>
                    }

				</FormGroup>				
				</Collapse>

			</div>
		);
	}
}