import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class SickModal extends Component{

	constructor(props){
		super(props);
		const sickness = this.props.sickness;
		this.state = {
			collapse:true,
			sickness:sickness
		};
		
		this.handleChange = this.handleChange.bind(this);
		
	}

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.sickness !== this.props.sickness) {
    	  	this.setState({
    	  		sickness:nextProps.sickness
    	  	});
    	}
  	}

	handleChange(event){
		const value = event.target.value;
	    this.setState({
	    	sickness: value,
	    },()=>{
	    	this.props.updateState(this.state.sickness);
	    });
	}

	
	render(){
		return(
			<div>
					<Collapse isOpen={this.state.collapse}>
						<FormGroup>   
                            <Label>10.1 Please Tell Us Your Illness</Label>

                              {this.props.editable &&
	                           	  <div className="input1">
		                            <Input 
			                            type="textarea" 
			                            className="form-control" 
			                            value={this.state.sickness}
			                            rows="5" cols="5"
			                            onChange={this.handleChange}
			                            placeholder="cold, since 1 week..." /> 
			                      </div>
			                   }
			                   {
	                              !this.props.editable &&
	                              <div className="input">
	                                <p>{this.state.sickness}</p>
	                              </div>
	                           }
                          </FormGroup> 
					</Collapse>
			</div>
		);
	}
}